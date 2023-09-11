export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/toggle/index'
  ],
  tabBar:{
    list:[
      {
        pagePath: "pages/index/index",
        text:"首页",
      },
      {
        pagePath: "pages/toggle/index",
        text:"切换",
      }
    ]
  },
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  __usePrivacyCheck__: true,
})
