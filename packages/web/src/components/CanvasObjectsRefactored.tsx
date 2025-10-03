import React, { useRef, useEffect, useState } from 'react';
import { Transformer } from 'react-konva';
import { AnnotationObject } from '../types';
import Konva from 'konva';
import TextEditor from './TextEditor';
import {
  RectangleRenderer,
  CircleRenderer,
  TextRenderer,
  LineRenderer,
  StepRenderer,
  MosaicRenderer,
  GradientRenderer,
  ImageRenderer,
  BaseObjectRendererProps
} from './renderers';

interface CanvasObjectsProps {
  objects: AnnotationObject[];
  selectedObjects: string[];
  onObjectSelect: (id: string) => void;
  onObjectUpdate?: (id: string, updates: Partial<AnnotationObject>) => void;
}

const CanvasObjects: React.FC<CanvasObjectsProps> = ({
  objects,
  selectedObjects,
  onObjectSelect,
  onObjectUpdate,
}) => {
  const transformerRef = useRef<Konva.Transformer>(null);
  const shapeRefs = useRef<{ [key: string]: Konva.Node }>({});
  const [editingTextId, setEditingTextId] = useState<string | null>(null);

  // 当选中对象改变时，更新Transformer
  useEffect(() => {
    if (transformerRef.current) {
      const selectedNodes = selectedObjects
        .map(id => {
          const obj = objects.find(o => o.id === id);
          return obj && !obj.locked && editingTextId !== id ? shapeRefs.current[id] : null;
        })
        .filter((node): node is Konva.Node => node !== null);
      
      transformerRef.current.nodes(selectedNodes);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [selectedObjects, objects, editingTextId]);

  const handleDragEnd = (id: string, e: any) => {
    const obj = objects.find(o => o.id === id);
    if (obj?.locked) return;
    
    if (onObjectUpdate) {
      const node = e.target;
      onObjectUpdate(id, {
        x: node.x(),
        y: node.y(),
      });
    }
  };

  const handleTransformEnd = (id: string, e: any) => {
    const obj = objects.find(o => o.id === id);
    if (obj?.locked || editingTextId === id) return;
    
    if (onObjectUpdate) {
      const node = e.target;
      const scaleX = node.scaleX();
      const scaleY = node.scaleY();
      
      node.scaleX(1);
      node.scaleY(1);
      
      if (!obj) return;

      const updates = getTransformUpdates(obj, scaleX, scaleY, node);
      if (updates) {
        onObjectUpdate(id, updates);
      }
    }
  };

  const getTransformUpdates = (obj: AnnotationObject, scaleX: number, scaleY: number, node: any) => {
    const baseUpdates = {
      x: node.x(),
      y: node.y(),
    };

    switch (obj.type) {
      case 'rectangle':
      case 'mosaic':
      case 'gradient':
      case 'image':
        return {
          ...baseUpdates,
          width: Math.max(obj.type === 'image' ? 20 : 5, (obj.width || 0) * scaleX),
          height: Math.max(obj.type === 'image' ? 20 : 5, (obj.height || 0) * scaleY),
        };
      
      case 'circle':
        const newRadius = Math.max(5, Math.abs(obj.width || 0) / 2 * Math.max(scaleX, scaleY));
        return {
          ...baseUpdates,
          width: newRadius * 2,
          height: newRadius * 2,
        };
      
      case 'text':
        const newFontSize = Math.max(8, Math.round((obj.fontSize || 40) * Math.max(scaleX, scaleY)));
        return {
          ...baseUpdates,
          fontSize: newFontSize,
          width: (obj.width || 0) * scaleX,
          height: (obj.height || 0) * scaleY,
        };
      
      case 'step':
        const newSize = Math.max(20, Math.max((obj.width || 0) * scaleX, (obj.height || 0) * scaleY));
        return {
          ...baseUpdates,
          width: newSize,
          height: newSize,
        };
      
      default:
        return baseUpdates;
    }
  };

  const handleObjectClick = (obj: AnnotationObject) => {
    onObjectSelect(obj.id);
  };

  const handleTextDoubleClick = (obj: AnnotationObject) => {
    if (obj.type === 'text' && !obj.locked) {
      setEditingTextId(null);
      setTimeout(() => {
        setEditingTextId(obj.id);
      }, 10);
    }
  };

  const handleTextChange = (id: string, newText: string) => {
    if (onObjectUpdate) {
      onObjectUpdate(id, { text: newText });
    }
    setEditingTextId(null);
  };

  const handleTextEditClose = () => {
    setEditingTextId(null);
  };

  const getShapeRef = (id: string) => (node: any) => {
    if (node) {
      shapeRefs.current[id] = node;
    }
  };

  const getTextNodeRef = (id: string): Konva.Text | null => {
    return shapeRefs.current[id] as Konva.Text || null;
  };

  const renderObject = (obj: AnnotationObject) => {
    if (obj.visible === false) return null;
    
    const isLocked = obj.locked || false;
    const isEditing = editingTextId === obj.id;
    
    const baseProps: BaseObjectRendererProps = {
      obj,
      isSelected: selectedObjects.includes(obj.id),
      isLocked,
      isEditing,
      onObjectClick: handleObjectClick,
      onDragEnd: handleDragEnd,
      onTransformEnd: handleTransformEnd,
      shapeRef: getShapeRef(obj.id),
    };

    switch (obj.type) {
      case 'rectangle':
        return <RectangleRenderer key={obj.id} {...baseProps} />;
      
      case 'circle':
        return <CircleRenderer key={obj.id} {...baseProps} />;
      
      case 'text':
        return (
          <TextRenderer
            key={obj.id}
            {...baseProps}
            onTextDoubleClick={handleTextDoubleClick}
            onTextChange={handleTextChange}
            onTextEditClose={handleTextEditClose}
            textNodeRef={getTextNodeRef(obj.id)}
          />
        );
      
      case 'line':
      case 'arrow':
      case 'pen':
        return (
          <LineRenderer
            key={obj.id}
            {...baseProps}
            onObjectUpdate={onObjectUpdate}
          />
        );
      
      case 'step':
        return <StepRenderer key={obj.id} {...baseProps} />;
      
      case 'mosaic':
        return <MosaicRenderer key={obj.id} {...baseProps} />;
      
      case 'gradient':
        return <GradientRenderer key={obj.id} {...baseProps} />;
      
      case 'image':
        return <ImageRenderer key={obj.id} {...baseProps} />;
      
      default:
        return null;
    }
  };

  return (
    <>
      {objects.map(obj => renderObject(obj))}
      <Transformer
        ref={transformerRef}
        boundBoxFunc={(oldBox, newBox) => {
          if (newBox.width < 5 || newBox.height < 5) {
            return oldBox;
          }
          return newBox;
        }}
      />
    </>
  );
};

export default CanvasObjects;