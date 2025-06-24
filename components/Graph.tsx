"use client";

import React, { useEffect, useState } from "react";
import CanvasComponent from "./CanvasComponent";
import { RectangleType } from "@/lib/types";
import { GraphRectangle } from "@/classes/GraphRectangle";
import { Graph as GraphClass } from "@/classes/Graph";

const DEFAULT_GRAPH_VIEW = {
  left: 0,
  right: 200,
  top: 0,
  bottom: 200,
};
const ENABLE_RANDOM_RECTANGLES = false;

function Graph() {
  const [rectangles, setRectangles] = useState<RectangleType[]>([]);

  const randomizeRectangles = () => {
    // setRectangles([]);
    // for (let i = 0; i < 4; i++) {
    //   setRectangles((prev) => [
    //     ...prev,
    //     {
    //       position: {
    //         x: i * 50,
    //         y: Math.random() * 100,
    //       },
    //       width: 40,
    //       height: 20,
    //       color: `hsl(${Math.random() * 360}, 100%, 50%)`,
    //     },
    //   ]);
    // }
    setRectangles([
      {
        position: { x: 0, y: 150 },
        width: 400,
        height: 200,
        color: "#3498db",
      },
      {
        position: { x: 75, y: 125 },
        width: 40,
        height: 20,
        color: "#e74c3c",
      },
      {
        position: { x: 150, y: 100 },
        width: 40,
        height: 20,
        color: "#2ecc71",
      },
      {
        position: { x: 100, y: 50 },
        width: 40,
        height: 20,
        color: "#f1c40f",
      },
    ]);
  };

  useEffect(() => {
    console.log("rectangles updated:", rectangles);
  }, [rectangles]);

  function drawGraph(ctx: CanvasRenderingContext2D, graph: GraphClass) {
    const _rects: GraphRectangle[] = rectangles.map(
      (rect) =>
        new GraphRectangle(rect.position, rect.width, rect.height, rect.color)
    );

    _rects.forEach((rect) => rect.draw(ctx, graph));
  }

  useEffect(() => {
    randomizeRectangles();
    if (ENABLE_RANDOM_RECTANGLES) {
      const interval = setInterval(() => {
        randomizeRectangles();
      }, 4000);

      return () => clearInterval(interval);
    }
  }, []);

  return <CanvasComponent draw={drawGraph} />;
}

export default Graph;
