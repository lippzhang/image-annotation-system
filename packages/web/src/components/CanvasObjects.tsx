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

  // 处理标注对象拖拽过程中的实时更新
  const handleDragMove = (id: string, e: any) => {
    if (onObjectUpdate) {
      const obj = objects.find(o => o.id === id);
      if (!obj) return;

      const newX = e.target.x();
      const newY = e.target.y();
      
      // 对于线条和箭头，不需要特殊处理，让 Konva 自己处理拖拽
      // 只更新基础的 x, y 坐标即可
      onObjectUpdate(id, {
        x: newX,
        y: newY,
      });
    }
  };

  // 渲染调整控制点
  const renderResizeHandles = (obj: AnnotationObject) => {
    if (!selectedObjects.includes(obj.id)) return null;
    
    const handleSize = 8;
    const handleColor = '#1890ff';
    const handleStroke = '#fff';
    const handleStrokeWidth = 2;

    const handles = [];
    
    if (obj.type === 'rectangle') {
      const width = obj.width || 0;
      const height = obj.height || 0;
      const x = obj.x || 0;
      const y = obj.y || 0;
      
      // 四个角的控制点
      const corners = [
        { x: x, y: y, cursor: 'nw-resize', position: 'top-left' },
        { x: x + width, y: y, cursor: 'ne-resize', position: 'top-right' },
        { x: x + width, y: y + height, cursor: 'se-resize', position: 'bottom-right' },
        { x: x, y: y + height, cursor: 'sw-resize', position: 'bottom-left' },
      ];
      
      // 四边中点的控制点
      const edges = [
        { x: x + width / 2, y: y, cursor: 'n-resize', position: 'top' },
        { x: x + width, y: y + height / 2, cursor: 'e-resize', position: 'right' },
        { x: x + width / 2, y: y + height, cursor: 's-resize', position: 'bottom' },
        { x: x, y: y + height / 2, cursor: 'w-resize', position: 'left' },
      ];
      
      [...corners, ...edges].forEach((handle, index) => {
        handles.push(
          <Rect
            key={`handle-${obj.id}-${index}`}
            x={handle.x - handleSize / 2}
            y={handle.y - handleSize / 2}
            width={handleSize}
            height={handleSize}
            fill={handleColor}
            stroke={handleStroke}
            strokeWidth={handleStrokeWidth}
            draggable={true}
            onDragMove={(e) => {
              const newX = e.target.x() + handleSize / 2;
              const newY = e.target.y() + handleSize / 2;
              
              if (onObjectUpdate) {
                let updates: Partial<AnnotationObject> = {};
                
                switch (handle.position) {
                  case 'top-left':
                    updates = {
                      x: newX,
                      y: newY,
                      width: (x + width) - newX,
                      height: (y + height) - newY,
                    };
                    break;
                  case 'top-right':
                    updates = {
                      y: newY,
                      width: newX - x,
                      height: (y + height) - newY,
                    };
                    break;
                  case 'bottom-right':
                    updates = {
                      width: newX - x,
                      height: newY - y,
                    };
                    break;
                  case 'bottom-left':
                    updates = {
                      x: newX,
                      width: (x + width) - newX,
                      height: newY - y,
                    };
                    break;
                  case 'top':
                    updates = {
                      y: newY,
                      height: (y + height) - newY,
                    };
                    break;
                  case 'right':
                    updates = {
                      width: newX - x,
                    };
                    break;
                  case 'bottom':
                    updates = {
                      height: newY - y,
                    };
                    break;
                  case 'left':
                    updates = {
                      x: newX,
                      width: (x + width) - newX,
                    };
                    break;
                }
                
                onObjectUpdate(obj.id, updates);
              }
            }}
          />
        );
      });
    } else if (obj.type === 'circle') {
      const radius = Math.abs(obj.width || 0) / 2;
      const centerX = obj.x || 0;
      const centerY = obj.y || 0;
      
      // 圆形的四个方向控制点
      const circleHandles = [
        { x: centerX, y: centerY - radius, position: 'top' },
        { x: centerX + radius, y: centerY, position: 'right' },
        { x: centerX, y: centerY + radius, position: 'bottom' },
        { x: centerX - radius, y: centerY, position: 'left' },
      ];
      
      circleHandles.forEach((handle, index) => {
        handles.push(
          <Circle
            key={`handle-${obj.id}-${index}`}
            x={handle.x}
            y={handle.y}
            radius={handleSize / 2}
            fill={handleColor}
            stroke={handleStroke}
            strokeWidth={handleStrokeWidth}
            draggable={true}
            onDragMove={(e) => {
              const newX = e.target.x();
              const newY = e.target.y();
              
              // 计算新的半径
              const newRadius = Math.sqrt(
                Math.pow(newX - centerX, 2) + Math.pow(newY - centerY, 2)
              );
              
              if (onObjectUpdate) {
                onObjectUpdate(obj.id, {
                  width: newRadius * 2,
                  height: newRadius * 2,
                });
              }
            }}
          />
        );
      });
    } else if (obj.type === 'line' || obj.type === 'arrow') {
      const points = obj.points || [];
      if (points.length >= 4) {
        // 线条的起点和终点控制点 - 使用绝对坐标
        const lineHandles = [
          { x: points[0], y: points[1], position: 'start' },
          { x: points[2], y: points[3], position: 'end' },
        ];
        
        lineHandles.forEach((handle, index) => {
          handles.push(
            <Circle
              key={`handle-${obj.id}-${index}`}
              x={handle.x}
              y={handle.y}
              radius={handleSize / 2}
              fill={handleColor}
              stroke={handleStroke}
              strokeWidth={handleStrokeWidth}
              draggable={true}
              onDragMove={(e) => {
                const newX = e.target.x();
                const newY = e.target.y();
                
                if (onObjectUpdate) {
                  const newPoints = [...points];
                  if (handle.position === 'start') {
                    newPoints[0] = newX;
                    newPoints[1] = newY;
                  } else {
                    newPoints[2] = newX;
                    newPoints[3] = newY;
                  }
                  
                  onObjectUpdate(obj.id, {
                    points: newPoints,
                  });
                }
              }}
            />
          );
        });
      }
    }
    
    return handles;
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
      onDragMove: (e: any) => handleDragMove(obj.id, e),
      // 选中时添加轻微的阴影效果
      ...(isSelected && {
        shadowColor: '#1890ff',
        shadowBlur: 5,
        shadowOpacity: 0.3,
      }),
    };

    const objectElement = (() => {
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
            <Group key={`line-group-${obj.id}`}>
              {/* 线条本身 */}
              <Line
                stroke={obj.stroke || '#1890ff'}
                strokeWidth={obj.strokeWidth || 2}
                points={obj.points || []}
                lineCap="round"
                lineJoin="round"
                {...(isSelected && {
                  shadowColor: '#1890ff',
                  shadowBlur: 5,
                  shadowOpacity: 0.3,
                })}
              />
              {/* 透明的拖拽区域 */}
              <Line
                stroke="transparent"
                strokeWidth={Math.max(10, (obj.strokeWidth || 2) + 8)}
                points={obj.points || []}
                lineCap="round"
                lineJoin="round"
                onClick={() => onObjectSelect(obj.id)}
                draggable={true}
                onDragStart={(e) => {
                  // 记录拖拽开始时的位置
                  e.target.setAttr('dragStartX', e.target.x());
                  e.target.setAttr('dragStartY', e.target.y());
                }}
                onDragMove={(e) => {
                  const currentX = e.target.x();
                  const currentY = e.target.y();
                  const startX = e.target.getAttr('dragStartX') || 0;
                  const startY = e.target.getAttr('dragStartY') || 0;
                  
                  const deltaX = currentX - startX;
                  const deltaY = currentY - startY;
                  
                  if (onObjectUpdate && obj.points && obj.points.length >= 4) {
                    const originalPoints = obj.points;
                    const newPoints = [];
                    
                    for (let i = 0; i < originalPoints.length; i += 2) {
                      newPoints[i] = originalPoints[i] + deltaX;
                      newPoints[i + 1] = originalPoints[i + 1] + deltaY;
                    }
                    
                    onObjectUpdate(obj.id, {
                      points: newPoints,
                    });
                  }
                }}
                onDragEnd={(e) => {
                  // 重置拖拽元素位置
                  e.target.x(0);
                  e.target.y(0);
                  e.target.setAttr('dragStartX', 0);
                  e.target.setAttr('dragStartY', 0);
                }}
              />
            </Group>
          );

        case 'arrow':
          return (
            <Group key={`arrow-group-${obj.id}`}>
              {/* 箭头本身 */}
              <Arrow
                stroke={obj.stroke || '#1890ff'}
                strokeWidth={obj.strokeWidth || 2}
                points={obj.points || []}
                pointerLength={10}
                pointerWidth={10}
                fill={obj.stroke || '#1890ff'}
                {...(isSelected && {
                  shadowColor: '#1890ff',
                  shadowBlur: 5,
                  shadowOpacity: 0.3,
                })}
              />
              {/* 透明的拖拽区域 */}
              <Line
                stroke="transparent"
                strokeWidth={Math.max(10, (obj.strokeWidth || 2) + 8)}
                points={obj.points || []}
                lineCap="round"
                lineJoin="round"
                onClick={() => onObjectSelect(obj.id)}
                draggable={true}
                onDragStart={(e) => {
                  // 记录拖拽开始时的位置
                  e.target.setAttr('dragStartX', e.target.x());
                  e.target.setAttr('dragStartY', e.target.y());
                }}
                onDragMove={(e) => {
                  const currentX = e.target.x();
                  const currentY = e.target.y();
                  const startX = e.target.getAttr('dragStartX') || 0;
                  const startY = e.target.getAttr('dragStartY') || 0;
                  
                  const deltaX = currentX - startX;
                  const deltaY = currentY - startY;
                  
                  if (onObjectUpdate && obj.points && obj.points.length >= 4) {
                    const originalPoints = obj.points;
                    const newPoints = [];
                    
                    for (let i = 0; i < originalPoints.length; i += 2) {
                      newPoints[i] = originalPoints[i] + deltaX;
                      newPoints[i + 1] = originalPoints[i + 1] + deltaY;
                    }
                    
                    onObjectUpdate(obj.id, {
                      points: newPoints,
                    });
                  }
                }}
                onDragEnd={(e) => {
                  // 重置拖拽元素位置
                  e.target.x(0);
                  e.target.y(0);
                  e.target.setAttr('dragStartX', 0);
                  e.target.setAttr('dragStartY', 0);
                }}
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
              onDragMove={(e: any) => handleDragMove(obj.id, e)}
              points={obj.points || []}
              lineCap="round"
              lineJoin="round"
              tension={0.5}
              {...(isSelected && {
                shadowColor: '#1890ff',
                shadowBlur: 5,
                shadowOpacity: 0.3,
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
    })();

    return (
      <Group key={`group-${obj.id}`}>
        {objectElement}
        {renderResizeHandles(obj)}
      </Group>
    );
  };

  return (
    <>
      {objects.map(renderObject)}
    </>
  );
};

export default CanvasObjects;