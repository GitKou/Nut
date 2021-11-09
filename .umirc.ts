import { defineConfig } from 'dumi';
let BaseUrl = '';
export default defineConfig({
  mode: 'site', // site: 站点模式（导航头 + 左侧菜单 + 右侧内容）。 doc：文档
  title: 'LC NUT', // 组件库名称
  favicon: BaseUrl + '/images/favicon.ico',
  logo: BaseUrl + '/images/photos.svg',
  description: '公共组件库、interfaces、hooks、utils',
  // styles: ['~antd/es/style/themes/default.less']
});
