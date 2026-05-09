/**
 * AI 开发助手 Skill
 * 用于辅助 AI 进行开发文档编写（计划、开发、BUG、总结）
 */

const fs = require('fs');
const path = require('path');

// 源 docs 目录路径（在技能根目录下）
const SOURCE_DOCS_PATH = path.join(__dirname, '..', 'docs');

/**
 * 复制目录（递归）
 */
function copyDir(src, dest) {
  // 创建目标目录
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  // 读取源目录内容
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      // 递归复制子目录
      copyDir(srcPath, destPath);
    } else {
      // 复制文件
      fs.copyFileSync(srcPath, destPath);
      console.log(`已复制：${entry.name}`);
    }
  }
}

/**
 * 命令：初始化 docs 目录
 * 将模板 docs 复制到项目根目录
 */
async function initDocs(projectRoot) {
  const targetDocsPath = path.join(projectRoot, 'docs');
  
  console.log('开始初始化 docs 目录...');
  console.log(`源路径：${SOURCE_DOCS_PATH}`);
  console.log(`目标路径：${targetDocsPath}`);

  if (!fs.existsSync(SOURCE_DOCS_PATH)) {
    throw new Error(`源 docs 目录不存在：${SOURCE_DOCS_PATH}`);
  }

  copyDir(SOURCE_DOCS_PATH, targetDocsPath);
  
  console.log('✓ docs 目录初始化完成');
  console.log(`✓ 已复制到：${targetDocsPath}`);
  
  return {
    success: true,
    message: 'docs 目录初始化完成',
    targetPath: targetDocsPath
  };
}

/**
 * 分析项目并生成 AGENTS.md
 */
async function analyzeProject(projectRoot) {
  console.log('开始分析项目...');

  const agentsFile = path.join(projectRoot, 'AGENTS.md');
  const templatePath = path.join(__dirname, '../AGENTS.template.md');
  
  // 检查模板文件是否存在
  if (!fs.existsSync(templatePath)) {
    console.warn('警告：AGENTS.template.md 模板文件不存在，使用默认生成逻辑');
    return analyzeProjectLegacy(projectRoot);
  }
  
  // 分析项目类型
  const projectType = analyzeProjectType(projectRoot);
  
  // 分析技术栈
  const techStack = analyzeTechStack(projectRoot);
  
  // 分析目录结构
  const dirStructure = analyzeDirectoryStructure(projectRoot);
  
  // 分析命名规范
  const namingConvention = analyzeNamingConvention(projectRoot);
  
  // 读取模板文件
  let template = fs.readFileSync(templatePath, 'utf-8');
  
  // 替换模板中的占位符
  template = template.replace('{项目类型描述}', getProjectTypeDescription(projectType));
  template = template.replace('{框架名称}', techStack.framework || '未检测到');
  template = template.replace('{构建工具}', techStack.buildTool || '未检测到');
  template = template.replace('{包管理工具}', techStack.packageManager || 'npm');
  template = template.replace('{编程语言}', techStack.language || 'JavaScript');
  template = template.replace('{UI 框架}', techStack.ui || '未使用');
  template = template.replace('{目录结构描述}', getDirectoryStructureDescription(dirStructure));
  template = template.replace('{文件命名规范}', namingConvention.fileNaming);
  template = template.replace('{组件命名规范}', namingConvention.componentNaming);
  template = template.replace('{模块组织方式}', namingConvention.moduleOrganization);
  template = template.replace('{开发模式描述}', getDevelopmentModeDescription(projectType, techStack));

  // 写入文件
  fs.writeFileSync(agentsFile, template, 'utf-8');
  
  console.log('✓ AGENTS.md 生成完成');
  console.log(`✓ 文件位置：${agentsFile}`);
  
  return {
    success: true,
    message: 'AGENTS.md 生成完成',
    filePath: agentsFile,
    analysis: {
      projectType,
      techStack,
      dirStructure,
      namingConvention
    }
  };
}

/**
 * 旧版 AGENTS.md 生成逻辑（向后兼容）
 */
async function analyzeProjectLegacy(projectRoot) {
  const agentsFile = path.join(projectRoot, 'AGENTS.md');
  
  // 分析项目类型
  const projectType = analyzeProjectType(projectRoot);
  
  // 分析技术栈
  const techStack = analyzeTechStack(projectRoot);
  
  // 分析目录结构
  const dirStructure = analyzeDirectoryStructure(projectRoot);
  
  // 分析命名规范
  const namingConvention = analyzeNamingConvention(projectRoot);
  
  // 生成 AGENTS.md 内容
  const content = generateAgentsContent({
    projectType,
    techStack,
    dirStructure,
    namingConvention
  });

  // 写入文件
  fs.writeFileSync(agentsFile, content, 'utf-8');
  
  console.log('✓ AGENTS.md 生成完成');
  console.log(`✓ 文件位置：${agentsFile}`);
  
  return {
    success: true,
    message: 'AGENTS.md 生成完成',
    filePath: agentsFile,
    analysis: {
      projectType,
      techStack,
      dirStructure,
      namingConvention
    }
  };
}

