import React from 'react';
import { ColorPicker, InputNumber, Slider, Space, Typography } from 'antd';
import { AnnotationObject } from '../../types';
import { COLOR_PRESETS } from './constants';

const { Text } = Typography;

interface CommonPropertiesProps {
  selectedObject: AnnotationObject;
  onObjectUpdate: (updates: Partial<AnnotationObject>) => void;
}

const CommonProperties: React.FC<CommonPropertiesProps> = ({
  selectedObject,
  onObjectUpdate,
}) => {
  const isPathBasedTool = ['line', 'pen', 'arrow'].includes(selectedObject.type);

  const updatePathPosition = (isX: boolean, value: number) => {
    const points = selectedObject.points || [];
    if (points.length >= 2) {
      const index = isX ? 0 : 1;
      const delta = (value || 0) - points[index];
      const newPoints = [...points];
      
      // 移动所有点的坐标
      for (let i = index; i < newPoints.length; i += 2) {
        newPoints[i] += delta;
      }
      onObjectUpdate({ points: newPoints });
    }
  };

  return (
    <>
      <div>
        <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: 4 }}>
          描边颜色
        </Text>
        <ColorPicker
          value={selectedObject.stroke || '#ff8c00'}
          onChange={(color) => onObjectUpdate({ stroke: color.toHexString() })}
          presets={COLOR_PRESETS}
          showText
          style={{ width: '100%' }}
        />
      </div>

      <div>
        <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: 4 }}>
          描边宽度
        </Text>
        <Slider
          min={1}
          max={10}
          value={selectedObject.strokeWidth || 6}
          onChange={(value) => onObjectUpdate({ strokeWidth: value })}
          tooltip={{ formatter: (value) => `${value}px` }}
        />
      </div>

      <div>
        <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: 4 }}>
          位置
        </Text>
        {isPathBasedTool ? (
          <Space.Compact style={{ width: '100%' }}>
            <InputNumber
              addonBefore="起始X"
              value={selectedObject.points && selectedObject.points.length >= 2 ? Math.round(selectedObject.points[0]) : 0}
              onChange={(value) => updatePathPosition(true, value || 0)}
              style={{ width: '50%' }}
            />
            <InputNumber
              addonBefore="起始Y"
              value={selectedObject.points && selectedObject.points.length >= 2 ? Math.round(selectedObject.points[1]) : 0}
              onChange={(value) => updatePathPosition(false, value || 0)}
              style={{ width: '50%' }}
            />
          </Space.Compact>
        ) : (
          <Space.Compact style={{ width: '100%' }}>
            <InputNumber
              addonBefore="X"
              value={Math.round(selectedObject.x)}
              onChange={(value) => onObjectUpdate({ x: value || 0 })}
              style={{ width: '50%' }}
            />
            <InputNumber
              addonBefore="Y"
              value={Math.round(selectedObject.y)}
              onChange={(value) => onObjectUpdate({ y: value || 0 })}
              style={{ width: '50%' }}
            />
          </Space.Compact>
        )}
      </div>
    </>
  );
};

export default CommonProperties;