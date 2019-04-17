import { vnptbkn } from '@/plugins/axios-config'
const collection = 'donvi'
export default {
  namespaced: true,
  state: {
    items: [],
    item: {},
    donvi_id: 0,
    tabs: null,
    selected: [],
    valid: false,
    dialog: false,
    confirm: false,
    exist_code: true,
    isGetFirst: true,
    headers: [
      { text: 'nguoidung.username', value: 'ma_nd' },
      { text: 'nguoidung.full_name', value: 'ten_nd' },
      { text: 'nguoidung.mobile', value: 'so_dt' },
      { text: 'nguoidung.email', value: 'email' },
      { text: 'global.roles', value: 'roles_name' },
      { text: '#', value: '#', sortable: false }
    ],
    pagination: {
      search: '',
      sortBy: 'ma_dvi',
      direction: false
    },
    default: {
      ma_dvi: 0,
      donvi_id: 0,
      donvi_ql_id: 0,
      ten_dv: '',
      ten_dv_ql: '',
      sdt: '',
      stk: ''
    }
  },
  getters: {
    getAll(state) {
      return state.items
    },
    getById: state => id => {
      return state.items.find(x => x.donvi_id === id)
    },
    getFilter: state => pagination => {
      let rs = [...state.items]
      if (pagination && pagination.find) rs = rs.filterValue(pagination.find)
      else rs = rs.filterValue(state.pagination.find)
      if (pagination && pagination.search) rs = rs.searchValue(pagination.find)
      else rs = rs.searchValue(state.pagination.find)
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
      state.item = id ? { ...state.items.find(x => x.donvi_id == id) } : { ...state.default }
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
    async select({ commit, state, rootGetters, rootState }, loading = true) {
      // Loading
      if (loading) rootState.$loadingGet = true
      // http
      await vnptbkn.get(collection).then(function (res) {
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
    // async GetRoles({ commit, state, rootGetters, rootState }, loading = true) {
    //   // Loading
    //   if (loading) rootState.$loadingCommit = true
    //   // http
    //   await vnptbkn.get(collection + '/GetRoles').then(function(res) {
    //     if (res.status === 200) {
    //       if (res.data.msg === 'danger') {
    //         commit(SET_MESSAGE, { text: rootGetters.languages('error.data'), color: res.data.msg }, { root: true })
    //         return
    //       }
    //       if (res.data.data) commit(SET_ITEMS, res.data.data)
    //     } else commit(SET_CATCH, null, { root: true })
    //   }).catch(function(error) {
    //     commit(SET_CATCH, error, { root: true })
    //   }).finally(() => {
    //     // state.isGetFirst = false
    //     if (loading) rootState.$loadingCommit = false
    //   })
    // },
    async insert({ commit, state, rootGetters, rootState }, loading = true) {
      // Loading
      if (loading) rootState.$loadingCommit = true
      // http
      state.item.created_by = vnptbkn.defaults.headers.Author
      state.item.created_at = new Date()
      await vnptbkn.post(collection, state.item).then(function (res) {
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
          commit('PUSH_ITEMS', res.data.data)
          commit('SET_ITEM')
          commit('SET_MESSAGE', { text: rootGetters.languages('success.add'), color: res.data.msg }, { root: true })
        } else commit('SET_CATCH', null, { root: true })
      }).catch((error) => { commit('SET_CATCH', error, { root: true }) })
        .finally(() => { if (loading) rootState.$loadingCommit = false })
    },
    async update({ commit, state, rootGetters, rootState }, loading = true) {
      // Loading
      if (loading) rootState.$loadingCommit = true
      // http
      state.item.updated_by = vnptbkn.defaults.headers.Author
      state.item.updated_at = new Date()
      await vnptbkn.put(collection, state.item).then(function (res) {
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
      if (state.selected.length < 1) {
        commit('SET_MESSAGE', { text: rootGetters.languages('error.required_select'), color: 'error' }, { root: true })
        return
      }
      const data = state.selected.map(x => ({ nguoidung_id: x.nguoidung_id, flag: x.flag === 0 ? 1 : 0 }))
      await vnptbkn.put(collection + '/delete', data).then(function (res) {
        if (res.status == 200) {
          if (res.data.msg === 'danger') {
            commit('SET_MESSAGE', { text: rootGetters.languages('error.data'), color: res.data.msg }, { root: true })
            return
          }
          // Success
          //state.selected.forEach(e => { commit(UPDATE_ITEMS, e) });
          state.selected.update(data, 'nguoidung_id')
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
      await vnptbkn.delete(collection, state.selected).then(function (res) {
        if (res.status == 200) {
          if (res.data.msg === 'danger') {
            commit('SET_MESSAGE', { text: rootGetters.languages('error.data'), color: res.data.msg }, { root: true })
            return
          }
          // Success
          state.selected.forEach(e => { commit('REMOVE_ITEMS', encodeURI) })
          state.selected = []
          commit('SET_ITEM')
          commit('SET_MESSAGE', { text: rootGetters.languages('success.delete'), color: res.data.msg }, { root: true })
        } else commit('SET_CATCH', null, { root: true })
      }).catch((error) => { commit('SET_CATCH', error, { root: true }) })
        .finally(() => { if (loading) rootState.$loadingCommit = false })
    },
    exist_username({ commit, state, rootState }, loading = true) {
      // Loading
      if (loading) rootState.$loadingCommit = true
      // http
      const promise = new Promise(function (resolve, reject) {
        resolve(state.items.findIndex(x => x.username === state.item.username) < 0 ? false : true);
        reject(Error('Error'));
      });
      return promise
        .catch((error) => { commit('SET_CATCH', error, { root: true }) })
        .finally(() => { if (loading) rootState.$loadingCommit = false })
    },
    async reset_password({ commit, state, rootGetters, rootState }, loading = true) {
      // Loading
      if (loading) rootState.$loadingCommit = true
      // http
      if (state.selected.length < 1) {
        commit('SET_MESSAGE', { text: rootGetters.languages('error.required_select'), color: 'error' }, { root: true })
        if (loading) rootState.$loadingCommit = false
        return
      }
      await vnptbkn.put(`${collection}/ResetPassword/${state.selected[0].nguoidung_id}`).then(function (res) {
        if (res.status == 200) {
          if (res.data.msg === 'danger') {
            commit('SET_MESSAGE', { text: rootGetters.languages('error.data'), color: res.data.msg }, { root: true })
            return
          }
          // Success
          state.selected = []
          commit('SET_ITEM')
          commit('SET_MESSAGE', { text: rootGetters.languages('success.reset_password:' + res.data.data), color: res.data.msg }, { root: true })
        } else commit('SET_CATCH', null, { root: true })
      }).catch((error) => { commit('SET_CATCH', error, { root: true }) })
        .finally(() => { if (loading) rootState.$loadingCommit = false })
    },
    async set_roles({ commit, state, rootGetters, rootState }, roles, loading = true) {
      // Loading
      if (loading) rootState.$loadingCommit = true
      // http
      if (state.selected.length < 1) {
        commit('SET_MESSAGE', { text: rootGetters.languages('error.required_select'), color: 'error' }, { root: true })
        if (loading) rootState.$loadingCommit = false
        return
      }
      const data = state.selected.map(x => ({ nguoidung_id: x.nguoidung_id, roles_id: roles.id, roles_name: roles.name }))
      await vnptbkn.post(`${collection}/SetRoles`, data).then(function (res) {
        if (res.status == 200) {
          if (res.data.msg === 'danger') {
            commit('SET_MESSAGE', { text: rootGetters.languages('error.data'), color: res.data.msg }, { root: true })
            if (loading) rootState.$loadingCommit = false
            return
          }
          // Success
          state.selected.update(data, 'nguoidung_id')
          state.selected = []
          commit('SET_MESSAGE', { text: rootGetters.languages('success.roles:' + res.data.data), color: res.data.msg }, { root: true })
        } else commit('SET_CATCH', null, { root: true })
      }).catch((error) => { commit('SET_CATCH', error, { root: true }) })
        .finally(() => { if (loading) rootState.$loadingCommit = false })
    }
  }
}
