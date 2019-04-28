import Vue from 'vue'
import VueRouter from 'vue-router'
// import store from '@/store'
import * as storageAuth from '@/plugins/storage-auth'
Vue.use(VueRouter)
// Routes
const routes = [
  // {
  //   path: '/login',
  //   name: 'login',
  //   component: () => import ('@/pages/auth/index')
  // },
  // {
  //   path: '',
  //   // redirect: 'dashboard'
  // },
  {
    path: '/',
    redirect: { name: 'dashboard' }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    alias: '',
    meta: { desc: 'dashboard', auth: true, roles: ['dashboard.select'] },
    component: () => import('@/pages/dashboard/index'),
  },
  {
    path: '/nguoidung',
    name: 'nguoidung',
    alias: '',
    redirect: { name: 'nguoidung-list' },
    meta: { desc: 'nguoidung', auth: true, roles: ['nguoidung.select'] },
    component: () => import('@/pages/nguoidung/index'),
    children: [
      {
        path: 'list',
        name: 'nguoidung-list',
        props: true,
        meta: { desc: 'nguoidung-list', auth: true, roles: ['nguoidung.select'] },
        component: () => import('@/pages/nguoidung/list')
      },
      // {
      //   path: 'add/:id?',
      //   name: 'nguoidung-add',
      //   props: true,
      //   meta: { desc: 'nguoidung-add', auth: true, roles: ['nguoidung.insert', 'nguoidung.update'] },
      //   component: () => import('@/pages/nguoidung/add')
      // },
      {
        path: 'set-roles',
        name: 'set-roles',
        props: true,
        meta: { desc: 'set-roles', auth: true, roles: ['nguoidung.insert', 'nguoidung.update'] },
        component: () => import('@/pages/nguoidung/set-roles')
      },
    ]
  },
  {
    path: '/roles',
    name: 'roles',
    alias: '',
    // redirect: { name: 'roles-list' },
    meta: { desc: 'roles', auth: true, roles: ['roles.select'] },
    component: () => import('@/pages/roles/index'),
    children: [
      {
        path: 'list',
        name: 'roles-list',
        props: true,
        meta: { desc: 'roles-list', auth: true, roles: ['roles.select'] },
        component: () => import('@/pages/roles/list')
      },
      {
        path: 'add/:id?',
        name: 'roles-add',
        props: true,
        meta: { desc: 'roles-add', auth: true, roles: ['roles.insert', 'roles.update'] },
        component: () => import('@/pages/roles/add')
      }
    ]
  },
  {
    path: '/modules',
    name: 'modules',
    alias: '',
    // redirect: { name: 'modules-list' },
    meta: { desc: 'modules', auth: true, roles: ['modules.select'] },
    component: () => import('@/pages/modules/index'),
    children: [
      {
        path: 'list',
        name: 'modules-list',
        props: true,
        meta: { desc: 'modules-list', auth: true, roles: ['modules.select'] },
        component: () => import('@/pages/modules/list')
      },
      {
        path: 'add/:id?',
        name: 'modules-add',
        props: true,
        meta: { desc: 'modules-add', auth: true, roles: ['modules.insert', 'modules.update'] },
        component: () => import('@/pages/modules/add')
      }
    ]
  },
  {
    path: '/permissions',
    name: 'permissions',
    alias: '',
    // redirect: { name: 'permissions-list' },
    meta: { desc: 'permissions', auth: true, roles: ['permissions.select'] },
    component: () => import('@/pages/permissions/index'),
    children: [
      {
        path: 'list',
        name: 'permissions-list',
        props: true,
        meta: { desc: 'permissions-list', auth: true, roles: ['permissions.select'] },
        component: () => import('@/pages/permissions/list')
      },
      {
        path: 'add/:id?',
        name: 'permissions-add',
        props: true,
        meta: { desc: 'permissions-add', auth: true, roles: ['permissions.insert', 'permissions.update'] },
        component: () => import('@/pages/permissions/add')
      }
    ]
  },
  {
    path: '/dictionary',
    name: 'dictionary',
    alias: '',
    // redirect: { name: 'dictionary-list' },
    meta: { desc: 'dictionary', auth: true, roles: ['dictionary.select'] },
    component: () => import('@/pages/dictionary/index'),
    children: [
      {
        path: 'list',
        name: 'dictionary-list',
        props: true,
        meta: { desc: 'dictionary-list', auth: true, roles: ['dictionary.select'] },
        component: () => import('@/pages/dictionary/list')
      },
      {
        path: 'add/:id?',
        name: 'dictionary-add',
        props: true,
        meta: { desc: 'dictionary-add', auth: true, roles: ['dictionary.insert', 'dictionary.update'] },
        component: () => import('@/pages/dictionary/add')
      }
    ]
  },
  {
    path: '/languages',
    name: 'languages',
    alias: '',
    // redirect: { name: 'languages-list' },
    meta: { desc: 'languages', auth: true, roles: ['languages.select'] },
    component: () => import('@/pages/languages/index'),
    children: [
      {
        path: 'list',
        name: 'languages-list',
        props: true,
        meta: { desc: 'languages-list', auth: true, roles: ['languages.select'] },
        component: () => import('@/pages/languages/list')
      },
      {
        path: 'add/:id?',
        name: 'languages-add',
        props: true,
        meta: { desc: 'languages-add', auth: true, roles: ['languages.insert', 'languages.update'] },
        component: () => import('@/pages/languages/add')
      }
    ]
  },
  {
    path: '/navigation',
    name: 'navigation',
    alias: '',
    // // redirect: { name: 'navigation-list' },
    meta: { desc: 'navigation', auth: true, roles: ['navigation.select'] },
    component: () => import('@/pages/navigation/index'),
    children: [
      {
        path: 'list',
        name: 'navigation-list',
        props: true,
        meta: { desc: 'navigation-list', auth: true, roles: ['navigation.select'] },
        component: () => import('@/pages/navigation/list')
      },
      {
        path: 'add/:id?',
        name: 'navigation-add',
        props: true,
        meta: { desc: 'navigation-add', auth: true, roles: ['navigation.insert', 'navigation.update'] },
        component: () => import('@/pages/navigation/add')
      }
    ]
  },
  {
    path: '/informations',
    name: 'informations',
    alias: '',
    // redirect: { name: 'informations-list' },
    meta: { desc: 'informations', auth: true, roles: ['informations.select'] },
    component: () => import('@/pages/informations/index'),
    children: [
      {
        path: 'list',
        name: 'informations-list',
        props: true,
        meta: { desc: 'informations-list', auth: true, roles: ['informations.select'] },
        component: () => import('@/pages/informations/list')
      },
      {
        path: 'add/:id?',
        name: 'informations-add',
        props: true,
        meta: { desc: 'informations-add', auth: true, roles: ['informations.insert', 'informations.update'] },
        component: () => import('@/pages/informations/add')
      }
    ]
  },
  {
    path: '/setting',
    name: 'setting',
    alias: '',
    // redirect: { name: 'setting-list' },
    meta: { desc: 'setting', auth: true, roles: ['setting.select'] },
    component: () => import('@/pages/setting/index'),
    children: [
      {
        path: 'list',
        name: 'setting-list',
        props: true,
        meta: { desc: 'setting-list', auth: true, roles: ['setting.select'] },
        component: () => import('@/pages/setting/list')
      },
      {
        path: 'add/:id?',
        name: 'setting-add',
        props: true,
        meta: { desc: 'setting-add', auth: true, roles: ['setting.insert', 'setting.update'] },
        component: () => import('@/pages/setting/add')
      }
    ]
  },
  {
    path: '/contract-customer',
    name: 'contract-customer',
    alias: '',
    // redirect: { name: 'contract-customer-list' },
    meta: { desc: 'contract-customer', auth: true, roles: ['contract-customer.select'] },
    component: () => import('@/pages/contract-customer/index'),
    children: [
      {
        path: 'list',
        name: 'contract-customer-list',
        props: true,
        meta: { desc: 'contract-customer-list', auth: true, roles: ['contract-customer.select'] },
        component: () => import('@/pages/contract-customer/list')
      },
      {
        path: 'add/:id?',
        name: 'contract-customer-add',
        props: true,
        meta: { desc: 'contract-customer-add', auth: true, roles: ['contract-customer.insert', 'contract-customer.update'] },
        component: () => import('@/pages/contract-customer/add')
      }
    ]
  },
  {
    path: '/contract-enterprise',
    name: 'contract-enterprise',
    alias: '',
    // redirect: { name: 'contract-enterprise-list' },
    meta: { desc: 'contract-enterprise', auth: true, roles: ['contract-enterprise.select'] },
    component: () => import('@/pages/contract-enterprise/index'),
    children: [
      {
        path: 'list',
        name: 'contract-enterprise-list',
        props: true,
        meta: { desc: 'contract-enterprise-list', auth: true, roles: ['contract-enterprise.select'] },
        component: () => import('@/pages/contract-enterprise/list')
      },
      {
        path: 'add/:id?',
        name: 'contract-enterprise-add',
        props: true,
        meta: { desc: 'contract-enterprise-add', auth: true, roles: ['contract-enterprise.insert', 'contract-enterprise.update'] },
        component: () => import('@/pages/contract-enterprise/add')
      }
    ]
  },
  {
    path: '/category',
    name: 'category',
    alias: '',
    // redirect: { name: 'category-list' },
    meta: { desc: 'category', auth: true, roles: ['category.select'] },
    component: () => import('@/pages/category/index'),
    children: [
      {
        path: 'list',
        name: 'category-list',
        props: true,
        meta: { desc: 'category-list', auth: true, roles: ['category.select'] },
        component: () => import('@/pages/category/list')
      },
      {
        path: 'add/:id?',
        name: 'category-add',
        props: true,
        meta: { desc: 'category-add', auth: true, roles: ['category.insert', 'category.update'] },
        component: () => import('@/pages/category/add')
      }
    ]
  },
  {
    path: '/news',
    name: 'news',
    alias: '',
    // redirect: { name: 'category-list' },
    meta: { desc: 'news', auth: true, roles: ['news.select'] },
    component: () => import('@/pages/news/index'),
    children: [
      {
        path: 'list',
        name: 'news-list',
        props: true,
        meta: { desc: 'news-list', auth: true, roles: ['news.select'] },
        component: () => import('@/pages/news/list')
      },
      {
        path: 'add/:id?',
        name: 'news-add',
        props: true,
        meta: { desc: 'news-add', auth: true, roles: ['news.insert', 'news.update'] },
        component: () => import('@/pages/news/add')
      }
    ]
  },
  {
    path: '/kehoach',
    name: 'kehoach',
    alias: '',
    redirect: { name: 'thuebao' },
    meta: { desc: 'kehoach', auth: true, roles: ['kehoach.select'] },
    component: () => import('@/pages/kehoach/index'),
    children: [
      {
        path: 'thuebao',
        name: 'kehoach-thuebao',
        props: true,
        meta: { desc: 'kehoach-thuebao', auth: true, roles: ['kehoach.select'] },
        component: () => import('@/pages/kehoach/thuebao')
      },
      {
        path: 'import',
        name: 'kehoach-import',
        props: true,
        meta: { desc: 'kehoach-import', auth: true, roles: ['kehoach.insert'] },
        component: () => import('@/pages/kehoach/import')
      },
    ]
  },
  // {
  //   path: '/languages',
  //   name: 'languages',
  //   alias: '',
  //   // redirect: { name: 'languages-list' },
  //   component: () => import ('@/pages/languages/index'),
  //   meta: { description: 'Overview of environment', requiresAuth: true },
  //   children: [{
  //       path: 'list',
  //       name: 'languages-list',
  //       props: true,
  //       component: () => import ('@/pages/languages/list')
  //     },
  //     {
  //       path: 'add/:id?',
  //       name: 'languages-add',
  //       props: true,
  //       component: () => import ('@/pages/languages/add')
  //     }
  //   ]
  // },
  {
    // not found handler
    path: '*',
    name: 'not-found',
    alias: '',
    meta: { desc: 'Not found', auth: false, roles: ['*'] },
    component: () => import('@/pages/not-found/index'),
  }
]

// Routing logic
// console.log(process.env.NODE_ENV)
var router = new VueRouter({
  base: process.env.NODE_ENV === 'production' ? 'portal' : '/',
  routes: routes,
  mode: 'history',
  linkExactActiveClass: 'active',
  scrollBehavior: function (to, from, savedPosition) {
    // console.log(router)
    // if(!store.state.auth.isAuth)
    // route.push('auth')
    // console.log(to, from)
    return savedPosition || { x: 0, y: 0 }
  }
})
// Some middleware to help us ensure the user is authenticated.
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.auth) && !storageAuth.Authenticated()) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    window.console.log('Not authenticated')
    next({ path: '/auth', query: { redirect: to.fullPath } })
  } else next()
})

export default router