/**
 * 分析项目类型
 */
function analyzeProjectType(projectRoot) {
  const packageJsonPath = path.join(projectRoot, 'package.json');
  const hasFrontend = fs.existsSync(packageJsonPath);
  
  // 检查是否有后端特征
  const hasBackend = 
    fs.existsSync(path.join(projectRoot, 'server')) ||
    fs.existsSync(path.join(projectRoot, 'api')) ||
    fs.existsSync(path.join(projectRoot, 'backend'));
  
  // 检查是否是 monorepo
  const isMonorepo = 
    fs.existsSync(path.join(projectRoot, 'packages')) ||
    fs.existsSync(path.join(projectRoot, 'apps'));
  
  if (isMonorepo) {
    return 'monorepo';
  } else if (hasFrontend && hasBackend) {
    return 'fullstack';
  } else if (hasFrontend) {
    return 'frontend';
  } else if (hasBackend) {
    return 'backend';
  }
  
  return 'unknown';
}

/**
 * 分析技术栈
 */
function analyzeTechStack(projectRoot) {
  const techStack = {
    framework: null,
    buildTool: null,
    packageManager: null,
    language: null,
    ui: null
  };

  // 读取 package.json
  const packageJsonPath = path.join(projectRoot, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    
    // 检测框架
    const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
    
    if (deps['vue']) techStack.framework = 'Vue';
    else if (deps['react']) techStack.framework = 'React';
    else if (deps['angular']) techStack.framework = 'Angular';
    else if (deps['svelte']) techStack.framework = 'Svelte';
    else if (deps['next']) techStack.framework = 'Next.js';
    else if (deps['nuxt']) techStack.framework = 'Nuxt.js';
    
    // 检测构建工具
    if (deps['vite']) techStack.buildTool = 'Vite';
    else if (deps['webpack']) techStack.buildTool = 'Webpack';
    else if (deps['rollup']) techStack.buildTool = 'Rollup';
    else if (deps['esbuild']) techStack.buildTool = 'esbuild';
    
    // 检测 UI 框架
    if (deps['element-plus']) techStack.ui = 'Element Plus';
    else if (deps['antd']) techStack.ui = 'Ant Design';
    else if (deps['@mui/material']) techStack.ui = 'Material-UI';
    else if (deps['tailwindcss']) techStack.ui = 'Tailwind CSS';
  }

  // 检测包管理工具
  if (fs.existsSync(path.join(projectRoot, 'pnpm-lock.yaml'))) {
    techStack.packageManager = 'pnpm';
  } else if (fs.existsSync(path.join(projectRoot, 'yarn.lock'))) {
    techStack.packageManager = 'yarn';
  } else if (fs.existsSync(path.join(projectRoot, 'package-lock.json'))) {
    techStack.packageManager = 'npm';
  } else {
    techStack.packageManager = 'npm';
  }

  // 检测语言
  if (fs.existsSync(path.join(projectRoot, 'tsconfig.json'))) {
    techStack.language = 'TypeScript';
  } else {
    techStack.language = 'JavaScript';
  }

  return techStack;
}

/**
 * 分析目录结构
 */
function analyzeDirectoryStructure(projectRoot) {
  const structure = [];
  
  try {
    const entries = fs.readdirSync(projectRoot, { withFileTypes: true });
    
    for (const entry of entries) {
      if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
        structure.push({
          name: entry.name,
          type: 'directory'
        });
      } else if (entry.isFile() && !entry.name.startsWith('.')) {
        structure.push({
          name: entry.name,
          type: 'file'
        });
      }
    }
  } catch (error) {
    console.error('分析目录结构失败:', error);
  }
  
  return structure;
}

/**
 * 分析命名规范
 */
