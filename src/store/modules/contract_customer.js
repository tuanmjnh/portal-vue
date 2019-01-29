import { SET_CATCH, SET_ITEMS, PUSH_ITEMS, UPDATE_ITEMS, REMOVE_ITEMS, SET_ITEM, SET_MESSAGE } from '../mutation-type'
import { FilterValue, SearchValue, SortByKey, ObjectToFillSource, ObjectToLowerKey } from '@/plugins/helpers'
import { vnptbkn } from '@/plugins/axios-config'
const collection = 'contract-customer'
export default {
  namespaced: true,
  state: {
    items: [],
    khachhang: {},
    thuebao: [],
    df_khachhang: {
      cc_id: '',
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
    getByFlag: state => flag => {
      return state.items.filter(x => x.flag === flag)
    },
    getFilter: state => pagination => {
      let items = [...state.items]
      items = FilterValue(items, pagination.find)
      items = SearchValue(items, pagination.search)
      items = SortByKey(items, pagination.sortBy)
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
    }
  },
  actions: {
    async select({ commit, state }) {
      await vnptbkn
        .get(collection)
        .then(function(res) {
          if (res.status === 200) {
            if (res.data.data) commit(SET_ITEMS, res.data.data)
          } else commit(SET_CATCH, null, { root: true })
        })
        .catch(function(error) { commit(SET_CATCH, error, { root: true }) })
    },
    async getThuebao({ commit, state }) {
      console.log(state.khachhang.hdkh_id)
      await vnptbkn
        .get(collection + '/getThuebao/' + state.khachhang.hdkh_id)
        .then(function(res) {
          if (res.status === 200) {
            if (res.data.data) commit('SET_THUEBAO', res.data.data)
          } else commit(SET_CATCH, null, { root: true })
        })
        .catch(function(error) { commit(SET_CATCH, error, { root: true }) })
    },
    async insert({ commit, state }) {
      // const khachhang = { ...state.khachhang } // Object.assign({}, state.khachhang)
      // state.khachhang.created_by = vnptbkn.defaults.headers.Author
      // state.khachhang.created_at = new Date()
      // const thuebao = [...state.thuebao]
      const data = {
        khachhang: { ...state.khachhang },
        thuebao: [...state.thuebao]
      }
      await vnptbkn
        .post(collection, data)
        .then(function(res) {
          if (res.status == 200) {
            if (res.data.msg === 'exist') {
              commit(SET_MESSAGE, { text: 'Hợp đồng đã tồn tại!', color: 'warning' }, { root: true })
              return
            }
            if (res.data.msg === 'danger') {
              commit(SET_MESSAGE, { text: 'Lỗi dữ liệu, vui lòng thử lại!', color: res.data.msg }, { root: true })
              return
            }
            if (res.data.data.khachhang) {
              commit(PUSH_ITEMS, res.data.data.khachhang)
            }
            commit(SET_MESSAGE, { text: 'Thêm mới hợp đồng thành công!', color: res.data.msg }, { root: true })
          } else commit(SET_CATCH, null, { root: true })
        })
        .catch(function(error) { commit(SET_CATCH, error, { root: true }) })
    },
    async update({ commit, state }) {
      const item = { ...state.khachhang } // Object.assign({}, state.khachhang)
      item.updated_by = vnptbkn.defaults.headers.Author
      item.updated_at = new Date()
      // FBStore.collection(collection).doc(item.id).set(item)
      //   .then(docRef => {
      //     commit(UPDATE_ITEMS, item)
      //     commit(SET_MESSAGE, { text: 'Cập nhật thành công', color: 'success' }, { root: true })
      //   })
      //   .catch(error => { commit(SET_CATCH, error, { root: true }) })
    },
    async delete({ commit, state }) {
      const item = { ...state.khachhang } // Object.assign({}, state.khachhang)
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
    async remove({ commit, state }) {
      const item = { ...state.khachhang } // Object.assign({}, state.khachhang)
      // FBStore.collection(collection).doc(item.id).delete()
      //   .then(docRef => {
      //     commit(REMOVE_ITEMS, item)
      //     commit(SET_MESSAGE, { text: 'Xóa hoàn toàn bản ghi thành công!', color: 'success' }, { root: true })
      //   })
      //   .then(() => { commit(SET_KHACHHANG, state.default) })
      //   .catch(error => { commit(SET_CATCH, error, { root: true }) })
    },
    async khachhang({ commit, state }, khachhang) {
      if (khachhang) commit('SET_KHACHHANG', khachhang)
      else commit('SET_KHACHHANG', state.df_khachhang)
    },
    async thuebao({ commit, state }, thuebao) {
      if (thuebao) commit('SET_THUEBAO', thuebao)
      else commit('SET_THUEBAO', [])
    },
    async getContract({ commit, state }) {
      await vnptbkn
        .get(collection + '/getContract?key=' + state.khachhang.ma_gd)
        .then(function(res) {
          if (res.status == 200) {
            if (res.data.msg === 'notexist') {
              commit(SET_MESSAGE, { text: 'Không tìm thấy hợp đồng!', color: 'warning' }, { root: true })
              return
            }
            if (res.data.msg === 'exist') {
              commit(SET_MESSAGE, { text: 'Hợp đồng đã tồn tại!', color: 'warning' }, { root: true })
              return
            }
            if (res.data.msg === 'danger') {
              commit(SET_MESSAGE, { text: 'Lỗi dữ liệu, vui lòng thử lại!', color: res.data.msg }, { root: true })
              return
            }
            if (res.data.data.khachhang && res.data.data.thuebao && res.data.data.thuebao.length > 0) {
              // SET_KHACHHANG
              // commit('SET_KHACHHANG', ObjectToFillSource({ ...state.df_khachhang }, res.data.data.khachhang))
              commit('SET_KHACHHANG', ObjectToLowerKey(res.data.data.khachhang))
              // SET_THUEBAO
              commit('SET_THUEBAO', ObjectToLowerKey(res.data.data.thuebao))
            }
          } else commit(SET_CATCH, null, { root: true })
        })
        .catch(function(error) { commit(SET_CATCH, error, { root: true }) })
    }
  }
}
