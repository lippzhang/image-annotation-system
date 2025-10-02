import { BackgroundImage } from '../types';

interface CanvasSize {
  width: number;
  height: number;
}

/**
 * 计算图片的居中位置和缩放比例
 * @param img - HTML图片元素
 * @param canvasSize - 画布尺寸
 * @returns 背景图片配置对象
 */
export const calculateCenteredImagePosition = (
  img: HTMLImageElement,
  canvasSize: CanvasSize = { width: 800, height: 600 }
): BackgroundImage => {
  // 计算缩放比例，使图片适应画布
  const scaleX = canvasSize.width / img.width;
  const scaleY = canvasSize.height / img.height;
  
  // 使用较小的缩放比例，保持图片比例
  const scale = Math.min(scaleX, scaleY, 1); // 不放大图片，最大缩放比例为1
  
  // 计算缩放后的图片尺寸
  const scaledWidth = img.width * scale;
  const scaledHeight = img.height * scale;
  
  // 计算居中位置
  const x = (canvasSize.width - scaledWidth) / 2;
  const y = (canvasSize.height - scaledHeight) / 2;
  
  return {
    image: img,
    width: img.width,
    height: img.height,
    x: x,
    y: y,
    scaleX: scale,
    scaleY: scale,
  };
};