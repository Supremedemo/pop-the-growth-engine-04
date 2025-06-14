
import React from "react";

interface CanvasGridProps {
  width: number;
  height: number;
  gridSize: number;
}

export const CanvasGrid = ({ width, height, gridSize }: CanvasGridProps) => {
  const horizontalLines = [];
  const verticalLines = [];

  // Create horizontal lines
  for (let y = 0; y <= height; y += gridSize) {
    horizontalLines.push(
      <line
        key={`h-${y}`}
        x1="0"
        y1={y}
        x2={width}
        y2={y}
        stroke="#e2e8f0"
        strokeWidth="0.5"
      />
    );
  }

  // Create vertical lines
  for (let x = 0; x <= width; x += gridSize) {
    verticalLines.push(
      <line
        key={`v-${x}`}
        x1={x}
        y1="0"
        x2={x}
        y2={height}
        stroke="#e2e8f0"
        strokeWidth="0.5"
      />
    );
  }

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      width={width}
      height={height}
      style={{ zIndex: 1 }}
    >
      {horizontalLines}
      {verticalLines}
    </svg>
  );
};
