import React from 'react';
import { 
  Type,
  Square,
  Circle,
  ArrowRight,
  Minus,
  Pen,
  Eraser,
  CircleDot,
  Image,
  Grid,
  Palette
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
      { type: 'line' as ToolType, label: '直线', icon: <Minus size={20} /> },
      { type: 'pen' as ToolType, label: '手写', icon: <Pen size={20} /> },
      { type: 'arrow' as ToolType, label: '箭头', icon: <ArrowRight size={20} /> },
      { type: 'step' as ToolType, label: '步骤', icon: <CircleDot size={20} /> },
    ]
  },
  {
    title: '贴图',
    tools: [
      { type: 'image' as ToolType, label: '贴图', icon: <Image size={20} /> },
      { type: 'mosaic' as ToolType, label: '马赛克', icon: <Grid size={20} /> },
      { type: 'gradient' as ToolType, label: '渐变背景', icon: <Palette size={20} /> },
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
                  if ('type' in tool && tool.type) {
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