import React, { useState, useRef, useCallback } from 'react';
import { Stage, Layer } from 'react-konva';
import Konva from 'konva';
import Toolbar from './Toolbar';
import Sidebar from './Sidebar';
import RightPanel from './RightPanel';
import CanvasObjects from './CanvasObjectsRefactored';
import BackgroundImage from './BackgroundImage';
import EmptyCanvas from './EmptyCanvas';
import { BackgroundImage as BackgroundImageType } from '../types';
import { sortObjectsByZIndex } from '../utils/layerUtils';
import { useCanvasState } from '../hooks/useCanvasState';
import { useCanvasEvents } from '../hooks/useCanvasEvents';
import { useKeyboardEvents } from '../hooks/useKeyboardEvents';

const AnnotationEditor: React.FC = () => {
  const {
    canvasState,
    setCanvasState,
    handleUndo,
    handleRedo,
    handleToolSelect,
    handleZoom,
    handleImageLoad,
    handleObjectSelect,
    handleObjectsUpdate,
    handleObjectUpdate,
    handleDeleteSelected,
    updatePan,
    canUndo,
    canRedo,
    saveToHistory,
  } = useCanvasState();

  const {
    isDrawing,
    currentDrawing,
    isSpacePressed,
    setIsSpacePressed,
    isDragging,
    setIsDragging,
    setLastPointerPosition,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  } = useCanvasEvents(canvasState, setCanvasState, saveToHistory);

  const stageRef = useRef<Konva.Stage>(null);
  const [stageSize, setStageSize] = useState({ width: 800, height: 600 });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 键盘事件处理
  useKeyboardEvents({
    onUndo: handleUndo,
    onRedo: handleRedo,
    onDelete: handleDeleteSelected,
    isSpacePressed,
    setIsSpacePressed,
    setIsDragging,
    setLastPointerPosition,
  });

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

  // 缩放控制（包装原有函数以传递 stageSize）
  const handleZoomWithSize = useCallback((delta: number) => {
    handleZoom(delta, stageSize);
  }, [handleZoom, stageSize]);

  // 背景图加载处理（包装原有函数以传递 stageSize）
  const handleImageLoadWithSize = useCallback((backgroundImage: BackgroundImageType) => {
    handleImageLoad(backgroundImage, stageSize);
  }, [handleImageLoad, stageSize]);

  // 触发文件选择
  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // 下载画布内容
  const handleDownload = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;

    try {
      const originalZoom = canvasState.zoom;
      const originalPan = canvasState.pan;
      
      stage.scaleX(1);
      stage.scaleY(1);
      stage.x(0);
      stage.y(0);
      
      const dataURL = stage.toDataURL({
        mimeType: 'image/png',
        quality: 1,
        pixelRatio: 2,
      });
      
      stage.scaleX(originalZoom);
      stage.scaleY(originalZoom);
      stage.x(originalPan.x);
      stage.y(originalPan.y);
      
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

  // 鼠标事件处理器
  const handleStageMouseDown = useCallback((e: Konva.KonvaEventObject<MouseEvent>) => {
    handleMouseDown(e);
  }, [handleMouseDown]);

  const handleStageMouseMove = useCallback((e: Konva.KonvaEventObject<MouseEvent>) => {
    const pos = e.target.getStage()?.getPointerPosition();
    if (pos) {
      handleMouseMove(pos);
    }
  }, [handleMouseMove]);

  const handleStageMouseUp = useCallback(() => {
    handleMouseUp();
  }, [handleMouseUp]);

  // 滚轮缩放处理
  const handleWheel = useCallback((e: Konva.KonvaEventObject<WheelEvent>) => {
    if (e.evt.ctrlKey || e.evt.metaKey) {
      e.evt.preventDefault();
      const delta = e.evt.deltaY > 0 ? -0.1 : 0.1;
      handleZoomWithSize(delta);
    }
  }, [handleZoomWithSize]);

  const selectedObject = canvasState.objects.find(obj => 
    canvasState.selectedObjects.includes(obj.id)
  );

  const sortedObjects = sortObjectsByZIndex(canvasState.objects);

  return (
    <div className="app">
      <Toolbar
        selectedTool={canvasState.selectedTool}
        onToolSelect={handleToolSelect}
        zoom={canvasState.zoom}
        onZoom={handleZoomWithSize}
        onImageLoad={handleImageLoadWithSize}
        onDownload={handleDownload}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={canUndo}
        canRedo={canRedo}
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
              onMouseDown={handleStageMouseDown}
              onMousemove={handleStageMouseMove}
              onMouseup={handleStageMouseUp}
              onWheel={handleWheel}
            >
              <Layer>
                <BackgroundImage backgroundImage={canvasState.backgroundImage} />
                
                <CanvasObjects
                  objects={sortedObjects.filter(obj => obj.visible !== false)}
                  selectedObjects={canvasState.selectedObjects}
                  onObjectSelect={handleObjectSelect}
                  onObjectUpdate={handleObjectUpdate}
                />
                
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