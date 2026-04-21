---
layout: home

hero:
  name: "XXX文档中心"
  text: "项目开发规范与指南"
  tagline: 统一的开发规范、模板与最佳实践，助力高效协作
  image:
    src: /common.svg
    alt: XXX Logo
  actions:
    - theme: brand
      text: 开始使用
      link: /01-文档规范/
    - theme: alt
      text: 模板中心
      link: /02-模板中心/

features:
  - icon: 📋
    title: 文档规范
    details: 统一的文档编写规范，包括命名规则、Frontmatter标准，确保文档风格一致、易于维护。
  - icon: 📝
    title: 模板中心
    details: 前端/后端开发模板、Bug报告模板、测试模板等，提升开发效率，减少重复工作。
  - icon: 🚀
    title: 最佳实践
    details: 汇集项目开发的最佳实践，前后端开发指南，部署运维手册，助力团队高效协作。
  - icon: 🐛
    title: Bug 管理
    details: 统一的 Bug 报告和处理流程，问题追踪与解决方案记录，持续改进产品质量。
---

## 快速导航

<div class="quick-links">

### 📚 文档规范
- [文档说明](/01-文档规范/001-文档说明) - 文档中心使用指南
- [命名规范](/01-文档规范/002-命名规范) - 文件与目录命名规则
- [Frontmatter规范](/01-文档规范/003-Frontmatter规范) - 元数据标准

### 📝 模板中心
- [前端模块开发模板](/02-模板中心/001-前端模块开发模板)
- [后端模块开发模板](/02-模板中心/002-后端模块开发模板)
- [Bug模板](/02-模板中心/003-Bug模板)
- [更多模板...](/02-模板中心/)

</div>

<style>
.quick-links {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.quick-links h3 {
  margin-top: 0;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--vp-c-divider);
}

.quick-links ul {
  list-style: none;
  padding: 0;
}

.quick-links li {
  margin: 0.5rem 0;
}

.quick-links a {
  color: var(--vp-c-text-1);
  text-decoration: none;
  transition: color 0.2s;
}

.quick-links a:hover {
  color: var(--vp-c-brand);
}
</style>
