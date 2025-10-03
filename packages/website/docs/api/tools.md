# 工具 API

本文档详细介绍图片标注系统中各个工具的 API 接口和使用方法。

## 工具基类

### BaseTool

所有工具的基础接口定义。

```typescript
interface BaseTool {
  type: ToolType;               // 工具类型
  name: string;                 // 工具名称
  icon: React.ComponentType;    // 工具图标
  cursor?: string;              // 鼠标样式
  shortcut?: string;            // 快捷键
  
  // 生命周期方法
  onActivate?: () => void;      // 工具激活时调用
  onDeactivate?: () => void;    // 工具停用时调用
  
  // 事件处理
  onCanvasClick?: (event: CanvasClickEvent) => void;
  onCanvasDrag?: (event: CanvasDragEvent) => void;
  onKeyDown?: (event: KeyboardEvent) => void;
  
  // 对象创建
  createObject?: (params: CreateObjectParams) => AnnotationObject;
  
  // 属性验证
  validateObject?: (object: AnnotationObject) => boolean;
}
```

## 选择工具

### SelectTool

用于选择和操作已有标注对象的工具。

#### 接口定义

```typescript
interface SelectTool extends BaseTool {
  type: 'select';
  
  // 选择模式
  selectionMode: 'single' | 'multiple';
  
  // 选择方法
  selectObject: (id: string) => void;
  selectObjects: (ids: string[]) => void;
  selectAll: () => void;
  clearSelection: () => void;
  
  // 变换操作
  transformObject: (id: string, transform: Transform) => void;
  
  // 拖拽操作
  startDrag: (objectId: string, startPoint: Point) => void;
  updateDrag: (currentPoint: Point) => void;
  endDrag: () => void;
}
```

#### 使用示例

```typescript
import { SelectTool } from '@annotation/web';

const selectTool = new SelectTool({
  selectionMode: 'multiple',
  onObjectSelect: (ids) => {
    console.log('选中对象:', ids);
  },
  onObjectTransform: (id, transform) => {
    console.log('对象变换:', id, transform);
  }
});

// 激活工具
selectTool.onActivate();

// 选择对象
selectTool.selectObject('object-1');
selectTool.selectObjects(['object-1', 'object-2']);
```

## 绘制工具

### RectangleTool

矩形绘制工具。

#### 接口定义

```typescript
interface RectangleTool extends BaseTool {
  type: 'rectangle';
  
  // 默认属性
  defaultProps: {
    fill: string;
    stroke: string;
    strokeWidth: number;
    opacity: number;
  };
  
  // 绘制状态
  isDrawing: boolean;
  startPoint: Point | null;
  currentPoint: Point | null;
  
  // 绘制方法
  startDrawing: (point: Point) => void;
  updateDrawing: (point: Point) => void;
  finishDrawing: () => AnnotationObject | null;
  cancelDrawing: () => void;
  
  // 预览
  getPreviewObject: () => Partial<AnnotationObject> | null;
}
```

#### 使用示例

```typescript
import { RectangleTool } from '@annotation/web';

const rectangleTool = new RectangleTool({
  defaultProps: {
    fill: '#ff0000',
    stroke: '#000000',
    strokeWidth: 2,
    opacity: 0.8
  },
  onObjectCreate: (object) => {
    console.log('创建矩形:', object);
  }
});

// 开始绘制
rectangleTool.startDrawing({ x: 100, y: 100 });

// 更新绘制
rectangleTool.updateDrawing({ x: 200, y: 200 });

// 完成绘制
const newRect = rectangleTool.finishDrawing();
```

### CircleTool

圆形绘制工具。

#### 接口定义

```typescript
interface CircleTool extends BaseTool {
  type: 'circle';
  
  // 默认属性
  defaultProps: {
    fill: string;
    stroke: string;
    strokeWidth: number;
    opacity: number;
  };
  
  // 绘制状态
  isDrawing: boolean;
  centerPoint: Point | null;
  radius: number;
  
  // 绘制方法
  startDrawing: (center: Point) => void;
  updateDrawing: (point: Point) => void;
  finishDrawing: () => AnnotationObject | null;
  cancelDrawing: () => void;
  
  // 计算方法
  calculateRadius: (center: Point, edge: Point) => number;
  getPreviewObject: () => Partial<AnnotationObject> | null;
}
```

