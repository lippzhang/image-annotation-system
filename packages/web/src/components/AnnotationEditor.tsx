import React, { useState, useRef, useCallback } from 'react';
import { Stage, Layer } from 'react-konva';
import Konva from 'konva';
import Toolbar from './Toolbar';
import Sidebar from './Sidebar';
import PropertiesPanel from './PropertiesPanel';
import CanvasObjects from './CanvasObjects';
import { CanvasState, ToolType, AnnotationObject, Point } from '../types';
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

  // 鼠标按下事件
  const handleMouseDown = useCallback((e: Konva.KonvaEventObject<MouseEvent>) => {
    if (canvasState.selectedTool === 'select') return;

    const pos = e.target.getStage()?.getPointerPosition();
    if (!pos) return;

    const newObject: AnnotationObject = {
      id: generateId(),
      type: canvasState.selectedTool,
      x: pos.x,
      y: pos.y,
      stroke: '#1890ff',
      strokeWidth: 2,
    };

    if (canvasState.selectedTool === 'rectangle' || canvasState.selectedTool === 'circle') {
      newObject.width = 0;
      newObject.height = 0;
    } else if (canvasState.selectedTool === 'line' || canvasState.selectedTool === 'arrow') {
      newObject.points = [pos.x, pos.y, pos.x, pos.y];
    } else if (canvasState.selectedTool === 'text') {
      newObject.text = '文本';
      newObject.fontSize = 16;
      newObject.fontFamily = 'Arial';
      newObject.fill = '#333';
    }

    setCurrentDrawing(newObject);
    setIsDrawing(true);
  }, [canvasState.selectedTool]);

  // 鼠标移动事件
  const handleMouseMove = useCallback((e: Konva.KonvaEventObject<MouseEvent>) => {
    if (!isDrawing || !currentDrawing) return;

    const pos = e.target.getStage()?.getPointerPosition();
    if (!pos) return;

    const updatedObject = { ...currentDrawing };

    if (currentDrawing.type === 'rectangle' || currentDrawing.type === 'circle') {
      updatedObject.width = pos.x - currentDrawing.x;
      updatedObject.height = pos.y - currentDrawing.y;
    } else if (currentDrawing.type === 'line' || currentDrawing.type === 'arrow') {
      updatedObject.points = [currentDrawing.x, currentDrawing.y, pos.x, pos.y];
    }

    setCurrentDrawing(updatedObject);
  }, [isDrawing, currentDrawing]);

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
      />
      
      <div className="editor-container">
        <Sidebar
          selectedTool={canvasState.selectedTool}
          onToolSelect={handleToolSelect}
        />
        
        <div className="canvas-container canvas-grid">
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
              <CanvasObjects
                objects={canvasState.objects}
                selectedObjects={canvasState.selectedObjects}
                onObjectSelect={handleObjectSelect}
              />
              {currentDrawing && (
                <CanvasObjects
                  objects={[currentDrawing]}
                  selectedObjects={[]}
                  onObjectSelect={() => {}}
                />
              )}
            </Layer>
          </Stage>
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