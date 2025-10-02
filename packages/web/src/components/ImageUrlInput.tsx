import React, { useState } from 'react';
import { Link, X } from 'lucide-react';
import { BackgroundImage } from '../types';

interface ImageUrlInputProps {
  onImageLoad: (backgroundImage: BackgroundImage) => void;
}

const ImageUrlInput: React.FC<ImageUrlInputProps> = ({ onImageLoad }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUrlSubmit = async () => {
    if (!url.trim()) {
      setError('请输入图片URL');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const img = new Image();
      
      // 设置跨域属性
      img.crossOrigin = 'anonymous';
      
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
        setIsModalOpen(false);
        setUrl('');
        setIsLoading(false);
      };
      
      img.onerror = () => {
        setError('图片加载失败，请检查URL是否正确或图片是否支持跨域访问');
        setIsLoading(false);
      };
      
      img.src = url;
    } catch (err) {
      setError('加载图片时发生错误');
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleUrlSubmit();
    }
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setUrl('');
    setError('');
  };

  return (
    <>
      <button 
        className="toolbar-button" 
        onClick={() => setIsModalOpen(true)}
        title="通过URL设置背景图"
      >
        <Link size={16} />
      </button>

      {isModalOpen && (
        <div className="modal-overlay" onClick={handleClose}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>设置背景图URL</h3>
              <button className="modal-close" onClick={handleClose}>
                <X size={16} />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="input-group">
                <label htmlFor="imageUrl">图片URL:</label>
                <input
                  id="imageUrl"
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="https://example.com/image.jpg"
                  disabled={isLoading}
                />
              </div>
              
              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}
              
              <div className="modal-actions">
                <button 
                  className="btn-secondary" 
                  onClick={handleClose}
                  disabled={isLoading}
                >
                  取消
                </button>
                <button 
                  className="btn-primary" 
                  onClick={handleUrlSubmit}
                  disabled={isLoading || !url.trim()}
                >
                  {isLoading ? '加载中...' : '确定'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageUrlInput;