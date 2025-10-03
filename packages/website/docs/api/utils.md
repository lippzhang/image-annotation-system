# 工具函数

本文档详细介绍图片标注系统中提供的工具函数和实用方法。

## 图层工具函数

### generateLayerName

生成图层名称的工具函数。

```typescript
function generateLayerName(toolType: ToolType, index: number): string
```

#### 参数

- `toolType` - 工具类型
- `index` - 图层索引

#### 返回值

返回生成的图层名称字符串。

#### 示例

```typescript
import { generateLayerName } from '@annotation/web';

const layerName = generateLayerName('rectangle', 1);
// 返回: "矩形 1"

const textLayerName = generateLayerName('text', 3);
// 返回: "文本 3"
```

### getLayerIcon

获取图层图标的工具函数。

```typescript
function getLayerIcon(type: ToolType): React.ComponentType
```

#### 参数

- `type` - 工具类型

#### 返回值

返回对应的图标组件。

#### 示例

```typescript
import { getLayerIcon } from '@annotation/web';

const RectIcon = getLayerIcon('rectangle');
const CircleIcon = getLayerIcon('circle');

// 在组件中使用
<RectIcon size={16} />
<CircleIcon size={16} />
```

### isObjectVisible

检查对象是否在视口范围内可见。

```typescript
function isObjectVisible(
  object: AnnotationObject,
  viewport: { x: number; y: number; width: number; height: number }
): boolean
```

#### 参数

- `object` - 标注对象
- `viewport` - 视口范围

#### 返回值

返回对象是否可见的布尔值。

#### 示例

```typescript
import { isObjectVisible } from '@annotation/web';

const viewport = { x: 0, y: 0, width: 800, height: 600 };
const isVisible = isObjectVisible(annotationObject, viewport);

if (isVisible) {
  // 渲染对象
}
```

## 画布工具函数

### 坐标转换

#### screenToCanvas

将屏幕坐标转换为画布坐标。

```typescript
function screenToCanvas(
  screenPoint: { x: number; y: number },
  canvasState: CanvasState
): { x: number; y: number }
```

#### canvasToScreen

将画布坐标转换为屏幕坐标。

```typescript
function canvasToScreen(
  canvasPoint: { x: number; y: number },
  canvasState: CanvasState
): { x: number; y: number }
```

#### 示例

```typescript
import { screenToCanvas, canvasToScreen } from '@annotation/web';

// 屏幕坐标转画布坐标
const canvasPoint = screenToCanvas(
  { x: 100, y: 100 }, 
  canvasState
);

// 画布坐标转屏幕坐标
const screenPoint = canvasToScreen(
  { x: 50, y: 50 }, 
  canvasState
);
```

### 碰撞检测

#### isPointInObject

检查点是否在对象内部。

```typescript
function isPointInObject(
  point: { x: number; y: number },
  object: AnnotationObject
): boolean
```

#### getObjectBounds

获取对象的边界框。

```typescript
function getObjectBounds(
  object: AnnotationObject
): { x: number; y: number; width: number; height: number }
```

#### 示例

```typescript
import { isPointInObject, getObjectBounds } from '@annotation/web';

// 检查点击是否在对象内
const isInside = isPointInObject({ x: 100, y: 100 }, object);

// 获取对象边界
const bounds = getObjectBounds(object);
console.log('边界:', bounds);
```

### 几何计算

#### calculateDistance

计算两点之间的距离。

```typescript
function calculateDistance(
  point1: { x: number; y: number },
  point2: { x: number; y: number }
): number
```

#### calculateAngle

计算两点之间的角度。

```typescript
function calculateAngle(
  point1: { x: number; y: number },
  point2: { x: number; y: number }
): number
```

#### rotatePoint

围绕中心点旋转坐标。

```typescript
function rotatePoint(
  point: { x: number; y: number },
  center: { x: number; y: number },
  angle: number
): { x: number; y: number }
```

#### 示例

```typescript
import { calculateDistance, calculateAngle, rotatePoint } from '@annotation/web';

// 计算距离
const distance = calculateDistance({ x: 0, y: 0 }, { x: 3, y: 4 });
// 返回: 5

// 计算角度（弧度）
const angle = calculateAngle({ x: 0, y: 0 }, { x: 1, y: 1 });
// 返回: π/4

// 旋转点
const rotated = rotatePoint(
  { x: 10, y: 0 }, 
  { x: 0, y: 0 }, 
  Math.PI / 2
);
// 返回: { x: 0, y: 10 }
```

