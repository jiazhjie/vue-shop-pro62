import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/Login'
import Home from '@/components/Home'
import Welcome from '@/components/Welcome'

Vue.use(Router)

var router = new Router({
  routes: [
    // {
    //   path: '/',
    //   name: 'HelloWorld',
    //   component: HelloWorld
    // },
    { path: '/login', component: Login },
    { path: '/home', component: Home,redirect:'/welcome',children:
    [{path: '/welcome', component: Welcome}]}
  ]
})
// 路由导航守卫 只有登录用户才能访问路由后台
router.beforeEach((to, from, next) => {
  // 请求login就直接通过
  if (to.path === '/login') {
    return next()
  }
  // 请求非login就判断有误无token
  var token = window.sessionStorage.getItem('token')
  if (!token) {
    return next('/login')
  }
  next()
})
export default router
