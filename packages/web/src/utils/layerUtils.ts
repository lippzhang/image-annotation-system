import { AnnotationObject } from '../types';

/**
 * 图层管理工具函数
 */

// 获取下一个可用的 zIndex
export const getNextZIndex = (objects: AnnotationObject[]): number => {
  if (objects.length === 0) return 1;
  const maxZIndex = Math.max(...objects.map(obj => obj.zIndex || 0));
  return maxZIndex + 1;
};

// 移动图层到顶部
export const moveToTop = (objects: AnnotationObject[], targetId: string): AnnotationObject[] => {
  const maxZIndex = Math.max(...objects.map(obj => obj.zIndex || 0));
  return objects.map(obj => 
    obj.id === targetId 
      ? { ...obj, zIndex: maxZIndex + 1 }
      : obj
  );
};

// 移动图层到底部
export const moveToBottom = (objects: AnnotationObject[], targetId: string): AnnotationObject[] => {
  const minZIndex = Math.min(...objects.map(obj => obj.zIndex || 0));
  const newZIndex = Math.min(0, minZIndex - 1);
  
  return objects.map(obj => 
    obj.id === targetId 
      ? { ...obj, zIndex: newZIndex }
      : obj
  );
};

// 向上移动一层
export const moveUp = (objects: AnnotationObject[], targetId: string): AnnotationObject[] => {
  const sortedObjects = [...objects].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));
  const targetIndex = sortedObjects.findIndex(obj => obj.id === targetId);
  
  if (targetIndex === -1 || targetIndex === sortedObjects.length - 1) {
    return objects; // 已经在最顶层或找不到对象
  }
  
  const targetObject = sortedObjects[targetIndex];
  const upperObject = sortedObjects[targetIndex + 1];
  const newZIndex = (upperObject.zIndex || 0) + 1;
  
  return objects.map(obj => 
    obj.id === targetId 
      ? { ...obj, zIndex: newZIndex }
      : obj
  );
};

// 向下移动一层
export const moveDown = (objects: AnnotationObject[], targetId: string): AnnotationObject[] => {
  const sortedObjects = [...objects].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));
  const targetIndex = sortedObjects.findIndex(obj => obj.id === targetId);
  
  if (targetIndex === -1 || targetIndex === 0) {
    return objects; // 已经在最底层或找不到对象
  }
  
  const targetObject = sortedObjects[targetIndex];
  const lowerObject = sortedObjects[targetIndex - 1];
  const newZIndex = (lowerObject.zIndex || 0) - 1;
  
  return objects.map(obj => 
    obj.id === targetId 
      ? { ...obj, zIndex: newZIndex }
      : obj
  );
};

// 设置特定的 zIndex
export const setZIndex = (objects: AnnotationObject[], targetId: string, zIndex: number): AnnotationObject[] => {
  return objects.map(obj => 
    obj.id === targetId 
      ? { ...obj, zIndex }
      : obj
  );
};

// 切换图层锁定状态
export const toggleLock = (objects: AnnotationObject[], targetId: string): AnnotationObject[] => {
  return objects.map(obj => 
    obj.id === targetId 
      ? { ...obj, locked: !obj.locked }
      : obj
  );
};

// 切换图层可见性
export const toggleVisibility = (objects: AnnotationObject[], targetId: string): AnnotationObject[] => {
  return objects.map(obj => 
    obj.id === targetId 
      ? { ...obj, visible: obj.visible !== false ? false : true }
      : obj
  );
};

// 根据 zIndex 排序对象（用于渲染顺序）
export const sortObjectsByZIndex = (objects: AnnotationObject[]): AnnotationObject[] => {
  return [...objects].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));
};

// 生成图层名称
export const generateLayerName = (type: string, index: number): string => {
  const typeNames: { [key: string]: string } = {
    rectangle: '矩形',
    circle: '圆形',
    line: '直线',
    arrow: '箭头',
    pen: '手绘',
    text: '文本',
    select: '选择',
    eraser: '橡皮擦',
    measure: '测量'
  };
  
  return `${typeNames[type] || type} ${index}`;
};