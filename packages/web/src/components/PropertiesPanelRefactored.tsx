import React from 'react';
import { Settings, Layers } from 'lucide-react';
import { Card, Typography, Space, Divider } from 'antd';
import { AnnotationObject } from '../types';
import {
  TextProperties,
  StepProperties,
  MosaicProperties,
  GradientProperties,
  ImageProperties,
  CommonProperties,
} from './properties';

const { Title, Text } = Typography;

interface PropertiesPanelProps {
  selectedObject?: AnnotationObject;
  onObjectUpdate: (updates: Partial<AnnotationObject>) => void;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedObject,
  onObjectUpdate,
}) => {
  const renderObjectTypeProperties = () => {
    if (!selectedObject) return null;

    switch (selectedObject.type) {
      case 'text':
        return <TextProperties selectedObject={selectedObject} onObjectUpdate={onObjectUpdate} />;
      
      case 'step':
        return <StepProperties selectedObject={selectedObject} onObjectUpdate={onObjectUpdate} />;
      
      case 'mosaic':
        return <MosaicProperties selectedObject={selectedObject} onObjectUpdate={onObjectUpdate} />;
      
      case 'gradient':
        return <GradientProperties selectedObject={selectedObject} onObjectUpdate={onObjectUpdate} />;
      
      case 'image':
        return <ImageProperties selectedObject={selectedObject} onObjectUpdate={onObjectUpdate} />;
      
      default:
        return null;
    }
  };

  const renderEmptyState = () => (
    <div style={{ textAlign: 'center', padding: '40px 20px', color: '#999' }}>
      <Settings size={48} style={{ marginBottom: 16, opacity: 0.3 }} />
      <div style={{ marginBottom: 8 }}>未选中任何图形</div>
      <Text type="secondary" style={{ fontSize: '12px' }}>
        选中任意图形，在这里编辑属性参数
      </Text>
    </div>
  );

  const renderSelectedObjectProperties = () => (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      {/* 对象类型 */}
      <div>
        <Text type="secondary" style={{ fontSize: '12px' }}>类型</Text>
        <Card size="small" style={{ marginTop: 4, backgroundColor: '#f5f5f5' }}>
          <Text>{selectedObject!.type}</Text>
        </Card>
      </div>

      {/* 对象特定属性 */}
      {renderObjectTypeProperties()}

      {/* 分割线 */}
      <Divider style={{ margin: '8px 0' }} />

      {/* 通用属性 */}
      <CommonProperties selectedObject={selectedObject!} onObjectUpdate={onObjectUpdate} />
    </Space>
  );

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
      {selectedObject ? renderSelectedObjectProperties() : renderEmptyState()}
    </Card>
  );
};

export default PropertiesPanel;