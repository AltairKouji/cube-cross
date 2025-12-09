import { Color, CubeState, Move, ColorScheme, DEFAULT_COLOR_SCHEME } from './types';

export class RubiksCube {
  public state: CubeState;

  constructor() {
    // 初始化已解决的魔方状态
    this.state = this.getSolvedState();
  }

  // 获取已解决状态的魔方
  private getSolvedState(): CubeState {
    return {
      U: Array(9).fill(Color.WHITE),
      D: Array(9).fill(Color.YELLOW),
      F: Array(9).fill(Color.GREEN),
      B: Array(9).fill(Color.BLUE),
      R: Array(9).fill(Color.RED),
      L: Array(9).fill(Color.ORANGE),
    };
  }

  // 克隆当前状态
  clone(): RubiksCube {
    const newCube = new RubiksCube();
    newCube.state = {
      U: [...this.state.U],
      D: [...this.state.D],
      F: [...this.state.F],
      B: [...this.state.B],
      R: [...this.state.R],
      L: [...this.state.L],
    };
    return newCube;
  }

  // 旋转面（顺时针90度）
  private rotateFaceClockwise(face: Color[]): Color[] {
    return [
      face[6], face[3], face[0],
      face[7], face[4], face[1],
      face[8], face[5], face[2],
    ];
  }

  // 旋转面（逆时针90度）
  private rotateFaceCounterClockwise(face: Color[]): Color[] {
    return [
      face[2], face[5], face[8],
      face[1], face[4], face[7],
      face[0], face[3], face[6],
    ];
  }

  // 执行U面旋转（顺时针）
  private moveU(): void {
    this.state.U = this.rotateFaceClockwise(this.state.U);

    const temp = [this.state.F[0], this.state.F[1], this.state.F[2]];
    this.state.F[0] = this.state.R[0];
    this.state.F[1] = this.state.R[1];
    this.state.F[2] = this.state.R[2];

    this.state.R[0] = this.state.B[0];
    this.state.R[1] = this.state.B[1];
    this.state.R[2] = this.state.B[2];

    this.state.B[0] = this.state.L[0];
    this.state.B[1] = this.state.L[1];
    this.state.B[2] = this.state.L[2];

    this.state.L[0] = temp[0];
    this.state.L[1] = temp[1];
    this.state.L[2] = temp[2];
  }

  // 执行D面旋转（顺时针）
  private moveD(): void {
    this.state.D = this.rotateFaceClockwise(this.state.D);

    const temp = [this.state.F[6], this.state.F[7], this.state.F[8]];
    this.state.F[6] = this.state.L[6];
    this.state.F[7] = this.state.L[7];
    this.state.F[8] = this.state.L[8];

    this.state.L[6] = this.state.B[6];
    this.state.L[7] = this.state.B[7];
    this.state.L[8] = this.state.B[8];

    this.state.B[6] = this.state.R[6];
    this.state.B[7] = this.state.R[7];
    this.state.B[8] = this.state.R[8];

    this.state.R[6] = temp[0];
    this.state.R[7] = temp[1];
    this.state.R[8] = temp[2];
  }

  // 执行F面旋转（顺时针）
  private moveF(): void {
    this.state.F = this.rotateFaceClockwise(this.state.F);

    const temp = [this.state.U[6], this.state.U[7], this.state.U[8]];
    this.state.U[6] = this.state.L[8];
    this.state.U[7] = this.state.L[5];
    this.state.U[8] = this.state.L[2];

    this.state.L[2] = this.state.D[0];
    this.state.L[5] = this.state.D[1];
    this.state.L[8] = this.state.D[2];

    this.state.D[0] = this.state.R[6];
    this.state.D[1] = this.state.R[3];
    this.state.D[2] = this.state.R[0];

    this.state.R[0] = temp[0];
    this.state.R[3] = temp[1];
    this.state.R[6] = temp[2];
  }

  // 执行B面旋转（顺时针）
  private moveB(): void {
    this.state.B = this.rotateFaceClockwise(this.state.B);

    const temp = [this.state.U[0], this.state.U[1], this.state.U[2]];
    this.state.U[0] = this.state.R[2];
    this.state.U[1] = this.state.R[5];
    this.state.U[2] = this.state.R[8];

    this.state.R[2] = this.state.D[8];
    this.state.R[5] = this.state.D[7];
    this.state.R[8] = this.state.D[6];

    this.state.D[6] = this.state.L[0];
    this.state.D[7] = this.state.L[3];
    this.state.D[8] = this.state.L[6];

    this.state.L[0] = temp[2];
    this.state.L[3] = temp[1];
    this.state.L[6] = temp[0];
  }

