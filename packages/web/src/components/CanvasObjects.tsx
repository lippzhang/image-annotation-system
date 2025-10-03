import React, { useRef, useEffect, useState } from 'react';
import { Rect, Circle, Line, Text, Arrow, Group, Transformer, Image } from 'react-konva';
import { AnnotationObject } from '../types';
import Konva from 'konva';
import TextEditor from './TextEditor';

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
  const [editingTextId, setEditingTextId] = useState<string | null>(null);

  // 当选中对象改变时，更新Transformer
  useEffect(() => {
    if (transformerRef.current) {
      // 只对未锁定且未在编辑状态的选中对象应用 Transformer
      const selectedNodes = selectedObjects
        .map(id => {
          const obj = objects.find(o => o.id === id);
          // 排除锁定的对象和正在编辑的文本对象
          return obj && !obj.locked && editingTextId !== id ? shapeRefs.current[id] : null;
        })
        .filter((node): node is Konva.Node => node !== null);
      
      transformerRef.current.nodes(selectedNodes);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [selectedObjects, objects, editingTextId]); // 添加 editingTextId 依赖

  const handleDragEnd = (id: string, e: any) => {
    const obj = objects.find(o => o.id === id);
    if (obj?.locked) return; // 锁定的对象不能拖拽
    
    if (onObjectUpdate) {
      const node = e.target;
      onObjectUpdate(id, {
        x: node.x(),
        y: node.y(),
      });
    }
  };

  const handleTransformEnd = (id: string, e: any) => {
    const obj = objects.find(o => o.id === id);
    if (obj?.locked || editingTextId === id) return; // 锁定的对象或正在编辑的对象不能变换
    
    if (onObjectUpdate) {
      const node = e.target;
      const scaleX = node.scaleX();
      const scaleY = node.scaleY();
      
      // 重置缩放并更新实际尺寸
      node.scaleX(1);
      node.scaleY(1);
      
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
        // 优化文本变换处理
        const newFontSize = Math.max(8, Math.round((obj.fontSize || 40) * Math.max(scaleX, scaleY)));
        onObjectUpdate(id, {
          x: node.x(),
          y: node.y(),
          fontSize: newFontSize,
          // 保持文本的宽度和高度同步更新
          width: (obj.width || 0) * scaleX,
          height: (obj.height || 0) * scaleY,
        });
      } else if (obj.type === 'mosaic') {
        // 马赛克工具变换处理
        onObjectUpdate(id, {
          x: node.x(),
          y: node.y(),
          width: Math.max(20, (obj.width || 0) * scaleX),
          height: Math.max(20, (obj.height || 0) * scaleY),
        });
      } else if (obj.type === 'step') {
        // 步骤工具变换处理 - 保持圆形比例
        const newSize = Math.max(20, Math.max((obj.width || 0) * scaleX, (obj.height || 0) * scaleY));
        onObjectUpdate(id, {
          x: node.x(),
          y: node.y(),
          width: newSize,
          height: newSize,
        });
      } else if (obj.type === 'gradient') {
        // 渐变工具变换处理
        onObjectUpdate(id, {
          x: node.x(),
          y: node.y(),
          width: Math.max(50, (obj.width || 0) * scaleX),
          height: Math.max(50, (obj.height || 0) * scaleY),
        });
      }
    }
  };

  const handleObjectClick = (obj: AnnotationObject) => {
    // 锁定的对象也可以被选中，但不能编辑
    onObjectSelect(obj.id);
  };

  // 处理文本双击编辑
  const handleTextDoubleClick = (obj: AnnotationObject) => {
    if (obj.type === 'text' && !obj.locked) {
      // 确保清除之前的编辑状态
      setEditingTextId(null);
      // 延迟设置新的编辑状态，确保组件重新渲染
      setTimeout(() => {
        setEditingTextId(obj.id);
      }, 10);
    }
  };

  // 处理文本编辑完成
  const handleTextChange = (id: string, newText: string) => {
    if (onObjectUpdate) {
      onObjectUpdate(id, { text: newText });
    }
    setEditingTextId(null);
  };

  // 处理文本编辑取消
  const handleTextEditClose = () => {
    setEditingTextId(null);
  };

  const renderObject = (obj: AnnotationObject) => {
    // 如果对象不可见，不渲染
    if (obj.visible === false) return null;
    
    const isLocked = obj.locked || false;
    const isEditing = editingTextId === obj.id;
    
    const commonProps = {
      x: obj.x,
      y: obj.y,
      stroke: obj.stroke || '#1890ff',
      strokeWidth: obj.strokeWidth || 2,
      onClick: () => handleObjectClick(obj),
      onTap: () => handleObjectClick(obj),
      draggable: !isLocked, // 锁定的对象不能拖拽
      onDragEnd: (e: any) => handleDragEnd(obj.id, e),
      onTransformEnd: (e: any) => handleTransformEnd(obj.id, e),
      ref: (node: any) => {
        if (node) {
          shapeRefs.current[obj.id] = node;
        }
      },
      // 锁定的对象显示不同的样式
      opacity: isLocked ? 0.7 : 1,
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
            dash={isLocked ? [5, 5] : undefined} // 锁定时显示虚线
          />
        );

      case 'circle':
        return (
          <Circle
            key={obj.id}
            {...commonProps}
            radius={Math.abs(obj.width || 0) / 2}
            fill="transparent"
            dash={isLocked ? [5, 5] : undefined} // 锁定时显示虚线
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
            onClick={() => handleObjectClick(obj)}
            onTap={() => handleObjectClick(obj)}
            draggable={!isLocked}
            opacity={isLocked ? 0.7 : 1}
            dash={isLocked ? [5, 5] : undefined}
            onDragEnd={(e: any) => {
              if (isLocked) return;
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
            onClick={() => handleObjectClick(obj)}
            onTap={() => handleObjectClick(obj)}
            draggable={!isLocked}
            opacity={isLocked ? 0.7 : 1}
            dash={isLocked ? [5, 5] : undefined}
            onDragEnd={(e: any) => {
              if (isLocked) return;
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
            onClick={() => handleObjectClick(obj)}
            onTap={() => handleObjectClick(obj)}
            draggable={!isLocked}
            opacity={isLocked ? 0.7 : 1}
            dash={isLocked ? [5, 5] : undefined}
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
          <React.Fragment key={obj.id}>
            <Text
              {...commonProps}
              text={obj.text || '文本'}
              fontSize={obj.fontSize || 40}
              fontFamily={obj.fontFamily || 'Arial'}
              fill={obj.fill || '#333'}
              stroke={undefined}
              visible={!isEditing} // 编辑时隐藏文本
              onDblClick={() => handleTextDoubleClick(obj)}
              onDblTap={() => handleTextDoubleClick(obj)}
              // 确保文本对象可以被 Transformer 正确处理
              perfectDrawEnabled={false}
            />
            {isEditing && shapeRefs.current[obj.id] && (
              <TextEditor
                textNode={shapeRefs.current[obj.id] as Konva.Text}
                onTextChange={(newText) => handleTextChange(obj.id, newText)}
                onClose={handleTextEditClose}
              />
            )}
          </React.Fragment>
        );

      case 'step':
        const radius = (obj.width || 40) / 2;
        return (
          <Group key={obj.id} {...commonProps}>
            {/* 步骤圆圈背景 */}
            <Circle
              radius={radius}
              fill={obj.fill || '#ffffff'}
              stroke={obj.stroke || '#ff4d4f'}
              strokeWidth={obj.strokeWidth || 2}
              dash={isLocked ? [5, 5] : undefined}
            />
            {/* 步骤数字 */}
            <Text
              text={String(obj.stepNumber || 1)}
              fontSize={radius * 0.8} // 根据圆圈大小调整字体
              fontFamily="Arial"
              fill={obj.stroke || '#ff4d4f'}
              fontStyle="bold"
              align="center"
              verticalAlign="middle"
              width={radius * 2}
              height={radius * 2}
              offsetX={radius}
              offsetY={radius}
              listening={false} // 数字文本不响应事件
            />
          </Group>
        );

      case 'mosaic':
        return (
          <Group key={obj.id} {...commonProps}>
            {/* 马赛克背景矩形 */}
            <Rect
              width={Math.abs(obj.width || 0)}
              height={Math.abs(obj.height || 0)}
              fill={obj.fill || 'rgba(128, 128, 128, 0.8)'}
              stroke={obj.stroke || '#666666'}
              strokeWidth={obj.strokeWidth || 1}
              dash={isLocked ? [5, 5] : undefined}
            />
            {/* 马赛克像素效果 - 使用小方块模拟 */}
            {(() => {
              const mosaicSize = obj.mosaicSize || 10;
              const width = Math.abs(obj.width || 0);
              const height = Math.abs(obj.height || 0);
              const cols = Math.ceil(width / mosaicSize);
              const rows = Math.ceil(height / mosaicSize);
              const pixels = [];
              
              // 解析用户设置的颜色
              const baseColor = obj.fill || 'rgba(128, 128, 128, 0.8)';
              let baseR = 128, baseG = 128, baseB = 128, baseA = 0.8;
              
              // 从 rgba 或 rgb 字符串中提取颜色值
              const rgbaMatch = baseColor.match(/rgba?\(([^)]+)\)/);
              if (rgbaMatch) {
                const values = rgbaMatch[1].split(',').map(v => parseFloat(v.trim()));
                baseR = values[0] || 128;
                baseG = values[1] || 128;
                baseB = values[2] || 128;
                baseA = values[3] !== undefined ? values[3] : 1;
              }
              
              for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                  const pixelX = col * mosaicSize;
                  const pixelY = row * mosaicSize;
                  const pixelWidth = Math.min(mosaicSize, width - pixelX);
                  const pixelHeight = Math.min(mosaicSize, height - pixelY);
                  
                  if (pixelWidth > 0 && pixelHeight > 0) {
                    // 基于对象ID和像素位置生成稳定的随机变化
                    const seed = obj.id.charCodeAt(0) + row * 31 + col * 17; // 使用对象ID和位置生成稳定的种子
                    const pseudoRandom = (seed * 9301 + 49297) % 233280 / 233280; // 简单的伪随机数生成
                    const variation = (pseudoRandom - 0.5) * 60; // -30 到 +30 的变化
                    const pixelR = Math.max(0, Math.min(255, baseR + variation));
                    const pixelG = Math.max(0, Math.min(255, baseG + variation));
                    const pixelB = Math.max(0, Math.min(255, baseB + variation));
                    
                    pixels.push(
                      <Rect
                        key={`${row}-${col}`}
                        x={pixelX}
                        y={pixelY}
                        width={pixelWidth}
                        height={pixelHeight}
                        fill={`rgba(${Math.round(pixelR)}, ${Math.round(pixelG)}, ${Math.round(pixelB)}, ${baseA})`}
                        stroke="rgba(0,0,0,0.1)"
                        strokeWidth={0.5}
                        listening={false}
                      />
                    );
                  }
                }
              }
              
              return pixels;
            })()}
          </Group>
        );

      case 'gradient':
        return (
          <Rect
            key={obj.id}
            {...commonProps}
            width={Math.abs(obj.width || 0)}
            height={Math.abs(obj.height || 0)}
            fillLinearGradientStartPoint={(() => {
              const direction = obj.gradientDirection || 'horizontal';
              const width = Math.abs(obj.width || 0);
              const height = Math.abs(obj.height || 0);
              
              switch (direction) {
                case 'vertical':
                  return { x: 0, y: 0 };
                case 'diagonal':
                  return { x: 0, y: 0 };
                default: // horizontal
                  return { x: 0, y: 0 };
              }
            })()}
            fillLinearGradientEndPoint={(() => {
              const direction = obj.gradientDirection || 'horizontal';
              const width = Math.abs(obj.width || 0);
              const height = Math.abs(obj.height || 0);
              
              switch (direction) {
                case 'vertical':
                  return { x: 0, y: height };
                case 'diagonal':
                  return { x: width, y: height };
                default: // horizontal
                  return { x: width, y: 0 };
              }
            })()}
            fillLinearGradientColorStops={(() => {
              const colors = obj.gradientColors || ['#ff6b6b', '#4ecdc4'];
              const stops = [];
              for (let i = 0; i < colors.length; i++) {
                stops.push(i / (colors.length - 1), colors[i]);
              }
              return stops;
            })()}
            dash={isLocked ? [5, 5] : undefined}
          />
        );

      case 'image':
        return (
          <ImageComponent
            key={obj.id}
            obj={obj}
            commonProps={commonProps}
            isLocked={isLocked}
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

// 贴图组件
const ImageComponent: React.FC<{
  obj: AnnotationObject;
  commonProps: any;
  isLocked: boolean;
}> = ({ obj, commonProps, isLocked }) => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    if (obj.imageData) {
      const img = new window.Image();
      img.onload = () => {
        setImage(img);
      };
      img.src = obj.imageData;
    }
  }, [obj.imageData]);

  if (!image) {
    // 图片加载中，显示占位符
    return (
      <Rect
        {...commonProps}
        width={obj.width || 100}
        height={obj.height || 100}
        fill="rgba(200, 200, 200, 0.5)"
        stroke="#ccc"
        strokeWidth={1}
        dash={[5, 5]}
      />
    );
  }

  return (
    <Image
      {...commonProps}
      image={image}
      width={obj.width || 100}
      height={obj.height || 100}
      opacity={isLocked ? 0.7 : 1}
    />
  );
};

export default CanvasObjects;