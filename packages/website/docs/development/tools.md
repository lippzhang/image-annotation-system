# 工具开发

本文档介绍如何在图片标注系统中开发新的标注工具。

## 工具开发流程

开发一个新的标注工具需要以下步骤：

1. **定义工具类型** - 在类型系统中添加新工具
2. **实现创建逻辑** - 在编辑器中添加工具创建逻辑
3. **实现渲染组件** - 创建工具的可视化渲染
4. **添加属性编辑** - 在属性面板中添加工具属性
5. **更新工具栏** - 在工具栏中添加工具图标
6. **完善图层管理** - 在图层面板中支持新工具

## 步骤详解

### 1. 定义工具类型

在 `packages/web/src/types/index.ts` 中添加新的工具类型：

```typescript
// 添加新的工具类型
export type ToolType = 
  | 'select'
  | 'rectangle'
  | 'circle'
  | 'arrow'
  | 'text'
  | 'mosaic'
  | 'gradient'
  | 'image'
  | 'your-new-tool'; // 新工具类型

// 为新工具添加特定属性
export interface AnnotationObject {
  id: string;
  type: ToolType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  visible: boolean;
  locked: boolean;
  
  // 通用属性
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
  
  // 新工具的特定属性
  yourNewToolProperty?: string;
  yourNewToolData?: any;
}
```

### 2. 实现创建逻辑

在 `packages/web/src/components/AnnotationEditor.tsx` 中添加工具创建逻辑：

```typescript
const handleCanvasClick = (e: KonvaEventObject<MouseEvent>) => {
  if (canvasState.selectedTool === 'your-new-tool') {
    const pos = e.target.getStage()?.getPointerPosition();
    if (pos) {
      const newObject: AnnotationObject = {
        id: `your-new-tool-${Date.now()}`,
        type: 'your-new-tool',
        x: pos.x,
        y: pos.y,
        width: 100, // 默认宽度
        height: 100, // 默认高度
        rotation: 0,
        visible: true,
        locked: false,
        // 工具特定属性
        yourNewToolProperty: 'default-value',
        // 通用样式属性
        fill: '#ff0000',
        stroke: '#000000',
        strokeWidth: 2,
        opacity: 1,
      };
      
      setCanvasState(prev => ({
        ...prev,
        objects: [...prev.objects, newObject],
        selectedIds: [newObject.id],
      }));
    }
  }
};
```

### 3. 实现渲染组件

在 `packages/web/src/components/CanvasObjects.tsx` 中添加渲染逻辑：

```typescript
// 创建新工具的渲染组件
const YourNewToolComponent: React.FC<{
  object: AnnotationObject;
  isSelected: boolean;
  onSelect: () => void;
  onTransform: (attrs: any) => void;
}> = ({ object, isSelected, onSelect, onTransform }) => {
  const shapeRef = useRef<Konva.Shape>(null);
  
  useEffect(() => {
    if (isSelected && shapeRef.current) {
      // 更新变换器
      const transformer = shapeRef.current.getStage()?.findOne('.transformer');
      if (transformer) {
        transformer.nodes([shapeRef.current]);
      }
    }
  }, [isSelected]);
  
  return (
    <YourKonvaShape // 使用适当的 Konva 组件
      ref={shapeRef}
      x={object.x}
      y={object.y}
      width={object.width}
      height={object.height}
      rotation={object.rotation}
      fill={object.fill}
      stroke={object.stroke}
      strokeWidth={object.strokeWidth}
      opacity={object.opacity}
      // 工具特定属性
      yourNewToolProperty={object.yourNewToolProperty}
      // 事件处理
      onClick={onSelect}
      onTap={onSelect}
      onTransformEnd={(e) => {
        const node = e.target;
        onTransform({
          x: node.x(),
          y: node.y(),
          width: node.width() * node.scaleX(),
          height: node.height() * node.scaleY(),
          rotation: node.rotation(),
        });
      }}
      draggable={!object.locked}
    />
  );
};

// 在主渲染函数中添加新工具的渲染逻辑
const renderObject = (obj: AnnotationObject) => {
  const isSelected = selectedIds.includes(obj.id);
  const handleSelect = () => onSelect([obj.id]);
  const handleTransform = (attrs: any) => onTransform(obj.id, attrs);
  
  switch (obj.type) {
    // ... 其他工具类型
    case 'your-new-tool':
      return (
        <YourNewToolComponent
          key={obj.id}
          object={obj}
          isSelected={isSelected}
          onSelect={handleSelect}
          onTransform={handleTransform}
        />
      );
    default:
      return null;
  }
};
```

### 4. 添加属性编辑

在 `packages/web/src/components/PropertiesPanel.tsx` 中添加属性编辑界面：

