import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'OpenClaw 文档中心',
  description: 'OpenClaw 项目文档 - 开发规范、模板与指南',
  lang: 'zh-CN',
  
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '文档规范', link: '/01-文档规范/' },
      { text: '模板中心', link: '/02-模板中心/' },
      { text: '前端开发与计划', link: '/03-前端开发与计划/' },
      { text: '后端开发与计划', link: '/04-后端开发与计划/' },
      { text: '总结复盘', link: '/05-总结复盘/' },
      { text: 'Bug管理', link: '/06-Bug管理/' },
      { text: '测试管理', link: '/07-测试管理/' },
      { text: '部署运维', link: '/08-部署运维/' },
      { text: '变更记录', link: '/09-变更记录/' },
    ],

    sidebar: {
      '/01-文档规范/': [
        {
          text: '文档规范',
          items: [
            { text: '文档说明', link: '/01-文档规范/001-文档说明' },
            { text: '命名规范', link: '/01-文档规范/002-命名规范' },
            { text: 'Frontmatter规范', link: '/01-文档规范/003-Frontmatter规范' },
          ]
        }
      ],
      '/02-模板中心/': [
        {
          text: '模板中心',
          items: [
            { text: '前端模块开发模板', link: '/02-模板中心/001-前端模块开发模板' },
            { text: '后端模块开发模板', link: '/02-模板中心/002-后端模块开发模板' },
            { text: 'Bug模板', link: '/02-模板中心/003-Bug模板' },
            { text: '总结模板', link: '/02-模板中心/004-总结模板' },
            { text: '测试模板', link: '/02-模板中心/005-测试模板' },
          ]
        }
      ],
      '/03-前端开发与计划/': [
        {
          text: '前端开发与计划',
          items: [
            { text: '前端开发与计划', link: '/03-前端开发与计划/' },
          ]
        }
      ],
      '/04-后端开发与计划/': [
        {
          text: '后端开发与计划',
          items: [
            { text: '后端开发与计划', link: '/04-后端开发与计划/' },
          ]
        }
      ],
      '/05-总结复盘/': [
        {
          text: '总结复盘',
          items: [
            { text: '总结复盘', link: '/05-总结复盘/' },
          ]
        }
      ],
      '/06-Bug管理/': [
        {
          text: 'Bug管理',
          items: [
            { text: 'Bug管理', link: '/06-Bug管理/' },
          ]
        }
      ],
      '/07-测试管理/': [
        {
          text: '测试管理',
          items: [
            { text: '测试管理', link: '/07-测试管理/' },
          ]
        }
      ],
      '/08-部署运维/': [
        {
          text: '部署运维',
          items: [
            { text: '部署运维', link: '/08-部署运维/' },
          ]
        }
      ],
      '/09-变更记录/': [
        {
          text: '变更记录',
          items: [
            { text: '变更记录', link: '/09-变更记录/' },
          ]
        }
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/your-org/openclaw' }
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024 OpenClaw Team'
    },

    search: {
      provider: 'local'
    }
  }
})
