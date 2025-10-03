import React from 'react';
import { Settings, Layers } from 'lucide-react';
import { ColorPicker, Card, Typography, Input, InputNumber, Slider, Space, Divider } from 'antd';
import { AnnotationObject } from '../types';

const { Title, Text } = Typography;

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
    <Card 
      className="properties-panel"
      title={
        <Space>
          <Settings size={16} />
          <span>图形属性</span>
        </Space>
      }
      extra={
        <Layers size={16} style={{ cursor: 'pointer' }} />
      }
      size="small"
      style={{ height: '100%' }}
    >
      {selectedObject ? (
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          {/* 对象类型 */}
          <div>
            <Text type="secondary" style={{ fontSize: '12px' }}>类型</Text>
            <Card size="small" style={{ marginTop: 4, backgroundColor: '#f5f5f5' }}>
              <Text>{selectedObject.type}</Text>
            </Card>
          </div>

          {/* 文本专属属性 */}
          {selectedObject.type === 'text' && (
            <>
              <div>
                <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: 4 }}>
                  文本内容
                </Text>
                <Input
                  value={selectedObject.text || ''}
                  onChange={(e) => onObjectUpdate({ text: e.target.value })}
                  placeholder="请输入文本内容"
                />
              </div>
              
              <div>
                <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: 4 }}>
                  字体大小
                </Text>
                <InputNumber
                  value={selectedObject.fontSize || 40}
                  onChange={(value) => onObjectUpdate({ fontSize: value || 40 })}
                  min={8}
                  max={200}
                  style={{ width: '100%' }}
                  addonAfter="px"
                />
              </div>

              <div>
                <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: 4 }}>
                  字体颜色
                </Text>
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

          <Divider style={{ margin: '8px 0' }} />

          {/* 通用属性 */}
          <div>
            <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: 4 }}>
              描边颜色
            </Text>
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

          <div>
            <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: 4 }}>
              描边宽度
            </Text>
            <Slider
              min={1}
              max={10}
              value={selectedObject.strokeWidth || 6}
              onChange={(value) => onObjectUpdate({ strokeWidth: value })}
              tooltip={{ formatter: (value) => `${value}px` }}
            />
          </div>

          <div>
            <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: 4 }}>
              位置
            </Text>
            <Space.Compact style={{ width: '100%' }}>
              <InputNumber
                addonBefore="X"
                value={Math.round(selectedObject.x)}
                onChange={(value) => onObjectUpdate({ x: value || 0 })}
                style={{ width: '50%' }}
              />
              <InputNumber
                addonBefore="Y"
                value={Math.round(selectedObject.y)}
                onChange={(value) => onObjectUpdate({ y: value || 0 })}
                style={{ width: '50%' }}
              />
            </Space.Compact>
          </div>
        </Space>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: '#999' }}>
          <Settings size={48} style={{ marginBottom: 16, opacity: 0.3 }} />
          <div style={{ marginBottom: 8 }}>未选中任何图形</div>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            选中任意图形，在这里编辑属性参数
          </Text>
        </div>
      )}
    </Card>
  );
};

export default PropertiesPanel;