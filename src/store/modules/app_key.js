import { vnptbkn } from '@/plugins/axios-config'
const collection = 'appkey'
export default {
  namespaced: true,
  state: {
    items: [],
    item: {},
    selected: [],
    dialog: false,
    isGetFirst: true,
    pagination: {
      search: '',
      sortBy: 'title',
      descending: false,
      toggle: 0,
      flag: 1,
      page: 1,
      rowsPerPage: 10
    },
    default: {
      app_key: 'news',
      title: '',
      flag: 1
    }
  },
  getters: {
    getAll(state) {
      return state.items
    },
    getById: state => id => {
      return state.items.find(x => x.id === id)
    },
    getFilter: state => pagination => {
      let rs = [...state.items]
      if (pagination && pagination.find) rs = rs.filterValue(pagination.find)
      else rs = rs.filterValue(state.pagination.find)
      if (pagination && pagination.search) rs = rs.searchValue(pagination.search)
      else rs = rs.searchValue(state.pagination.search)
      if (pagination && pagination.sortBy) rs = rs.sortByKey(pagination.sortBy)
      else rs = rs.sortByKey(state.pagination.sortBy)
      return rs
    },
  },
  mutations: {
    SET_ITEMS(state, items) {
      state.items = items
    },
    SET_ITEM(state, item) {
      state.item = item ? { ...item } : { ...state.default }
    },
    PUSH_ITEMS(state, item) {
      state.items.push(item)
    },
    UPDATE_ITEMS(state, item) {
      state.items.update(item, 'app_key')
    },
    REMOVE_ITEMS(state, item) {
      state.items.remove(item, 'app_key')
    }
  },
  actions: {
    async select({ commit, rootGetters, state, rootState }, isExport = false, pagination = null, loading = true) {
      // Loading
      if (loading) rootState.$loadingGet = true
      // http
      return await vnptbkn().get(collection, { params: pagination ? pagination : { ...state.pagination, ...{ isExport: isExport } } }).then(function (res) {
        if (res.status === 200) {
          if (res.data.msg === 'error_token') {
            commit('SET_CATCH', { response: { status: 401 } }, { root: true })
            return
          }
          if (res.data.msg === 'danger') {
            commit('SET_MESSAGE', { text: rootGetters.languages('error.data'), color: res.data.msg }, { root: true })
            return
          }
          if (res.data.data) commit('SET_ITEMS', res.data.data)
          if (res.data.total) state.totalItems = res.data.total
          return res.data.data
        } else commit('SET_CATCH', null, { root: true })
      }).catch((error) => { commit('SET_CATCH', error, { root: true }) }).finally(() => {
        state.isGetFirst = false
        if (loading) rootState.$loadingGet = false
      })
    },
    async insert({ commit, state, rootGetters, rootState }, loading = true) {
      // Loading
      if (loading) rootState.$loadingCommit = true
      // http
      state.item.created_by = vnptbkn().defaults.headers.Author
      state.item.created_at = new Date()
      //state.item.url_plus = JSON.stringify(state.url_plus)
      await vnptbkn().post(collection, state.item).then(function (res) {
        if (res.status == 200) {
          if (res.data.msg === 'error_token') {
            commit('SET_CATCH', { response: { status: 401 } }, { root: true })
            return
          }
          if (res.data.msg === 'exist') {
            commit('SET_MESSAGE', { text: rootGetters.languages('modules.err_exist'), color: 'warning' }, { root: true })
            return
          }
          if (res.data.msg === 'danger') {
            commit('SET_MESSAGE', { text: rootGetters.languages('error.data'), color: res.data.msg }, { root: true })
            return
          }
          // Success
          commit('SET_ITEM')
          commit('PUSH_ITEMS', res.data.data)
          commit('SET_MESSAGE', { text: rootGetters.languages('success.add'), color: res.data.msg }, { root: true })
          state.url_plus = { push: '', go: '', store: '' }
        } else { commit('SET_CATCH', null, { root: true }) }
      }).catch((error) => {
        commit('SET_CATCH', error, { root: true })
      }).finally(() => {
        if (loading) rootState.$loadingCommit = false
      })
    },
    async update({ commit, state, rootGetters, rootState }, loading = true) {
      // Loading
      if (loading) rootState.$loadingCommit = true
      // http
      state.item.updated_by = vnptbkn().defaults.headers.Author
      state.item.updated_at = new Date()
      // state.item.url_plus = JSON.stringify(state.url_plus)
      await vnptbkn().put(collection, state.item).then(function (res) {
        if (res.status == 200) {
          if (res.data.msg === 'error_token') {
            commit('SET_CATCH', { response: { status: 401 } }, { root: true })
            return
          }
          if (res.data.msg === 'danger') {
            commit('SET_MESSAGE', { text: rootGetters.languages('error.data'), color: res.data.msg }, { root: true })
            return
          }
          // Success
          commit('UPDATE_ITEMS', state.item)
          commit('SET_MESSAGE', { text: rootGetters.languages('success.update'), color: res.data.msg }, { root: true })
        } else commit('SET_CATCH', null, { root: true })
      }).catch((error) => {
        commit('SET_CATCH', error, { root: true })
      }).finally(() => {
        if (loading) rootState.$loadingCommit = false
      })
    },
    async delete({ commit, state, rootGetters, rootState }, loading = true) {
      // Loading
      if (loading) rootState.$loadingCommit = true
      // http
      const data = state.selected.map(x => ({ id: x.id, flag: x.flag === 0 ? 1 : 0 }))
      await vnptbkn().put(collection + '/delete', data).then(function (res) {
        if (res.status == 200) {
          if (res.data.msg === 'error_token') {
            commit('SET_CATCH', { response: { status: 401 } }, { root: true })
            return
          }
          if (res.data.msg === 'danger') {
            commit('SET_MESSAGE', { text: rootGetters.languages('error.data'), color: res.data.msg }, { root: true })
            return
          }
          // Success
          //state.selected.forEach(e => { commit(UPDATE_ITEMS, e) });
          state.selected.update(data, 'id')
          state.selected = []
          commit('SET_ITEM')
          commit('SET_MESSAGE', { text: rootGetters.languages('success.delete'), color: res.data.msg }, { root: true })
        } else commit('SET_CATCH', null, { root: true })
      }).catch((error) => {
        commit('SET_CATCH', error, { root: true })
      }).finally(() => {
        if (loading) rootState.$loadingCommit = false
      })
    },
    async remove({ commit, state, rootGetters, rootState }, loading = true) {
      // Loading
      if (loading) rootState.$loadingCommit = true
      // http
      await vnptbkn().delete(collection, state.item).then(function (res) {
        if (res.status == 200) {
          if (res.data.msg === 'error_token') {
            commit('SET_CATCH', { response: { status: 401 } }, { root: true })
            return
          }
          if (res.data.msg === 'danger') {
            commit('SET_MESSAGE', { text: rootGetters.languages('error.data'), color: res.data.msg }, { root: true })
            return
          }
          // Success
          commit('REMOVE_ITEMS', state.item)
          commit('SET_ITEM')
          commit('SET_MESSAGE', { text: rootGetters.languages('success.delete'), color: res.data.msg }, { root: true })
        } else commit('SET_CATCH', null, { root: true })
      }).catch((error) => {
        commit('SET_CATCH', error, { root: true })
      }).finally(() => {
        if (loading) rootState.$loadingCommit = false
      })
    },
    open_dialog({ state }) {
      state.dialog = true
    }
  }
}
