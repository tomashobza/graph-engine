export type PositionType = {
  x: number;
  y: number;
};

export type RectangleType = {
  position: PositionType;
  width: number;
  height: number;
  color?: string;
};

export type GraphViewType = {
  left: number;
  right: number;
  top: number;
  bottom: number;
};

export type GraphSizeType = {
  width: number;
  height: number;
};
