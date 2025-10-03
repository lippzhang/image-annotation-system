# 组件 API

本文档详细介绍图片标注系统中各个 React 组件的 API 接口。

## 核心组件

### AnnotationEditor

主编辑器组件，是整个标注系统的核心容器。

#### Props

```typescript
interface AnnotationEditorProps {
  width?: number;               // 编辑器宽度，默认 800
  height?: number;              // 编辑器高度，默认 600
  initialImage?: string;        // 初始图片 URL
  onSave?: (data: AnnotationData) => void; // 保存回调
  onLoad?: (editor: AnnotationEditor) => void; // 加载完成回调
  config?: Partial<CanvasConfig>; // 画布配置
  tools?: ToolConfig[];         // 自定义工具配置
  disabled?: boolean;           // 是否禁用编辑
  className?: string;           // 自定义样式类
}
```

#### 方法

```typescript
interface AnnotationEditorRef {
  // 对象操作
  addObject: (object: AnnotationObject) => void;
  updateObject: (id: string, updates: Partial<AnnotationObject>) => void;
  deleteObject: (id: string) => void;
  getObject: (id: string) => AnnotationObject | undefined;
  getAllObjects: () => AnnotationObject[];
  
  // 选择操作
  selectObjects: (ids: string[]) => void;
  getSelectedObjects: () => AnnotationObject[];
  clearSelection: () => void;
  
  // 工具操作
  setTool: (tool: ToolType) => void;
  getTool: () => ToolType;
  
  // 画布操作
  setScale: (scale: number) => void;
  getScale: () => number;
  setPosition: (position: { x: number; y: number }) => void;
  getPosition: () => { x: number; y: number };
  resetView: () => void;
  
  // 图片操作
  loadImage: (url: string) => Promise<void>;
  getImageSize: () => { width: number; height: number } | null;
  
  // 导出操作
  exportAsImage: (config?: ExportConfig) => Promise<string>;
  exportAsJSON: () => string;
  
  // 历史操作
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
}
```

#### 使用示例

```typescript
import { AnnotationEditor } from '@annotation/web';

const App = () => {
  const editorRef = useRef<AnnotationEditorRef>(null);
  
  const handleSave = (data: AnnotationData) => {
    console.log('保存标注数据:', data);
  };
  
  const handleExport = async () => {
    if (editorRef.current) {
      const imageData = await editorRef.current.exportAsImage({
        format: 'png',
        quality: 0.9
      });
      // 处理导出的图片数据
    }
  };
  
  return (
    <div>
      <AnnotationEditor
        ref={editorRef}
        width={1000}
        height={700}
        onSave={handleSave}
        initialImage="/path/to/image.jpg"
      />
      <button onClick={handleExport}>导出图片</button>
    </div>
  );
};
```

### Sidebar

工具栏组件，提供工具选择界面。

#### Props

```typescript
interface SidebarProps {
  selectedTool: ToolType;       // 当前选中的工具
  onToolChange: (tool: ToolType) => void; // 工具切换回调
  tools?: ToolConfig[];         // 工具配置列表
  orientation?: 'vertical' | 'horizontal'; // 布局方向
  size?: 'small' | 'medium' | 'large'; // 工具栏大小
  disabled?: boolean;           // 是否禁用
  className?: string;           // 自定义样式类
}
```

#### 使用示例

```typescript
import { Sidebar } from '@annotation/web';

const CustomToolbar = () => {
  const [selectedTool, setSelectedTool] = useState<ToolType>('select');
  
  const customTools = [
    { type: 'select', label: '选择', icon: MousePointer },
    { type: 'rectangle', label: '矩形', icon: Square },
    { type: 'circle', label: '圆形', icon: Circle },
  ];
  
  return (
    <Sidebar
      selectedTool={selectedTool}
      onToolChange={setSelectedTool}
      tools={customTools}
      orientation="horizontal"
      size="medium"
    />
  );
};
```

### PropertiesPanel

属性编辑面板组件。

#### Props

```typescript
interface PropertiesPanelProps {
  selectedObjects: AnnotationObject[]; // 选中的对象列表
  onObjectUpdate: (id: string, updates: Partial<AnnotationObject>) => void; // 对象更新回调
  onBatchUpdate?: (updates: Partial<AnnotationObject>) => void; // 批量更新回调
  width?: number;               // 面板宽度
  collapsible?: boolean;        // 是否可折叠
  defaultCollapsed?: boolean;   // 默认是否折叠
  className?: string;           // 自定义样式类
}
```

#### 使用示例

```typescript
import { PropertiesPanel } from '@annotation/web';

const PropertyEditor = () => {
  const [selectedObjects, setSelectedObjects] = useState<AnnotationObject[]>([]);
  
  const handleUpdate = (id: string, updates: Partial<AnnotationObject>) => {
    // 更新对象属性
    updateObject(id, updates);
  };
  
  return (
    <PropertiesPanel
      selectedObjects={selectedObjects}
      onObjectUpdate={handleUpdate}
      width={300}
      collapsible={true}
    />
  );
};
```

### LayerPanel

图层管理面板组件。

#### Props

