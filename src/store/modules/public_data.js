import { vnptbkn } from '@/plugins/axios-config'
const collection = 'public_data'
export default {
  namespaced: true,
  state: {
    languages: []
  },
  getters: {
    GetLanguages: state => {
      return state.languages.filterValue({ flag: 1 }).sortByKey('orders')
    },
    GetNavigation: state => filter => {
      let items = state.items
        .filter(row => { return row.flag === 1 })
        .filter(row => { return row.app_key === filter.position })
      if (filter.roles && filter.roles.length > 0)
        items = items.filter(row => { return filter.roles.indexOf(row.url) > -1 })
      const rs = items
        .filter(row => { return row.dependent.indexOf(',0,') > -1 })
        .sortByKey('orders')
      // get children
      rs.forEach(e => {
        const _child = items.filter(row => { return row.dependent.indexOf(`,${e.id},`) > -1 })
        if (_child) _child.forEach(ee => {
          ee.children = items.filter(row => { return row.dependent.indexOf(`,${ee.id},`) > -1 })
        })
        e.children = _child
      })
      return rs
    }
  },
  mutations: {},
  actions: {
    async GetLanguages({ commit, state, rootGetters, rootState }, loading = true) {
      // Loading
      if (loading) rootState.$loadingGet = true
      // http
      await vnptbkn().get(`${collection}/GetLanguages`).then(function (res) {
        if (res.status === 200) {
          if (res.data.msg === 'danger') {
            commit('SET_MESSAGE', { text: rootGetters.languages('error.data'), color: res.data.msg }, { root: true })
            return
          }
          if (res.data.data) state.languages = res.data.data
        } else commit('SET_CATCH', null, { root: true })
      }).catch(function (error) { commit('SET_CATCH', error, { root: true }) })
        .finally(() => {
          state.isGetFirst = false
          if (loading) rootState.$loadingGet = false
        })
    },
    async GetNavigation({ commit, rootGetters, state, rootState }, loading = true) {
      // Loading
      if (loading) rootState.$loadingGet = true
      // http
      await vnptbkn().get(collection).then(function (res) {
        if (res.status === 200) {
          if (res.data.msg === 'danger') {
            commit('SET_MESSAGE', { text: rootGetters.languages('error.data'), color: res.data.msg }, { root: true })
            return
          }
          if (res.data.data) {
            // res.data.data.forEach(e => { e.url_plus = e.url_plus ? JSON.parse(e.url_plus) : state.url_plus });
            commit('SET_ITEMS', res.data.data.sortByKey('orders').sortByKey('parent_id'))
          }
        } else commit('SET_CATCH', null, { root: true })
      }).catch(function (error) { commit('SET_CATCH', error, { root: true }) })
        .finally(() => {
          state.isGetFirst = false
          if (loading) rootState.$loadingGet = false
        })
    }
  }
}