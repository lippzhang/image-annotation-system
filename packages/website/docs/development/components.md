# 组件开发

本文档介绍如何在图片标注系统中开发和维护 React 组件。

## 组件开发规范

### 组件命名

- 使用 PascalCase 命名组件文件和组件名
- 文件名与组件名保持一致
- 使用描述性的名称，避免缩写

```typescript
// ✅ 好的命名
AnnotationEditor.tsx
PropertiesPanel.tsx
LayerPanel.tsx

// ❌ 避免的命名
AE.tsx
PropPanel.tsx
LP.tsx
```

### 组件结构

每个组件文件应遵循以下结构：

```typescript
// 1. 导入依赖
import React from 'react';
import { Button } from 'antd';
import type { AnnotationObject } from '../types';

// 2. 类型定义
interface ComponentProps {
  // 属性定义
}

// 3. 组件实现
export const ComponentName: React.FC<ComponentProps> = ({
  // 解构 props
}) => {
  // 4. Hooks 调用
  const [state, setState] = useState();
  
  // 5. 事件处理函数
  const handleClick = () => {
    // 处理逻辑
  };
  
  // 6. 渲染逻辑
  return (
    <div>
      {/* JSX 内容 */}
    </div>
  );
};

// 7. 默认导出
export default ComponentName;
```

## 核心组件详解

### AnnotationEditor

主编辑器组件是整个系统的核心，负责协调各个子组件。

#### 主要职责

- 管理画布状态
- 处理工具切换
- 协调子组件通信
- 处理键盘事件

#### 关键状态

```typescript
interface CanvasState {
  selectedTool: ToolType;
  objects: AnnotationObject[];
  selectedIds: string[];
  imageUrl: string | null;
  imageSize: { width: number; height: number };
}
```

#### 事件处理

```typescript
const handleToolChange = (tool: ToolType) => {
  setCanvasState(prev => ({
    ...prev,
    selectedTool: tool,
    selectedIds: [] // 切换工具时清除选择
  }));
};

const handleObjectCreate = (object: AnnotationObject) => {
  setCanvasState(prev => ({
    ...prev,
    objects: [...prev.objects, object],
    selectedIds: [object.id]
  }));
};
```

### CanvasObjects

负责渲染所有标注对象的组件。

#### 渲染策略

根据对象类型选择对应的渲染组件：

```typescript
const renderObject = (obj: AnnotationObject) => {
  switch (obj.type) {
    case 'rectangle':
      return <RectangleComponent key={obj.id} object={obj} />;
    case 'circle':
      return <CircleComponent key={obj.id} object={obj} />;
    case 'text':
      return <TextComponent key={obj.id} object={obj} />;
    // ... 其他类型
    default:
      return null;
  }
};
```

#### 变换处理

```typescript
const handleTransform = (id: string, attrs: any) => {
  onObjectUpdate(id, {
    x: attrs.x,
    y: attrs.y,
    width: attrs.width,
    height: attrs.height,
    rotation: attrs.rotation,
  });
};
```

### PropertiesPanel

属性编辑面板组件。

#### 动态属性渲染

根据选中对象类型显示不同的属性编辑器：

```typescript
const renderProperties = () => {
  if (selectedObjects.length === 0) {
    return <div>请选择一个对象</div>;
  }
  
  if (selectedObjects.length === 1) {
    const obj = selectedObjects[0];
    switch (obj.type) {
      case 'rectangle':
        return <RectangleProperties object={obj} />;
      case 'text':
        return <TextProperties object={obj} />;
      // ... 其他类型
    }
  }
  
  // 多选时显示通用属性
  return <CommonProperties objects={selectedObjects} />;
};
```

#### 属性更新

```typescript
const handlePropertyChange = (property: string, value: any) => {
  selectedObjects.forEach(obj => {
    onObjectUpdate(obj.id, { [property]: value });
  });
};
```

## 自定义 Hooks

### useCanvasState

管理画布状态的 Hook：

```typescript
export const useCanvasState = () => {
  const [state, setState] = useState<CanvasState>(initialState);
  
  const updateObject = useCallback((id: string, updates: Partial<AnnotationObject>) => {
    setState(prev => ({
      ...prev,
      objects: prev.objects.map(obj => 
        obj.id === id ? { ...obj, ...updates } : obj
      )
    }));
  }, []);
  
  const addObject = useCallback((object: AnnotationObject) => {
    setState(prev => ({
      ...prev,
      objects: [...prev.objects, object]
    }));
  }, []);
  
  return {
    state,
    updateObject,
    addObject,
    // ... 其他方法
  };
};
```

### useKeyboard

处理键盘事件的 Hook：

```typescript
export const useKeyboard = (handlers: KeyboardHandlers) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const { key, ctrlKey, shiftKey } = e;
      
      // 删除选中对象
      if (key === 'Delete') {
        handlers.onDelete?.();
        return;
      }
      
      // 撤销/重做
      if (ctrlKey && key === 'z') {
        if (shiftKey) {
          handlers.onRedo?.();
        } else {
          handlers.onUndo?.();
        }
        return;
      }
      
      // 工具切换
      if (key === 'v') handlers.onToolChange?.('select');
      if (key === 'r') handlers.onToolChange?.('rectangle');
      // ... 其他快捷键
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlers]);
};
```

