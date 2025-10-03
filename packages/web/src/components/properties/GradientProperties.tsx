import React from 'react';
import { ColorPicker, InputNumber, Space, Typography } from 'antd';
import { AnnotationObject } from '../../types';
import { COLOR_PRESETS } from './constants';

const { Text } = Typography;

interface GradientPropertiesProps {
  selectedObject: AnnotationObject;
  onObjectUpdate: (updates: Partial<AnnotationObject>) => void;
}

const GradientProperties: React.FC<GradientPropertiesProps> = ({
  selectedObject,
  onObjectUpdate,
}) => {
  const gradientDirections = [
    { key: 'horizontal', label: '水平' },
    { key: 'vertical', label: '垂直' },
    { key: 'diagonal', label: '对角' },
  ];

  const renderDirectionButton = (direction: { key: string; label: string }) => (
    <button
      key={direction.key}
      style={{
        width: '33.33%',
        padding: '4px 8px',
        border: '1px solid #d9d9d9',
        backgroundColor: selectedObject.gradientDirection === direction.key ? '#1890ff' : '#fff',
        color: selectedObject.gradientDirection === direction.key ? '#fff' : '#000',
        cursor: 'pointer'
      }}
      onClick={() => onObjectUpdate({ gradientDirection: direction.key as any })}
    >
      {direction.label}
    </button>
  );

  const updateGradientColor = (index: number, color: string) => {
    const currentColors = selectedObject.gradientColors || ['#ff6b6b', '#4ecdc4'];
    const newColors = [...currentColors];
    newColors[index] = color;
    onObjectUpdate({ gradientColors: newColors });
  };

  return (
    <>
      <div>
        <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: 4 }}>
          渐变方向
        </Text>
        <Space.Compact style={{ width: '100%' }}>
          {gradientDirections.map(renderDirectionButton)}
        </Space.Compact>
      </div>

      <div>
        <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: 4 }}>
          起始颜色
        </Text>
        <ColorPicker
          value={(selectedObject.gradientColors && selectedObject.gradientColors[0]) || '#ff6b6b'}
          onChange={(color) => updateGradientColor(0, color.toHexString())}
          presets={COLOR_PRESETS}
          showText
          style={{ width: '100%' }}
        />
      </div>

      <div>
        <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: 4 }}>
          结束颜色
        </Text>
        <ColorPicker
          value={(selectedObject.gradientColors && selectedObject.gradientColors[1]) || '#4ecdc4'}
          onChange={(color) => updateGradientColor(1, color.toHexString())}
          presets={COLOR_PRESETS}
          showText
          style={{ width: '100%' }}
        />
      </div>
      
      <div>
        <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: 4 }}>
          区域大小
        </Text>
        <Space.Compact style={{ width: '100%' }}>
          <InputNumber
            addonBefore="宽度"
            value={Math.round(selectedObject.width || 200)}
            onChange={(value) => onObjectUpdate({ width: value || 200 })}
            min={50}
            max={800}
            style={{ width: '50%' }}
            addonAfter="px"
          />
          <InputNumber
            addonBefore="高度"
            value={Math.round(selectedObject.height || 150)}
            onChange={(value) => onObjectUpdate({ height: value || 150 })}
            min={50}
            max={600}
            style={{ width: '50%' }}
            addonAfter="px"
          />
        </Space.Compact>
      </div>
    </>
  );
};

export default GradientProperties;