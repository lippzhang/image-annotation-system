import React, { useRef, useEffect } from 'react';
import { Rect, Circle, Line, Text, Arrow, Group, Transformer } from 'react-konva';
import { AnnotationObject } from '../types';
import Konva from 'konva';

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
  const transformerRef = useRef<Konva.Transformer>(null);
  const shapeRefs = useRef<{ [key: string]: Konva.Node }>({});

  // 当选中对象改变时，更新Transformer
  useEffect(() => {
    if (transformerRef.current) {
      const selectedNodes = selectedObjects.map(id => shapeRefs.current[id]).filter(Boolean);
      transformerRef.current.nodes(selectedNodes);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [selectedObjects]);

  const handleDragEnd = (id: string, e: any) => {
    if (onObjectUpdate) {
      const node = e.target;
      onObjectUpdate(id, {
        x: node.x(),
        y: node.y(),
      });
    }
  };

  const handleTransformEnd = (id: string, e: any) => {
    if (onObjectUpdate) {
      const node = e.target;
      const scaleX = node.scaleX();
      const scaleY = node.scaleY();
      
      // 重置缩放并更新实际尺寸
      node.scaleX(1);
      node.scaleY(1);
      
      const obj = objects.find(o => o.id === id);
      if (!obj) return;

      if (obj.type === 'rectangle') {
        onObjectUpdate(id, {
          x: node.x(),
          y: node.y(),
          width: Math.max(5, (obj.width || 0) * scaleX),
          height: Math.max(5, (obj.height || 0) * scaleY),
        });
      } else if (obj.type === 'circle') {
        const newRadius = Math.max(5, Math.abs(obj.width || 0) / 2 * Math.max(scaleX, scaleY));
        onObjectUpdate(id, {
          x: node.x(),
          y: node.y(),
          width: newRadius * 2,
          height: newRadius * 2,
        });
      } else if (obj.type === 'text') {
        onObjectUpdate(id, {
          x: node.x(),
          y: node.y(),
          fontSize: Math.max(8, (obj.fontSize || 16) * Math.max(scaleX, scaleY)),
        });
      }
    }
  };

  const renderObject = (obj: AnnotationObject) => {
    const commonProps = {
      x: obj.x,
      y: obj.y,
      stroke: obj.stroke || '#1890ff',
      strokeWidth: obj.strokeWidth || 2,
      onClick: () => onObjectSelect(obj.id),
      onTap: () => onObjectSelect(obj.id),
      draggable: true,
      onDragEnd: (e: any) => handleDragEnd(obj.id, e),
      onTransformEnd: (e: any) => handleTransformEnd(obj.id, e),
      ref: (node: any) => {
        if (node) {
          shapeRefs.current[obj.id] = node;
        }
      },
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
            points={obj.points || []}
            lineCap="round"
            lineJoin="round"
            onClick={() => onObjectSelect(obj.id)}
            onTap={() => onObjectSelect(obj.id)}
            draggable={true}
            onDragEnd={(e: any) => {
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
                
                // 重置位置
                e.target.x(0);
                e.target.y(0);
              }
            }}
            ref={(node: any) => {
              if (node) {
                shapeRefs.current[obj.id] = node;
              }
            }}
          />
        );

      case 'arrow':
        return (
          <Arrow
            key={obj.id}
            stroke={obj.stroke || '#1890ff'}
            strokeWidth={obj.strokeWidth || 2}
            points={obj.points || []}
            pointerLength={10}
            pointerWidth={10}
            fill={obj.stroke || '#1890ff'}
            onClick={() => onObjectSelect(obj.id)}
            onTap={() => onObjectSelect(obj.id)}
            draggable={true}
            onDragEnd={(e: any) => {
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
                
                // 重置位置
                e.target.x(0);
                e.target.y(0);
              }
            }}
            ref={(node: any) => {
              if (node) {
                shapeRefs.current[obj.id] = node;
              }
            }}
          />
        );

      case 'pen':
        return (
          <Line
            key={obj.id}
            stroke={obj.stroke || '#1890ff'}
            strokeWidth={obj.strokeWidth || 2}
            onClick={() => onObjectSelect(obj.id)}
            onTap={() => onObjectSelect(obj.id)}
            draggable={true}
            onDragEnd={(e: any) => handleDragEnd(obj.id, e)}
            points={obj.points || []}
            lineCap="round"
            lineJoin="round"
            tension={0.5}
            ref={(node: any) => {
              if (node) {
                shapeRefs.current[obj.id] = node;
              }
            }}
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
      <Transformer
        ref={transformerRef}
        boundBoxFunc={(oldBox, newBox) => {
          // 限制最小尺寸
          if (newBox.width < 5 || newBox.height < 5) {
            return oldBox;
          }
          return newBox;
        }}
      />
    </>
  );
};

export default CanvasObjects;