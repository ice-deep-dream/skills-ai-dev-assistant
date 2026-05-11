/**
 * AI 开发助手 Skill v3.0
 * 辅助 AI 进行开发文档编写
 *
 * 兼容 Claude Code Skill 格式
 *
 * 核心功能：
 * 1. 项目初始化 (project-init) - 新项目启动时自动执行
 * 2. 模块开发流程：
 *    - module-start: 模块启动（需求确认 → 计划 → 文档）
 *    - module-complete: 模块完成（更新状态 → 更新目录）
 *    - module-update: 开发过程（更新文档内容）
 * 3. 按需文档（用户明确要求时）：
 *    - create-bug-doc: Bug 跟踪文档
 *    - create-summary-doc: 总结复盘文档
 *    - create-test-doc: 测试文档
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// 源 docs 目录路径（在技能根目录下）
const SOURCE_DOCS_PATH = path.join(__dirname, '..', 'docs');

// 默认扫描路径配置（可扩展）
const DEFAULT_SCAN_PATHS = {
  apiRequest: [
    'src/utils/request.ts', 'src/utils/request.js',
    'src/api/request.ts', 'src/api/request.js',
    'src/http/request.ts', 'src/http/request.js',
    'src/services/request.ts', 'src/services/request.js',
    'lib/utils/request.ts', 'lib/utils/request.js',
    'app/utils/request.ts', 'app/utils/request.js',
  ],
  apiResponse: [
    'src/common/response.ts', 'src/common/response.js',
    'src/utils/response.ts', 'src/utils/response.js',
    'src/helpers/response.ts', 'src/helpers/response.js',
    'lib/common/response.ts', 'lib/common/response.js',
  ],
  pagination: [
    'src/common/utils/pagination.ts', 'src/utils/pagination.ts',
    'src/helpers/pagination.ts', 'lib/utils/pagination.ts',
  ],
  store: ['src/store', 'src/stores'],
  components: ['src/components', 'src/components/common', 'src/shared/components'],
  utils: ['src/utils', 'src/lib', 'src/helpers'],
  middlewares: ['src/middleware', 'src/middlewares'],
};

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

// ============================================
// 工具函数
// ============================================

/**
 * 解析文件的 frontmatter
 */
function parseFrontmatter(filePath) {
  if (!fs.existsSync(filePath)) {
    return null;
  }
  const content = fs.readFileSync(filePath, 'utf-8');
  const parsed = matter(content);
  return {
    data: parsed.data || {},
    content: parsed.content,
    raw: content
  };
}

/**
 * 序列化带 frontmatter 的文件
 */
function stringifyFrontmatter(data, content) {
  return matter.stringify(content, data);
}

/**
 * 更新文件的 frontmatter 字段
 */
function updateFrontmatter(filePath, updates) {
  const parsed = parseFrontmatter(filePath);
  if (!parsed) {
    throw new Error(`文件不存在：${filePath}`);
  }

  const newData = { ...parsed.data, ...updates };
  const newContent = stringifyFrontmatter(newData, parsed.content);
  fs.writeFileSync(filePath, newContent, 'utf-8');

  return newData;
}

/**
 * 生成唯一文件名（时间戳 + 序号）
 */
function generateUniqueFileName(prefix, title, existingFiles) {
  const timestamp = Date.now();
  const safeTitle = title.replace(/\s+/g, '-').replace(/[^\w一-龥-]/g, '');
  let fileName = `${prefix}-${timestamp}-${safeTitle}.md`;

  // 如果冲突，添加随机后缀
  if (existingFiles.includes(fileName)) {
    const randomSuffix = Math.random().toString(36).substring(2, 6);
    fileName = `${prefix}-${timestamp}-${randomSuffix}-${safeTitle}.md`;
  }

  return fileName;
}

/**
 * 验证必填参数
 */
function validateRequired(params, requiredFields) {
  const missing = [];
  for (const field of requiredFields) {
    if (params[field] === undefined || params[field] === null || params[field] === '') {
      missing.push(field);
    }
  }
  if (missing.length > 0) {
    throw new Error(`缺少必填参数：${missing.join(', ')}`);
  }
}

/**
 * 在多个可能路径中查找存在的文件
 */
function findExistingPath(projectRoot, paths) {
  for (const p of paths) {
    const fullPath = path.join(projectRoot, p);
    if (fs.existsSync(fullPath)) {
      return { path: p, fullPath };
    }
  }
  return null;
}

