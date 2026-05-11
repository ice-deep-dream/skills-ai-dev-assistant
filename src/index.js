/**
 * AI 开发助手 Skill v2.0
 * 辅助 AI 进行开发文档编写
 * - 自动填充通用工具信息
 * - 简化目录结构
 * - 自动记录机制
 */

const fs = require('fs');
const path = require('path');

// 源 docs 目录路径（在技能根目录下）
const SOURCE_DOCS_PATH = path.join(__dirname, '..', 'docs');

/**
 * 复制目录（递归）
 */
function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
      console.log(`已复制：${entry.name}`);
    }
  }
}

/**
 * 命令：初始化 docs 目录
 * 将模板 docs-new 复制到项目根目录
 */
async function initDocs(projectRoot) {
  const targetDocsPath = path.join(projectRoot, 'docs');

  console.log('开始初始化 docs 目录...');
  console.log(`源路径：${SOURCE_DOCS_PATH}`);
  console.log(`目标路径：${targetDocsPath}`);

  if (!fs.existsSync(SOURCE_DOCS_PATH)) {
    throw new Error(`源 docs 目录不存在：${SOURCE_DOCS_PATH}`);
  }

  // 如果目标目录已存在，先备份
  if (fs.existsSync(targetDocsPath)) {
    const backupPath = path.join(projectRoot, `docs-backup-${Date.now()}`);
    console.log(`备份现有 docs 到：${backupPath}`);
    copyDir(targetDocsPath, backupPath);
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
 * 扫描项目通用工具并更新模板
 */
async function scanProjectTools(projectRoot, docsPath) {
  console.log('\n🔧 扫描项目通用工具...');

  const analysis = {
    projectType: analyzeProjectType(projectRoot),
    techStack: analyzeTechStack(projectRoot)
  };

  // 扫描前端通用工具
  if (analysis.projectType === 'frontend' || analysis.projectType === 'fullstack') {
    await scanFrontendTools(projectRoot, docsPath, analysis);
  }

  // 扫描后端通用工具
  if (analysis.projectType === 'backend' || analysis.projectType === 'fullstack') {
    await scanBackendTools(projectRoot, docsPath, analysis);
  }

  console.log('✓ 项目通用工具扫描完成');
  return analysis;
}

/**
 * 扫描前端通用工具
 */
async function scanFrontendTools(projectRoot, docsPath, analysis) {
  console.log('  扫描前端工具...');

  const templatePath = path.join(docsPath, '01-模板中心', '前端开发模板.md');
  if (!fs.existsSync(templatePath)) {
    console.warn('  ⚠️ 前端开发模板不存在');
    return;
  }

  let template = fs.readFileSync(templatePath, 'utf-8');

  // 扫描 API 请求封装
  const apiInfo = scanApiRequest(projectRoot, analysis);
  if (apiInfo) {
    template = template.replace('【初始化时自动检测】', apiInfo.path);
    template = template.replace('// 【初始化时根据项目实际代码生成】', apiInfo.code);
  }

  // 扫描状态管理
  const storeInfo = scanStore(projectRoot, analysis);
  if (storeInfo) {
    template = template.replace('【初始化时自动检测项目目录结构】',
      `检测到 ${storeInfo.type} 状态管理`);
  }

  // 扫描通用组件
  const components = scanCommonComponents(projectRoot);
  if (components.length > 0) {
    const componentTable = components.map(c => `| ${c.name} | ${c.usage} | \`${c.example}\` |`).join('\n');
    template = template.replace('| 【自动扫描填充】 | 【用途说明】 | 【使用示例】 |', componentTable);
  }

  // 扫描工具函数
  const utils = scanUtils(projectRoot);
  if (utils.length > 0) {
    const utilsTable = utils.map(u => `| ${u.name} | ${u.usage} | \`${u.example}\` |`).join('\n');
    template = template.replace('| 【自动扫描填充】 | 【用途说明】 | 【使用示例】 |', utilsTable);
  }

  fs.writeFileSync(templatePath, template, 'utf-8');
  console.log('  ✓ 前端模板更新完成');
}

/**
 * 扫描后端通用工具
 */
async function scanBackendTools(projectRoot, docsPath, analysis) {
  console.log('  扫描后端工具...');

  const templatePath = path.join(docsPath, '01-模板中心', '后端开发模板.md');
  if (!fs.existsSync(templatePath)) {
    console.warn('  ⚠️ 后端开发模板不存在');
    return;
  }

  let template = fs.readFileSync(templatePath, 'utf-8');

  // 扫描 API 返回封装
  const responseInfo = scanApiResponse(projectRoot, analysis);
  if (responseInfo) {
    template = template.replace('【初始化时自动检测】', responseInfo.path);
  }

  // 扫描分页工具
  const paginationInfo = scanPagination(projectRoot, analysis);
  if (paginationInfo) {
    template = template.replace('【封装位置】：`【初始化时自动检测】`',
      `【封装位置】：\`${paginationInfo.path}\``);
  }

  // 扫描中间件
  const middlewares = scanMiddlewares(projectRoot);
  if (middlewares.length > 0) {
    const middlewareTable = middlewares.map(m => `| ${m.name} | ${m.usage} |`).join('\n');
    console.log('  ✓ 检测到中间件:', middlewares.map(m => m.name).join(', '));
  }

  fs.writeFileSync(templatePath, template, 'utf-8');
  console.log('  ✓ 后端模板更新完成');
}

/**
 * 扫描 API 请求封装
 */
function scanApiRequest(projectRoot, analysis) {
  const possiblePaths = [
    'src/utils/request.ts',
    'src/utils/request.js',
    'src/api/request.ts',
    'src/api/request.js',
    'src/http/request.ts',
    'src/http/request.js',
  ];

  for (const p of possiblePaths) {
    const fullPath = path.join(projectRoot, p);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      return {
        path: p,
        code: content.slice(0, 500) // 取前500字符作为示例
      };
    }
  }
  return null;
}

/**
 * 扫描状态管理
 */
function scanStore(projectRoot, analysis) {
  if (fs.existsSync(path.join(projectRoot, 'src/store'))) {
    if (fs.existsSync(path.join(projectRoot, 'src/stores'))) {
      return { type: 'Pinia' };
    }
    return { type: 'Vuex' };
  }
  return null;
}

/**
 * 扫描通用组件
 */
function scanCommonComponents(projectRoot) {
  const components = [];
  const componentsPath = path.join(projectRoot, 'src/components');

  if (fs.existsSync(componentsPath)) {
    const entries = fs.readdirSync(componentsPath, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        components.push({
          name: entry.name,
          usage: `通用${entry.name}组件`,
          example: `<${entry.name} />`
        });
      }
    }
  }

  return components.slice(0, 5); // 最多返回5个
}

