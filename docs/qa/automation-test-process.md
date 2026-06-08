# 自动化测试流程

## 1. 目标

为 EnerCloud H5 项目建立最小可执行的自动化测试流程，保证每次代码变更至少经过以下质量门：

1. 依赖安装成功
2. ESLint 静态检查通过
3. TypeScript 类型检查通过
4. 生产构建成功

## 2. 当前自动化范围

当前仓库未集成 Vitest、Jest、Playwright 或 Cypress，因此自动化测试流程分为两个阶段：

- 第一阶段：静态质量门
  - `npm run lint`
  - `npm run typecheck`
  - `npm run build`
- 第二阶段：后续补充
  - 组件单元测试
  - 移动端 E2E 回归测试
  - 可视化回归测试

## 3. 本地执行方式

```bash
npm run test:ci
```

该命令串行执行：

1. `npm run lint`
2. `npm run build`

补充校验命令：

```bash
npm run typecheck
```

## 4. CI 执行方式

仓库新增 GitHub Actions 工作流：

- 文件：`.github/workflows/ci.yml`
- 触发条件：
  - `push` 到 `main`、`develop`、`feature/**`、`fix/**`
  - 任意 `pull_request`

执行步骤：

1. Checkout 代码
2. 安装 Node.js 20
3. `npm ci`
4. `npm run lint`
5. `npm run typecheck`
6. `npm run build`

## 5. 通过标准

以下条件必须同时满足：

1. 命令退出码为 0
2. 无 ESLint 错误
3. 无 TypeScript 编译错误
4. `dist/` 构建成功

## 6. 失败处理规则

1. `lint` 失败：优先修复代码规范和潜在逻辑问题。
2. `typecheck` 失败：修复类型定义、props、状态和依赖问题。
3. `build` 失败：修复 Vite 构建、资源引用或语法错误。
4. 所有失败项必须在测试报告中记录复现命令、症状和结论。

## 7. 下一步建议

1. 增加 `vitest` + `@testing-library/react` 组件测试。
2. 增加 `playwright` 移动端冒烟流程。
3. 对登录、概览页、状态页和 Cell Matrix 建立关键路径回归集。
