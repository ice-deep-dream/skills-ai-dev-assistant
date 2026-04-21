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

// 导出命令
module.exports = {
  initDocs,
  analyzeProject,
  copyDir,
  updateVitePressConfig,
  updateIndexFiles
};
