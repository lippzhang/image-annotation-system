
export default {
  base: '/image-annotation-system/',
  root: 'docs',
  title: '图片标注系统',
  description: '基于 React + Konva 的图片标注系统',
  icon: '/image-annotation-system/favicon.ico',
  logo: {
    light: '/image-annotation-system/logo.png',
    dark: '/image-annotation-system/logo-dark.png',
  },
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '使用指南', link: '/guide/' },
      { text: '开发文档', link: '/development/' },
      { text: 'API 参考', link: '/api/' },
    ],
    sidebar: {
      '/guide/': [
        {
          text: '使用指南',
          items: [
            { text: '快速开始', link: '/guide/' },
            { text: '基础功能', link: '/guide/basic-features' },
            { text: '高级功能', link: '/guide/advanced-features' },
            { text: '常见问题', link: '/guide/faq' },
          ],
        },
      ],
      '/development/': [
        {
          text: '开发文档',
          items: [
            { text: '开发环境搭建', link: '/development/' },
            { text: '项目架构', link: '/development/architecture' },
            { text: '组件开发', link: '/development/components' },
            { text: '工具开发', link: '/development/tools' },
            { text: '贡献指南', link: '/development/contributing' },
          ],
        },
      ],
      '/api/': [
        {
          text: 'API 参考',
          items: [
            { text: '类型定义', link: '/api/' },
            { text: '组件 API', link: '/api/components' },
            { text: '工具 API', link: '/api/tools' },
            { text: '工具函数', link: '/api/utils' },
          ],
        },
      ],
    },
    socialLinks: [
      {
        icon: 'github',
        mode: 'link',
        content: 'https://github.com/your-username/annotation-system',
      },
    ],
    footer: {
      message: '基于 React + Konva 构建的图片标注系统',
    },
  },
  builderConfig: {
    dev: {
      startUrl: 'http://localhost:3001',
    },
  },
};