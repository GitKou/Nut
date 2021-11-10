import { defineConfig } from 'dumi';
let BaseUrl = '';

const isDeploy = process.env.SITE_DEPLOY === 'TRUE';

export default defineConfig({
  mode: 'site', // site: 站点模式（导航头 + 左侧菜单 + 右侧内容）。 doc：文档
  title: 'LC NUT', // 组件库名称
  favicon: BaseUrl + '/images/favicon.ico',
  logo: BaseUrl + '/images/photos.svg',
  description: '公共组件库、interfaces、hooks、utils',
  extraBabelPlugins: [
    [
      'babel-plugin-import',
      {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,
      },
    ],
  ],
  hash: true,
  navs: [
    {
      title: 'Guide',
      path: '/guide',
    },
    {
      title: 'Components',
      path: '/components',
    },
    {
      title: 'Interfaces',
      path: '/interfaces',
    },
    {
      title: 'Hooks',
      path: '/hooks',
    },
    {
      title: 'Utils',
      path: '/utils',
    },
    {
      title: 'GitLab',
      path: 'https://gitlab.chaincity.net:8008/Common/Front-End/nut',
    },
  ],
  // menus: {
  //   '/components': [
  //     {
  //       title: '组件',
  //       children: [
  //         'EllipsisMiddle/index',
  //         'RequiredMark/index',
  //       ],
  //     },
  //   ],
  // },
  webpack5: {},
  // mfsu: !isDeploy ? {} : undefined,
  fastRefresh: {},
});
