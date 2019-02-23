import { SET_CATCH, SET_ITEMS, PUSH_ITEMS, UPDATE_ITEMS, REMOVE_ITEMS, SET_ITEM, SET_MESSAGE } from '../mutation-type'
import { FilterValue, SearchValue, SortByKey } from '@/plugins/helpers'
import { vnptbkn } from '@/plugins/axios-config'
const collection = 'contract-enterprise'
export default {
  namespaced: true,
  state: {
    items: [],
    item: {},
    default: {
      contract_enterprise_id: '',
      app_key: '',
      local_id: 0,
      group_id: 0,
      contract_code: '',
      customer_name: '',
      customer_address: '',
      tax_code: '',
      start_at: new Date(),
      end_at: new Date(),
      quantity: 1,
      price: '',
      details: '',
      contents: '',
      attach: '',
      created_by: '',
      created_at: new Date(),
      updated_by: '',
      updated_at: null,
      deleted_by: '',
      deleted_at: null,
      flag: 1,
      type_id: 1
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
    }
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
    async insert({ commit, state, rootGetters }) {
      var item = Object.assign({}, state.item)
      item.created_by = 'Admin'
      item.created_at = new Date()
      // return FBStore.collection(collection)
      //   .add(state.item)
      //   .then(docRef => {
      //     item.id = docRef.id
      //     commit(PUSH_ITEMS, item)
      //     commit(SET_MESSAGE, { text: rootGetters.languages('messages.suc_add'), color: 'success' }, { root: true })
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
    }
  }
}
