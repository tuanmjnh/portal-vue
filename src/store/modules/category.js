import { vnptbkn } from '@/plugins/axios-config'
const collection = 'groups'
export default {
  namespaced: true,
  state: {
    items: [],
    item: {},
    selected: [],
    dialog: false,
    isGetFirst: true,
    totalItems: 0,
    pagination: {
      search: '',
      sortBy: 'code,dependent,orders,title,id',
      descending: false,
      toggle: 0,
      flag: 1,
      page: 1,
      rowsPerPage: 10,
      app_key: 'guide'
    },
    default: {
      id: 0,
      app_key: 'news',
      code: '',
      dependent: '',
      levels: 0,
      title: '',
      icon: '<i class="material-icons">class</i>',
      image: '',
      url: '',
      orders: 1,
      quantity: 0,
      position: '1',
      descs: '',
      content: '',
      tags: '',
      start_at: null,
      end_at: null,
      created_ip: '',
      created_by: '',
      created_at: new Date(),
      updated_ip: '',
      updated_by: '',
      updated_at: null,
      deleted_ip: '',
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
      else rs = rs.filterValue({ flag: state.pagination.flag, app_key: state.pagination.app_key })
      if (pagination && pagination.search) rs = rs.searchValue(pagination.search)
      else rs = rs.searchValue(state.pagination.search)
      if (pagination && pagination.sortBy) rs = rs.sortByKey(pagination.sortBy)
      else rs = rs.sortByKey(state.pagination.sortBy)
      return rs
    },
    headers: (state, getters, rootState, rootGetters) => {
      state.headers.forEach(e => { e.text = rootGetters.languages(e.text) })
      return state.headers
    },
    getDependent: state => {
      return state.items
        .filterValue({ flag: 1 })
        .filter(e => { return e.id != state.item.id })
        // .sortByKey('app_key')
        .map(e => ({ 'id': e.id, 'title': e.title }))
    },
    getRender: state => filter => {
      let items = state.items
        .filter(row => { return row.flag === 1 })
        .filter(row => { return row.app_key === filter.position })
      if (filter.roles && filter.roles.length > 0)
        items = items.filter(row => { return filter.roles.indexOfArray(row.url.trim(',').split(',')) > -1 })
      //items = items.filter(row => { return filter.roles.indexOfArray(row.url.trim(',').split(',')) > -1 })
      const rs = items.filter(row => { return row.dependent.indexOf(',0,') > -1 })
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
  mutations: {
    SET_ITEMS(state, items) {
      state.items = items
    },
    SET_ITEM(state, item) {
      if (item) {
        if (item.url_plus) state.url_plus = JSON.parse(item.url_plus)
        else state.url_plus = { push: '', go: '', store: '' }
        state.item = { ...item }
      } else state.item = { ...state.default }
    },
    SET_ITEM_ID(state, id) {
      if (id) {
        state.item = { ...state.items.find(x => x.id == id) }
        if (state.item.url_plus) state.url_plus = JSON.parse(state.item.url_plus)
        else state.url_plus = { push: '', go: '', store: '' }
      } else state.item = { ...state.default }
    },
    PUSH_ITEMS(state, item) {
      state.items.push(item)
    },
    UPDATE_ITEMS(state, item) {
      state.items.update(item, 'id')
    },
    REMOVE_ITEMS(state, item) {
      state.items.remove(item, 'id')
    }
  },
  actions: {
    async select({ commit, rootGetters, state, rootState }, isExport = false, pagination, loading = true) {
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
      }).catch((error) => {
        commit('SET_CATCH', error, { root: true })
      }).finally(() => {
        state.isGetFirst = false
        if (loading) rootState.$loadingGet = false
      })
    },
    async GetByKey({ commit, rootGetters, state, rootState }, params = null, loading = true) {
      // Loading
      if (loading) rootState.$loadingGet = true
      // http
      return await vnptbkn().get(`${collection}/GetByKey`, { params: params }).then(function (res) {
        if (res.status === 200) {
          if (res.data.msg === 'error_token') {
            commit('SET_CATCH', { response: { status: 401 } }, { root: true })
            return
          }
          if (res.data.msg === 'danger') {
            commit('SET_MESSAGE', { text: rootGetters.languages('error.data'), color: res.data.msg }, { root: true })
            return
          }
          return res.data.data
        } else commit('SET_CATCH', null, { root: true })
      }).catch((error) => {
        commit('SET_CATCH', error, { root: true })
      }).finally(() => {
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
        } else commit('SET_CATCH', null, { root: true })
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