// ============================================
// 功能一：项目初始化
// ============================================

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
  template = template.replace('{更新日期}', new Date().toISOString().split('T')[0]);

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
 * 项目初始化命令：初始化 docs + 分析项目 + 扫描通用工具 + 更新模板
 */
async function projectInit(projectRoot) {
  console.log('🚀 开始项目初始化...');
  console.log('='.repeat(50));

  const results = {
    docsInit: null,
    projectAnalysis: null,
    toolsScan: null,
    vitepressConfig: null,
    indexFiles: null
  };

  const completedSteps = [];

  try {
    // 第 1 步：初始化 docs 目录
    console.log('\n📁 第 1 步：初始化 docs 目录...');
    results.docsInit = await initDocs(projectRoot);
    completedSteps.push('docsInit');

    // 第 2 步：分析项目
    console.log('\n🔍 第 2 步：分析项目结构...');
    results.projectAnalysis = await analyzeProject(projectRoot);
    completedSteps.push('projectAnalysis');

    // 第 3 步：扫描项目通用工具并更新模板
    console.log('\n📝 第 3 步：扫描项目通用工具...');
    const docsPath = path.join(projectRoot, 'docs');
    results.toolsScan = await scanProjectTools(projectRoot, docsPath);
    completedSteps.push('toolsScan');

    // 第 4 步：更新 VitePress 配置
    console.log('\n⚙️ 第 4 步：更新 VitePress 侧边栏配置...');
    try {
      results.vitepressConfig = await updateVitePressConfig(docsPath);
      completedSteps.push('vitepressConfig');
    } catch (error) {
      console.warn(`⚠️ VitePress 配置更新失败：${error.message}`);
    }

    // 第 5 步：更新进度表格
    console.log('\n📊 第 5 步：更新进度表格...');
    try {
      results.indexFiles = await updateIndexFiles(docsPath);
      completedSteps.push('indexFiles');
    } catch (error) {
      console.warn(`⚠️ 进度表格更新失败：${error.message}`);
    }

    console.log('\n' + '='.repeat(50));
    console.log('✅ 项目初始化完成！');
    console.log(`📁 docs 目录：${results.docsInit.targetPath}`);
    console.log(`📋 AGENTS.md：${results.projectAnalysis.filePath}`);
    console.log('📝 已更新模板通用工具信息');
    console.log('='.repeat(50));

    return {
      success: true,
      message: '项目初始化完成',
      results
    };

  } catch (error) {
    console.error('❌ 项目初始化失败：', error.message);

    // 返回部分完成的结果，便于调用方了解进度
    return {
      success: false,
      message: `项目初始化失败：${error.message}`,
      completedSteps,
      results
    };
  }
}

// ============================================
// 功能二：模块开发流程
// ============================================

/**
 * 模块启动：创建新模块开发计划
 * 流程：需求确认 → 计划 → 文档 → 更新配置
 */
async function moduleStart(projectRoot, options) {
  // 参数验证
  validateRequired(options, ['moduleName']);

  const {
    moduleName,
    moduleType = 'frontend', // frontend | backend
    description = '',
    requirements = [],
    plan = '',
    owner = 'developer'
  } = options;

  console.log(`🚀 开始模块启动：${moduleName}`);
  console.log('='.repeat(50));

  const docsPath = path.join(projectRoot, 'docs');

  // 检查 docs 目录是否存在
  if (!fs.existsSync(docsPath)) {
    console.log('docs 目录不存在，先执行项目初始化...');
    await projectInit(projectRoot);
  }

  // 1. 创建模块文档
  console.log('\n📝 创建模块开发文档...');
  const docResult = await createModuleDoc(docsPath, {
    type: moduleType,
    moduleName,
    description,
    requirements,
    plan,
    owner
  });

  // 2. 更新 VitePress 配置
  console.log('\n⚙️ 更新 VitePress 配置...');
  await updateVitePressConfig(docsPath);

  // 3. 更新进度表格
  console.log('\n📊 更新进度表格...');
  await updateIndexFiles(docsPath);

  console.log('\n' + '='.repeat(50));
  console.log('✅ 模块启动完成！');
  console.log(`📄 开发文档：${docResult.filePath}`);
  console.log('='.repeat(50));

  return {
    success: true,
    message: '模块启动完成',
    docPath: docResult.filePath
  };
}