### ArrowTool

箭头绘制工具。

#### 接口定义

```typescript
interface ArrowTool extends BaseTool {
  type: 'arrow';
  
  // 默认属性
  defaultProps: {
    stroke: string;
    strokeWidth: number;
    opacity: number;
    arrowSize: number;
  };
  
  // 绘制状态
  isDrawing: boolean;
  startPoint: Point | null;
  endPoint: Point | null;
  
  // 绘制方法
  startDrawing: (point: Point) => void;
  updateDrawing: (point: Point) => void;
  finishDrawing: () => AnnotationObject | null;
  cancelDrawing: () => void;
  
  // 计算方法
  calculateArrowPoints: (start: Point, end: Point) => number[];
  getPreviewObject: () => Partial<AnnotationObject> | null;
}
```

### TextTool

文本工具。

#### 接口定义

```typescript
interface TextTool extends BaseTool {
  type: 'text';
  
  // 默认属性
  defaultProps: {
    text: string;
    fontSize: number;
    fontFamily: string;
    fontWeight: 'normal' | 'bold';
    fill: string;
    opacity: number;
  };
  
  // 编辑状态
  isEditing: boolean;
  editingObjectId: string | null;
  
  // 文本方法
  startTextInput: (point: Point) => void;
  updateText: (text: string) => void;
  finishTextInput: () => AnnotationObject | null;
  cancelTextInput: () => void;
  
  // 编辑方法
  startEditText: (objectId: string) => void;
  updateEditText: (text: string) => void;
  finishEditText: () => void;
  cancelEditText: () => void;
}
```

#### 使用示例

```typescript
import { TextTool } from '@annotation/web';

const textTool = new TextTool({
  defaultProps: {
    text: '请输入文字',
    fontSize: 16,
    fontFamily: 'Arial',
    fontWeight: 'normal',
    fill: '#000000',
    opacity: 1
  },
  onTextCreate: (object) => {
    console.log('创建文本:', object);
  },
  onTextEdit: (objectId, newText) => {
    console.log('编辑文本:', objectId, newText);
  }
});

// 开始输入文本
textTool.startTextInput({ x: 100, y: 100 });

// 更新文本内容
textTool.updateText('Hello World');

// 完成文本输入
const newText = textTool.finishTextInput();
```

## 特殊效果工具

### MosaicTool

马赛克工具。

#### 接口定义

```typescript
interface MosaicTool extends BaseTool {
  type: 'mosaic';
  
  // 默认属性
  defaultProps: {
    mosaicColor: string;
    opacity: number;
    pixelSize: number;
  };
  
  // 绘制状态
  isDrawing: boolean;
  startPoint: Point | null;
  currentPoint: Point | null;
  
  // 马赛克方法
  startDrawing: (point: Point) => void;
  updateDrawing: (point: Point) => void;
  finishDrawing: () => AnnotationObject | null;
  cancelDrawing: () => void;
  
  // 效果生成
  generateMosaicEffect: (
    imageData: ImageData, 
    bounds: Rectangle, 
    pixelSize: number
  ) => ImageData;
  
  getPreviewObject: () => Partial<AnnotationObject> | null;
}
```

#### 使用示例

```typescript
import { MosaicTool } from '@annotation/web';

const mosaicTool = new MosaicTool({
  defaultProps: {
    mosaicColor: '#808080',
    opacity: 1,
    pixelSize: 10
  },
  backgroundImage: imageElement,
  onObjectCreate: (object) => {
    console.log('创建马赛克:', object);
  }
});

// 开始绘制马赛克
mosaicTool.startDrawing({ x: 50, y: 50 });

// 更新绘制区域
mosaicTool.updateDrawing({ x: 150, y: 150 });

// 完成绘制
const newMosaic = mosaicTool.finishDrawing();
```

### GradientTool

渐变背景工具。

#### 接口定义