function analyzeNamingConvention(projectRoot) {
  const convention = {
    fileNaming: 'kebab-case',
    componentNaming: 'PascalCase',
    moduleOrganization: 'by-feature'
  };
  
  // 检查 src 目录
  const srcPath = path.join(projectRoot, 'src');
  if (fs.existsSync(srcPath)) {
    const srcEntries = fs.readdirSync(srcPath, { withFileTypes: true });
    
    // 检查是否有 components 目录
    const componentsPath = path.join(srcPath, 'components');
    if (fs.existsSync(componentsPath)) {
      const components = fs.readdirSync(componentsPath);
      
      // 分析组件命名风格
      const hasPascalCase = components.some(c => /^[A-Z]/.test(c));
      const hasKebabCase = components.some(c => /-/.test(c));
      
      if (hasPascalCase && !hasKebabCase) {
        convention.componentNaming = 'PascalCase';
      } else if (hasKebabCase) {
        convention.componentNaming = 'kebab-case';
      }
    }
  }
  
  return convention;
}

/**
 * 生成 AGENTS.md 内容
 */
function generateAgentsContent(analysis) {
  const { projectType, techStack, dirStructure, namingConvention } = analysis;
  
  return `# AI 开发助手 - 项目配置文件

## 项目类型

${getProjectTypeDescription(projectType)}

## 技术栈

- **框架**: ${techStack.framework || '未检测到'}
- **构建工具**: ${techStack.buildTool || '未检测到'}
- **包管理工具**: ${techStack.packageManager || 'npm'}
- **语言**: ${techStack.language || 'JavaScript'}
- **UI 框架**: ${techStack.ui || '未使用'}

## 目录结构特点

${getDirectoryStructureDescription(dirStructure)}

## 命名规范

- **文件命名**: ${namingConvention.fileNaming}
- **组件命名**: ${namingConvention.componentNaming}
- **模块组织**: ${namingConvention.moduleOrganization}

## 开发模式

${getDevelopmentModeDescription(projectType, techStack)}

## 使用说明

### 每次对话前

1. **必须调用本 skill**
2. 确保 docs 文档已初始化
3. 按照文档模板编写开发文档

### docs 文档目录使用说明

\`\`\`
docs/
├── 01-文档规范/         # 文档编写规范（详细阅读）
├── 02-模板中心/         # 各类文档模板（按照模板生成）
├── 03-前端开发与计划/   # 前端开发文档
├── 04-后端开发与计划/   # 后端开发文档
├── 05-总结复盘/         # 项目总结、架构图
├── 06-Bug 管理/          # Bug 跟踪
├── 07-测试管理/         # 测试文档
├── 08-部署运维/         # 部署运维
└── 09-变更记录/         # 变更历史
\`\`\`

### 文档编写规则

#### Frontmatter 必填字段

所有文档必须包含以下 Frontmatter：

\`\`\`yaml
---
title: 文档标题
description: 文档描述
category: 分类
tags:
  - 标签 1
  - 标签 2
outline: deep
---
\`\`\`

#### 文档命名规范

- **开发文档**: \`001-模块名称开发.md\`
- **Bug 文档**: \`BUG-001-Bug 标题.md\`
- **总结文档**: \`总结 -YYYYMMDD-主题.md\`
- **测试文档**: \`TEST-001-测试名称.md\`

#### 文档内容要求

1. **一个模块一个文档** - 不要过度拆分
2. **平铺管理** - 不拆子目录
3. **按开发顺序** - 从项目构建到上线
4. **真实状态** - 记录真实开发状态，不写空泛描述
5. **与代码一致** - 文档内容要和代码现状保持一致

### 各目录使用说明

#### 03-前端开发与计划

- **模板参考**: \`docs/02-模板中心/001-前端模块开发模板.md\`
- **命名格式**: \`001-用户管理模块开发.md\`
- **记录内容**: 模块目标、页面/交互、依赖接口、功能清单、状态、时间、更新记录、风险备注

#### 04-后端开发与计划

- **模板参考**: \`docs/02-模板中心/002-后端模块开发模板.md\`
- **命名格式**: \`001-用户管理模块开发.md\`
- **记录内容**: 模块目标、接口/服务、请求响应、数据结构、功能清单、状态、时间、更新记录、风险备注

#### 05-总结复盘

- **模板参考**: \`docs/02-模板中心/004-总结模板.md\`
- **用途**: 阶段总结、版本复盘、项目图集
- **记录内容**: 架构图、功能图、流程图统一写入

#### 06-Bug 管理

- **模板参考**: \`docs/02-模板中心/003-Bug 模板.md\`
- **命名格式**: \`BUG-001-Bug 标题.md\`
- **记录内容**: 问题描述、复现步骤、实际结果、预期结果、原因分析、修复方案、状态、更新记录

#### 07-测试管理

- **模板参考**: \`docs/02-模板中心/005-测试模板.md\`
- **命名格式**: \`TEST-001-测试名称.md\`

#### 08-部署运维

- 部署流程、环境配置、运维脚本

#### 09-变更记录

- 版本变更、功能增减、重大重构

## 重要提醒

⚠️ **每次对话必须调用本 skill**
⚠️ **所有开发文档必须写入 docs 目录**
⚠️ **必须按照模板格式编写文档**
⚠️ **文档必须记录真实状态**

---

*最后更新：${new Date().toISOString().split('T')[0]}*
`;
}

