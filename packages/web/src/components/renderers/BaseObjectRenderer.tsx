import React from 'react';
import { AnnotationObject } from '../../types';
import Konva from 'konva';

export interface BaseObjectRendererProps {
  obj: AnnotationObject;
  isSelected: boolean;
  isLocked: boolean;
  isEditing?: boolean;
  onObjectClick: (obj: AnnotationObject) => void;
  onDragEnd: (id: string, e: any) => void;
  onTransformEnd: (id: string, e: any) => void;
  shapeRef?: (node: any) => void;
}

export const getCommonProps = (props: BaseObjectRendererProps) => {
  const { obj, isLocked, onObjectClick, onDragEnd, onTransformEnd, shapeRef } = props;
  
  return {
    x: obj.x,
    y: obj.y,
    stroke: obj.stroke || '#1890ff',
    strokeWidth: obj.strokeWidth || 2,
    onClick: () => onObjectClick(obj),
    onTap: () => onObjectClick(obj),
    draggable: !isLocked,
    onDragEnd: (e: any) => onDragEnd(obj.id, e),
    onTransformEnd: (e: any) => onTransformEnd(obj.id, e),
    ref: shapeRef,
    opacity: isLocked ? 0.7 : 1,
    dash: isLocked ? [5, 5] : undefined,
  };
};