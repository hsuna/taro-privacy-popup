# 小程序隐私保护授权弹窗组件

[原生小程序版本](https://github.com/hsuna/miniprogram-privacy-popup)

> [关于小程序隐私保护指引设置的公告](https://developers.weixin.qq.com/community/develop/doc/00042e3ef54940ce8520e38db61801)，9 月 15 日起所有隐私接口需用户点击同意并同步给微信之后才可以使用。

# 注意事项

1. 在 2023年9月15号之前，在 `src/app.json` 或 `src/app.config.ts` 中配置 __usePrivacyCheck__: true 后，会启用隐私相关功能，如果不配置或者配置为 false 则不会启用。

2. 在 2023年9月15号之后，不论 `src/app.json` 或 `src/app.config.ts` 中是否有配置 __usePrivacyCheck__，隐私相关功能都会启用。

3. 本示例无法在 Node.js 18 上运行，推荐使用 Node.js 16

# 交互流程

1. 用户点击隐私接口或Button组件，如果用户未同意过隐私政策，则会触发 onNeedPrivacyAuthorization 事件，如果已同意，则继续执行。
![图片](/docs/image1.png)

2. 用户点击隐私Input组件，如果用户未同意过隐私政策，由于 <input> 的特殊性，不会触发onNeedPrivacyAuthorization 事件，开发者需要自行调用requirePrivacyAuthorize方法进行触发。
![图片](/docs/image2.png)

3. 开发者通过监听 onNeedPrivacyAuthorization 事件，自行进行提示，提示界面中需要使用 <button open-type="agreePrivacyAuthorization"> 组件，当用户轻触该 <button> 组件后，表示用户已阅读并同意小程序的隐私政策等收集使用规则，微信会收到该同步信息。
![图片](/docs/image3.png)

# 使用前

由于`Taro`还未支持隐私政策相关的API，这里需要使用到`@tarojs/plugin-inject`注入最新的API

> 
Taro 3.3+
请使用本插件的 1.0 或以上版本

Taro 3.1/3.2
请使用本插件的 0.0.2 版本

./config/index.js
```js
plugins: [
    [
      '@tarojs/plugin-inject',
      {
        // 配置需要新增的 API
        syncApis: ['getPrivacySetting', 'openPrivacyContract', 'requirePrivacyAuthorize', 'onNeedPrivacyAuthorization'],
        components: {
          // 配置组件新增 属性和事件
          Button: {
            bindAgreePrivacyAuthorization: '',
          },
        },
      },
    ],
]
```

# 使用方法

1. 隐私政策弹窗封装：
项目引入privacyPopup组件，在所有使用到隐私授权的页面引入privacyPopup即可，组件内部注册了onNeedPrivacyAuthorization，且通过队列的方式统一管理隐私授权的回调，无需开发者在页面做其他特殊的处理。

. 在 page.wxml 中使用组件

```jsx
<!--插入隐私弹窗即可 -->
<PrivacyPopup/>


<!--自动检测 -->
<PrivacyPopup auto/>
```

2. 针对Input的封装组件
由于Input无法触发onNeedPrivacyAuthorization，使用插槽的形式，通过getPrivacySetting获取用户隐私状态，在用户未同意的情况下，通过catch:touchstart拦截用户点击交互，使用wx.requirePrivacyAuthorize触发onNeedPrivacyAuthorization事件。

. 在 page.wxml 中使用组件，并包裹触点区域

```jsx
<!--包裹input拦截事件 -->
<PrivacyPopupWrap>
    <Input className="form-input" type="nickname" placeholder="请输入昵称" onBlur={handleGetNickname} />
</PrivacyPopupWrap>

<!--插入隐私弹窗 -->
<PrivacyPopup auto/>
```

# 相关链接
[小程序隐私协议开发指南](https://developers.weixin.qq.com/miniprogram/dev/framework/user-privacy/PrivacyAuthorize.html)

[隐私信息授权](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/privacy/wx.requirePrivacyAuthorize.html)
