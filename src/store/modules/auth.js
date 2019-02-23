import { SET_CATCH, SET_MESSAGE } from '../mutation-type'
import { vnptbkn, setHeaderAuth } from '@/plugins/axios-config'
import * as _auth from '@/plugins/storage-auth'
const collection = 'auth'
export default {
  namespaced: true,
  state: {
    item: {},
    user: {},
    isAuth: false,
    default: {
      username: '',
      password: '',
      token: '',
      remember: false
    }
  },
  getters: {},
  mutations: {
    'SET_ITEM'(state, item) {
      state.item = { ...item }
    },
    'SET_DEFAULT'(state) {
      state.item = { ...state.default }
    },
    'SET_ISAUTH'(state, val) {
      state.isAuth = val || false
    }
  },
  actions: {
    async login({ commit, state, rootGetters }) {
      await vnptbkn
        .post(collection, state.item)
        .then(function(res) {
          // commit auth
          if (res.data.data && res.data.token) {
            state.user = { ...res.data.data }
            state.item.token = res.data.token
            state.item.full_name = res.data.data.full_name
            _auth.SetAuth(state.item)
            commit('SET_ISAUTH', true)
          }
          // commit('SET_AUTH', { token: res.data.token, user: data.username, remember: data.remember })
          // commit message
          if (res.data.message == 'danger') {
            res.color = 'danger'
            res.text = rootGetters.languages('global.err_connection')
          } else if (res.data.message == 'locked') {
            res.color = 'danger'
            res.text = rootGetters.languages('auth.msg_login_locked')
          }
          // else if (res.data.message == 'null') {
          //   res.color = 'danger'
          //   res.text = 'Tài khoản không tồn tại!'
          // }
          else if (res.data.message == 'success') {
            res.color = 'success'
            res.text = rootGetters.languages('auth.msg_suc_login')
          } else {
            res.color = 'danger'
            res.text = rootGetters.languages('auth.msg_err_login')
          }
          commit(SET_MESSAGE, res, { root: true })
          setHeaderAuth()
        })
        .catch(function(error) { commit(SET_CATCH, error, { root: true }) }) // commit catch
    },
    async logout({ commit, rootGetters }) {
      _auth.RemoveAuth()
      commit('SET_ISAUTH')
      // commit('REMOVE_AUTH', {}, { root: true })
      var res = {
        data: { message: { type: 'danger', text: rootGetters.languages('auth.msg_suc_logout') } },
        status: 200,
        statusText: 'OK'
      }
      commit(SET_MESSAGE, res, { root: true })
    },
    async setIsAuth({ commit }, val = false) {
      commit('SET_ISAUTH', val)
    },
    async item({ commit }, data = null) {
      if (data) commit('SET_ITEM', data)
      else commit('SET_DEFAULT')
    },
    async get({ commit }, data) {
      await vnptbkn
        .get(collection, data)
        .then(function(res) {
          // commit message
          commit(SET_MESSAGE, res, { root: true })
        })
        .catch(function(error) { commit(SET_CATCH, error, { root: true }) }) // commit catch
    }
  }
}
