# 轻量级图片标注系统

基于 React 18 + KonvaJS + Rsbuild + pnpm10 + monorepo 构建的轻量级图片标注工具。

## 功能特性

- 🎨 **丰富的标注工具**: 文字、矩形、圆形、箭头、直线、画笔等
- 🖱️ **直观的操作**: 拖拽、缩放、旋转等交互操作
- 📐 **精确测量**: 支持尺寸标注和角度测量
- 🎯 **属性编辑**: 实时编辑图形属性（颜色、大小、位置等）
- 💾 **导出功能**: 支持多种格式导出
- 🔍 **缩放控制**: 灵活的画布缩放和平移
- 📱 **响应式设计**: 适配不同屏幕尺寸

## 技术栈

- **前端框架**: React 18
- **画布渲染**: KonvaJS + React-Konva
- **构建工具**: Rsbuild
- **包管理**: pnpm 10
- **项目结构**: Monorepo
- **开发语言**: TypeScript
- **图标库**: Lucide React

## 项目结构

```
image-annotation-system/
├── packages/
│   └── web/                 # 前端应用
│       ├── src/
│       │   ├── components/  # React 组件
│       │   ├── types/       # TypeScript 类型定义
│       │   ├── utils/       # 工具函数
│       │   └── styles/      # 样式文件
│       ├── public/          # 静态资源
│       └── package.json
├── package.json             # 根包配置
├── pnpm-workspace.yaml     # pnpm 工作空间配置
└── README.md
```

## 快速开始

### 环境要求

- Node.js >= 18.0.0
- pnpm >= 10.0.0

### 安装依赖

```bash
# 安装所有依赖
pnpm install
```

### 开发模式

```bash
# 启动开发服务器
pnpm dev
```

访问 http://localhost:3000 查看应用。

### 构建生产版本

```bash
# 构建生产版本
pnpm build
```

### 预览生产版本

```bash
# 预览构建结果
pnpm preview
```

## 主要组件

### AnnotationEditor
主编辑器组件，管理整个应用的状态和交互逻辑。

### Toolbar
顶部工具栏，包含常用操作按钮和缩放控制。

### Sidebar
左侧工具面板，提供各种标注工具的选择。

### PropertiesPanel
右侧属性面板，用于编辑选中图形的属性。

### CanvasObjects
画布对象渲染组件，负责渲染各种标注图形。

## 使用说明

1. **选择工具**: 在左侧工具面板选择需要的标注工具
2. **绘制图形**: 在画布上拖拽绘制图形
3. **编辑属性**: 选中图形后在右侧面板编辑属性
4. **缩放画布**: 使用顶部工具栏的缩放控制
5. **导出结果**: 使用导出功能保存标注结果

## 开发指南

### 添加新工具

1. 在 `types/index.ts` 中添加新的工具类型
2. 在 `Sidebar.tsx` 中添加工具配置
3. 在 `CanvasObjects.tsx` 中添加渲染逻辑
4. 在 `AnnotationEditor.tsx` 中添加交互逻辑

### 自定义样式

修改 `styles/global.css` 文件来自定义界面样式。

## 许可证

MIT License