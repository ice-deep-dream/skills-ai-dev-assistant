---
title: Frontmatter 规范
description: 文档 Frontmatter 元数据字段标准和使用规范
category: 规范
tags:
  - Frontmatter
  - 元数据
  - YAML
outline: deep
---

# Frontmatter 规范

Frontmatter 是位于 Markdown 文件顶部的 YAML 格式的元数据块，用于描述文档的各种属性。本文档规定了 OpenClaw 项目中 Frontmatter 的使用规范。

## 基本格式

Frontmatter 位于文件的最顶部，使用三横线 `---` 包围：

```markdown
---
title: 文档标题
description: 文档描述
category: 分类
---

# 文档内容开始
```

## 必需字段

以下字段是每个文档都必须包含的：

### title

- **类型**: `string`
- **说明**: 文档标题，显示在浏览器标签页、搜索结果和页面头部
- **规范**:
  - 简洁明了，控制在 30 字以内
  - 避免使用无意义的符号
  - 不要与文件名重复
- **示例**:
  ```yaml
  title: 命名规范
  title: 前端模块开发模板
  title: VitePress 配置指南
  ```

### description

- **类型**: `string`
- **说明**: 文档描述，用于 SEO 和搜索结果摘要
- **规范**:
  - 概括文档核心内容
  - 控制在 100 字以内
  - 包含关键词便于搜索
- **示例**:
  ```yaml
  description: 文档、文件和目录的命名规范标准
  description: Vue 3 + TypeScript 前端模块的标准开发模板
  ```

## 可选字段

以下字段根据文档类型和需要选择使用：

### category

- **类型**: `string`
- **说明**: 文档分类，用于归类和筛选
- **规范**:
  - 使用简洁的分类名称
  - 保持分类名称统一
- **常用值**:
  - `规范` - 规范和标准文档
  - `模板` - 各类模板
  - `指南` - 操作指南
  - `API` - API 文档
  - `教程` - 教程文档
- **示例**:
  ```yaml
  category: 规范
  category: 模板
  ```

### tags

- **类型**: `string[]`
- **说明**: 文档标签，用于细粒度分类和检索
- **规范**:
  - 使用简洁的标签名称
  - 标签数量建议 2-5 个
  - 优先使用已有标签，保持统一
- **常用标签**:
  - 技术类：`Vue`, `TypeScript`, `Node.js`, `API`
  - 类型类：`规范`, `模板`, `指南`, `教程`
  - 领域类：`前端`, `后端`, `测试`, `部署`
- **示例**:
  ```yaml
  tags:
    - 命名规范
    - 文件组织
    - 目录结构
  ```

### outline

- **类型**: `number | 'deep' | false`
- **说明**: 控制右侧大纲的显示深度
- **规范**:
  - `deep` - 显示所有层级（默认）
  - 数字 - 显示指定深度（如 `2`）
  - `false` - 不显示大纲
- **示例**:
  ```yaml
  outline: deep
  outline: 2
  outline: false
  ```

### 其他 VitePress 支持的字段

VitePress 还支持其他字段，可根据需要使用：

```yaml
# 布局设置
layout: doc        # 默认布局
layout: home       # 首页布局

# 导航设置
nav: false         # 不显示导航
sidebar: false    # 不显示侧边栏

# 编辑链接
editLink: false    # 不显示编辑链接

# 上次更新时间
lastUpdated: false # 不显示上次更新时间
```

## 完整示例

### 标准文档

```markdown
---
title: 命名规范
description: 文档、文件和目录的命名规范标准
category: 规范
tags:
  - 命名规范
  - 文件组织
  - 目录结构
outline: deep
---

# 命名规范

本文档规定了 OpenClaw 项目中文件和目录的命名规范...
```

### 模板文档

```markdown
---
title: 前端模块开发模板
description: Vue 3 + TypeScript 前端模块的标准开发模板
category: 模板
tags:
  - 前端
  - Vue
  - TypeScript
  - 模板
outline: 2
---

# 前端模块开发模板

本模板用于规范前端模块的开发流程...
```

### 指南文档

```markdown
---
title: 快速开始
description: OpenClaw 项目快速开始指南
category: 指南
tags:
  - 快速开始
  - 入门
  - 指南
outline: deep
---

# 快速开始

本指南将帮助你在几分钟内开始使用 OpenClaw...
```

## 检查清单

创建新文档时，请检查以下项目：

- [ ] 包含 `title` 字段，简洁明了
- [ ] 包含 `description` 字段，概括文档内容
- [ ] 根据需要添加 `category` 字段
- [ ] 根据需要添加 `tags` 字段（2-5 个）
- [ ] 根据需要设置 `outline` 字段
- [ ] 使用三横线 `---` 包围 Frontmatter
- [ ] Frontmatter 后空一行再开始正文

遵循以上规范，可以确保文档的一致性和可维护性。
