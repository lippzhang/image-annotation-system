export interface Point {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export type ToolType = 
  | 'select'
  | 'drag'
  | 'text'
  | 'rectangle'
  | 'circle'
  | 'arrow'
  | 'line'
  | 'pen'
  | 'eraser'
  | 'step'
  | 'mosaic'
  | 'gradient'
  | 'image'
  | 'circle-magnifier'
  | 'square-magnifier';

export interface AnnotationObject {
  id: string;
  type: ToolType;
  x: number;
  y: number;
  width?: number;
  height?: number;
  points?: number[];
  text?: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  fontSize?: number;
  fontFamily?: string;
  rotation?: number;
  scaleX?: number;
  scaleY?: number;
  // 步骤工具专用属性
  stepNumber?: number;
  // 马赛克工具专用属性
  mosaicSize?: number; // 马赛克像素大小
  // 渐变工具专用属性
  gradientColors?: string[]; // 渐变颜色数组
  gradientDirection?: 'horizontal' | 'vertical' | 'diagonal'; // 渐变方向
  // 贴图工具专用属性
  imageUrl?: string; // 图片URL
  imageData?: string; // 图片base64数据
  imageWidth?: number; // 原始图片宽度
  imageHeight?: number; // 原始图片高度
  // 图层相关属性
  zIndex?: number;
  locked?: boolean;
  visible?: boolean;
  name?: string;
}

export interface BackgroundImage {
  image: HTMLImageElement;
  width: number;
  height: number;
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
}

export interface CanvasState {
  zoom: number;
  pan: Point;
  selectedTool: ToolType;
  selectedObjects: string[];
  objects: AnnotationObject[];
  isDrawing: boolean;
  backgroundImage?: BackgroundImage;
}

export interface ToolConfig {
  type: ToolType;
  label: string;
  icon: React.ReactNode;
  category: string;
}