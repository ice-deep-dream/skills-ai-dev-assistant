---
name: ai-dev-assistant
version: 1.0.0
description: AI 开发助手 - 辅助 AI 进行开发文档编写（计划、开发、BUG、总结）
author: AI Assistant
license: MIT
keywords:
  - ai
  - dev
  - assistant
  - documentation
  - planning
  - bug-tracking
commands:
  - name: auto-init
    description: 智能初始化 - 自动完成 docs 初始化、项目分析、模块文档生成、配置更新（推荐）
  - name: create-bug-doc
    description: 创建 Bug 跟踪文档
  - name: create-summary-doc
    description: 创建总结复盘文档
  - name: update-vitepress-config
    description: 自动更新 VitePress 侧边栏配置（新增文档时调用）
  - name: update-index-files
    description: 更新 index.md 进度表格
permissions:
  - file:read
  - file:write
  - file:copy
  - shell:exec
usage_notes: |
  ⚠️ 重要：每次对话前必须调用此 skill！
  1. 首次使用调用 auto-init 命令完成智能初始化
  2. 按照模板创建/更新开发文档
  3. 执行 update-vitepress-config 更新侧边栏
  4. 执行 update-index-files 更新进度表格
---

# AI 开发助手技能包

> **辅助 AI 进行开发文档编写（计划、开发、BUG、总结）**

## 🎯 核心功能

### 1. 智能初始化 (`auto-init`) ⭐ 推荐

一键完成所有初始化工作，自动执行以下步骤：
- ✅ 初始化 docs 目录（复制模板）
- ✅ 分析项目类型和技术栈
- ✅ 生成 AGENTS.md 配置文件
- ✅ 自动扫描项目模块结构
- ✅ 根据项目框架自动生成前后端开发文档
- ✅ 更新 VitePress 侧边栏配置
- ✅ 更新进度表格

**使用场景**:
- 新项目启动时
- 需要快速建立文档体系时
- 首次调用此 skill 时

### 2. 自动更新 VitePress 配置

**命令**: `update-vitepress-config`

自动扫描 docs 目录，更新 VitePress 站点的侧边栏配置。

**功能特点**:
- 🔍 自动扫描所有 Markdown 文件
- 📖 读取 Frontmatter 中的 title 字段
- ⚙️ 更新 `.vitepress/config.ts` 中的 sidebar 配置
- 🔄 保持侧边栏与文档同步

### 3. 自动更新进度表格

**命令**: `update-index-files`

自动扫描开发文档，更新 index.md 中的进度表格。

**功能特点**:
- 📊 自动读取前端/后端开发文档
- 📝 解析 Frontmatter 中的状态、进度、负责人等信息
- 📈 更新进度表格
- 🎯 实时掌握项目整体进度

## 📚 docs 文档体系

### 目录结构

```
docs/
├── .vitepress/              # VitePress 配置（支持站点生成）
├── 01-文档规范/             # 【必读】文档编写规范
├── 02-模板中心/             # 【必读】各类文档模板
├── 03-前端开发与计划/       # 前端开发文档
├── 04-后端开发与计划/       # 后端开发文档
├── 05-总结复盘/             # 项目总结、架构图
├── 06-Bug 管理/             # Bug 跟踪文档
├── 07-测试管理/             # 测试文档
├── 08-部署运维/             # 部署运维文档
├── 09-变更记录/             # 版本变更历史
└── index.md                 # 文档首页
```

## 🚀 使用流程

### 新项目启动

1. 调用 `auto-init` 命令一键完成智能初始化
2. 阅读 docs/01-文档规范/了解文档编写规范
3. 阅读 docs/02-模板中心/了解各类文档模板
4. 开始编写开发文档

### 日常开发

1. 每次对话前调用本 skill 确保文档与开发同步
2. 按照模板创建/更新开发文档
3. 完成后更新进度到 index.md 总进度表

## 📝 文档编写规则

### Frontmatter 规范

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

### 文档命名规范

| 类型 | 格式 | 示例 |
|------|------|------|
| 开发文档 | `三位数字 - 模块名称开发.md` | `001-用户管理模块开发.md` |
| Bug 文档 | `BUG-三位数字-Bug 标题.md` | `BUG-001-登录页面验证码不显示.md` |
| 总结文档 | `总结-YYYYMMDD-主题.md` | `总结 -20240115-V1.0 版本复盘.md` |
| 测试文档 | `TEST-三位数字 - 测试名称.md` | `TEST-001-用户管理模块测试.md` |

## ⚠️ 重要提醒

1. **每次对话必须调用本 skill** - 确保文档与开发同步
2. **所有开发文档必须写入 docs 目录** - 统一管理
3. **必须按照模板格式编写文档** - 保持规范性
4. **文档必须记录真实状态** - 不写空泛描述
5. **文档内容必须与代码保持一致** - 及时更新

## 📞 技术支持

详细文档请参考项目内的：
- [README.md](./README.md) - 完整功能说明
- [GETTING_STARTED.md](./GETTING_STARTED.md) - 快速开始
- [EXAMPLES.md](./EXAMPLES.md) - 使用示例

---

**让文档成为开发的助力，而不是负担！** 🚀
