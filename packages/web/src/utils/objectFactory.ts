import { AnnotationObject, ToolType, Point } from '../types';
import { generateId } from './helpers';
import { getNextZIndex, generateLayerName } from './layerUtils';

export const createAnnotationObject = (
  tool: ToolType,
  pos: Point,
  existingObjects: AnnotationObject[]
): AnnotationObject => {
  const baseObject: AnnotationObject = {
    id: generateId(),
    type: tool,
    x: pos.x,
    y: pos.y,
    zIndex: getNextZIndex(existingObjects),
    name: generateLayerName(tool, existingObjects.length + 1),
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
      return {
        ...baseObject,
        width: 0,
        height: 0,
        fill: 'transparent',
        stroke: '#1890ff',
        strokeWidth: 2,
      };
    
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
      const stepNumber = existingObjects.filter(obj => obj.type === 'step').length + 1;
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
    
    case 'image':
      return {
        ...baseObject,
        width: 100,
        height: 100,
      };
    
    default:
      return baseObject;
  }
};

export const updateObjectOnDraw = (
  obj: AnnotationObject,
  currentPos: Point,
  startPos: Point
): AnnotationObject => {
  const updatedObject = { ...obj };

  switch (obj.type) {
    case 'rectangle':
    case 'circle':
    case 'mosaic':
    case 'gradient':
      updatedObject.width = currentPos.x - startPos.x;
      updatedObject.height = currentPos.y - startPos.y;
      break;
    
    case 'line':
    case 'arrow':
      updatedObject.points = [startPos.x, startPos.y, currentPos.x, currentPos.y];
      break;
    
    case 'pen':
      const currentPoints = obj.points || [];
      updatedObject.points = [...currentPoints, currentPos.x, currentPos.y];
      break;
    
    default:
      break;
  }

  return updatedObject;
};