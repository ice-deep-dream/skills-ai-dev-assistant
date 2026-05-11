import { defineConfig } from 'vitepress'

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

    sidebar: [
      {
        text: '模板中心',
        collapsed: false,
        items: [
          { text: '模板说明', link: '/01-模板中心/' },
          { text: '前端开发模板', link: '/01-模板中心/前端开发模板' },
          { text: '后端开发模板', link: '/01-模板中心/后端开发模板' }
        ]
      },
      {
        text: '开发计划',
        collapsed: true,
        items: [
          { text: '进度总览', link: '/02-开发计划/' }
        ]
      },
      {
        text: '项目跟踪',
        collapsed: true,
        items: [
          { text: '进度总览', link: '/03-项目跟踪/' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com' }
    ]
  }
})