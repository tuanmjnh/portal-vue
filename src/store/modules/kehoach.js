import { vnptbkn } from '@/plugins/axios-config'
const collection = 'kehoach'
export default {
  namespaced: true,
  state: {
    kehoach_tb: [],
    kehoach_th: [],
    nhom_kh: [],
    nguoidung: [],
    item: {},
    selected_tb: [],
    selected_th: {},
    dialog: false,
    isGetFirst: true,
    thuebao_nguoidung: {},
    default: {}
  },
  getters: {
    getById: state => id => {
      return state.items.find(x => x.id === id)
    },
    getNhomKH: state => {
      return state.nhom_kh.filter(x => { if (x.dependent !== ',0,') return x })
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
      // console.log(state.items)
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
      state.kehoach_tb.update(item, 'id')
    },
    REMOVE_ITEMS(state, item) {
      state.items.remove(item, 'id')
    }
  },
  actions: {
    async select_tb({ commit, rootGetters, state, rootState }, params) {
      // Loading
      if (params.loading) rootState.$loadingGet = true
      // http
      return await vnptbkn().get(collection, { params: params }).then(function (res) {
        if (res.status === 200) {
          if (res.data.msg === 'error_token') {
            commit('SET_CATCH', { response: { status: 401 } }, { root: true })
            return
          }
          if (res.data.msg === 'danger') {
            commit('SET_MESSAGE', { text: rootGetters.languages('error.data'), color: res.data.msg }, { root: true })
            return
          }
          if (params.is_export) {
            if (res.data.data.length < 1)
              commit('SET_MESSAGE', { text: rootGetters.languages('error.no_data'), color: 'warning' }, { root: true })
            return res.data.data
          } else {
            if (res.data.data) state.kehoach_tb = res.data.data
            return res.data
          }
        } else commit('SET_CATCH', null, { root: true })
      }).catch((error) => {
        commit('SET_CATCH', error, { root: true })
      }).finally(() => {
        state.isGetFirst = false
        if (params.loading) rootState.$loadingGet = false
      })
    },
    async select_th({ commit, state, rootGetters, rootState }, params) {
      // Loading
      if (params.loading) rootState.$loadingGet = true
      // http
      return await vnptbkn().get(`${collection}/GetThucHienTB`, { params: params }).then(function (res) {
        if (res.status === 200) {
          if (res.data.msg === 'error_token') {
            commit('SET_CATCH', { response: { status: 401 } }, { root: true })
            return
          }
          if (res.data.msg === 'danger') {
            commit('SET_MESSAGE', { text: rootGetters.languages('error.data'), color: res.data.msg }, { root: true })
            return
          }
          if (params.is_export) {
            if (res.data.data.length < 1)
              commit('SET_MESSAGE', { text: rootGetters.languages('error.no_data'), color: 'warning' }, { root: true })
            return res.data.data
          } else {
            if (res.data.data) commit('SET_ITEMS', res.data.data)
            return res.data
          }
        } else commit('SET_CATCH', null, { root: true })
      }).catch((error) => {
        commit('SET_CATCH', error, { root: true })
      }).finally(() => {
        if (params.loading) rootState.$loadingGet = false
      })
    },
    async GetNguoidung({ commit, state, rootGetters, rootState }, params) {
      // Loading
      if (params.loading) rootState.$loadingGet = true
      // http
      return await vnptbkn().get(`${collection}/GetNguoidung/${params.donvi_id}`).then(function (res) {
        if (res.status === 200) {
          if (res.data.msg === 'error_token') {
            commit('SET_CATCH', { response: { status: 401 } }, { root: true })
            return
          }
          if (res.data.msg === 'danger') {
            commit('SET_MESSAGE', { text: rootGetters.languages('error.data'), color: res.data.msg }, { root: true })
            return
          }
          if (res.data.data) {
            state.nguoidung = res.data.data.sortByKey('donvi_id')
            state.nguoidung.forEach(e => {
              e.ten_nd_dv = `${e.ten_nd} - ${e.ma_nd} - ${e.ma_dv}`
            })
          }
          else state.nguoidung = []
          return state.nguoidung
        } else commit('SET_CATCH', null, { root: true })
      }).catch((error) => {
        commit('SET_CATCH', error, { root: true })
      }).finally(() => {
        if (params.loading) rootState.$loadingGet = false
      })
    },
    async import_tb({ commit, state, rootGetters, rootState }, params) {
      // Loading
      if (params.loading) rootState.$loadingCommit = true
      // http
      return await vnptbkn().post(collection, params).then(function (res) {
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
          commit('SET_MESSAGE', { text: rootGetters.languages('success.import'), color: res.data.msg }, { root: true })
          // state.import_tb.success = res.data.success
          // state.import_tb.error = res.data.error
          // state.import_tb.nhomkh_id = 0
          return res.data
        } else { commit('SET_CATCH', null, { root: true }) }
      }).catch((error) => {
        commit('SET_CATCH', error, { root: true })
      }).finally(() => {
        // state.import_tb.file_name = ''
        // state.import_tb.file_upload = ''
        if (params.loading) rootState.$loadingCommit = false
      })
    },
    async insert_th({ commit, state, rootGetters, rootState }, params) {
      // Loading
      if (params.loading) rootState.$loadingCommit = true
      // http
      await vnptbkn().post(`${collection}/GanThueBaoTH/${state.thuebao_nguoidung.nguoidung_id}`, state.selected_tb).then(function (res) {
        if (res.status == 200) {
          if (res.data.msg === 'error_token') {
            commit('SET_CATCH', { response: { status: 401 } }, { root: true })
            return
          }
          if (res.data.msg === 'danger') {
            commit('SET_MESSAGE', { text: rootGetters.languages('error.data'), color: res.data.msg }, { root: true })
            return
          }
          if (res.data.msg === 'exist') {
            commit('SET_MESSAGE', { text: 'Chưa có thuê bao được chọn!', color: 'warning' }, { root: true })
            return
          }
          state.kehoach_tb.remove(state.selected_tb)
          // Success
          commit('SET_MESSAGE', { text: rootGetters.languages('success.update'), color: res.data.msg }, { root: true })
        } else commit('SET_CATCH', null, { root: true })
      }).catch((error) => {
        commit('SET_CATCH', error, { root: true })
      }).finally(() => {
        state.selected_tb = []
        if (params.loading) rootState.$loadingCommit = false
      })
    },
    async update_th({ commit, state, rootGetters, rootState }, params) {
      // Loading
      if (params.loading) rootState.$loadingCommit = true
      // http
      await vnptbkn().post(`${collection}/GanThueBaoTH/${state.thuebao_nguoidung.nguoidung_id}`, state.selected_th).then(function (res) {
        if (res.status == 200) {
          if (res.data.msg === 'error_token') {
            commit('SET_CATCH', { response: { status: 401 } }, { root: true })
            return
          }
          if (res.data.msg === 'danger') {
            commit('SET_MESSAGE', { text: rootGetters.languages('error.data'), color: res.data.msg }, { root: true })
            return
          }
          if (res.data.msg === 'exist') {
            commit('SET_MESSAGE', { text: 'Chưa có thuê bao được chọn!', color: 'warning' }, { root: true })
            return
          }
          state.kehoach_tb.remove(state.selected_th)
          // Success
          commit('SET_MESSAGE', { text: rootGetters.languages('success.update'), color: res.data.msg }, { root: true })
        } else commit('SET_CATCH', null, { root: true })
      }).catch((error) => {
        commit('SET_CATCH', error, { root: true })
      }).finally(() => {
        state.selected_th = []
        if (params.loading) rootState.$loadingCommit = false
      })
    },
    async updateND({ commit, state, rootGetters, rootState }, params) {
      // Loading
      if (params.loading) rootState.$loadingCommit = true
      // http
      return await vnptbkn().post(`${collection}/UpdateND`, params).then(function (res) {
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
          return res.data
        } else commit('SET_CATCH', null, { root: true })
      }).catch((error) => {
        commit('SET_CATCH', error, { root: true })
      }).finally(() => {
        state.selected_th = []
        if (params.loading) rootState.$loadingCommit = false
      })
    },
    async update({ commit, state, rootGetters, rootState }, loading = true) {
      // Loading
      if (loading) rootState.$loadingCommit = true
      // http
      state.item.updated_by = vnptbkn().defaults.headers.Author
      state.item.updated_at = new Date()
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
