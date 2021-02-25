import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'lib-flexible/flexible.js'

// import wx from 'weixin-js-sdk'

import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://123.56.171.41:9012'
});

Vue.prototype.axios=instance
 

// if(location.href.indexOf('from') != -1 || location.href.indexOf('isappinstalled') != -1){
//       window.location.href = location.href.split('?')[0];  // 这里的split中的字符串会变换（?或&），主要看自己的url
// }


// axios.get('https://feiyan.jutatech.top:20443/api/getTicket?url=' + encodeURIComponent(location.href.split('#')[0])).then((res) => {
//    let d=res.data.data;
//    wx.config({
//         debug: false, // 开启调试模式,开发时可以开启 
//         appId: 'wx2598cf5242c17d5b',  // 必填，公众号的唯一标识  由接口返回
//         timestamp: d.timestamp, // 必填，生成签名的时间戳 由接口返回
//         nonceStr:  d.nonceStr,    // 必填，生成签名的随机串 由接口返回
//         signature: d.signature,  // 必填，签名 由接口返回
//         jsApiList: ['onMenuShareAppMessage','onMenuShareTimeline'] // 此处填你所用到的方法
//    })

//    wx.error(function (res) {
//     logUtil.printLog('验证失败返回的信息:',res);
//    });

//    wx.ready(function () {
//         wx.onMenuShareTimeline({
//           title: '实时更新：新型冠状病毒肺炎枣庄疫情地图', // 分享标题
//           link: 'https://www.hugetower.cn/feiyan/', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
//           imgUrl: 'https://www.hugetower.cn/yqsb.png', // 分享图标
//           success: function () {
//           // 用户点击了分享后执行的回调函数
//           }
//         })

//         wx.onMenuShareAppMessage({
//           title: '实时更新：新型冠状病毒肺炎枣庄疫情地图', // 分享标题
//           desc: '枣庄社区疫情地图 关心身边的每一个人', // 分享描述
//           link: 'https://www.hugetower.cn/feiyan/', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
//           imgUrl: 'https://www.hugetower.cn/yqsb.png', // 分享图标
//           type: '', // 分享类型,music、video或link，不填默认为link
//           dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
//           success: function () {
//             // 用户点击了分享后执行的回调函数
//           }
//         })
//     })

// }).catch((error) => {
//    console.log(error)
// });




import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
Vue.use(Antd);

import { FormModel } from 'ant-design-vue';
Vue.use(FormModel);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
