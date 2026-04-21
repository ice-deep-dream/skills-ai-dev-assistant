# 目录结构说明

## 完整的目录结构

```
ai-dev-assistant/
├── skill.json                 # Skill 配置文件
├── package.json               # Node.js 包配置
├── .gitignore                 # Git 忽略文件
├── src/
│   ├── index.js               # 核心逻辑实现
│   │   ├── initDocs()         # 初始化 docs 目录
│   │   ├── analyzeProject()   # 分析项目生成 AGENTS.md
│   │   └── 辅助函数            # 项目类型/技术栈/目录结构分析
│   └── docs/                  # 📚 文档模板源目录（将被复制到项目根目录）
│       ├── .vitepress/        # VitePress 配置
│       ├── 01-文档规范/       # 文档编写规范
│       ├── 02-模板中心/       # 各类文档模板
│       ├── 03-前端开发与计划/ # 前端开发文档
│       ├── 04-后端开发与计划/ # 后端开发文档
│       ├── 05-总结复盘/       # 项目总结
│       ├── 06-Bug 管理/        # Bug 跟踪
│       ├── 07-测试管理/       # 测试文档
│       ├── 08-部署运维/       # 部署运维
│       └── 09-变更记录/       # 变更历史
├── README.md                  # 完整使用说明
├── GETTING_STARTED.md         # 快速开始指南
├── EXAMPLES.md                # 使用示例
├── SKILL_OVERVIEW.md          # Skill 总览
├── WORKFLOW.md                # 完整工作流程 ⭐ 新增
├── UPDATE_LOG.md              # 更新日志 ⭐ 新增
├── COMPLETE_INTRODUCTION.md   # 完整介绍 ⭐ 新增
├── CREATION_SUMMARY.md        # 创建总结
└── AGENTS.template.md         # AGENTS.md 模板
```

## 为什么 docs 在 src 目录下？

`src/docs/` 目录是 **文档模板的源目录**，当执行 `init-docs` 命令时，会将这个目录复制到项目的根目录。

### 工作流程

```
ai-dev-assistant/src/docs/  (源模板目录)
         ↓
    init-docs 命令
         ↓
   项目根目录/docs/      (复制后的工作目录)
```

### 代码中的路径配置

在 `src/index.js` 中：

```javascript
// 源 docs 目录路径（在 skills 目录下）
const SOURCE_DOCS_PATH = path.join(__dirname, '..', 'skills', 'docs');
```

这样设计的好处：

1. **清晰的分离**: 技能包本身的文档模板 vs 项目中的工作文档
2. **可复用**: 同一个技能包可以在多个项目中使用
3. **版本管理**: 模板的更新不会影响已项目的文档
4. **逻辑清晰**: `skills/` 目录明确表示这是技能包的一部分

## 各目录用途

### src/
技能包的核心代码实现，包含：
- `initDocs()`: 复制 docs 到项目根目录
- `analyzeProject()`: 分析项目并生成 AGENTS.md
- `updateVitePressConfig()` ⭐: 自动更新 VitePress 侧边栏配置
- `updateIndexFiles()` ⭐: 自动更新进度表格
- 辅助函数：项目类型识别、技术栈分析等

### skills/docs/
文档模板源目录，包含完整的文档体系：
- **01-文档规范**: 文档编写规范（必读）
- **02-模板中心**: 5 大标准模板（必读）
- **03-前端开发与计划**: 前端开发文档 + 总进度
- **04-后端开发与计划**: 后端开发文档 + 总进度
- **05-总结复盘**: 项目总结、架构图
- **06-Bug 管理**: Bug 跟踪文档
- **07-测试管理**: 测试文档
- **08-部署运维**: 部署运维文档
- **09-变更记录**: 版本变更历史

### 根目录文档
技能包的使用说明文档：
- `README.md`: 完整使用说明
- `GETTING_STARTED.md`: 快速开始指南
- `EXAMPLES.md`: 使用示例
- `SKILL_OVERVIEW.md`: Skill 总览
- `CREATION_SUMMARY.md`: 创建总结
- `AGENTS.template.md`: AGENTS.md 模板

## 使用时的目录变化

### 执行 init-docs 前

```
your-project/
├── node_modules/
├── src/
├── package.json
└── ...
```

### 执行 init-docs 后

```
your-project/
├── node_modules/
├── src/
├── package.json
├── docs/                    ← 新创建的文档目录
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
└── ...
```

## 文件流向

```
ai-dev-assistant/src/docs/
         ↓ (init-docs 命令)
    your-project/docs/
         ↓ (开发过程中)
    your-project/docs/03-前端开发与计划/001-模块开发.md
    your-project/docs/04-后端开发与计划/001-模块开发.md
    your-project/docs/06-Bug 管理/BUG-001-xxx.md
    ...
```

## 总结

- ✅ `src/docs/` 是模板源目录（只读）
- ✅ 项目根目录的 `docs/` 是工作目录（可写）
- ✅ 通过 `init-docs` 命令复制模板
- ✅ 开发过程中在工作目录创建和更新文档
- ✅ 保持模板和项目的清晰分离
