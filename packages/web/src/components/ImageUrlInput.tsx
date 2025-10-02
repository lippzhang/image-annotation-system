import React, { useState } from 'react';
import { Link, X } from 'lucide-react';
import { BackgroundImage } from '../types';
import { calculateCenteredImagePosition } from '../utils/imageUtils';

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
        // 使用工具函数计算居中位置和缩放比例
        const backgroundImage = calculateCenteredImagePosition(img);
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