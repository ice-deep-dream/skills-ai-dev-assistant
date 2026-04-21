# AI 开发助手技能包

> **辅助 AI 进行开发文档编写（计划、开发、BUG、总结）**

## 📦 技能包结构

```
ai-dev-assistant/
├── skill.json              # 技能配置文件
├── package.json            # Node.js 包配置
├── src/
│   ├── index.js            # 核心逻辑实现
│   └── docs/               # 文档模板源目录（将被复制到项目根目录）
├── AGENTS.template.md      # AGENTS.md 模板
├── README.md               # 完整使用说明
├── GETTING_STARTED.md      # 快速开始指南
└── EXAMPLES.md             # 使用示例
```

## 🎯 核心功能

### 1. docs 目录初始化 (`init-docs`)

将标准化的 docs 模板目录复制到项目根目录，包含：
- ✅ 文档规范
- ✅ 模板中心
- ✅ 前端/后端开发目录
- ✅ Bug 管理目录
- ✅ 测试管理目录
- ✅ 总结复盘目录
- ✅ 部署运维目录
- ✅ 变更记录目录

### 2. 项目分析 (`analyze-project`)

自动分析项目特征，生成 `AGENTS.md` 配置文件：
- 🔍 **项目类型识别**: 前端/后端/全栈/Monorepo
- 🔍 **技术栈检测**: 框架、构建工具、包管理、UI 框架
- 🔍 **目录结构分析**: 扫描并识别模块组织方式
- 🔍 **命名规范分析**: 文件命名、组件命名、代码风格

### 3. 文档模板调用

根据不同类型的开发活动，自动调用对应模板：
- 📝 **前端开发**: 参考 `001-前端模块开发模板.md`
- 📝 **后端开发**: 参考 `002-后端模块开发模板.md`
- 📝 **Bug 跟踪**: 参考 `003-Bug 模板.md`
- 📝 **总结复盘**: 参考 `004-总结模板.md`
- 📝 **测试管理**: 参考 `005-测试模板.md`

### 4. 自动更新 VitePress 配置 ⭐ 新增

**命令**: `update-vitepress-config`

自动扫描 docs 目录，更新 VitePress 站点的侧边栏配置。

**功能特点**:
- 🔍 自动扫描所有 Markdown 文件
- 📖 读取 Frontmatter 中的 title 字段
- ⚙️ 更新 `.vitepress/config.ts` 中的 sidebar 配置
- 🔄 保持侧边栏与文档同步

**使用场景**:
- 新增开发文档后
- 删除文档后
- 需要更新导航结构时

### 5. 自动更新进度表格 ⭐ 新增

**命令**: `update-index-files`

自动扫描开发文档，更新 index.md 中的进度表格。

**功能特点**:
- 📊 自动读取前端/后端开发文档
- 📝 解析 Frontmatter 中的状态、进度、负责人等信息
- 📈 更新进度表格
- 🎯 实时掌握项目整体进度

**使用场景**:
- 创建新模块文档后
- 更新文档状态后
- 需要查看整体进度时

## 📚 docs 文档体系

### 目录结构

```
docs/
├── .vitepress/              # VitePress 配置（支持站点生成）
├── 01-文档规范/             # 【必读】文档编写规范
│   ├── 001-文档说明.md
│   ├── 002-命名规范.md
│   ├── 003-Frontmatter 规范.md
│   └── index.md
├── 02-模板中心/             # 【必读】各类文档模板
│   ├── 001-前端模块开发模板.md
│   ├── 002-后端模块开发模板.md
│   ├── 003-Bug 模板.md
│   ├── 004-总结模板.md
│   ├── 005-测试模板.md
│   └── index.md
├── 03-前端开发与计划/       # 前端开发文档
│   └── index.md             # 前端开发总进度
├── 04-后端开发与计划/       # 后端开发文档
│   └── index.md             # 后端开发总进度
├── 05-总结复盘/             # 项目总结、架构图
│   └── index.md
├── 06-Bug 管理/             # Bug 跟踪文档
│   └── index.md
├── 07-测试管理/             # 测试文档
│   └── index.md
├── 08-部署运维/             # 部署运维文档
│   └── index.md
├── 09-变更记录/             # 版本变更历史
│   └── index.md
└── index.md                 # 文档首页
```

