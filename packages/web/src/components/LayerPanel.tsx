import React from 'react';
import { AnnotationObject } from '../types';
import { 
  moveToTop, 
  moveToBottom, 
  moveUp, 
  moveDown, 
  toggleLock, 
  toggleVisibility,
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
      <div className="layer-panel">
        <div className="layer-panel-header">
          <h3>图层</h3>
        </div>
        <div className="layer-panel-empty">
          <p>暂无图层</p>
        </div>
      </div>
    );
  }

  return (
    <div className="layer-panel">
      <div className="layer-panel-header">
        <h3>图层</h3>
      </div>
      <div className="layer-list">
        {sortedObjects.map((obj, index) => (
          <div
            key={obj.id}
            className={`layer-item ${selectedObjects.includes(obj.id) ? 'selected' : ''} ${obj.visible === false ? 'hidden' : ''}`}
            onClick={() => onObjectSelect(obj.id)}
          >
            <div className="layer-info">
              <span className="layer-icon">{getLayerIcon(obj.type)}</span>
              <span className="layer-name">{getLayerName(obj, index)}</span>
            </div>
            
            <div className="layer-controls">
              {/* 可见性切换 */}
              <button
                className={`layer-btn visibility-btn ${obj.visible === false ? 'hidden' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleVisibility(obj.id);
                }}
                title={obj.visible === false ? '显示图层' : '隐藏图层'}
              >
                {obj.visible === false ? '👁️‍🗨️' : '👁️'}
              </button>
              
              {/* 锁定切换 */}
              <button
                className={`layer-btn lock-btn ${obj.locked ? 'locked' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleLock(obj.id);
                }}
                title={obj.locked ? '解锁图层' : '锁定图层'}
              >
                {obj.locked ? '🔒' : '🔓'}
              </button>
              
              {/* 层级控制 */}
              <div className="layer-order-controls">
                <button
                  className="layer-btn order-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMoveUp(obj.id);
                  }}
                  title="向上移动一层"
                  disabled={index === 0}
                >
                  ↑
                </button>
                <button
                  className="layer-btn order-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMoveDown(obj.id);
                  }}
                  title="向下移动一层"
                  disabled={index === sortedObjects.length - 1}
                >
                  ↓
                </button>
              </div>
              
              {/* 更多操作 */}
              <div className="layer-more-controls">
                <button
                  className="layer-btn more-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMoveToTop(obj.id);
                  }}
                  title="移动到顶层"
                >
                  ⤴
                </button>
                <button
                  className="layer-btn more-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMoveToBottom(obj.id);
                  }}
                  title="移动到底层"
                >
                  ⤵
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LayerPanel;