function getProjectTypeDescription(type) {
  const descriptions = {
    frontend: '前端项目 - 专注于用户界面和交互体验',
    backend: '后端项目 - 提供 API 服务和数据处理',
    fullstack: '全栈项目 - 同时包含前端和后端',
    monorepo: 'Monorepo 项目 - 多个包/应用统一管理',
    unknown: '未知类型 - 需要手动配置'
  };
  return descriptions[type] || descriptions.unknown;
}

function getDirectoryStructureDescription(structure) {
  if (!structure || structure.length === 0) {
    return '未检测到目录结构';
  }
  
  const dirs = structure.filter(s => s.type === 'directory').map(s => s.name);
  const files = structure.filter(s => s.type === 'file').map(s => s.name);
  
  let desc = '```\n';
  if (dirs.length > 0) {
    desc += '目录:\n';
    dirs.forEach(d => desc += `  - ${d}/\n`);
  }
  if (files.length > 0) {
    desc += '文件:\n';
    files.forEach(f => desc += `  - ${f}\n`);
  }
  desc += '```';
  
  return desc;
}

function getDevelopmentModeDescription(projectType, techStack) {
  if (projectType === 'frontend' || projectType === 'fullstack') {
    return `基于 ${techStack.framework || 'Vue'} + ${techStack.buildTool || 'Vite'} 的现代前端开发模式`;
  } else if (projectType === 'backend') {
    return '后端 API 服务开发模式';
  } else if (projectType === 'monorepo') {
    return 'Monorepo 多包管理模式';
  }
  return '标准开发模式';
}

/**
 * 自动更新 VitePress 配置文件
 * 扫描 docs 目录并更新侧边栏配置
 */
async function updateVitePressConfig(docsPath) {
  const configPath = path.join(docsPath, '.vitepress', 'config.ts');
  
  console.log('开始更新 VitePress 配置...');
  
  if (!fs.existsSync(configPath)) {
    console.warn('警告：VitePress 配置文件不存在');
    return {
      success: false,
      message: 'VitePress 配置文件不存在'
    };
  }
  
  // 扫描 docs 目录
  const sidebarItems = [];
  const docsEntries = fs.readdirSync(docsPath, { withFileTypes: true });
  
  // 定义目录顺序和名称映射
  const dirConfig = {
    '01-文档规范': { text: '文档规范', collapsed: false },
    '02-模板中心': { text: '模板中心', collapsed: false },
    '03-前端开发与计划': { text: '前端开发与计划', collapsed: true },
    '04-后端开发与计划': { text: '后端开发与计划', collapsed: true },
    '05-总结复盘': { text: '总结复盘', collapsed: true },
    '06-Bug 管理': { text: 'Bug 管理', collapsed: true },
    '07-测试管理': { text: '测试管理', collapsed: true },
    '08-部署运维': { text: '部署运维', collapsed: true },
    '09-变更记录': { text: '变更记录', collapsed: true }
  };
  
  // 按顺序处理每个目录
  const orderedDirs = Object.keys(dirConfig).sort();
  
  for (const dirName of orderedDirs) {
    const dirPath = path.join(docsPath, dirName);
    
    if (!fs.existsSync(dirPath) || !fs.statSync(dirPath).isDirectory()) {
      continue;
    }
    
    const dirConfigItem = dirConfig[dirName];
    const items = [];
    
    // 读取目录下的所有文件
    const files = fs.readdirSync(dirPath)
      .filter(f => f.endsWith('.md'))
      .sort();
    
    for (const file of files) {
      const filePath = path.join(dirName, file);
      // 使用 path.posix.join 确保跨平台兼容（URL 路径始终使用正斜杠）
      const link = `/${path.posix.join(dirName, file).replace('.md', '')}`;
      
      // 读取文件 Frontmatter 获取标题
      let text = file.replace('.md', '');
      try {
        const content = fs.readFileSync(path.join(dirPath, file), 'utf-8');
        const frontmatterMatch = content.match(/---\n([\s\S]*?)\n---/);
        if (frontmatterMatch) {
          const frontmatter = frontmatterMatch[1];
          const titleMatch = frontmatter.match(/title:\s*(.+)/);
          if (titleMatch) {
            text = titleMatch[1].trim();
          }
        }
      } catch (e) {
        console.warn(`读取文件失败：${file}`);
      }
      
      items.push({
        text,
        link
      });
    }
    
    // 添加目录到侧边栏
    sidebarItems.push({
      text: dirConfigItem.text,
      collapsed: dirConfigItem.collapsed,
      items
    });
  }
  
  // 生成新的配置文件
  const configContent = `import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "项目文档",
  description: "AI 开发助手文档站点",
  
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }]
  ],

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '文档规范', link: '/01-文档规范/' },
      { text: '模板中心', link: '/02-模板中心/' }
    ],

    sidebar: ${JSON.stringify(sidebarItems, null, 2)},

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
`;
  
  // 写入配置文件
  fs.writeFileSync(configPath, configContent, 'utf-8');
  
  console.log('✓ VitePress 配置更新完成');
  console.log(`✓ 配置文件：${configPath}`);
  
  return {
    success: true,
    message: 'VitePress 配置更新完成',
    configPath
  };
}

