import { SET_CATCH, SET_ITEMS, PUSH_ITEMS, UPDATE_ITEMS, REMOVE_ITEMS, SET_ITEM, SET_MESSAGE } from '../mutation-type'
const collection = 'languages_items'
export default {
  namespaced: true,
  state: {
    items: [],
    item: {},
    default: {
      code: '',
      modules: '',
      data: [],
      orders: 1,
      created_by: '',
      created_at: new Date(),
      updated_by: '',
      updated_at: null,
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
    }
  },
  actions: {
    select({ commit, state }) {
      // var first = FBStore.collection(collection).orderBy('created_at', 'asc')
      // var x = first.get().then(query => {
      //   var items = []
      //   query.forEach(function(doc) {
      //     var item = state.default
      //     item = doc.data()
      //     item.id = doc.id
      //     items.push(item)
      //   })
      //   commit(SET_ITEMS, items)
      // })
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
    }
  }
}
