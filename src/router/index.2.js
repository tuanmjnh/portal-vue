import Vue from 'vue'
// import store from '@/store'
import VueRouter from 'vue-router'
import { vnptbkn } from '@/plugins/axios-config'
import { async } from 'q';
Vue.use(VueRouter)
// Routes
const _data = [{
    path: '/dashboard',
    name: 'dashboard',
    alias: '',
    url: 'dashboard',
    meta: { description: 'Overview of environment', requiresAuth: true },
  },
  {
    path: '/nguoidung',
    name: 'nguoidung',
    alias: '',
    url: 'nguoidung',
    meta: { description: 'Overview of environment', requiresAuth: true }
  },
  {
    path: '/modules',
    name: 'modules',
    alias: '',
    url: 'modules',
    meta: { description: 'Overview of environment', requiresAuth: true }
  },
]
const routes = [{
  // not found handler
  path: '*',
  name: 'not-found',
  component: () =>
    import('@/pages/not-found/index')
}]
_data.forEach(e => {
  routes.push({
    path: e.code,
    name: e.code,
    alias: e.alias,
    component: () => import(`@/pages/${e.url}/index`),
    meta: { description: e.descs, requiresAuth: e.required_auth ? true : false }
  })
})
var router = new VueRouter({
  routes: routes,
  mode: 'history',
})
// // http get modules
// vnptbkn.get('modules/GetByFlag/1').then(function(res) {
//   if (res.status === 200) {
//     if (res.data.data) {
//       res.data.data.forEach(e => {
//         routes.push({
//           path: e.code,
//           name: e.code,
//           alias: e.alias,
//           component: () => import(`@/pages/${e.url}/index`),
//           meta: { description: e.descs, requiresAuth: e.required_auth ? true : false }
//         })
//       })
//     }
//   }
// }).finally(() => {
//   // Vue.options.router = router
// })

// Routing logic
// router = new VueRouter({
//   routes: routes,
//   mode: 'history',
//   linkExactActiveClass: 'active',
//   scrollBehavior: function(to, from, savedPosition) {
//     return savedPosition || { x: 0, y: 0 }
//   }
// })

// Some middleware to help us ensure the user is authenticated.
// router.beforeEach((to, from, next) => {
//   if (to.matched.some(record => record.meta.requiresAuth) && (!store.state._auth.token || store.state._auth.token === 'null')) {
//     // this route requires auth, check if logged in
//     // if not, redirect to login page.
//     window.console.log('Not authenticated')
//     next({ path: '/auth', query: { redirect: to.fullPath } })
//   } else next()
// })
export default router
