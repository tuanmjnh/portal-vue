import '@babel/polyfill'
import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
// jQuery
// import $ from 'jquery';
// window.jQuery = $;
// window.$ = $;
// // Storage
// import * as Storage from './plugins/storage'
// dataType
// import dataType from './plugins/data-type'
// Helpers
import helpers from './plugins/helpers'
// Local IP
import localIP from './plugins/local-ip'
// Mixins
import mixins from './plugins/mixins'
// Store
import store from './store'
// Router
import router from './router'
// Filters
import filters from './plugins/filters'
// Directive
import directive from './plugins/directive'
// Languages
import languages from './languages'
Vue.prototype.$languages = languages
// VeeValidate
// import veeValidate from './plugins/vee-validate'
// import * as _store from '@/plugins/storage'
// console.log(JSON.parse(_store.Get('language')))
// Components
Vue.config.productionTip = false
let app
// FBAuth.onAuthStateChanged(user => {
// store.commit("auth/authUpdate", user)
// console.log(user)
if (!app) {
  app = new Vue({
    mixins,
    store,
    router,
    render: h => h(App)
  }).$mount('#app')
}
// })
