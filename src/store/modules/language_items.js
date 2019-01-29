import { SET_CATCH, SET_ITEMS, PUSH_ITEMS, UPDATE_ITEMS, REMOVE_ITEMS, SET_ITEM, SET_MESSAGE } from '../mutation-type'
import { FilterValue, SearchValue, SortByKey } from '@/plugins/helpers'
import { vnptbkn } from '@/plugins/axios-config'
const collection = 'language-items'
export default {
  namespaced: true,
  state: {
    items: [],
    item: {},
    default: {
      id: 0,
      lang_code: '',
      module_code: '',
      key: '',
      value: ''
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
      await vnptbkn
        .get(collection)
        .then(function(res) {
          if (res.status === 200) {
            if (res.data.data) commit(SET_ITEMS, res.data.data)
          } else commit(SET_CATCH, null, { root: true })
        })
        .catch(function(error) { commit(SET_CATCH, error, { root: true }) })
    },
    async insert({ commit, state }) {
      state.item.created_by = vnptbkn.defaults.headers.Author
      state.item.created_at = new Date()
      await vnptbkn
        .post(collection, state.item)
        .then(function(res) {
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
      await vnptbkn
        .put(collection, state.item)
        .then(function(res) {
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
      await vnptbkn
        .put(collection + '/delete', _selected)
        .then(function(res) {
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
      await vnptbkn
        .delete(collection, state.item)
        .then(function(res) {
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
    }
  }
}
