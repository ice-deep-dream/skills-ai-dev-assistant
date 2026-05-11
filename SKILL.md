---
name: ai-dev-assistant
version: 2.2.0
description: AI 开发助手 - 辅助 AI 进行开发文档编写（项目初始化、模块开发流程、Bug/测试/总结文档）
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
  - name: project-init
    description: 项目初始化 - 新项目启动时自动执行
  - name: module-start
    description: 模块启动 - 创建新模块开发计划
  - name: module-complete
    description: 模块完成 - 更新模块状态
  - name: module-update
    description: 模块更新 - 开发过程中更新文档
  - name: create-bug-doc
    description: 创建 Bug 跟踪文档
  - name: create-summary-doc
    description: 创建总结复盘文档
  - name: create-test-doc
    description: 创建测试文档
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
  4. **按需记录** - 默认不编辑文档，用户要求才写入
  
  ## 触发规则
  
  | 命令 | 触发场景 | 说明 |
  |------|----------|------|
  | project-init | 新对话/新项目 | 自动执行项目初始化 |
  | module-start | 用户提出新模块需求 | 自动创建开发文档 |
  | module-complete | 用户确认模块完成 | 更新状态和进度 |
  | module-update | 开发过程中 | 按需更新文档内容 |
  | create-bug-doc | 用户明确要求 | 创建 Bug 文档 |
  | create-summary-doc | 用户明确要求 | 创建总结文档 |
  | create-test-doc | 用户明确要求 | 创建测试文档 |
---

# AI 开发助手技能包

> **辅助 AI 进行开发文档编写**

## 🎯 核心功能

### 功能一：项目初始化 (`project-init`)

**触发场景**：新对话/新项目时自动执行

```
新对话开始
    ↓
自动检测项目状态
    ↓
执行 project-init
    ├── 创建 docs 目录结构
    ├── 分析项目技术栈
    ├── 扫描项目通用工具
    ├── 填充模板第二节（项目通用工具）
    └── 更新 VitePress 配置
    ↓
完成初始化
```

### 功能二：模块开发流程

#### <1> 模块启动 (`module-start`)

**触发场景**：用户提出新模块开发需求时自动触发

```
用户提出需求
    ↓
理解需求 → 输出大致计划
    ↓
用户确认计划
    ↓
执行 module-start
    ├── 复制模板到开发计划目录
    ├── 填充需求内容
    ├── 更新 VitePress 配置
    └── 更新进度表格
    ↓
开始开发
```

#### <2> 模块完成 (`module-complete`)

**触发场景**：用户确认模块完成时触发

```
用户确认模块完成
    ↓
执行 module-complete
    ├── 更新文档状态为 completed
    ├── 更新进度为 100%
    ├── 更新完成时间
    ├── 更新 VitePress 配置
    └── 更新进度表格
    ↓
完成记录
```

#### <3> 开发过程 (`module-update`)

**触发场景**：开发过程中按需触发

```
开发代码过程中
    ↓
复制模板（参考通用工具）
    ↓
开发代码
    ↓
执行 module-update（按需）
    ├── 更新文档内容
    ├── 更新进度状态
    └── 更新进度表格
    ↓
继续开发
```

### 功能三：按需文档

**触发场景**：用户明确要求时触发

| 命令 | 说明 | 文档位置 |
|------|------|----------|
| `create-bug-doc` | 创建 Bug 跟踪文档 | `docs/03-项目跟踪/` |
| `create-summary-doc` | 创建总结复盘文档 | `docs/03-项目跟踪/` |
| `create-test-doc` | 创建测试文档 | `docs/03-项目跟踪/` |

## 📚 目录结构

```
docs/
├── .vitepress/          # VitePress 配置
├── 01-模板中心/         # 开发模板 + 通用工具信息
│   ├── index.md
│   ├── 前端开发模板.md   # 含自动填充的通用工具
│   └── 后端开发模板.md   # 含自动填充的通用工具
├── 02-开发计划/         # 前后端开发文档（统一管理）
│   └── index.md         # 进度表格
├── 03-项目跟踪/         # Bug/测试/总结（按需写入）
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
tags: [标签]
status: developing
progress: 0-100
owner: 负责人
created: YYYY-MM-DD
updated: YYYY-MM-DD
---
```

### 命名规范

| 类型 | 格式 | 示例 |
|------|------|------|
| 开发文档 | `001-模块开发.md` | `001-用户管理开发.md` |
| Bug 文档 | `BUG-001-标题.md` | `BUG-001-登录失败.md` |
| 测试文档 | `TEST-001-名称.md` | `TEST-001-用户测试.md` |
| 总结文档 | `总结-YYYYMMDD-主题.md` | `总结-20240115-复盘.md` |

## 🚀 使用场景

### 场景一：新项目启动

```
新对话开始 → 自动执行 project-init → 开始开发
```

### 场景二：开发新模块

```
用户提出需求 → 自动执行 module-start → 开始编码
```

### 场景三：模块完成

```
用户确认完成 → 执行 module-complete → 记录完成状态
```

### 场景四：开发过程中

```
开发代码 → 按需执行 module-update → 继续开发
```

### 场景五：记录 Bug/总结/测试

```
用户明确要求 → 执行对应命令 → 创建文档
```

## ⚠️ 默认行为

| 情况 | 默认行为 | 触发条件 |
|------|---------|---------|
| 项目初始化 | 自动执行 | 新对话/新项目 |
| 模块启动 | 自动执行 | 用户提出新模块需求 |
| 模块完成 | 手动触发 | 用户确认完成 |
| 开发过程更新 | 按需触发 | 开发过程中 |
| Bug/总结/测试文档 | 不创建 | 用户明确要求才创建 |

---

**让文档成为开发的助力，自动记录，按需补充！**