import Vue from 'vue'
import App from './App'
import router from './router'
// 引入全局样式控制文件
import './assets/css/global.css'
// 引入element-ui 并注册
import ElementUI from 'element-ui'
// 导入axios 组件
import axios from 'axios'
Vue.use(ElementUI)
// 配置axios
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

//在 axios 的请求拦截器 中配置token
axios.interceptors.request.use(
  function(config) {
    // config:代表axios的子级配置对象
    var token = window.sessionStorage.getItem('token')
    config.headers.Authorization = token
    return config
  },
  function(error) {
    return Promise.reject(error)
  }
)
Vue.prototype.$http = axios

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
