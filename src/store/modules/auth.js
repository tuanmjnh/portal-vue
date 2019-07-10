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
  getters: {
    inRoles: state => quyen => {
      if (!state.user.quyen) return false
      return state.user.quyen.indexOf(quyen) < 0 ? false : true
    },
  },
  mutations: {
    'SET_ITEM'(state, item) {
      state.item = item ? { ...item } : { ...state.default }
    },
    'SET_DEFAULT'(state) {
      state.item = { ...state.default }
    },
    'SET_ISAUTH'(state, val) {
      state.isAuth = val || false
    },
    'SET_USER'(state, user) {
      state.user = { ...user }
      if (state.user.quyen) state.user.quyen = state.user.quyen.trim(',').split(',')
    }
  },
  actions: {
    async signIn({ commit, state, rootGetters, rootState }, loading = true) {
      // Loading
      if (loading) rootState.$loadingApp = true
      // http
      await vnptbkn().post(collection, state.item).then(function(res) {
        // commit auth
        if (res.status === 200) {
          if (res.data.msg) {
            res.color = 'danger'
            res.text = rootGetters.languages('auth.msg_err_login')
          } else {
            storageAuth.signIn({
              uid: res.data.nguoidung_id,
              token: `Bearer ${res.data.token}`,
              remember: state.item.remember,
              // account: res.data.data.ma_nd,
              // name: res.data.data.ten_nd
            })
            commit('SET_USER', res.data)
            commit('SET_ISAUTH', true)
          }
        } else if (res.status === 401) {
          if (res.data.msg == 'locked') {
            res.color = 'danger'
            res.text = rootGetters.languages('auth.msg_login_locked')
          }
          else {
            res.color = 'danger'
            res.text = rootGetters.languages('auth.msg_err_login')
          }
        } else {
          res.color = 'danger'
          res.text = rootGetters.languages('error.connection')
        }
        commit('SET_MESSAGE', res, { root: true })
        // setHeaderAuth()
      }).catch(function(error) { commit('SET_CATCH', error, { root: true }) })
        .finally(() => { setTimeout(() => { rootState.$loadingApp = false }, 200) })
    },
    async signOut({ commit, rootGetters, rootState }, loading = true) {
      // Loading
      if (loading) rootState.$loadingApp = true
      // Action
      // commit('REMOVE_AUTH', {}, { root: true })
      storageAuth.signOut()
      commit('SET_ISAUTH')
      // var res = {
      //   color: 'success',
      //   text: rootGetters.languages('auth.msg_suc_logout'),
      //   status: 200,
      //   statusText: 'OK'
      // }
      // commit('SET_MESSAGE', res, { root: true })
      setTimeout(() => {
        rootState.$loadingApp = false
        router.push({ path: '/auth', query: { redirect: router.currentRoute.fullPath } })
      }, 200)
    },
    async setIsAuth({ commit, state }, val = false) {
      commit('SET_ISAUTH', val)
      if (val) {
        await vnptbkn().get(`auth/${storageAuth.GetUid()}`).then(function(res) {
          if (res.data) commit('SET_USER', res.data)
        }).catch(function(error) { commit('SET_CATCH', error, { root: true }) }) // commit catch
          .finally(() => { })
      }
    },
    async get({ commit }, data) {
      await vnptbkn().get(collection, data).then(function(res) {
        commit('SET_MESSAGE', res, { root: true })
      }).catch(function(error) { commit('SET_CATCH', error, { root: true }) }) // commit catch
        .finally(() => { })
    }
  }
}
