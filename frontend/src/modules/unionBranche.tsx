import React, { Dispatch, SetStateAction, useLayoutEffect, useRef, useState } from "react";
import Card from "./card";
import { UnionNode } from "../Types";

const LINE_THICKNESS = '4px';

type Props = {
  node: UnionNode;
  cardWidth: string;
  cardHeight: string;
  siblingUnionCount?: number;
  registerTopAnchorRef?: (el: HTMLDivElement | null) => void;
  functionClose: Dispatch<SetStateAction<boolean>>;
  memberSelect: Dispatch<SetStateAction<number>>;
};

type Pt = { x: number; y: number };
type Seg = { a: Pt; b: Pt, type: string };

const segs: Seg[] = [];

const toLocalPoint = (rect: DOMRect | undefined, containerRect: DOMRect) => {
  if (!rect)
    return {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      centerX: 0,
      centerY: 0,
  }
  return {
    left: rect.left - containerRect.left,
    right: rect.right - containerRect.left,
    top: rect.top - containerRect.top,
    bottom: rect.bottom - containerRect.top,
    centerX: rect.left - containerRect.left + rect.width / 2,
    centerY: rect.top - containerRect.top + rect.height / 2,
  };
};

function renderUnionSvg(segments: Seg[], width: number, height: number) {
  if (!segments.length) return null;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
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
          strokeDasharray={s.type === 'line' ? undefined : "6.4"}
        />
      ))}
    </svg>
  );
}

