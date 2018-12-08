import { SET_CATCH, SET_ITEMS, PUSH_ITEMS, UPDATE_ITEMS, REMOVE_ITEMS, SET_ITEM, SET_MESSAGE } from '../mutation-type'
import { vnptbkn } from '@/plugins/axios-config'
const collection = 'contract-customer'
export default {
  namespaced: true,
  state: {
    items: [],
    item: {},
    default: {
      contract_customer_id: '',
      app_key: '',
      donvi_id: 0,
      ma_gd: '',
      ten_kh: '',
      so_dt: '',
      ma_tb: '',
      attachs: '',
      details: '',
      created_by: '',
      created_at: new Date(),
      updated_by: '',
      updated_at: null,
      deleted_by: '',
      deleted_at: null,
      cfm_notes: '',
      cfm_by: '',
      cfm_at: new Date(),
      account_number: 1,
      flag: 1,
      type_id: 1,
      thuebao_id: 1,
      so_gt: '',
      mst: '',
      stk: '',
      diachi_kh: '',
      diachi_tb: '',
      diachi_ld: '',
    },
    contract: {
      ma_gd: '',
      thuebao_id: 0,
      ma_tb: '',
      loaitb_id: 0,
      dichvuvt_id: 0,
      donvi_id: 0,
      ten_kh: '',
      diachi_kh: '',
      diachi_tb: '',
      diachi_ld: '',
      so_dt: '',
      so_gt: '',
      mst: '',
      stk: '',
      nguoi_cn: '',
      ngay_cn: null,
      ngay_tt: null,
      ngay_ht: null,
      kieuld_id: '',
      ten_kieuld: '',
      tthd_id: '',
      trangthai_hd: '',
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
    [SET_ITEM](state, item) {
      state.item = Object.assign({}, item)
    },
    [PUSH_ITEMS](state, item) {
      state.items.push(item)
    },
    [UPDATE_ITEMS](state, item) {
      const index = state.items.findIndex(x => x.id === item.id)
      state.items.splice(index, 1, item)
    },
    [REMOVE_ITEMS](state, item) {
      const index = state.items.findIndex(x => x.id === item.id)
      if (index >= 0) state.items.splice(index, 1)
    },
    SET_CONTRACT(state, contract) {
      // state.contract = Object.assign({}, contract)
      state.item.ma_gd = contract[0].ma_gd
      state.item.donvi_id = contract[0].donvi_id
      state.item.ten_kh = contract[0].ten_kh
      state.item.so_dt = contract[0].so_dt
      state.item.so_gt = contract[0].local_id
      state.item.ma_tb = contract[0].ma_tb
      state.item.thuebao_id = contract[0].thuebao_id
      state.item.mst = contract[0].local_id
      state.item.stk = contract[0].local_id
      state.item.diachi_kh = contract[0].diachi_kh
      state.item.diachi_tb = contract[0].diachi_tb
      state.item.diachi_ld = contract[0].diachi_ld
      state.item.ma_tb = ','
      contract.forEach(i => {
        state.item.ma_tb += i.ma_tb + ','
      });
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
      var item = Object.assign({}, state.item)
      item.created_by = 'Admin'
      item.created_at = new Date()
      // return FBStore.collection(collection)
      //   .add(state.item)
      //   .then(docRef => {
      //     item.id = docRef.id
      //     commit(PUSH_ITEMS, item)
      //     commit(SET_MESSAGE, { text: 'Cập nhật thành công', color: 'success' }, { root: true })
      //   })
      //   .then(() => { commit(SET_ITEM, state.default) })
      //   .catch(error => { commit(SET_CATCH, error, { root: true }) })
    },
    update({ commit, state }) {
      var item = Object.assign({}, state.item)
      item.updated_by = 'Admin'
      item.updated_at = new Date()
      // FBStore.collection(collection).doc(item.id).set(item)
      //   .then(docRef => {
      //     commit(UPDATE_ITEMS, item)
      //     commit(SET_MESSAGE, { text: 'Cập nhật thành công', color: 'success' }, { root: true })
      //   })
      //   .catch(error => { commit(SET_CATCH, error, { root: true }) })
    },
    delete({ commit, state }) {
      var item = Object.assign({}, state.item)
      item.deleted_by = 'Admin'
      item.deleted_at = new Date()
      // FBStore.collection(collection).doc(item.id)
      //   .update({ flag: item.flag === 1 ? 0 : 1 })
      //   .then(docRef => {
      //     item.flag = item.flag === 1 ? 0 : 1
      //     commit(UPDATE_ITEMS, item)
      //     commit(SET_MESSAGE, { text: 'Xóa bản ghi thành công!', color: 'success' }, { root: true })
      //   })
      //   .then(() => { commit(SET_ITEM, state.default) })
      //   .catch(error => { commit(SET_CATCH, error, { root: true }) })
    },
    remove({ commit, state }) {
      var item = Object.assign({}, state.item)
      // FBStore.collection(collection).doc(item.id).delete()
      //   .then(docRef => {
      //     commit(REMOVE_ITEMS, item)
      //     commit(SET_MESSAGE, { text: 'Xóa hoàn toàn bản ghi thành công!', color: 'success' }, { root: true })
      //   })
      //   .then(() => { commit(SET_ITEM, state.default) })
      //   .catch(error => { commit(SET_CATCH, error, { root: true }) })
    },
    item({ commit, state }, item) {
      if (item) commit(SET_ITEM, item)
      else commit(SET_ITEM, state.default)
    },
    async getContract({ commit, state }) {
      await vnptbkn
        .get(collection + '/getContract?str=' + state.item.ma_gd)
        .then(function(res) {
          if (res.status == 200) {
            if (res.data.data && res.data.data.length > 0) commit('SET_CONTRACT', res.data.data)
          } else commit(SET_CATCH, null, { root: true })
        })
        .catch(function(error) { commit(SET_CATCH, error, { root: true }) })
    },
  }
}
