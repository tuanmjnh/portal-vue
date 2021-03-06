import Vue from 'vue'
// import store from '@/store'
import VueRouter from 'vue-router'
// Routes
const routes = [
  // {
  //   path: '/login',
  //   name: 'login',
  //   component: () => import ('../pages/auth/index')
  // },
  // {
  //   path: '',
  //   redirect: 'dashboard'
  // },
  {
    path: '/dashboard',
    name: 'dashboard',
    alias: '',
    component: () =>
      import('../pages/dashboard/index'),
    meta: { description: 'Overview of environment', requiresAuth: true },
  },
  {
    path: '/nguoidung',
    name: 'nguoidung',
    alias: '',
    component: () =>
      import('../pages/nguoidung/index'),
    meta: { description: 'Overview of environment', requiresAuth: true }
  },
  {
    path: '/user-role',
    name: 'user-roles',
    alias: '',
    component: () =>
      import('../pages/nguoidung/set-roles'),
    meta: { description: 'Overview of environment', requiresAuth: true }
  },
  {
    path: '/roles',
    name: 'roles',
    alias: '',
    component: () =>
      import('../pages/roles/index'),
    meta: { description: 'Overview of environment', requiresAuth: true }
  },
  {
    path: '/modules',
    name: 'modules',
    alias: '',
    component: () =>
      import('../pages/modules/index'),
    meta: { description: 'Overview of environment', requiresAuth: true }
  },
  {
    path: '/permissions',
    name: 'permissions',
    alias: '',
    component: () =>
      import('../pages/permissions/index'),
    meta: { description: 'Overview of environment', requiresAuth: true }
  },
  {
    path: '/dictionary',
    name: 'dictionary',
    alias: '',
    component: () =>
      import('../pages/dictionary/index'),
    meta: { description: 'Overview of environment', requiresAuth: true }
  },
  {
    path: '/languages',
    name: 'languages',
    alias: '',
    component: () =>
      import('../pages/languages/index'),
    meta: { description: 'Overview of environment', requiresAuth: true }
  },
  {
    path: '/navigation',
    name: 'navigation',
    alias: '',
    component: () =>
      import('../pages/navigation/index'),
    meta: { description: 'Overview of environment', requiresAuth: true }
  },
  {
    path: '/informations',
    name: 'informations',
    alias: '',
    component: () =>
      import('../pages/informations/index'),
    meta: { description: 'Overview of environment', requiresAuth: true }
  },
  {
    path: '/setting',
    name: 'setting',
    alias: '',
    component: () =>
      import('../pages/setting/index'),
    meta: { description: 'Overview of environment', requiresAuth: true }
  },
  {
    path: '/contract-customer',
    name: 'contract-customer',
    alias: '',
    meta: { description: 'Overview of environment', requiresAuth: true },
    component: () =>
      import('../pages/contract-customer/index')
  },
  {
    path: '/contract-enterprise',
    name: 'contract-enterprise',
    alias: '',
    meta: { description: 'Overview of environment', requiresAuth: true },
    component: () =>
      import('../pages/contract-enterprise/index')
  },
  // {
  //   path: '/languages',
  //   name: 'languages',
  //   alias: '',
  //   redirect: { name: 'languages-list' },
  //   component: () => import ('../pages/languages/index'),
  //   meta: { description: 'Overview of environment', requiresAuth: true },
  //   children: [{
  //       path: 'list',
  //       name: 'languages-list',
  //       props: true,
  //       component: () => import ('../pages/languages/list')
  //     },
  //     {
  //       path: 'add',
  //       name: 'languages-add',
  //       props: true,
  //       component: () => import ('../pages/languages/add')
  //     }
  //   ]
  // },
  {
    // not found handler
    path: '*',
    component: () =>
      import('../pages/not-found/index')
  }
]
Vue.use(VueRouter)

// Routing logic
var router = new VueRouter({
  routes: routes,
  mode: 'history',
  linkExactActiveClass: 'active',
  scrollBehavior: function(to, from, savedPosition) {
    return savedPosition || { x: 0, y: 0 }
  }
})
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
