import { GraphViewType, PositionType } from "./types";

// Map Position to GraphView
export function mapPositionToGraphView(
  position: PositionType,
  graphView: GraphViewType
): PositionType {
  // The graphView defines the visible area of the graph. The position should therefore be mapped
  // relative to the graphView's left, right, top, and bottom boundaries.
  const { left, right, top, bottom } = graphView;
  const x = (position.x - left) / (right - left);
  const y = (position.y - top) / (bottom - top);
  return {
    x,
    y,
  };
}
