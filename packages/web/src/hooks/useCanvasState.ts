import { useState, useRef, useCallback } from 'react';
import { CanvasState, ToolType, AnnotationObject, BackgroundImage } from '../types';
import { getNextZIndex, generateLayerName } from '../utils/layerUtils';

const INITIAL_STATE: CanvasState = {
  zoom: 1,
  pan: { x: 0, y: 0 },
  selectedTool: 'select',
  selectedObjects: [],
  objects: [],
  isDrawing: false,
};

export const useCanvasState = () => {
  const [canvasState, setCanvasState] = useState<CanvasState>(INITIAL_STATE);
  
  // 历史记录管理
  const history = useRef<AnnotationObject[][]>([[]]);
  const historyStep = useRef(0);

  const saveToHistory = useCallback((objects: AnnotationObject[]) => {
    history.current = history.current.slice(0, historyStep.current + 1);
    history.current = history.current.concat([objects]);
    historyStep.current += 1;
  }, []);

  const handleUndo = useCallback(() => {
    if (historyStep.current === 0) return;
    
    historyStep.current -= 1;
    const previousObjects = history.current[historyStep.current];
    setCanvasState(prev => ({
      ...prev,
      objects: previousObjects,
      selectedObjects: [],
    }));
  }, []);

  const handleRedo = useCallback(() => {
    if (historyStep.current === history.current.length - 1) return;
    
    historyStep.current += 1;
    const nextObjects = history.current[historyStep.current];
    setCanvasState(prev => ({
      ...prev,
      objects: nextObjects,
      selectedObjects: [],
    }));
  }, []);

  const handleToolSelect = useCallback((tool: ToolType) => {
    setCanvasState(prev => ({
      ...prev,
      selectedTool: tool,
      selectedObjects: [],
    }));
  }, []);

  const handleZoom = useCallback((delta: number, stageSize: { width: number; height: number }) => {
    setCanvasState(prev => {
      const oldZoom = prev.zoom;
      const newZoom = Math.max(0.1, Math.min(5, oldZoom + delta));
      
      if (newZoom === oldZoom) return prev;
      
      const centerX = stageSize.width / 2;
      const centerY = stageSize.height / 2;
      const currentX = prev.pan.x;
      const currentY = prev.pan.y;
      const worldCenterX = (centerX - currentX) / oldZoom;
      const worldCenterY = (centerY - currentY) / oldZoom;
      const newX = centerX - worldCenterX * newZoom;
      const newY = centerY - worldCenterY * newZoom;
      
      return {
        ...prev,
        zoom: newZoom,
        pan: { x: newX, y: newY }
      };
    });
  }, []);

  const handleImageLoad = useCallback((backgroundImage: BackgroundImage, stageSize: { width: number; height: number }) => {
    const scaleX = stageSize.width / backgroundImage.image.width;
    const scaleY = stageSize.height / backgroundImage.image.height;
    const scale = Math.min(scaleX, scaleY, 1);
    
    const scaledWidth = backgroundImage.image.width * scale;
    const scaledHeight = backgroundImage.image.height * scale;
    const x = (stageSize.width - scaledWidth) / 2;
    const y = (stageSize.height - scaledHeight) / 2;
    
    const centeredBackgroundImage: BackgroundImage = {
      ...backgroundImage,
      x: x,
      y: y,
      scaleX: scale,
      scaleY: scale,
    };
    
    setCanvasState(prev => ({
      ...prev,
      backgroundImage: centeredBackgroundImage,
      objects: [],
      selectedObjects: [],
      zoom: 1,
      pan: { x: 0, y: 0 },
    }));
  }, []);

  const handleObjectSelect = useCallback((id: string) => {
    setCanvasState(prev => ({
      ...prev,
      selectedObjects: [id],
    }));
  }, []);

  const handleObjectsUpdate = useCallback((updatedObjects: AnnotationObject[]) => {
    saveToHistory(updatedObjects);
    setCanvasState(prev => ({
      ...prev,
      objects: updatedObjects,
    }));
  }, [saveToHistory]);

  const handleObjectUpdate = useCallback((id: string, updates: Partial<AnnotationObject>) => {
    setCanvasState(prev => {
      const newObjects = prev.objects.map(obj =>
        obj.id === id ? { ...obj, ...updates } : obj
      );
      saveToHistory(newObjects);
      return {
        ...prev,
        objects: newObjects,
      };
    });
  }, [saveToHistory]);

  const handleDeleteSelected = useCallback(() => {
    setCanvasState(prev => {
      if (prev.selectedObjects.length === 0) return prev;
      
      const newObjects = prev.objects.filter(obj => !prev.selectedObjects.includes(obj.id));
      saveToHistory(newObjects);
      return {
        ...prev,
        objects: newObjects,
        selectedObjects: [],
      };
    });
  }, [saveToHistory]);

  const updatePan = useCallback((deltaX: number, deltaY: number) => {
    setCanvasState(prev => ({
      ...prev,
      pan: {
        x: prev.pan.x + deltaX,
        y: prev.pan.y + deltaY,
      }
    }));
  }, []);

  return {
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
    canUndo: historyStep.current > 0,
    canRedo: historyStep.current < history.current.length - 1,
    saveToHistory,
  };
};