import React from 'react';
import { 
  Undo, 
  Redo, 
  ZoomIn, 
  ZoomOut, 
  Download, 
  Upload,
  Settings,
  Home
} from 'lucide-react';
import { ToolType } from '../types';

interface ToolbarProps {
  selectedTool: ToolType;
  onToolSelect: (tool: ToolType) => void;
  zoom: number;
  onZoom: (delta: number) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  selectedTool,
  onToolSelect,
  zoom,
  onZoom,
}) => {
  return (
    <div className="toolbar">
      <div className="toolbar-group">
        <button className="toolbar-button" title="首页">
          <Home size={16} />
        </button>
        <button className="toolbar-button" title="上传图片">
          <Upload size={16} />
        </button>
        <button className="toolbar-button" title="下载">
          <Download size={16} />
        </button>
      </div>

      <div className="toolbar-separator" />

      <div className="toolbar-group">
        <button className="toolbar-button" title="撤销">
          <Undo size={16} />
        </button>
        <button className="toolbar-button" title="重做">
          <Redo size={16} />
        </button>
      </div>

      <div className="toolbar-separator" />

      <div className="zoom-control">
        <button 
          className="zoom-button" 
          onClick={() => onZoom(-0.1)}
          title="缩小"
        >
          <ZoomOut size={14} />
        </button>
        <div className="zoom-display">
          {Math.round(zoom * 100)}%
        </div>
        <button 
          className="zoom-button" 
          onClick={() => onZoom(0.1)}
          title="放大"
        >
          <ZoomIn size={14} />
        </button>
      </div>

      <div className="toolbar-separator" />

      <div className="toolbar-group">
        <button className="toolbar-button" title="设置">
          <Settings size={16} />
        </button>
      </div>
    </div>
  );
};

export default Toolbar;