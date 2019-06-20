import { ObjectToLowerKey } from '@/plugins/helpers'
import { vnptbkn } from '@/plugins/axios-config'
const collection = 'contract-customer'
export default {
  namespaced: true,
  state: {
    items: [],
    item: {},
    khachhang: {},
    thuebao: [],
    tabs: null,
    selected: [],
    valid: false,
    dialog: false,
    confirm: false,
    exist_code: true,
    isGetFirst: true,
    df_khachhang: {
      hdkh_id: '',
      khachhang_id: '',
      app_key: '',
      ma_gd: '',
      ten_kh: '',
      diachi_kh: '',
      so_dt: '',
      so_gt: '',
      mst: '',
      stk: '',
      attach: '',
      details: '',
      nguoi_cn: '',
      ngay_cn: '',
      donvi_id: '',
      loaihd_id: '',
      created_by: '',
      created_at: '',
      updated_by: '',
      updated_at: '',
      deleted_by: '',
      deleted_at: '',
      flag: 1,
    },
    df_thuebao: {
      hdtb_id: 0,
      hdtb_cha_id: 0,
      thuebao_id: 0,
      thuebao_cha_id: 0,
      hdkh_id: 0,
      hdtt_id: 0,
      ma_tb: '',
      ten_tb: '',
      diachi_tb: '',
      diachi_ld: '',
      kieuld_id: 0,
      tthd_id: 0,
      loaitb_id: 0,
      doituong_id: 0,
      dichvuvt_id: 0,
      donvi_id: 0
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
      let filter = { ...state.pagination.filter }
      if (state.pagination.filter.donvi_id === 0)
        delete filter.donvi_id
      if (pagination && pagination.filter) rs = rs.filterValue(pagination.filter)
      else rs = rs.filterValue({ flag: state.pagination.flag, donvi_id: state.pagination.donvi_id })
      if (pagination && pagination.search) rs = rs.searchValue(pagination.search)
      else rs = rs.searchValue(state.pagination.search)
      if (pagination && pagination.sortBy) rs = rs.sortByKey(pagination.sortBy)
      else rs = rs.sortByKey(state.pagination.sortBy)
      // console.log(state.pagination.filter)
      return rs
    }
  },
  mutations: {
    SET_ITEMS(state, items) {
      state.items = items
    },
    // SET_ITEM(state, item) {
    //   state.item = item ? { ...item } : { ...state.df_khachhang }
    // },
    // SET_ITEM_ID(state, id) {
    //   state.khachhang = id ? { ...state.items.find(x => x.id == id) } : { ...state.df_khachhang }
    // },
    SET_KHACHHANG(state, item) {
      state.khachhang = item ? { ...item } : { ...state.df_khachhang }
    },
    SET_KHACHHANG_ID(state, id) {
      state.khachhang = id ? { ...state.items.find(x => x.cc_id == id) } : { ...state.df_khachhang }
    },
    SET_THUEBAO(state, item) {
      state.thuebao = item ? [...item] : []
    },
    SET_THUEBAO_ID(state, id) {
      state.thuebao = id ? { ...state.items.find(x => x.hdtb_id == id) } : { ...state.df_thuebao }
    },
    PUSH_ITEMS(state, khachhang) {
      state.items.unshift(khachhang)
    },
    UPDATE_ITEMS(state, item) {
      state.items.update(item, 'id')
    },
    REMOVE_ITEMS(state, item) {
      state.items.remove(item, 'id')
    }
  },
  actions: {
    async select({ commit, state, rootGetters, rootState }, params) {
      // Loading
      if (params.loading && !rootState.$loadingGet) rootState.$loadingGet = true
      // http
      return await vnptbkn().get(collection, { params: params }).then(function(res) {
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
        } else { commit('SET_CATCH', null, { root: true }) }
      }).catch((error) => {
        commit('SET_CATCH', error, { root: true })
      }).finally(() => {
        state.isGetFirst = false
        if (params.loading) rootState.$loadingGet = false
      })
    },
    async getThuebao({ commit, state, rootGetters, rootState }, loading = true) {
      // Loading
      if (loading) rootState.$loadingCommit = true
      // http
      await vnptbkn().get(`${collection}/getThuebao/${state.khachhang.hdkh_id}`).then(function(res) {
        if (res.status === 200) {
          if (res.data.msg === 'error_token') {
            commit('SET_CATCH', { response: { status: 401 } }, { root: true })
            return
          }
          if (res.data.msg === 'danger') {
            commit('SET_MESSAGE', { text: rootGetters.languages('error.data'), color: res.data.msg }, { root: true })
            return
          }
          if (res.data.data) commit('SET_THUEBAO', res.data.data)
        } else commit('SET_CATCH', null, { root: true })
      }).catch((error) => {
        commit('SET_CATCH', error, { root: true })
      }).finally(() => {
        if (loading) rootState.$loadingCommit = false
      })
    },
    async insert({ commit, state, rootGetters, rootState }, loading = true) {
      // Loading
      if (loading) rootState.$loadingCommit = true
      // http
      // const khachhang = { ...state.khachhang } // Object.assign({}, state.khachhang)
      // state.khachhang.created_by = vnptbkn().defaults.headers.Author
      // state.khachhang.created_at = new Date()
      // const thuebao = [...state.thuebao]
      // const data = { khachhang: { ...state.khachhang }, thuebao: [...state.thuebao] }
      await vnptbkn().post(collection, state.khachhang).then(function(res) {
        if (res.status == 200) {
          if (res.data.msg === 'error_token') {
            commit('SET_CATCH', { response: { status: 401 } }, { root: true })
            return
          }
          if (res.data.msg === 'exist') {
            commit('SET_MESSAGE', { text: rootGetters.languages('contract_customer.msg_err_exist'), color: 'warning' }, { root: true })
            return
          }
          if (res.data.msg === 'danger') {
            commit('SET_MESSAGE', { text: rootGetters.languages('error.data'), color: res.data.msg }, { root: true })
            return
          }
          if (res.data.data) {
            commit('PUSH_ITEMS', res.data.data)
            commit('SET_KHACHHANG')
            commit('SET_THUEBAO')
          }
          commit('SET_MESSAGE', { text: rootGetters.languages('success.add'), color: res.data.msg }, { root: true })
        } else commit('SET_CATCH', null, { root: true })
      }).catch((error) => {
        commit('SET_CATCH', error, { root: true })
      }).finally(() => {
        if (loading) rootState.$loadingCommit = false
      })
    },
    async update({ commit, state }) {
      // const item = { ...state.khachhang } // Object.assign({}, state.khachhang)
      // item.updated_by = vnptbkn().defaults.headers.Author
      // item.updated_at = new Date()
      // FBStore.collection(collection).doc(item.id).set(item)
      //   .then(docRef => {
      //     commit(UPDATE_ITEMS, item)
      //     commit(SET_MESSAGE, { text: 'Cập nhật thành công', color: 'success' }, { root: true })
      //   })
      //   .catch(error => { commit(SET_CATCH, error, { root: true }) })
    },
    async delete({ commit, state, rootGetters, rootState }, loading = true) {
      // Loading
      if (loading) rootState.$loadingCommit = true
      // http
      const data = state.selected.map(x => ({ id: x.id, flag: 4 }))
      await vnptbkn().put(`${collection}/delete`, data).then(function(res) {
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
          commit('SET_KHACHHANG')
          commit('SET_THUEBAO')
          commit('SET_MESSAGE', { text: rootGetters.languages(['contract_customer.cancel', ' ', 'global.success', '!']), color: res.data.msg }, { root: true })
        } else commit('SET_CATCH', null, { root: true })
      }).catch((error) => {
        commit('SET_CATCH', error, { root: true })
      }).finally(() => {
        if (loading) rootState.$loadingCommit = false
      })
    },
    async remove({ commit, state }) {
      // const item = { ...state.khachhang } // Object.assign({}, state.khachhang)
      // FBStore.collection(collection).doc(item.id).delete()
      //   .then(docRef => {
      //     commit(REMOVE_ITEMS, item)
      //     commit(SET_MESSAGE, { text: 'Xóa hoàn toàn bản ghi thành công!', color: 'success' }, { root: true })
      //   })
      //   .then(() => { commit(SET_KHACHHANG, state.default) })
      //   .catch(error => { commit(SET_CATCH, error, { root: true }) })
    },
    async getContract({ commit, state, rootGetters, rootState }, loading = true) {
      // Loading
      if (loading) rootState.$loadingCommit = true
      // http
      await vnptbkn().get(`${collection}/getContract?key=${state.khachhang.ma_gd}`).then(function(res) {
        if (res.status == 200) {
          if (res.data.msg === 'not_exist') {
            commit('SET_MESSAGE', { text: rootGetters.languages('contract_customer.msg_err_not_exist'), color: 'warning' }, { root: true })
            return
          }
          if (res.data.msg === 'exist') {
            commit('SET_MESSAGE', { text: rootGetters.languages('contract_customer.msg_err_exist'), color: 'warning' }, { root: true })
            return
          }
          if (res.data.msg === 'danger') {
            commit('SET_MESSAGE', { text: rootGetters.languages('error.data'), color: res.data.msg }, { root: true })
            return
          }
          if (res.data.data.khachhang && res.data.data.thuebao && res.data.data.thuebao.length > 0) {
            // SET_KHACHHANG
            // commit('SET_KHACHHANG', ObjectToFillSource({ ...state.df_khachhang }, res.data.data.khachhang))
            commit('SET_KHACHHANG', res.data.data.khachhang) //ObjectToLowerKey(res.data.data.khachhang))
            // SET_THUEBAO
            commit('SET_THUEBAO', res.data.data.thuebao)//ObjectToLowerKey(res.data.data.thuebao))
          }
        } else commit('SET_CATCH', null, { root: true })
      }).catch((error) => {
        commit('SET_CATCH', error, { root: true })
      }).finally(() => {
        if (loading) rootState.$loadingCommit = false
      })
    }
  }
}
