import { Move } from './types';

/**
 * WCA标准魔方打乱生成器
 * 参考cstimer实现，避免无效移动
 */
export class WCAScrambler {
  // 面的对应关系：U-D, F-B, R-L
  private static readonly oppositeFaces: { [key: string]: string } = {
    'U': 'D',
    'D': 'U',
    'F': 'B',
    'B': 'F',
    'R': 'L',
    'L': 'R',
  };

  // 所有基本面
  private static readonly faces = ['U', 'D', 'F', 'B', 'R', 'L'];

  // 所有可能的后缀（无后缀=顺时针, '=逆时针, 2=180度）
  private static readonly suffixes = ['', "'", '2'];

  /**
   * 生成WCA标准打乱序列
   * @param length 打乱长度（默认20步）
   * @returns 打乱移动序列
   */
  static generateScramble(length: number = 20): Move[] {
    const scramble: Move[] = [];
    let lastFace: string | null = null;
    let secondLastFace: string | null = null;

    for (let i = 0; i < length; i++) {
      const move = this.getNextMove(lastFace, secondLastFace);
      scramble.push(move);

      // 更新历史
      secondLastFace = lastFace;
      lastFace = move[0]; // 取第一个字符作为面
    }

    return scramble;
  }

  /**
   * 获取下一个有效的移动
   * 确保不会生成无效序列（如 R R', R L R）
   */
  private static getNextMove(
    lastFace: string | null,
    secondLastFace: string | null
  ): Move {
    let face: string;
    let attempts = 0;
    const maxAttempts = 100;

    do {
      face = this.faces[Math.floor(Math.random() * this.faces.length)];
      attempts++;

      // 安全检查：避免无限循环
      if (attempts > maxAttempts) {
        // 如果尝试太多次，选择一个一定有效的面
        const validFaces = this.faces.filter(f =>
          f !== lastFace &&
          (secondLastFace === null || f !== secondLastFace || f !== this.oppositeFaces[lastFace!])
        );
        face = validFaces[Math.floor(Math.random() * validFaces.length)];
        break;
      }
    } while (!this.isValidMove(face, lastFace, secondLastFace));

    // 随机选择后缀
    const suffix = this.suffixes[Math.floor(Math.random() * this.suffixes.length)];

    return (face + suffix) as Move;
  }

  /**
   * 检查移动是否有效
   * 规则：
   * 1. 不能与上一个移动的面相同（避免 R R' 或 R R）
   * 2. 不能形成"面-对面-面"的模式（避免 R L R）
   */
  private static isValidMove(
    face: string,
    lastFace: string | null,
    secondLastFace: string | null
  ): boolean {
    // 第一个移动总是有效
    if (lastFace === null) {
      return true;
    }

    // 规则1: 不能与上一个移动同面
    if (face === lastFace) {
      return false;
    }

    // 规则2: 避免 "面-对面-面" 模式（如 R L R）
    if (secondLastFace !== null) {
      const oppositeLast = this.oppositeFaces[lastFace];
      if (face === secondLastFace && lastFace === oppositeLast) {
        return false;
      }
    }

    return true;
  }

  /**
   * 验证打乱序列是否符合WCA标准
   * 用于测试
   */
  static validateScramble(scramble: Move[]): boolean {
    for (let i = 1; i < scramble.length; i++) {
      const currentFace = scramble[i][0];
      const lastFace = scramble[i - 1][0];

      // 检查规则1: 不能连续相同面
      if (currentFace === lastFace) {
        return false;
      }

      // 检查规则2: 避免 "面-对面-面" 模式
      if (i >= 2) {
        const secondLastFace = scramble[i - 2][0];
        const oppositeLast = this.oppositeFaces[lastFace];
        if (currentFace === secondLastFace && lastFace === oppositeLast) {
          return false;
        }
      }
    }

    return true;
  }
}