```typescript
// 创建新工具的属性编辑组件
const YourNewToolProperties: React.FC<{
  objects: AnnotationObject[];
  onUpdate: (updates: Partial<AnnotationObject>) => void;
}> = ({ objects, onUpdate }) => {
  const obj = objects[0]; // 假设单选
  
  return (
    <div className="tool-properties">
      <h3>新工具属性</h3>
      
      {/* 通用属性 */}
      <CommonProperties objects={objects} onUpdate={onUpdate} />
      
      {/* 工具特定属性 */}
      <div className="property-group">
        <label>特定属性:</label>
        <Input
          value={obj.yourNewToolProperty}
          onChange={(e) => onUpdate({ yourNewToolProperty: e.target.value })}
        />
      </div>
      
      {/* 其他特定属性... */}
    </div>
  );
};

// 在主属性面板中添加新工具的属性编辑
const renderProperties = () => {
  if (selectedObjects.length === 0) {
    return <div>请选择一个对象</div>;
  }
  
  const firstObject = selectedObjects[0];
  
  switch (firstObject.type) {
    // ... 其他工具类型
    case 'your-new-tool':
      return (
        <YourNewToolProperties
          objects={selectedObjects}
          onUpdate={handleUpdate}
        />
      );
    default:
      return <CommonProperties objects={selectedObjects} onUpdate={handleUpdate} />;
  }
};
```

### 5. 更新工具栏

在 `packages/web/src/components/Sidebar.tsx` 中添加工具图标：

```typescript
import { YourNewToolIcon } from 'lucide-react'; // 选择合适的图标

const tools = [
  // ... 其他工具
  { 
    type: 'your-new-tool' as ToolType, 
    label: '新工具', 
    icon: <YourNewToolIcon size={20} /> 
  },
];
```

### 6. 完善图层管理

在 `packages/web/src/utils/layerUtils.ts` 中添加工具名称映射：

```typescript
export const generateLayerName = (toolType: ToolType, index: number): string => {
  const toolNames: Record<ToolType, string> = {
    // ... 其他工具
    'your-new-tool': '新工具',
  };
  
  return `${toolNames[toolType] || '未知工具'} ${index}`;
};
```

在 `packages/web/src/components/LayerPanel.tsx` 中添加图标映射：

```typescript
import { YourNewToolIcon } from 'lucide-react';

const getLayerIcon = (type: ToolType) => {
  switch (type) {
    // ... 其他工具
    case 'your-new-tool':
      return <YourNewToolIcon size={16} />;
    default:
      return <Square size={16} />;
  }
};
```

## 工具开发示例

让我们以开发一个"星形工具"为例，展示完整的开发过程：

### 1. 定义星形工具类型

```typescript
export type ToolType = 
  | 'select'
  | 'rectangle'
  | 'circle'
  | 'arrow'
  | 'text'
  | 'mosaic'
  | 'gradient'
  | 'image'
  | 'star'; // 新增星形工具

export interface AnnotationObject {
  // ... 其他属性
  
  // 星形工具特定属性
  starPoints?: number; // 星形的角数
  innerRadius?: number; // 内半径
  outerRadius?: number; // 外半径
}
```

### 2. 创建星形工具

```typescript
const handleCanvasClick = (e: KonvaEventObject<MouseEvent>) => {
  if (canvasState.selectedTool === 'star') {
    const pos = e.target.getStage()?.getPointerPosition();
    if (pos) {
      const newStar: AnnotationObject = {
        id: `star-${Date.now()}`,
        type: 'star',
        x: pos.x,
        y: pos.y,
        width: 100,
        height: 100,
        rotation: 0,
        visible: true,
        locked: false,
        // 星形特定属性
        starPoints: 5,
        innerRadius: 30,
        outerRadius: 50,
        // 样式属性
        fill: '#ffff00',
        stroke: '#000000',
        strokeWidth: 2,
        opacity: 1,
      };
      
      setCanvasState(prev => ({
        ...prev,
        objects: [...prev.objects, newStar],
        selectedIds: [newStar.id],
      }));
    }
  }
};
```

### 3. 渲染星形组件

```typescript
import { Star } from 'react-konva';

const StarComponent: React.FC<{
  object: AnnotationObject;
  isSelected: boolean;
  onSelect: () => void;
  onTransform: (attrs: any) => void;
}> = ({ object, isSelected, onSelect, onTransform }) => {
  const shapeRef = useRef<Konva.Star>(null);
  
  useEffect(() => {
    if (isSelected && shapeRef.current) {
      const transformer = shapeRef.current.getStage()?.findOne('.transformer');
      if (transformer) {
        transformer.nodes([shapeRef.current]);
      }
    }
  }, [isSelected]);
  
  return (
    <Star
      ref={shapeRef}
      x={object.x}
      y={object.y}
      numPoints={object.starPoints || 5}
      innerRadius={object.innerRadius || 30}
      outerRadius={object.outerRadius || 50}
      rotation={object.rotation}
      fill={object.fill}
      stroke={object.stroke}
      strokeWidth={object.strokeWidth}
      opacity={object.opacity}
      onClick={onSelect}
      onTap={onSelect}
      onTransformEnd={(e) => {
        const node = e.target;
        const scaleX = node.scaleX();
        const scaleY = node.scaleY();
        
        onTransform({
          x: node.x(),
          y: node.y(),
          innerRadius: (object.innerRadius || 30) * scaleX,
          outerRadius: (object.outerRadius || 50) * scaleX,
          rotation: node.rotation(),
        });
        
        // 重置缩放
        node.scaleX(1);
        node.scaleY(1);
      }}
      draggable={!object.locked}
    />
  );
};
```

