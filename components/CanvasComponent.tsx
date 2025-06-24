"use client";

import { Graph } from "@/classes/GraphElement";
import { useCanvas } from "@/hooks/useCanvas";
import React, { useRef, useEffect, useLayoutEffect, useCallback } from "react";

/**
 * CanvasComponent
 * Props:
 *  - draw: (ctx, width, height) ⇒ void
 */
export default function CanvasComponent({
  draw = () => {},
  style,
}: {
  draw?: (ctx: CanvasRenderingContext2D, graph: Graph) => void;
  style?: React.CSSProperties;
}) {
  const canvasRef = useCanvas(draw);

  return (
    <div
      style={{ position: "relative", width: "100%", height: "100%", ...style }}
    >
      <canvas ref={canvasRef} style={{ display: "block" }} />
    </div>
  );
}
