import React from 'react';
import { Group, Rect } from 'react-konva';
import { BaseObjectRendererProps, getCommonProps } from './BaseObjectRenderer';

const MosaicRenderer: React.FC<BaseObjectRendererProps> = (props) => {
  const { obj } = props;
  const commonProps = getCommonProps(props);

  const generateMosaicPixels = () => {
    const mosaicSize = obj.mosaicSize || 10;
    const width = Math.abs(obj.width || 0);
    const height = Math.abs(obj.height || 0);
    const cols = Math.ceil(width / mosaicSize);
    const rows = Math.ceil(height / mosaicSize);
    const pixels = [];
    
    const baseColor = obj.fill || 'rgba(128, 128, 128, 0.8)';
    let baseR = 128, baseG = 128, baseB = 128, baseA = 0.8;
    
    const rgbaMatch = baseColor.match(/rgba?\(([^)]+)\)/);
    if (rgbaMatch) {
      const values = rgbaMatch[1].split(',').map(v => parseFloat(v.trim()));
      baseR = values[0] || 128;
      baseG = values[1] || 128;
      baseB = values[2] || 128;
      baseA = values[3] !== undefined ? values[3] : 1;
    }
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const pixelX = col * mosaicSize;
        const pixelY = row * mosaicSize;
        const pixelWidth = Math.min(mosaicSize, width - pixelX);
        const pixelHeight = Math.min(mosaicSize, height - pixelY);
        
        if (pixelWidth > 0 && pixelHeight > 0) {
          const seed = obj.id.charCodeAt(0) + row * 31 + col * 17;
          const pseudoRandom = (seed * 9301 + 49297) % 233280 / 233280;
          const variation = (pseudoRandom - 0.5) * 60;
          const pixelR = Math.max(0, Math.min(255, baseR + variation));
          const pixelG = Math.max(0, Math.min(255, baseG + variation));
          const pixelB = Math.max(0, Math.min(255, baseB + variation));
          
          pixels.push(
            <Rect
              key={`${row}-${col}`}
              x={pixelX}
              y={pixelY}
              width={pixelWidth}
              height={pixelHeight}
              fill={`rgba(${Math.round(pixelR)}, ${Math.round(pixelG)}, ${Math.round(pixelB)}, ${baseA})`}
              stroke="rgba(0,0,0,0.1)"
              strokeWidth={0.5}
              listening={false}
            />
          );
        }
      }
    }
    
    return pixels;
  };

  return (
    <Group {...commonProps}>
      <Rect
        width={Math.abs(obj.width || 0)}
        height={Math.abs(obj.height || 0)}
        fill={obj.fill || 'rgba(128, 128, 128, 0.8)'}
        stroke={obj.stroke || '#666666'}
        strokeWidth={obj.strokeWidth || 1}
      />
      {generateMosaicPixels()}
    </Group>
  );
};

export default MosaicRenderer;