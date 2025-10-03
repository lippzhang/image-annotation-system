# 贡献指南

感谢您对图片标注系统的关注！本文档将指导您如何为项目做出贡献。

## 贡献方式

### 报告问题

如果您发现了 bug 或有功能建议，请：

1. 在 GitHub Issues 中搜索是否已有相关问题
2. 如果没有，请创建新的 Issue
3. 使用合适的 Issue 模板
4. 提供详细的问题描述和复现步骤

### 提交代码

1. **Fork 仓库** - 点击 GitHub 页面右上角的 Fork 按钮
2. **克隆仓库** - 将您的 Fork 克隆到本地
3. **创建分支** - 为您的功能或修复创建新分支
4. **开发代码** - 按照代码规范进行开发
5. **测试代码** - 确保所有测试通过
6. **提交 PR** - 向主仓库提交 Pull Request

## 开发流程

### 分支管理

```bash
# 克隆您的 Fork
git clone https://github.com/your-username/annotation-system.git
cd annotation-system

# 添加上游仓库
git remote add upstream https://github.com/original-owner/annotation-system.git

# 创建功能分支
git checkout -b feature/your-feature-name

# 开发完成后推送分支
git push origin feature/your-feature-name
```

### 提交规范

使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

#### 提交类型

- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式调整（不影响功能）
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动

#### 示例

```bash
feat(tools): add star shape tool
fix(canvas): resolve object selection issue
docs(api): update component documentation
style(sidebar): improve button spacing
refactor(utils): extract common layer utilities
test(tools): add unit tests for rectangle tool
chore(deps): update konva to latest version
```

### 代码规范

#### TypeScript 规范

- 使用严格的 TypeScript 配置
- 为所有公共 API 提供类型定义
- 避免使用 `any` 类型
- 使用接口而不是类型别名定义对象结构

```typescript
// ✅ 好的做法
interface ToolConfig {
  name: string;
  icon: React.ComponentType;
  shortcut?: string;
}

// ❌ 避免的做法
type ToolConfig = {
  name: any;
  icon: any;
  shortcut: any;
}
```

#### React 组件规范

- 使用函数组件和 Hooks
- 为组件 props 定义接口
- 使用 React.memo 优化性能
- 遵循单一职责原则

```typescript
// ✅ 好的组件结构
interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = React.memo(({
  children,
  onClick,
  variant = 'primary',
  disabled = false
}) => {
  return (
    <button
      className={`btn btn-${variant}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
});
```

#### 样式规范

- 使用 CSS Modules 或 styled-components
- 遵循 BEM 命名规范
- 使用 CSS 变量支持主题
- 保持样式的可维护性

```css
/* ✅ 好的样式结构 */
.toolbar {
  display: flex;
  padding: var(--spacing-md);
  background-color: var(--color-background);
}

.toolbar__button {
  margin-right: var(--spacing-sm);
  border: none;
  background: transparent;
}

.toolbar__button--active {
  background-color: var(--color-primary);
  color: var(--color-white);
}
```

## 测试要求

### 单元测试

- 为新功能编写单元测试
- 测试覆盖率应达到 80% 以上
- 使用 Jest 和 React Testing Library

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('should render with correct text', () => {
    render(<Button onClick={jest.fn()}>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### 集成测试

- 测试组件间的交互
- 测试完整的用户流程
- 确保新功能不破坏现有功能

### 手动测试

在提交 PR 前，请确保：

- [ ] 在不同浏览器中测试功能
- [ ] 测试响应式设计
- [ ] 验证无障碍访问性
- [ ] 检查性能影响

## 文档要求

### 代码文档

- 为复杂函数添加 JSDoc 注释
- 为新组件编写使用示例
- 更新相关的 TypeScript 类型定义

```typescript
/**
 * 创建新的标注对象
 * @param type - 标注对象类型
 * @param position - 对象位置
 * @param options - 可选配置
 * @returns 创建的标注对象
 */
export function createAnnotationObject(
  type: ToolType,
  position: { x: number; y: number },
  options?: Partial<AnnotationObject>
): AnnotationObject {
  // 实现逻辑
}
```

### 用户文档

- 为新功能更新用户指南
- 添加使用示例和截图
- 更新 FAQ 部分

## Pull Request 流程

### PR 模板

创建 PR 时，请填写以下信息：

```markdown
## 变更类型
- [ ] Bug 修复
- [ ] 新功能
- [ ] 重构
- [ ] 文档更新
- [ ] 其他

## 变更描述
简要描述您的变更内容

## 测试
- [ ] 添加了单元测试
- [ ] 添加了集成测试
- [ ] 手动测试通过

## 截图（如适用）
添加相关截图

## 检查清单
- [ ] 代码遵循项目规范
- [ ] 所有测试通过
- [ ] 文档已更新
- [ ] 变更日志已更新
```

### 代码审查

PR 将经过以下审查流程：

1. **自动检查** - CI/CD 流水线检查
2. **代码审查** - 维护者进行代码审查
3. **测试验证** - 功能和回归测试
4. **合并** - 审查通过后合并到主分支

### 审查标准

- 代码质量和可读性
- 测试覆盖率和质量
- 性能影响评估
- 安全性检查
- 文档完整性

## 社区准则

### 行为准则

我们致力于为所有人提供友好、安全和欢迎的环境：

- 使用友好和包容的语言
- 尊重不同的观点和经验
- 优雅地接受建设性批评
- 关注对社区最有利的事情
- 对其他社区成员表示同理心

### 沟通渠道

- **GitHub Issues** - 报告 bug 和功能请求
- **GitHub Discussions** - 社区讨论和问答
- **Pull Requests** - 代码审查和讨论

## 开发环境

### 必需工具

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- Git >= 2.20.0
- VS Code（推荐）

### 推荐扩展

VS Code 扩展：

- TypeScript and JavaScript Language Features
- ES7+ React/Redux/React-Native snippets
- Prettier - Code formatter
- ESLint
- Auto Rename Tag
- Bracket Pair Colorizer

### 环境配置

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 运行测试
pnpm test

# 代码检查
pnpm lint

# 类型检查
pnpm type-check
```

## 发布流程

### 版本管理

项目使用 [Semantic Versioning](https://semver.org/)：

- `MAJOR` - 不兼容的 API 变更
- `MINOR` - 向后兼容的功能新增
- `PATCH` - 向后兼容的问题修正

### 发布步骤

1. 更新版本号
2. 更新变更日志
3. 创建 Release Tag
4. 构建和发布

## 常见问题

### 如何开始贡献？

1. 查看 [Good First Issues](https://github.com/your-repo/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22)
2. 阅读相关文档
3. 在 Issue 中表达参与意愿
4. Fork 仓库开始开发

### 如何报告安全问题？

请不要在公开 Issue 中报告安全问题，而是发送邮件到：security@example.com

### 如何获得帮助？

- 查看现有文档
- 搜索已有 Issues
- 在 GitHub Discussions 中提问
- 联系维护者

## 致谢

感谢所有为项目做出贡献的开发者！您的贡献让这个项目变得更好。

### 贡献者列表

项目的成功离不开以下贡献者的努力：

- [@contributor1](https://github.com/contributor1) - 核心开发者
- [@contributor2](https://github.com/contributor2) - 文档维护
- [@contributor3](https://github.com/contributor3) - 测试和质量保证

### 特别感谢

- React 和 Konva 社区
- Ant Design 团队
- 所有提供反馈和建议的用户

---

再次感谢您的贡献！让我们一起构建更好的图片标注系统。