import { SET_CATCH, SET_ITEMS, PUSH_ITEMS, UPDATE_ITEMS, REMOVE_ITEMS, SET_ITEM, SET_MESSAGE } from '../mutation-type'
import { vnptbkn } from '@/plugins/axios-config'
import { join } from 'path';
const collection = 'navigation'
export default {
  namespaced: true,
  state: {
    items: [],
    item: {},
    selected: [],
    dialog: false,
    isGetFirst: true,
    url_plus: { push: '', go: '', store: '' },
    default: {
      id: 0,
      app_key: 'content-left',
      code: '',
      dependent: '',
      // parents: '',
      levels: 0,
      title: '',
      icon: '<i class="material-icons">view_module</i>',
      image: '',
      url: '',
      url_plus: '',
      push: '',
      go: '',
      store: '',
      orders: 1,
      descs: '',
      contents: '',
      created_by: '',
      created_at: new Date(),
      updated_by: '',
      updated_at: null,
      deleted_by: '',
      deleted_at: null,
      flag: 1
    },
    app_key: [{
        id: 'head-left',
        title: 'Trên trái'
      },
      {
        id: 'head-mid',
        title: 'Trên trung tâm'
      },
      {
        id: 'head-right',
        title: 'Trên phải'
      },
      {
        id: 'content-left',
        title: 'Nội dung trái'
      },
      {
        id: 'content-right',
        title: 'Nội dung phải'
      },
      {
        id: 'bottom-left',
        title: 'Dưới trái'
      },
      {
        id: 'bottom-mid',
        title: 'Dưới trung tâm'
      },
      {
        id: 'bottom-right',
        title: 'Dưới phải'
      }
    ]
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
      return state.items.filterValue(pagination.find)
    },
    getDependent: state => pagination => {
      const rs = state.items
        .filterValue(pagination.find)
        .filter(e => { return e.id != state.item.id })
        .sortByKey('dependent')
        .map(e => ({ 'id': e.id, 'title': e.title }))
      return rs
    },
    getRender: state => filter => {
      let items = state.items
        .filter(row => { return row.flag === 1 })
        .filter(row => { return row.app_key === filter.position })
      if (filter.roles && filter.roles.length > 0)
        items = items.filter(row => { return filter.roles.indexOf(row.url) > -1 })
      const rs = items
        .filter(row => { return row.dependent.indexOf(',0,') > -1 })
        .sortByKey('orders')
      // get children
      rs.forEach(e => {
        const _child = items.filter(row => { return row.dependent.indexOf(`,${e.id},`) > -1 })
        if (_child) _child.forEach(ee => {
          ee.children = items.filter(row => { return row.dependent.indexOf(`,${ee.id},`) > -1 })
        })
        e.children = _child
      })
      return rs
    }
  },
  mutations: {
    [SET_ITEMS](state, items) {
      state.items = items
    },
    [SET_ITEM](state, item) {
      if (item) {
        if (item.url_plus) state.url_plus = JSON.parse(item.url_plus)
        else state.url_plus = { push: '', go: '', store: '' }
        state.item = { ...item }
      } else state.item = { ...state.default }
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
    async select({ commit, rootGetters, state, rootState }, loading = true) {
      // Loading
      if (loading) rootState.$loadingGet = true
      // http
      await vnptbkn.get(collection).then(function(res) {
        if (res.status === 200) {
          if (res.data.msg === 'danger') {
            commit(SET_MESSAGE, { text: rootGetters.languages('error.data'), color: res.data.msg }, { root: true })
            return
          }
          if (res.data.data) {
            state.isGetFirst = false
            // res.data.data.forEach(e => { e.url_plus = e.url_plus ? JSON.parse(e.url_plus) : state.url_plus });
            commit(SET_ITEMS, res.data.data.sortByKey('orders').sortByKey('parent_id'))
          }
        } else commit(SET_CATCH, null, { root: true })
      }).catch(function(error) {
        commit(SET_CATCH, error, { root: true })
      }).finally(() => { if (loading) rootState.$loadingGet = false })
    },
    async insert({ commit, state, rootGetters, rootState }, loading = true) {
      // Loading
      if (loading) rootState.$loadingCommit = true
      // http
      state.item.created_by = vnptbkn.defaults.headers.Author
      state.item.created_at = new Date()
      //state.item.url_plus = JSON.stringify(state.url_plus)
      await vnptbkn.post(collection, state.item).then(function(res) {
        if (res.status == 200) {
          if (res.data.msg === 'exist') {
            commit(SET_MESSAGE, { text: rootGetters.languages('modules.err_exist'), color: 'warning' }, { root: true })
            return
          }
          if (res.data.msg === 'danger') {
            commit(SET_MESSAGE, { text: rootGetters.languages('error.data'), color: res.data.msg }, { root: true })
            return
          }
          // Success
          commit(PUSH_ITEMS, res.data.data)
          commit(SET_MESSAGE, { text: rootGetters.languages('success.add'), color: res.data.msg }, { root: true })
          state.url_plus = { push: '', go: '', store: '' }
        } else commit(SET_CATCH, null, { root: true })
      }).catch(function(error) {
        commit(SET_CATCH, error, { root: true })
      }).finally(() => {
        commit(SET_ITEM)
        if (loading) rootState.$loadingCommit = false
      })
    },
    async update({ commit, state, rootGetters, rootState }, loading = true) {
      // Loading
      if (loading) rootState.$loadingCommit = true
      // http
      state.item.updated_by = vnptbkn.defaults.headers.Author
      state.item.updated_at = new Date()
      state.item.url_plus = JSON.stringify(state.url_plus)
      await vnptbkn.put(collection, state.item).then(function(res) {
        if (res.status == 200) {
          if (res.data.msg === 'danger') {
            commit(SET_MESSAGE, { text: rootGetters.languages('error.data'), color: res.data.msg }, { root: true })
            return
          }
          // Success
          commit(UPDATE_ITEMS, state.item)
          commit(SET_MESSAGE, { text: rootGetters.languages('success.update'), color: res.data.msg }, { root: true })
        } else commit(SET_CATCH, null, { root: true })
      }).catch(function(error) {
        commit(SET_CATCH, error, { root: true })
      }).finally(() => {
        if (loading) rootState.$loadingCommit = false
      })
    },
    async delete({ commit, state, rootGetters, rootState }, loading = true) {
      // Loading
      if (loading) rootState.$loadingCommit = true
      // http
      const data = state.selected.map(x => ({ id: x.id, flag: x.flag === 0 ? 1 : 0 }))
      await vnptbkn.put(collection + '/delete', data).then(function(res) {
        if (res.status == 200) {
          if (res.data.msg === 'danger') {
            commit(SET_MESSAGE, { text: rootGetters.languages('error.data'), color: res.data.msg }, { root: true })
            return
          }
          // Success
          //state.selected.forEach(e => { commit(UPDATE_ITEMS, e) });
          state.selected.update(data, 'id')

          commit(SET_MESSAGE, { text: rootGetters.languages('success.delete'), color: res.data.msg }, { root: true })
        } else commit(SET_CATCH, null, { root: true })
      }).catch(function(error) {
        commit(SET_CATCH, error, { root: true })
      }).finally(() => {
        commit(SET_ITEM)
        state.selected = []
        if (loading) rootState.$loadingCommit = false
      })
    },
    async remove({ commit, state, rootGetters, rootState }, loading = true) {
      // Loading
      if (loading) rootState.$loadingCommit = true
      // http
      await vnptbkn.delete(collection, state.item).then(function(res) {
        if (res.status == 200) {
          if (res.data.msg === 'danger') {
            commit(SET_MESSAGE, { text: rootGetters.languages('error.data'), color: res.data.msg }, { root: true })
            return
          }
          // Success
          commit(REMOVE_ITEMS, state.item)
          commit(SET_MESSAGE, { text: rootGetters.languages('success.delete'), color: res.data.msg }, { root: true })
        } else commit(SET_CATCH, null, { root: true })
      }).catch(function(error) {
        commit(SET_CATCH, error, { root: true })
      }).finally(() => {
        commit(SET_ITEM)
        state.selected = []
        if (loading) rootState.$loadingCommit = false
      })
    },
    async item({ commit }, item) {
      commit(SET_ITEM, item)
    },
    existCode({ commit, state, rootState }, loading = true) {
      // Loading
      if (loading) rootState.$loadingCommit = true
      // http
      return vnptbkn.get(collection + '/ExistCode/' + state.item.code, { timeout: 1000 }).then(function(res) { //, { timeout: 3000 }
          if (res.status === 200) {
            if (res.data.msg === 'exist') return false
            else return true
          } else commit(SET_CATCH, null, { root: true })
        })
        .catch(function(error) {
          commit(SET_CATCH, error, { root: true })
          return Promise.reject(error)
        })
        .finally(() => { if (loading) rootState.$loadingCommit = false })
    }
  }
}