## 组件通信

### Props 传递

父子组件间通过 props 传递数据和回调函数：

```typescript
// 父组件
<PropertiesPanel
  selectedObjects={selectedObjects}
  onObjectUpdate={handleObjectUpdate}
/>

// 子组件
interface PropertiesPanelProps {
  selectedObjects: AnnotationObject[];
  onObjectUpdate: (id: string, updates: Partial<AnnotationObject>) => void;
}
```

### Context 使用

对于深层嵌套的组件，使用 Context 共享状态：

```typescript
const CanvasContext = createContext<CanvasContextValue | null>(null);

export const CanvasProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<CanvasState>(initialState);
  
  const value = {
    state,
    updateObject: (id: string, updates: Partial<AnnotationObject>) => {
      // 更新逻辑
    },
    // ... 其他方法
  };
  
  return (
    <CanvasContext.Provider value={value}>
      {children}
    </CanvasContext.Provider>
  );
};

export const useCanvas = () => {
  const context = useContext(CanvasContext);
  if (!context) {
    throw new Error('useCanvas must be used within CanvasProvider');
  }
  return context;
};
```

## 性能优化

### React.memo

对于纯展示组件，使用 React.memo 避免不必要的重渲染：

```typescript
export const ObjectItem = React.memo<ObjectItemProps>(({ object, isSelected }) => {
  return (
    <div className={`object-item ${isSelected ? 'selected' : ''}`}>
      {object.name}
    </div>
  );
});
```

### useCallback 和 useMemo

缓存函数和计算结果：

```typescript
const handleClick = useCallback((id: string) => {
  onObjectSelect(id);
}, [onObjectSelect]);

const filteredObjects = useMemo(() => {
  return objects.filter(obj => obj.visible);
}, [objects]);
```

### 虚拟化

对于大量对象的渲染，考虑使用虚拟化：

```typescript
import { FixedSizeList as List } from 'react-window';

const ObjectList = ({ objects }) => (
  <List
    height={400}
    itemCount={objects.length}
    itemSize={50}
    itemData={objects}
  >
    {ObjectItem}
  </List>
);
```

## 样式管理

### CSS Modules

使用 CSS Modules 避免样式冲突：

```typescript
import styles from './Component.module.css';

const Component = () => (
  <div className={styles.container}>
    <button className={styles.button}>按钮</button>
  </div>
);
```

### 主题支持

使用 CSS 变量支持主题切换：

```css
:root {
  --primary-color: #1890ff;
  --background-color: #ffffff;
  --text-color: #000000;
}

[data-theme="dark"] {
  --background-color: #1f1f1f;
  --text-color: #ffffff;
}
```

## 测试

### 单元测试

使用 Jest 和 React Testing Library：

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { PropertiesPanel } from './PropertiesPanel';

describe('PropertiesPanel', () => {
  it('should render object properties', () => {
    const mockObject = {
      id: '1',
      type: 'rectangle',
      x: 0,
      y: 0,
      width: 100,
      height: 100,
    };
    
    render(
      <PropertiesPanel
        selectedObjects={[mockObject]}
        onObjectUpdate={jest.fn()}
      />
    );
    
    expect(screen.getByDisplayValue('100')).toBeInTheDocument();
  });
});
```

### 集成测试

测试组件间的交互：

```typescript
it('should update object when property changes', () => {
  const mockUpdate = jest.fn();
  
  render(
    <PropertiesPanel
      selectedObjects={[mockObject]}
      onObjectUpdate={mockUpdate}
    />
  );
  
  const widthInput = screen.getByLabelText('宽度');
  fireEvent.change(widthInput, { target: { value: '200' } });
  
  expect(mockUpdate).toHaveBeenCalledWith('1', { width: 200 });
});
```

## 错误处理

### Error Boundary

使用 Error Boundary 捕获组件错误：

```typescript
class ComponentErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('Component error:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return <div>组件渲染出错，请刷新页面重试</div>;
    }
    
    return this.props.children;
  }
}
```

### 异步错误处理

```typescript
const handleAsyncOperation = async () => {
  try {
    const result = await someAsyncOperation();
    setData(result);
  } catch (error) {
    console.error('操作失败:', error);
    setError('操作失败，请重试');
  }
};
```

## 最佳实践

### 组件设计原则

1. **单一职责** - 每个组件只负责一个功能
2. **可复用性** - 设计通用的、可复用的组件
3. **可测试性** - 组件应该易于测试
4. **性能优化** - 避免不必要的重渲染

### 代码组织

1. **按功能分组** - 相关的组件放在同一目录
2. **统一导出** - 使用 index.ts 文件统一导出
3. **类型定义** - 将类型定义放在单独的文件中

### 开发工具

1. **React DevTools** - 调试 React 组件
2. **Storybook** - 组件开发和文档
3. **ESLint** - 代码规范检查
4. **Prettier** - 代码格式化