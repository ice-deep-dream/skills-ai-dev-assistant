# 快速开始指南

## 📦 安装

### 方法 1: 直接复制

将 `ai-dev-assistant` 目录复制到你的项目中：

```bash
# 复制整个 skill 目录
cp -r ai-dev-assistant /your/project/path/
```

### 方法 2: 使用 skill 管理器

如果你的项目支持 skill 管理：

```bash
# 安装 skill
npm install ai-dev-assistant
```

---

## 🚀 第一次使用

### 步骤 1: 初始化 docs 目录

在你的项目根目录执行：

```bash
# 调用 skill 的 init-docs 命令
# 这会将模板 docs 复制到你的项目根目录
```

**执行后效果**:
```
your-project/
├── docs/                    # ← 新创建的文档目录
│   ├── .vitepress/
│   ├── 01-文档规范/
│   ├── 02-模板中心/
│   ├── 03-前端开发与计划/
│   ├── 04-后端开发与计划/
│   ├── 05-总结复盘/
│   ├── 06-Bug 管理/
│   ├── 07-测试管理/
│   ├── 08-部署运维/
│   └── 09-变更记录/
├── src/
├── package.json
└── ...
```

### 步骤 2: 分析项目生成 AGENTS.md

```bash
# 调用 skill 的 analyze-project 命令
# 这会自动分析你的项目并生成 AGENTS.md
```

**生成的 AGENTS.md 包含**:
- ✅ 项目类型识别
- ✅ 技术栈分析
- ✅ 目录结构特点
- ✅ 命名规范
- ✅ 文档使用指南

### 步骤 3: 阅读文档规范

```bash
# 阅读文档编写规范
cd docs/01-文档规范

# 重点阅读:
# - 001-文档说明.md
# - 002-命名规范.md
# - 003-Frontmatter 规范.md
```

### 步骤 4: 查看模板中心

```bash
# 查看各类文档模板
cd docs/02-模板中心

# 模板列表:
# - 001-前端模块开发模板.md
# - 002-后端模块开发模板.md
# - 003-Bug 模板.md
# - 004-总结模板.md
# - 005-测试模板.md
```

---

## 📖 日常使用流程

### 开始新模块开发

1. **调用 skill**
   ```
   帮我创建用户管理模块的开发文档
   ```

2. **Skill 会自动**:
   - 参考 `docs/02-模板中心/001-前端模块开发模板.md`
   - 创建 `docs/03-前端开发与计划/001-用户管理模块开发.md`
   - 包含完整的 Frontmatter 和结构

3. **开始开发**:
   - 按照文档规划进行开发
   - 实时更新文档状态
   - 记录开发进度

### 遇到 Bug

1. **调用 skill**
   ```
   发现一个 Bug，帮我创建 Bug 文档
   ```

2. **Skill 会自动**:
   - 参考 `docs/02-模板中心/003-Bug 模板.md`
   - 创建 `docs/06-Bug 管理/BUG-001-Bug 标题.md`
   - 包含问题描述、复现步骤等字段

3. **修复 Bug**:
   - 分析原因
   - 制定修复方案
   - 更新文档状态
   - 验证修复结果

### 阶段总结

1. **调用 skill**
   ```
   V1.0 版本完成了，写个总结复盘
   ```

2. **Skill 会自动**:
   - 参考 `docs/02-模板中心/004-总结模板.md`
   - 创建 `docs/05-总结复盘/总结 -20240115-V1.0 版本复盘.md`
   - 收集所有开发文档
   - 整理架构图、流程图

---

## 🔍 常用命令

### 初始化
```bash
# 初始化 docs 目录
ai-dev-assistant init-docs
```

### 项目分析
```bash
# 分析项目并生成 AGENTS.md
ai-dev-assistant analyze-project
```

### 创建文档
```bash
# 创建前端开发文档
ai-dev-assistant create-module-doc --type frontend --name 用户管理

# 创建后端开发文档
ai-dev-assistant create-module-doc --type backend --name 用户认证

# 创建 Bug 文档
ai-dev-assistant create-bug-doc --title "登录页面验证码不显示"

# 创建总结文档
ai-dev-assistant create-summary-doc --title "V1.0 版本复盘"
```

### 更新进度
```bash
# 更新开发进度
ai-dev-assistant update-progress --module 用户管理 --progress 60
```

