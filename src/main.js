import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'lib-flexible/flexible.js'


import { Table } from 'ant-design-vue';
import 'ant-design-vue/lib/table/style/css'
Vue.use(Table);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
