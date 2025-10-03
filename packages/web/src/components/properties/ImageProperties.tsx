import React from 'react';
import { Card, InputNumber, Space, Typography } from 'antd';
import { AnnotationObject } from '../../types';

const { Text } = Typography;

interface ImagePropertiesProps {
  selectedObject: AnnotationObject;
  onObjectUpdate: (updates: Partial<AnnotationObject>) => void;
}

const ImageProperties: React.FC<ImagePropertiesProps> = ({
  selectedObject,
  onObjectUpdate,
}) => {
  const handleImageUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageData = e.target?.result as string;
          const img = new Image();
          img.onload = () => {
            onObjectUpdate({
              imageData,
              imageWidth: img.width,
              imageHeight: img.height,
            });
          };
          img.src = imageData;
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const resetToOriginalRatio = () => {
    if (selectedObject.imageWidth && selectedObject.imageHeight) {
      const aspectRatio = selectedObject.imageWidth / selectedObject.imageHeight;
      const currentWidth = selectedObject.width || 100;
      const newHeight = Math.round(currentWidth / aspectRatio);
      onObjectUpdate({ height: newHeight });
    }
  };

  return (
    <>
      <div>
        <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: 4 }}>
          替换图片
        </Text>
        <button
          style={{
            width: '100%',
            padding: '8px 16px',
            border: '1px solid #d9d9d9',
            backgroundColor: '#fff',
            color: '#1890ff',
            cursor: 'pointer',
            borderRadius: '6px'
          }}
          onClick={handleImageUpload}
        >
          选择新图片
        </button>
      </div>
      
      <div>
        <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: 4 }}>
          图片尺寸
        </Text>
        <Space.Compact style={{ width: '100%' }}>
          <InputNumber
            addonBefore="宽度"
            value={Math.round(selectedObject.width || 100)}
            onChange={(value) => onObjectUpdate({ width: value || 100 })}
            min={20}
            max={800}
            style={{ width: '50%' }}
            addonAfter="px"
          />
          <InputNumber
            addonBefore="高度"
            value={Math.round(selectedObject.height || 100)}
            onChange={(value) => onObjectUpdate({ height: value || 100 })}
            min={20}
            max={600}
            style={{ width: '50%' }}
            addonAfter="px"
          />
        </Space.Compact>
      </div>

      <div>
        <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: 4 }}>
          保持比例
        </Text>
        <button
          style={{
            width: '100%',
            padding: '6px 12px',
            border: '1px solid #d9d9d9',
            backgroundColor: '#f0f0f0',
            color: '#666',
            cursor: 'pointer',
            borderRadius: '4px'
          }}
          onClick={resetToOriginalRatio}
        >
          重置为原始比例
        </button>
      </div>

      {selectedObject.imageWidth && selectedObject.imageHeight && (
        <div>
          <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: 4 }}>
            原始尺寸
          </Text>
          <Card size="small" style={{ backgroundColor: '#f5f5f5' }}>
            <Text style={{ fontSize: '12px' }}>
              {selectedObject.imageWidth} × {selectedObject.imageHeight} px
            </Text>
          </Card>
        </div>
      )}
    </>
  );
};

export default ImageProperties;