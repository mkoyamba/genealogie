import "./styles.css";

export const Controls = ({ zoomBy, zoomState }: any) => {
  const { scale } = zoomState;

  return (
    <div className="control-wrapper">
      <button className="control-btn" onClick={() => zoomBy(-0.25, true)}>-</button>
      <div className="control-value">{Math.round(scale * 100)}%</div>
      <button className="control-btn" onClick={() => zoomBy(0.25, true)}>+</button>
    </div>
  );
};