### 各目录用途详解

#### 01-文档规范
**用途**: 定义文档编写的所有规范和标准
- 📖 文档说明：文档中心使用指南
- 📖 命名规范：文件、目录命名规则
- 📖 Frontmatter 规范：元数据字段标准

#### 02-模板中心
**用途**: 提供各类文档的标准模板
- 📋 前端模块开发模板
- 📋 后端模块开发模板
- 📋 Bug 跟踪模板
- 📋 总结复盘模板
- 📋 测试管理模板

#### 03-前端开发与计划
**用途**: 记录前端开发的所有模块和进度
- 📊 一个模块一个文档
- 📊 平铺管理，不拆子目录
- 📊 按开发顺序创建
- 📊 index.md 记录总进度

**命名**: `001-模块名称开发.md`

#### 04-后端开发与计划
**用途**: 记录后端开发的所有模块和进度
- 🔌 一个模块一个文档
- 🔌 平铺管理，不拆子目录
- 🔌 按开发顺序创建
- 🔌 index.md 记录总进度

**命名**: `001-模块名称开发.md`

#### 05-总结复盘
**用途**: 阶段总结、版本复盘、项目图集
- 📈 架构图、功能图、流程图统一写入
- 📈 阶段总结、版本复盘

**命名**: `总结-YYYYMMDD-主题.md`

#### 06-Bug 管理
**用途**: 跟踪和管理所有 Bug
- 🐛 平铺管理，不拆子目录
- 🐛 记录问题、复现步骤、修复方案

**命名**: `BUG-001-Bug 标题.md`

#### 07-测试管理
**用途**: 管理所有测试相关文档
- ✅ 测试用例、测试结果
- ✅ 平铺管理，不拆子目录

**命名**: `TEST-001-测试名称.md`

#### 08-部署运维
**用途**: 记录部署流程和运维脚本
- 🚀 部署流程、环境配置
- 🚀 运维脚本、监控方案

#### 09-变更记录
**用途**: 记录所有版本变更历史
- 📝 版本变更、功能增减
- 📝 重大重构、Breaking Changes

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

### 建议字段

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

| 类型 | 格式 | 示例 |
|------|------|------|
| 开发文档 | `三位数字 - 模块名称开发.md` | `001-用户管理模块开发.md` |
| Bug 文档 | `BUG-三位数字-Bug 标题.md` | `BUG-001-登录页面验证码不显示.md` |
| 总结文档 | `总结-YYYYMMDD-主题.md` | `总结 -20240115-V1.0 版本复盘.md` |
| 测试文档 | `TEST-三位数字 - 测试名称.md` | `TEST-001-用户管理模块测试.md` |

### 内容要求

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

## 🚀 使用流程

### 新项目启动

```
1. 调用 ai-dev-assistant skill
   └─> 执行 init-docs 命令
       └─> 初始化 docs 目录

2. 调用 ai-dev-assistant skill
   └─> 执行 analyze-project 命令
       └─> 生成 AGENTS.md

3. 阅读 docs/01-文档规范/
   └─> 了解文档编写规范

4. 阅读 docs/02-模板中心/
   └─> 了解各类文档模板

5. 开始编写开发文档
```

### 日常开发

```
1. 每次对话前调用 ai-dev-assistant skill
   └─> 确保文档与开发同步

2. 按照模板创建/更新开发文档
   └─> 记录真实开发状态

3. 完成后更新进度
   └─> 更新 index.md 总进度表
```

### 阶段总结

