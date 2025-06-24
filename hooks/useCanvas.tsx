import { Graph } from "@/classes/GraphElement";
import { useCallback, useEffect, useLayoutEffect, useRef } from "react";

/**
 * useCanvas Hook
 * - Sets up canvas context
 * - Handles resize & high-DPI scaling
 * - Runs an animation loop invoking `draw(ctx, width, height)`
 */
export function useCanvas(
  draw: (ctx: CanvasRenderingContext2D, graph: Graph) => void
) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const graph = new Graph(
    { left: 0, right: 200, top: 0, bottom: 400 },
    { width: 800, height: 600 }
  );

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
  }, []);

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
  }, [draw]);

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
      resize(); // Resize to apply new view
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [resize, graph]);

  return canvasRef;
}
