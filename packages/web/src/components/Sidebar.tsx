import React from 'react';
import { 
  MousePointer2,
  Type,
  Square,
  Circle,
  ArrowRight,
  Minus,
  Pen,
  Eraser,
  Ruler,
  Share2,
  Download,
  Maximize,
  Eye
} from 'lucide-react';
import { ToolType } from '../types';

interface SidebarProps {
  selectedTool: ToolType;
  onToolSelect: (tool: ToolType) => void;
}

const toolCategories = [
  {
    title: '基础',
    tools: [
      { type: 'text' as ToolType, label: '文字', icon: <Type size={20} /> },
      { type: 'rectangle' as ToolType, label: '矩形', icon: <Square size={20} /> },
      { type: 'circle' as ToolType, label: '圆形', icon: <Circle size={20} /> },
    ]
  },
  {
    title: '绘制',
    tools: [
      { type: 'arrow' as ToolType, label: '箭头', icon: <ArrowRight size={20} /> },
      { type: 'line' as ToolType, label: '直线', icon: <Minus size={20} /> },
      { type: 'pen' as ToolType, label: '画笔', icon: <Pen size={20} /> },
      { type: 'eraser' as ToolType, label: '橡皮', icon: <Eraser size={20} /> },
    ]
  },
  {
    title: '测量',
    tools: [
      { type: 'measure' as ToolType, label: '尺寸', icon: <Ruler size={20} /> },
    ]
  },
  {
    title: '导出',
    tools: [
      { label: '文字导出', icon: <Type size={20} /> },
      { label: '引出区域', icon: <Share2 size={20} /> },
      { label: '圈出区域', icon: <Circle size={20} /> },
      { label: '多引出', icon: <Share2 size={20} /> },
    ]
  },
  {
    title: '放大镜',
    tools: [
      { label: '局部放大', icon: <Maximize size={20} /> },
      { label: '方块放大', icon: <Square size={20} /> },
    ]
  },
  {
    title: '贴图',
    tools: [
      { label: '贴图', icon: <Download size={20} /> },
      { label: '马赛克', icon: <Square size={20} /> },
      { label: '深度聚焦', icon: <Eye size={20} /> },
    ]
  },
];

const Sidebar: React.FC<SidebarProps> = ({ selectedTool, onToolSelect }) => {
  return (
    <div className="sidebar">
      {toolCategories.map((category, index) => (
        <div key={index} className="sidebar-section">
          <div className="sidebar-title">{category.title}</div>
          <div className="tool-grid">
            {category.tools.map((tool, toolIndex) => (
              <div
                key={toolIndex}
                className={`tool-item ${
                  'type' in tool && tool.type === selectedTool ? 'active' : ''
                }`}
                onClick={() => {
                  if ('type' in tool) {
                    onToolSelect(tool.type);
                  }
                }}
              >
                <div className="tool-item-icon">{tool.icon}</div>
                <div className="tool-item-label">{tool.label}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Sidebar;