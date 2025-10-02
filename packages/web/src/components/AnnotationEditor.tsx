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
    setCanvasState(prev => ({
      ...prev,
      zoom: Math.max(0.1, Math.min(5, prev.zoom + delta)),
    }));
  }, []);

  // 背景图加载处理
  const handleImageLoad = useCallback((backgroundImage: BackgroundImageType) => {
    setCanvasState(prev => ({
      ...prev,
      backgroundImage,
      // 清空现有标注对象
      objects: [],
      selectedObjects: [],
    }));
  }, []);

  // 触发文件选择
  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // 鼠标按下事件
  const handleMouseDown = useCallback((e: Konva.KonvaEventObject<MouseEvent>) => {
    // 如果没有背景图，不允许标注
    if (!canvasState.backgroundImage) return;
    
    // 如果点击的是背景图或者是选择工具，不创建新对象
    if (canvasState.selectedTool === 'select' || e.target === e.target.getStage()) return;

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
              onMouseDown={handleMouseDown}
              onMousemove={handleMouseMove}
              onMouseup={handleMouseUp}
            >
              <Layer>
                {/* 渲染背景图 */}
                <BackgroundImage backgroundImage={canvasState.backgroundImage} />
                
                {/* 渲染标注对象 */}
                <CanvasObjects
                  objects={canvasState.objects}
                  selectedObjects={canvasState.selectedObjects}
                  onObjectSelect={handleObjectSelect}
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