  // 执行R面旋转（顺时针）
  private moveR(): void {
    this.state.R = this.rotateFaceClockwise(this.state.R);

    const temp = [this.state.U[2], this.state.U[5], this.state.U[8]];
    this.state.U[2] = this.state.F[2];
    this.state.U[5] = this.state.F[5];
    this.state.U[8] = this.state.F[8];

    this.state.F[2] = this.state.D[2];
    this.state.F[5] = this.state.D[5];
    this.state.F[8] = this.state.D[8];

    this.state.D[2] = this.state.B[6];
    this.state.D[5] = this.state.B[3];
    this.state.D[8] = this.state.B[0];

    this.state.B[0] = temp[2];
    this.state.B[3] = temp[1];
    this.state.B[6] = temp[0];
  }

  // 执行L面旋转（顺时针）
  private moveL(): void {
    this.state.L = this.rotateFaceClockwise(this.state.L);

    const temp = [this.state.U[0], this.state.U[3], this.state.U[6]];
    this.state.U[0] = this.state.B[8];
    this.state.U[3] = this.state.B[5];
    this.state.U[6] = this.state.B[2];

    this.state.B[2] = this.state.D[6];
    this.state.B[5] = this.state.D[3];
    this.state.B[8] = this.state.D[0];

    this.state.D[0] = this.state.F[0];
    this.state.D[3] = this.state.F[3];
    this.state.D[6] = this.state.F[6];

    this.state.F[0] = temp[0];
    this.state.F[3] = temp[1];
    this.state.F[6] = temp[2];
  }

  // 执行移动
  move(moveNotation: Move): void {
    const face = moveNotation[0] as 'U' | 'D' | 'F' | 'B' | 'R' | 'L';
    const modifier = moveNotation.slice(1);

    let times = 1;
    if (modifier === "'") {
      times = 3; // 逆时针 = 顺时针3次
    } else if (modifier === "2") {
      times = 2;
    }

    for (let i = 0; i < times; i++) {
      switch (face) {
        case 'U': this.moveU(); break;
        case 'D': this.moveD(); break;
        case 'F': this.moveF(); break;
        case 'B': this.moveB(); break;
        case 'R': this.moveR(); break;
        case 'L': this.moveL(); break;
      }
    }
  }

  // 执行一系列移动
  applyMoves(moves: Move[]): void {
    moves.forEach(move => this.move(move));
  }

  // 打乱魔方
  scramble(numMoves: number = 20): Move[] {
    const allMoves: Move[] = ['U', 'D', 'F', 'B', 'R', 'L', "U'", "D'", "F'", "B'", "R'", "L'"];
    const scrambleMoves: Move[] = [];

    for (let i = 0; i < numMoves; i++) {
      const randomMove = allMoves[Math.floor(Math.random() * allMoves.length)];
      scrambleMoves.push(randomMove);
      this.move(randomMove);
    }

    return scrambleMoves;
  }

  // 检查cross是否完成（根据颜色方案）
  isCrossSolved(colorScheme: ColorScheme = DEFAULT_COLOR_SCHEME): boolean {
    // 获取目标底面颜色（做Cross的面）
    const bottomColor = colorScheme.topColor === 'yellow' ? Color.YELLOW : Color.WHITE;

    // 获取侧面颜色（按顺时针顺序：前-右-后-左）
    // 标准配色：绿前-红右-蓝后-橙左
    const colorOrder: { [key: string]: Color[] } = {
      'green': [Color.GREEN, Color.RED, Color.BLUE, Color.ORANGE],
      'red': [Color.RED, Color.BLUE, Color.ORANGE, Color.GREEN],
      'blue': [Color.BLUE, Color.ORANGE, Color.GREEN, Color.RED],
      'orange': [Color.ORANGE, Color.GREEN, Color.RED, Color.BLUE],
    };
    const sideColors = colorOrder[colorScheme.frontColor];

    // 检查底面中心和4个边块是否为目标颜色
    if (this.state.D[4] !== bottomColor) return false;
    if (this.state.D[1] !== bottomColor) return false;
    if (this.state.D[3] !== bottomColor) return false;
    if (this.state.D[5] !== bottomColor) return false;
    if (this.state.D[7] !== bottomColor) return false;

    // 检查侧面的边块颜色是否匹配
    if (this.state.F[7] !== sideColors[0]) return false;  // 前
    if (this.state.R[7] !== sideColors[1]) return false;  // 右
    if (this.state.B[7] !== sideColors[2]) return false;  // 后
    if (this.state.L[7] !== sideColors[3]) return false;  // 左

    return true;
  }
}
