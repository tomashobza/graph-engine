import { GraphElement } from "./GraphElement";
import { mapPositionToGraphView } from "@/lib/graph_utils";
import { GraphViewType, PositionType } from "@/lib/types";
import { Graph } from "./Graph";

export class GraphRectangle extends GraphElement {
  private width: number;
  private height: number;
  private color: string = "#3498db"; // Default color

  constructor(
    position: PositionType,
    width: number,
    height: number,
    color?: string
  ) {
    super(position);
    this.width = width;
    this.height = height;
    if (color) this.color = color;
  }

  getWorldSize(): { width: number; height: number } {
    return { width: this.width, height: this.height };
  }

  getGraphSize(graphView: GraphViewType): { width: number; height: number } {
    const { x, y } = this.getGraphPosition(graphView);

    // Map the size of the rectangle to the graph view
    const width =
      mapPositionToGraphView({ x: this.width, y: 0 }, graphView).x - x;
    const height =
      mapPositionToGraphView({ x: 0, y: this.height }, graphView).y - y;
    return { width, height };
  }

  isInView(graphView: GraphViewType): boolean {
    const { position, size } = this.getGraphCoordinates(graphView);
    return (
      position.x + size.width >= 0 ||
      position.x <= 1 ||
      position.y + size.height >= 0 ||
      position.y <= 1
    );
  }

  draw(ctx: CanvasRenderingContext2D, graph: Graph): void {
    const graphView = graph.getView();
    const graphSize = graph.getSize();

    if (!this.isInView(graphView)) return;

    const { position, size } = this.getGraphCoordinates(graphView);

    const xPos = position.x * graphSize.width;
    const yPos = position.y * graphSize.height;
    const rectWidth = size.width * graphSize.width;
    const rectHeight = size.height * graphSize.height;

    ctx.fillStyle = this.color;
    ctx.fillRect(xPos, yPos, rectWidth, rectHeight);
  }
}
