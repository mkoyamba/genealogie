import React, { useLayoutEffect, useRef, useState } from "react";
import Card from "./card";
import { UnionNode } from "../Types";

const LINE_THICKNESS = 4;

type Props = {
  node: UnionNode;
  cardWidth: string;
  cardHeight: string;

  // Le parent récupère l’ancre "haut" de CETTE union-enfant (sur la carte du descendant)
  registerTopAnchorRef?: (el: HTMLDivElement | null) => void;
};

type Pt = { x: number; y: number };
type Seg = { a: Pt; b: Pt };

export default function UnionBranch({
  node,
  cardWidth,
  cardHeight,
  registerTopAnchorRef,
}: Props) {
  const isCouple = node.partners.length === 2;
  const branchRef = useRef<HTMLDivElement | null>(null);

  // Wraps des cartes partenaires (pour ancrages)
  const partnersRowRef = useRef<HTMLDivElement | null>(null);
  const leftCardWrapRef = useRef<HTMLDivElement | null>(null);
  const rightCardWrapRef = useRef<HTMLDivElement | null>(null);
  const coupleLinkRef = useRef<HTMLDivElement | null>(null);

  // Pour les enfants: on stocke des refs vers leur "ancre top" (carte du descendant)
  const childTopRefs = useRef(new Map<string, HTMLDivElement>());

  const [segments, setSegments] = useState<Seg[]>([]);
  const [svgSize, setSvgSize] = useState({ w: 1, h: 1 });

  const snap = (n: number) => Math.round(n);

  // IMPORTANT: l'ancre que ce composant donne à son parent = la carte du descendant (gauche)
  useLayoutEffect(() => {
    registerTopAnchorRef?.(leftCardWrapRef.current);
    return () => registerTopAnchorRef?.(null);
  }, [registerTopAnchorRef]);

  const setChildTopRef = (key: string) => (el: HTMLDivElement | null) => {
    if (!el) childTopRefs.current.delete(key);
    else childTopRefs.current.set(key, el);
    requestAnimationFrame(recompute);
  };

  const recompute = () => {
    const branchEl = branchRef.current;
    if (!branchEl) return;

    const b = branchEl.getBoundingClientRect();
    const bw = Math.max(1, snap(b.width));
    const bh = Math.max(1, snap(b.height));
    setSvgSize({ w: bw, h: bh });

    if (node.children.length === 0) {
      setSegments([]);
      return;
    }

    const row = partnersRowRef.current?.getBoundingClientRect();
    const left = leftCardWrapRef.current?.getBoundingClientRect();
    const right = rightCardWrapRef.current?.getBoundingClientRect();
    const link = coupleLinkRef.current?.getBoundingClientRect();

    if (!left) {
      setSegments([]);
      return;
    }

    // --- ancre parent (bas de l'union) ---
    // x: centre du coupleLink si couple, sinon centre de la carte gauche
    // y: point descendu RESPONSIVE à partir du coupleLink vers le bas de la rangée partenaires
    let parentBottom: Pt;

    if (isCouple && row && link) {
      const x = link.left - b.left + link.width / 2;

      const linkBottom = link.bottom - b.top;
      const rowBottom = row.bottom - b.top;

      // Ratio responsive (0=au trait, 1=au bas de la rangée)
      // Ajuste si besoin: 0.5 / 0.6 / 0.7
      const t = 0;

      const y = linkBottom + (rowBottom - linkBottom) * t;

      parentBottom = { x: snap(x), y: snap(y) };
    } else {
      // Single (ou fallback): centre bas de la carte gauche
      parentBottom = {
        x: snap(left.left - b.left + left.width / 2),
        y: snap(left.bottom - b.top),
      };
    }

    // --- ancres enfants (haut de leur carte descendant) ---
    const childTops: Pt[] = node.children
      .map((c) => childTopRefs.current.get(c.key))
      .filter((el): el is HTMLDivElement => Boolean(el))
      .map((el) => {
        const r = el.getBoundingClientRect();
        return {
          x: snap(r.left - b.left + r.width / 2),
          y: snap(r.top - b.top),
        };
      });

    if (childTops.length === 0) {
      setSegments([]);
      return;
    }

    // --- Y de séparation (barre horizontale) ---
    const minChildY = Math.min(...childTops.map((pt) => pt.y));
    const span = minChildY - parentBottom.y;

    // ratio responsive (0 = pas de descente, 1 = jusqu'aux enfants)
    const BAR_SHIFT_RATIO = 0.45; // ajuste: 0.15 / 0.2 / 0.25

    let midY = snap(
      parentBottom.y + span * (0.5 + BAR_SHIFT_RATIO)
    );

    // Empêcher la barre de passer dans les cartes (responsive) :
    // au moins sous le bas de la rangée partenaires
    if (row) {
      const rowBottom = snap(row.bottom - b.top);
      midY = snap(Math.max(midY, rowBottom));
    } else {
      // fallback si row absent: sous le bas des cartes du couple
      const bottoms: number[] = [];
      bottoms.push(left.bottom - b.top);
      if (right) bottoms.push(right.bottom - b.top);
      const rowBottomFallback = snap(Math.max(...bottoms));
      midY = snap(Math.max(midY, rowBottomFallback));
    }

    const minX = Math.min(...childTops.map((pt) => pt.x));
    const maxX = Math.max(...childTops.map((pt) => pt.x));

    const newSegs: Seg[] = [];
    // parent -> mid (vertical)
    newSegs.push({ a: parentBottom, b: { x: parentBottom.x, y: midY } });

    // barre fratrie (horizontal)
    newSegs.push({ a: { x: minX, y: midY }, b: { x: maxX, y: midY } });

    // mid -> enfants (vertical)
    for (const ct of childTops) {
      newSegs.push({ a: { x: ct.x, y: midY }, b: ct });
    }

    setSegments(newSegs);
  };

  useLayoutEffect(() => {
    recompute();

    const ro = new ResizeObserver(() => recompute());
    if (branchRef.current) ro.observe(branchRef.current);
    if (partnersRowRef.current) ro.observe(partnersRowRef.current);
    if (leftCardWrapRef.current) ro.observe(leftCardWrapRef.current);
    if (rightCardWrapRef.current) ro.observe(rightCardWrapRef.current);
    if (coupleLinkRef.current) ro.observe(coupleLinkRef.current);
    childTopRefs.current.forEach((el) => ro.observe(el));

    const onScroll = () => recompute();
    window.addEventListener("resize", recompute);
    window.addEventListener("scroll", onScroll, true);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", recompute);
      window.removeEventListener("scroll", onScroll, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [node.children.length]);

  return (
    <div ref={branchRef} style={style.branch}>
      {/* SVG toujours présent (évite deadlock) */}
      <svg
        viewBox={`0 0 ${svgSize.w} ${svgSize.h}`}
        preserveAspectRatio="none"
        style={style.svg}
      >
        {/* debug: décommente si besoin */}
        {/* <rect x="0" y="0" width="100%" height="100%" fill="none" stroke="red" /> */}

        {segments.map((s, i) => (
          <line
            key={i}
            x1={s.a.x}
            y1={s.a.y}
            x2={s.b.x}
            y2={s.b.y}
            stroke="black"
            strokeWidth={LINE_THICKNESS/2}
            strokeLinecap="round"
          />
        ))}
      </svg>

      {/* contenu au-dessus du SVG */}
      <div style={style.content}>
        <div ref={partnersRowRef} style={style.partnersRow}>
          <div ref={leftCardWrapRef} style={style.cardWrap}>
            <Card {...node.partners[0]} cardWidth={cardWidth} cardHeight={cardHeight} />
          </div>

          {isCouple && (
            <>
              <div ref={coupleLinkRef} style={style.coupleLink} />
              <div ref={rightCardWrapRef} style={style.cardWrap}>
                <Card {...node.partners[1]} cardWidth={cardWidth} cardHeight={cardHeight} />
              </div>
            </>
          )}
        </div>

        {node.children.length > 0 && (
          <div style={style.childrenRow}>
            {node.children.map((child) => (
              <UnionBranch
                key={child.key}
                node={child}
                cardWidth={cardWidth}
                cardHeight={cardHeight}
                registerTopAnchorRef={setChildTopRef(child.key)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const style: Record<string, React.CSSProperties> = {
  branch: {
    position: "relative",
    display: "inline-flex",
    flexDirection: "column",
    alignItems: "center",
  },
  svg: {
    position: "absolute",
    left: 0,
    top: 0,
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    zIndex: 0,
  },
  content: {
    position: "relative",
    zIndex: 1,
    padding: "8px",
    display: "inline-flex",
    flexDirection: "column",
    alignItems: "center",
  },
  partnersRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    marginBottom: "18px",
  },
  cardWrap: {
    position: "relative",
  },
  coupleLink: {
    display: "block",
    width: "40px",
    height: `${LINE_THICKNESS}px`,
    background: "black",
  },
  childrenRow: {
    display: "flex",
    justifyContent: "center",
    gap: "24px",
    alignItems: "flex-start",
  },
};