## 颜色工具函数

### 颜色转换

#### hexToRgba

将十六进制颜色转换为 RGBA 格式。

```typescript
function hexToRgba(hex: string, alpha?: number): string
```

#### rgbaToHex

将 RGBA 颜色转换为十六进制格式。

```typescript
function rgbaToHex(rgba: string): string
```

#### hslToRgb

将 HSL 颜色转换为 RGB 格式。

```typescript
function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number }
```

#### rgbToHsl

将 RGB 颜色转换为 HSL 格式。

```typescript
function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number }
```

#### 示例

```typescript
import { hexToRgba, rgbaToHex, hslToRgb, rgbToHsl } from '@annotation/web';

// 十六进制转 RGBA
const rgba = hexToRgba('#ff0000', 0.5);
// 返回: "rgba(255, 0, 0, 0.5)"

// RGBA 转十六进制
const hex = rgbaToHex('rgba(255, 0, 0, 1)');
// 返回: "#ff0000"

// HSL 转 RGB
const rgb = hslToRgb(0, 1, 0.5);
// 返回: { r: 255, g: 0, b: 0 }

// RGB 转 HSL
const hsl = rgbToHsl(255, 0, 0);
// 返回: { h: 0, s: 1, l: 0.5 }
```

### 颜色验证

#### isValidColor

验证颜色字符串是否有效。

```typescript
function isValidColor(color: string): boolean
```

#### parseColor

解析颜色字符串并返回标准化格式。

```typescript
function parseColor(color: string): {
  r: number;
  g: number;
  b: number;
  a: number;
} | null
```

#### 示例

```typescript
import { isValidColor, parseColor } from '@annotation/web';

// 验证颜色
const isValid1 = isValidColor('#ff0000'); // true
const isValid2 = isValidColor('red'); // true
const isValid3 = isValidColor('invalid'); // false

// 解析颜色
const parsed = parseColor('#ff0000');
// 返回: { r: 255, g: 0, b: 0, a: 1 }
```

### 颜色生成

#### generateRandomColor

生成随机颜色。

```typescript
function generateRandomColor(): string
```

#### generateColorPalette

生成调色板。

```typescript
function generateColorPalette(baseColor: string, count: number): string[]
```

#### 示例

```typescript
import { generateRandomColor, generateColorPalette } from '@annotation/web';

// 生成随机颜色
const randomColor = generateRandomColor();
// 返回: "#a3b2c1" (随机)

// 生成调色板
const palette = generateColorPalette('#ff0000', 5);
// 返回: ["#ff0000", "#ff3333", "#ff6666", "#ff9999", "#ffcccc"]
```

## 文件处理函数

### 图片处理

#### loadImageFromFile

从文件加载图片。

```typescript
function loadImageFromFile(file: File): Promise<HTMLImageElement>
```

#### loadImageFromUrl

从 URL 加载图片。

```typescript
function loadImageFromUrl(url: string): Promise<HTMLImageElement>
```

#### resizeImage

调整图片大小。

```typescript
function resizeImage(
  image: HTMLImageElement,
  maxWidth: number,
  maxHeight: number,
  maintainAspectRatio?: boolean
): Promise<string>
```

#### 示例

```typescript
import { loadImageFromFile, loadImageFromUrl, resizeImage } from '@annotation/web';

// 从文件加载图片
const fileInput = document.querySelector('input[type="file"]');
fileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (file) {
    const image = await loadImageFromFile(file);
    console.log('图片加载完成:', image);
  }
});

// 从 URL 加载图片
const image = await loadImageFromUrl('/path/to/image.jpg');

// 调整图片大小
const resizedDataUrl = await resizeImage(image, 800, 600, true);
```

### 文件验证

#### isValidImageFile

验证是否为有效的图片文件。

```typescript
function isValidImageFile(file: File): boolean
```

#### getFileExtension

获取文件扩展名。

```typescript
function getFileExtension(filename: string): string
```

#### formatFileSize

格式化文件大小显示。

```typescript
function formatFileSize(bytes: number): string
```

#### 示例

```typescript
import { isValidImageFile, getFileExtension, formatFileSize } from '@annotation/web';

// 验证图片文件
const isValid = isValidImageFile(file);

// 获取扩展名
const ext = getFileExtension('image.jpg'); // 返回: "jpg"

// 格式化文件大小
const size = formatFileSize(1024 * 1024); // 返回: "1.0 MB"
```

## 数据处理函数

### 对象操作