/**
 * 扫描工具函数
 */
function scanUtils(projectRoot) {
  const utils = [];
  const utilsPath = path.join(projectRoot, 'src/utils');

  if (fs.existsSync(utilsPath)) {
    const entries = fs.readdirSync(utilsPath);
    for (const entry of entries) {
      if (entry.endsWith('.ts') || entry.endsWith('.js')) {
        if (entry !== 'request.ts' && entry !== 'request.js') {
          utils.push({
            name: entry.replace(/\.(ts|js)$/, ''),
            usage: '工具函数',
            example: `import { xxx } from '@/utils/${entry.replace(/\.(ts|js)$/, '')}'`
          });
        }
      }
    }
  }

  return utils.slice(0, 5);
}

/**
 * 扫描 API 返回封装
 */
function scanApiResponse(projectRoot, analysis) {
  const possiblePaths = [
    'src/common/response.ts',
    'src/common/response.js',
    'src/utils/response.ts',
    'src/utils/response.js',
    'src/helpers/response.ts',
  ];

  for (const p of possiblePaths) {
    const fullPath = path.join(projectRoot, p);
    if (fs.existsSync(fullPath)) {
      return { path: p };
    }
  }
  return null;
}

/**
 * 扫描分页工具
 */
function scanPagination(projectRoot, analysis) {
  const possiblePaths = [
    'src/common/utils/pagination.ts',
    'src/utils/pagination.ts',
    'src/helpers/pagination.ts',
  ];

  for (const p of possiblePaths) {
    const fullPath = path.join(projectRoot, p);
    if (fs.existsSync(fullPath)) {
      return { path: p };
    }
  }
  return null;
}

