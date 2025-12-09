import React from 'react';
import { CubeState, Color } from './types';
import './CubeVisualization.css';

interface CubeVisualizationProps {
  cubeState: CubeState;
}

export const CubeVisualization: React.FC<CubeVisualizationProps> = ({ cubeState }) => {
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
    <div className="cube-container">
      <div className="cube-3d">
        <div className="cube">
          {renderFace('F', 'front')}
          {renderFace('B', 'back')}
          {renderFace('U', 'top')}
          {renderFace('D', 'bottom')}
          {renderFace('L', 'left')}
          {renderFace('R', 'right')}
        </div>
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
