export interface SphereTrig {
  sinLat: number;
  cosLat: number;
  sinLng: number;
  cosLng: number;
}

export interface ProjectedPoint {
  x: number;
  y: number;
  cosc: number;
}

export interface SpringConfig {
  stiffness: number;
  dampingRatio: number;
}

export interface SpringAxis {
  position: number;
  velocity: number;
}

export interface SpringStep extends SpringAxis {
  isSettled: boolean;
}