/**
 * 扫描中间件
 */
function scanMiddlewares(projectRoot) {
  const middlewares = [];
  const middlewarePaths = ['src/middleware', 'src/middlewares'];

  for (const p of middlewarePaths) {
    const fullPath = path.join(projectRoot, p);
    if (fs.existsSync(fullPath)) {
      const entries = fs.readdirSync(fullPath);
      for (const entry of entries) {
        if (entry.endsWith('.ts') || entry.endsWith('.js')) {
          middlewares.push({
            name: entry.replace(/\.(ts|js)$/, ''),
            usage: '中间件'
          });
        }
      }
    }
  }

  return middlewares;
}

/**
 * 智能初始化命令：初始化 docs + 分析项目 + 扫描通用工具 + 更新模板
 */
async function autoInit(projectRoot) {
  console.log('🚀 开始智能初始化...');
  console.log('='.repeat(50));

  const results = {
    docsInit: null,
    projectAnalysis: null,
    toolsScan: null,
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

    // 第 3 步：扫描项目通用工具并更新模板
    console.log('\n📝 第 3 步：扫描项目通用工具...');
    const docsPath = path.join(projectRoot, 'docs');
    results.toolsScan = await scanProjectTools(projectRoot, docsPath);

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
    console.log('📝 已更新模板通用工具信息');
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
 * 分析项目类型
 */
function analyzeProjectType(projectRoot) {
  const packageJsonPath = path.join(projectRoot, 'package.json');
  const hasFrontend = fs.existsSync(packageJsonPath);

  const hasBackend =
    fs.existsSync(path.join(projectRoot, 'server')) ||
    fs.existsSync(path.join(projectRoot, 'api')) ||
    fs.existsSync(path.join(projectRoot, 'backend'));

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

  const packageJsonPath = path.join(projectRoot, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

    const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };

    if (deps['vue']) techStack.framework = 'Vue';
    else if (deps['react']) techStack.framework = 'React';
    else if (deps['angular']) techStack.framework = 'Angular';
    else if (deps['svelte']) techStack.framework = 'Svelte';
    else if (deps['next']) techStack.framework = 'Next.js';
    else if (deps['nuxt']) techStack.framework = 'Nuxt.js';

    if (deps['vite']) techStack.buildTool = 'Vite';
    else if (deps['webpack']) techStack.buildTool = 'Webpack';

    if (deps['element-plus']) techStack.ui = 'Element Plus';
    else if (deps['antd']) techStack.ui = 'Ant Design';
    else if (deps['tailwindcss']) techStack.ui = 'Tailwind CSS';
  }

  if (fs.existsSync(path.join(projectRoot, 'pnpm-lock.yaml'))) {
    techStack.packageManager = 'pnpm';
  } else if (fs.existsSync(path.join(projectRoot, 'yarn.lock'))) {
    techStack.packageManager = 'yarn';
  } else {
    techStack.packageManager = 'npm';
  }

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

  const srcPath = path.join(projectRoot, 'src');
  if (fs.existsSync(srcPath)) {
    const srcEntries = fs.readdirSync(srcPath, { withFileTypes: true });

    const componentsPath = path.join(srcPath, 'components');
    if (fs.existsSync(componentsPath)) {
      const components = fs.readdirSync(componentsPath);

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
 * 旧版 AGENTS.md 生成逻辑（向后兼容）
 */
async function analyzeProjectLegacy(projectRoot) {
  const agentsFile = path.join(projectRoot, 'AGENTS.md');

  const projectType = analyzeProjectType(projectRoot);
  const techStack = analyzeTechStack(projectRoot);
  const dirStructure = analyzeDirectoryStructure(projectRoot);
  const namingConvention = analyzeNamingConvention(projectRoot);

  const content = generateAgentsContent({
    projectType,
    techStack,
    dirStructure,
    namingConvention
  });

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

## 使用说明

### 每次对话前

1. **必须调用本 skill**
2. 确保 docs 文档已初始化
3. 按照文档模板编写开发文档

### docs 文档目录使用说明

\`\`\`
docs/
├── 01-模板中心/         # 开发模板（含通用工具信息）
├── 02-开发计划/         # 前后端开发文档
├── 03-项目跟踪/         # Bug/测试/总结/进度
�`\`\`

## 重要提醒

⚠️ **每次对话必须调用本 skill**
⚠️ **所有开发文档必须写入 docs 目录**
⚠️ **必须按照模板格式编写文档**

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

  // 定义目录顺序和名称映射（新结构）
  const dirConfig = {
    '01-模板中心': { text: '模板中心', collapsed: false },
    '02-开发计划': { text: '开发计划', collapsed: true },
    '03-项目跟踪': { text: '项目跟踪', collapsed: true }
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

export default defineConfig({
  title: "项目文档",
  description: "AI 开发助手文档站点",

  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }]
  ],

  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '模板中心', link: '/01-模板中心/' },
      { text: '开发计划', link: '/02-开发计划/' },
      { text: '项目跟踪', link: '/03-项目跟踪/' }
    ],

    sidebar: ${JSON.stringify(sidebarItems, null, 2)},

    socialLinks: [
      { icon: 'github', link: 'https://github.com' }
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
 * 更新开发计划目录的进度表格
 */
async function updateIndexFiles(docsPath) {
  console.log('开始更新进度表格...');

  const indexFile = path.join(docsPath, '02-开发计划', 'index.md');

  if (!fs.existsSync(indexFile)) {
    console.warn('警告：开发计划 index.md 不存在');
    return { success: false, message: 'index.md 不存在' };
  }

  // 读取目录下的所有开发文档
  const dirPath = path.join(docsPath, '02-开发计划');
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

  // 生成进度表格
  const tableRows = modules.map(m =>
    `| [${m.title || m.file}](/02-开发计划/${m.file}) | ${m.status} | ${m.progress}% | ${m.owner} | ${m.created} | ${m.updated} |`
  ).join('\n');

  // 读取 index.md
  let indexContent = fs.readFileSync(indexFile, 'utf-8');

  // 替换或添加进度表格
  const tableRegex = /\| 模块 \| 状态 \| 进度 \| 负责人 \| 开始时间 \| 完成时间 \|\n\|---\|---\|---\|---\|---\|---\|\n([\s\S]*?)(?=\n\n|\n$|$)/;
  const newTable = `| 模块 | 状态 | 进度 | 负责人 | 开始时间 | 完成时间 |
|---|---|---|---|---|---|
${tableRows || '| - | - | - | - | - | - |'}`;

  if (tableRegex.test(indexContent)) {
    indexContent = indexContent.replace(tableRegex, newTable);
  } else {
    // 如果没有表格，添加到末尾
    indexContent += `\n\n## 开发进度\n\n${newTable}\n`;
  }

  fs.writeFileSync(indexFile, indexContent, 'utf-8');
  console.log(`✓ 已更新：02-开发计划/index.md`);

  return {
    success: true,
    message: '进度表格更新完成'
  };
}

/**
 * 创建模块开发文档
 */
async function createModuleDoc(docsPath, options) {
  const { type, moduleName, description = '', owner = 'developer' } = options;

  console.log(`开始创建${type === 'frontend' ? '前端' : '后端'}模块文档...`);
  console.log(`模块名称：${moduleName}`);

  // 目标目录（合并为开发计划目录）
  const targetDir = path.join(docsPath, '02-开发计划');
  const templateFile = path.join(docsPath, '01-模板中心',
    type === 'frontend' ? '前端开发模板.md' : '后端开发模板.md');

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
  const files = fs.readdirSync(targetDir).filter(f => f.endsWith('.md') && f !== 'index.md');
  const nextNum = files.length + 1;
  const fileName = `${String(nextNum).padStart(3, '0')}-${moduleName}开发.md`;
  const filePath = path.join(targetDir, fileName);

  // 替换模板中的占位符
  const today = new Date().toISOString().split('T')[0];
  template = template.replace(/【模块名称】/g, moduleName);
  template = template.replace(/【负责人】/g, owner);
  template = template.replace(/【日期】/g, today);
  template = template.replace(/【日期】/g, today);

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

// 导出命令
module.exports = {
  autoInit,
  initDocs,
  analyzeProject,
  copyDir,
  updateVitePressConfig,
  updateIndexFiles,
  createModuleDoc,
  scanProjectTools
};