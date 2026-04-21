# AI 开发助手 - 项目配置文件

> ⚠️ **重要提醒**: 每次对话前必须调用 `ai-dev-assistant` skill，确保文档与开发同步！

## 🤖 AI 助手必读

**在开始任何开发任务前，必须执行以下步骤：**

1. **调用 `ai-dev-assistant` skill** - 这是强制要求，不是可选项
2. **检查 docs 文档** - 确保文档已初始化并查看相关规范
3. **按照模板编写文档** - 使用 docs/02-模板中心/ 中的模板
4. **更新 VitePress 配置** - 新增文档后调用 `update-vitepress-config` 命令

**每次对话的标准流程：**

```
1. 调用 ai-dev-assistant skill
2. 说明当前任务（开发新功能/修复 Bug/写测试等）
3. 创建或更新对应的文档
4. 执行 update-vitepress-config 更新侧边栏
5. 执行 update-index-files 更新进度表格
```

---

## 项目类型

{项目类型描述}

## 技术栈

- **框架**: {框架名称}
- **构建工具**: {构建工具}
- **包管理工具**: {包管理工具}
- **语言**: {编程语言}
- **UI 框架**: {UI 框架}

## 目录结构特点

{目录结构描述}

## 命名规范

- **文件命名**: {文件命名规范}
- **组件命名**: {组件命名规范}
- **模块组织**: {模块组织方式}

## 开发模式

{开发模式描述}

---

## 📚 文档使用指南

### 每次对话前

1. ✅ **必须调用 `ai-dev-assistant` skill**
2. ✅ 确保 docs 文档已初始化
3. ✅ 按照文档模板编写开发文档

### docs 文档目录结构

```
docs/
├── .vitepress/          # VitePress 配置（自动生成站点）
│   └── config.ts        # 站点配置文件
├── index.md             # 文档首页
├── 01-文档规范/         # 【必读】文档编写规范
├── 02-模板中心/         # 【必读】各类文档模板
├── 03-前端开发与计划/   # 前端开发文档
├── 04-后端开发与计划/   # 后端开发文档
├── 05-总结复盘/         # 项目总结、架构图
├── 06-Bug 管理/          # Bug 跟踪文档
├── 07-测试管理/         # 测试文档
├── 08-部署运维/         # 部署运维文档
└── 09-变更记录/         # 版本变更历史
```

### 各目录用途

| 目录 | 用途 | 参考模板 | 命名格式 |
|------|------|----------|----------|
| **01-文档规范** | 文档编写规范 | - | - |
| **02-模板中心** | 文档模板 | - | - |
| **03-前端开发与计划** | 前端开发文档 | `001-前端模块开发模板.md` | `001-模块名称开发.md` |
| **04-后端开发与计划** | 后端开发文档 | `002-后端模块开发模板.md` | `001-模块名称开发.md` |
| **05-总结复盘** | 项目总结、图集 | `004-总结模板.md` | `总结-YYYYMMDD-主题.md` |
| **06-Bug 管理** | Bug 跟踪 | `003-Bug 模板.md` | `BUG-001-Bug 标题.md` |
| **07-测试管理** | 测试文档 | `005-测试模板.md` | `TEST-001-测试名称.md` |
| **08-部署运维** | 部署运维 | - | - |
| **09-变更记录** | 版本历史 | - | - |

---

## 📝 文档编写规则

### Frontmatter 必填字段

所有文档必须包含以下 Frontmatter：

```yaml
---
title: 文档标题
description: 文档描述
category: 分类
tags:
  - 标签 1
  - 标签 2
outline: deep
---
```

### 建议字段（根据文档类型）

#### 开发文档
```yaml
module: 模块名称
status: planning | developing | completed | on-hold
progress: 0-100
priority: low | medium | high | critical
owner: 负责人
created: YYYY-MM-DD
updated: YYYY-MM-DD
```

