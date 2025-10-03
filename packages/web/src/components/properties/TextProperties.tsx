import React from 'react';
import { ColorPicker, Input, InputNumber, Typography } from 'antd';
import { AnnotationObject } from '../../types';
import { COLOR_PRESETS } from './constants';

const { Text } = Typography;

interface TextPropertiesProps {
  selectedObject: AnnotationObject;
  onObjectUpdate: (updates: Partial<AnnotationObject>) => void;
}

const TextProperties: React.FC<TextPropertiesProps> = ({
  selectedObject,
  onObjectUpdate,
}) => {
  return (
    <>
      <div>
        <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: 4 }}>
          文本内容
        </Text>
        <Input
          value={selectedObject.text || ''}
          onChange={(e) => onObjectUpdate({ text: e.target.value })}
          placeholder="请输入文本内容"
        />
      </div>
      
      <div>
        <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: 4 }}>
          字体大小
        </Text>
        <InputNumber
          value={selectedObject.fontSize || 40}
          onChange={(value) => onObjectUpdate({ fontSize: value || 40 })}
          min={8}
          max={200}
          style={{ width: '100%' }}
          addonAfter="px"
        />
      </div>

      <div>
        <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: 4 }}>
          字体颜色
        </Text>
        <ColorPicker
          value={selectedObject.fill || '#333333'}
          onChange={(color) => onObjectUpdate({ fill: color.toHexString() })}
          presets={COLOR_PRESETS}
          showText
          style={{ width: '100%' }}
        />
      </div>
    </>
  );
};

export default TextProperties;