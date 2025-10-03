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

          {/* 步骤工具专属属性 */}
          {selectedObject.type === 'step' && (
            <>
              <div>
                <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: 4 }}>
                  步骤编号
                </Text>
                <InputNumber
                  value={selectedObject.stepNumber || 1}
                  onChange={(value) => onObjectUpdate({ stepNumber: value || 1 })}
                  min={1}
                  max={999}
                  style={{ width: '100%' }}
                />
              </div>
              
              <div>
                <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: 4 }}>
                  圆圈大小
                </Text>
                <Slider
                  min={20}
                  max={80}
                  value={selectedObject.width || 40}
                  onChange={(value) => onObjectUpdate({ width: value, height: value })}
                  tooltip={{ formatter: (value) => `${value}px` }}
                />
              </div>

              <div>
                <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: 4 }}>
                  填充颜色
                </Text>
                <ColorPicker
                  value={selectedObject.fill || '#ffffff'}
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

          {/* 马赛克工具专属属性 */}
          {selectedObject.type === 'mosaic' && (
            <>
              <div>
                <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: 4 }}>
                  马赛克大小
                </Text>
                <Slider
                  min={5}
                  max={30}
                  value={selectedObject.mosaicSize || 10}
                  onChange={(value) => onObjectUpdate({ mosaicSize: value })}
                  tooltip={{ formatter: (value) => `${value}px` }}
                />
              </div>
              
              <div>
                <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: 4 }}>
                  马赛克颜色
                </Text>
                <ColorPicker
                  value={selectedObject.fill || 'rgba(128, 128, 128, 0.8)'}
                  onChange={(color) => onObjectUpdate({ fill: color.toRgbString() })}
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
                  透明度
                </Text>
                <Slider
                  min={0}
                  max={100}
                  value={(() => {
                    const fillColor = selectedObject.fill || 'rgba(128, 128, 128, 0.8)';
                    // 从 rgba 字符串中提取透明度值
                    const match = fillColor.match(/rgba?\([^)]+,\s*([^)]+)\)/);
                    if (match) {
                      return Math.round(parseFloat(match[1]) * 100);
                    }
                    return 80; // 默认透明度 80%
                  })()}
                  onChange={(value) => {
                    const fillColor = selectedObject.fill || 'rgba(128, 128, 128, 0.8)';
                    // 提取 RGB 值
                    const rgbMatch = fillColor.match(/rgba?\(([^)]+)\)/);
                    if (rgbMatch) {
                      const rgbValues = rgbMatch[1].split(',').slice(0, 3).map(v => v.trim());
                      const newAlpha = value / 100;
                      const newColor = `rgba(${rgbValues.join(', ')}, ${newAlpha})`;
                      onObjectUpdate({ fill: newColor });
                    }
                  }}
                  tooltip={{ formatter: (value) => `${value}%` }}
                />
              </div>
              
              <div>
                <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: 4 }}>
                  区域大小
                </Text>
                <Space.Compact style={{ width: '100%' }}>
                  <InputNumber
                    addonBefore="宽度"
                    value={Math.round(selectedObject.width || 100)}
                    onChange={(value) => onObjectUpdate({ width: value || 100 })}
                    min={20}
                    max={500}
                    style={{ width: '50%' }}
                    addonAfter="px"
                  />
                  <InputNumber
                    addonBefore="高度"
                    value={Math.round(selectedObject.height || 100)}
                    onChange={(value) => onObjectUpdate({ height: value || 100 })}
                    min={20}
                    max={500}
                    style={{ width: '50%' }}
                    addonAfter="px"
                  />
                </Space.Compact>
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
            {/* 对于基于路径的工具（line, pen, arrow），显示起始点位置 */}
            {(['line', 'pen', 'arrow'].includes(selectedObject.type)) ? (
              <Space.Compact style={{ width: '100%' }}>
                <InputNumber
                  addonBefore="起始X"
                  value={selectedObject.points && selectedObject.points.length >= 2 ? Math.round(selectedObject.points[0]) : 0}
                  onChange={(value) => {
                    const points = selectedObject.points || [];
                    if (points.length >= 2) {
                      const deltaX = (value || 0) - points[0];
                      const newPoints = [...points];
                      // 移动所有点的X坐标
                      for (let i = 0; i < newPoints.length; i += 2) {
                        newPoints[i] += deltaX;
                      }
                      onObjectUpdate({ points: newPoints });
                    }
                  }}
                  style={{ width: '50%' }}
                />
                <InputNumber
                  addonBefore="起始Y"
                  value={selectedObject.points && selectedObject.points.length >= 2 ? Math.round(selectedObject.points[1]) : 0}
                  onChange={(value) => {
                    const points = selectedObject.points || [];
                    if (points.length >= 2) {
                      const deltaY = (value || 0) - points[1];
                      const newPoints = [...points];
                      // 移动所有点的Y坐标
                      for (let i = 1; i < newPoints.length; i += 2) {
                        newPoints[i] += deltaY;
                      }
                      onObjectUpdate({ points: newPoints });
                    }
                  }}
                  style={{ width: '50%' }}
                />
              </Space.Compact>
            ) : (
              /* 对于其他工具，显示普通的X、Y坐标 */
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
            )}
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