```typescript
interface GradientTool extends BaseTool {
  type: 'gradient';
  
  // 默认属性
  defaultProps: {
    gradientColors: string[];
    gradientDirection: GradientDirection;
    opacity: number;
  };
  
  // 绘制状态
  isDrawing: boolean;
  startPoint: Point | null;
  currentPoint: Point | null;
  
  // 渐变方法
  startDrawing: (point: Point) => void;
  updateDrawing: (point: Point) => void;
  finishDrawing: () => AnnotationObject | null;
  cancelDrawing: () => void;
  
  // 渐变计算
  calculateGradientDirection: (start: Point, end: Point) => GradientDirection;
  generateGradientCSS: (colors: string[], direction: GradientDirection) => string;
  
  getPreviewObject: () => Partial<AnnotationObject> | null;
}
```

### ImageTool

贴图工具。

#### 接口定义

```typescript
interface ImageTool extends BaseTool {
  type: 'image';
  
  // 默认属性
  defaultProps: {
    opacity: number;
    maintainAspectRatio: boolean;
  };
  
  // 图片状态
  selectedImage: File | string | null;
  isPlacing: boolean;
  placementPoint: Point | null;
  
  // 图片方法
  selectImage: (file: File | string) => Promise<void>;
  startPlacement: (point: Point) => void;
  updatePlacement: (point: Point) => void;
  finishPlacement: () => AnnotationObject | null;
  cancelPlacement: () => void;
  
  // 图片处理
  loadImage: (source: File | string) => Promise<HTMLImageElement>;
  resizeImage: (image: HTMLImageElement, maxWidth: number, maxHeight: number) => string;
  
  getPreviewObject: () => Partial<AnnotationObject> | null;
}
```

#### 使用示例

```typescript
import { ImageTool } from '@annotation/web';

const imageTool = new ImageTool({
  defaultProps: {
    opacity: 1,
    maintainAspectRatio: true
  },
  onObjectCreate: (object) => {
    console.log('创建贴图:', object);
  }
});

// 选择图片文件
const fileInput = document.createElement('input');
fileInput.type = 'file';
fileInput.accept = 'image/*';
fileInput.onchange = async (e) => {
  const file = e.target.files[0];
  if (file) {
    await imageTool.selectImage(file);
  }
};

// 开始放置图片
imageTool.startPlacement({ x: 100, y: 100 });

// 完成放置
const newImage = imageTool.finishPlacement();
```

## 工具管理器

### ToolManager

工具管理器负责工具的注册、切换和生命周期管理。

#### 接口定义

```typescript
interface ToolManager {
  // 工具注册
  registerTool: (tool: BaseTool) => void;
  unregisterTool: (type: ToolType) => void;
  getTool: (type: ToolType) => BaseTool | undefined;
  getAllTools: () => BaseTool[];
  
  // 工具切换
  activeTool: BaseTool | null;
  setActiveTool: (type: ToolType) => void;
  getActiveTool: () => BaseTool | null;
  
  // 事件分发
  handleCanvasEvent: (event: CanvasEvent) => void;
  handleKeyboardEvent: (event: KeyboardEvent) => void;
  
  // 配置管理
  setToolConfig: (type: ToolType, config: Partial<BaseTool>) => void;
  getToolConfig: (type: ToolType) => BaseTool | undefined;
}
```

#### 使用示例

```typescript
import { ToolManager, SelectTool, RectangleTool } from '@annotation/web';

const toolManager = new ToolManager();

// 注册工具
toolManager.registerTool(new SelectTool());
toolManager.registerTool(new RectangleTool());

// 切换工具
toolManager.setActiveTool('rectangle');

// 处理画布事件
const handleCanvasClick = (event) => {
  toolManager.handleCanvasEvent({
    type: 'click',
    point: { x: event.offsetX, y: event.offsetY },
    originalEvent: event
  });
};
```

## 工具配置

### 全局配置

```typescript
interface ToolsConfig {
  // 默认工具
  defaultTool: ToolType;
  
  // 工具列表
  enabledTools: ToolType[];
  
  // 快捷键映射
  shortcuts: Record<string, ToolType>;
  
  // 工具属性
  toolDefaults: Record<ToolType, any>;
  
  // 行为配置
  autoSwitchToSelect: boolean;  // 创建对象后自动切换到选择工具
  showPreview: boolean;         // 是否显示绘制预览
  snapToGrid: boolean;          // 是否吸附网格
  snapThreshold: number;        // 吸附阈值
}
```

