# 类型定义

本文档详细介绍图片标注系统的核心类型定义。

## 核心类型

### ToolType

定义所有可用的标注工具类型：

```typescript
export type ToolType = 
  | 'select'      // 选择工具
  | 'rectangle'   // 矩形工具
  | 'circle'      // 圆形工具
  | 'arrow'       // 箭头工具
  | 'text'        // 文本工具
  | 'mosaic'      // 马赛克工具
  | 'gradient'    // 渐变背景工具
  | 'image';      // 贴图工具
```

### AnnotationObject

标注对象的核心数据结构：

```typescript
export interface AnnotationObject {
  // 基础属性
  id: string;                    // 唯一标识符
  type: ToolType;               // 对象类型
  name: string;                 // 对象名称
  
  // 位置和变换
  x: number;                    // X 坐标
  y: number;                    // Y 坐标
  width: number;                // 宽度
  height: number;               // 高度
  rotation: number;             // 旋转角度（度）
  
  // 状态属性
  visible: boolean;             // 是否可见
  locked: boolean;              // 是否锁定
  
  // 样式属性
  fill?: string;                // 填充颜色
  stroke?: string;              // 边框颜色
  strokeWidth?: number;         // 边框宽度
  opacity?: number;             // 透明度 (0-1)
  
  // 文本工具特有属性
  text?: string;                // 文本内容
  fontSize?: number;            // 字体大小
  fontFamily?: string;          // 字体族
  fontWeight?: 'normal' | 'bold'; // 字体粗细
  textAlign?: 'left' | 'center' | 'right'; // 文本对齐
  
  // 箭头工具特有属性
  points?: number[];            // 箭头路径点
  
  // 马赛克工具特有属性
  mosaicColor?: string;         // 马赛克颜色
  
  // 渐变背景工具特有属性
  gradientColors?: string[];    // 渐变颜色数组
  gradientDirection?: GradientDirection; // 渐变方向
  
  // 贴图工具特有属性
  imageUrl?: string;            // 图片 URL
  imageData?: string;           // 图片数据（base64）
  imageWidth?: number;          // 原始图片宽度
  imageHeight?: number;         // 原始图片高度
}
```

### GradientDirection

渐变方向枚举：

```typescript
export type GradientDirection = 
  | 'left-to-right'      // 从左到右
  | 'right-to-left'      // 从右到左
  | 'top-to-bottom'      // 从上到下
  | 'bottom-to-top'      // 从下到上
  | 'top-left-to-bottom-right'    // 从左上到右下
  | 'top-right-to-bottom-left'    // 从右上到左下
  | 'bottom-left-to-top-right'    // 从左下到右上
  | 'bottom-right-to-top-left';   // 从右下到左上
```

### CanvasState

画布状态管理接口：

```typescript
export interface CanvasState {
  // 工具状态
  selectedTool: ToolType;       // 当前选中的工具
  
  // 对象管理
  objects: AnnotationObject[];  // 所有标注对象
  selectedIds: string[];        // 选中对象的 ID 列表
  
  // 画布状态
  scale: number;                // 缩放比例
  position: { x: number; y: number }; // 画布位置
  
  // 图片状态
  imageUrl: string | null;      // 背景图片 URL
  imageSize: { width: number; height: number }; // 图片尺寸
  
  // 历史记录
  history: CanvasState[];       // 历史状态
  historyIndex: number;         // 当前历史索引
}
```

## 事件类型

### 对象事件

```typescript
// 对象选择事件
export interface ObjectSelectEvent {
  objectIds: string[];
  objects: AnnotationObject[];
}

// 对象变换事件
export interface ObjectTransformEvent {
  objectId: string;
  object: AnnotationObject;
  changes: Partial<AnnotationObject>;
}

// 对象创建事件
export interface ObjectCreateEvent {
  object: AnnotationObject;
}

// 对象删除事件
export interface ObjectDeleteEvent {
  objectIds: string[];
  objects: AnnotationObject[];
}
```

### 工具事件

```typescript
// 工具切换事件
export interface ToolChangeEvent {
  previousTool: ToolType;
  currentTool: ToolType;
}

// 工具操作事件
export interface ToolOperationEvent {
  tool: ToolType;
  operation: 'start' | 'progress' | 'complete' | 'cancel';
  data?: any;
}
```

## 配置类型

### 工具配置

```typescript
export interface ToolConfig {
  type: ToolType;               // 工具类型
  label: string;                // 显示标签
  icon: React.ComponentType;    // 工具图标
  shortcut?: string;            // 快捷键
  cursor?: string;              // 鼠标样式
  enabled?: boolean;            // 是否启用
}
```

### 画布配置

```typescript
export interface CanvasConfig {
  width: number;                // 画布宽度
  height: number;               // 画布高度
  backgroundColor?: string;     // 背景颜色
  gridEnabled?: boolean;        // 是否显示网格
  gridSize?: number;           // 网格大小
  snapToGrid?: boolean;        // 是否吸附网格
  minScale?: number;           // 最小缩放比例
  maxScale?: number;           // 最大缩放比例
}
```

### 导出配置

```typescript
export interface ExportConfig {
  format: 'png' | 'jpg' | 'svg'; // 导出格式
  quality?: number;             // 图片质量 (0-1)
  width?: number;               // 导出宽度
  height?: number;              // 导出高度
  backgroundColor?: string;     // 背景颜色
  includeBackground?: boolean;  // 是否包含背景
  pixelRatio?: number;         // 像素比例
}
```

## 工具函数类型

### 图层工具