/**
 * 模块完成：更新模块状态为完成
 * 流程：更新状态 → 更新进度 → 更新配置
 */
async function moduleComplete(projectRoot, moduleName) {
  if (!moduleName) {
    throw new Error('缺少必填参数：moduleName');
  }

  console.log(`🎉 模块完成：${moduleName}`);
  console.log('='.repeat(50));

  const docsPath = path.join(projectRoot, 'docs');
  const devPlanPath = path.join(docsPath, '02-开发计划');

  // 查找模块文档
  const files = fs.readdirSync(devPlanPath).filter(f =>
    f.endsWith('.md') && f !== 'index.md' && f.includes(moduleName)
  );

  if (files.length === 0) {
    throw new Error(`未找到模块文档：${moduleName}`);
  }

  const filePath = path.join(devPlanPath, files[0]);
  const today = new Date().toISOString().split('T')[0];

  // 使用 gray-matter 解析并更新 frontmatter
  const parsed = parseFrontmatter(filePath);
  if (!parsed) {
    throw new Error(`无法解析文件：${filePath}`);
  }

  const newData = {
    ...parsed.data,
    status: 'completed',
    progress: 100,
    updated: today
  };

  // 更新内容中的更新记录
  let content = parsed.content;
  const updateRecordRegex = /(\| 日期 \| 内容 \| 更新人 \|[\s\S]*?)(\n\n|---|$)/;
  const newRecord = `| ${today} | 模块开发完成 | - |`;

  if (updateRecordRegex.test(content)) {
    content = content.replace(updateRecordRegex, (match) => {
      // 找到表格最后一行（不含表头）
      const lines = match.trim().split('\n');
      const lastLineIndex = lines.length - 1;
      // 在最后一行后添加新记录
      lines.splice(lastLineIndex + 1, 0, newRecord);
      return lines.join('\n') + '\n';
    });
  }

  // 写入文件
  const newContent = stringifyFrontmatter(newData, content);
  fs.writeFileSync(filePath, newContent, 'utf-8');
  console.log(`✓ 已更新文档状态：${files[0]}`);

  // 更新进度表格
  await updateIndexFiles(docsPath);

  // 更新 VitePress 配置
  await updateVitePressConfig(docsPath);

  console.log('\n' + '='.repeat(50));
  console.log('✅ 模块完成处理完成！');
  console.log('='.repeat(50));

  return {
    success: true,
    message: '模块完成处理完成',
    filePath
  };
}

/**
 * 模块更新：开发过程中更新文档内容
 * 流程：更新内容 → 更新进度
 */
async function moduleUpdate(projectRoot, moduleName, updates) {
  if (!moduleName) {
    throw new Error('缺少必填参数：moduleName');
  }

  console.log(`📝 模块更新：${moduleName}`);

  const docsPath = path.join(projectRoot, 'docs');
  const devPlanPath = path.join(docsPath, '02-开发计划');

  // 查找模块文档
  const files = fs.readdirSync(devPlanPath).filter(f =>
    f.endsWith('.md') && f !== 'index.md' && f.includes(moduleName)
  );

  if (files.length === 0) {
    throw new Error(`未找到模块文档：${moduleName}`);
  }

  const filePath = path.join(devPlanPath, files[0]);
  const today = new Date().toISOString().split('T')[0];

  // 使用 gray-matter 解析
  const parsed = parseFrontmatter(filePath);
  if (!parsed) {
    throw new Error(`无法解析文件：${filePath}`);
  }

  const newData = { ...parsed.data, updated: today };
  let content = parsed.content;

  // 更新 frontmatter 字段
  if (updates.status) {
    newData.status = updates.status;
  }
  if (updates.progress !== undefined) {
    newData.progress = updates.progress;
  }

  // 添加更新记录
  if (updates.note) {
    const updateRecordRegex = /(\| 日期 \| 内容 \| 更新人 \|[\s\S]*?)(\n\n|---|$)/;
    const newRecord = `| ${today} | ${updates.note} | - |`;

    if (updateRecordRegex.test(content)) {
      content = content.replace(updateRecordRegex, (match) => {
        const lines = match.trim().split('\n');
        lines.push(newRecord);
        return lines.join('\n') + '\n';
      });
    }
  }

  // 写入文件
  const newContent = stringifyFrontmatter(newData, content);
  fs.writeFileSync(filePath, newContent, 'utf-8');
  console.log(`✓ 已更新文档：${files[0]}`);

  // 更新进度表格
  await updateIndexFiles(docsPath);

  return {
    success: true,
    message: '模块更新完成',
    filePath
  };
}

