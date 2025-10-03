import React from 'react';
import { Rect } from 'react-konva';
import { BaseObjectRendererProps, getCommonProps } from './BaseObjectRenderer';

const RectangleRenderer: React.FC<BaseObjectRendererProps> = (props) => {
  const { obj } = props;
  const commonProps = getCommonProps(props);

  return (
    <Rect
      {...commonProps}
      width={obj.width || 0}
      height={obj.height || 0}
      fill="transparent"
    />
  );
};

export default RectangleRenderer;