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
import languages from './modules/languages'
import navigation from './modules/navigation'
import permissions from './modules/permissions'
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
    languages: languages,
    navigation: navigation,
    permissions: permissions,
    language_items: language_items,
    contract_customer: contract_customer,
    contract_enterprise: contract_enterprise
  },
  state: {
    $loadingApp: false,
    $loading: false,
    $noimage: `Uploads/noimage.jpg`,
    $message: { show: false },
    $language_def: 'vi-VN',
    $language: _languages.GetLanguage(),
    $languages: _languages.GetLanguages(),
    // _language: 'vi-VN',
    // _language_items: JSON.parse(_store.Get('language'))
    // _axios: {
    //   vnptbkn: { host: vnptbkn.defaults.host, api: vnptbkn.defaults.api }
    // }
  }, // State
  getters: {
    languages: state => key => {
      if (!key || key.length < 1) return
      // console.log(key)
      // const _key = key.toLowerCase().split('|') //.split('.')
      if (typeof key === 'string') key = [key]
      var regx = /:([^"]+)/g
      let rs = ''
      for (let index = 0; index < key.length; index++) {
        const e = key[index].toLowerCase().split('.')
        if (e.length < 2) {
          const e0 = e[0].split(':')
          if (!state.$languages[e0[0]]) rs += key[index]
          else rs += (index > 0 ? state.$languages[e0[0]].toLowerCaseFirst() : state.$languages[e0[0]])
          if (e0.length > 1) rs = rs.format(e0[1])
        } else if (e.length < 3) {
          const e1 = e[1].split(':')
          // if (e1.length > 1) e[1] = e1[0]
          if (!state.$languages[e[0]] || !state.$languages[e[0]][e1[0]]) rs += key[index]
          else rs += (index > 0 ? state.$languages[e[0]][e1[0]].toLowerCaseFirst() : state.$languages[e[0]][e1[0]])
          if (e1.length > 1) rs = rs.format(e1[1].split(','), 'ff')
        }
        // if (regx.exec(key[index])) 
        // regx.exec(key[index])[1].forEach(element => {

        // });
        // if (regx.exec(key[index])) {
        //   rs = rs.format(regx.exec(key[index])[1].split(','))
        // }
      }
      // _key.forEach(e => {
      //   const _tmp = e.split('.')
      //   if (_tmp.length < 2) {
      //     if (!state.$languages[_tmp[0]]) rs += e
      //     else rs += state.$languages[_tmp[0]]
      //   } else if (_tmp.length < 3) {
      //     if (!state.$languages[_tmp[0]][_tmp[1]]) rs += e
      //     else rs += state.$languages[_tmp[0]][_tmp[1]]
      //   }
      // });
      return rs
    }
    // languages: state => key => {
    //   const _key = key.split('.')
    //   if (!state.$languages[_key[0]]) return key
    //   var rs = _key.length > 0 ? state.$languages[_key[0]] : key
    //   //
    //   if (!state.$languages[_key[0]][_key[1]]) return key
    //   rs = _key.length > 1 ? state.$languages[_key[0]][_key[1]] : key
    //   return rs
    // }
  }, // = computed properties
  actions: {
    message({ commit }, data) {
      commit(SET_MESSAGE, data)
    },
    messageClose({ state }, data) {
      state.$message.show = data
    },
    async setLanguage({ commit, state }) {
      // Data Items
      state.$loadingApp = true
      let lang_data = {}
      commit('SET_LANGUAGE', state.$language)
      // commit('SET_LANGUAGES', lang_data)
      await vnptbkn.get(`language-items/getlang/${state.$language}`).then(function(res) {
          if (res.status == 200) {
            _languages.SetLanguage(state.$language)
            if (res.data.data) {
              res.data.data.forEach(e => {
                if (!lang_data[e.module_code] || lang_data[e.module_code] === undefined) lang_data[e.module_code] = {}
                Object.assign(lang_data[e.module_code], JSON.parse(`{"${e.key}":"${e.value}"}`))
              });
              commit('SET_LANGUAGES', lang_data)
              // state.$languages = _languages.GetLanguages()
              _languages.SetLanguages(lang_data).then(state.$loadingApp = false)
            }
          } else commit(SET_CATCH, null)
        })
        .catch(function(error) { commit(SET_CATCH, error) })

      // Data Json
      // commit('SET_LANGUAGE', state.$language)
      // await vnptbkn.get(`language-items/getlang/${state.$language}`).then(function(res) {
      //     if (res.status == 200) {
      //       let lang_data = ''
      //       _languages.SetLanguage(state.$language)
      //       if (res.data.data && res.data.data.length > 0)
      //         lang_data = res.data.data[0].lang_data
      //       _languages.SetLanguages(lang_data)
      //       state.$languages = _languages.GetLanguages()
      //     } else commit(SET_CATCH, null)
      //   })
      //   .catch(function(error) { commit(SET_CATCH, error) })

      // Json File
      // await vnptbkn.get(`../Languages/${state.$language}.json`).then(function(res) {
      //     if (res.status == 200) {
      //       commit('SET_LANGUAGES', res.data)
      //       _languages.SetLanguage(state.$language)
      //       _languages.SetLanguages(JSON.stringify(res.data))
      //     } else commit(SET_CATCH, null)
      //   })
      //   .catch(function(error) { commit(SET_CATCH, error) })
    },
    async ['TEST']({ commit, state, getters }) {
      var error = {}
      error.response = { status: 401 }
      // console.log(getters.languages('auth.msg_err_expired'))
      await commit(SET_CATCH, error)
    }
  }, // Actions
  mutations: {
    [SET_MESSAGE](state, res) {
      state.$message = {
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
        let text = state.$languages.auth && state.$languages.auth.msg_err_expired ?
          state.$languages.auth.msg_err_expired :
          error.response ? error.response.statusText : error
        state.$message = {
          mode: '',
          x: 'right',
          y: 'top',
          timeout: 6000,
          show: true,
          color: 'danger',
          text: text,
          status: error.response ? error.response.status : 0,
          statusText: error.response ? error.response.statusText : error
        }
      } else {
        let text = state.$languages.messages && state.$languages.messages.err_connection ?
          state.$languages.messages.err_connection :
          error.response ? error.response.statusText : error
        state.$message = {
          mode: '',
          x: 'right',
          y: 'top',
          timeout: 6000,
          show: true,
          color: 'danger',
          text: text,
          status: error.response ? error.response.status : 0,
          statusText: error.response ? error.response.statusText : error
        }
      }
      // state.$message.show = true
      // console.log(state.$message)
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