#### cloneObject

深度克隆标注对象。

```typescript
function cloneObject<T>(obj: T): T
```

#### mergeObjects

合并多个对象。

```typescript
function mergeObjects<T>(...objects: Partial<T>[]): T
```

#### compareObjects

比较两个对象是否相等。

```typescript
function compareObjects<T>(obj1: T, obj2: T): boolean
```

#### 示例

```typescript
import { cloneObject, mergeObjects, compareObjects } from '@annotation/web';

// 克隆对象
const cloned = cloneObject(originalObject);

// 合并对象
const merged = mergeObjects(
  { x: 10, y: 20 },
  { width: 100 },
  { height: 50 }
);
// 返回: { x: 10, y: 20, width: 100, height: 50 }

// 比较对象
const isEqual = compareObjects(obj1, obj2);
```

### 数组操作

#### removeArrayItem

从数组中移除指定项。

```typescript
function removeArrayItem<T>(array: T[], item: T): T[]
```

#### moveArrayItem

移动数组中的项。

```typescript
function moveArrayItem<T>(array: T[], fromIndex: number, toIndex: number): T[]
```

#### findArrayItem

在数组中查找项。

```typescript
function findArrayItem<T>(
  array: T[], 
  predicate: (item: T) => boolean
): T | undefined
```

#### 示例

```typescript
import { removeArrayItem, moveArrayItem, findArrayItem } from '@annotation/web';

// 移除数组项
const newArray = removeArrayItem([1, 2, 3, 4], 2);
// 返回: [1, 3, 4]

// 移动数组项
const moved = moveArrayItem([1, 2, 3, 4], 0, 2);
// 返回: [2, 3, 1, 4]

// 查找数组项
const found = findArrayItem(objects, obj => obj.id === 'target-id');
```

## 验证函数

### 数据验证

#### validateAnnotationObject

验证标注对象数据的完整性。

```typescript
function validateAnnotationObject(object: any): object is AnnotationObject
```

#### validateToolType

验证工具类型是否有效。

```typescript
function validateToolType(type: string): type is ToolType
```

#### validateCoordinates

验证坐标数据是否有效。

```typescript
function validateCoordinates(x: number, y: number): boolean
```

#### 示例

```typescript
import { 
  validateAnnotationObject, 
  validateToolType, 
  validateCoordinates 
} from '@annotation/web';

// 验证标注对象
if (validateAnnotationObject(data)) {
  // data 是有效的 AnnotationObject
  console.log('对象验证通过');
}

// 验证工具类型
if (validateToolType('rectangle')) {
  // 类型有效
}

// 验证坐标
if (validateCoordinates(100, 200)) {
  // 坐标有效
}
```

### 边界检查

#### isPointInBounds

检查点是否在边界内。

```typescript
function isPointInBounds(
  point: { x: number; y: number },
  bounds: { x: number; y: number; width: number; height: number }
): boolean
```

#### clampValue

将数值限制在指定范围内。

```typescript
function clampValue(value: number, min: number, max: number): number
```

#### 示例

```typescript
import { isPointInBounds, clampValue } from '@annotation/web';

// 检查点是否在边界内
const inBounds = isPointInBounds(
  { x: 50, y: 50 },
  { x: 0, y: 0, width: 100, height: 100 }
);

// 限制数值范围
const clamped = clampValue(150, 0, 100); // 返回: 100
```

## 格式化函数

### 数值格式化

#### formatNumber

格式化数字显示。

```typescript
function formatNumber(value: number, precision?: number): string
```

#### formatPercentage

格式化百分比显示。

```typescript
function formatPercentage(value: number): string
```

#### formatAngle

格式化角度显示。

```typescript
function formatAngle(radians: number, unit?: 'deg' | 'rad'): string
```

#### 示例

```typescript
import { formatNumber, formatPercentage, formatAngle } from '@annotation/web';

// 格式化数字
const formatted = formatNumber(3.14159, 2); // 返回: "3.14"

// 格式化百分比
const percentage = formatPercentage(0.75); // 返回: "75%"

// 格式化角度
const angle = formatAngle(Math.PI / 4, 'deg'); // 返回: "45°"
```

### 文本格式化

#### truncateText

截断文本并添加省略号。

```typescript
function truncateText(text: string, maxLength: number): string
```

#### capitalizeFirst

首字母大写。

```typescript
function capitalizeFirst(text: string): string
```

#### 示例

