# 完整工作流程示例

## 📋 标准工作流程

### 每次对话的标准流程

```
1. 首次使用调用 auto-init 命令完成智能初始化
   ↓
2. 说明当前任务（开发新功能/修复 Bug/写测试等）
   ↓
3. 创建或更新对应的文档
   ↓
4. 执行 update-vitepress-config 更新侧边栏
   ↓
5. 执行 update-index-files 更新进度表格
   ↓
6. 完成任务
```

---

## 🚀 场景 1: 新项目启动

### 步骤 1: 智能初始化

```
用户：帮我初始化新项目
AI: [调用 ai-dev-assistant skill]
      执行 auto-init 命令
```

**执行结果**:
- ✅ docs 目录已创建
- ✅ AGENTS.md 已生成
- ✅ 项目分析完成
- ✅ 自动检测模块并生成开发文档
- ✅ VitePress 配置已更新
- ✅ 进度表格已更新

### 步骤 2: 开始第一个模块开发

```
用户：我们开始开发用户管理模块
AI: [调用 ai-dev-assistant skill]
      1. 参考 docs/02-模板中心/001-前端模块开发模板.md
      2. 创建 docs/03-前端开发与计划/001-用户管理模块开发.md
      3. 执行 update-vitepress-config 命令
      4. 执行 update-index-files 命令
```

**创建的文档**:
```markdown
---
title: 用户管理模块开发
description: 用户登录、注册、信息管理等功能开发
category: 前端开发
tags:
  - 用户
  - 认证
  - 前端
status: planning
progress: 0
owner: developer
created: 2024-01-01
---

# 用户管理模块开发

## 模块目标
实现用户管理相关功能...
```

---

## 💻 场景 2: 开发新功能

### 步骤 1: 调用 skill

```
用户：今天我要实现登录功能
AI: [调用 ai-dev-assistant skill]
```

### 步骤 2: 更新文档状态

```
AI: [打开 docs/03-前端开发与计划/001-用户管理模块开发.md]
      更新文档状态：
      - status: planning → developing
      - progress: 0 → 30
      - updated: 2024-01-02
      
      添加更新记录：
      - 2024-01-02: 开始实现登录功能
```

### 步骤 3: 编写代码

[开始编写登录功能的代码...]

### 步骤 4: 更新配置

```
AI: [调用 ai-dev-assistant skill]
      1. 执行 update-index-files 命令
```

**执行结果**:
- ✅ 前端开发进度表格已更新（进度 30%）

---

## 🐛 场景 3: 修复 Bug

### 步骤 1: 调用 skill 并创建 Bug 文档

```
用户：登录页面验证码不显示
AI: [调用 ai-dev-assistant skill]
      1. 参考 docs/02-模板中心/003-Bug 模板.md
      2. 创建 docs/06-Bug 管理/BUG-001-登录页面验证码不显示.md
```

**创建的 Bug 文档**:
```markdown
---
title: BUG-001-登录页面验证码不显示
description: 登录页面验证码图片加载失败
category: Bug
tags:
  - 前端
  - 登录
  - 验证码
status: new
priority: high
owner: developer
created: 2024-01-03
---

# BUG-001-登录页面验证码不显示

## 问题描述
登录页面验证码图片无法正常加载...
```

### 步骤 2: 分析并修复 Bug

[分析原因、编写修复代码...]

### 步骤 3: 更新 Bug 文档

```
AI: [更新 BUG-001-登录页面验证码不显示.md]
      - status: new → fixed
      - 添加原因分析和修复方案
      - updated: 2024-01-03
```

### 步骤 4: 更新配置

```
AI: [调用 ai-dev-assistant skill]
      执行 update-vitepress-config 命令
```

**执行结果**:
- ✅ VitePress 侧边栏已更新（包含新 Bug 文档链接）

---

## 📊 场景 4: 阶段总结

### 步骤 1: 调用 skill 并创建总结文档

```
用户：V1.0 版本完成了，写个总结
AI: [调用 ai-dev-assistant skill]
      1. 参考 docs/02-模板中心/004-总结模板.md
      2. 创建 docs/05-总结复盘/总结 -20240115-V1.0 版本复盘.md
```

