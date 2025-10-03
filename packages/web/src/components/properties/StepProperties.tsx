import React from 'react';
import { ColorPicker, InputNumber, Slider, Typography } from 'antd';
import { AnnotationObject } from '../../types';
import { COLOR_PRESETS } from './constants';

const { Text } = Typography;

interface StepPropertiesProps {
  selectedObject: AnnotationObject;
  onObjectUpdate: (updates: Partial<AnnotationObject>) => void;
}

const StepProperties: React.FC<StepPropertiesProps> = ({
  selectedObject,
  onObjectUpdate,
}) => {
  return (
    <>
      <div>
        <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: 4 }}>
          步骤编号
        </Text>
        <InputNumber
          value={selectedObject.stepNumber || 1}
          onChange={(value) => onObjectUpdate({ stepNumber: value || 1 })}
          min={1}
          max={999}
          style={{ width: '100%' }}
        />
      </div>
      
      <div>
        <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: 4 }}>
          圆圈大小
        </Text>
        <Slider
          min={20}
          max={80}
          value={selectedObject.width || 40}
          onChange={(value) => onObjectUpdate({ width: value, height: value })}
          tooltip={{ formatter: (value) => `${value}px` }}
        />
      </div>

      <div>
        <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: 4 }}>
          填充颜色
        </Text>
        <ColorPicker
          value={selectedObject.fill || '#ffffff'}
          onChange={(color) => onObjectUpdate({ fill: color.toHexString() })}
          presets={COLOR_PRESETS}
          showText
          style={{ width: '100%' }}
        />
      </div>
    </>
  );
};

export default StepProperties;