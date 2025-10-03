import React from 'react';
import { Text } from 'react-konva';
import { BaseObjectRendererProps, getCommonProps } from './BaseObjectRenderer';
import TextEditor from '../TextEditor';
import Konva from 'konva';
import { AnnotationObject } from '@/types';

interface TextRendererProps extends BaseObjectRendererProps {
  onTextDoubleClick: (obj: AnnotationObject) => void;
  onTextChange?: (id: string, newText: string) => void;
  onTextEditClose?: () => void;
  textNodeRef?: Konva.Text | null;
}

const TextRenderer: React.FC<TextRendererProps> = (props) => {
  const { obj, isEditing, onTextDoubleClick, onTextChange, onTextEditClose, shapeRef, textNodeRef } = props;
  const commonProps = getCommonProps(props);

  return (
    <React.Fragment>
      <Text
        {...commonProps}
        text={obj.text || '文本'}
        fontSize={obj.fontSize || 40}
        fontFamily={obj.fontFamily || 'Arial'}
        fill={obj.fill || '#333'}
        stroke={undefined}
        visible={!isEditing}
        onDblClick={() => onTextDoubleClick(obj)}
        onDblTap={() => onTextDoubleClick(obj)}
        perfectDrawEnabled={false}
      />
      {isEditing && textNodeRef && onTextChange && onTextEditClose && (
        <TextEditor
          textNode={textNodeRef}
          onTextChange={(newText) => onTextChange(obj.id, newText)}
          onClose={onTextEditClose}
        />
      )}
    </React.Fragment>
  );
};

export default TextRenderer;