```typescript
interface LayerPanelProps {
  objects: AnnotationObject[];  // 所有对象列表
  selectedIds: string[];        // 选中对象 ID 列表
  onSelect: (ids: string[]) => void; // 选择回调
  onReorder: (fromIndex: number, toIndex: number) => void; // 重排序回调
  onVisibilityChange: (id: string, visible: boolean) => void; // 可见性切换回调
  onLockChange: (id: string, locked: boolean) => void; // 锁定状态切换回调
  onDelete: (ids: string[]) => void; // 删除回调
  onRename: (id: string, name: string) => void; // 重命名回调
  height?: number;              // 面板高度
  showThumbnails?: boolean;     // 是否显示缩略图
  className?: string;           // 自定义样式类
}
```

#### 使用示例

```typescript
import { LayerPanel } from '@annotation/web';

const LayerManager = () => {
  const [objects, setObjects] = useState<AnnotationObject[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  const handleReorder = (fromIndex: number, toIndex: number) => {
    const newObjects = [...objects];
    const [moved] = newObjects.splice(fromIndex, 1);
    newObjects.splice(toIndex, 0, moved);
    setObjects(newObjects);
  };
  
  return (
    <LayerPanel
      objects={objects}
      selectedIds={selectedIds}
      onSelect={setSelectedIds}
      onReorder={handleReorder}
      onVisibilityChange={(id, visible) => updateObject(id, { visible })}
      onLockChange={(id, locked) => updateObject(id, { locked })}
      onDelete={(ids) => ids.forEach(deleteObject)}
      height={400}
      showThumbnails={true}
    />
  );
};
```

## 工具组件

### RectangleComponent

矩形标注对象的渲染组件。

#### Props

```typescript
interface RectangleComponentProps {
  object: AnnotationObject;     // 矩形对象数据
  isSelected: boolean;          // 是否选中
  onSelect: () => void;         // 选择回调
  onTransform: (attrs: any) => void; // 变换回调
  onDoubleClick?: () => void;   // 双击回调
}
```

### CircleComponent

圆形标注对象的渲染组件。

#### Props

```typescript
interface CircleComponentProps {
  object: AnnotationObject;     // 圆形对象数据
  isSelected: boolean;          // 是否选中
  onSelect: () => void;         // 选择回调
  onTransform: (attrs: any) => void; // 变换回调
  onDoubleClick?: () => void;   // 双击回调
}
```

### TextComponent

文本标注对象的渲染组件。

#### Props

```typescript
interface TextComponentProps {
  object: AnnotationObject;     // 文本对象数据
  isSelected: boolean;          // 是否选中
  onSelect: () => void;         // 选择回调
  onTransform: (attrs: any) => void; // 变换回调
  onTextChange?: (text: string) => void; // 文本变更回调
  onDoubleClick?: () => void;   // 双击回调
  editing?: boolean;            // 是否处于编辑状态
}
```

### ArrowComponent

箭头标注对象的渲染组件。

#### Props

```typescript
interface ArrowComponentProps {
  object: AnnotationObject;     // 箭头对象数据
  isSelected: boolean;          // 是否选中
  onSelect: () => void;         // 选择回调
  onTransform: (attrs: any) => void; // 变换回调
  onPointsChange?: (points: number[]) => void; // 路径点变更回调
}
```

### MosaicComponent

马赛克标注对象的渲染组件。

#### Props

```typescript
interface MosaicComponentProps {
  object: AnnotationObject;     // 马赛克对象数据
  isSelected: boolean;          // 是否选中
  onSelect: () => void;         // 选择回调
  onTransform: (attrs: any) => void; // 变换回调
  backgroundImage?: HTMLImageElement; // 背景图片元素
}
```

### GradientComponent

渐变背景标注对象的渲染组件。

#### Props

```typescript
interface GradientComponentProps {
  object: AnnotationObject;     // 渐变对象数据
  isSelected: boolean;          // 是否选中
  onSelect: () => void;         // 选择回调
  onTransform: (attrs: any) => void; // 变换回调
}
```

### ImageComponent

贴图标注对象的渲染组件。

#### Props

```typescript
interface ImageComponentProps {
  object: AnnotationObject;     // 贴图对象数据
  isSelected: boolean;          // 是否选中
  onSelect: () => void;         // 选择回调
  onTransform: (attrs: any) => void; // 变换回调
  onImageLoad?: () => void;     // 图片加载完成回调
  onImageError?: (error: Error) => void; // 图片加载错误回调
}
```

## 属性编辑组件

### CommonProperties

通用属性编辑组件，适用于所有标注对象。

#### Props

```typescript
interface CommonPropertiesProps {
  objects: AnnotationObject[];  // 对象列表
  onUpdate: (updates: Partial<AnnotationObject>) => void; // 更新回调
  showPosition?: boolean;       // 是否显示位置属性
  showSize?: boolean;          // 是否显示尺寸属性
  showRotation?: boolean;      // 是否显示旋转属性
  showStyle?: boolean;         // 是否显示样式属性
}
```

### ColorPicker

颜色选择器组件。

#### Props

