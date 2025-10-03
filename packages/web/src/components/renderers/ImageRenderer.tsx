import React, { useState, useEffect } from 'react';
import { Image, Rect } from 'react-konva';
import { BaseObjectRendererProps, getCommonProps } from './BaseObjectRenderer';

const ImageRenderer: React.FC<BaseObjectRendererProps> = (props) => {
  const { obj } = props;
  const commonProps = getCommonProps(props);
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    if (obj.imageData) {
      const img = new window.Image();
      img.onload = () => {
        setImage(img);
      };
      img.src = obj.imageData;
    }
  }, [obj.imageData]);

  if (!image) {
    return (
      <Rect
        {...commonProps}
        width={obj.width || 100}
        height={obj.height || 100}
        fill="rgba(200, 200, 200, 0.5)"
        stroke="#ccc"
        strokeWidth={1}
        dash={[5, 5]}
      />
    );
  }

  return (
    <Image
      {...commonProps}
      image={image}
      width={obj.width || 100}
      height={obj.height || 100}
    />
  );
};

export default ImageRenderer;