import React from 'react';
import { Settings, Layers } from 'lucide-react';
import { ColorPicker } from 'antd';
import { AnnotationObject } from '../types';

export const COLOR_LIST = [
  "#ffffff",
  "#bec0bf",
  "#595b5b",
  "#010101",
  "#a287e1",
  "#7081db",
  "#8ecaca",
  "#fe6a04",
  "#78c286",
  "#e38483",
  "#e382d4",
  "#df2c3f"
];

interface PropertiesPanelProps {
  selectedObject?: AnnotationObject;
  onObjectUpdate: (updates: Partial<AnnotationObject>) => void;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedObject,
  onObjectUpdate,
}) => {
  return (
    <div className="properties-panel">
      <div className="properties-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Settings size={16} />
          <span>图形属性</span>
        </div>
        <button className="toolbar-button">
          <Layers size={16} />
        </button>
      </div>
      
      <div className="properties-content">
        {selectedObject ? (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', color: '#666' }}>
                类型
              </label>
              <div style={{ padding: '8px', background: '#f5f5f5', borderRadius: '4px', fontSize: '14px' }}>
                {selectedObject.type}
              </div>
            </div>

            {selectedObject.type === 'text' && (
              <>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', color: '#666' }}>
                    文本内容
                  </label>
                  <input
                    type="text"
                    value={selectedObject.text || ''}
                    onChange={(e) => onObjectUpdate({ text: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #d9d9d9',
                      borderRadius: '4px',
                      fontSize: '14px',
                    }}
                  />
                </div>
                
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', color: '#666' }}>
                    字体大小
                  </label>
                  <input
                    type="number"
                    value={selectedObject.fontSize || 40}
                    onChange={(e) => onObjectUpdate({ fontSize: parseInt(e.target.value) })}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #d9d9d9',
                      borderRadius: '4px',
                      fontSize: '14px',
                    }}
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', color: '#666' }}>
                    字体颜色
                  </label>
                  <ColorPicker
                    value={selectedObject.fill || '#333333'}
                    onChange={(color) => onObjectUpdate({ fill: color.toHexString() })}
                    presets={[
                      {
                        label: '预设颜色',
                        colors: COLOR_LIST,
                      },
                    ]}
                    showText
                    style={{ width: '100%' }}
                  />
                </div>
              </>
            )}

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', color: '#666' }}>
                描边颜色
              </label>
              <ColorPicker
                value={selectedObject.stroke || '#ff8c00'}
                onChange={(color) => onObjectUpdate({ stroke: color.toHexString() })}
                presets={[
                  {
                    label: '预设颜色',
                    colors: COLOR_LIST,
                  },
                ]}
                showText
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', color: '#666' }}>
                描边宽度
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={selectedObject.strokeWidth || 6}
                onChange={(e) => onObjectUpdate({ strokeWidth: parseInt(e.target.value) })}
                style={{ width: '100%' }}
              />
              <div style={{ textAlign: 'center', fontSize: '12px', color: '#666', marginTop: '4px' }}>
                {selectedObject.strokeWidth || 6}px
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', color: '#666' }}>
                位置
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '10px', color: '#999' }}>X</label>
                  <input
                    type="number"
                    value={Math.round(selectedObject.x)}
                    onChange={(e) => onObjectUpdate({ x: parseInt(e.target.value) })}
                    style={{
                      width: '100%',
                      padding: '4px',
                      border: '1px solid #d9d9d9',
                      borderRadius: '4px',
                      fontSize: '12px',
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '10px', color: '#999' }}>Y</label>
                  <input
                    type="number"
                    value={Math.round(selectedObject.y)}
                    onChange={(e) => onObjectUpdate({ y: parseInt(e.target.value) })}
                    style={{
                      width: '100%',
                      padding: '4px',
                      border: '1px solid #d9d9d9',
                      borderRadius: '4px',
                      fontSize: '12px',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">
              <Settings size={48} />
            </div>
            <div>未选中任何图形</div>
            <div style={{ fontSize: '12px', marginTop: '4px' }}>
              选中任意图形，在这里编辑属性参数
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertiesPanel;