import React from 'react';
import { Group, Circle, Text } from 'react-konva';
import { BaseObjectRendererProps, getCommonProps } from './BaseObjectRenderer';

const StepRenderer: React.FC<BaseObjectRendererProps> = (props) => {
  const { obj } = props;
  const commonProps = getCommonProps(props);
  const radius = (obj.width || 40) / 2;

  return (
    <Group {...commonProps}>
      <Circle
        radius={radius}
        fill={obj.fill || '#ffffff'}
        stroke={obj.stroke || '#ff4d4f'}
        strokeWidth={obj.strokeWidth || 2}
      />
      <Text
        text={String(obj.stepNumber || 1)}
        fontSize={radius * 0.8}
        fontFamily="Arial"
        fill={obj.stroke || '#ff4d4f'}
        fontStyle="bold"
        align="center"
        verticalAlign="middle"
        width={radius * 2}
        height={radius * 2}
        offsetX={radius}
        offsetY={radius}
        listening={false}
      />
    </Group>
  );
};

export default StepRenderer;