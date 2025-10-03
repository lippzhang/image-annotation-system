import React, { useState } from 'react';
import { Settings, Layers } from 'lucide-react';
import { AnnotationObject } from '../types';
import LayerPanel from './LayerPanel';
// 原来的导入
// import PropertiesPanel from './PropertiesPanel';

// 替换为重构后的组件
import PropertiesPanel from './PropertiesPanelRefactored';

interface RightPanelProps {
  objects: AnnotationObject[];
  selectedObjects: string[];
  selectedObject?: AnnotationObject;
  onObjectsUpdate: (objects: AnnotationObject[]) => void;
  onObjectSelect: (id: string) => void;
  onObjectUpdate: (id: string, updates: Partial<AnnotationObject>) => void;
}

const RightPanel: React.FC<RightPanelProps> = ({
  objects,
  selectedObjects,
  selectedObject,
  onObjectsUpdate,
  onObjectSelect,
  onObjectUpdate,
}) => {
  const [activeTab, setActiveTab] = useState<'layers' | 'properties'>('layers');

  return (
    <div className="right-panel">
      <div className="right-panel-header">
        <div className="right-panel-tabs">
          <button
            className={`tab-button ${activeTab === 'layers' ? 'active' : ''}`}
            onClick={() => setActiveTab('layers')}
          >
            <Layers size={16} />
            <span>图层</span>
          </button>
          <button
            className={`tab-button ${activeTab === 'properties' ? 'active' : ''}`}
            onClick={() => setActiveTab('properties')}
          >
            <Settings size={16} />
            <span>属性</span>
          </button>
        </div>
      </div>
      
      <div className="right-panel-content">
        {activeTab === 'layers' ? (
          <LayerPanel
            objects={objects}
            selectedObjects={selectedObjects}
            onObjectsUpdate={onObjectsUpdate}
            onObjectSelect={onObjectSelect}
          />
        ) : (
          <PropertiesPanel
            selectedObject={selectedObject}
            onObjectUpdate={(updates) => {
              if (selectedObject) {
                onObjectUpdate(selectedObject.id, updates);
              }
            }}
          />
        )}
      </div>
    </div>
  );
};

export default RightPanel;