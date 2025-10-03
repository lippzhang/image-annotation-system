import React from 'react';
import { 
  Undo, 
  Redo, 
  ZoomIn, 
  ZoomOut, 
  Download, 
  Settings,
  Home
} from 'lucide-react';
import { Button, Space, Divider, Typography, Tooltip } from 'antd';
import { ToolType, BackgroundImage } from '../types';
import ImageUploader from './ImageUploader';
import ImageUrlInput from './ImageUrlInput';

const { Text } = Typography;

interface ToolbarProps {
  selectedTool: ToolType;
  onToolSelect: (tool: ToolType) => void;
  zoom: number;
  onZoom: (delta: number) => void;
  onImageLoad: (backgroundImage: BackgroundImage) => void;
  onDownload: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  fileInputRef?: React.RefObject<HTMLInputElement>;
}

const Toolbar: React.FC<ToolbarProps> = ({
  selectedTool,
  onToolSelect,
  zoom,
  onZoom,
  onImageLoad,
  onDownload,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  fileInputRef,
}) => {
  return (
    <div className="toolbar" style={{ 
      padding: '8px 16px', 
      backgroundColor: '#fff', 
      borderBottom: '1px solid #f0f0f0',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    }}>
      {/* 文件操作组 */}
      <Space size="small">
        <Tooltip title="首页">
          <Button 
            type="text" 
            icon={<Home size={16} />}
            size="small"
          />
        </Tooltip>
        <ImageUploader onImageLoad={onImageLoad} fileInputRef={fileInputRef} />
        <ImageUrlInput onImageLoad={onImageLoad} />
        <Tooltip title="下载">
          <Button 
            type="text" 
            icon={<Download size={16} />}
            onClick={onDownload}
            size="small"
          />
        </Tooltip>
      </Space>

      <Divider type="vertical" style={{ height: '20px' }} />

      {/* 编辑操作组 */}
      <Space size="small">
        <Tooltip title="撤销 (Ctrl+Z)">
          <Button 
            type="text" 
            icon={<Undo size={16} />}
            onClick={onUndo}
            disabled={!canUndo}
            size="small"
          />
        </Tooltip>
        <Tooltip title="重做 (Ctrl+Y)">
          <Button 
            type="text" 
            icon={<Redo size={16} />}
            onClick={onRedo}
            disabled={!canRedo}
            size="small"
          />
        </Tooltip>
      </Space>

      <Divider type="vertical" style={{ height: '20px' }} />

      {/* 缩放控制组 */}
      <Space size="small" style={{ 
        padding: '4px 8px', 
        backgroundColor: '#f5f5f5', 
        borderRadius: '6px',
        border: '1px solid #d9d9d9'
      }}>
        <Tooltip title="缩小">
          <Button 
            type="text" 
            icon={<ZoomOut size={14} />}
            onClick={() => onZoom(-0.1)}
            size="small"
            style={{ padding: '0 4px' }}
          />
        </Tooltip>
        <Text style={{ 
          fontSize: '12px', 
          fontWeight: 500,
          minWidth: '40px',
          textAlign: 'center',
          color: '#666'
        }}>
          {Math.round(zoom * 100)}%
        </Text>
        <Tooltip title="放大">
          <Button 
            type="text" 
            icon={<ZoomIn size={14} />}
            onClick={() => onZoom(0.1)}
            size="small"
            style={{ padding: '0 4px' }}
          />
        </Tooltip>
      </Space>

      <Divider type="vertical" style={{ height: '20px' }} />

      {/* 设置组 */}
      <Space size="small">
        <Tooltip title="设置">
          <Button 
            type="text" 
            icon={<Settings size={16} />}
            size="small"
          />
        </Tooltip>
      </Space>
    </div>
  );
};

export default Toolbar;