import React from 'react';
import { Rect, Circle, Line, Text, Arrow } from 'react-konva';
import { AnnotationObject } from '../types';

interface CanvasObjectsProps {
  objects: AnnotationObject[];
  selectedObjects: string[];
  onObjectSelect: (id: string) => void;
}

const CanvasObjects: React.FC<CanvasObjectsProps> = ({
  objects,
  selectedObjects,
  onObjectSelect,
}) => {
  const renderObject = (obj: AnnotationObject) => {
    const isSelected = selectedObjects.includes(obj.id);
    const commonProps = {
      key: obj.id,
      x: obj.x,
      y: obj.y,
      stroke: obj.stroke || '#1890ff',
      strokeWidth: obj.strokeWidth || 2,
      onClick: () => onObjectSelect(obj.id),
      draggable: true,
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
            {...commonProps}
            width={obj.width || 0}
            height={obj.height || 0}
            fill="transparent"
          />
        );

      case 'circle':
        return (
          <Circle
            {...commonProps}
            radius={Math.abs(obj.width || 0) / 2}
            fill="transparent"
          />
        );

      case 'line':
        return (
          <Line
            {...commonProps}
            points={obj.points || []}
            lineCap="round"
            lineJoin="round"
          />
        );

      case 'arrow':
        return (
          <Arrow
            {...commonProps}
            points={obj.points || []}
            pointerLength={10}
            pointerWidth={10}
            fill={obj.stroke || '#1890ff'}
          />
        );

      case 'text':
        return (
          <Text
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