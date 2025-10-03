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
  | 'measure';

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