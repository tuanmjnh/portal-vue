import '@babel/polyfill'
import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
// jQuery
import $ from 'jquery';
window.jQuery = $;
window.$ = $;
// Helpers
import helpers from './plugins/helpers'
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
