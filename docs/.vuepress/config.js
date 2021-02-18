
module.exports = {
  port: 9091,
  title: 'Flutter 中文文档',
  description: '',
  head: [
    ['link', { rel: 'icon', href: '/images/logo.png' }]
  ],

  themeConfig: {
    logo: '/images/logo.png',
    // displayAllHeaders: true,

    sidebarDepth: 2,
    sidebar: {
      '/guide/': [
        '/guide/',
        {
          title: '安装和环境配置',
          collapsable: true,
          children: [
            '/guide/install',
            '/guide/windows-install',
            '/guide/macos-install',
            '/guide/linux-install'
          ]
        },
        {
          title: '基础组件',
          collapsable: true,
          children: [
            '/guide/component/widget',
            '/guide/component/state',
            '/guide/component/text',
            '/guide/component/button'
          ]
        },
        {
          title: '布局类组件',
          collapsable: true,
          children: [
            '/guide/layout/',
            '/guide/layout/row',
            '/guide/layout/column',
            '/guide/layout/flex',
            '/guide/layout/flow',
            '/guide/layout/wrap',
            '/guide/layout/table'
          ]
        },
        {
          title: '容器类组件',
          collapsable: true,
          children: [
            '/guide/container/',
            '/guide/container/padding',
            '/guide/container/align',
            '/guide/container/center'
          ]
        },
        {
          title: '可滚动组件',
          collapsable: true,
          children: [
            '/guide/scrollable/listview',
            '/guide/scrollable/gridview',
            '/guide/scrollable/scroll-controller'
          ]
        },
        {
          title: '功能型组件',
          collapsable: true,
          children: [
            '/guide/feature/theme',
            '/guide/feature/navigation'
          ]
        }
      ]
    }
  },

  configureWebpack: {
    resolve: {
      alias: {
        '@img': '/images'
      }
    }
  }
}