/**
 * 扫描并更新所有 index.md 的进度表格
 */
async function updateIndexFiles(docsPath) {
  console.log('开始更新 index.md 文件...');
  
  const indexFiles = [
    '03-前端开发与计划/index.md',
    '04-后端开发与计划/index.md'
  ];
  
  for (const indexPath of indexFiles) {
    const fullPath = path.join(docsPath, indexPath);
    
    if (!fs.existsSync(fullPath)) {
      continue;
    }
    
    // 读取目录下的所有开发文档
    const dirPath = path.join(docsPath, path.dirname(indexPath));
    const files = fs.readdirSync(dirPath)
      .filter(f => f.endsWith('.md') && f !== 'index.md');
    
    // 解析每个文档的 Frontmatter
    const modules = [];
    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      
      const frontmatterMatch = content.match(/---\n([\s\S]*?)\n---/);
      if (frontmatterMatch) {
        const frontmatter = frontmatterMatch[1];
        
        const extractField = (field) => {
          const match = frontmatter.match(new RegExp(`${field}:\\s*(.+)`));
          return match ? match[1].trim() : '-';
        };
        
        modules.push({
          file: file.replace('.md', ''),
          title: extractField('title'),
          status: extractField('status'),
          progress: extractField('progress'),
          owner: extractField('owner'),
          created: extractField('created'),
          updated: extractField('updated')
        });
      }
    }
    
    // 生成进度表格（使用 path.posix.join 确保跨平台兼容）
    const tableRows = modules.map(m => 
      `| [${m.title || m.file}](/${path.posix.join(path.basename(path.dirname(indexPath)), m.file)}) | ${m.status} | ${m.progress}% | ${m.owner} | ${m.created} | ${m.updated} |`
    ).join('\n');
    
    // 读取 index.md
    let indexContent = fs.readFileSync(fullPath, 'utf-8');
    
    // 替换或添加进度表格
    const tableRegex = /\| 模块 \| 状态 \| 进度 \| 负责人 \| 开始时间 \| 完成时间 \|\n\|---\|---\|---\|---\|---\|---\|\n([\s\S]*?)(?=\n\n|\n$|$)/;
    const newTable = `| 模块 | 状态 | 进度 | 负责人 | 开始时间 | 完成时间 |
|---|---|---|---|---|---|
${tableRows}`;
    
    if (tableRegex.test(indexContent)) {
      indexContent = indexContent.replace(tableRegex, newTable);
    } else {
      // 如果没有表格，添加到末尾
      indexContent += `\n\n## 开发进度\n\n${newTable}\n`;
    }
    
    fs.writeFileSync(fullPath, indexContent, 'utf-8');
    console.log(`✓ 已更新：${indexPath}`);
  }
  
  return {
    success: true,
    message: 'index.md 文件更新完成'
  };
}

/**
 * 创建模块开发文档（前端/后端）
 * @param {string} docsPath - docs 目录路径
 * @param {object} options - 选项
 * @param {'frontend' | 'backend'} options.type - 类型：frontend 或 backend
 * @param {string} options.moduleName - 模块名称
 * @param {string} options.description - 模块描述
 * @param {string} options.owner - 负责人
 */
