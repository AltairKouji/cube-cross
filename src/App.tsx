import React, { useState, useMemo } from 'react';
import './App.css';
import { RubiksCube } from './RubiksCube';
import { CrossSolver } from './CrossSolver';
import { CubeVisualization, CubeNet } from './CubeVisualization';
import { WCAScrambler } from './WCAScrambler';
import { Move, ColorScheme, DEFAULT_COLOR_SCHEME } from './types';

function App() {
  const [cube] = useState(() => new RubiksCube());
  const [cubeState, setCubeState] = useState(cube.state);
  const [moveHistory, setMoveHistory] = useState<Move[]>([]);
  const [solution, setSolution] = useState<Move[]>([]);
  const [viewMode, setViewMode] = useState<'3d' | '2d'>('3d');
  const [userSolution, setUserSolution] = useState<string>('');
  const [comparison, setComparison] = useState<string>('');
  const [colorScheme, setColorScheme] = useState<ColorScheme>(DEFAULT_COLOR_SCHEME);

  // 创建求解器
  const solver = useMemo(() => new CrossSolver(cube, colorScheme), [cube, colorScheme]);

  // 刷新魔方状态
  const updateCubeState = () => {
    setCubeState({ ...cube.state });
  };

  // 执行移动
  const executeMove = (move: Move) => {
    cube.move(move);
    setMoveHistory([...moveHistory, move]);
    updateCubeState();
  };

  // 打乱魔方 - 使用WCA标准打乱
  const scrambleCube = () => {
    const scrambleMoves = WCAScrambler.generateScramble(20);
    cube.applyMoves(scrambleMoves);
    setMoveHistory(scrambleMoves);
    setSolution([]);
    updateCubeState();
  };

  // 求解Cross
  const solveCross = () => {
    const crossSolution = solver.solveCross();
    setSolution(crossSolution.moves);
    if (crossSolution.moves.length > 0) {
      alert(`找到解决方案！共需要 ${crossSolution.moves.length} 步`);
    } else {
      alert(crossSolution.description);
    }
  };

  // 应用解决方案
  const applySolution = () => {
    if (solution.length > 0) {
      cube.applyMoves(solution);
      setMoveHistory([...moveHistory, ...solution]);
      setSolution([]);
      updateCubeState();
    }
  };

  // 重置魔方
  const resetCube = () => {
    const newCube = new RubiksCube();
    Object.assign(cube, newCube);
    setMoveHistory([]);
    setSolution([]);
    updateCubeState();
  };

  // 撤销上一步
  const undoMove = () => {
    if (moveHistory.length > 0) {
      resetCube();
      const newHistory = moveHistory.slice(0, -1);
      cube.applyMoves(newHistory);
      setMoveHistory(newHistory);
      updateCubeState();
    }
  };

  // 解析用户输入的移动序列
  const parseUserMoves = (input: string): Move[] | null => {
    try {
      const moves = input.trim().split(/\s+/).filter(m => m.length > 0);
      const validMoves: Move[] = ['U', 'D', 'F', 'B', 'R', 'L', "U'", "D'", "F'", "B'", "R'", "L'", 'U2', 'D2', 'F2', 'B2', 'R2', 'L2'];

      for (const move of moves) {
        if (!validMoves.includes(move as Move)) {
          return null;
        }
      }

      return moves as Move[];
    } catch (error) {
      return null;
    }
  };

  // 比较用户解法和最优解
  const compareUserSolution = () => {
    const userMoves = parseUserMoves(userSolution);

    if (!userMoves) {
      setComparison('❌ 输入格式错误！请使用空格分隔，例如：F R U R\' U\' F\'');
      return;
    }

    // 测试用户解法是否有效
    const testCube = cube.clone();
    testCube.applyMoves(userMoves);
    const userSolves = testCube.isCrossSolved(colorScheme);

    // 获取最优解
    const optimalSolution = solver.solveCross();

    let result = '';

    if (userSolves) {
      result += '✅ 你的解法正确！\n\n';
      result += `你的步数：${userMoves.length} 步\n`;
      result += `你的解法：${userMoves.join(' ')}\n\n`;

      if (optimalSolution.moves.length > 0) {
        result += `推荐解法：${optimalSolution.moves.length} 步\n`;
        result += `推荐步骤：${optimalSolution.moves.join(' ')}\n\n`;

        if (userMoves.length === optimalSolution.moves.length) {
          result += '🎉 太棒了！你找到了最优解！';
        } else if (userMoves.length < optimalSolution.moves.length + 3) {
          result += '👍 非常好！你的解法很接近最优解！';
        } else if (userMoves.length < optimalSolution.moves.length + 6) {
          result += '😊 不错！还有优化空间。';
        } else {
          result += '💪 解决了！可以尝试更短的解法。';
        }
      } else {
        result += '💡 提示：魔方已经完成Cross，无需额外步骤。';
      }
    } else {
      result += '❌ 你的解法不能完成Cross\n\n';
      result += `你的步数：${userMoves.length} 步\n`;
      result += `你的解法：${userMoves.join(' ')}\n\n`;

      if (optimalSolution.moves.length > 0) {
        result += `推荐解法：${optimalSolution.moves.length} 步\n`;
        result += `推荐步骤：${optimalSolution.moves.join(' ')}\n\n`;
      }

      result += '💡 建议：检查每个边块的位置和方向';
    }

    setComparison(result);
  };

  // 清除比较结果
  const clearComparison = () => {
    setUserSolution('');
    setComparison('');
  };

  // 常用移动按钮
  const commonMoves: Move[] = ['U', "U'", 'D', "D'", 'F', "F'", 'B', "B'", 'R', "R'", 'L', "L'"];

  return (
    <div className="App">
      <header className="App-header">
        <h1>🎲 魔方 CFOP - Cross 求解器</h1>
        <p>学习和练习魔方CFOP方法的第一步：Cross（十字）</p>
      </header>

      <div className="app-container">
        <div className="visualization-section">
          <div className="view-toggle">
            <button
              className={viewMode === '3d' ? 'active' : ''}
              onClick={() => setViewMode('3d')}
            >
              3D视图
            </button>
            <button
              className={viewMode === '2d' ? 'active' : ''}
              onClick={() => setViewMode('2d')}
            >
              2D展开图
            </button>
          </div>

          {viewMode === '3d' ? (
            <CubeVisualization cubeState={cubeState} />
          ) : (
            <CubeNet cubeState={cubeState} />
          )}
        </div>

        <div className="controls-section">
          <div className="control-group">
            <h3>⚙️ 颜色方案设置</h3>
            <p className="input-hint">设置做Cross时的参照（打乱始终为白上绿前）</p>
            <div className="color-scheme-grid">
              <div className="scheme-option">
                <label>Cross底面颜色：</label>
                <select
                  value={colorScheme.topColor}
                  onChange={(e) => setColorScheme({ ...colorScheme, topColor: e.target.value as 'white' | 'yellow' })}
                  className="scheme-select"
                >
                  <option value="yellow">黄色</option>
                  <option value="white">白色</option>
                </select>
              </div>
              <div className="scheme-option">
                <label>前面颜色：</label>
                <select
                  value={colorScheme.frontColor}
                  onChange={(e) => setColorScheme({ ...colorScheme, frontColor: e.target.value as any })}
                  className="scheme-select"
                >
                  <option value="green">绿色</option>
                  <option value="red">红色</option>
                  <option value="blue">蓝色</option>
                  <option value="orange">橙色</option>
                </select>
              </div>
            </div>
          </div>

          <div className="control-group">
            <h3>主要操作</h3>
            <div className="button-row">
              <button className="btn btn-primary" onClick={scrambleCube}>
                🔀 打乱魔方
              </button>
              <button className="btn btn-success" onClick={solveCross}>
                🎯 求解 Cross
              </button>
              <button className="btn btn-secondary" onClick={resetCube}>
                🔄 重置
              </button>
            </div>
          </div>

          {solution.length > 0 && (
            <div className="solution-box">
              <h3>解决方案 ({solution.length} 步)</h3>
              <div className="solution-moves">
                {solution.join(' ')}
              </div>
              <button className="btn btn-success" onClick={applySolution}>
                应用解决方案
              </button>
            </div>
          )}

          <div className="control-group">
            <h3>测试你的解法</h3>
            <p className="input-hint">输入你的Cross解法，用空格分隔（例如：F R U R' U' F'）</p>
            <textarea
              className="solution-input"
              value={userSolution}
              onChange={(e) => setUserSolution(e.target.value)}
              placeholder="F R U R' U' F'"
              rows={3}
            />
            <div className="button-row">
              <button
                className="btn btn-primary"
                onClick={compareUserSolution}
                disabled={!userSolution.trim()}
              >
                🔍 检查解法
              </button>
              <button
                className="btn btn-secondary"
                onClick={clearComparison}
                disabled={!userSolution && !comparison}
              >
                清除
              </button>
            </div>
          </div>

          {comparison && (
            <div className={`comparison-box ${comparison.includes('✅') ? 'success' : 'error'}`}>
              <h3>📊 解法分析</h3>
              <pre>{comparison}</pre>
            </div>
          )}

          <div className="control-group">
            <h3>手动操作</h3>
            <div className="moves-grid">
              {commonMoves.map((move) => (
                <button
                  key={move}
                  className="btn btn-move"
                  onClick={() => executeMove(move)}
                >
                  {move}
                </button>
              ))}
            </div>
            <button
              className="btn btn-warning"
              onClick={undoMove}
              disabled={moveHistory.length === 0}
            >
              ↶ 撤销
            </button>
          </div>

          {moveHistory.length > 0 && (
            <div className="history-box">
              <h3>移动历史 ({moveHistory.length})</h3>
              <div className="history-content">
                {moveHistory.join(' ')}
              </div>
            </div>
          )}
        </div>
      </div>

      <footer className="app-footer">
        <p>CFOP方法：Cross → F2L → OLL → PLL</p>
        <p>当前练习：Cross（底层十字）</p>
      </footer>
    </div>
  );
}

export default App;
