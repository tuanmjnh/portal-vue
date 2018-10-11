import Vue from 'vue'
import Vuex from 'vuex'
import { SET_MESSAGE, SET_CATCH } from './mutation-type'
//
// import state from './state'
// import actions from './actions'
// import mutations from './mutations'
// modules
// import nav from './modules/nav'
import auth from './modules/auth'
import users from './modules/users'
import languages from './modules/languages'
import languages_items from './modules/languages_items'
Vue.use(Vuex)
export default new Vuex.Store({
  modules: {
    auth,
    users,
    languages,
    languages_items
  },
  state: {
    _noimage: `Uploads/noimage.jpg`,
    _message: { show: false },
  }, // State
  getters: {}, // = computed properties
  actions: {
    message({ commit }, data) { commit(SET_MESSAGE, data) },
    messageClose({ state }, data) { state._message.show = data }
  }, // Actions
  mutations: {
    [SET_MESSAGE](state, res) {
      state._message = {
        mode: '',
        x: 'right',
        y: 'top',
        show: res.text ? true : false,
        timeout: 6000,
        color: res.color || '',
        text: res.text || '',
        status: res.status || 0,
        statusText: res.statusText || 'Error',
      }
    },
    [SET_CATCH](state, error) {
      // if (error.response.status === 401) this.dispatch('auth/logout')
      state._message = {
        mode: '',
        x: 'right',
        y: 'top',
        show: true,
        timeout: 6000,
        color: 'danger',
        text: 'Không thể kết nối đến máy chủ, vui lòng thực hiện lại!', // error.response ? error.response.statusText : error,
        status: error.response ? error.response.status : 0,
        statusText: error.response ? error.response.statusText : error
      }
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