async function createModuleDoc(docsPath, options) {
  const { type, moduleName, description = '', owner = 'developer' } = options;
  
  console.log(`开始创建${type === 'frontend' ? '前端' : '后端'}模块文档...`);
  console.log(`模块名称：${moduleName}`);
  
  // 确定目标目录和模板
  const targetDir = type === 'frontend' 
    ? path.join(docsPath, '03-前端开发与计划')
    : path.join(docsPath, '04-后端开发与计划');
  
  const templateFile = type === 'frontend'
    ? path.join(docsPath, '02-模板中心', '001-前端模块开发模板.md')
    : path.join(docsPath, '02-模板中心', '002-后端模块开发模板.md');
  
  // 检查目录是否存在
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  
  // 检查模板是否存在
  if (!fs.existsSync(templateFile)) {
    throw new Error(`模板文件不存在：${templateFile}`);
  }
  
  // 读取模板
  let template = fs.readFileSync(templateFile, 'utf-8');
  
  // 生成文件名（自动编号）
  const files = fs.readdirSync(targetDir).filter(f => f.endsWith('.md'));
  const nextNum = files.length + 1;
  const fileName = `${String(nextNum).padStart(3, '0')}-${moduleName}开发.md`;
  const filePath = path.join(targetDir, fileName);
  
  // 替换模板中的占位符
  const today = new Date().toISOString().split('T')[0];
  template = template.replace(/【模块名称】/g, moduleName);
  template = template.replace(/【模块描述】/g, description);
  template = template.replace(/【负责人】/g, owner);
  template = template.replace(/【创建日期】/g, today);
  
  // 如果是前端模块，替换前端相关占位符
  if (type === 'frontend') {
    template = template.replace(/【页面列表】/g, '待补充');
    template = template.replace(/【交互说明】/g, '待补充');
  } else {
    template = template.replace(/【API 列表】/g, '待补充');
    template = template.replace(/【数据结构】/g, '待补充');
  }
  
  // 写入文件
  fs.writeFileSync(filePath, template, 'utf-8');
  
  console.log(`✓ 模块文档创建完成`);
  console.log(`✓ 文件位置：${filePath}`);
  
  return {
    success: true,
    message: '模块文档创建完成',
    filePath,
    fileName
  };
}

/**
 * 创建 Bug 跟踪文档
 * @param {string} docsPath - docs 目录路径
 * @param {object} options - 选项
 * @param {string} options.title - Bug 标题
 * @param {string} options.description - Bug 描述
 * @param {'critical' | 'high' | 'medium' | 'low'} options.priority - 优先级
 * @param {string} options.reporter - 报告人
 */
async function createBugDoc(docsPath, options) {
  const { title, description = '', priority = 'medium', reporter = 'developer' } = options;
  
  console.log('开始创建 Bug 文档...');
  console.log(`Bug 标题：${title}`);
  
  // 目标目录
  const targetDir = path.join(docsPath, '06-Bug 管理');
  const templateFile = path.join(docsPath, '02-模板中心', '003-Bug 模板.md');
  
  // 检查目录是否存在
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  
  // 检查模板是否存在
  if (!fs.existsSync(templateFile)) {
    throw new Error(`模板文件不存在：${templateFile}`);
  }
  
  // 读取模板
  let template = fs.readFileSync(templateFile, 'utf-8');
  
  // 生成 Bug ID
  const files = fs.readdirSync(targetDir).filter(f => f.startsWith('BUG-') && f.endsWith('.md'));
  const nextNum = files.length + 1;
  const bugId = `BUG-${new Date().getFullYear()}${String(nextNum).padStart(3, '0')}`;
  const fileName = `${bugId}-${title}.md`;
  const filePath = path.join(targetDir, fileName);
  
  // 替换模板中的占位符
  const today = new Date().toISOString().split('T')[0];
  const now = new Date().toISOString().replace('T', ' ').split('.')[0];
  
  template = template.replace(/【Bug ID】/g, bugId);
  template = template.replace(/【标题】/g, title);
  template = template.replace(/【报告人】/g, reporter);
  template = template.replace(/【报告时间】/g, now);
  template = template.replace(/【优先级】/g, priority.toUpperCase());
  template = template.replace(/【问题摘要】/g, description);
  template = template.replace(/【详细描述】/g, description);
  
  // 写入文件
  fs.writeFileSync(filePath, template, 'utf-8');
  
  console.log(`✓ Bug 文档创建完成`);
  console.log(`✓ 文件位置：${filePath}`);
  
  return {
    success: true,
    message: 'Bug 文档创建完成',
    filePath,
    fileName,
    bugId
  };
}

/**
 * 创建总结复盘文档
 * @param {string} docsPath - docs 目录路径
 * @param {object} options - 选项
 * @param {string} options.title - 总结标题
 * @param {string} options.projectName - 项目名称
 * @param {string} options.period - 总结周期（如：2024-01）
 * @param {string} options.author - 作者
 */
