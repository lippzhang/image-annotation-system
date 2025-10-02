import React from 'react';
import { Rect, Circle, Line, Text, Arrow } from 'react-konva';
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
    const isSelected = selectedObjects.includes(obj.id);
    const commonProps = {
      x: obj.x,
      y: obj.y,
      stroke: obj.stroke || '#1890ff',
      strokeWidth: obj.strokeWidth || 2,
      onClick: () => onObjectSelect(obj.id),
      draggable: true,
      onDragEnd: (e: any) => handleDragEnd(obj.id, e),
      ...(isSelected && {
        shadowColor: '#1890ff',
        shadowBlur: 10,
        shadowOpacity: 0.6,
      }),
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
            {...(isSelected && {
              shadowColor: '#1890ff',
              shadowBlur: 10,
              shadowOpacity: 0.6,
            })}
          />
        );

      case 'arrow':
        return (
          <Arrow
            key={obj.id}
            stroke={obj.stroke || '#1890ff'}
            strokeWidth={obj.strokeWidth || 2}
            onClick={() => onObjectSelect(obj.id)}
            draggable={true}
            onDragEnd={(e: any) => handleDragEnd(obj.id, e)}
            points={obj.points || []}
            pointerLength={10}
            pointerWidth={10}
            fill={obj.stroke || '#1890ff'}
            {...(isSelected && {
              shadowColor: '#1890ff',
              shadowBlur: 10,
              shadowOpacity: 0.6,
            })}
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
            strokeWidth={0}
          />
        );

      default:
        return null;
    }
  };

  return (
    <>
      {objects.map(renderObject)}
    </>
  );
};

export default CanvasObjects;