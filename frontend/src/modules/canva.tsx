import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import {
  ReactInfiniteCanvas,
  ReactInfiniteCanvasHandle,
  COMPONENT_POSITIONS,
} from "react-infinite-canvas";

import { Workflow } from "./components/workflow";
import { Controls } from "./components/controls";
import { UserDataBasic } from "../Types";

import "./canva.css";

type CanvaProps = {
  dataBasicMembers: UserDataBasic[],
  functionClose: Dispatch<SetStateAction<boolean>>
  memberSelect: Dispatch<SetStateAction<number>>
};

function Canva({ dataBasicMembers, functionClose, memberSelect }: CanvaProps) {
  const canvasRef = useRef<ReactInfiniteCanvasHandle | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const zoomTo = (targetScale: number, animated: boolean) => {
    const canvasState = canvasRef.current?.getCanvasState();
    if (!canvasState) return;

    const { canvasNode, d3Zoom } = canvasState;
    if (!canvasNode || !d3Zoom) return;

    if (animated) {
      d3Zoom.scaleTo(canvasNode.transition().duration(300), targetScale);
    } else {
      d3Zoom.scaleTo(canvasNode, targetScale); // ✅ instantané
    }
  };

  const zoomBy = (diff: number, animated: boolean) => {
    const canvasState = canvasRef.current?.getCanvasState();
    if (!canvasState) return;

    const currentScale = canvasState.currentPosition?.k ?? 1;

    const MIN_ZOOM = 0.2;
    const MAX_ZOOM = 3;

    const nextScale = Math.min(
      MAX_ZOOM,
      Math.max(MIN_ZOOM, currentScale + diff)
    );

    zoomTo(nextScale, animated);
  };

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();

      const STEP = 0.1;
      const diff = e.deltaY > 0 ? -STEP : STEP;

      zoomBy(diff, false);
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  return (
    <div className="workflowContainer" ref={wrapperRef}>
      <ReactInfiniteCanvas
        ref={canvasRef}
        onCanvasMount={(canvasFunc) => {
          canvasFunc?.fitContentToView({ scale: 0.5 });
        }}
        customComponents={[
          {
            component: (
              <Controls
                zoomBy={zoomBy}
                getCanvasState={() =>
                  canvasRef.current?.getCanvasState()
                }
              />
            ),
            position: COMPONENT_POSITIONS.BOTTOM_LEFT,
            offset: { x: 20, y: 20 },
          },
        ]}
      >
        <Workflow dataBasicMembers={dataBasicMembers} functionClose={functionClose} memberSelect={memberSelect}/>
      </ReactInfiniteCanvas>
    </div>
  );
}

export default Canva;