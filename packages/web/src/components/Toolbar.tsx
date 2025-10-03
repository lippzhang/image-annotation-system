import React from 'react';
import { 
  Undo, 
  Redo, 
  ZoomIn, 
  ZoomOut, 
  Download, 
  Settings,
  Home,
  MousePointer,
  Hand,
  Layers,
  Plus
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
  isSpacePressed?: boolean;
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
  isSpacePressed = false,
}) => {
  return (
    <div style={{ 
      padding: '8px 16px', 
      backgroundColor: '#fff', 
      borderBottom: '1px solid #f0f0f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%'
    }}>
      {/* 左侧：文件操作组 */}
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

      {/* 中间：核心工具组 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        borderRadius: '12px',
        padding: '6px 8px',
        border: '1px solid #e9ecef',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
      }}>
        <Space size={4}>
          {/* 撤销重做 */}
          <Tooltip title="撤销 (Ctrl+Z)">
            <Button 
              type="text" 
              icon={<Undo size={16} />}
              onClick={onUndo}
              disabled={!canUndo}
              size="small"
              style={{ 
                borderRadius: '8px',
                color: canUndo ? '#495057' : '#adb5bd'
              }}
            />
          </Tooltip>
          <Tooltip title="重做 (Ctrl+Y)">
            <Button 
              type="text" 
              icon={<Redo size={16} />}
              onClick={onRedo}
              disabled={!canRedo}
              size="small"
              style={{ 
                borderRadius: '8px',
                color: canRedo ? '#495057' : '#adb5bd'
              }}
            />
          </Tooltip>

          <Divider type="vertical" style={{ height: '16px', margin: '0 4px' }} />

          {/* 选择和拖动工具 */}
          <Tooltip title="选择工具">
            <Button 
              type={selectedTool === 'select' ? 'primary' : 'text'}
              icon={<MousePointer size={16} />}
              onClick={() => onToolSelect('select')}
              size="small"
              style={{ 
                borderRadius: '8px',
                backgroundColor: selectedTool === 'select' ? '#ff9500' : 'transparent',
                borderColor: selectedTool === 'select' ? '#ff9500' : 'transparent',
                color: selectedTool === 'select' ? '#fff' : '#495057'
              }}
            />
          </Tooltip>
          <Tooltip title="拖动工具">
            <Button 
              type={selectedTool === 'drag' || isSpacePressed ? 'primary' : 'text'}
              icon={<Hand size={16} />}
              onClick={() => onToolSelect('drag')}
              size="small"
              style={{ 
                borderRadius: '8px',
                backgroundColor: selectedTool === 'drag' || isSpacePressed ? '#ff9500' : 'transparent',
                borderColor: selectedTool === 'drag' || isSpacePressed ? '#ff9500' : 'transparent',
                color: selectedTool === 'drag' || isSpacePressed ? '#fff' : '#495057'
              }}
            />
          </Tooltip>
          <Tooltip title="图层">
            <Button 
              type="text"
              icon={<Layers size={16} />}
              size="small"
              style={{ 
                borderRadius: '8px',
                color: '#495057'
              }}
            />
          </Tooltip>

          <Divider type="vertical" style={{ height: '16px', margin: '0 4px' }} />

          {/* 缩放控制 */}
          <Tooltip title="缩小">
            <Button 
              type="text" 
              icon={<ZoomOut size={14} />}
              onClick={() => onZoom(-0.1)}
              size="small"
              style={{ 
                borderRadius: '8px',
                color: '#495057'
              }}
            />
          </Tooltip>
          <Text style={{ 
            fontSize: '12px', 
            fontWeight: 500,
            minWidth: '35px',
            textAlign: 'center',
            color: '#495057',
            padding: '0 4px'
          }}>
            {Math.round(zoom * 100)}%
          </Text>
          <Tooltip title="放大">
            <Button 
              type="text" 
              icon={<ZoomIn size={14} />}
              onClick={() => onZoom(0.1)}
              size="small"
              style={{ 
                borderRadius: '8px',
                color: '#495057'
              }}
            />
          </Tooltip>
          <Tooltip title="添加">
            <Button 
              type="text" 
              icon={<Plus size={14} />}
              size="small"
              style={{ 
                borderRadius: '8px',
                color: '#495057'
              }}
            />
          </Tooltip>
        </Space>
      </div>

      {/* 右侧：设置组 */}
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