```
1. 收集所有开发文档
   └─> 整理开发历程

2. 创建总结复盘文档
   └─> 参考总结模板

3. 整理架构图、流程图
   └─> 写入总结文档

4. 记录问题与改进计划
   └─> 为下一阶段做准备
```

## 💻 命令参考

### init-docs

初始化 docs 目录

```bash
ai-dev-assistant init-docs
```

**参数**: 无

**返回值**:
```json
{
  "success": true,
  "message": "docs 目录初始化完成",
  "targetPath": "/path/to/docs"
}
```

### analyze-project

分析项目并生成 AGENTS.md

```bash
ai-dev-assistant analyze-project
```

**参数**: 无

**返回值**:
```json
{
  "success": true,
  "message": "AGENTS.md 生成完成",
  "filePath": "/path/to/AGENTS.md",
  "analysis": {
    "projectType": "frontend",
    "techStack": {...},
    "dirStructure": [...],
    "namingConvention": {...}
  }
}
```

### create-module-doc

创建模块开发文档

```bash
ai-dev-assistant create-module-doc --type frontend --name 用户管理
```

**参数**:
- `--type`: 类型（frontend/backend）
- `--name`: 模块名称

### create-bug-doc

创建 Bug 跟踪文档

```bash
ai-dev-assistant create-bug-doc --title "登录页面验证码不显示"
```

**参数**:
- `--title`: Bug 标题

### create-summary-doc

创建总结复盘文档

```bash
ai-dev-assistant create-summary-doc --title "V1.0 版本复盘"
```

**参数**:
- `--title`: 总结主题

### update-progress

更新开发进度

```bash
ai-dev-assistant update-progress --module 用户管理 --progress 60
```

**参数**:
- `--module`: 模块名称
- `--progress`: 进度（0-100）

## 🌐 VitePress 支持

### 本地预览

```bash
cd docs
npm install
npm run docs:dev
```

访问 http://localhost:5173/ 预览文档站点。

### 构建站点

```bash
npm run docs:build
```

构建后的文件位于 `docs/.vitepress/dist`。

### 部署

可部署到任意静态托管服务：
- GitHub Pages
- Vercel
- Netlify
- 自有服务器

## 📊 文档体系特点

### 1. 标准化
- 统一的 Frontmatter 规范
- 统一的文档命名
- 统一的目录结构
- 统一的模板格式

### 2. 可检索
- 清晰的命名规则
- 完善的分类体系
- 标签系统支持
- VitePress 站点搜索

### 3. 可维护
- 平铺管理，易于查找
- 模板化，降低维护成本
- 自动化分析，减少手动工作

### 4. 可视化
- VitePress 美观站点
- 进度表格直观展示
- 架构图、流程图支持
- 版本历史清晰

### 5. 可协作
- 明确的 owner 字段
- 清晰的进度状态
- 统一的协作语言
- 便于知识传承

## ⚠️ 重要提醒

1. **每次对话必须调用本 skill** - 确保文档与开发同步
2. **所有开发文档必须写入 docs 目录** - 统一管理
3. **必须按照模板格式编写文档** - 保持规范性
4. **文档必须记录真实状态** - 不写空泛描述
5. **文档内容必须与代码保持一致** - 及时更新

## 📖 文档导航

- [完整使用说明](./README.md)
- [快速开始指南](./GETTING_STARTED.md)
- [使用示例](./EXAMPLES.md)
- [AGENTS 模板](./AGENTS.template.md)

## 🎯 适用场景

- ✅ 新项目启动
- ✅ 模块开发
- ✅ Bug 跟踪
- ✅ 测试管理
- ✅ 版本发布
- ✅ 项目复盘
- ✅ 知识沉淀
- ✅ 团队协作

## 📞 技术支持

如有问题，请查阅：
1. [README.md](./README.md) - 完整功能说明
2. [GETTING_STARTED.md](./GETTING_STARTED.md) - 快速开始
3. [EXAMPLES.md](./EXAMPLES.md) - 使用示例

---

**让文档成为开发的助力，而不是负担！** 🚀
