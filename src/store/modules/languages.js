import { SET_CATCH, SET_ITEMS, PUSH_ITEMS, UPDATE_ITEMS, REMOVE_ITEMS, SET_ITEM, SET_MESSAGE } from '../mutation-type'
const collection = 'languages'
export default {
  namespaced: true,
  state: {
    items: [],
    item: {},
    default: {
      name: '',
      code: '',
      icon: '<i class="material-icons">outlined_flag</i>',
      desc: '',
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
      // if (query.search) {
      //   items = items.filter(function(row) {
      //     return Object.keys(row).some(function(key) {
      //       return String(row[key]).toLowerCase().indexOf(query.search) > -1
      //     })
      //   })
      // }
      // if (query.sort) {
      //   var order = query.direction === 'asc' ? -1 : 1
      //   items = items.slice().sort(function (a, b) {
      //     a = a[query.sort]
      //     b = b[query.sort]
      //     return (a === b ? 0 : a > b ? 1 : -1) * order
      //   })
      // }
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
    pagination({ commit, state }, { search, pagination }) {
      var items = []
      var obj = {
        search: [],
        orderBy: [],
        limit: 5
      }
      if (search) {
        obj.search.push('name', '>=', search)
        obj.search.push('name', '<=', search)
        // cll = cll.where('name', '==', 'lang 0')
      }
      if (pagination.sortBy) {
        obj.orderBy.push('name', pagination.descending ? 'desc' : 'asc')
        // cll = cll.orderBy('name', pagination.descending ? 'desc' : 'asc')
      }
      if (pagination.rowsPerPage) {
        obj.limit = 5
        // cll = cll.limit(5)
      }
      console.log(obj)
      if (obj.search.length > 0)
        state.cll
        .where(obj.search[0], obj.search[1], obj.search[2])
        .orderBy(obj.orderBy[0], obj.orderBy[1])
        .limit(obj.limit)
        .get().then(query => {
          query.forEach(function(doc) {
            var item = state.default
            item = doc.data()
            item.id = doc.id
            items.push(item)
          })
        })
      else
        state.cll
        .orderBy(obj.orderBy[0], obj.orderBy[1])
        .limit(obj.limit)
        .get().then(query => {
          query.forEach(function(doc) {
            var item = state.default
            item = doc.data()
            item.id = doc.id
            items.push(item)
          })
        })
      commit(SET_ITEMS, items)
    },
    select({ commit, state }) {
      // var first = FBStore.collection(collection).orderBy('created_at', 'asc')
      // var x = first.get().then(query => {
      //   var items = []
      //   query.forEach(function(doc) {
      //     // doc.data() is never undefined for query doc snapshots
      //     // console.log(doc.id, ' => ', doc.data())
      //     var item = state.default
      //     item = doc.data()
      //     item.id = doc.id
      //     items.push(item)
      //   })
      //   commit(SET_ITEMS, items)
      // })
      // first.get().then(querySnapshot => {
      //   // Get the last visible document
      //   var lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1]
      //   // console.log('last', lastVisible);
      //   // Construct a new query starting at this document,
      //   // get the next 5 cities.
      //   var next = FBStore.collection(collection)
      //     .orderBy('name', 'asc')
      //     .startAfter(lastVisible)
      //     .limit(5)
      //   // console.log(next)
      //   next.get().then(query => {
      //     var items = []
      //     query.forEach(function(doc) {
      //       // doc.data() is never undefined for query doc snapshots
      //       // console.log(doc.id, ' => ', doc.data())
      //       var item = state.default
      //       item = doc.data()
      //       item.id = doc.id
      //       items.push(item)
      //     })
      //     console.log(items);
      //     commit(SET_ITEMS, items)
      //   })
      // }).catch(function(error) { commit(SET_CATCH, error, { root: true }) })
    },
    async insert({ commit, state }) {
      var item = Object.assign({}, state.item)
      // item.created = { by: 'Admin', at: new Date() }
      // items.push(state.item)
      // for (let index = 0; index < 1000; index++) {
      item.created_by = 'Admin'
      item.created_at = new Date()
      // item.name = 'lang ' + index
      // return FBStore.collection(collection)
      //   .add(state.item)
      //   .then(docRef => {
      //     item.id = docRef.id
      //     commit(PUSH_ITEMS, item)
      //     commit(SET_MESSAGE, { text: 'Cập nhật thành công', color: 'success' }, { root: true })
      //   })
      //   .then(() => { commit(SET_ITEM, state.default) })
      //   .catch(error => { commit(SET_CATCH, error, { root: true }) })
      // }
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
