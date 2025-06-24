import { GraphSizeType, GraphViewType, PositionType } from "@/lib/types";

// Map Position to GraphView
function mapPositionToGraphView(
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

export class Graph {
  private view: GraphViewType;
  private size: GraphSizeType;

  constructor(view: GraphViewType, size: GraphSizeType) {
    this.view = view;
    this.size = size;
  }

  getView(): GraphViewType {
    return this.view;
  }

  getSize(): GraphSizeType {
    return this.size;
  }

  setView(view: GraphViewType): void {
    this.view = view;
  }

  moveView(deltaX: number, deltaY: number): void {
    this.view.left += deltaX;
    this.view.right += deltaX;
    this.view.top += deltaY;
    this.view.bottom += deltaY;
  }

  scaleView(scaleFactor: number): void {
    const width = this.view.right - this.view.left;
    const height = this.view.bottom - this.view.top;
    const centerX = (this.view.left + this.view.right) / 2;
    const centerY = (this.view.top + this.view.bottom) / 2;

    const newWidth = width * scaleFactor;
    const newHeight = height * scaleFactor;

    this.view.left = centerX - newWidth / 2;
    this.view.right = centerX + newWidth / 2;
    this.view.top = centerY - newHeight / 2;
    this.view.bottom = centerY + newHeight / 2;
  }

  scaleViewWithOrigin(scaleFactor: number, origin: PositionType): void {
    const viewWidth = this.view.right - this.view.left;
    const viewHeight = this.view.bottom - this.view.top;

    if (this.size.width === 0 || this.size.height === 0) {
      return;
    }

    // Convert mouse position (canvas coordinates) to world coordinates
    const mouseWorldX =
      this.view.left + (origin.x / this.size.width) * viewWidth;
    const mouseWorldY =
      this.view.top + (origin.y / this.size.height) * viewHeight;

    // In useCanvas, the delta is > 1 for zooming out and < 1 for zooming in.
    // A larger view corresponds to zooming out.
    const newWidth = viewWidth * scaleFactor;
    const newHeight = viewHeight * scaleFactor;

    // Adjust view position to keep the point under the mouse stationary
    const newLeft = mouseWorldX - (origin.x / this.size.width) * newWidth;
    const newTop = mouseWorldY - (origin.y / this.size.height) * newHeight;

    this.setView({
      left: newLeft,
      right: newLeft + newWidth,
      top: newTop,
      bottom: newTop + newHeight,
    });
  }

  setSize(size: GraphSizeType): void {
    this.size = size;
  }
}
