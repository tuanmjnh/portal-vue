import Vue from 'vue'
import Vuex from 'vuex'
import { SET_MESSAGE, SET_CATCH } from './mutation-type'
import { vnptbkn } from '@/plugins/axios-config'
import * as _languages from '@/plugins/languages'
//
// import state from './state'
// import actions from './actions'
// import mutations from './mutations'
// modules
// import nav from './modules/nav'
import auth from './modules/auth'
import users from './modules/users'
import setting from './modules/setting'
import modules from './modules/modules'
import permissions from './modules/permissions'
import languages from './modules/languages'
import language_items from './modules/language_items'
import contract_customer from './modules/contract_customer'
import contract_enterprise from './modules/contract_enterprise'
Vue.use(Vuex)
export default new Vuex.Store({
  modules: {
    auth: auth,
    users: users,
    setting: setting,
    modules: modules,
    permissions: permissions,
    languages: languages,
    language_items: language_items,
    contract_customer: contract_customer,
    contract_enterprise: contract_enterprise
  },
  state: {
    _noimage: `Uploads/noimage.jpg`,
    _message: { show: false },
    $language_def: 'vi-VN',
    $language: _languages.GetLanguage(),
    $languages: _languages.GetLanguages(),
    // _language: 'vi-VN',
    // _language_items: JSON.parse(_store.Get('language'))
    // _axios: {
    //   vnptbkn: { host: vnptbkn.defaults.host, api: vnptbkn.defaults.api }
    // }
  }, // State
  getters: {}, // = computed properties
  actions: {
    message({ commit }, data) {
      commit(SET_MESSAGE, data)
    },
    messageClose({ state }, data) {
      state._message.show = data
    },
    async setLanguage({ commit, state }) {
      commit('SET_LANGUAGE', state.$language)
      await vnptbkn.get(`../Languages/${state.$language}.json`).then(function(res) {
          if (res.status == 200) {
            commit('SET_LANGUAGES', res.data)
            _languages.SetLanguage(state.$language)
            _languages.SetLanguages(JSON.stringify(res.data))
          } else commit(SET_CATCH, null)
        })
        .catch(function(error) { commit(SET_CATCH, error) })
    },
  }, // Actions
  mutations: {
    [SET_MESSAGE](state, res) {
      state._message = {
        mode: '',
        x: 'right',
        y: 'top',
        show: res.text ? true : false,
        timeout: 6000,
        color: res.color || 'success',
        text: res.text || '',
        status: res.status || 0,
        statusText: res.statusText || 'Error'
      }
    },
    [SET_CATCH](state, error) {
      if (!error.response) {
        console.log(error)
        return
      }
      if (error.response.status === 401) {
        this.dispatch('auth/logout')
        state._message = {
          mode: '',
          x: 'right',
          y: 'top',
          timeout: 6000,
          show: true,
          color: 'danger',
          text: 'Vui lòng đăng nhập lại!', // error.response ? error.response.statusText : error,
          status: error.response ? error.response.status : 0,
          statusText: error.response ? error.response.statusText : error
        }
      } else {
        state._message = {
          mode: '',
          x: 'right',
          y: 'top',
          timeout: 6000,
          show: true,
          color: 'danger',
          text: 'Không thể kết nối đến máy chủ, vui lòng thực hiện lại!', // error.response ? error.response.statusText : error,
          status: error.response ? error.response.status : 0,
          statusText: error.response ? error.response.statusText : error
        }
      }
      // state._message.show = true
      // console.log(state._message)
    },
    ['SET_LANGUAGE'](state, data) {
      state.$language = data ? data : state.$language_def
    },
    ['SET_LANGUAGES'](state, data) {
      state.$languages = data
    }
  } // Mutations
})

// import Vue from 'vue'
// import Vuex from 'vuex'
// import state from './state'
// import actions from './actions'
// import mutations from './mutations'

// Vue.use(Vuex)

// export default new Vuex.Store({
//   state,
//   actions,
//   mutations
// })