#### Bug 文档
```yaml
status: new | investigating | fixed | verified | closed
priority: low | medium | high | critical
bugId: BUG-001
```

#### 测试文档
```yaml
testType: manual | automated | performance | security
status: planning | in-progress | completed
```

### 文档命名规范

- **开发文档**: `001-模块名称开发.md`
- **Bug 文档**: `BUG-001-Bug 标题.md`
- **总结文档**: `总结-YYYYMMDD-主题.md`
- **测试文档**: `TEST-001-测试名称.md`

### 文档内容要求

✅ **应该做的**:
- 一个模块一个文档，不要过度拆分
- 平铺管理，不拆子目录
- 按开发顺序创建文档
- 记录真实开发状态
- 文档内容与代码保持一致
- 及时更新文档
- 图类内容优先放到总结复盘

❌ **不应该做的**:
- 写空泛的描述
- 文档与代码不一致
- 过度拆分文档
- 记录敏感信息（密码、密钥等）

---

## 🚀 快速开始

### 1. 初始化 docs 目录

```bash
# 调用 ai-dev-assistant skill
# 执行 init-docs 命令
```

### 2. 生成 AGENTS.md

```bash
# 调用 ai-dev-assistant skill
# 执行 analyze-project 命令
```

### 3. 开始开发

1. 阅读 `docs/01-文档规范/` 了解规范
2. 阅读 `docs/02-模板中心/` 了解模板
3. 创建第一个开发文档（参考对应模板）
4. 开始编码，同时更新文档状态

### 4. 本地预览文档

```bash
cd docs
npm install
npm run docs:dev
```

访问 http://localhost:5173 预览

### 5. 新增文档后自动更新

```bash
# 调用 ai-dev-assistant skill
# 执行 update-vitepress-config 命令
# 自动更新侧边栏配置

# 执行 update-index-files 命令
# 自动更新进度表格
```

---

## 🔄 自动化命令

### 新增文档后

每次创建新文档后，**必须**执行以下命令：

```bash
# 1. 更新 VitePress 侧边栏配置
ai-dev-assistant update-vitepress-config

# 2. 更新 index.md 进度表格
ai-dev-assistant update-index-files
```

**作用**：
- `update-vitepress-config`: 自动扫描 docs 目录，更新侧边栏导航
- `update-index-files`: 自动读取所有开发文档的 Frontmatter，更新进度表格

---

## 📊 开发进度跟踪

### 前端开发进度

| 模块 | 状态 | 进度 | 负责人 | 开始时间 | 完成时间 |
|------|------|------|--------|----------|----------|
| {模块 1} | {status} | {progress}% | {owner} | {created} | {completed} |

### 后端开发进度

| 模块 | 状态 | 进度 | 负责人 | 开始时间 | 完成时间 |
|------|------|------|--------|----------|----------|
| {模块 1} | {status} | {progress}% | {owner} | {created} | {completed} |

---

## ⚠️ 重要提醒

### 强制要求（必须遵守）

1. **每次对话必须调用 `ai-dev-assistant` skill** - 这是强制要求，不是可选项
2. **所有开发文档必须写入 docs 目录** - 统一管理，便于协作
3. **必须按照模板格式编写文档** - 保持文档规范性
4. **文档必须记录真实状态** - 不写空泛描述
5. **文档内容必须与代码保持一致** - 及时更新文档
6. **新增文档后必须更新配置** - 执行 `update-vitepress-config` 和 `update-index-files`

### 标准工作流程

```
开始任务 → 调用 skill → 编写文档 → 更新配置 → 完成
```

**不遵守的后果**：
- ❌ 文档与开发不同步
- ❌ VitePress 站点侧边栏不更新
- ❌ 进度表格不准确
- ❌ 团队协作困难

---

*最后更新：{更新日期}*

*记住：好的文档是成功项目的一半！每次对话都要调用 `ai-dev-assistant` skill！*