---

## 🌐 本地预览文档

### 启动 VitePress 站点

```bash
# 进入 docs 目录
cd docs

# 安装依赖（首次）
npm install

# 启动开发服务器
npm run docs:dev
```

**输出**:
```
  VITEPRESS v1.0.0  ready in 350 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

访问 http://localhost:5173/ 查看文档站点。

### 构建静态站点

```bash
# 构建生产版本
npm run docs:build

# 预览构建结果
npm run docs:preview
```

构建后的文件位于 `docs/.vitepress/dist`，可部署到任意静态托管服务。

---

## 📋 文档检查清单

在提交代码前，请检查：

- [ ] 是否调用了 `ai-dev-assistant` skill
- [ ] 是否创建/更新了开发文档
- [ ] 文档 Frontmatter 是否完整
- [ ] 文档状态是否已更新
- [ ] 文档内容是否与代码一致
- [ ] Bug 是否已记录
- [ ] 进度是否已更新

---

## 💡 最佳实践

### ✅ 应该做的

1. **每次对话前调用 skill** - 确保文档同步
2. **及时更新文档** - 开发过程中实时更新
3. **按照模板格式** - 保持文档规范性
4. **记录真实状态** - 不写空泛描述
5. **一个模块一个文档** - 不要过度拆分
6. **平铺管理** - 不拆子目录，便于检索
7. **图类优先** - 架构图、流程图放到总结复盘

### ❌ 不应该做的

1. ~~跳过 skill 直接开发~~
2. ~~文档与代码不一致~~
3. ~~写空泛的描述~~
4. ~~过度拆分文档~~
5. ~~记录敏感信息~~
6. ~~临时笔记不整理~~

---

## 🎯 文档命名速查

| 类型 | 格式 | 示例 |
|------|------|------|
| 前端开发 | `三位数字 - 模块名称开发.md` | `001-用户管理模块开发.md` |
| 后端开发 | `三位数字 - 模块名称开发.md` | `001-用户认证模块开发.md` |
| Bug | `BUG-三位数字-Bug 标题.md` | `BUG-001-登录页面验证码不显示.md` |
| 总结 | `总结-YYYYMMDD-主题.md` | `总结 -20240115-V1.0 版本复盘.md` |
| 测试 | `TEST-三位数字 - 测试名称.md` | `TEST-001-用户管理模块测试.md` |

---

## 📊 Frontmatter 速查

### 通用字段（所有文档）

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

### 开发文档字段

```yaml
---
module: 模块名称
status: planning | developing | completed | on-hold
progress: 0-100
priority: low | medium | high | critical
owner: 负责人
created: YYYY-MM-DD
updated: YYYY-MM-DD
---
```

### Bug 文档字段

```yaml
---
status: new | investigating | fixed | verified | closed
priority: low | medium | high | critical
bugId: BUG-001
---
```

### 测试文档字段

```yaml
---
testType: manual | automated | performance | security
status: planning | in-progress | completed
---
```

---

## 🔗 相关资源

- [VitePress 官方文档](https://vitepress.dev/)
- [Markdown 语法指南](https://www.markdownguide.org/)
- [Frontmatter 规范](https://jekyllrb.com/docs/front-matter/)

---

## ❓ 常见问题

### Q: 为什么要用 docs 目录？
A: 统一管理开发文档，支持 VitePress 生成美观的文档站点，便于团队协作和知识沉淀。

### Q: 文档应该什么时候写？
A: 开发前写计划，开发中写进度，开发后写总结。Bug 和测试随时记录。

### Q: 如何保证文档质量？
A: 严格按照模板格式，记录真实状态，定期 review 和更新。

### Q: 文档太多找不到怎么办？
A: 使用统一的命名规范，通过文件名即可快速检索。VitePress 站点也支持搜索。

### Q: 可以修改模板吗？
A: 可以，但建议先复制模板到自己的项目，然后根据团队需求调整。

---

## 📞 获取帮助

如果遇到问题：

1. 查看 [README.md](./README.md) 了解完整功能
2. 查看 [EXAMPLES.md](./EXAMPLES.md) 查看使用示例
3. 查看 [AGENTS.template.md](./AGENTS.template.md) 了解配置模板

---

**记住：好的文档是成功项目的一半！🎉**
