import React from 'react';
import { ImageIcon, Upload } from 'lucide-react';

interface EmptyCanvasProps {
  onUploadClick: () => void;
}

const EmptyCanvas: React.FC<EmptyCanvasProps> = ({ onUploadClick }) => {
  return (
    <div className="upload-hint">
      <div className="upload-hint-icon">
        <ImageIcon size={48} />
      </div>
      <div style={{ marginBottom: '8px', fontSize: '16px', fontWeight: '500' }}>
        选择背景图开始标注
      </div>
      <div style={{ fontSize: '14px', color: '#999', marginBottom: '16px' }}>
        点击上方工具栏的上传按钮选择图片
      </div>
      <button 
        onClick={onUploadClick}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          border: '1px solid #1890ff',
          borderRadius: '4px',
          background: 'white',
          color: '#1890ff',
          cursor: 'pointer',
          fontSize: '14px',
        }}
      >
        <Upload size={16} />
        选择图片
      </button>
    </div>
  );
};

export default EmptyCanvas;