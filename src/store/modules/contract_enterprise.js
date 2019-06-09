import { vnptbkn } from '@/plugins/axios-config'
const collection = 'contract-enterprise'
export default {
  namespaced: true,
  state: {
    items: [],
    item: {},
    selected: [],
    category: [],
    dialog: false,
    default: {
      id: '',
      app_key: '',
      kieuld_id: 0,
      donvi_id: 0,
      group_id: 0,
      ma_hd: '',
      ten_kh: '',
      diachi_kh: '',
      nguoi_dd: '',
      sdt: '',
      stk: '',
      mst: '',
      sgt: '',
      ngay_cap: new Date().toISOString().substr(0, 10),
      noi_cap: '',
      ngay_bd: new Date().toISOString().substr(0, 10),
      ngay_kt: new Date().toISOString().substr(0, 10),
      so_luong: 1,
      tien: 0,
      thue: 0,
      noi_dung: '',
      ghi_chu: '',
      tep_dk: '',
      nguoi_tao: '',
      ip_tao: '',
      ngay_tao: new Date(),
      nguoi_cn: '',
      ip_cn: '',
      ngay_cn: null,
      nguoi_xoa: '',
      ip_xoa: '',
      ngay_xoa: null,
      trang_thai: 1,
      nguoi_gt: ''
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
    async select({ commit, state, rootGetters, rootState }, params) {
      // Loading
      if (params.loading && !rootState.$loadingGet) rootState.$loadingGet = true
      // http
      await vnptbkn().get(collection, { params: params }).then(function(res) {
        if (res.status === 200) {
          if (res.data.msg === 'danger') {
            commit('SET_MESSAGE', { text: rootGetters.languages('error.data'), color: res.data.msg }, { root: true })
            return
          }
          if (res.data.items) {
            commit('SET_ITEMS', res.data.items)
          }
        } else { commit('SET_CATCH', null, { root: true }) }
      }).catch((error) => { commit('SET_CATCH', error, { root: true }) })
        .finally(() => {
          state.isGetFirst = false
          if (params.loading) rootState.$loadingGet = false
        })
    },
    async insert({ commit, state, rootGetters, rootState }, loading = true) {
      // Loading
      if (loading) rootState.$loadingCommit = true
      // http
      state.item.created_by = vnptbkn().defaults.headers.Author
      state.item.created_at = new Date()
      await vnptbkn().post(collection, state.item).then(function(res) {
        if (res.status == 200) {
          if (res.data.msg === 'exist') {
            commit('SET_MESSAGE', { text: rootGetters.languages('permissions.err_exist'), color: 'warning' }, { root: true })
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
      await vnptbkn().put(collection, state.item).then(function(res) {
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
      await vnptbkn().put(`${collection}/delete`, data).then(function(res) {
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
      await vnptbkn().delete(collection, state.item).then(function(res) {
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
      await vnptbkn().get(`${collection}/ExistCode/${state.item.code}`, { timeout: 1000 }).then(function(res) { //, { timeout: 3000 }
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
