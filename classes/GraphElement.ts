import { mapPositionToGraphView } from "@/lib/graph_utils";
import { GraphSizeType, GraphViewType, PositionType } from "@/lib/types";
import { Graph } from "./Graph";

export class GraphElement {
  private position: PositionType;
  constructor(position: PositionType) {
    this.position = position;
  }

  getWorldPosition(): PositionType {
    return this.position;
  }

  getWorldSize(): { width: number; height: number } {
    return { width: 0, height: 0 };
  }

  getGraphPosition(graphView: GraphViewType): PositionType {
    return mapPositionToGraphView(this.position, graphView);
  }

  getGraphSize(graphView: GraphViewType): { width: number; height: number } {
    return {
      width: 0,
      height: 0,
    };
  }

  getGraphCoordinates(graphView: GraphViewType): {
    position: PositionType;
    size: GraphSizeType;
  } {
    const { x, y } = this.getGraphPosition(graphView);
    const { width, height } = this.getGraphSize(graphView);
    return {
      position: { x, y },
      size: { width, height },
    };
  }

  isInView(graphView: GraphViewType): boolean {
    const { x, y } = this.getGraphPosition(graphView);
    return x >= 0 && x <= 1 && y >= 0 && y <= 1;
  }

  draw(ctx: CanvasRenderingContext2D, graph: Graph): void {}
}
