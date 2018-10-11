import { SET_CATCH, SET_MESSAGE } from '../mutation-type'
import { vnptbkn } from '@/plugins/axios-config'
import * as _auth from '@/plugins/storage-auth'
const collection = 'auth'
export default {
  namespaced: true,
  state: {
    item: {},
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
      state.item = Object.assign({}, item)
    },
    'SET_DEFAULT'(state) {
      state.item = Object.assign({}, state.default)
    },
    'SET_ISAUTH'(state, val) {
      state.isAuth = val || false
    }
  },
  actions: {
    async login({ commit, state }) {
      await vnptbkn
        .post(collection, state.item)
        .then(function(res) {
          // commit auth
          if (res.data.data && res.data.token) {
            state.item.token = res.data.token
            _auth.SetAuth(state.item)
            commit('SET_ISAUTH', true)
          }
          // commit('SET_AUTH', { token: res.data.token, user: data.username, remember: data.remember })
          // commit message
          commit(SET_MESSAGE, res, { root: true })
        })
        .catch(function(error) { commit(SET_CATCH, error, { root: true }) }) // commit catch
    },
    async logout({ commit }) {
      _auth.RemoveAuth()
      commit('SET_ISAUTH')
      // commit('REMOVE_AUTH', {}, { root: true })
      var res = {
        data: { message: { type: 'danger', text: 'Đăng xuất thành công' } },
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
