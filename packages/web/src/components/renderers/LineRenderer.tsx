import React from 'react';
import { Line, Arrow } from 'react-konva';
import { BaseObjectRendererProps } from './BaseObjectRenderer';
import { AnnotationObject } from '../../types';

interface LineRendererProps extends BaseObjectRendererProps {
  onObjectUpdate?: (id: string, updates: Partial<AnnotationObject>) => void;
}

const LineRenderer: React.FC<LineRendererProps> = (props) => {
  const { obj, isLocked, onObjectClick, onObjectUpdate, shapeRef } = props;

  const handleDragEnd = (e: any) => {
    if (isLocked || !onObjectUpdate) return;
    
    const deltaX = e.target.x();
    const deltaY = e.target.y();
    const currentPoints = obj.points || [];
    const newPoints = [];
    
    for (let i = 0; i < currentPoints.length; i += 2) {
      newPoints[i] = currentPoints[i] + deltaX;
      newPoints[i + 1] = currentPoints[i + 1] + deltaY;
    }
    
    onObjectUpdate(obj.id, { points: newPoints });
    e.target.x(0);
    e.target.y(0);
  };

  const commonProps = {
    stroke: obj.stroke || '#1890ff',
    strokeWidth: obj.strokeWidth || 2,
    points: obj.points || [],
    onClick: () => onObjectClick(obj),
    onTap: () => onObjectClick(obj),
    draggable: !isLocked,
    opacity: isLocked ? 0.7 : 1,
    dash: isLocked ? [5, 5] : undefined,
    onDragEnd: handleDragEnd,
    ref: shapeRef,
  };

  if (obj.type === 'arrow') {
    return (
      <Arrow
        {...commonProps}
        pointerLength={10}
        pointerWidth={10}
        fill={obj.stroke || '#1890ff'}
      />
    );
  }

  if (obj.type === 'pen') {
    return (
      <Line
        {...commonProps}
        lineCap="round"
        lineJoin="round"
        tension={0.5}
      />
    );
  }

  return (
    <Line
      {...commonProps}
      lineCap="round"
      lineJoin="round"
    />
  );
};

export default LineRenderer;