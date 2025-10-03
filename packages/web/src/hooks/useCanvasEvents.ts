import { useState, useCallback, useRef } from 'react';
import { AnnotationObject, Point, ToolType, CanvasState } from '../types';
import { generateId } from '../utils/helpers';
import { getNextZIndex, generateLayerName } from '../utils/layerUtils';

export const useCanvasEvents = (
  canvasState: CanvasState,
  setCanvasState: React.Dispatch<React.SetStateAction<CanvasState>>,
  saveToHistory: (objects: AnnotationObject[]) => void
) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentDrawing, setCurrentDrawing] = useState<AnnotationObject | null>(null);
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [lastPointerPosition, setLastPointerPosition] = useState<Point | null>(null);

  const createNewObject = useCallback((tool: ToolType, pos: Point): AnnotationObject => {
    const baseObject: AnnotationObject = {
      id: generateId(),
      type: tool,
      x: pos.x,
      y: pos.y,
      zIndex: getNextZIndex(canvasState.objects),
      name: generateLayerName(tool, canvasState.objects.length + 1),
    };

    switch (tool) {
      case 'text':
        return {
          ...baseObject,
          text: '文本',
          fontSize: 40,
          fontFamily: 'Arial',
          fill: '#333',
          width: 100,
          height: 50,
        };
      
      case 'rectangle':
      case 'circle':
        return {
          ...baseObject,
          width: 0,
          height: 0,
          fill: 'transparent',
          stroke: '#1890ff',
          strokeWidth: 2,
        };
      
      case 'line':
      case 'arrow':
        return {
          ...baseObject,
          points: [pos.x, pos.y, pos.x, pos.y],
          stroke: '#1890ff',
          strokeWidth: 2,
        };
      
      case 'pen':
        return {
          ...baseObject,
          points: [pos.x, pos.y],
          stroke: '#1890ff',
          strokeWidth: 2,
        };
      
      case 'step':
        const stepNumber = canvasState.objects.filter((obj: AnnotationObject) => obj.type === 'step').length + 1;
        return {
          ...baseObject,
          stepNumber,
          width: 40,
          height: 40,
          fill: '#ffffff',
          stroke: '#ff4d4f',
          strokeWidth: 2,
        };
      
      case 'mosaic':
        return {
          ...baseObject,
          width: 100,
          height: 100,
          fill: 'rgba(128, 128, 128, 0.8)',
          stroke: '#666666',
          strokeWidth: 1,
          mosaicSize: 10,
        };
      
      case 'gradient':
        return {
          ...baseObject,
          width: 200,
          height: 100,
          gradientColors: ['#ff6b6b', '#4ecdc4'],
          gradientDirection: 'horizontal' as const,
        };
      
      default:
        return baseObject;
    }
  }, [canvasState.objects]);

  const handleImageUpload = useCallback((pos: Point) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageData = e.target?.result as string;
          const img = new Image();
          img.onload = () => {
            const imageObject: AnnotationObject = {
              ...createNewObject('image', pos),
              imageData,
              imageWidth: img.width,
              imageHeight: img.height,
              width: Math.min(img.width, 300),
              height: Math.min(img.height, 300),
            };
            
            const newObjects = [...canvasState.objects, imageObject];
            saveToHistory(newObjects);
            setCanvasState((prev) => ({
              ...prev,
              objects: newObjects,
              selectedTool: 'select',
              selectedObjects: [imageObject.id],
            }));
          };
          img.src = imageData;
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  }, [canvasState.objects, createNewObject, saveToHistory, setCanvasState]);

  const handleMouseDown = useCallback((e: any) => {
    const pos = e.target.getStage()?.getPointerPosition();
    if (!pos) return;

    if (isSpacePressed || canvasState.selectedTool === 'drag') {
      setIsDragging(true);
      setLastPointerPosition(pos);
      return;
    }

    if (!canvasState.backgroundImage) return;
    
    if (canvasState.selectedTool === 'select') {
      if (e.target === e.target.getStage() || e.target.getClassName() === 'Image') {
        setCanvasState((prev) => ({
          ...prev,
          selectedObjects: [],
        }));
      }
      return;
    }
    
    if (e.target !== e.target.getStage() && e.target.getClassName() !== 'Image') return;

    const adjustedPos = {
      x: (pos.x - canvasState.pan.x) / canvasState.zoom,
      y: (pos.y - canvasState.pan.y) / canvasState.zoom,
    };

    if (canvasState.selectedTool === 'image') {
      handleImageUpload(adjustedPos);
      return;
    }

    const newObject = createNewObject(canvasState.selectedTool, adjustedPos);
    setCurrentDrawing(newObject);
    setIsDrawing(true);
  }, [canvasState, isSpacePressed, createNewObject, handleImageUpload, setCanvasState]);

  const handleMouseMove = useCallback((pos: Point) => {
    if (isDragging && lastPointerPosition) {
      const dx = pos.x - lastPointerPosition.x;
      const dy = pos.y - lastPointerPosition.y;
      
      setCanvasState((prev) => ({
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
      const currentPoints = currentDrawing.points || [];
      updatedObject.points = [...currentPoints, adjustedPos.x, adjustedPos.y];
    } else if (currentDrawing.type === 'mosaic' || currentDrawing.type === 'gradient') {
      updatedObject.width = adjustedPos.x - currentDrawing.x;
      updatedObject.height = adjustedPos.y - currentDrawing.y;
    }

    setCurrentDrawing(updatedObject);
  }, [isDrawing, currentDrawing, canvasState.zoom, canvasState.pan, isDragging, lastPointerPosition, setCanvasState]);

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      setLastPointerPosition(null);
      return;
    }

    if (!isDrawing || !currentDrawing) return;

    const newObjects = [...canvasState.objects, currentDrawing];
    saveToHistory(newObjects);
    setCanvasState((prev) => ({
      ...prev,
      objects: newObjects,
      selectedTool: 'select',
      selectedObjects: [currentDrawing.id],
    }));

    setIsDrawing(false);
    setCurrentDrawing(null);
  }, [isDrawing, currentDrawing, isDragging, canvasState.objects, saveToHistory, setCanvasState]);

  return {
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
  };
};
