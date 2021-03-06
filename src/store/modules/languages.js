import { vnptbkn } from '@/plugins/axios-config'
const collection = 'languages'
export default {
  namespaced: true,
  state: {
    items: [],
    item: {},
    tabs: null,
    selected: [],
    valid: false,
    dialog: false,
    confirm: false,
    exist_code: true,
    isGetFirst: true,
    headers: [
      // { text: 'ID', value: 'id', align: 'left' },
      { text: 'languages.title', value: 'title', align: 'left' },
      { text: 'global.code', value: 'code', align: 'left' },
      { text: 'global.orders', value: 'orders' },
      { text: 'global.created_at', value: 'created_at' },
      { text: 'Icon', value: 'icon' },
      { text: '#', value: '#', sortable: false }
    ],
    pagination: {
      search: '',
      sortBy: 'orders',
      toggle: 0,
      find: { flag: 1 }
    },
    languages_default: 'vi-VN',
    default: {
      id: '',
      code: '',
      title: '',
      icon: '<i class="material-icons">outlined_flag</i>',
      attach: '',
      orders: 1,
      descs: '',
      created_by: '',
      created_at: new Date(),
      updated_by: '',
      updated_at: null,
      deleted_by: '',
      deleted_at: null,
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
    headers: (state, getters, rootState, rootGetters) => {
      state.headers.forEach(e => { e.text = rootGetters.languages(e.text) })
      return state.headers
    }
  },
  mutations: {
    SET_ITEMS(state, items) {
      state.items = items
    },
    SET_ITEM(state, item) {
      state.item = item ? { ...item } : { ...state.default }
    },
    SET_ITEM_ID(state, id) {
      state.item = id ? { ...state.items.find(x => x.id == id) } : { ...state.default }
    },
    PUSH_ITEMS(state, item) {
      state.items.push(item)
    },
    UPDATE_ITEMS(state, item) {
      state.items.update(item)
    },
    REMOVE_ITEMS(state, item) {
      state.items.remove(item)
    }
  },
  actions: {
    pagination({ commit, state }, { search, pagination }) {
      var items = []
      var obj = {
        search: [],
        orderBy: [],
        limit: 5
      }
      if (search) {
        obj.search.push('name', '>=', search)
        obj.search.push('name', '<=', search)
        // cll = cll.where('name', '==', 'lang 0')
      }
      if (pagination.sortBy) {
        obj.orderBy.push('name', pagination.descending ? 'desc' : 'asc')
        // cll = cll.orderBy('name', pagination.descending ? 'desc' : 'asc')
      }
      if (pagination.rowsPerPage) {
        obj.limit = 5
        // cll = cll.limit(5)
      }
      if (obj.search.length > 0)
        state.cll
          .where(obj.search[0], obj.search[1], obj.search[2])
          .orderBy(obj.orderBy[0], obj.orderBy[1])
          .limit(obj.limit)
          .get().then(query => {
            query.forEach(function (doc) {
              var item = state.default
              item = doc.data()
              item.id = doc.id
              items.push(item)
            })
          })
      else
        state.cll
          .orderBy(obj.orderBy[0], obj.orderBy[1])
          .limit(obj.limit)
          .get().then(query => {
            query.forEach(function (doc) {
              var item = state.default
              item = doc.data()
              item.id = doc.id
              items.push(item)
            })
          })
      commit('SET_ITEMS', items)
    },
    async select({ commit, state, rootGetters, rootState }, loading = true) {
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
            commit('SET_ITEMS', res.data.data)
          }
        } else commit('SET_CATCH', null, { root: true })
      }).catch((error) => { commit('SET_CATCH', error, { root: true }) })
        .finally(() => {
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
      await vnptbkn().post(collection, state.item).then(function (res) {
        if (res.status == 200) {
          if (res.data.msg === 'exist') {
            commit('SET_MESSAGE', { text: rootGetters.languages('languages.err_exist'), color: 'warning' }, { root: true })
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
        } else commit('SET_CATCH', null, { root: true })
      }).catch((error) => { commit('SET_CATCH', error, { root: true }) })
        .finally(() => { if (loading) rootState.$loadingCommit = false })
    },
    async update({ commit, state, rootGetters, rootState }, loading = true) {
      // Loading
      if (loading) rootState.$loadingCommit = true
      // http
      state.item.updated_by = vnptbkn().defaults.headers.Author
      state.item.updated_at = new Date()
      await vnptbkn().put(collection, state.item).then(function (res) {
        if (res.status == 200) {
          if (res.data.msg === 'danger') {
            commit('SET_MESSAGE', { text: rootGetters.languages('error.data'), color: res.data.msg }, { root: true })
            return
          }
          // Success
          commit('UPDATE_ITEMS', state.item)
          commit('SET_MESSAGE', { text: rootGetters.languages('success.update'), color: res.data.msg }, { root: true })
        } else commit('SET_CATCH', null, { root: true })
      }).catch((error) => { commit('SET_CATCH', error, { root: true }) })
        .finally(() => { if (loading) rootState.$loadingCommit = false })
    },
    async delete({ commit, state, rootGetters, rootState }, loading = true) {
      // Loading
      if (loading) rootState.$loadingCommit = true
      // http
      const data = state.selected.map(x => ({ id: x.id, flag: x.flag === 0 ? 1 : 0 }))
      await vnptbkn().put(`${collection}/delete`, data).then(function (res) {
        if (res.status == 200) {
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
      }).catch((error) => { commit('SET_CATCH', error, { root: true }) })
        .finally(() => { if (loading) rootState.$loadingCommit = false })
    },
    async remove({ commit, state, rootGetters, rootState }, loading = true) {
      // Loading
      if (loading) rootState.$loadingCommit = true
      // http
      await vnptbkn().delete(collection, state.item).then(function (res) {
        if (res.status == 200) {
          if (res.data.msg === 'danger') {
            commit('SET_MESSAGE', { text: rootGetters.languages('error.data'), color: res.data.msg }, { root: true })
            return
          }
          // Success
          commit('REMOVE_ITEMS', state.item)
          state.selected = []
          commit('SET_ITEM')
          commit('SET_MESSAGE', { text: rootGetters.languages('success.delete'), color: res.data.msg }, { root: true })
        } else commit('SET_CATCH', null, { root: true })
      }).catch((error) => { commit('SET_CATCH', error, { root: true }) })
        .finally(() => { if (loading) rootState.$loadingCommit = false })
    },
    async exist_code({ commit, state, rootState }, loading = true) {
      // Loading
      if (loading) rootState.$loadingCommit = true
      // http
      await vnptbkn().get(`${collection}/ExistCode/${state.item.code}`, { timeout: 1000 }).then(function (res) { //, { timeout: 3000 }
        if (res.status === 200) {
          if (res.data.msg === 'exist') state.exist_code = false
          else state.exist_code = true
        } else commit('SET_CATCH', null, { root: true })
      }).catch((error) => {
        commit('SET_CATCH', error, { root: true })
        return Promise.reject(error)
      }).finally(() => { if (loading) rootState.$loadingCommit = false })
    }
  }
}