### 4. 星形属性编辑

```typescript
const StarProperties: React.FC<{
  objects: AnnotationObject[];
  onUpdate: (updates: Partial<AnnotationObject>) => void;
}> = ({ objects, onUpdate }) => {
  const obj = objects[0];
  
  return (
    <div className="tool-properties">
      <h3>星形属性</h3>
      
      <CommonProperties objects={objects} onUpdate={onUpdate} />
      
      <div className="property-group">
        <label>角数:</label>
        <InputNumber
          min={3}
          max={20}
          value={obj.starPoints || 5}
          onChange={(value) => onUpdate({ starPoints: value || 5 })}
        />
      </div>
      
      <div className="property-group">
        <label>内半径:</label>
        <InputNumber
          min={10}
          max={200}
          value={obj.innerRadius || 30}
          onChange={(value) => onUpdate({ innerRadius: value || 30 })}
        />
      </div>
      
      <div className="property-group">
        <label>外半径:</label>
        <InputNumber
          min={20}
          max={300}
          value={obj.outerRadius || 50}
          onChange={(value) => onUpdate({ outerRadius: value || 50 })}
        />
      </div>
    </div>
  );
};
```

## 高级工具开发

### 交互式工具

对于需要多步交互的工具（如箭头工具），可以使用状态机模式：

```typescript
interface ToolState {
  phase: 'idle' | 'drawing' | 'complete';
  startPoint?: { x: number; y: number };
  endPoint?: { x: number; y: number };
}

const useInteractiveTool = (toolType: ToolType) => {
  const [toolState, setToolState] = useState<ToolState>({ phase: 'idle' });
  
  const handleCanvasClick = (pos: { x: number; y: number }) => {
    switch (toolState.phase) {
      case 'idle':
        setToolState({
          phase: 'drawing',
          startPoint: pos,
        });
        break;
        
      case 'drawing':
        setToolState({
          phase: 'complete',
          startPoint: toolState.startPoint,
          endPoint: pos,
        });
        // 创建对象
        createObject(toolState.startPoint!, pos);
        // 重置状态
        setToolState({ phase: 'idle' });
        break;
    }
  };
  
  return { toolState, handleCanvasClick };
};
```

### 自定义形状工具

对于复杂的自定义形状，可以使用 Konva 的 Shape 组件：

```typescript
const CustomShapeComponent: React.FC<ShapeProps> = ({ object, ...props }) => {
  return (
    <Shape
      sceneFunc={(context, shape) => {
        // 自定义绘制逻辑
        context.beginPath();
        context.moveTo(0, 0);
        // ... 绘制路径
        context.closePath();
        context.fillStrokeShape(shape);
      }}
      fill={object.fill}
      stroke={object.stroke}
      strokeWidth={object.strokeWidth}
      {...props}
    />
  );
};
```

### 工具插件系统

为了支持第三方工具开发，可以设计插件接口：

```typescript
interface ToolPlugin {
  name: string;
  type: string;
  icon: React.ComponentType;
  
  // 创建对象
  createObject: (options: any) => AnnotationObject;
  
  // 渲染组件
  renderComponent: (props: RenderProps) => React.ReactNode;
  
  // 属性编辑
  renderProperties: (props: PropertiesProps) => React.ReactNode;
  
  // 工具配置
  config?: ToolConfig;
}

const registerTool = (plugin: ToolPlugin) => {
  // 注册工具到系统中
};
```

## 测试工具

### 单元测试

```typescript
describe('StarTool', () => {
  it('should create star object with correct properties', () => {
    const starObject = createStarObject({
      x: 100,
      y: 100,
      starPoints: 6,
      innerRadius: 25,
      outerRadius: 45,
    });
    
    expect(starObject.type).toBe('star');
    expect(starObject.starPoints).toBe(6);
    expect(starObject.innerRadius).toBe(25);
    expect(starObject.outerRadius).toBe(45);
  });
});
```

### 集成测试

```typescript
it('should render star and handle interactions', () => {
  render(<CanvasObjects objects={[starObject]} />);
  
  const starElement = screen.getByTestId('star-object');
  fireEvent.click(starElement);
  
  expect(onSelect).toHaveBeenCalledWith([starObject.id]);
});
```

## 最佳实践

### 工具设计原则

1. **一致性** - 保持与现有工具的交互一致性
2. **可用性** - 提供直观的操作体验
3. **性能** - 优化渲染性能，避免不必要的重绘
4. **扩展性** - 设计易于扩展的工具接口

### 代码组织

1. **模块化** - 将工具相关代码组织在独立模块中
2. **复用性** - 提取通用逻辑为可复用的工具函数
3. **类型安全** - 使用 TypeScript 确保类型安全

### 用户体验

1. **反馈** - 提供清晰的视觉反馈
2. **容错** - 处理边界情况和错误状态
3. **帮助** - 提供工具使用说明和提示