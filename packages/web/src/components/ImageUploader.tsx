import React, { useRef } from 'react';
import { Upload } from 'lucide-react';
import { BackgroundImage } from '../types';

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

    // 检查文件大小（限制为10MB）
    if (file.size > 10 * 1024 * 1024) {
      alert('图片文件大小不能超过10MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // 计算合适的缩放比例，使图片适应画布
        const maxWidth = 800;
        const maxHeight = 600;
        
        let scaleX = 1;
        let scaleY = 1;
        
        if (img.width > maxWidth) {
          scaleX = maxWidth / img.width;
        }
        if (img.height > maxHeight) {
          scaleY = maxHeight / img.height;
        }
        
        // 使用较小的缩放比例，保持图片比例
        const scale = Math.min(scaleX, scaleY);
        
        const backgroundImage: BackgroundImage = {
          image: img,
          width: img.width,
          height: img.height,
          x: 0,
          y: 0,
          scaleX: scale,
          scaleY: scale,
        };
        
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