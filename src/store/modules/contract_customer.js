import { SET_CATCH, SET_ITEMS, PUSH_ITEMS, UPDATE_ITEMS, REMOVE_ITEMS, SET_ITEM, SET_MESSAGE } from '../mutation-type'
import { vnptbkn } from '@/plugins/axios-config'
import { ObjectToFillSource, ObjectToLowerKey } from '@/plugins/helpers'
const collection = 'contract-customer'
export default {
  namespaced: true,
  state: {
    items: [],
    khachhang: {},
    thuebao: [],
    df_khachhang: {
      contract_customer_id: 0,
      app_key: '',
      hdkh_id: '',
      khachhang_id: '',
      donvi_id: '',
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
      created_by: '',
      created_at: new Date(),
      updated_by: '',
      updated_at: '',
      deleted_by: '',
      deleted_at: '',
      cfm_notes: '',
      cfm_by: '',
      cfm_at: new Date(),
      flag: 1,
      loaihd_id: '',
      kieuhd_id: ''
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
    getByFlag: state => flag => {
      return state.items.filter(x => x.flag === flag)
    },
    getFilter: state => query => {
      var items = state.items
      if (query.flag >= 0) {
        items = items.filter(function(row) {
          return row['flag'] == query.flag
        })
      }
      if (query.search) {
        items = items.filter(function(row) {
          return Object.keys(row).some(function(key) {
            return String(row[key]).toLowerCase().indexOf(query.search) > -1
          })
        })
      }
      return items
    }
  },
  mutations: {
    [SET_ITEMS](state, items) {
      state.items = items
    },
    SET_KHACHHANG(state, khachhang) {
      state.khachhang = { ...khachhang } // Object.assign({}, item)
    },
    SET_THUEBAO(state, thuebao) {
      state.thuebao = thuebao // Object.assign({}, item)
    },
    [PUSH_ITEMS](state, khachhang) {
      state.items.push(khachhang)
    },
    [UPDATE_ITEMS](state, khachhang) {
      const index = state.items.findIndex(x => x.id === khachhang.id)
      state.items.splice(index, 1, khachhang)
    },
    [REMOVE_ITEMS](state, khachhang) {
      const index = state.items.findIndex(x => x.id === khachhang.id)
      if (index >= 0) state.items.splice(index, 1)
    },
  },
  actions: {
    async select({ commit, state }) {
      await vnptbkn
        .get(collection)
        .then(function(res) {
          if (res.status == 200) {
            if (res.data.data) commit(SET_ITEMS, res.data.data)
          } else commit(SET_CATCH, null, { root: true })
        })
        .catch(function(error) { commit(SET_CATCH, error, { root: true }) })
    },
    async insert({ commit, state }) {
      var item = { ...state.khachhang } // Object.assign({}, state.khachhang)
      item.created_by = vnptbkn.defaults.headers.Author
      item.created_at = new Date()
      // return FBStore.collection(collection)
      //   .add(state.item)
      //   .then(docRef => {
      //     item.id = docRef.id
      //     commit(PUSH_ITEMS, item)
      //     commit(SET_MESSAGE, { text: 'Cập nhật thành công', color: 'success' }, { root: true })
      //   })
      //   .then(() => { commit(SET_KHACHHANG, state.default) })
      //   .catch(error => { commit(SET_CATCH, error, { root: true }) })
    },
    update({ commit, state }) {
      var item = { ...state.khachhang } // Object.assign({}, state.khachhang)
      item.updated_by = vnptbkn.defaults.headers.Author
      item.updated_at = new Date()
      // FBStore.collection(collection).doc(item.id).set(item)
      //   .then(docRef => {
      //     commit(UPDATE_ITEMS, item)
      //     commit(SET_MESSAGE, { text: 'Cập nhật thành công', color: 'success' }, { root: true })
      //   })
      //   .catch(error => { commit(SET_CATCH, error, { root: true }) })
    },
    delete({ commit, state }) {
      var item = { ...state.khachhang } // Object.assign({}, state.khachhang)
      item.deleted_by = vnptbkn.defaults.headers.Author
      item.deleted_at = new Date()
      // FBStore.collection(collection).doc(item.id)
      //   .update({ flag: item.flag === 1 ? 0 : 1 })
      //   .then(docRef => {
      //     item.flag = item.flag === 1 ? 0 : 1
      //     commit(UPDATE_ITEMS, item)
      //     commit(SET_MESSAGE, { text: 'Xóa bản ghi thành công!', color: 'success' }, { root: true })
      //   })
      //   .then(() => { commit(SET_KHACHHANG, state.default) })
      //   .catch(error => { commit(SET_CATCH, error, { root: true }) })
    },
    remove({ commit, state }) {
      var item = { ...state.khachhang } // Object.assign({}, state.khachhang)
      // FBStore.collection(collection).doc(item.id).delete()
      //   .then(docRef => {
      //     commit(REMOVE_ITEMS, item)
      //     commit(SET_MESSAGE, { text: 'Xóa hoàn toàn bản ghi thành công!', color: 'success' }, { root: true })
      //   })
      //   .then(() => { commit(SET_KHACHHANG, state.default) })
      //   .catch(error => { commit(SET_CATCH, error, { root: true }) })
    },
    khachhang({ commit, state }, khachhang) {
      if (khachhang) commit('SET_KHACHHANG', khachhang)
      else commit('SET_KHACHHANG', state.df_khachhang)
    },
    thuebao({ commit, state }, thuebao) {
      if (thuebao) commit('SET_THUEBAO', thuebao)
      else commit('SET_THUEBAO', [])
    },
    async getContract({ commit, state }) {
      await vnptbkn
        .get(collection + '/getContract?str=' + state.khachhang.ma_gd)
        .then(function(res) {
          if (res.status == 200) {
            if (res.data.message === 'exist') {
              commit(SET_MESSAGE, { text: 'Không tìm thấy hợp đồng!', color: 'warning' }, { root: true })
              return
            }
            if (res.data.data.khachhang && res.data.data.thuebao && res.data.data.thuebao.length > 0) {
              // SET_KHACHHANG
              commit('SET_KHACHHANG', ObjectToFillSource({ ...state.df_khachhang }, res.data.data.khachhang))
              // SET_THUEBAO
              commit('SET_THUEBAO', ObjectToLowerKey(res.data.data.thuebao))
            }
          } else commit(SET_CATCH, null, { root: true })
        })
        .catch(function(error) { commit(SET_CATCH, error, { root: true }) })
    },
  }
}
