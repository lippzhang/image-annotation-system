import React, { useState, useRef, useCallback } from 'react';
import { Stage, Layer } from 'react-konva';
import Konva from 'konva';
import Toolbar from './Toolbar';
import Sidebar from './Sidebar';
import RightPanel from './RightPanel';
import CanvasObjects from './CanvasObjects';
import BackgroundImage from './BackgroundImage';
import EmptyCanvas from './EmptyCanvas';
import { CanvasState, ToolType, AnnotationObject, Point, BackgroundImage as BackgroundImageType } from '../types';
import { generateId } from '../utils/helpers';
import { getNextZIndex, sortObjectsByZIndex, generateLayerName } from '../utils/layerUtils';

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
  
  // 空格键拖拽相关状态
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [lastPointerPosition, setLastPointerPosition] = useState<Point | null>(null);

  // 历史记录管理 - 使用 refs 避免不必要的重新渲染
  const history = useRef<AnnotationObject[][]>([[]]);
  const historyStep = useRef(0);

  // 保存到历史记录
  const saveToHistory = useCallback((objects: AnnotationObject[]) => {
    // 移除当前步骤之后的所有历史记录
    history.current = history.current.slice(0, historyStep.current + 1);
    
    // 添加新的状态到历史记录
    history.current = history.current.concat([objects]);
    historyStep.current += 1;
  }, []);

  // 撤销功能
  const handleUndo = useCallback(() => {
    if (historyStep.current === 0) {
      return;
    }
    historyStep.current -= 1;
    const previousObjects = history.current[historyStep.current];
    setCanvasState(prev => ({
      ...prev,
      objects: previousObjects,
      selectedObjects: [], // 撤销时清空选择
    }));
  }, []);

  // 重做功能
  const handleRedo = useCallback(() => {
    if (historyStep.current === history.current.length - 1) {
      return;
    }
    historyStep.current += 1;
    const nextObjects = history.current[historyStep.current];
    setCanvasState(prev => ({
      ...prev,
      objects: nextObjects,
      selectedObjects: [], // 重做时清空选择
    }));
  }, []);

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
    setCanvasState(prev => {
      const oldZoom = prev.zoom;
      const newZoom = Math.max(0.1, Math.min(5, oldZoom + delta));
      
      // 如果缩放比例没有变化，直接返回
      if (newZoom === oldZoom) return prev;
      
      // 获取舞台中心点
      const centerX = stageSize.width / 2;
      const centerY = stageSize.height / 2;
      
      // 计算当前舞台的位置
      const currentX = prev.pan.x;
      const currentY = prev.pan.y;
      
      // 计算缩放中心点在世界坐标系中的位置
      const worldCenterX = (centerX - currentX) / oldZoom;
      const worldCenterY = (centerY - currentY) / oldZoom;
      
      // 计算新的舞台位置，使缩放中心点保持在屏幕中心
      const newX = centerX - worldCenterX * newZoom;
      const newY = centerY - worldCenterY * newZoom;
      
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
      // 重置缩放和平移状态
      zoom: 1,
      pan: { x: 0, y: 0 },
    }));
  }, [stageSize]);

  // 触发文件选择
  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // 下载画布内容
  const handleDownload = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;

    try {
      // 临时重置缩放和平移，获取原始尺寸的图片
      const originalZoom = canvasState.zoom;
      const originalPan = canvasState.pan;
      
      stage.scaleX(1);
      stage.scaleY(1);
      stage.x(0);
      stage.y(0);
      
      // 生成图片
      const dataURL = stage.toDataURL({
        mimeType: 'image/png',
        quality: 1,
        pixelRatio: 2, // 高清图片
      });
      
      // 恢复原始缩放和平移
      stage.scaleX(originalZoom);
      stage.scaleY(originalZoom);
      stage.x(originalPan.x);
      stage.y(originalPan.y);
      
      // 创建下载链接
      const link = document.createElement('a');
      link.download = `annotation-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.png`;
      link.href = dataURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('下载失败:', error);
      alert('下载失败，请重试');
    }
  }, [canvasState.zoom, canvasState.pan]);

  // 删除选中对象
  const handleDeleteSelected = useCallback(() => {
    if (canvasState.selectedObjects.length === 0) return;
    
    const newObjects = canvasState.objects.filter(obj => !canvasState.selectedObjects.includes(obj.id));
    saveToHistory(newObjects);
    setCanvasState(prev => ({
      ...prev,
      objects: newObjects,
      selectedObjects: [],
    }));
  }, [canvasState.objects, canvasState.selectedObjects, saveToHistory]);

  // 键盘事件
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 撤销和重做快捷键
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        handleRedo();
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        handleDeleteSelected();
      } else if (e.code === 'Space' && !isSpacePressed) {
        e.preventDefault();
        setIsSpacePressed(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setIsSpacePressed(false);
        setIsDragging(false);
        setLastPointerPosition(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleDeleteSelected, isSpacePressed, handleUndo, handleRedo]);

  // 鼠标按下事件
  const handleMouseDown = useCallback((e: Konva.KonvaEventObject<MouseEvent>) => {
    const pos = e.target.getStage()?.getPointerPosition();
    if (!pos) return;

    // 如果按住空格键或选择了拖动工具，开始拖拽画布
    if (isSpacePressed || canvasState.selectedTool === 'drag') {
      setIsDragging(true);
      setLastPointerPosition(pos);
      return;
    }

    // 如果没有背景图，不允许标注
    if (!canvasState.backgroundImage) return;
    
    // 如果是选择工具，处理选择逻辑
    if (canvasState.selectedTool === 'select') {
      // 如果点击的是空白区域（Stage或背景图），取消选择
      if (e.target === e.target.getStage() || e.target.getClassName() === 'Image') {
        setCanvasState(prev => ({
          ...prev,
          selectedObjects: [],
        }));
      }
      return;
    }
    
    // 如果点击的是已存在的标注对象，不创建新对象
    if (e.target !== e.target.getStage() && e.target.getClassName() !== 'Image') return;

    // 转换坐标，考虑缩放和平移
    const adjustedPos = {
      x: (pos.x - canvasState.pan.x) / canvasState.zoom,
      y: (pos.y - canvasState.pan.y) / canvasState.zoom,
    };

    // 获取下一个 zIndex 和生成图层名称
    const nextZIndex = getNextZIndex(canvasState.objects);
    const layerName = generateLayerName(canvasState.selectedTool, canvasState.objects.length + 1);

    const newObject: AnnotationObject = {
      id: generateId(),
      type: canvasState.selectedTool,
      x: adjustedPos.x,
      y: adjustedPos.y,
      stroke: '#ff8c00',
      strokeWidth: 6,
      // 图层属性
      zIndex: nextZIndex,
      locked: false,
      visible: true,
      name: layerName,
    };

    if (canvasState.selectedTool === 'rectangle' || canvasState.selectedTool === 'circle') {
      newObject.width = 0;
      newObject.height = 0;
    } else if (canvasState.selectedTool === 'line' || canvasState.selectedTool === 'arrow') {
      newObject.points = [adjustedPos.x, adjustedPos.y, adjustedPos.x, adjustedPos.y];
    } else if (canvasState.selectedTool === 'pen') {
      newObject.points = [adjustedPos.x, adjustedPos.y];
    } else if (canvasState.selectedTool === 'text') {
      newObject.text = '文本';
      newObject.fontSize = 40;
      newObject.fontFamily = 'Arial';
      newObject.fill = '#333';
    }

    setCurrentDrawing(newObject);
    setIsDrawing(true);
  }, [canvasState.selectedTool, canvasState.zoom, canvasState.backgroundImage, canvasState.objects, isSpacePressed]);

  // 鼠标移动事件
  const handleMouseMove = useCallback((e: Konva.KonvaEventObject<MouseEvent>) => {
    const pos = e.target.getStage()?.getPointerPosition();
    if (!pos) return;

    // 如果正在拖拽画布
    if (isDragging && lastPointerPosition) {
      const dx = pos.x - lastPointerPosition.x;
      const dy = pos.y - lastPointerPosition.y;
      
      setCanvasState(prev => ({
        ...prev,
        pan: {
          x: prev.pan.x + dx,
          y: prev.pan.y + dy,
        }
      }));
      
      setLastPointerPosition(pos);
      return;
    }

    if (!isDrawing || !currentDrawing) return;

    // 转换坐标，考虑缩放和平移
    const adjustedPos = {
      x: (pos.x - canvasState.pan.x) / canvasState.zoom,
      y: (pos.y - canvasState.pan.y) / canvasState.zoom,
    };

    const updatedObject = { ...currentDrawing };

    if (currentDrawing.type === 'rectangle' || currentDrawing.type === 'circle') {
      updatedObject.width = adjustedPos.x - currentDrawing.x;
      updatedObject.height = adjustedPos.y - currentDrawing.y;
    } else if (currentDrawing.type === 'line' || currentDrawing.type === 'arrow') {
      updatedObject.points = [currentDrawing.x, currentDrawing.y, adjustedPos.x, adjustedPos.y];
    } else if (currentDrawing.type === 'pen') {
      // 画笔工具：将新的点添加到轨迹中
      const currentPoints = currentDrawing.points || [];
      updatedObject.points = [...currentPoints, adjustedPos.x, adjustedPos.y];
    }

    setCurrentDrawing(updatedObject);
  }, [isDrawing, currentDrawing, canvasState.zoom, canvasState.pan, isDragging, lastPointerPosition]);

  // 鼠标抬起事件
  const handleMouseUp = useCallback(() => {
    // 如果正在拖拽画布，停止拖拽
    if (isDragging) {
      setIsDragging(false);
      setLastPointerPosition(null);
      return;
    }

    if (!isDrawing || !currentDrawing) return;

    const newObjects = [...canvasState.objects, currentDrawing];
    saveToHistory(newObjects);
    setCanvasState(prev => ({
      ...prev,
      objects: newObjects,
      // 绘制完成后自动切换到选择工具，并选中刚绘制的对象
      selectedTool: 'select',
      selectedObjects: [currentDrawing.id],
    }));

    setIsDrawing(false);
    setCurrentDrawing(null);
  }, [isDrawing, currentDrawing, isDragging, canvasState.objects, saveToHistory]);

  // 对象选择
  const handleObjectSelect = useCallback((id: string) => {
    setCanvasState(prev => ({
      ...prev,
      selectedObjects: [id],
    }));
  }, []);

  // 图层管理函数
  const handleObjectsUpdate = useCallback((updatedObjects: AnnotationObject[]) => {
    saveToHistory(updatedObjects);
    setCanvasState(prev => ({
      ...prev,
      objects: updatedObjects,
    }));
  }, [saveToHistory]);

  // 对象更新
  const handleObjectUpdate = useCallback((id: string, updates: Partial<AnnotationObject>) => {
    const newObjects = canvasState.objects.map(obj =>
      obj.id === id ? { ...obj, ...updates } : obj
    );
    saveToHistory(newObjects);
    setCanvasState(prev => ({
      ...prev,
      objects: newObjects,
    }));
  }, [canvasState.objects, saveToHistory]);

  const selectedObject = canvasState.objects.find(obj => 
    canvasState.selectedObjects.includes(obj.id)
  );

  // 按 zIndex 排序对象用于渲染
  const sortedObjects = sortObjectsByZIndex(canvasState.objects);

  return (
    <div className="app">
      <Toolbar
        selectedTool={canvasState.selectedTool}
        onToolSelect={handleToolSelect}
        zoom={canvasState.zoom}
        onZoom={handleZoom}
        onImageLoad={handleImageLoad}
        onDownload={handleDownload}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={historyStep.current > 0}
        canRedo={historyStep.current < history.current.length - 1}
        fileInputRef={fileInputRef}
        isSpacePressed={isSpacePressed}
      />
      
      <div className="editor-container">
        <Sidebar
          selectedTool={canvasState.selectedTool}
          onToolSelect={handleToolSelect}
        />
        
        <div 
          className={`canvas-container ${!canvasState.backgroundImage ? 'canvas-grid' : ''}`}
          style={{ 
            cursor: (isSpacePressed || canvasState.selectedTool === 'drag') ? (isDragging ? 'grabbing' : 'grab') : 'default' 
          }}
        >
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
              onMousemove={(e: Konva.KonvaEventObject<MouseEvent>) => {
                const pos = e.target.getStage()?.getPointerPosition();
                if (!pos) return;

                // 如果正在拖拽画布
                if (isDragging && lastPointerPosition) {
                  const dx = pos.x - lastPointerPosition.x;
                  const dy = pos.y - lastPointerPosition.y;
                  
                  setCanvasState(prev => ({
                    ...prev,
                    pan: {
                      x: prev.pan.x + dx,
                      y: prev.pan.y + dy,
                    }
                  }));
                  
                  setLastPointerPosition(pos);
                  return;
                }

                if (!isDrawing || !currentDrawing) return;

                // 转换坐标，考虑缩放和平移
                const adjustedPos = {
                  x: (pos.x - canvasState.pan.x) / canvasState.zoom,
                  y: (pos.y - canvasState.pan.y) / canvasState.zoom,
                };

                const updatedObject = { ...currentDrawing };

                if (currentDrawing.type === 'rectangle' || currentDrawing.type === 'circle') {
                  updatedObject.width = adjustedPos.x - currentDrawing.x;
                  updatedObject.height = adjustedPos.y - currentDrawing.y;
                } else if (currentDrawing.type === 'line' || currentDrawing.type === 'arrow') {
                  updatedObject.points = [currentDrawing.x, currentDrawing.y, adjustedPos.x, adjustedPos.y];
                } else if (currentDrawing.type === 'pen') {
                  // 画笔工具：将新的点添加到轨迹中
                  const currentPoints = currentDrawing.points || [];
                  updatedObject.points = [...currentPoints, adjustedPos.x, adjustedPos.y];
                }

                setCurrentDrawing(updatedObject);
              }}
              onMouseup={handleMouseUp}
              onWheel={(e) => {
                // 只有按住 Ctrl 键时才进行缩放
                if (e.evt.ctrlKey || e.evt.metaKey) {
                  e.evt.preventDefault();
                  const delta = e.evt.deltaY > 0 ? -0.1 : 0.1;
                  handleZoom(delta);
                }
              }}
            >
              <Layer>
                {/* 渲染背景图 */}
                <BackgroundImage backgroundImage={canvasState.backgroundImage} />
                
                {/* 渲染标注对象（按 zIndex 排序） */}
                <CanvasObjects
                  objects={sortedObjects.filter(obj => obj.visible !== false)}
                  selectedObjects={canvasState.selectedObjects}
                  onObjectSelect={handleObjectSelect}
                  onObjectUpdate={handleObjectUpdate}
                />
                
                {/* 渲染当前正在绘制的对象 */}
                {currentDrawing && (
                  <CanvasObjects
                    objects={[currentDrawing]}
                    selectedObjects={[]}
                    onObjectSelect={() => {}}
                    onObjectUpdate={() => {}}
                  />
                )}
              </Layer>
            </Stage>
          )}
        </div>
        
        <RightPanel
          objects={canvasState.objects}
          selectedObjects={canvasState.selectedObjects}
          selectedObject={selectedObject}
          onObjectsUpdate={handleObjectsUpdate}
          onObjectSelect={handleObjectSelect}
          onObjectUpdate={handleObjectUpdate}
        />
      </div>
    </div>
  );
};

export default AnnotationEditor;