export default function UnionBranch({
    node,
    cardWidth,
    cardHeight,
    siblingUnionCount,
    registerTopAnchorRef,
    functionClose,
    memberSelect,
  }: Props) {

    const refs = useRef<Map<number, HTMLDivElement | null>>(new Map());
    const containerRef = useRef<HTMLDivElement | null>(null);

    const [segments, setSegments] = useState<Seg[]>([]);
    const [svgSize, setSvgSize] = useState({ w: 4, h: 4 });

    const setRef = (key: number) => (el: HTMLDivElement | null) => {
      if (el) {
        refs.current.set(key, el);
      } else {
        refs.current.delete(key);
      }
    };

    function getNodeMainPartner(node: UnionNode) {
      if (!node.partners[1] || !node.leftPartners || !node.leftPartners[0])
        return node.partners[0]
      else if (node.partners[0].id === node.leftPartners[0].duplicatedPartnerId)
        return node.partners[0]
      else
        return node.partners[1]
    }

    function getNodeSecondPartner(node: UnionNode) {
      if (!node.partners[1])
        return node.partners[0]
      else if (node.partners[0].id === getNodeMainPartner(node).id)
        return node.partners[1]
      else
        return node.partners[0]
    }

    const displayPartnerTree = (node: UnionNode, last: number) => {
      
      const visiblePartner = node.partners[0].id === node.duplicatedPartnerId ? node.partners[1] : node.partners[0];

      return (
        <div style={style.mainUnion}>
          <div style={{...style.partner, paddingRight: '20vw'}}>
            <div ref={setRef(visiblePartner.id)} style={style.cardContainer}>
              <Card
                {...visiblePartner}
                cardWidth={cardWidth}
                cardHeight={cardHeight}
                functionClose={functionClose}
                memberSelect={memberSelect}
              />
            </div>
          </div>
          <div style={style.children}>
                {node.children[0] ? node.children.map((child, index) => recursiveTree(child, index, false)) : null}
          </div>
        </div>
      )
    }

    const recursiveTree = (node: UnionNode, index : number, prime: boolean) => {
      const mainPartner = getNodeMainPartner(node)
      const orderedLeftPartners = [...(node.leftPartners ?? [])].reverse();
      const secondPartner = node.partners[1] ? node.partners[0].id === mainPartner.id ? node.partners[1] : node.partners[0] : undefined

      return (
        <div style={{ ...style.container, position: "relative", paddingLeft: index === 0 ? "" : "15vw"}}>
          {
            node.leftPartners
            ? orderedLeftPartners.map((node, index) => (
                <div style={style.leftPartners}>
                  {displayPartnerTree(node, index)}
                </div>
              ))
            : null
          }
          <div style={style.mainUnion}>
            <div style={style.couple}>
              <div style={{...style.partner, paddingRight: secondPartner ? '10vw' : '0vw'}}>
                    <div ref={setRef(mainPartner.id)} style={style.cardContainer}>
                      <Card
                        {...mainPartner}
                        cardWidth={cardWidth}
                        cardHeight={cardHeight}
                        functionClose={functionClose}
                        memberSelect={memberSelect}
                      />
                    </div>
                </div>
                {secondPartner && <div style={style.partner}>
                    <div ref={setRef(secondPartner.id)} style={style.cardContainer}>
                      <Card
                        {...secondPartner}
                        cardWidth={cardWidth}
                        cardHeight={cardHeight}
                        functionClose={functionClose}
                        memberSelect={memberSelect}
                      />
                    </div>
                </div>}
              </div>
              <div style={style.children}>
                {
                  node.children[0]
                  ? node.children.map((child, index) => (
                      <div>
                        {recursiveTree(child, index, false)}
                      </div>
                    ))
                  : null
                }
              </div>
          </div>
        </div>
      )
    }

    const buildSeg = (node: UnionNode, containerRect: DOMRect) => {
      const nextSegs: Seg[] = [];

      function getLineTopChildren (currentNode: UnionNode, topLevel: number) {
        if (!currentNode.children[0])
          return { a: { x: 0, y: 0,}, b: {x: 0, y: 0},type: "line" }
        const children = [...(currentNode).children].sort((a, b) => {
          const mainPartnerARef = refs.current.get(getNodeMainPartner(a).id)
          const mainPartnerBRef = refs.current.get(getNodeMainPartner(b).id)
          const mainPartnerARect = mainPartnerARef?.getBoundingClientRect()
          const mainPartnerBRect = mainPartnerBRef?.getBoundingClientRect()
          return (mainPartnerARect && mainPartnerBRect ? mainPartnerARect?.left - mainPartnerBRect.left : 0)
        })

        const leftChildRect = refs.current.get(getNodeMainPartner(children[0]).id)?.getBoundingClientRect()
        const rightChildRect = refs.current.get(getNodeMainPartner(children[children.length - 1]).id)?.getBoundingClientRect()

        const pointLeft : Pt = {
          x: toLocalPoint(leftChildRect, containerRect).centerX,
          y: topLevel
        }

        const pointRight : Pt = {
          x: toLocalPoint(rightChildRect, containerRect).centerX,
          y: topLevel
        }

        const segmentResult: Seg = {a: pointLeft, b: pointRight, type: 'line'}

        return segmentResult
      }
      
      function recursiveSegment(currentNode: UnionNode, prime: boolean, topLevel: number)  {
        //segment couple droite
        const mainPartnerRef = refs.current.get(getNodeMainPartner(currentNode).id)
        const mainPartnerRect = mainPartnerRef?.getBoundingClientRect()
        if (currentNode.key.startsWith('U')) {
          const secondPartnerRef = refs.current.get(getNodeSecondPartner(currentNode).id)
          const secondPartnerRect = secondPartnerRef?.getBoundingClientRect()
          const segmentCoupleDroite = {
            a: {
              x: toLocalPoint(mainPartnerRect, containerRect)?.right,
              y: toLocalPoint(mainPartnerRect, containerRect)?.centerY,
            },
            b: {
              x: toLocalPoint(secondPartnerRect, containerRect)?.left,
              y: toLocalPoint(secondPartnerRect, containerRect)?.centerY
            },
            type: "line"
          }
          nextSegs.push(segmentCoupleDroite)
          let segmentEnfantCoupleDroite = { a: { x: 0, y: 0,}, b: {x: 0, y: 0},type: "line" }
          if (currentNode.children[0]) {
            segmentEnfantCoupleDroite = {
              a: {
                x: ((segmentCoupleDroite.b.x - segmentCoupleDroite.a.x) / 2) + segmentCoupleDroite.a.x,
                y: segmentCoupleDroite.a.y
              },
              b: {
                x: ((segmentCoupleDroite.b.x - segmentCoupleDroite.a.x) / 2) + segmentCoupleDroite.a.x,
                y: segmentCoupleDroite.a.y + (mainPartnerRect?.height ? mainPartnerRect.height * 8/10 : 0)
              },
              type: 'line'
            }
          }
          if (segmentEnfantCoupleDroite.a.x !== 0)
            nextSegs.push(segmentEnfantCoupleDroite)
          //segment couples gauche
          let beforeLeftPartnerRef = mainPartnerRef
          let beforeLeftPartnerRect = mainPartnerRect
          currentNode.leftPartners && currentNode.leftPartners.map((partner, index) => {
            let currentPartnerRef = refs.current.get(partner.partners[0].id === getNodeMainPartner(partner).id ? partner.partners[1].id : partner.partners[0].id)
            let currentPartnerRect = currentPartnerRef?.getBoundingClientRect()
            const segmentCoupleGauche = {
              a: {
                x: toLocalPoint(beforeLeftPartnerRect, containerRect)?.left,
                y: toLocalPoint(beforeLeftPartnerRect, containerRect)?.centerY,
              },
              b: {
                x: toLocalPoint(currentPartnerRect, containerRect)?.right,
                y: toLocalPoint(currentPartnerRect, containerRect)?.centerY
              },
              type: index > 0 ? 'points' : 'line'
            }
            nextSegs.push(segmentCoupleGauche)

            let segmentEnfantCoupleGauche = { a: { x: 0, y: 0,}, b: {x: 0, y: 0},type: "line" }
            let firstChildX = 0
            if (partner.children.length === 1 && partner.children[0].key.startsWith('S')) {
              const firstChildRect = refs.current.get(getNodeMainPartner(partner.children[0]).id)?.getBoundingClientRect()
              firstChildX = toLocalPoint(firstChildRect, containerRect).centerX
            }
            if (partner.children.length === 1) {
              const firstChildRect = refs.current.get(getNodeMainPartner(partner.children[0]).id)?.getBoundingClientRect()
              const firstChildX = toLocalPoint(firstChildRect, containerRect).centerX
              const segmentEnfantUniqueCoupleGauche = {
                a: {
                  x: firstChildX,
                  y: segmentCoupleDroite.a.y + (beforeLeftPartnerRect?.height ? beforeLeftPartnerRect.height * 8/10 : 0)
                },
                b: {
                  x: (containerRect.width/50) + segmentCoupleGauche.b.x,
                  y: segmentCoupleDroite.a.y + (beforeLeftPartnerRect?.height ? beforeLeftPartnerRect.height * 8/10 : 0)
                },
                type: 'line'
              }
              nextSegs.push(segmentEnfantUniqueCoupleGauche)
            }
            if (partner.children[0]) {
              segmentEnfantCoupleGauche = {
                a: {
                  x: firstChildX ? firstChildX : (containerRect.width/50) + segmentCoupleGauche.b.x,
                  y: segmentCoupleGauche.a.y
                },
                b: {
                  x: firstChildX ? firstChildX : (containerRect.width/50) + segmentCoupleGauche.b.x,
                  y: segmentCoupleDroite.a.y + (beforeLeftPartnerRect?.height ? beforeLeftPartnerRect.height * 8/10 : 0)
                },
                type: 'line'
              }
            }
            if (segmentEnfantCoupleGauche.a.x !== 0)
              nextSegs.push(segmentEnfantCoupleGauche)

            beforeLeftPartnerRef = currentPartnerRef
            beforeLeftPartnerRect = currentPartnerRect
            //segment enfants couple gauche
            const segEnfantGauche = getLineTopChildren(partner, toLocalPoint(mainPartnerRect, containerRect)?.centerY + (mainPartnerRect?.height ? mainPartnerRect.height * 8/10 : 0))
            nextSegs.push(segEnfantGauche)
            partner.children.map((child) => {
              recursiveSegment(child, false, segEnfantGauche.a.y)
            })
          })
        }
        //segment enfants
        const segEnfant = getLineTopChildren(currentNode, toLocalPoint(mainPartnerRect, containerRect)?.centerY + (mainPartnerRect?.height ? mainPartnerRect.height * 8/10 : 0))
        nextSegs.push(segEnfant)
        currentNode.children.map((child) => {
          recursiveSegment(child, false, segEnfant.a.y)
        })
        //segment haut
        if (!prime) {
          let segmentTete = {
            a: { 
              x: toLocalPoint(mainPartnerRect, containerRect).centerX,
              y: toLocalPoint(mainPartnerRect, containerRect).top,
            },
            b: {
              x: toLocalPoint(mainPartnerRect, containerRect).centerX,
              y: topLevel,
            },
            type: "line"
          }
          nextSegs.push(segmentTete)
        }
      }
      recursiveSegment(node, true, 0)
      setSegments(nextSegs);
    }

    const recomputeSegments = () => {
      const container = containerRef.current;
      if (!container) return;

      const containerRect = container.getBoundingClientRect();

      setSvgSize({
        w: Math.max(1, Math.round(containerRect.width)),
        h: Math.max(1, Math.round(containerRect.height)),
      });

      buildSeg(node, containerRect)
    }

    useLayoutEffect(() => {
      recomputeSegments();

      const ro = new ResizeObserver(() => recomputeSegments());
      if (containerRef.current) ro.observe(containerRef.current);

      refs.current.forEach((el) => {
        if (el) ro.observe(el);
      });

      window.addEventListener("resize", recomputeSegments);
      window.addEventListener("scroll", recomputeSegments, true);

      return () => {
        ro.disconnect();
        window.removeEventListener("resize", recomputeSegments);
        window.removeEventListener("scroll", recomputeSegments, true);
      };
    }, [node]
  );


  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      {renderUnionSvg(segments, svgSize.w, svgSize.h)}
      {recursiveTree(node, 0, true)}
    </div>
  )
}

const style: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'row' as const,
    justifyContent: 'center',
    position: 'relative' as const,
  },
  mainUnion: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column' as const,
    rowGap: '10vh',
    marginTop: '3vw',
  },
  couple: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row' as const
  },
  partner: {

  },
  cardContainer: {
  },
  children: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row' as const,
  },
  leftPartners: {
    marginRight: '30vw'
  }
};