import React, { useRef } from 'react';
import { Upload } from 'lucide-react';
import { BackgroundImage } from '../types';
import { calculateCenteredImagePosition } from '../utils/imageUtils';

interface ImageUploaderProps {
  onImageLoad: (backgroundImage: BackgroundImage) => void;
  fileInputRef?: React.RefObject<HTMLInputElement>;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageLoad, fileInputRef }) => {
  const internalFileInputRef = useRef<HTMLInputElement>(null);
  const actualFileInputRef = fileInputRef || internalFileInputRef;

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 检查文件类型
    if (!file.type.startsWith('image/')) {
      alert('请选择图片文件');
      return;
    }

    // 检查文件大小（限制为50MB）
    if (file.size > 50 * 1024 * 1024) {
      alert('图片文件大小不能超过50MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // 使用工具函数计算居中位置和缩放比例
        const backgroundImage = calculateCenteredImagePosition(img);
        onImageLoad(backgroundImage);
      };
      
      img.onerror = () => {
        alert('图片加载失败，请选择其他图片');
      };
      
      img.src = e.target?.result as string;
    };
    
    reader.onerror = () => {
      alert('文件读取失败');
    };
    
    reader.readAsDataURL(file);
    
    // 清空input值，允许重复选择同一文件
    if (actualFileInputRef.current) {
      actualFileInputRef.current.value = '';
    }
  };

  const handleUploadClick = () => {
    actualFileInputRef.current?.click();
  };

  return (
    <>
      <input
        ref={actualFileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />
      <button 
        className="toolbar-button" 
        onClick={handleUploadClick}
        title="选择背景图"
      >
        <Upload size={16} />
      </button>
    </>
  );
};

export default ImageUploader;