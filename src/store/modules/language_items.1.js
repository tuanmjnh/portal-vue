import { SET_CATCH, SET_ITEMS, PUSH_ITEMS, UPDATE_ITEMS, REMOVE_ITEMS, SET_ITEM, SET_MESSAGE } from '../mutation-type'
import { FilterValue, SearchValue, SortByKey } from '@/plugins/helpers'
import { vnptbkn } from '@/plugins/axios-config'
// import vi from '@/plugins/vi-VN.json'
const collection = 'language-items'
export default {
  namespaced: true,
  state: {
    items: [],
    item: { module_code: 'global', key: '', value: '' },
    module_code: [],
    current_language: '',
    lang_code: 'vi-VN',
    lang_data: '',
    modules: [],
    modules_default: ['global'],
    item_default: { module_code: 'global', key: '', value: '' },
    default: { lang_code: 'vi-VN', lang_data: {} }
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
      let items = state.items
      items = FilterValue(items, pagination.find)
      items = SearchValue(items, pagination.search)
      items = SortByKey(items, pagination.sortBy)
      return items
    }
  },
  mutations: {
    [SET_ITEMS](state, lang_data) {
      state.items = []
      state.modules = state.modules_default
      let _tmp = lang_data ? JSON.parse(lang_data) : null
      if (_tmp)
        Object.keys(_tmp).forEach(function(key, index) {
          state.modules.push(key)
          Object.keys(_tmp[key]).forEach(function(skey, sindex) {
            state.items.push({ module_code: key, key: skey, value: _tmp[key][skey] })
          })
        })
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
      const index = state.items.findIndex(x =>
        x.module_code === item.module_code &&
        x.key === item.key &&
        x.value === item.value)
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
            state.lang_data = ''
            if (res.data.data && res.data.data.length > 0)
              state.lang_data = res.data.data[0].lang_data // JSON.stringify(vi)
            commit(SET_ITEMS, state.lang_data)
          } else commit(SET_CATCH, null, { root: true })
        })
        .catch(function(error) { commit(SET_CATCH, error, { root: true }) })
    },
    async insert({ commit, state, rootGetters }) {
      // state.item.created_by = vnptbkn.defaults.headers.Author
      // state.item.created_at = new Date()
      // state.lang_data = { ...(typeof state.lang_data === 'string' ? (state.lang_data ? JSON.parse(state.lang_data) : {}) : state.lang_data), ...data }
      // state.lang_data = { ...(typeof state.lang_data === 'string' ? (state.lang_data ? JSON.parse(state.lang_data) : {}) : state.lang_data) }
      // if (Object.keys(state.lang_data).length) {
      //   if (state.lang_data[state.item.module_code] != undefined)
      //     state.lang_data[state.item.module_code][state.item.key] = state.item.value
      //   else state.lang_data = { ...state.lang_data, ...JSON.parse(`{"${state.item.module_code}":{"${state.item.key}":"${state.item.value}"}}`) }
      // } else state.lang_data = JSON.parse(`{"${state.item.module_code}":{"${state.item.key}":"${state.item.value}"}}`)
      // state.lang_data = JSON.stringify(state.lang_data)
      commit(PUSH_ITEMS, state.item)
      commit('SET_LANG_DATA', state.items)
      await vnptbkn
        .post(collection, {
          'lang_code': state.lang_code,
          'lang_data': state.lang_data
        })
        .then(function(res) {
          if (res.status == 200) {
            if (res.data.msg === 'exist') {
              commit(SET_MESSAGE, {
                color: 'warning',
                text: rootGetters.languages('messages.err_exist')
              }, { root: true })
              return
            }
            if (res.data.msg === 'danger') {
              commit(SET_MESSAGE, {
                color: res.data.msg,
                text: rootGetters.languages('messages.err_data')
              }, { root: true })
              return
            }
            // Success
            state.item.key = ''
            state.item.value = ''
            commit(SET_MESSAGE, {
              color: res.data.msg,
              text: rootGetters.languages('messages.suc_add')
            }, { root: true })
          } else commit(SET_CATCH, null, { root: true })
        })
        .catch(function(error) { commit(SET_CATCH, error, { root: true }) })
    },
    async update({ commit, state, rootGetters }, items) {
      if (items) commit('SET_LANG_DATA', items)
      await vnptbkn
        .put(collection, {
          'lang_code': state.lang_code,
          'lang_data': state.lang_data
        })
        .then(function(res) {
          if (res.status == 200) {
            if (res.data.msg === 'danger') {
              commit(SET_MESSAGE, {
                color: res.data.msg,
                text: rootGetters.languages('messages.err_data')
              }, { root: true })
              return
            }
            // Success
            commit(SET_ITEMS, state.lang_data)
            commit(SET_MESSAGE, {
              color: res.data.msg,
              text: rootGetters.languages('messages.suc_update')
            }, { root: true })
          } else commit(SET_CATCH, null, { root: true })
        })
        .catch(function(error) { commit(SET_CATCH, error, { root: true }) })
    },
    async delete({ commit, state, rootGetters }) {
      commit(REMOVE_ITEMS, state.item)
      commit('SET_LANG_DATA', state.items)
      await vnptbkn
        .put(collection, {
          'lang_code': state.lang_code,
          'lang_data': state.lang_data
        })
        .then(function(res) {
          if (res.status == 200) {
            if (res.data.msg === 'danger') {
              commit(SET_MESSAGE, {
                color: res.data.msg,
                text: rootGetters.languages('messages.err_data')
              }, { root: true })
              return
            }
            // Success
            commit(SET_ITEMS, state.lang_data)
            commit(SET_MESSAGE, {
              color: res.data.msg,
              text: rootGetters.languages('messages.suc_delete')
            }, { root: true })
          } else commit(SET_CATCH, null, { root: true })
        })
        .catch(function(error) { commit(SET_CATCH, error, { root: true }) })
    },
    async remove({ commit, state, rootGetters }) {
      await vnptbkn
        .delete(collection, state.item)
        .then(function(res) {
          if (res.status == 200) {
            if (res.data.msg === 'danger') {
              commit(SET_MESSAGE, {
                color: res.data.msg,
                text: rootGetters.languages('messages.err_data')
              }, { root: true })
              return
            }
            // Success
            commit(REMOVE_ITEMS, state.item)
            commit(SET_MESSAGE, {
              color: res.data.msg,
              text: rootGetters.languages('messages.suc_delete')
            }, { root: true })
          } else commit(SET_CATCH, null, { root: true })
        })
        .catch(function(error) { commit(SET_CATCH, error, { root: true }) })
    },
    async item({ commit, state }, item) {
      if (item) commit(SET_ITEM, item)
      else commit(SET_ITEM, state.item_default)
    }
  }
}