```typescript
// 生成图层名称
export function generateLayerName(
  toolType: ToolType, 
  index: number
): string;

// 获取图层图标
export function getLayerIcon(
  type: ToolType
): React.ComponentType;

// 检查对象是否可见
export function isObjectVisible(
  object: AnnotationObject,
  viewport: { x: number; y: number; width: number; height: number }
): boolean;
```

### 画布工具

```typescript
// 坐标转换
export function screenToCanvas(
  screenPoint: { x: number; y: number },
  canvasState: CanvasState
): { x: number; y: number };

export function canvasToScreen(
  canvasPoint: { x: number; y: number },
  canvasState: CanvasState
): { x: number; y: number };

// 碰撞检测
export function isPointInObject(
  point: { x: number; y: number },
  object: AnnotationObject
): boolean;

export function getObjectBounds(
  object: AnnotationObject
): { x: number; y: number; width: number; height: number };
```

### 颜色工具

```typescript
// 颜色转换
export function hexToRgba(
  hex: string, 
  alpha?: number
): string;

export function rgbaToHex(
  rgba: string
): string;

// 颜色验证
export function isValidColor(
  color: string
): boolean;
```

## Hook 类型

### useCanvasState

```typescript
export interface UseCanvasStateReturn {
  state: CanvasState;
  
  // 对象操作
  addObject: (object: AnnotationObject) => void;
  updateObject: (id: string, updates: Partial<AnnotationObject>) => void;
  deleteObject: (id: string) => void;
  selectObjects: (ids: string[]) => void;
  
  // 工具操作
  setTool: (tool: ToolType) => void;
  
  // 历史操作
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  
  // 画布操作
  setScale: (scale: number) => void;
  setPosition: (position: { x: number; y: number }) => void;
  resetView: () => void;
}
```

### useKeyboard

```typescript
export interface KeyboardHandlers {
  onDelete?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onSelectAll?: () => void;
  onCopy?: () => void;
  onPaste?: () => void;
  onToolChange?: (tool: ToolType) => void;
}

export function useKeyboard(
  handlers: KeyboardHandlers
): void;
```

## 常量定义

### 默认值

```typescript
export const DEFAULT_OBJECT_PROPS = {
  width: 100,
  height: 100,
  rotation: 0,
  visible: true,
  locked: false,
  fill: '#ffffff',
  stroke: '#000000',
  strokeWidth: 2,
  opacity: 1,
} as const;

export const DEFAULT_TEXT_PROPS = {
  fontSize: 16,
  fontFamily: 'Arial',
  fontWeight: 'normal' as const,
  textAlign: 'left' as const,
} as const;

export const DEFAULT_CANVAS_CONFIG = {
  width: 800,
  height: 600,
  backgroundColor: '#f0f0f0',
  gridEnabled: false,
  gridSize: 20,
  snapToGrid: false,
  minScale: 0.1,
  maxScale: 5,
} as const;
```

### 限制值

```typescript
export const LIMITS = {
  MAX_OBJECTS: 1000,           // 最大对象数量
  MAX_HISTORY: 50,             // 最大历史记录数
  MAX_IMAGE_SIZE: 10 * 1024 * 1024, // 最大图片大小 (10MB)
  MIN_OBJECT_SIZE: 5,          // 最小对象尺寸
  MAX_OBJECT_SIZE: 5000,       // 最大对象尺寸
  MIN_FONT_SIZE: 8,            // 最小字体大小
  MAX_FONT_SIZE: 200,          // 最大字体大小
} as const;
```

## 错误类型

```typescript
export class AnnotationError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any
  ) {
    super(message);
    this.name = 'AnnotationError';
  }
}

export const ERROR_CODES = {
  INVALID_TOOL_TYPE: 'INVALID_TOOL_TYPE',
  OBJECT_NOT_FOUND: 'OBJECT_NOT_FOUND',
  INVALID_COORDINATES: 'INVALID_COORDINATES',
  IMAGE_LOAD_FAILED: 'IMAGE_LOAD_FAILED',
  EXPORT_FAILED: 'EXPORT_FAILED',
} as const;
```

## 类型守卫

```typescript
// 检查是否为有效的工具类型
export function isValidToolType(type: string): type is ToolType {
  const validTypes: ToolType[] = [
    'select', 'rectangle', 'circle', 'arrow', 
    'text', 'mosaic', 'gradient', 'image'
  ];
  return validTypes.includes(type as ToolType);
}

// 检查是否为文本对象
export function isTextObject(object: AnnotationObject): boolean {
  return object.type === 'text' && typeof object.text === 'string';
}

// 检查是否为图片对象
export function isImageObject(object: AnnotationObject): boolean {
  return object.type === 'image' && 
    (typeof object.imageUrl === 'string' || typeof object.imageData === 'string');
}
```

## 实用类型

```typescript
// 部分对象更新类型
export type ObjectUpdate = Partial<Omit<AnnotationObject, 'id' | 'type'>>;

// 对象创建参数类型
export type CreateObjectParams = Omit<AnnotationObject, 'id' | 'name'> & {
  name?: string;
};

// 工具特定属性类型
export type TextObjectProps = Pick<AnnotationObject, 
  'text' | 'fontSize' | 'fontFamily' | 'fontWeight' | 'textAlign'
>;

export type ImageObjectProps = Pick<AnnotationObject, 
  'imageUrl' | 'imageData' | 'imageWidth' | 'imageHeight'
>;

export type GradientObjectProps = Pick<AnnotationObject, 
  'gradientColors' | 'gradientDirection'
>;
```