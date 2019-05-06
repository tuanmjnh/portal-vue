import Vue from 'vue'
import Vuex from 'vuex'
import { vnptbkn } from '@/plugins/axios-config'
import TMLanguage from '@/languages'
// import * as TMLanguage from '@/languages/languages'
// import state from './state'
// import actions from './actions'
// import mutations from './mutations'
// modules
// import nav from './modules/nav'
import auth from './modules/auth'
import news from './modules/news'
// import users from './modules/users'
import donvi from './modules/donvi'
import roles from './modules/roles'
import app_key from './modules/app_key'
import setting from './modules/setting'
import modules from './modules/modules'
import category from './modules/category'
import nguoidung from './modules/nguoidung'
import languages from './modules/languages'
import dictionary from './modules/dictionary'
import navigation from './modules/navigation'
import permissions from './modules/permissions'
import notification from './modules/notification'
import informations from './modules/informations'
import contract_customer from './modules/contract_customer'
import contract_enterprise from './modules/contract_enterprise'
import kehoach from './modules/kehoach'
Vue.use(Vuex)
export default new Vuex.Store({
  modules: {
    auth: auth,
    news: news,
    donvi: donvi,
    roles: roles,
    app_key: app_key,
    modules: modules,
    setting: setting,
    category: category,
    nguoidung: nguoidung,
    languages: languages,
    dictionary: dictionary,
    navigation: navigation,
    permissions: permissions,
    notification: notification,
    informations: informations,
    contract_customer: contract_customer,
    contract_enterprise: contract_enterprise,
    kehoach: kehoach
  },
  state: {
    $loadingApp: false,
    $loadingGet: false,
    $loadingCommit: false,
    $noimage: `Uploads/noimage.jpg`,
    $message: {
      mode: '',
      x: 'right',
      y: 'top',
      timeout: 6000,
      show: false,
      color: 'success',
      text: ''
    },
    $language: TMLanguage.getLang('vi-VN'),
    //$dictionary: TMLanguage.GetDictionary(),
    // $dictionary: TMLanguage.GetDictionary(),
    $notification: false,
    $row_per_page: [10, 25, 50, 100, 200, 500], //  { text: "All", value: -1 }
    // _language: 'vi-VN',
    // _dictionary: JSON.parse(_store.Get('language'))
    // _axios: {
    //   vnptbkn: { host: vnptbkn().defaults.host, api: vnptbkn().defaults.api }
    // }
  }, // State
  getters: {
    languages: state => key => {
      return TMLanguage.get(key)
    }
    // languages: state => key => {
    //   if (!key || key.length < 1) return
    //   // console.log(key)
    //   // const _key = key.toLowerCase().split('|') //.split('.')
    //   if (typeof key === 'string') key = [key]
    //   var regx = /:([^"]+)/g
    //   let rs = ''
    //   for (let index = 0; index < key.length; index++) {
    //     if (!state.$dictionary) return key[index]
    //     const e = key[index].toLowerCase().split('.')
    //     if (e.length < 2) {
    //       const e0 = e[0].split(':')
    //       if (!state.$dictionary[e0[0]]) rs += key[index]
    //       else rs += (index > 0 ? state.$dictionary[e0[0]].toLowerCaseFirst() : state.$dictionary[e0[0]])
    //       if (e0.length > 1) rs = rs.format(e0[1])
    //     } else if (e.length < 3) {
    //       const e1 = e[1].split(':')
    //       // if (e1.length > 1) e[1] = e1[0]
    //       if (!state.$dictionary[e[0]] || !state.$dictionary[e[0]][e1[0]]) rs += key[index]
    //       else rs += (index > 0 ? state.$dictionary[e[0]][e1[0]].toLowerCaseFirst() : state.$dictionary[e[0]][e1[0]])
    //       if (e1.length > 1) rs = rs.format(e1[1].split(','), 'ff')
    //     }
    //     // if (regx.exec(key[index])) 
    //     // regx.exec(key[index])[1].forEach(element => {

    //     // });
    //     // if (regx.exec(key[index])) {
    //     //   rs = rs.format(regx.exec(key[index])[1].split(','))
    //     // }
    //   }

    // _key.forEach(e => {
    //   const _tmp = e.split('.')
    //   if (_tmp.length < 2) {
    //     if (!state.$dictionary[_tmp[0]]) rs += e
    //     else rs += state.$dictionary[_tmp[0]]
    //   } else if (_tmp.length < 3) {
    //     if (!state.$dictionary[_tmp[0]][_tmp[1]]) rs += e
    //     else rs += state.$dictionary[_tmp[0]][_tmp[1]]
    //   }
    // });
    // return rs
    // }
    // languages: state => key => {
    //   const _key = key.split('.')
    //   if (!state.$dictionary[_key[0]]) return key
    //   var rs = _key.length > 0 ? state.$dictionary[_key[0]] : key
    //   //
    //   if (!state.$dictionary[_key[0]][_key[1]]) return key
    //   rs = _key.length > 1 ? state.$dictionary[_key[0]][_key[1]] : key
    //   return rs
    // }
  }, // = computed properties
  mutations: {
    ['SET_MESSAGE'](state, res) {
      state.$message = {
        mode: '',
        x: 'right',
        y: 'top',
        show: res.text ? true : false,
        timeout: 6000,
        color: res.color || 'success',
        text: res.text || ''
      }
    },
    SET_CATCH(state, error) {
      state.$message.mode = ''
      state.$message.x = 'right'
      state.$message.y = 'top'
      state.$message.timeout = 6000
      state.$message.text = TMLanguage.get('error.connection')
      // state.$message.text = state.$dictionary.error && state.$dictionary.error.connection ?
      //   state.$dictionary.error.connection : error.message
      if (!error.response) {
        console.log(error.message) // Network Error
      } else if (error.response.status === 401) {
        this.dispatch('auth/signOut')
        state.$message.text = TMLanguage.get('auth.msg_err_expired')
        // state.$message.text = state.$dictionary.auth && state.$dictionary.auth.msg_err_expired ?
        //   state.$dictionary.auth.msg_err_expired :
        //   error.response ? error.response.statusText : error
        console.log(error.response.statusText)
      }
      state.$message.color = 'danger'
      state.$message.show = true
    },
    SET_LANGUAGE(state, data) {
      state.$language = data // ? data : state.$language_def
    },
    SET_DICTIONARY(state, data) {
      state.$dictionary = data
    }
  }, // Mutations
  actions: {
    message({ commit }, data) {
      commit('SET_MESSAGE', data)
    },
    messageClose({ state }, data) {
      state.$message.show = data
    },
    async setLanguage({ commit, state }) {
      // Data Items
      state.$loadingApp = true
      // let lang_data = {}
      state.$loadingApp = false
      // commit('SET_LANGUAGE', state.$language)
      // TMLanguage.SetLanguage(state.$language)

      // async setLanguage({ commit, state }) {
      //   // Data Items
      //   state.$loadingApp = true
      //   let lang_data = {}
      //   commit('SET_LANGUAGE', state.$language)
      //   // commit('SET_DICTIONARY', lang_data)
      //   await vnptbkn().get(`dictionary/GetByLanguage/${state.$language}`).then(function (res) {
      //     if (res.status == 200) {
      //       TMLanguage.SetLanguage(state.$language)
      //       if (res.data.data) {
      //         res.data.data.forEach(e => {
      //           if (!lang_data[e.module_code] || lang_data[e.module_code] === undefined) lang_data[e.module_code] = {}
      //           Object.assign(lang_data[e.module_code], JSON.parse(`{"${e.key}":"${e.value}"}`))
      //         });
      //         commit('SET_DICTIONARY', lang_data)
      //         // state.$dictionary = TMLanguage.GetDictionary()
      //         TMLanguage.SetDictionary(lang_data)// .then(state.$loadingApp = false)
      //       }
      //     } else commit('SET_CATCH', null)
      //   }).catch((err) => {
      //     commit('SET_CATCH', err)
      //   }).finally(() => {
      //     state.$loadingApp = false
      //   })

      // Data Json
      // commit('SET_LANGUAGE', state.$language)
      // await vnptbkn().get(`dictionary/getlang/${state.$language}`).then(function(res) {
      //     if (res.status == 200) {
      //       let lang_data = ''
      //       TMLanguage.SetLanguage(state.$language)
      //       if (res.data.data && res.data.data.length > 0)
      //         lang_data = res.data.data[0].lang_data
      //       TMLanguage.SetDictionary(lang_data)
      //       state.$dictionary = TMLanguage.GetDictionary()
      //     } else commit('SET_CATCH', null)
      //   })
      //   .catch(function(error) { commit('SET_CATCH', error) })

      // Json File
      // await vnptbkn().get(`../Languages/${state.$language}.json`).then(function(res) {
      //     if (res.status == 200) {
      //       commit('SET_DICTIONARY', res.data)
      //       TMLanguage.SetLanguage(state.$language)
      //       TMLanguage.SetDictionary(JSON.stringify(res.data))
      //     } else commit('SET_CATCH', null)
      //   })
      //   .catch(function(error) { commit('SET_CATCH', error) })
    },
    notification({ state }) {
      state.$notification = !state.$notification
    },
    async ['TEST']({ commit, state, getters }) {
      var error = {}
      error.response = { status: 401 }
      // console.log(getters.languages('auth.msg_err_expired'))
      await commit('SET_CATCH', error)
    }
  } // Actions
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
