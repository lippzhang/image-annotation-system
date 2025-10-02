import React from 'react';
import { Image } from 'react-konva';
import { BackgroundImage as BackgroundImageType } from '../types';

interface BackgroundImageProps {
  backgroundImage: BackgroundImageType;
}

const BackgroundImage: React.FC<BackgroundImageProps> = ({ backgroundImage }) => {
  return (
    <Image
      image={backgroundImage.image}
      x={backgroundImage.x}
      y={backgroundImage.y}
      width={backgroundImage.width}
      height={backgroundImage.height}
      scaleX={backgroundImage.scaleX}
      scaleY={backgroundImage.scaleY}
      listening={false} // 背景图不响应鼠标事件
      opacity={0.9} // 稍微透明，便于标注
    />
  );
};

export default BackgroundImage;