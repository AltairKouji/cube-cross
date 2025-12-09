// 魔方颜色
export enum Color {
  WHITE = 'white',
  YELLOW = 'yellow',
  GREEN = 'green',
  BLUE = 'blue',
  RED = 'red',
  ORANGE = 'orange',
}

// 魔方面
export enum Face {
  U = 'U', // Up (白色)
  D = 'D', // Down (黄色)
  F = 'F', // Front (绿色)
  B = 'B', // Back (蓝色)
  R = 'R', // Right (红色)
  L = 'L', // Left (橙色)
}

// 每个面有9个色块 (3x3)
export type FaceState = Color[];

// 魔方状态：6个面
export interface CubeState {
  U: FaceState;
  D: FaceState;
  F: FaceState;
  B: FaceState;
  R: FaceState;
  L: FaceState;
}

// 移动类型
export type Move = 'U' | 'D' | 'F' | 'B' | 'R' | 'L' |
                   "U'" | "D'" | "F'" | "B'" | "R'" | "L'" |
                   'U2' | 'D2' | 'F2' | 'B2' | 'R2' | 'L2';

// Cross解决方案
export interface CrossSolution {
  moves: Move[];
  description: string;
}
