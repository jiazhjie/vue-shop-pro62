import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/Login'
import Home from '@/components/Home'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    { path: '/login', component: Login },
    { path: '/home', component: Home }
  ]
})
//路由导航守卫 只有登录用户才能访问路由后台
// router.beforeEach((to, from, next) => {
//   console.log(this)
//   if (to.path === '/login') return next()
//   //获取token
//   const tokenStr = window.sessionStorage.getItem('token')

//   if(!tokenStr) return this.a.push('/login')
//   next()
// })
// export default router
