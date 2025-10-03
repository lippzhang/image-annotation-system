# 开发环境搭建

本文档将指导您如何搭建图片标注系统的开发环境。

## 系统要求

### 必需软件

- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0（推荐）或 npm >= 9.0.0
- **Git** >= 2.20.0

### 推荐开发工具

- **VS Code** - 推荐的代码编辑器
- **Chrome DevTools** - 用于调试和性能分析
- **React Developer Tools** - React 组件调试
- **Git GUI 工具** - 如 SourceTree、GitKraken 等

## 获取源码

### 克隆仓库

```bash
git clone https://github.com/your-username/annotation-system.git
cd annotation-system
```

### 分支说明

- `main` - 主分支，包含稳定版本代码
- `develop` - 开发分支，包含最新开发功能
- `feature/*` - 功能分支，用于开发新功能
- `hotfix/*` - 热修复分支，用于紧急修复

## 安装依赖

### 使用 pnpm（推荐）

```bash
# 安装 pnpm
npm install -g pnpm

# 安装项目依赖
pnpm install
```

### 使用 npm

```bash
npm install
```

## 项目结构

```
annotation-system/
├── packages/
│   ├── web/                    # 主应用
│   │   ├── src/
│   │   │   ├── components/     # React 组件
│   │   │   ├── types/          # TypeScript 类型定义
│   │   │   ├── utils/          # 工具函数
│   │   │   ├── hooks/          # 自定义 Hooks
│   │   │   └── styles/         # 样式文件
│   │   ├── public/             # 静态资源
│   │   └── package.json
│   └── website/                # 文档网站
│       ├── docs/               # 文档内容
│       ├── rspress.config.ts   # 文档配置
│       └── package.json
├── pnpm-workspace.yaml         # pnpm 工作空间配置
├── package.json                # 根目录配置
└── README.md
```

## 开发命令

### 启动开发服务器

```bash
# 启动主应用开发服务器
pnpm dev

# 启动文档网站开发服务器
pnpm website:dev

# 同时启动所有服务
pnpm dev:all
```

### 构建项目

```bash
# 构建主应用
pnpm build

# 构建文档网站
pnpm website:build

# 构建所有包
pnpm build:all
```

### 代码检查

```bash
# TypeScript 类型检查
pnpm type-check

# 代码格式检查
pnpm lint

# 自动修复格式问题
pnpm lint:fix
```

## 开发服务器配置

### 主应用服务器

- **端口**: 3000
- **热重载**: 已启用
- **TypeScript**: 已启用类型检查
- **开发工具**: React DevTools 支持

### 文档网站服务器

- **端口**: 3001
- **热重载**: 已启用
- **Markdown**: 支持 MDX 语法

## 环境变量

创建 `.env.local` 文件来配置本地环境变量：

```bash
# 开发模式
NODE_ENV=development

# API 基础 URL（如果需要）
VITE_API_BASE_URL=http://localhost:3000

# 调试模式
VITE_DEBUG=true
```

## 调试配置

### VS Code 调试配置

在 `.vscode/launch.json` 中添加以下配置：

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Launch Chrome",
      "request": "launch",
      "type": "chrome",
      "url": "http://localhost:3000",
      "webRoot": "${workspaceFolder}/packages/web/src"
    }
  ]
}
```

### 浏览器调试

1. 安装 React Developer Tools 扩展
2. 打开浏览器开发者工具
3. 使用 React 和 Profiler 标签页进行调试

## 常见问题

### 依赖安装失败

```bash
# 清理缓存
pnpm store prune

# 删除 node_modules 重新安装
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### 端口冲突

如果默认端口被占用，可以修改配置：

```bash
# 使用不同端口启动
PORT=3001 pnpm dev
```

### TypeScript 错误

```bash
# 重新生成类型文件
pnpm type-check

# 重启 TypeScript 服务
# 在 VS Code 中按 Ctrl+Shift+P，输入 "TypeScript: Restart TS Server"
```

## 下一步

- 阅读 [项目架构](./architecture) 了解系统设计
- 查看 [组件开发](./components) 学习组件开发规范
- 参考 [工具开发](./tools) 了解如何开发新的标注工具