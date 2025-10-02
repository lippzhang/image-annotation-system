import React, { useState, useRef, useCallback } from 'react';
import { Stage, Layer } from 'react-konva';
import Konva from 'konva';
import Toolbar from './Toolbar';
import Sidebar from './Sidebar';
import PropertiesPanel from './PropertiesPanel';
import CanvasObjects from './CanvasObjects';
import BackgroundImage from './BackgroundImage';
import EmptyCanvas from './EmptyCanvas';
import { CanvasState, ToolType, AnnotationObject, Point, BackgroundImage as BackgroundImageType } from '../types';
import { generateId } from '../utils/helpers';

const INITIAL_STATE: CanvasState = {
  zoom: 1,
  pan: { x: 0, y: 0 },
  selectedTool: 'select',
  selectedObjects: [],
  objects: [],
  isDrawing: false,
};

const AnnotationEditor: React.FC = () => {
  const [canvasState, setCanvasState] = useState<CanvasState>(INITIAL_STATE);
  const stageRef = useRef<Konva.Stage>(null);
  const [stageSize, setStageSize] = useState({ width: 800, height: 600 });
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentDrawing, setCurrentDrawing] = useState<AnnotationObject | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 更新画布尺寸
  React.useEffect(() => {
    const updateSize = () => {
      const container = document.querySelector('.canvas-container');
      if (container) {
        const rect = container.getBoundingClientRect();
        setStageSize({
          width: rect.width,
          height: rect.height,
        });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // 当画布尺寸变化时，重新计算背景图居中位置
  React.useEffect(() => {
    if (canvasState.backgroundImage) {
      const img = canvasState.backgroundImage.image;
      const scaleX = stageSize.width / img.width;
      const scaleY = stageSize.height / img.height;
      const scale = Math.min(scaleX, scaleY, 1);
      
      const scaledWidth = img.width * scale;
      const scaledHeight = img.height * scale;
      
      const x = (stageSize.width - scaledWidth) / 2;
      const y = (stageSize.height - scaledHeight) / 2;
      
      // 只有当位置或缩放发生变化时才更新
      if (canvasState.backgroundImage.x !== x || 
          canvasState.backgroundImage.y !== y || 
          canvasState.backgroundImage.scaleX !== scale || 
          canvasState.backgroundImage.scaleY !== scale) {
        setCanvasState(prev => ({
          ...prev,
          backgroundImage: {
            ...prev.backgroundImage!,
            x: x,
            y: y,
            scaleX: scale,
            scaleY: scale,
          }
        }));
      }
    }
  }, [stageSize.width, stageSize.height, canvasState.backgroundImage?.image]);

  // 工具选择
  const handleToolSelect = useCallback((tool: ToolType) => {
    setCanvasState(prev => ({
      ...prev,
      selectedTool: tool,
      selectedObjects: [],
    }));
  }, []);

  // 缩放控制
  const handleZoom = useCallback((delta: number) => {
    const stage = stageRef.current;
    if (!stage) return;

    setCanvasState(prev => {
      const oldZoom = prev.zoom;
      const newZoom = Math.max(0.1, Math.min(5, oldZoom + delta));
      
      // 如果缩放比例没有变化，直接返回
      if (newZoom === oldZoom) return prev;
      
      // 获取舞台中心点
      const centerX = stageSize.width / 2;
      const centerY = stageSize.height / 2;
      
      // 计算当前舞台的位置
      const currentX = stage.x();
      const currentY = stage.y();
      
      // 计算缩放中心点在世界坐标系中的位置
      const worldCenterX = (centerX - currentX) / oldZoom;
      const worldCenterY = (centerY - currentY) / oldZoom;
      
      // 计算新的舞台位置，使缩放中心点保持在屏幕中心
      const newX = centerX - worldCenterX * newZoom;
      const newY = centerY - worldCenterY * newZoom;
      
      // 更新舞台位置
      stage.x(newX);
      stage.y(newY);
      
      return {
        ...prev,
        zoom: newZoom,
        pan: { x: newX, y: newY }
      };
    });
  }, [stageSize]);

  // 背景图加载处理
  const handleImageLoad = useCallback((backgroundImage: BackgroundImageType) => {
    // 使用实际的画布尺寸重新计算居中位置
    const actualCanvasSize = { width: stageSize.width, height: stageSize.height };
    
    // 重新计算居中位置
    const scaleX = actualCanvasSize.width / backgroundImage.image.width;
    const scaleY = actualCanvasSize.height / backgroundImage.image.height;
    const scale = Math.min(scaleX, scaleY, 1); // 不放大图片
    
    const scaledWidth = backgroundImage.image.width * scale;
    const scaledHeight = backgroundImage.image.height * scale;
    
    const x = (actualCanvasSize.width - scaledWidth) / 2;
    const y = (actualCanvasSize.height - scaledHeight) / 2;
    
    const centeredBackgroundImage: BackgroundImageType = {
      ...backgroundImage,
      x: x,
      y: y,
      scaleX: scale,
      scaleY: scale,
    };
    
    setCanvasState(prev => ({
      ...prev,
      backgroundImage: centeredBackgroundImage,
      // 清空现有标注对象
      objects: [],
      selectedObjects: [],
    }));
  }, [stageSize]);

  // 触发文件选择
  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // 鼠标按下事件
  const handleMouseDown = useCallback((e: Konva.KonvaEventObject<MouseEvent>) => {
    // 如果没有背景图，不允许标注
    if (!canvasState.backgroundImage) return;
    
    // 如果是选择工具，不创建新对象
    if (canvasState.selectedTool === 'select') return;
    
    // 如果点击的是已存在的标注对象，不创建新对象
    if (e.target !== e.target.getStage() && e.target.getClassName() !== 'Image') return;

    const pos = e.target.getStage()?.getPointerPosition();
    if (!pos) return;

    // 转换坐标，考虑缩放
    const adjustedPos = {
      x: pos.x / canvasState.zoom,
      y: pos.y / canvasState.zoom,
    };

    const newObject: AnnotationObject = {
      id: generateId(),
      type: canvasState.selectedTool,
      x: adjustedPos.x,
      y: adjustedPos.y,
      stroke: '#1890ff',
      strokeWidth: 2,
    };

    if (canvasState.selectedTool === 'rectangle' || canvasState.selectedTool === 'circle') {
      newObject.width = 0;
      newObject.height = 0;
    } else if (canvasState.selectedTool === 'line' || canvasState.selectedTool === 'arrow') {
      newObject.points = [adjustedPos.x, adjustedPos.y, adjustedPos.x, adjustedPos.y];
    } else if (canvasState.selectedTool === 'text') {
      newObject.text = '文本';
      newObject.fontSize = 16;
      newObject.fontFamily = 'Arial';
      newObject.fill = '#333';
    }

    setCurrentDrawing(newObject);
    setIsDrawing(true);
  }, [canvasState.selectedTool, canvasState.zoom, canvasState.backgroundImage]);

  // 鼠标移动事件
  const handleMouseMove = useCallback((e: Konva.KonvaEventObject<MouseEvent>) => {
    if (!isDrawing || !currentDrawing) return;

    const pos = e.target.getStage()?.getPointerPosition();
    if (!pos) return;

    // 转换坐标，考虑缩放
    const adjustedPos = {
      x: pos.x / canvasState.zoom,
      y: pos.y / canvasState.zoom,
    };

    const updatedObject = { ...currentDrawing };

    if (currentDrawing.type === 'rectangle' || currentDrawing.type === 'circle') {
      updatedObject.width = adjustedPos.x - currentDrawing.x;
      updatedObject.height = adjustedPos.y - currentDrawing.y;
    } else if (currentDrawing.type === 'line' || currentDrawing.type === 'arrow') {
      updatedObject.points = [currentDrawing.x, currentDrawing.y, adjustedPos.x, adjustedPos.y];
    }

    setCurrentDrawing(updatedObject);
  }, [isDrawing, currentDrawing, canvasState.zoom]);

  // 鼠标抬起事件
  const handleMouseUp = useCallback(() => {
    if (!isDrawing || !currentDrawing) return;

    setCanvasState(prev => ({
      ...prev,
      objects: [...prev.objects, currentDrawing],
    }));

    setIsDrawing(false);
    setCurrentDrawing(null);
  }, [isDrawing, currentDrawing]);

  // 对象选择
  const handleObjectSelect = useCallback((id: string) => {
    setCanvasState(prev => ({
      ...prev,
      selectedObjects: [id],
    }));
  }, []);

  // 删除选中对象
  const handleDeleteSelected = useCallback(() => {
    setCanvasState(prev => ({
      ...prev,
      objects: prev.objects.filter(obj => !prev.selectedObjects.includes(obj.id)),
      selectedObjects: [],
    }));
  }, []);

  // 键盘事件
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        handleDeleteSelected();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleDeleteSelected]);

  const selectedObject = canvasState.objects.find(obj => 
    canvasState.selectedObjects.includes(obj.id)
  );

  return (
    <div className="app">
      <Toolbar
        selectedTool={canvasState.selectedTool}
        onToolSelect={handleToolSelect}
        zoom={canvasState.zoom}
        onZoom={handleZoom}
        onImageLoad={handleImageLoad}
        fileInputRef={fileInputRef}
      />
      
      <div className="editor-container">
        <Sidebar
          selectedTool={canvasState.selectedTool}
          onToolSelect={handleToolSelect}
        />
        
        <div className={`canvas-container ${!canvasState.backgroundImage ? 'canvas-grid' : ''}`}>
          {!canvasState.backgroundImage ? (
            <EmptyCanvas onUploadClick={handleUploadClick} />
          ) : (
            <Stage
              ref={stageRef}
              width={stageSize.width}
              height={stageSize.height}
              scaleX={canvasState.zoom}
              scaleY={canvasState.zoom}
              x={canvasState.pan.x}
              y={canvasState.pan.y}
              onMouseDown={handleMouseDown}
              onMousemove={handleMouseMove}
              onMouseup={handleMouseUp}
              onWheel={(e) => {
                e.evt.preventDefault();
                const scaleBy = 1.1;
                const delta = e.evt.deltaY > 0 ? -0.1 : 0.1;
                handleZoom(delta);
              }}
            >
              <Layer>
                {/* 渲染背景图 */}
                <BackgroundImage backgroundImage={canvasState.backgroundImage} />
                
                {/* 渲染标注对象 */}
                <CanvasObjects
                  objects={canvasState.objects}
                  selectedObjects={canvasState.selectedObjects}
                  onObjectSelect={handleObjectSelect}
                  onObjectUpdate={(id, updates) => {
                    setCanvasState(prev => ({
                      ...prev,
                      objects: prev.objects.map(obj =>
                        obj.id === id ? { ...obj, ...updates } : obj
                      ),
                    }));
                  }}
                />
                
                {/* 渲染当前正在绘制的对象 */}
                {currentDrawing && (
                  <CanvasObjects
                    objects={[currentDrawing]}
                    selectedObjects={[]}
                    onObjectSelect={() => {}}
                  />
                )}
              </Layer>
            </Stage>
          )}
        </div>
        
        <PropertiesPanel
          selectedObject={selectedObject}
          onObjectUpdate={(updates) => {
            if (selectedObject) {
              setCanvasState(prev => ({
                ...prev,
                objects: prev.objects.map(obj =>
                  obj.id === selectedObject.id ? { ...obj, ...updates } : obj
                ),
              }));
            }
          }}
        />
      </div>
    </div>
  );
};

export default AnnotationEditor;