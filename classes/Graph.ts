import { GraphSizeType, GraphViewType, PositionType } from "@/lib/types";

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