async function createSummaryDoc(docsPath, options) {
  const { title, projectName = '项目', period = '', author = 'developer' } = options;
  
  console.log('开始创建总结文档...');
  console.log(`总结标题：${title}`);
  
  // 目标目录
  const targetDir = path.join(docsPath, '05-总结复盘');
  const templateFile = path.join(docsPath, '02-模板中心', '004-总结模板.md');
  
  // 检查目录是否存在
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  
  // 检查模板是否存在
  if (!fs.existsSync(templateFile)) {
    throw new Error(`模板文件不存在：${templateFile}`);
  }
  
  // 读取模板
  let template = fs.readFileSync(templateFile, 'utf-8');
  
  // 生成文件名
  const today = new Date().toISOString().split('T')[0];
  const dateStr = period || today.replace(/-/g, '').slice(0, 6);
  const fileName = `总结-${dateStr}-${title}.md`;
  const filePath = path.join(targetDir, fileName);
  
  // 替换模板中的占位符
  template = template.replace(/【项目名称】/g, projectName);
  template = template.replace(/【总结标题】/g, title);
  template = template.replace(/【项目负责人】/g, author);
  template = template.replace(/【开始日期】/g, today);
  template = template.replace(/【结束日期】/g, today);
  template = template.replace(/【作者】/g, author);
  
  // 写入文件
  fs.writeFileSync(filePath, template, 'utf-8');
  
  console.log(`✓ 总结文档创建完成`);
  console.log(`✓ 文件位置：${filePath}`);
  
  return {
    success: true,
    message: '总结文档创建完成',
    filePath,
    fileName
  };
}

/**
 * 智能初始化命令：初始化 docs + 分析项目 + 自动生成模块文档
 * 首次调用时自动完成所有初始化工作，无需二次输入
 */
