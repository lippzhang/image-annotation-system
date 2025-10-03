import React from 'react';
import { ColorPicker, InputNumber, Slider, Space, Typography } from 'antd';
import { AnnotationObject } from '../../types';
import { COLOR_PRESETS } from './constants';

const { Text } = Typography;

interface MosaicPropertiesProps {
  selectedObject: AnnotationObject;
  onObjectUpdate: (updates: Partial<AnnotationObject>) => void;
}

const MosaicProperties: React.FC<MosaicPropertiesProps> = ({
  selectedObject,
  onObjectUpdate,
}) => {
  const getOpacityFromFill = (fillColor: string): number => {
    const match = fillColor.match(/rgba?\([^)]+,\s*([^)]+)\)/);
    if (match) {
      return Math.round(parseFloat(match[1]) * 100);
    }
    return 80; // 默认透明度 80%
  };

  const updateOpacity = (value: number) => {
    const fillColor = selectedObject.fill || 'rgba(128, 128, 128, 0.8)';
    const rgbMatch = fillColor.match(/rgba?\(([^)]+)\)/);
    if (rgbMatch) {
      const rgbValues = rgbMatch[1].split(',').slice(0, 3).map(v => v.trim());
      const newAlpha = value / 100;
      const newColor = `rgba(${rgbValues.join(', ')}, ${newAlpha})`;
      onObjectUpdate({ fill: newColor });
    }
  };

  return (
    <>
      <div>
        <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: 4 }}>
          马赛克大小
        </Text>
        <Slider
          min={5}
          max={30}
          value={selectedObject.mosaicSize || 10}
          onChange={(value) => onObjectUpdate({ mosaicSize: value })}
          tooltip={{ formatter: (value) => `${value}px` }}
        />
      </div>
      
      <div>
        <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: 4 }}>
          马赛克颜色
        </Text>
        <ColorPicker
          value={selectedObject.fill || 'rgba(128, 128, 128, 0.8)'}
          onChange={(color) => onObjectUpdate({ fill: color.toRgbString() })}
          presets={COLOR_PRESETS}
          showText
          style={{ width: '100%' }}
        />
      </div>

      <div>
        <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: 4 }}>
          透明度
        </Text>
        <Slider
          min={0}
          max={100}
          value={getOpacityFromFill(selectedObject.fill || 'rgba(128, 128, 128, 0.8)')}
          onChange={updateOpacity}
          tooltip={{ formatter: (value) => `${value}%` }}
        />
      </div>
      
      <div>
        <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: 4 }}>
          区域大小
        </Text>
        <Space.Compact style={{ width: '100%' }}>
          <InputNumber
            addonBefore="宽度"
            value={Math.round(selectedObject.width || 100)}
            onChange={(value) => onObjectUpdate({ width: value || 100 })}
            min={20}
            max={500}
            style={{ width: '50%' }}
            addonAfter="px"
          />
          <InputNumber
            addonBefore="高度"
            value={Math.round(selectedObject.height || 100)}
            onChange={(value) => onObjectUpdate({ height: value || 100 })}
            min={20}
            max={500}
            style={{ width: '50%' }}
            addonAfter="px"
          />
        </Space.Compact>
      </div>
    </>
  );
};

export default MosaicProperties;