import Vue from 'vue';
import VueRouter from 'vue-router';
// import store from '@/store'
import * as storageAuth from '@/plugins/storage-auth';
import env from '@/environment/index';
Vue.use(VueRouter);
// Routes
const routes = [
  // {
  //   path: '/login',
  //   name: 'login',
  //   component: () => import ('@/views/auth/index')
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
    meta: {
      auth: true,
      roles: ['dashboard.select'],
      desc: 'dashboard',
      breadcrumb: [{ text: 'Dashboard', path: 'dashboard' }]
    },
    component: () => import('@/views/dashboard/index')
  },
  {
    path: '/nguoidung',
    name: 'nguoidung',
    alias: '',
    redirect: { name: 'nguoidung-list' },
    meta: {
      auth: true,
      roles: ['nguoidung.select'],
      desc: 'nguoidung',
      breadcrumb: [{ text: 'nguoidung', path: 'nguoidung' }]
    },
    component: () => import('@/views/nguoidung/index'),
    children: [
      {
        path: 'list',
        name: 'nguoidung-list',
        props: true,
        meta: {
          desc: 'nguoidung-list',
          auth: true,
          roles: ['nguoidung.select'],
          breadcrumb: [
            { text: 'nguoidung', path: 'nguoidung' },
            { text: 'nguoidung-list', path: 'list' }
          ]
        },
        component: () => import('@/views/nguoidung/list')
      },
      // {
      //   path: 'add/:id?',
      //   name: 'nguoidung-add',
      //   props: true,
      //   meta: { desc: 'nguoidung-add', auth: true, roles: ['nguoidung.insert', 'nguoidung.update'] },
      //   component: () => import('@/views/nguoidung/add')
      // },
      {
        path: 'set-roles',
        name: 'set-roles',
        props: true,
        meta: {
          desc: 'set-roles',
          auth: true,
          roles: ['nguoidung.insert', 'nguoidung.update']
        },
        component: () => import('@/views/nguoidung/set-roles')
      },
      {
        path: 'get-pass',
        name: 'get-pass',
        props: true,
        meta: { desc: 'get-pass', auth: true, roles: ['nguoidung.delete'] },
        component: () => import('@/views/nguoidung/get-pass')
      }
    ]
  },
  {
    path: '/roles',
    name: 'roles',
    alias: '',
    // redirect: { name: 'roles-list' },
    meta: { desc: 'roles', auth: true, roles: ['roles.select'] },
    component: () => import('@/views/roles/index'),
    children: [
      {
        path: 'list',
        name: 'roles-list',
        props: true,
        meta: { desc: 'roles-list', auth: true, roles: ['roles.select'] },
        component: () => import('@/views/roles/list')
      },
      {
        path: 'add/:id?',
        name: 'roles-add',
        props: true,
        meta: {
          desc: 'roles-add',
          auth: true,
          roles: ['roles.insert', 'roles.update']
        },
        component: () => import('@/views/roles/add')
      }
    ]
  },
  {
    path: '/modules',
    name: 'modules',
    alias: '',
    // redirect: { name: 'modules-list' },
    meta: { desc: 'modules', auth: true, roles: ['modules.select'] },
    component: () => import('@/views/modules/index'),
    children: [
      {
        path: 'list',
        name: 'modules-list',
        props: true,
        meta: { desc: 'modules-list', auth: true, roles: ['modules.select'] },
        component: () => import('@/views/modules/list')
      },
      {
        path: 'add/:id?',
        name: 'modules-add',
        props: true,
        meta: {
          desc: 'modules-add',
          auth: true,
          roles: ['modules.insert', 'modules.update']
        },
        component: () => import('@/views/modules/add')
      }
    ]
  },
  {
    path: '/permissions',
    name: 'permissions',
    alias: '',
    // redirect: { name: 'permissions-list' },
    meta: { desc: 'permissions', auth: true, roles: ['permissions.select'] },
    component: () => import('@/views/permissions/index'),
    children: [
      {
        path: 'list',
        name: 'permissions-list',
        props: true,
        meta: {
          desc: 'permissions-list',
          auth: true,
          roles: ['permissions.select']
        },
        component: () => import('@/views/permissions/list')
      },
      {
        path: 'add/:id?',
        name: 'permissions-add',
        props: true,
        meta: {
          desc: 'permissions-add',
          auth: true,
          roles: ['permissions.insert', 'permissions.update']
        },
        component: () => import('@/views/permissions/add')
      }
    ]
  },
  {
    path: '/dictionary',
    name: 'dictionary',
    alias: '',
    // redirect: { name: 'dictionary-list' },
    meta: { desc: 'dictionary', auth: true, roles: ['dictionary.select'] },
    component: () => import('@/views/dictionary/index'),
    children: [
      {
        path: 'list',
        name: 'dictionary-list',
        props: true,
        meta: {
          desc: 'dictionary-list',
          auth: true,
          roles: ['dictionary.select']
        },
        component: () => import('@/views/dictionary/list')
      },
      {
        path: 'add/:id?',
        name: 'dictionary-add',
        props: true,
        meta: {
          desc: 'dictionary-add',
          auth: true,
          roles: ['dictionary.insert', 'dictionary.update']
        },
        component: () => import('@/views/dictionary/add')
      }
    ]
  },
  {
    path: '/languages',
    name: 'languages',
    alias: '',
    // redirect: { name: 'languages-list' },
    meta: { desc: 'languages', auth: true, roles: ['languages.select'] },
    component: () => import('@/views/languages/index'),
    children: [
      {
        path: 'list',
        name: 'languages-list',
        props: true,
        meta: {
          desc: 'languages-list',
          auth: true,
          roles: ['languages.select']
        },
        component: () => import('@/views/languages/list')
      },
      {
        path: 'add/:id?',
        name: 'languages-add',
        props: true,
        meta: {
          desc: 'languages-add',
          auth: true,
          roles: ['languages.insert', 'languages.update']
        },
        component: () => import('@/views/languages/add')
      }
    ]
  },
  {
    path: '/navigation',
    name: 'navigation',
    alias: '',
    // // redirect: { name: 'navigation-list' },
    meta: { desc: 'navigation', auth: true, roles: ['navigation.select'] },
    component: () => import('@/views/navigation/index'),
    children: [
      {
        path: 'list',
        name: 'navigation-list',
        props: true,
        meta: {
          desc: 'navigation-list',
          auth: true,
          roles: ['navigation.select']
        },
        component: () => import('@/views/navigation/list')
      },
      {
        path: 'add/:id?',
        name: 'navigation-add',
        props: true,
        meta: {
          desc: 'navigation-add',
          auth: true,
          roles: ['navigation.insert', 'navigation.update']
        },
        component: () => import('@/views/navigation/add')
      }
    ]
  },
  {
    path: '/informations',
    name: 'informations',
    alias: '',
    // redirect: { name: 'informations-list' },
    meta: { desc: 'informations', auth: true, roles: ['informations.select'] },
    component: () => import('@/views/informations/index'),
    children: [
      {
        path: 'list',
        name: 'informations-list',
        props: true,
        meta: {
          desc: 'informations-list',
          auth: true,
          roles: ['informations.select']
        },
        component: () => import('@/views/informations/list')
      },
      {
        path: 'add/:id?',
        name: 'informations-add',
        props: true,
        meta: {
          desc: 'informations-add',
          auth: true,
          roles: ['informations.insert', 'informations.update']
        },
        component: () => import('@/views/informations/add')
      }
    ]
  },
  {
    path: '/setting',
    name: 'setting',
    alias: '',
    // redirect: { name: 'setting-list' },
    meta: { desc: 'setting', auth: true, roles: ['setting.select'] },
    component: () => import('@/views/setting/index'),
    children: [
      {
        path: 'list',
        name: 'setting-list',
        props: true,
        meta: { desc: 'setting-list', auth: true, roles: ['setting.select'] },
        component: () => import('@/views/setting/list')
      },
      {
        path: 'add/:id?',
        name: 'setting-add',
        props: true,
        meta: {
          desc: 'setting-add',
          auth: true,
          roles: ['setting.insert', 'setting.update']
        },
        component: () => import('@/views/setting/add')
      }
    ]
  },
  {
    path: '/contract-customer',
    name: 'contract-customer',
    alias: '',
    // redirect: { name: 'contract-customer-list' },
    meta: {
      desc: 'contract-customer',
      auth: true,
      roles: ['contract-customer.select']
    },
    component: () => import('@/views/contract-customer/index'),
    children: [
      {
        path: 'list',
        name: 'contract-customer-list',
        props: true,
        meta: {
          desc: 'contract-customer-list',
          auth: true,
          roles: ['contract-customer.select']
        },
        component: () => import('@/views/contract-customer/list')
      },
      {
        path: 'add/:id?',
        name: 'contract-customer-add',
        props: true,
        meta: {
          desc: 'contract-customer-add',
          auth: true,
          roles: ['contract-customer.insert', 'contract-customer.update']
        },
        component: () => import('@/views/contract-customer/add')
      }
    ]
  },
  {
    path: '/contract-enterprise',
    name: 'contract-enterprise',
    alias: '',
    // redirect: { name: 'contract-enterprise-list' },
    meta: {
      desc: 'contract-enterprise',
      auth: true,
      roles: ['contract-enterprise.select']
    },
    component: () => import('@/views/contract-enterprise/index'),
    children: [
      {
        path: 'list',
        name: 'contract-enterprise-list',
        props: true,
        meta: {
          desc: 'contract-enterprise-list',
          auth: true,
          roles: ['contract-enterprise.select']
        },
        component: () => import('@/views/contract-enterprise/list')
      },
      {
        path: 'add/:id?',
        name: 'contract-enterprise-add',
        props: true,
        meta: {
          desc: 'contract-enterprise-add',
          auth: true,
          roles: ['contract-enterprise.insert', 'contract-enterprise.update']
        },
        component: () => import('@/views/contract-enterprise/add')
      }
    ]
  },
  {
    path: '/category',
    name: 'category',
    alias: '',
    // redirect: { name: 'category-list' },
    meta: { desc: 'category', auth: true, roles: ['category.select'] },
    component: () => import('@/views/category/index'),
    children: [
      {
        path: 'list',
        name: 'category-list',
        props: true,
        meta: { desc: 'category-list', auth: true, roles: ['category.select'] },
        component: () => import('@/views/category/list')
      },
      {
        path: 'add/:id?',
        name: 'category-add',
        props: true,
        meta: {
          desc: 'category-add',
          auth: true,
          roles: ['category.insert', 'category.update']
        },
        component: () => import('@/views/category/add')
      }
    ]
  },
  {
    path: '/news',
    name: 'news',
    alias: '',
    // redirect: { name: 'category-list' },
    meta: { desc: 'news', auth: true, roles: ['news.select'] },
    component: () => import('@/views/news/index'),
    children: [
      {
        path: 'list',
        name: 'news-list',
        props: true,
        meta: { desc: 'news-list', auth: true, roles: ['news.select'] },
        component: () => import('@/views/news/list')
      },
      {
        path: 'add/:id?',
        name: 'news-add',
        props: true,
        meta: {
          desc: 'news-add',
          auth: true,
          roles: ['news.insert', 'news.update']
        },
        component: () => import('@/views/news/add')
      }
    ]
  },
  {
    path: '/kehoach',
    name: 'kehoach',
    alias: '',
    redirect: { name: 'thuebao' },
    meta: { desc: 'kehoach', auth: true, roles: ['kehoach.select'] },
    component: () => import('@/views/kehoach/index'),
    children: [
      {
        path: 'thuebao',
        name: 'kehoach-thuebao',
        props: true,
        meta: {
          desc: 'kehoach-thuebao',
          auth: true,
          roles: ['kehoach.select']
        },
        component: () => import('@/views/kehoach/thuebao')
      },
      {
        path: 'thuchien',
        name: 'kehoach-thuchien',
        props: true,
        meta: {
          desc: 'kehoach-thuchien',
          auth: true,
          roles: ['kehoach_th.select']
        },
        component: () => import('@/views/kehoach/thuchien')
      },
      {
        path: 'import',
        name: 'kehoach-import',
        props: true,
        meta: { desc: 'kehoach-import', auth: true, roles: ['kehoach.insert'] },
        component: () => import('@/views/kehoach/import')
      },
      {
        path: 'category',
        name: 'kehoach-category',
        props: true,
        meta: {
          desc: 'kehoach-category',
          auth: true,
          roles: ['category_kh.select']
        },
        component: () => import('@/views/kehoach/category_list')
      },
      {
        path: 'items',
        name: 'kehoach-items',
        props: true,
        meta: { desc: 'kehoach-items', auth: true, roles: ['items_kh.select'] },
        component: () => import('@/views/kehoach/items_list')
      },
      {
        path: 'baocao',
        name: 'kehoach-baocao',
        props: true,
        meta: { desc: 'kehoach-baocao', auth: true, roles: ['kehoach.select'] },
        component: () => import('@/views/kehoach/baocao')
      }
    ]
  },
  // {
  //   path: '/languages',
  //   name: 'languages',
  //   alias: '',
  //   // redirect: { name: 'languages-list' },
  //   component: () => import ('@/views/languages/index'),
  //   meta: { description: 'Overview of environment', requiresAuth: true },
  //   children: [{
  //       path: 'list',
  //       name: 'languages-list',
  //       props: true,
  //       component: () => import ('@/views/languages/list')
  //     },
  //     {
  //       path: 'add/:id?',
  //       name: 'languages-add',
  //       props: true,
  //       component: () => import ('@/views/languages/add')
  //     }
  //   ]
  // },
  {
    path: '/guide',
    name: 'guide',
    alias: '',
    // redirect: { name: 'category-list' },
    meta: { desc: 'guide', auth: true, roles: ['guide.select'] },
    component: () => import('@/views/guide/index'),
    children: [
    ]
  },
  {
    path: '/doanhthu',
    name: 'doanhthu',
    alias: '',
    // redirect: { name: 'category-list' },
    meta: { desc: 'doanhthu', auth: true, roles: ['doanhthu.select'] },
    component: () => import('@/views/doanhthu/index'),
    children: [
    ]
  },
  {
    // not found handler
    path: '*',
    name: 'not-found',
    alias: '',
    meta: { desc: 'Not found', auth: false, roles: ['*'] },
    component: () => import('@/views/not-found/index')
  }
];

// Routing logic
// console.log(process.env.NODE_ENV)
var router = new VueRouter({
  base: env.baseUrl[1], //process.env.NODE_ENV === 'production' ? 'portal' : '/',
  routes: routes,
  mode: 'history',
  linkExactActiveClass: 'active',
  scrollBehavior: function(to, from, savedPosition) {
    // console.log(router)
    // if(!store.state.auth.isAuth)
    // route.push('auth')
    // console.log(to, from)
    return savedPosition || { x: 0, y: 0 };
  }
});
// Some middleware to help us ensure the user is authenticated.
router.beforeEach((to, from, next) => {
  if (
    to.matched.some(record => record.meta.auth) &&
    !storageAuth.Authenticated()
  ) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    window.console.log('Not authenticated');
    next({ path: '/auth', query: { redirect: to.fullPath } });
  } else next();
});

export default router;