async function autoInit(projectRoot) {
  console.log('🚀 开始智能初始化...');
  console.log('='.repeat(50));
  
  const results = {
    docsInit: null,
    projectAnalysis: null,
    moduleDocs: [],
    vitepressConfig: null,
    indexFiles: null
  };
  
  try {
    // 第 1 步：初始化 docs 目录
    console.log('\n📁 第 1 步：初始化 docs 目录...');
    results.docsInit = await initDocs(projectRoot);
    
    // 第 2 步：分析项目
    console.log('\n🔍 第 2 步：分析项目结构...');
    results.projectAnalysis = await analyzeProject(projectRoot);
    
    // 第 3 步：自动扫描项目模块并生成开发文档
    console.log('\n📝 第 3 步：自动扫描并生成模块开发文档...');
    const docsPath = path.join(projectRoot, 'docs');
    const detectedModules = await detectProjectModules(projectRoot, results.projectAnalysis.analysis);
    
    if (detectedModules.frontend.length > 0 || detectedModules.backend.length > 0) {
      // 生成前端模块文档
      for (const module of detectedModules.frontend) {
        try {
          const docResult = await createModuleDoc(docsPath, {
            type: 'frontend',
            moduleName: module.name,
            description: module.description,
            owner: 'developer'
          });
          results.moduleDocs.push({ type: 'frontend', ...docResult });
        } catch (error) {
          console.warn(`⚠️ 前端模块文档生成失败：${module.name} - ${error.message}`);
        }
      }
      
      // 生成后端模块文档
      for (const module of detectedModules.backend) {
        try {
          const docResult = await createModuleDoc(docsPath, {
            type: 'backend',
            moduleName: module.name,
            description: module.description,
            owner: 'developer'
          });
          results.moduleDocs.push({ type: 'backend', ...docResult });
        } catch (error) {
          console.warn(`⚠️ 后端模块文档生成失败：${module.name} - ${error.message}`);
        }
      }
    } else {
      console.log('ℹ️ 未检测到具体模块，已创建空白文档结构');
    }
    
    // 第 4 步：更新 VitePress 配置
    console.log('\n⚙️ 第 4 步：更新 VitePress 侧边栏配置...');
    try {
      results.vitepressConfig = await updateVitePressConfig(docsPath);
    } catch (error) {
      console.warn(`⚠️ VitePress 配置更新失败：${error.message}`);
    }
    
    // 第 5 步：更新进度表格
    console.log('\n📊 第 5 步：更新进度表格...');
    try {
      results.indexFiles = await updateIndexFiles(docsPath);
    } catch (error) {
      console.warn(`⚠️ 进度表格更新失败：${error.message}`);
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('✅ 智能初始化完成！');
    console.log(`📁 docs 目录：${results.docsInit.targetPath}`);
    console.log(`📋 AGENTS.md：${results.projectAnalysis.filePath}`);
    console.log(`📝 生成模块文档：${results.moduleDocs.length} 个`);
    console.log('='.repeat(50));
    
    return {
      success: true,
      message: '智能初始化完成',
      results
    };
    
  } catch (error) {
    console.error('❌ 智能初始化失败：', error.message);
    throw error;
  }
}

/**
 * 自动检测项目中的模块
 * 根据项目结构智能识别前端和后端模块
 */
async function detectProjectModules(projectRoot, analysis) {
  const modules = {
    frontend: [],
    backend: []
  };
  
  const { projectType, techStack } = analysis;
  
  // 检测前端模块
  if (projectType === 'frontend' || projectType === 'fullstack' || projectType === 'monorepo') {
    const srcPath = path.join(projectRoot, 'src');
    
    if (fs.existsSync(srcPath)) {
      // 扫描常见的模块目录
      const moduleDirs = ['components', 'views', 'pages', 'modules', 'features'];
      
      for (const dir of moduleDirs) {
        const dirPath = path.join(srcPath, dir);
        if (fs.existsSync(dirPath)) {
          const entries = fs.readdirSync(dirPath, { withFileTypes: true });
          for (const entry of entries) {
            if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
              // 过滤掉通用目录
              if (!['common', 'utils', 'helpers', 'assets', 'styles', 'types'].includes(entry.name)) {
                const moduleName = formatModuleName(entry.name);
                modules.frontend.push({
                  name: moduleName,
                  description: `${moduleName}模块`,
                  path: path.join(dirPath, entry.name)
                });
              }
            }
          }
        }
      }
      
      // 如果没有检测到模块，根据项目结构创建一个基础模块
      if (modules.frontend.length === 0) {
        modules.frontend.push({
          name: '基础架构',
          description: '项目基础架构和配置',
          path: srcPath
        });
      }
    }
  }
  
  // 检测后端模块
  if (projectType === 'backend' || projectType === 'fullstack' || projectType === 'monorepo') {
    const backendDirs = ['server', 'api', 'backend', 'src'];
    
    for (const dir of backendDirs) {
      const dirPath = path.join(projectRoot, dir);
      if (fs.existsSync(dirPath)) {
        // 扫描后端模块目录
        const possibleModuleDirs = ['modules', 'controllers', 'routes', 'services', 'models'];
        
        for (const moduleDir of possibleModuleDirs) {
          const modulePath = path.join(dirPath, moduleDir);
          if (fs.existsSync(modulePath)) {
            const entries = fs.readdirSync(modulePath, { withFileTypes: true });
            for (const entry of entries) {
              if (entry.isFile() && (entry.name.endsWith('.js') || entry.name.endsWith('.ts'))) {
                const moduleName = formatModuleName(entry.name.replace(/\.(js|ts)$/, ''));
                modules.backend.push({
                  name: moduleName,
                  description: `${moduleName}服务`,
                  path: path.join(modulePath, entry.name)
                });
              }
            }
          }
        }
        
        // 如果没有检测到具体模块，创建一个基础后端模块
        if (modules.backend.length === 0) {
          modules.backend.push({
            name: 'API 服务',
            description: '后端 API 服务模块',
            path: dirPath
          });
        }
        
        break; // 找到一个后端目录就停止
      }
    }
  }
  
  // 去重
  modules.frontend = deduplicateModules(modules.frontend);
  modules.backend = deduplicateModules(modules.backend);
  
  console.log(`📦 检测到前端模块：${modules.frontend.length} 个`);
  console.log(`📦 检测到后端模块：${modules.backend.length} 个`);
  
  return modules;
}

/**
 * 格式化模块名称（统一格式）
 */
function formatModuleName(name) {
  // 将 kebab-case 或 snake_case 转换为中文友好的名称
  return name
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase())
    .replace(/([A-Z])/g, ' $1')
    .trim();
}

/**
 * 模块去重
 */
function deduplicateModules(modules) {
  const seen = new Set();
  return modules.filter(module => {
    if (seen.has(module.name)) {
      return false;
    }
    seen.add(module.name);
    return true;
  });
}

// 导出命令
module.exports = {
  autoInit,
  initDocs,
  analyzeProject,
  copyDir,
  updateVitePressConfig,
  updateIndexFiles,
  createModuleDoc,
  createBugDoc,
  createSummaryDoc,
  detectProjectModules
};