```typescript
import { truncateText, capitalizeFirst } from '@annotation/web';

// 截断文本
const truncated = truncateText('这是一段很长的文本', 10);
// 返回: "这是一段很长..."

// 首字母大写
const capitalized = capitalizeFirst('hello world');
// 返回: "Hello world"
```

## 性能优化函数

### 防抖和节流

#### debounce

防抖函数。

```typescript
function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void
```

#### throttle

节流函数。

```typescript
function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void
```

#### 示例

```typescript
import { debounce, throttle } from '@annotation/web';

// 防抖搜索
const debouncedSearch = debounce((query: string) => {
  // 执行搜索
}, 300);

// 节流滚动
const throttledScroll = throttle(() => {
  // 处理滚动
}, 100);
```

### 缓存

#### memoize

记忆化函数结果。

```typescript
function memoize<T extends (...args: any[]) => any>(func: T): T
```

#### 示例

```typescript
import { memoize } from '@annotation/web';

// 记忆化昂贵的计算
const expensiveCalculation = memoize((x: number, y: number) => {
  // 复杂计算
  return Math.sqrt(x * x + y * y);
});

// 第一次调用会执行计算
const result1 = expensiveCalculation(3, 4);

// 第二次调用相同参数会直接返回缓存结果
const result2 = expensiveCalculation(3, 4);
```

## 错误处理函数

### 错误创建

#### createError

创建标准化错误对象。

```typescript
function createError(
  code: string,
  message: string,
  details?: any
): AnnotationError
```

#### 示例

```typescript
import { createError, ERROR_CODES } from '@annotation/web';

// 创建错误
const error = createError(
  ERROR_CODES.INVALID_COORDINATES,
  '坐标值无效',
  { x: -1, y: -1 }
);

throw error;
```

### 错误处理

#### handleAsyncError

处理异步操作错误。

```typescript
function handleAsyncError<T>(
  promise: Promise<T>,
  errorHandler?: (error: Error) => void
): Promise<[T | null, Error | null]>
```

#### 示例

```typescript
import { handleAsyncError } from '@annotation/web';

// 安全的异步操作
const [result, error] = await handleAsyncError(
  loadImageFromUrl('/path/to/image.jpg')
);

if (error) {
  console.error('图片加载失败:', error);
} else {
  console.log('图片加载成功:', result);
}
```

## 常量和枚举

### 预定义常量

```typescript
// 默认值常量
export const DEFAULTS = {
  OBJECT_WIDTH: 100,
  OBJECT_HEIGHT: 100,
  STROKE_WIDTH: 2,
  FONT_SIZE: 16,
  OPACITY: 1,
  ROTATION: 0,
} as const;

// 限制值常量
export const LIMITS = {
  MIN_SIZE: 5,
  MAX_SIZE: 5000,
  MIN_FONT_SIZE: 8,
  MAX_FONT_SIZE: 200,
  MIN_OPACITY: 0,
  MAX_OPACITY: 1,
} as const;

// 颜色常量
export const COLORS = {
  PRIMARY: '#1890ff',
  SUCCESS: '#52c41a',
  WARNING: '#faad14',
  ERROR: '#f5222d',
  WHITE: '#ffffff',
  BLACK: '#000000',
  TRANSPARENT: 'transparent',
} as const;
```

### 工具函数组合

#### createToolUtils

创建工具函数集合。

```typescript
function createToolUtils() {
  return {
    // 图层工具
    layer: {
      generateName: generateLayerName,
      getIcon: getLayerIcon,
      isVisible: isObjectVisible,
    },
    
    // 画布工具
    canvas: {
      screenToCanvas,
      canvasToScreen,
      isPointInObject,
      getObjectBounds,
    },
    
    // 颜色工具
    color: {
      hexToRgba,
      rgbaToHex,
      isValidColor,
      generateRandom: generateRandomColor,
    },
    
    // 验证工具
    validate: {
      object: validateAnnotationObject,
      toolType: validateToolType,
      coordinates: validateCoordinates,
    },
    
    // 格式化工具
    format: {
      number: formatNumber,
      percentage: formatPercentage,
      angle: formatAngle,
      text: truncateText,
    },
  };
}

// 使用示例
const utils = createToolUtils();
const layerName = utils.layer.generateName('rectangle', 1);
const isValid = utils.validate.coordinates(100, 200);
```

这些工具函数为图片标注系统提供了完整的功能支持，涵盖了从基础的数据处理到复杂的图形计算等各个方面。开发者可以根据需要选择合适的函数来实现特定的功能。