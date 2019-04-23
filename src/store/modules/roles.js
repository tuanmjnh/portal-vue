import { vnptbkn } from '@/plugins/axios-config'
const collection = 'roles'
export default {
  namespaced: true,
  state: {
    items: [],
    item: {},
    tabs: null,
    selected: [],
    roles_selected: [],
    color: {},
    valid: false,
    dialog: false,
    confirm: false,
    exist_code: true,
    isGetFirst: true,
    headers: [
      // { text: 'ID', value: 'id', align: 'left' },
      { text: 'roles.name', value: 'name', align: 'left' },
      { text: 'global.orders', value: 'orders', sortable: true },
      { text: 'global.created_at', value: 'created_at', sortable: true },
      { text: '#', value: '#', sortable: false }
    ],
    pagination: {
      search: '',
      sortBy: 'orders',
      toggle: 0,
      find: { flag: 1 }
    },
    default: {
      id: '',
      name: '',
      roles: '',
      orders: 1,
      descs: '',
      created_by: '',
      created_at: new Date(),
      updated_by: '',
      updated_at: null,
      deleted_by: '',
      deleted_at: null,
      flag: 1,
      color: '{"cover":"default","text":"white"}'
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
      if (item) {
        state.item = { ...item }
        if (state.item.roles) state.roles_selected = state.item.roles.trim(',').split(',')
        if (state.item.color) state.color = JSON.parse(state.item.color)
      } else {
        state.item = { ...state.default }
        state.roles_selected = []
        state.color = { cover: "default", text: "white" }
      }
    },
    SET_ITEM_ID(state, id) {
      state.item = id ? { ...state.items.find(x => x.id == id) } : { ...state.default }
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
      state.item.roles = `,${state.roles_selected.join(',')},`
      state.item.color = JSON.stringify(state.color)
      await vnptbkn().post(collection, state.item).then(function (res) {
        if (res.status == 200) {
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
        } else commit('SET_CATCH', null, { root: true })
      }).catch((error) => { commit('SET_CATCH', error, { root: true }) })
        .finally(() => { if (loading) rootState.$loadingCommit = false })
    },
    async update({ commit, state, rootGetters, rootState }, loading = true) {
      // Loading
      if (loading) rootState.$loadingCommit = true;
      // http
      state.item.roles = `,${state.roles_selected.join(',')},`
      state.item.color = JSON.stringify(state.color)
      await vnptbkn().put(collection, state.item).then(function (res) {
        if (res.status == 200) {
          if (res.data.msg === 'danger') {
            commit('SET_MESSAGE', { text: rootGetters.languages('error.data'), color: res.data.msg }, { root: true })
            return
          }
          // Success
          commit('UPDATE_ITEMS', state.item)
          state.selected = []
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
      await vnptbkn().put(collection + '/delete', data).then(function (res) {
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
          commit('SET_ITEM')
          commit('SET_MESSAGE', { text: rootGetters.languages('success.delete'), color: res.data.msg }, { root: true })
        } else commit('SET_CATCH', null, { root: true })
      }).catch((error) => { commit('SET_CATCH', error, { root: true }) })
        .finally(() => { if (loading) rootState.$loadingCommit = false })
    }
  }
}