```typescript
interface ColorPickerProps {
  value: string;                // 当前颜色值
  onChange: (color: string) => void; // 颜色变更回调
  presetColors?: string[];      // 预设颜色列表
  showAlpha?: boolean;         // 是否显示透明度
  disabled?: boolean;          // 是否禁用
  size?: 'small' | 'medium' | 'large'; // 组件大小
}
```

### NumberInput

数值输入组件。

#### Props

```typescript
interface NumberInputProps {
  value: number;                // 当前数值
  onChange: (value: number) => void; // 数值变更回调
  min?: number;                // 最小值
  max?: number;                // 最大值
  step?: number;               // 步长
  precision?: number;          // 精度
  unit?: string;               // 单位
  disabled?: boolean;          // 是否禁用
  size?: 'small' | 'medium' | 'large'; // 组件大小
}
```

## 高阶组件

### withTransformer

为标注对象添加变换器功能的高阶组件。

#### 用法

```typescript
import { withTransformer } from '@annotation/web';

const TransformableRect = withTransformer(RectangleComponent);

// 使用
<TransformableRect
  object={rectObject}
  isSelected={true}
  onTransform={handleTransform}
/>
```

### withSelection

为标注对象添加选择功能的高阶组件。

#### 用法

```typescript
import { withSelection } from '@annotation/web';

const SelectableRect = withSelection(RectangleComponent);

// 使用
<SelectableRect
  object={rectObject}
  onSelect={handleSelect}
  multiSelect={true}
/>
```

## Context 组件

### CanvasProvider

画布上下文提供者组件。

#### Props

```typescript
interface CanvasProviderProps {
  children: React.ReactNode;    // 子组件
  initialState?: Partial<CanvasState>; // 初始状态
  config?: CanvasConfig;        // 画布配置
}
```

#### 使用示例

```typescript
import { CanvasProvider, useCanvas } from '@annotation/web';

const App = () => {
  return (
    <CanvasProvider
      config={{
        width: 1000,
        height: 700,
        backgroundColor: '#f0f0f0'
      }}
    >
      <AnnotationEditor />
    </CanvasProvider>
  );
};

// 在子组件中使用
const ChildComponent = () => {
  const { state, addObject, updateObject } = useCanvas();
  
  return (
    <div>
      <p>当前对象数量: {state.objects.length}</p>
      <button onClick={() => addObject(newObject)}>
        添加对象
      </button>
    </div>
  );
};
```

### ThemeProvider

主题上下文提供者组件。

#### Props

```typescript
interface ThemeProviderProps {
  children: React.ReactNode;    // 子组件
  theme?: 'light' | 'dark' | Theme; // 主题配置
}
```

## 组件样式

### 样式定制

所有组件都支持通过 CSS 变量进行样式定制：

```css
:root {
  /* 主色调 */
  --annotation-primary-color: #1890ff;
  --annotation-primary-hover: #40a9ff;
  --annotation-primary-active: #096dd9;
  
  /* 背景色 */
  --annotation-bg-color: #ffffff;
  --annotation-bg-secondary: #f5f5f5;
  --annotation-bg-disabled: #f0f0f0;
  
  /* 文字颜色 */
  --annotation-text-color: #000000;
  --annotation-text-secondary: #666666;
  --annotation-text-disabled: #cccccc;
  
  /* 边框 */
  --annotation-border-color: #d9d9d9;
  --annotation-border-radius: 4px;
  
  /* 间距 */
  --annotation-spacing-xs: 4px;
  --annotation-spacing-sm: 8px;
  --annotation-spacing-md: 16px;
  --annotation-spacing-lg: 24px;
  
  /* 阴影 */
  --annotation-shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.1);
  --annotation-shadow-md: 0 4px 8px rgba(0, 0, 0, 0.15);
  --annotation-shadow-lg: 0 8px 16px rgba(0, 0, 0, 0.2);
}
```

### 暗色主题

```css
[data-theme="dark"] {
  --annotation-bg-color: #1f1f1f;
  --annotation-bg-secondary: #2a2a2a;
  --annotation-text-color: #ffffff;
  --annotation-text-secondary: #cccccc;
  --annotation-border-color: #404040;
}
```

## 事件系统

### 事件类型

所有组件都支持标准的事件处理：

```typescript
interface ComponentEvents {
  onClick?: (event: MouseEvent) => void;
  onDoubleClick?: (event: MouseEvent) => void;
  onMouseEnter?: (event: MouseEvent) => void;
  onMouseLeave?: (event: MouseEvent) => void;
  onFocus?: (event: FocusEvent) => void;
  onBlur?: (event: FocusEvent) => void;
  onKeyDown?: (event: KeyboardEvent) => void;
  onKeyUp?: (event: KeyboardEvent) => void;
}
```

### 自定义事件

```typescript
interface CustomEvents {
  onObjectCreate?: (object: AnnotationObject) => void;
  onObjectUpdate?: (object: AnnotationObject) => void;
  onObjectDelete?: (objectId: string) => void;
  onSelectionChange?: (selectedIds: string[]) => void;
  onToolChange?: (tool: ToolType) => void;
  onCanvasChange?: (state: CanvasState) => void;
}
```