// ============================================
// 功能三：按需文档
// ============================================

/**
 * 创建 Bug 跟踪文档
 */
async function createBugDoc(projectRoot, options) {
  // 参数验证
  validateRequired(options, ['title']);

  const { title, description = '', priority = 'medium', steps = '', expected = '', actual = '' } = options;

  console.log(`🐛 创建 Bug 文档：${title}`);

  const docsPath = path.join(projectRoot, 'docs');
  const trackPath = path.join(docsPath, '03-项目跟踪');

  // 确保目录存在
  if (!fs.existsSync(trackPath)) {
    fs.mkdirSync(trackPath, { recursive: true });
  }

  // 获取现有文件列表
  const existingFiles = fs.readdirSync(trackPath);

  // 生成唯一文件名
  const fileName = generateUniqueFileName('BUG', title, existingFiles);
  const filePath = path.join(trackPath, fileName);

  const today = new Date().toISOString().split('T')[0];

  // 提取编号
  const bugId = fileName.match(/BUG-(\d+)/)?.[1] || Date.now().toString();

  const content = `---
title: ${title}
description: ${description || title}
category: Bug
tags:
  - bug
  - ${priority}
status: new
bugId: BUG-${bugId}
priority: ${priority}
created: ${today}
updated: ${today}
---

# ${title}

## 问题描述

${description || '待补充'}

## 复现步骤

\`\`\`
${steps || '待补充'}
\`\`\`

## 预期结果

${expected || '待补充'}

## 实际结果

${actual || '待补充'}

## 解决方案

<!-- 记录解决方案 -->

## 相关信息

- **优先级**：${priority}
- **状态**：新建
- **创建时间**：${today}

---

*由 AI 开发助手自动生成*
`;

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`✓ Bug 文档已创建：${fileName}`);

  // 更新配置
  await updateVitePressConfig(docsPath);

  return { success: true, filePath, fileName };
}

/**
 * 创建总结复盘文档
 */
async function createSummaryDoc(projectRoot, options) {
  // 参数验证
  validateRequired(options, ['title']);

  const { title, type = 'project', content: summaryContent = '' } = options;

  console.log(`📋 创建总结文档：${title}`);

  const docsPath = path.join(projectRoot, 'docs');
  const trackPath = path.join(docsPath, '03-项目跟踪');

  // 确保目录存在
  if (!fs.existsSync(trackPath)) {
    fs.mkdirSync(trackPath, { recursive: true });
  }

  // 获取现有文件列表
  const existingFiles = fs.readdirSync(trackPath);

  // 生成唯一文件名
  const fileName = generateUniqueFileName('总结', title, existingFiles);
  const filePath = path.join(trackPath, fileName);

  const today = new Date().toISOString().split('T')[0];

  const content = `---
title: ${title}
description: ${type === 'project' ? '项目总结' : '模块总结'}
category: 总结
tags:
  - 总结
  - ${type}
created: ${today}
---

# ${title}

## 背景

<!-- 项目/模块背景 -->

## 目标

<!-- 预期目标 -->

## 完成情况

<!-- 实际完成情况 -->

## 经验总结

### 做得好的

<!-- 值得保持的做法 -->

### 需要改进的

<!-- 需要改进的地方 -->

### 下一步计划

<!-- 后续计划 -->

---

${summaryContent || '<!-- 补充内容 -->'}

---

*由 AI 开发助手自动生成*
`;

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`✓ 总结文档已创建：${fileName}`);

  // 更新配置
  await updateVitePressConfig(docsPath);

  return { success: true, filePath, fileName };
}

/**
 * 创建测试文档
 */
