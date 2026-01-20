import React, { Dispatch, SetStateAction, useLayoutEffect, useRef, useState } from "react";
import { MemberChildsTemplate } from "../Types";
import Card from "./card";

type TreeBranchProps = {
  node: MemberChildsTemplate;
  cardWidth: string;
  cardHeight: string;
  registerNodeRef?: (el: HTMLDivElement | null) => void;
  functionClose: Dispatch<SetStateAction<boolean>>
  memberSelect: Dispatch<SetStateAction<number>>
};

type Pt = { x: number; y: number };
type Seg = { a: Pt; b: Pt };

export default function TreeBranch({ node, cardWidth, cardHeight, registerNodeRef, functionClose, memberSelect }: TreeBranchProps) {
  const branchRef = useRef<HTMLDivElement | null>(null);
  const myCardRef = useRef<HTMLDivElement | null>(null);
  const [svgSize, setSvgSize] = useState({ w: 0, h: 0 });
  const childCardRefs = useRef(new Map<number, HTMLDivElement>());
  const roRef = useRef<ResizeObserver | null>(null);

  const [segments, setSegments] = useState<Seg[]>([]);

  const recompute = () => {
    const branchEl = branchRef.current;
    const parentCardEl = myCardRef.current;

    if (!branchEl || !parentCardEl || node.children.length === 0) {
      setSegments([]);
      return;
    }

    const b = branchEl.getBoundingClientRect();
    const p = parentCardEl.getBoundingClientRect();

    const parentBottom: Pt = {
      x: p.left - b.left + p.width / 2,
      y: p.bottom - b.top,
    };

    const childTops: Pt[] = node.children
      .map((c) => childCardRefs.current.get(c.id))
      .filter((el): el is HTMLDivElement => Boolean(el))
      .map((el) => {
        const r = el.getBoundingClientRect();
        return {
          x: r.left - b.left + r.width / 2,
          y: r.top - b.top,
        };
      });

    if (childTops.length === 0) {
      setSegments([]);
      return;
    }

    // Middle Y between parent bottom and the top of the highest child card
    const minChildY = Math.min(...childTops.map((pt) => pt.y));
    const midY = (parentBottom.y + minChildY) / 2;

    const minX = Math.min(...childTops.map((pt) => pt.x));
    const maxX = Math.max(...childTops.map((pt) => pt.x));

    const newSegs: Seg[] = [
      { a: parentBottom, b: { x: parentBottom.x, y: midY } },     // down from parent
      { a: { x: minX, y: midY }, b: { x: maxX, y: midY } },       // sibling bar
      ...childTops.map((ct) => ({ a: { x: ct.x, y: midY }, b: ct })), // down to each child
    ];
	setSvgSize({ w: Math.round(b.width), h: Math.round(b.height) });
    setSegments(newSegs);
  };

  // parent collects my card ref
  useLayoutEffect(() => {
    registerNodeRef?.(myCardRef.current);
    return () => registerNodeRef?.(null);
  }, [registerNodeRef]);

  const setChildCardRef = (id: number) => (el: HTMLDivElement | null) => {
    const ro = roRef.current;

    const prev = childCardRefs.current.get(id);
    if (prev && ro) ro.unobserve(prev);

    if (!el) {
      childCardRefs.current.delete(id);
      requestAnimationFrame(recompute);
      return;
    }

    childCardRefs.current.set(id, el);
    if (ro) ro.observe(el);

    // important: recompute AFTER DOM is laid out
    requestAnimationFrame(recompute);
  };

  useLayoutEffect(() => {
    recompute();

    const ro = new ResizeObserver(() => recompute());
    roRef.current = ro;

    if (branchRef.current) ro.observe(branchRef.current);
    if (myCardRef.current) ro.observe(myCardRef.current);

    // observe already-known children (rare but safe)
    childCardRefs.current.forEach((el) => ro.observe(el));

    const onScroll = () => recompute();
    window.addEventListener("resize", recompute);
    window.addEventListener("scroll", onScroll, true);

    return () => {
      ro.disconnect();
      roRef.current = null;
      window.removeEventListener("resize", recompute);
      window.removeEventListener("scroll", onScroll, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [node.children.length]);

  return (
    <div ref={branchRef} style={style.branch}>
      {/* SVG overlay uses 100% size so it always matches the branch */}
      {segments.length > 0 && svgSize.w > 0 && svgSize.h > 0 && (
		<svg
			width={svgSize.w}
			height={svgSize.h}
			viewBox={`0 0 ${svgSize.w} ${svgSize.h}`}
			preserveAspectRatio="none"
			style={style.svg}
		>
			{segments.map((s, i) => (
			<line
				key={i}
				x1={s.a.x}
				y1={s.a.y}
				x2={s.b.x}
				y2={s.b.y}
				stroke="black"
				strokeWidth={2}
				strokeLinecap="round"
			/>
			))}
		</svg>
		)}

      <div ref={myCardRef} style={style.node}>
        <Card {...node.data} cardWidth={cardWidth} cardHeight={cardHeight} functionClose={functionClose} memberSelect={memberSelect}/>
      </div>

      {node.children.length > 0 && (
        <div style={style.childrenWrapper}>
          {node.children.map((child) => (
            <TreeBranch
              key={child.id}
              node={child}
              cardWidth={cardWidth}
              cardHeight={cardHeight}
              registerNodeRef={setChildCardRef(child.id)}
              functionClose={functionClose}
              memberSelect={memberSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const style: Record<string, React.CSSProperties> = {
  branch: {
    position: "relative",
    display: "inline-flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "8px",
  },
  svg: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    zIndex: 0,
  },
  node: {
    position: "relative",
    zIndex: 1,
    marginBottom: "18px",
  },
  childrenWrapper: {
    position: "relative",
    zIndex: 1,
    display: "flex",
    justifyContent: "center",
    gap: "24px",
    alignItems: "flex-start",
  },
};