**创建的总结文档**:
```markdown
---
title: 总结 -20240115-V1.0 版本复盘
description: V1.0 版本开发总结与复盘
category: 总结
tags:
  - 总结
  - 复盘
  - V1.0
created: 2024-01-15
---

# V1.0 版本复盘

## 项目概况
- **版本**: V1.0
- **周期**: 2024-01-01 ~ 2024-01-15
...
```

### 步骤 2: 更新配置

```
AI: [调用 ai-dev-assistant skill]
      1. 执行 update-vitepress-config 命令
      2. 执行 update-index-files 命令
```

**执行结果**:
- ✅ VitePress 侧边栏已更新（包含总结文档）
- ✅ 所有进度表格已更新

---

## 🔄 场景 5: 日常开发中的完整流程

### 完整示例对话

```
用户：帮我开发商品管理模块

AI: [调用 ai-dev-assistant skill]
      正在创建商品管理模块开发文档...
      
      1. 参考 docs/02-模板中心/001-前端模块开发模板.md
      2. 创建 docs/03-前端开发与计划/002-商品管理模块开发.md
      3. 执行 update-vitepress-config
      4. 执行 update-index-files

✅ 文档已创建
✅ VitePress 配置已更新
✅ 进度表格已更新

现在开始开发商品管理模块...
```

**创建文档后自动执行**:

```javascript
// 1. 更新 VitePress 侧边栏
ai-dev-assistant update-vitepress-config

// 扫描到新增文档：002-商品管理模块开发.md
// 自动添加到侧边栏：
{
  text: "商品管理模块开发",
  link: "/03-前端开发与计划/002-商品管理模块开发"
}

// 2. 更新前端开发进度表格
ai-dev-assistant update-index-files

// 读取文档 Frontmatter:
// - title: 商品管理模块开发
// - status: planning
// - progress: 0
// - owner: developer
// - created: 2024-01-05

// 更新 index.md 进度表格：
| 模块 | 状态 | 进度 | 负责人 | 开始时间 | 完成时间 |
|------|------|------|--------|----------|----------|
| [用户管理模块开发](/03-前端开发与计划/001-用户管理模块开发) | developing | 60% | developer | 2024-01-01 | - |
| [商品管理模块开发](/03-前端开发与计划/002-商品管理模块开发) | planning | 0% | developer | 2024-01-05 | - |
```

---

## ⚠️ 重要提醒

### 必须遵守的规则

1. **每次对话必须调用 skill**
   - ❌ 错误：直接开始开发
   - ✅ 正确：先调用 skill，再开始开发

2. **新增文档后必须更新配置**
   - ❌ 错误：创建文档后不更新
   - ✅ 正确：创建文档 → update-vitepress-config → update-index-files

3. **文档状态必须实时更新**
   - ❌ 错误：开发完成后才更新
   - ✅ 正确：开发过程中随时更新

### 标准检查清单

在完成任务前，请检查：

- [ ] 是否调用了 ai-dev-assistant skill？
- [ ] 是否创建/更新了开发文档？
- [ ] 文档 Frontmatter 是否完整？
- [ ] 文档状态是否已更新？
- [ ] 是否执行了 update-vitepress-config？
- [ ] 是否执行了 update-index-files？
- [ ] VitePress 侧边栏是否已更新？
- [ ] 进度表格是否已更新？

---

## 📊 自动化效果展示

### 新增文档前

**VitePress 侧边栏**:
```
前端开发与计划
  └─ 001-用户管理模块开发
```

**前端开发进度**:
```
| 模块 | 状态 | 进度 |
|------|------|------|
| 用户管理模块开发 | developing | 60% |
```

### 新增文档后（自动更新）

**VitePress 侧边栏**:
```
前端开发与计划
  ├─ 001-用户管理模块开发
  └─ 002-商品管理模块开发  ← 自动添加
```

**前端开发进度**:
```
| 模块 | 状态 | 进度 |
|------|------|------|
| 用户管理模块开发 | developing | 60% |
| 商品管理模块开发 | planning | 0% |  ← 自动添加
```

---

## 🎯 总结

通过遵循这个完整的工作流程，你可以：

✅ **保持文档与开发同步** - 每次对话都调用 skill
✅ **自动化配置更新** - 新增文档后自动更新侧边栏和进度
✅ **实时掌握项目进度** - 进度表格自动更新
✅ **美观的文档站点** - VitePress 侧边栏自动同步
✅ **高效的团队协作** - 统一的文档规范和流程

**记住：好的流程是成功的一半！每次都按照标准流程执行！** 🚀
