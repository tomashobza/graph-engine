import { Graph } from "@/classes/GraphElement";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

/**
 * useCanvas Hook
 * - Sets up canvas context
 * - Handles resize & high-DPI scaling
 * - Runs an animation loop invoking `draw(ctx, width, height)`
 */
export function useCanvas(
  draw: (ctx: CanvasRenderingContext2D, graph: Graph) => void
) {
  const [isMouseDown, setIsMouseDown] = useState(false);
  const lastMousePosRef = useRef<{ x: number; y: number } | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const graphRef = useRef(
    new Graph(
      { left: 0, right: 200, top: 0, bottom: 400 },
      { width: 800, height: 600 }
    )
  );
  const graph = graphRef.current;

  // Resize & HDPI setup
  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentNode;
    if (!parent || !(parent instanceof HTMLElement)) {
      throw new Error("Canvas parent is not an HTMLElement");
    }
    const { width, height } = parent.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    graph.setSize({ width, height }); // Update graph size

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Failed to get canvas 2D context");
    }
    ctx.scale(dpr, dpr);
  }, [graph]);

  // Handle resizing
  useLayoutEffect(() => {
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [resize]);

  // Animation loop
  useEffect(() => {
    let frameId = 0;
    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) {
        throw new Error("Canvas reference is null");
      }
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        throw new Error("Failed to get canvas 2D context");
      }
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      // Call the draw function
      draw(ctx, graph);

      frameId = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(frameId);
  }, [draw, graph]);

  // Graph movement handling
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const graphView = graph.getView();
      const step = 10; // Movement step size
      switch (event.key) {
        case "ArrowUp":
          graphView.top -= step;
          graphView.bottom -= step;
          break;
        case "ArrowDown":
          graphView.top += step;
          graphView.bottom += step;
          break;
        case "ArrowLeft":
          graphView.left -= step;
          graphView.right -= step;
          break;
        case "ArrowRight":
          graphView.left += step;
          graphView.right += step;
          break;
        default:
          return; // Exit if not an arrow key
      }
      graph.setView(graphView);
    };

    const handleMouseWheel = (event: WheelEvent) => {
      // get the position of the mouse relative to the canvas
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      const zoomFactor = 1.05; // Zoom factor
      const delta = event.deltaY < 0 ? 1 / zoomFactor : zoomFactor;
      graph.scaleViewWithOrigin(delta, { x: mouseX, y: mouseY });
      event.preventDefault(); // Prevent default scrolling behavior
    };

    const handleMouseDown = (event: MouseEvent) => {
      if (event.button === 0) {
        // Left mouse button
        setIsMouseDown(true);
        lastMousePosRef.current = { x: event.clientX, y: event.clientY };
      }
    };

    const handleMouseUp = (event: MouseEvent) => {
      if (event.button === 0) {
        // Left mouse button
        setIsMouseDown(false);
        lastMousePosRef.current = null;
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!isMouseDown || !lastMousePosRef.current) return;

      const lastPos = lastMousePosRef.current;
      const currentPos = { x: event.clientX, y: event.clientY };

      const dx = currentPos.x - lastPos.x;
      const dy = currentPos.y - lastPos.y;

      lastMousePosRef.current = currentPos;

      const view = graph.getView();
      const viewWidth = view.right - view.left;
      const viewHeight = view.bottom - view.top;
      const graphSize = graph.getSize();

      if (graphSize.width === 0 || graphSize.height === 0) return;

      const worldDx = (dx / graphSize.width) * viewWidth;
      const worldDy = (dy / graphSize.height) * viewHeight;

      graph.moveView(-worldDx, -worldDy);
    };

    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener("wheel", handleMouseWheel, { passive: false });
    window.addEventListener("keydown", handleKeyDown);
    canvas.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      canvas.removeEventListener("wheel", handleMouseWheel);
      canvas.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [graph, isMouseDown]);

  return canvasRef;
}
