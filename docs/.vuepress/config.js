
module.exports = {
  port: 9091,
  title: 'Flutter中文文档',
  description: '',
  head: [
    ['link', { rel: 'icon', href: '/images/logo.png' }]
  ],

  themeConfig: {
    logo: '/images/logo.png',
    displayAllHeaders: true,

    sidebarDepth: 2,
    sidebar: {
      '/install': [
        {
          title: '起步',
          collapsable: false,
          children: [
            ['/install', '安装和环境配置'],
            ['/install/windows', 'Windows 安装'],
            ['/install/maxos', 'MaxOS 安装'],
            ['/install/linux', 'Linux 安装']
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