async function createTestDoc(projectRoot, options) {
  // 参数验证
  validateRequired(options, ['title']);

  const { title, testType = 'manual', moduleName = '', testCases = [] } = options;

  console.log(`🧪 创建测试文档：${title}`);

  const docsPath = path.join(projectRoot, 'docs');
  const trackPath = path.join(docsPath, '03-项目跟踪');

  // 确保目录存在
  if (!fs.existsSync(trackPath)) {
    fs.mkdirSync(trackPath, { recursive: true });
  }

  // 获取现有文件列表
  const existingFiles = fs.readdirSync(trackPath);

  // 生成唯一文件名
  const fileName = generateUniqueFileName('TEST', title, existingFiles);
  const filePath = path.join(trackPath, fileName);

  const today = new Date().toISOString().split('T')[0];

  // 生成测试用例表格
  const testCaseTable = testCases.length > 0
    ? testCases.map((tc, i) => `| ${i + 1} | ${tc.name || '待补充'} | ${tc.steps || '待补充'} | ${tc.expected || '待补充'} | 待执行 |`).join('\n')
    : '| 1 | 待补充 | 待补充 | 待补充 | 待执行 |';

  const content = `---
title: ${title}
description: ${moduleName ? `${moduleName} 测试文档` : '测试文档'}
category: 测试
tags:
  - 测试
  - ${testType}
testType: ${testType}
status: planning
created: ${today}
updated: ${today}
---

# ${title}

## 测试范围

${moduleName ? `模块：${moduleName}` : '待补充'}

## 测试环境

| 项目 | 说明 |
|------|------|
| 测试类型 | ${testType === 'manual' ? '手动测试' : '自动化测试'} |
| 测试环境 | 待补充 |
| 测试人员 | 待补充 |

## 测试用例

| 编号 | 用例名称 | 测试步骤 | 预期结果 | 状态 |
|------|----------|----------|----------|------|
${testCaseTable}

## 测试结果

<!-- 记录测试结果 -->

## 问题记录

<!-- 记录测试中发现的问题 -->

---

*由 AI 开发助手自动生成*
`;

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`✓ 测试文档已创建：${fileName}`);

  // 更新配置
  await updateVitePressConfig(docsPath);

  return { success: true, filePath, fileName };
}

// ============================================
// 辅助函数
// ============================================

/**
 * 创建模块开发文档
 */
