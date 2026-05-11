---
name: ai-dev-assistant
description: AI 开发助手 - 辅助 AI 进行开发文档编写（项目初始化、模块开发流程、Bug/测试/总结文档）
---

# AI 开发助手 Skill

> **辅助 AI 进行开发文档编写**

## 核心理念

1. **模板服务于项目** - 项目优先于模板
2. **自动填充通用工具** - 初始化时扫描项目代码，自动填充模板
3. **简化结构** - 合并目录，减少文件数量
4. **按需记录** - 默认不编辑文档，用户要求才写入

## 可用命令

| 命令 | 说明 | 参数 |
|------|------|------|
| `project-init` | 项目初始化 | 无 |
| `module-start` | 模块启动 | `moduleName`, `moduleType`, `description`, `requirements`, `plan`, `owner` |
| `module-complete` | 模块完成 | `moduleName` |
| `module-update` | 模块更新 | `moduleName`, `status`, `progress`, `note` |
| `create-bug-doc` | 创建 Bug 文档 | `title`, `description`, `priority`, `steps`, `expected`, `actual` |
| `create-summary-doc` | 创建总结文档 | `title`, `type`, `content` |
| `create-test-doc` | 创建测试文档 | `title`, `testType`, `moduleName`, `testCases` |

## 触发规则

| 命令 | 触发场景 | 说明 |
|------|----------|------|
| `project-init` | 新对话/新项目 | 自动执行项目初始化 |
| `module-start` | 用户提出新模块需求 | 自动创建开发文档 |
| `module-complete` | 用户确认模块完成 | 更新状态和进度 |
| `module-update` | 开发过程中 | 按需更新文档内容 |
| `create-bug-doc` | 用户明确要求 | 创建 Bug 文档 |
| `create-summary-doc` | 用户明确要求 | 创建总结文档 |
| `create-test-doc` | 用户明确要求 | 创建测试文档 |

## 使用示例

### 项目初始化

```
用户：这是一个新项目，帮我初始化文档

AI：执行 project-init 命令
```

### 模块启动

```
用户：我要开发用户管理模块

AI：理解需求 → 输出计划 → 用户确认 → 执行 module-start
```

### 模块完成

```
用户：用户管理模块完成了

AI：执行 module-complete
```

### 创建 Bug 文档

```
用户：创建一个 Bug 文档，登录页面报错

AI：执行 create-bug-doc --title "登录页面报错"
```

## 目录结构

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

## 文档规范

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
| Bug 文档 | `BUG-时间戳-标题.md` | `BUG-1699999999-登录失败.md` |
| 测试文档 | `TEST-时间戳-名称.md` | `TEST-1699999999-用户测试.md` |
| 总结文档 | `总结-时间戳-主题.md` | `总结-1699999999-复盘.md` |

## 本地预览

```bash
cd docs
npm install
npm run docs:dev    # 开发预览
npm run docs:build  # 构建生产版本
```

## 注意事项

1. 所有开发文档必须写入 docs 目录
2. 必须按照模板格式编写文档
3. 新增文档后自动更新 VitePress 配置和进度表格
4. 模板设计强调"项目优先于模板" - 必须修改模板适配项目，而非反之

---

**让文档成为开发的助力，自动记录，按需补充！**
