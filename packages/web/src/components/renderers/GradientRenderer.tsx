import React from 'react';
import { Rect } from 'react-konva';
import { BaseObjectRendererProps, getCommonProps } from './BaseObjectRenderer';

const GradientRenderer: React.FC<BaseObjectRendererProps> = (props) => {
  const { obj } = props;
  const commonProps = getCommonProps(props);

  const getGradientPoints = () => {
    const direction = obj.gradientDirection || 'horizontal';
    const width = Math.abs(obj.width || 0);
    const height = Math.abs(obj.height || 0);
    
    switch (direction) {
      case 'vertical':
        return {
          start: { x: 0, y: 0 },
          end: { x: 0, y: height }
        };
      case 'diagonal':
        return {
          start: { x: 0, y: 0 },
          end: { x: width, y: height }
        };
      default: // horizontal
        return {
          start: { x: 0, y: 0 },
          end: { x: width, y: 0 }
        };
    }
  };

  const getColorStops = () => {
    const colors = obj.gradientColors || ['#ff6b6b', '#4ecdc4'];
    const stops = [];
    for (let i = 0; i < colors.length; i++) {
      stops.push(i / (colors.length - 1), colors[i]);
    }
    return stops;
  };

  const gradientPoints = getGradientPoints();

  return (
    <Rect
      {...commonProps}
      width={Math.abs(obj.width || 0)}
      height={Math.abs(obj.height || 0)}
      fillLinearGradientStartPoint={gradientPoints.start}
      fillLinearGradientEndPoint={gradientPoints.end}
      fillLinearGradientColorStops={getColorStops()}
    />
  );
};

export default GradientRenderer;