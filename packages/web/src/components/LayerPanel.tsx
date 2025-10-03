import React from 'react';
import { Tooltip, Card, Typography, Button, Space, List, Empty } from 'antd';
import { 
  EyeOutlined, 
  EyeInvisibleOutlined, 
  LockOutlined, 
  UnlockOutlined,
  DeleteOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  VerticalAlignTopOutlined,
  VerticalAlignBottomOutlined
} from '@ant-design/icons';
import { AnnotationObject } from '../types';

const { Title, Text } = Typography;
import { 
  moveToTop, 
  moveToBottom, 
  moveUp, 
  moveDown, 
  toggleLock, 
  toggleVisibility,
  deleteObject,
  sortObjectsByZIndex,
  generateLayerName
} from '../utils/layerUtils';

interface LayerPanelProps {
  objects: AnnotationObject[];
  selectedObjects: string[];
  onObjectsUpdate: (objects: AnnotationObject[]) => void;
  onObjectSelect: (id: string) => void;
}

const LayerPanel: React.FC<LayerPanelProps> = ({
  objects,
  selectedObjects,
  onObjectsUpdate,
  onObjectSelect,
}) => {
  // 按 zIndex 排序，最上层的在列表顶部
  const sortedObjects = sortObjectsByZIndex(objects).reverse();

  const handleMoveToTop = (id: string) => {
    const updatedObjects = moveToTop(objects, id);
    onObjectsUpdate(updatedObjects);
  };

  const handleMoveToBottom = (id: string) => {
    const updatedObjects = moveToBottom(objects, id);
    onObjectsUpdate(updatedObjects);
  };

  const handleMoveUp = (id: string) => {
    const updatedObjects = moveUp(objects, id);
    onObjectsUpdate(updatedObjects);
  };

  const handleMoveDown = (id: string) => {
    const updatedObjects = moveDown(objects, id);
    onObjectsUpdate(updatedObjects);
  };

  const handleToggleLock = (id: string) => {
    const updatedObjects = toggleLock(objects, id);
    onObjectsUpdate(updatedObjects);
  };

  const handleToggleVisibility = (id: string) => {
    const updatedObjects = toggleVisibility(objects, id);
    onObjectsUpdate(updatedObjects);
  };

  const handleDeleteObject = (id: string) => {
    const updatedObjects = deleteObject(objects, id);
    onObjectsUpdate(updatedObjects);
  };

  const getLayerIcon = (type: string) => {
    const icons: { [key: string]: string } = {
      rectangle: '▭',
      circle: '○',
      line: '╱',
      arrow: '→',
      pen: '✎',
      text: 'T',
      select: '⌖',
      eraser: '⌫',
      measure: '📏'
    };
    return icons[type] || '●';
  };

  const getLayerName = (obj: AnnotationObject, index: number) => {
    if (obj.name) return obj.name;
    return generateLayerName(obj.type, sortedObjects.length - index);
  };

  if (objects.length === 0) {
    return (
      <Card 
        title={<Title level={5} style={{ margin: 0 }}>图层</Title>}
        size="small"
        style={{ width: '100%', height: '100%' }}
      >
        <Empty 
          description="暂无图层"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          style={{ margin: '20px 0' }}
        />
      </Card>
    );
  }

  return (
    <Card 
      title={<Title level={5} style={{ margin: 0 }}>图层</Title>}
      size="small"
      style={{ width: '100%', height: '100%' }}
      bodyStyle={{ padding: 0 }}
    >
      <List
        size="small"
        dataSource={sortedObjects}
        renderItem={(obj, index) => (
          <List.Item
            key={obj.id}
            style={{
              padding: '8px 12px',
              cursor: 'pointer',
              backgroundColor: selectedObjects.includes(obj.id) ? '#e6f7ff' : 'transparent',
              opacity: obj.visible === false ? 0.5 : 1,
              borderLeft: selectedObjects.includes(obj.id) ? '3px solid #1890ff' : '3px solid transparent'
            }}
            onClick={() => onObjectSelect(obj.id)}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                <Text style={{ marginRight: 8, fontSize: '14px' }}>{getLayerIcon(obj.type)}</Text>
                <Text ellipsis style={{ flex: 1 }}>{getLayerName(obj, index)}</Text>
              </div>
              
              <Space size={4}>
                {/* 可见性切换 */}
                <Tooltip title={obj.visible === false ? '显示图层' : '隐藏图层'}>
                  <Button
                    type="text"
                    size="small"
                    icon={obj.visible === false ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleVisibility(obj.id);
                    }}
                    style={{ 
                      color: obj.visible === false ? '#d9d9d9' : '#1890ff',
                      padding: '2px 4px'
                    }}
                  />
                </Tooltip>
                
                {/* 锁定切换 */}
                <Tooltip title={obj.locked ? '解锁图层' : '锁定图层'}>
                  <Button
                    type="text"
                    size="small"
                    icon={obj.locked ? <LockOutlined /> : <UnlockOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleLock(obj.id);
                    }}
                    style={{ 
                      color: obj.locked ? '#ff4d4f' : '#52c41a',
                      padding: '2px 4px'
                    }}
                  />
                </Tooltip>
                
                {/* 删除按钮 */}
                <Tooltip title="删除图层">
                  <Button
                    type="text"
                    size="small"
                    icon={<DeleteOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteObject(obj.id);
                    }}
                    style={{ 
                      color: '#ff4d4f',
                      padding: '2px 4px'
                    }}
                  />
                </Tooltip>
                
                {/* 层级控制 */}
                <Space.Compact>
                  <Tooltip title="向上移动一层">
                    <Button
                      type="text"
                      size="small"
                      icon={<ArrowUpOutlined />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMoveUp(obj.id);
                      }}
                      disabled={index === 0}
                      style={{ padding: '2px 4px' }}
                    />
                  </Tooltip>
                  <Tooltip title="向下移动一层">
                    <Button
                      type="text"
                      size="small"
                      icon={<ArrowDownOutlined />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMoveDown(obj.id);
                      }}
                      disabled={index === sortedObjects.length - 1}
                      style={{ padding: '2px 4px' }}
                    />
                  </Tooltip>
                </Space.Compact>
                
                {/* 更多操作 */}
                <Space.Compact>
                  <Tooltip title="移动到顶层">
                    <Button
                      type="text"
                      size="small"
                      icon={<VerticalAlignTopOutlined />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMoveToTop(obj.id);
                      }}
                      style={{ padding: '2px 4px' }}
                    />
                  </Tooltip>
                  <Tooltip title="移动到底层">
                    <Button
                      type="text"
                      size="small"
                      icon={<VerticalAlignBottomOutlined />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMoveToBottom(obj.id);
                      }}
                      style={{ padding: '2px 4px' }}
                    />
                  </Tooltip>
                </Space.Compact>
              </Space>
            </div>
          </List.Item>
        )}
      />
    </Card>
  );
};

export default LayerPanel;