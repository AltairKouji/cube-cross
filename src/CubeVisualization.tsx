import React, { useState, useRef, useEffect } from 'react';
import { CubeState, Color } from './types';
import './CubeVisualization.css';

interface CubeVisualizationProps {
  cubeState: CubeState;
}

export const CubeVisualization: React.FC<CubeVisualizationProps> = ({ cubeState }) => {
  const [rotation, setRotation] = useState({ x: -20, y: -30 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const cubeRef = useRef<HTMLDivElement>(null);

  // 处理鼠标按下
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartPos({ x: e.clientX, y: e.clientY });
  };

  // 处理触摸开始
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    const touch = e.touches[0];
    setStartPos({ x: touch.clientX, y: touch.clientY });
  };

  // 处理鼠标移动
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const deltaX = e.clientX - startPos.x;
    const deltaY = e.clientY - startPos.y;

    setRotation(prev => ({
      x: prev.x + deltaY * 0.5,
      y: prev.y + deltaX * 0.5,
    }));

    setStartPos({ x: e.clientX, y: e.clientY });
  };

  // 处理触摸移动
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;

    const touch = e.touches[0];
    const deltaX = touch.clientX - startPos.x;
    const deltaY = touch.clientY - startPos.y;

    setRotation(prev => ({
      x: prev.x + deltaY * 0.5,
      y: prev.y + deltaX * 0.5,
    }));

    setStartPos({ x: touch.clientX, y: touch.clientY });
  };

  // 处理鼠标松开
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // 处理触摸结束
  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // 添加全局鼠标事件监听
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const deltaX = e.clientX - startPos.x;
      const deltaY = e.clientY - startPos.y;

      setRotation(prev => ({
        x: prev.x + deltaY * 0.5,
        y: prev.y + deltaX * 0.5,
      }));

      setStartPos({ x: e.clientX, y: e.clientY });
    };

    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleGlobalMouseMove);
      window.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, startPos]);

  // 渲染单个小方块
  const renderSticker = (color: Color, index: number, face: string) => {
    return (
      <div
        key={`${face}-${index}`}
        className="sticker"
        style={{ backgroundColor: color }}
      />
    );
  };

  // 渲染一个面
  const renderFace = (face: keyof CubeState, faceClass: string) => {
    return (
      <div className={`face ${faceClass}`}>
        {cubeState[face].map((color, index) => renderSticker(color, index, face))}
      </div>
    );
  };

  return (
    <div
      className="cube-container"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      <div className="cube-3d">
        <div
          ref={cubeRef}
          className="cube"
          style={{
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          }}
        >
          {renderFace('F', 'front')}
          {renderFace('B', 'back')}
          {renderFace('U', 'top')}
          {renderFace('D', 'bottom')}
          {renderFace('L', 'left')}
          {renderFace('R', 'right')}
        </div>
      </div>
      <div className="drag-hint">
        {isDragging ? '拖动中...' : '拖动旋转魔方'}
      </div>
    </div>
  );
};

// 2D展开图显示
export const CubeNet: React.FC<CubeVisualizationProps> = ({ cubeState }) => {
  const renderFace = (face: keyof CubeState, label: string) => {
    return (
      <div className="net-face">
        <div className="face-label">{label}</div>
        <div className="face-grid">
          {cubeState[face].map((color, index) => (
            <div
              key={`${face}-${index}`}
              className="net-sticker"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="cube-net">
      <div className="net-row">
        <div className="net-placeholder" />
        {renderFace('U', '上(U)')}
        <div className="net-placeholder" />
        <div className="net-placeholder" />
      </div>
      <div className="net-row">
        {renderFace('L', '左(L)')}
        {renderFace('F', '前(F)')}
        {renderFace('R', '右(R)')}
        {renderFace('B', '后(B)')}
      </div>
      <div className="net-row">
        <div className="net-placeholder" />
        {renderFace('D', '下(D)')}
        <div className="net-placeholder" />
        <div className="net-placeholder" />
      </div>
    </div>
  );
};
