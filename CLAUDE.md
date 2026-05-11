# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个 **AI 开发助手 Skills** 项目，用于辅助 AI 进行开发文档编写（计划、开发、BUG、总结）。当前实现为 Trae IDE 的 skill 格式，需要评估与 Claude Code 的兼容性。

## 技术栈

- **运行时**: Node.js
- **文档站点**: VitePress
- **语言**: JavaScript (无 TypeScript)
- **包管理**: npm

## 目录结构

```
skills-ai-dev-assistant/
├── src/index.js           # 核心实现逻辑
├── skill.json             # Skill 定义文件 (Trae 格式)
├── SKILL.md               # Skill 说明文档 (Trae 格式)
├── AGENTS.template.md     # 项目配置模板
├── docs/                  # 文档模板目录
│   ├── .vitepress/        # VitePress 配置
│   ├── 01-文档规范/       # 文档编写规范
│   ├── 02-模板中心/       # 各类文档模板
│   ├── 03-前端开发与计划/ # 前端开发文档
│   ├── 04-后端开发与计划/ # 后端开发文档
│   ├── 05-总结复盘/       # 项目总结
│   ├── 06-Bug管理/        # Bug 跟踪
│   ├── 07-测试管理/       # 测试文档
│   ├── 08-部署运维/       # 部署运维
│   └── 09-变更记录/       # 版本历史
└── README.md              # 完整使用说明
```

## 核心命令

| 命令 | 功能 |
|------|------|
| `auto-init` | 智能初始化 - 一键完成 docs 初始化、项目分析、模块文档生成 |
| `create-bug-doc` | 创建 Bug 跟踪文档 |
| `create-summary-doc` | 创建总结复盘文档 |
| `update-vitepress-config` | 更新 VitePress 侧边栏配置 |
| `update-index-files` | 更新进度表格 |

## 关键实现

### src/index.js 主要函数

- `autoInit(projectRoot)` - 智能初始化入口
- `initDocs(projectRoot)` - 复制 docs 模板目录
- `analyzeProject(projectRoot)` - 分析项目类型和技术栈
- `detectProjectModules(projectRoot, analysis)` - 检测项目模块
- `createModuleDoc(docsPath, options)` - 创建模块开发文档
- `updateVitePressConfig(docsPath)` - 更新 VitePress 配置
- `updateIndexFiles(docsPath)` - 更新进度表格

## 文档规范

### Frontmatter 必填字段

```yaml
---
title: 文档标题
description: 文档描述
category: 分类
tags:
  - 标签
outline: deep
---
```

### 文档命名规范

- **开发文档**: `001-模块名称开发.md`
- **Bug 文档**: `BUG-001-Bug标题.md`
- **总结文档**: `总结-YYYYMMDD-主题.md`
- **测试文档**: `TEST-001-测试名称.md`

## VitePress 文档站点

```bash
cd docs
npm install
npm run docs:dev    # 开发预览
npm run docs:build  # 构建生产版本
```

## 注意事项

1. 所有开发文档必须写入 docs 目录
2. 必须按照模板格式编写文档
3. 新增文档后需执行 `update-vitepress-config` 和 `update-index-files`
4. 模板设计强调"项目优先于模板" - 必须修改模板适配项目，而非反之