### 默认配置

```typescript
export const DEFAULT_TOOLS_CONFIG: ToolsConfig = {
  defaultTool: 'select',
  enabledTools: [
    'select', 'rectangle', 'circle', 'arrow', 
    'text', 'mosaic', 'gradient', 'image'
  ],
  shortcuts: {
    'v': 'select',
    'r': 'rectangle',
    'c': 'circle',
    'a': 'arrow',
    't': 'text',
    'm': 'mosaic',
    'g': 'gradient',
    'i': 'image'
  },
  toolDefaults: {
    rectangle: {
      fill: '#ffffff',
      stroke: '#000000',
      strokeWidth: 2,
      opacity: 0.8
    },
    circle: {
      fill: '#ffffff',
      stroke: '#000000',
      strokeWidth: 2,
      opacity: 0.8
    },
    text: {
      fontSize: 16,
      fontFamily: 'Arial',
      fill: '#000000',
      opacity: 1
    }
  },
  autoSwitchToSelect: true,
  showPreview: true,
  snapToGrid: false,
  snapThreshold: 5
};
```

## 自定义工具

### 创建自定义工具

```typescript
import { BaseTool } from '@annotation/web';

class CustomStarTool implements BaseTool {
  type: 'star' as ToolType;
  name = '星形工具';
  icon = StarIcon;
  cursor = 'crosshair';
  
  private isDrawing = false;
  private centerPoint: Point | null = null;
  private radius = 0;
  
  onCanvasClick = (event: CanvasClickEvent) => {
    if (!this.isDrawing) {
      this.startDrawing(event.point);
    } else {
      this.finishDrawing();
    }
  };
  
  onCanvasDrag = (event: CanvasDragEvent) => {
    if (this.isDrawing) {
      this.updateDrawing(event.point);
    }
  };
  
  startDrawing(point: Point) {
    this.isDrawing = true;
    this.centerPoint = point;
    this.radius = 0;
  }
  
  updateDrawing(point: Point) {
    if (this.centerPoint) {
      const dx = point.x - this.centerPoint.x;
      const dy = point.y - this.centerPoint.y;
      this.radius = Math.sqrt(dx * dx + dy * dy);
    }
  }
  
  finishDrawing(): AnnotationObject | null {
    if (this.centerPoint && this.radius > 5) {
      const starObject: AnnotationObject = {
        id: `star-${Date.now()}`,
        type: 'star',
        name: '星形',
        x: this.centerPoint.x - this.radius,
        y: this.centerPoint.y - this.radius,
        width: this.radius * 2,
        height: this.radius * 2,
        rotation: 0,
        visible: true,
        locked: false,
        fill: '#ffff00',
        stroke: '#000000',
        strokeWidth: 2,
        opacity: 1,
        // 星形特有属性
        starPoints: 5,
        innerRadius: this.radius * 0.6,
        outerRadius: this.radius
      };
      
      this.resetDrawing();
      return starObject;
    }
    
    this.resetDrawing();
    return null;
  }
  
  private resetDrawing() {
    this.isDrawing = false;
    this.centerPoint = null;
    this.radius = 0;
  }
}

// 注册自定义工具
const customTool = new CustomStarTool();
toolManager.registerTool(customTool);
```

### 工具插件系统

```typescript
interface ToolPlugin {
  name: string;
  version: string;
  description: string;
  
  // 工具定义
  tools: BaseTool[];
  
  // 生命周期
  install?: (toolManager: ToolManager) => void;
  uninstall?: (toolManager: ToolManager) => void;
  
  // 依赖
  dependencies?: string[];
}

// 插件管理器
class PluginManager {
  private plugins = new Map<string, ToolPlugin>();
  
  registerPlugin(plugin: ToolPlugin) {
    this.plugins.set(plugin.name, plugin);
    plugin.install?.(toolManager);
  }
  
  unregisterPlugin(name: string) {
    const plugin = this.plugins.get(name);
    if (plugin) {
      plugin.uninstall?.(toolManager);
      this.plugins.delete(name);
    }
  }
}
```