import { SET_CATCH, SET_MESSAGE } from '../mutation-type'
import { vnptbkn, setHeaderAuth } from '@/plugins/axios-config'
import * as storageAuth from '@/plugins/storage-auth'
import router from '@/router'
const collection = 'auth'
export default {
  namespaced: true,
  state: {
    item: {},
    user: {},
    isAuth: false,
    default: {
      ma_nd: '',
      matkhau: '',
      // username: '',
      // password: '',
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
    },
    'SET_USER'(state, user) {
      state.user = { ...user }
      state.user.roles = state.user.roles.trim(',').split(',')
    }
  },
  actions: {
    async signIn({ commit, state, rootGetters, rootState }, loading = false) {
      // Loading
      if (loading) rootState.$loadingApp = true
      // http
      await vnptbkn.post(collection, state.item).then(function(res) {
        // commit auth
        if (res.data.data && res.data.token) {
          commit('SET_USER', res.data.data)
          storageAuth.signIn({
            uid: res.data.data.nguoidung_id,
            token: `Bearer ${res.data.token}`,
            remember: state.item.remember,
            // account: res.data.data.ma_nd,
            // name: res.data.data.ten_nd
          })
          commit('SET_ISAUTH', true)
        }
        // commit('SET_AUTH', { token: res.data.token, user: data.username, remember: data.remember })
        // commit message
        if (res.data.message == 'danger') {
          res.color = 'danger'
          res.text = rootGetters.languages('error.connection')
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
      }).catch(function(error) {
        commit(SET_CATCH, error, { root: true })
      }).finally(() => { setTimeout(() => { rootState.$loadingApp = false }, 200) })
    },
    async signOut({ commit, rootGetters, rootState }, loading = false) {
      // Loading
      if (loading) rootState.$loadingApp = true
      // Action
      // commit('REMOVE_AUTH', {}, { root: true })
      storageAuth.signOut()
      commit('SET_ISAUTH')
      var res = {
        color: 'success',
        text: rootGetters.languages('auth.msg_suc_logout'),
        status: 200,
        statusText: 'OK'
      }
      commit(SET_MESSAGE, res, { root: true })
      setTimeout(() => {
        rootState.$loadingApp = false
        router.push('/auth')
      }, 200)
    },
    async setIsAuth({ commit, state }, val = false) {
      commit('SET_ISAUTH', val)
      if (val) {
        await vnptbkn.get(`nguoidung/${storageAuth.GetUid()}`).then(function(res) {
          if (res.data.data) commit('SET_USER', res.data.data)
        })
      }
    },
    async item({ commit }, data = null) {
      if (data) commit('SET_ITEM', data)
      else commit('SET_DEFAULT')
    },
    async get({ commit }, data) {
      await vnptbkn.get(collection, data).then(function(res) {
        commit(SET_MESSAGE, res, { root: true })
      }).catch(function(error) { commit(SET_CATCH, error, { root: true }) }) // commit catch
    }
  }
}
