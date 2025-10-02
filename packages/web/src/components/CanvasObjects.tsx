import React from 'react';
import { Rect, Circle, Line, Text, Arrow, Group } from 'react-konva';
import { AnnotationObject } from '../types';

interface CanvasObjectsProps {
  objects: AnnotationObject[];
  selectedObjects: string[];
  onObjectSelect: (id: string) => void;
  onObjectUpdate?: (id: string, updates: Partial<AnnotationObject>) => void;
}

const CanvasObjects: React.FC<CanvasObjectsProps> = ({
  objects,
  selectedObjects,
  onObjectSelect,
  onObjectUpdate,
}) => {
  const handleDragEnd = (id: string, e: any) => {
    if (onObjectUpdate) {
      onObjectUpdate(id, {
        x: e.target.x(),
        y: e.target.y(),
      });
    }
  };

  const renderObject = (obj: AnnotationObject) => {
    const commonProps = {
      x: obj.x,
      y: obj.y,
      stroke: obj.stroke || '#1890ff',
      strokeWidth: obj.strokeWidth || 2,
      onClick: () => onObjectSelect(obj.id),
      draggable: true,
      onDragEnd: (e: any) => handleDragEnd(obj.id, e),
    };

    switch (obj.type) {
      case 'rectangle':
        return (
          <Rect
            key={obj.id}
            {...commonProps}
            width={obj.width || 0}
            height={obj.height || 0}
            fill="transparent"
          />
        );

      case 'circle':
        return (
          <Circle
            key={obj.id}
            {...commonProps}
            radius={Math.abs(obj.width || 0) / 2}
            fill="transparent"
          />
        );

      case 'line':
        return (
          <Group 
            key={`line-group-${obj.id}`}
            draggable={true}
            onClick={() => onObjectSelect(obj.id)}
            onDragEnd={(e) => {
              if (onObjectUpdate) {
                const deltaX = e.target.x();
                const deltaY = e.target.y();
                const currentPoints = obj.points || [];
                const newPoints = [];
                
                for (let i = 0; i < currentPoints.length; i += 2) {
                  newPoints[i] = currentPoints[i] + deltaX;
                  newPoints[i + 1] = currentPoints[i + 1] + deltaY;
                }
                
                onObjectUpdate(obj.id, {
                  points: newPoints,
                });
                
                e.target.x(0);
                e.target.y(0);
              }
            }}
          >
            <Line
              stroke={obj.stroke || '#1890ff'}
              strokeWidth={obj.strokeWidth || 2}
              points={obj.points || []}
              lineCap="round"
              lineJoin="round"
            />
            <Line
              stroke="transparent"
              strokeWidth={Math.max(10, (obj.strokeWidth || 2) + 8)}
              points={obj.points || []}
              lineCap="round"
              lineJoin="round"
            />
          </Group>
        );

      case 'arrow':
        return (
          <Group 
            key={`arrow-group-${obj.id}`}
            draggable={true}
            onClick={() => onObjectSelect(obj.id)}
            onDragEnd={(e) => {
              if (onObjectUpdate) {
                const deltaX = e.target.x();
                const deltaY = e.target.y();
                const currentPoints = obj.points || [];
                const newPoints = [];
                
                for (let i = 0; i < currentPoints.length; i += 2) {
                  newPoints[i] = currentPoints[i] + deltaX;
                  newPoints[i + 1] = currentPoints[i + 1] + deltaY;
                }
                
                onObjectUpdate(obj.id, {
                  points: newPoints,
                });
                
                e.target.x(0);
                e.target.y(0);
              }
            }}
          >
            <Arrow
              stroke={obj.stroke || '#1890ff'}
              strokeWidth={obj.strokeWidth || 2}
              points={obj.points || []}
              pointerLength={10}
              pointerWidth={10}
              fill={obj.stroke || '#1890ff'}
            />
            <Line
              stroke="transparent"
              strokeWidth={Math.max(10, (obj.strokeWidth || 2) + 8)}
              points={obj.points || []}
              lineCap="round"
              lineJoin="round"
            />
          </Group>
        );

      case 'pen':
        return (
          <Line
            key={obj.id}
            stroke={obj.stroke || '#1890ff'}
            strokeWidth={obj.strokeWidth || 2}
            onClick={() => onObjectSelect(obj.id)}
            draggable={true}
            onDragEnd={(e: any) => handleDragEnd(obj.id, e)}
            points={obj.points || []}
            lineCap="round"
            lineJoin="round"
            tension={0.5}
          />
        );

      case 'text':
        return (
          <Text
            key={obj.id}
            {...commonProps}
            text={obj.text || '文本'}
            fontSize={obj.fontSize || 16}
            fontFamily={obj.fontFamily || 'Arial'}
            fill={obj.fill || '#333'}
            stroke={undefined}
          />
        );

      default:
        return null;
    }
  };

  return (
    <>
      {objects.map(obj => renderObject(obj))}
    </>
  );
};

export default CanvasObjects;