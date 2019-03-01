import { SET_CATCH, SET_ITEMS, PUSH_ITEMS, UPDATE_ITEMS, REMOVE_ITEMS, SET_ITEM, SET_MESSAGE } from '../mutation-type'
import { vnptbkn } from '@/plugins/axios-config'
const collection = 'modules'
export default {
  namespaced: true,
  state: {
    items: [],
    item: {},
    default: {
      id: '',
      code: '',
      title: '',
      icon: '<i class="material-icons">view_module</i>',
      image: '',
      urls: '',
      permissions: '',
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
      return state.items.filterValue(pagination.find)
    },
    getCodeFilter: state => pagination => {
      return state.items.map(e => e.code)
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
    async select({ commit, state }) {
      await vnptbkn.get(collection).then(function(res) {
          if (res.status === 200) {
            if (res.data.data) commit(SET_ITEMS, res.data.data)
          } else commit(SET_CATCH, null, { root: true })
        })
        .catch(function(error) { commit(SET_CATCH, error, { root: true }) })
    },
    async insert({ commit, state }) {
      state.item.created_by = vnptbkn.defaults.headers.Author
      state.item.created_at = new Date()
      await vnptbkn.post(collection, state.item).then(function(res) {
          if (res.status == 200) {
            if (res.data.msg === 'exist') {
              commit(SET_MESSAGE, { text: 'Mã ngôn ngữ tồn tại!', color: 'warning' }, { root: true })
              return
            }
            if (res.data.msg === 'danger') {
              commit(SET_MESSAGE, { text: 'Lỗi dữ liệu, vui lòng thử lại!', color: res.data.msg }, { root: true })
              return
            }
            // Success
            commit(PUSH_ITEMS, res.data.data)
            commit(SET_MESSAGE, { text: 'Thêm mới thành công!', color: res.data.msg }, { root: true })
          } else commit(SET_CATCH, null, { root: true })
        })
        .catch(function(error) { commit(SET_CATCH, error, { root: true }) })
    },
    async update({ commit, state }) {
      state.item.updated_by = vnptbkn.defaults.headers.Author
      state.item.updated_at = new Date()
      await vnptbkn.put(collection, state.item).then(function(res) {
          if (res.status == 200) {
            if (res.data.msg === 'danger') {
              commit(SET_MESSAGE, { text: 'Lỗi dữ liệu, vui lòng thử lại!', color: res.data.msg }, { root: true })
              return
            }
            // Success
            commit(UPDATE_ITEMS, state.item)
            commit(SET_MESSAGE, { text: 'Cập nhật thành công!', color: res.data.msg }, { root: true })
          } else commit(SET_CATCH, null, { root: true })
        })
        .catch(function(error) { commit(SET_CATCH, error, { root: true }) })
    },
    async delete({ commit }, selected) {
      var _selected = [...selected]
      for (let i = 0; i < _selected.length; i++) _selected[i].flag = _selected[i].flag === 0 ? 1 : 0
      await vnptbkn.put(collection + '/delete', _selected).then(function(res) {
          if (res.status == 200) {
            if (res.data.msg === 'danger') {
              commit(SET_MESSAGE, { text: 'Lỗi dữ liệu, vui lòng thử lại!', color: res.data.msg }, { root: true })
              return
            }
            // Success
            _selected.forEach(e => { commit(UPDATE_ITEMS, e) });
            commit(SET_MESSAGE, { text: 'Cập nhật thành công!', color: res.data.msg }, { root: true })
          } else commit(SET_CATCH, null, { root: true })
        })
        .catch(function(error) { commit(SET_CATCH, error, { root: true }) })
    },
    async remove({ commit, state }) {
      await vnptbkn.delete(collection, state.item).then(function(res) {
          if (res.status == 200) {
            if (res.data.msg === 'danger') {
              commit(SET_MESSAGE, { text: 'Lỗi dữ liệu, vui lòng thử lại!', color: res.data.msg }, { root: true })
              return
            }
            // Success
            commit(REMOVE_ITEMS, state.item)
            commit(SET_MESSAGE, { text: 'Cập nhật thành công!', color: res.data.msg }, { root: true })
          } else commit(SET_CATCH, null, { root: true })
        })
        .catch(function(error) { commit(SET_CATCH, error, { root: true }) })
    },
    async item({ commit, state }, item) {
      if (item) commit(SET_ITEM, item)
      else commit(SET_ITEM, state.default)
    },
    existCode({ commit, state }) {
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
    }
  }
}