async function createModuleDoc(docsPath, options) {
  const {
    type = 'frontend',
    moduleName,
    description = '',
    requirements = [],
    plan = '',
    owner = 'developer'
  } = options;

  console.log(`开始创建${type === 'frontend' ? '前端' : '后端'}模块文档...`);
  console.log(`模块名称：${moduleName}`);

  // 目标目录
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

  // 替换功能清单占位符
  if (requirements.length > 0) {
    const reqList = requirements.map((r, i) => `- [ ] ${r}`).join('\n');
    // 移除默认的功能占位符
    template = template.replace(/- \[ \] 【功能\d+】\n?/g, '');
    // 在功能清单后添加实际需求
    template = template.replace(
      '**功能清单**：',
      `**功能清单**：\n${reqList}`
    );
  }

  // 替换依赖模块占位符
  template = template.replace(/- \[ \] 【依赖模块】\n?/g, '');
  template = template.replace(/- \[ \] 【被依赖模块】\n?/g, '');

  // 添加开发计划
  if (plan) {
    template += `\n\n## 开发计划\n\n${plan}\n`;
  }

  // 添加描述
  if (description) {
    template = template.replace(
      '### 3.1 模块目标',
      `### 3.1 模块目标\n\n${description}\n`
    );
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
 * 自动更新 VitePress 配置文件（增量更新 sidebar）
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
      const link = `/${path.posix.join(dirName, file).replace('.md', '')}`;

      // 使用 gray-matter 读取标题
      let text = file.replace('.md', '');
      try {
        const parsed = parseFrontmatter(path.join(dirPath, file));
        if (parsed && parsed.data.title) {
          text = parsed.data.title;
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

  // 读取现有配置，尝试保留其他设置
  let existingConfig = '';
  try {
    existingConfig = fs.readFileSync(configPath, 'utf-8');
  } catch (e) {
    // 忽略读取错误
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
    const parsed = parseFrontmatter(filePath);

    if (parsed) {
      modules.push({
        file: file.replace('.md', ''),
        title: parsed.data.title || file.replace('.md', ''),
        status: parsed.data.status || '-',
        progress: parsed.data.progress || 0,
        owner: parsed.data.owner || '-',
        created: parsed.data.created || '-',
        updated: parsed.data.updated || '-'
      });
    }
  }

  // 生成进度表格
  const tableRows = modules.map(m =>
    `| [${m.title}](/02-开发计划/${m.file}) | ${m.status} | ${m.progress}% | ${m.owner} | ${m.created} | ${m.updated} |`
  ).join('\n');

  // 读取 index.md
  let indexContent = fs.readFileSync(indexFile, 'utf-8');

  // 替换或添加进度表格
  const tableRegex = /\| 模块 \| 状态 \| 进度 \| 负责人 \| 开始时间 \| 完成时间 \|[\s\S]*?(?=\n\n|---|$)/;
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

// ============================================
// 项目分析辅助函数
// ============================================

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
\`\`\`

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
  const apiInfo = findExistingPath(projectRoot, DEFAULT_SCAN_PATHS.apiRequest);
  if (apiInfo) {
    template = template.replace('【初始化时自动检测】', apiInfo.path);
    const content = fs.readFileSync(apiInfo.fullPath, 'utf-8');
    template = template.replace('// 【初始化时根据项目实际代码生成】',
      `// 实际代码（前500字符）:\n// ${content.slice(0, 500).split('\n').join('\n// ')}`);
  }

  // 扫描状态管理
  const storeInfo = findExistingPath(projectRoot, DEFAULT_SCAN_PATHS.store);
  if (storeInfo) {
    const isPinia = storeInfo.path.includes('stores');
    template = template.replace('【初始化时自动检测项目目录结构】',
      `检测到 ${isPinia ? 'Pinia' : 'Vuex'} 状态管理，目录：${storeInfo.path}`);
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
  const responseInfo = findExistingPath(projectRoot, DEFAULT_SCAN_PATHS.apiResponse);
  if (responseInfo) {
    template = template.replace('【初始化时自动检测】', responseInfo.path);
  }

  // 扫描分页工具
  const paginationInfo = findExistingPath(projectRoot, DEFAULT_SCAN_PATHS.pagination);
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

function scanCommonComponents(projectRoot) {
  const components = [];

  for (const p of DEFAULT_SCAN_PATHS.components) {
    const componentsPath = path.join(projectRoot, p);
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
      break; // 找到一个目录就停止
    }
  }

  return components.slice(0, 5);
}

function scanUtils(projectRoot) {
  const utils = [];

  for (const p of DEFAULT_SCAN_PATHS.utils) {
    const utilsPath = path.join(projectRoot, p);
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
      break;
    }
  }

  return utils.slice(0, 5);
}

function scanMiddlewares(projectRoot) {
  const middlewares = [];

  for (const p of DEFAULT_SCAN_PATHS.middlewares) {
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
      break;
    }
  }

  return middlewares;
}

// ============================================
// Claude Code Skill 入口
// ============================================

/**
 * Skill 入口函数 - 兼容 Claude Code
 * @param {string} command - 命令名称
 * @param {object} options - 命令参数
 * @param {string} projectRoot - 项目根目录
 */
async function execute(command, options = {}, projectRoot = process.cwd()) {
  const commands = {
    'project-init': () => projectInit(projectRoot),
    'module-start': () => moduleStart(projectRoot, options),
    'module-complete': () => moduleComplete(projectRoot, options.moduleName),
    'module-update': () => moduleUpdate(projectRoot, options.moduleName, options),
    'create-bug-doc': () => createBugDoc(projectRoot, options),
    'create-summary-doc': () => createSummaryDoc(projectRoot, options),
    'create-test-doc': () => createTestDoc(projectRoot, options),
  };

  if (!commands[command]) {
    return {
      success: false,
      message: `未知命令：${command}。可用命令：${Object.keys(commands).join(', ')}`
    };
  }

  try {
    return await commands[command]();
  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
}

// 导出命令
module.exports = {
  // Skill 入口
  execute,

  // 功能一：项目初始化
  projectInit,
  initDocs,
  analyzeProject,
  copyDir,

  // 功能二：模块开发流程
  moduleStart,
  moduleComplete,
  moduleUpdate,
  createModuleDoc,

  // 功能三：按需文档
  createBugDoc,
  createSummaryDoc,
  createTestDoc,

  // 配置更新
  updateVitePressConfig,
  updateIndexFiles,

  // 工具扫描
  scanProjectTools,

  // 工具函数
  parseFrontmatter,
  updateFrontmatter,
  validateRequired,
  generateUniqueFileName,
};
