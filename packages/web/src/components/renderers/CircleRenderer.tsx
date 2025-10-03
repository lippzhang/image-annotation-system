import React from 'react';
import { Circle } from 'react-konva';
import { BaseObjectRendererProps, getCommonProps } from './BaseObjectRenderer';

const CircleRenderer: React.FC<BaseObjectRendererProps> = (props) => {
  const { obj } = props;
  const commonProps = getCommonProps(props);

  return (
    <Circle
      {...commonProps}
      radius={Math.abs(obj.width || 0) / 2}
      fill="transparent"
    />
  );
};

export default CircleRenderer;