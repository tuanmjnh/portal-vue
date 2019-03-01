import { SET_CATCH, SET_ITEMS, PUSH_ITEMS, UPDATE_ITEMS, REMOVE_ITEMS, SET_ITEM, SET_MESSAGE } from '../mutation-type'
import { vnptbkn } from '@/plugins/axios-config'
// import vi from '@/plugins/vi-VN.json'
const collection = 'language-items'
export default {
  namespaced: true,
  state: {
    items: [],
    item: { module_code: 'global' },
    module_code: [],
    current_language: '',
    lang_code: 'vi-VN',
    lang_data: '',
    modules: ['global'],
    modules_default: ['global'],
    default: {
      id: 0,
      lang_code: 'vi-VN',
      module_code: 'global',
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
      return state.items
    }
  },
  mutations: {
    [SET_ITEMS](state, items) {
      state.modules = [...new Set(items.map(x => x.module_code))]
      state.items = [...items]
    },
    [SET_ITEM](state, item) {
      state.item = { ...item }
    },
    [PUSH_ITEMS](state, item) {
      if (state.modules.indexOf(item.module_code) < 0)
        state.modules.push(item.module_code)
      state.items.push({ ...item })
    },
    [UPDATE_ITEMS](state, item) {
      const index = state.items.findIndex(x => x.id === item.id)
      state.items.splice(index, 1, item)
    },
    [REMOVE_ITEMS](state, item) {
      const index = state.items.findIndex(x => x.id === item.id)
      if (index >= 0) state.items.splice(index, 1)
    },
    'SET_LANG_DATA'(state, data) {
      var rs = {}
      data.forEach(e => {
        if (rs[e.module_code] != undefined)
          rs[e.module_code][e.key] = e.value
        else rs[e.module_code] = JSON.parse(`{"${e.key}":"${e.value}"}`)
      });
      state.lang_data = JSON.stringify(rs)
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
    async selectByLang({ commit, state }) {
      state.lang_code = state.lang_code || state.default.lang_code
      await vnptbkn
        .get(`${collection}/getlang/${state.lang_code}`)
        .then(function(res) {
          if (res.status === 200) {
            if (res.data.data) commit(SET_ITEMS, res.data.data)
          } else commit(SET_CATCH, null, { root: true })
        })
        .catch(function(error) { commit(SET_CATCH, error, { root: true }) })
    },
    async insert({ commit, state, rootGetters }) {
      // state.item.created_by = vnptbkn.defaults.headers.Author
      // state.item.created_at = new Date()
      const data = { ...state.item, ...{ lang_code: state.lang_code } }
      await vnptbkn
        .post(collection, data)
        .then(function(res) {
          if (res.status == 200) {
            if (res.data.msg === 'exist') {
              commit(SET_MESSAGE, { text: rootGetters.languages('messages.err_exist'), color: 'warning' }, { root: true })
              return
            }
            if (res.data.msg === 'danger') {
              commit(SET_MESSAGE, { text: rootGetters.languages('messages.err_data'), color: res.data.msg }, { root: true })
              return
            }
            // Success
            state.item.key = ''
            state.item.value = ''
            commit(PUSH_ITEMS, data)
            commit(SET_MESSAGE, { text: rootGetters.languages('messages.suc_add'), color: res.data.msg }, { root: true })
          } else commit(SET_CATCH, null, { root: true })
        })
        .catch(function(error) { commit(SET_CATCH, error, { root: true }) })
    },
    async update({ commit, state, rootGetters }) {
      const data = { ...state.item, ...{ lang_code: state.lang_code } }
      await vnptbkn
        .put(collection, data)
        .then(function(res) {
          if (res.status == 200) {
            if (res.data.msg === 'danger') {
              commit(SET_MESSAGE, { text: rootGetters.languages('messages.err_data'), color: res.data.msg }, { root: true })
              return
            }
            // Success
            commit(UPDATE_ITEMS, data)
            commit(SET_MESSAGE, { text: rootGetters.languages('messages.suc_update'), color: res.data.msg }, { root: true })
          } else commit(SET_CATCH, null, { root: true })
        })
        .catch(function(error) { commit(SET_CATCH, error, { root: true }) })
    },
    async delete({ commit, state, rootGetters }, selected) {
      var _selected = [...selected]
      await vnptbkn
        .put(`${collection}/delete`, _selected)
        .then(function(res) {
          if (res.status == 200) {
            if (res.data.msg === 'danger') {
              commit(SET_MESSAGE, { text: rootGetters.languages('messages.err_data'), color: res.data.msg }, { root: true })
              return
            }
            // Success
            // commit(REMOVE_ITEMS, data)
            _selected.forEach(e => { commit(REMOVE_ITEMS, e) });
            commit(SET_MESSAGE, { text: rootGetters.languages('messages.suc_delete'), color: res.data.msg }, { root: true })
          } else commit(SET_CATCH, null, { root: true })
        })
        .catch(function(error) { commit(SET_CATCH, error, { root: true }) })
    },
    async remove({ commit, state, rootGetters }, selected) {
      var _selected = [...selected]
      await vnptbkn
        .delete(collection, _selected)
        .then(function(res) {
          if (res.status == 200) {
            if (res.data.msg === 'danger') {
              commit(SET_MESSAGE, { text: rootGetters.languages('messages.err_data'), color: res.data.msg }, { root: true })
              return
            }
            // Success
            _selected.forEach(e => { commit(REMOVE_ITEMS, e) });
            commit(SET_MESSAGE, { text: rootGetters.languages('messages.suc_delete'), color: res.data.msg }, { root: true })
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
