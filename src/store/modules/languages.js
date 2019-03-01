import { SET_CATCH, SET_ITEMS, PUSH_ITEMS, UPDATE_ITEMS, REMOVE_ITEMS, SET_ITEM, SET_MESSAGE } from '../mutation-type'
import { vnptbkn } from '@/plugins/axios-config'
const collection = 'languages'
export default {
  namespaced: true,
  state: {
    items: [],
    item: {},
    languages_default: 'vi-VN',
    default: {
      id: '',
      code: '',
      title: '',
      icon: '<i class="material-icons">outlined_flag</i>',
      attach: '',
      orders: 1,
      descs: '',
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
    getFilter: state => pagination => {
      // let items = state.items
      // if (pagination.flag >= 0) {
      //   items = items.filter(function(row) {
      //     return row['flag'] == pagination.flag
      //   })
      // }
      // if (pagination.search) {
      //   items = items.filter(function(row) {
      //     return Object.keys(row).some(function(key) {
      //       return (String(row[key]).toLowerCase().indexOf(pagination.search) > -1)
      //     })
      //   })
      // }
      // let items = [...state.items]
      // items = FilterValue(items, pagination.find)
      // items = SearchValue(items, pagination.search)
      // items = SortByKey(items, pagination.sortBy)
      // items.FilterValue(pagination.find)
      // items.SearchValue(pagination.search)
      // items.SortByKey(pagination.sortBy)
      return state.items.filterValue(pagination.find)
    }
  },
  mutations: {
    [SET_ITEMS](state, items) {
      state.items = items
    },
    [SET_ITEM](state, item) {
      state.item = { ...item }
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
    async select({ commit, state }) {
      await vnptbkn.get(collection).then(function(res) {
          if (res.status === 200) {
            if (res.data.data) commit(SET_ITEMS, res.data.data)
          } else commit(SET_CATCH, null, { root: true })
        })
        .catch(function(error) { commit(SET_CATCH, error, { root: true }) })
    },
    async insert({ commit, state, rootGetters }) {
      state.item.created_by = vnptbkn.defaults.headers.Author
      state.item.created_at = new Date()
      await vnptbkn.post(collection, state.item).then(function(res) {
          if (res.status == 200) {
            if (res.data.msg === 'exist') {
              commit(SET_MESSAGE, { text: rootGetters.languages('languages.msg_err_code_exist'), color: 'warning' }, { root: true })
              return
            }
            if (res.data.msg === 'danger') {
              commit(SET_MESSAGE, { text: rootGetters.languages('messages.err_data'), color: res.data.msg }, { root: true })
              return
            }
            // Success
            commit(PUSH_ITEMS, res.data.data)
            commit(SET_MESSAGE, { text: rootGetters.languages('messages.suc_add'), color: res.data.msg }, { root: true })
          } else commit(SET_CATCH, null, { root: true })
        })
        .catch(function(error) { commit(SET_CATCH, error, { root: true }) })
    },
    async update({ commit, state, rootGetters }) {
      state.item.updated_by = vnptbkn.defaults.headers.Author
      state.item.updated_at = new Date()
      await vnptbkn.put(collection, state.item).then(function(res) {
          if (res.status == 200) {
            if (res.data.msg === 'danger') {
              commit(SET_MESSAGE, { text: rootGetters.languages('messages.err_data'), color: res.data.msg }, { root: true })
              return
            }
            // Success
            commit(UPDATE_ITEMS, state.item)
            commit(SET_MESSAGE, { text: rootGetters.languages('messages.suc_update'), color: res.data.msg }, { root: true })
          } else commit(SET_CATCH, null, { root: true })
        })
        .catch(function(error) { commit(SET_CATCH, error, { root: true }) })
    },
    async delete({ commit, rootGetters }, selected) {
      var _selected = [...selected]
      for (let i = 0; i < _selected.length; i++) _selected[i].flag = _selected[i].flag === 0 ? 1 : 0
      await vnptbkn.put(collection + '/delete', _selected).then(function(res) {
          if (res.status == 200) {
            if (res.data.msg === 'danger') {
              commit(SET_MESSAGE, { text: rootGetters.languages('messages.err_data'), color: res.data.msg }, { root: true })
              return
            }
            // Success
            _selected.forEach(e => { commit(UPDATE_ITEMS, e) });
            commit(SET_MESSAGE, { text: rootGetters.languages('messages.suc_delete'), color: res.data.msg }, { root: true })
          } else commit(SET_CATCH, null, { root: true })
        })
        .catch(function(error) { commit(SET_CATCH, error, { root: true }) })
    },
    async remove({ commit, state, rootGetters }) {
      await vnptbkn.delete(collection, state.item).then(function(res) {
          if (res.status == 200) {
            if (res.data.msg === 'danger') {
              commit(SET_MESSAGE, { text: rootGetters.languages('messages.err_data'), color: res.data.msg }, { root: true })
              return
            }
            // Success
            commit(REMOVE_ITEMS, state.item)
            commit(SET_MESSAGE, { text: rootGetters.languages('messages.suc_delete'), color: res.data.msg }, { root: true })
          } else commit(SET_CATCH, null, { root: true })
        })
        .catch(function(error) { commit(SET_CATCH, error, { root: true }) })
    },
    async item({ commit, state }, item) {
      if (item) commit(SET_ITEM, item)
      else commit(SET_ITEM, state.default)
    },
    existCode({ commit }, val) {
      return vnptbkn.get(collection + '/ExistCode/' + val, { timeout: 1000 }).then(function(res) { //, { timeout: 3000 }
          if (res.status === 200) {
            if (res.data.msg === 'exist') return false
            else return true
          } else commit(SET_CATCH, null, { root: true })
        })
        .catch(function(error) {
          commit(SET_CATCH, error, { root: true })
          return Promise.reject(error)
        })
    }
  }
}
