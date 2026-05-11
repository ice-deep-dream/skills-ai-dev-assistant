---
name: ai-dev-assistant
version: 2.0.0
description: AI 开发助手 - 辅助 AI 进行开发文档编写（自动填充通用工具、简化结构、自动记录）
author: AI Assistant
license: MIT
keywords:
  - ai
  - dev
  - assistant
  - documentation
  - auto-init
commands:
  - name: auto-init
    description: 智能初始化 - 创建目录结构、扫描项目代码、自动填充模板通用工具信息
  - name: update-vitepress-config
    description: 自动更新 VitePress 侧边栏配置
  - name: update-index-files
    description: 更新进度表格
permissions:
  - file:read
  - file:write
  - file:copy
  - shell:exec
usage_notes: |
  ## 核心理念
  
  1. **模板服务于项目** - 项目优先于模板
  2. **自动填充通用工具** - 初始化时扫描项目代码，自动填充模板
  3. **简化结构** - 合并目录，减少文件数量
  4. **自动记录** - 模块开始/结束自动记录，过程询问用户
  
  ## 执行时机
  
  - **模块开始**：自动执行 auto-init
  - **模块结束**：自动记录到项目跟踪
  - **开发过程**：询问用户是否写入项目跟踪
---

# AI 开发助手技能包

> **辅助 AI 进行开发文档编写**

## 🎯 核心功能

### 1. 智能初始化 (`auto-init`) ⭐

一键完成初始化工作：

```
1. 创建 docs 目录结构
   ├── 01-模板中心/
   ├── 02-开发计划/
   └── 03-项目跟踪/
       ↓
2. 分析项目技术栈
   - 检测框架（Vue/React/NestJS/Express等）
   - 检测目录结构
   - 检测命名规范
       ↓
3. 扫描项目通用工具
   - API 请求封装
   - 状态管理方案
   - 通用组件列表
   - 工具函数列表
       ↓
4. 填充模板第二节（项目通用工具）
   - 前端：API封装、Store示例、组件列表
   - 后端：API返回封装、分页工具、中间件
       ↓
5. 完成
```

## 📚 目录结构

```
docs/
├── .vitepress/          # VitePress 配置
├── 01-模板中心/         # 开发模板 + 通用工具信息
│   ├── index.md
│   ├── 前端开发模板.md   # 含自动填充的通用工具
│   └── 后端开发模板.md   # 含自动填充的通用工具
├── 02-开发计划/         # 前后端开发文档（合并）
│   └── index.md
├── 03-项目跟踪/         # Bug/测试/总结/进度（合并）
│   └── index.md
└── index.md
```

## 📝 文档规范

### Frontmatter 规范

```yaml
---
title: 文档标题
description: 文档描述
category: 分类
tags:
  - 标签
status: developing  # planning | developing | completed | on-hold
progress: 0-100
owner: 负责人
created: YYYY-MM-DD
updated: YYYY-MM-DD
---
```

### 命名规范

| 类型 | 格式 | 示例 |
|------|------|------|
| 开发文档 | `001-模块名称开发.md` | `001-用户管理开发.md` |
| Bug 文档 | `BUG-001-Bug标题.md` | `BUG-001-登录失败.md` |
| 测试文档 | `TEST-001-测试名称.md` | `TEST-001-用户模块测试.md` |
| 总结文档 | `总结-YYYYMMDD-主题.md` | `总结-20240115-复盘.md` |

## 🚀 使用流程

### 初始化流程（模块开始/结束）

```
调用 auto-init → 创建目录 → 扫描项目 → 填充模板 → 开始开发
```

### 日常开发流程

```
1. 复制模板创建开发文档
2. 参考模板中的通用工具信息开发
3. 【询问用户】是否写入项目跟踪
4. 完成
```

## ⚠️ 重要提醒

1. **模块开始/结束时自动执行 auto-init**
2. **开发过程中询问用户是否记录**
3. **使用模板中的通用工具信息保持一致性**
4. **文档内容与代码保持同步**

---

**让文档成为开发的助力，而不是负担！**