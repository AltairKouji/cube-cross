import React, { useState, useMemo } from 'react';
import './App.css';
import { RubiksCube } from './RubiksCube';
import { CrossSolver } from './CrossSolver';
import { CubeVisualization, CubeNet } from './CubeVisualization';
import { Move } from './types';

function App() {
  const [cube] = useState(() => new RubiksCube());
  const [cubeState, setCubeState] = useState(cube.state);
  const [moveHistory, setMoveHistory] = useState<Move[]>([]);
  const [solution, setSolution] = useState<Move[]>([]);
  const [hint, setHint] = useState<string>('');
  const [viewMode, setViewMode] = useState<'3d' | '2d'>('3d');

  // 创建求解器
  const solver = useMemo(() => new CrossSolver(cube), [cube]);

  // 刷新魔方状态
  const updateCubeState = () => {
    setCubeState({ ...cube.state });
  };

  // 执行移动
  const executeMove = (move: Move) => {
    cube.move(move);
    setMoveHistory([...moveHistory, move]);
    updateCubeState();
    updateHint();
  };

  // 打乱魔方
  const scrambleCube = () => {
    const scrambleMoves = cube.scramble(20);
    setMoveHistory(scrambleMoves);
    setSolution([]);
    updateCubeState();
    updateHint();
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
      updateHint();
    }
  };

  // 重置魔方
  const resetCube = () => {
    const newCube = new RubiksCube();
    Object.assign(cube, newCube);
    setMoveHistory([]);
    setSolution([]);
    setHint('');
    updateCubeState();
  };

  // 更新提示
  const updateHint = () => {
    const newHint = CrossSolver.getCrossHint(cube);
    setHint(newHint);
  };

  // 撤销上一步
  const undoMove = () => {
    if (moveHistory.length > 0) {
      resetCube();
      const newHistory = moveHistory.slice(0, -1);
      cube.applyMoves(newHistory);
      setMoveHistory(newHistory);
      updateCubeState();
      updateHint();
    }
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

          {hint && (
            <div className="hint-box">
              <h3>💡 提示</h3>
              <pre>{hint}</pre>
            </div>
          )}

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
