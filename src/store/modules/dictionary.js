import { vnptbkn } from '@/plugins/axios-config'
// import vi from '@/plugins/vi-VN.json'
const collection = 'dictionary'
export default {
  namespaced: true,
  state: {
    items: [],
    item: { module_code: 'global', key: '', value: '' },
    module_code: [],
    current_language: '',
    lang_code: 'vi-VN',
    lang_data: '',
    modules: ['global'],
    modules_default: ['global'],
    selected: [],
    valid: false,
    dialog: false,
    confirm: false,
    isGetFirst: true,
    pagination: { search: 'global', sortBy: 'key' },
    headers: [
      // { text: 'ID', value: 'id', align: 'left' },
      { text: 'Modules', value: 'module_code', align: 'left' },
      { text: 'Key', value: 'key', align: 'left' },
      { text: 'Value', value: 'value' },
      { text: '#', value: '#', sortable: false }
    ],
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
    getFilter: state => {
      return state.items
    }
    // headers: (state, getters, rootState, rootGetters) => {
    //   state.headers.forEach(e => { e.text = rootGetters.languages(e.text) })
    //   return state.headers
    // }
  },
  mutations: {
    SET_ITEMS(state, items) {
      state.modules = [...new Set(items.map(x => x.module_code))]
      state.items = [...items]
    },
    SET_ITEM(state, item) {
      if (item) state.item = { ...item }
      else {
        state.item.id = 0
        state.item.key = ''
        state.item.value = ''
      }
    },
    SET_ITEM_ID(state, id) {
      if (id) state.item = { ...state.items.find(x => x.id == id) }
      else {
        state.item.id = 0
        state.item.key = ''
        state.item.value = ''
      }
    },
    PUSH_ITEMS(state, item) {
      if (state.modules.indexOf(item.module_code) < 0)
        state.modules.push(item.module_code)
      state.items.push({ ...item })
    },
    UPDATE_ITEMS(state, item) {
      state.items.update(item, 'id')
    },
    REMOVE_ITEMS(state, item) {
      state.items.remove(item, 'id')
    },
    SET_LANG_DATA(state, data) {
      var rs = {}
      data.forEach(e => {
        if (rs[e.module_code] != undefined) rs[e.module_code][e.key] = e.value
        else rs[e.module_code] = JSON.parse(`{"${e.key}":"${e.value}"}`)
      })
      state.lang_data = JSON.stringify(rs)
    }
  },
  actions: {
    async select({ commit, state, rootGetters, rootState }, loading = true) {
      // Loading
      if (loading) rootState.$loadingGet = true
      // http
      await vnptbkn.get(collection).then(function (res) {
        if (res.status === 200) {
          if (res.data.msg === 'danger') {
            commit('SET_MESSAGE', { text: rootGetters.languages('error.data'), color: res.data.msg }, { root: true })
            return
          }
          if (res.data.data) {
            commit('SET_ITEMS', res.data.data)
          }
        } else commit('SET_CATCH', null, { root: true })
      }).catch(error => { commit('SET_CATCH', error, { root: true }) })
        .finally(() => {
          state.isGetFirst = false
          if (loading) rootState.$loadingGet = false
        })
    },
    async selectByLang({ commit, state, rootGetters, rootState }, loading = true) {
      // Loading
      if (loading) rootState.$loadingGet = true
      // http
      state.lang_code = state.lang_code || state.default.lang_code
      await vnptbkn.get(`${collection}/GetByLanguage/${state.lang_code}`).then(function (res) {
        if (res.status === 200) {
          if (res.data.msg === 'danger') {
            commit('SET_MESSAGE', { text: rootGetters.languages('error.data'), color: res.data.msg }, { root: true })
            return
          }
          if (res.data.data) {
            state.isGetFirst = false
            commit('SET_ITEMS', res.data.data)
          }
        } else commit('SET_CATCH', null, { root: true })
      }).catch(error => { commit('SET_CATCH', error, { root: true }) })
        .finally(() => { if (loading) rootState.$loadingGet = false })
    },
    async insert({ commit, state, rootGetters, rootState }, loading = true) {
      // Loading
      if (loading) rootState.$loadingCommit = true
      // http
      const data = { ...state.item, ...{ lang_code: state.lang_code } }
      await vnptbkn.post(collection, data).then(function (res) {
        if (res.status == 200) {
          if (res.data.msg === 'exist') {
            commit('SET_MESSAGE', { text: rootGetters.languages('error.exist'), color: 'warning' }, { root: true })
            return
          }
          if (res.data.msg === 'danger') {
            commit('SET_MESSAGE', { text: rootGetters.languages('error.data'), color: res.data.msg }, { root: true })
            return
          }
          // Success
          state.item.key = ''
          state.item.value = ''
          commit('PUSH_ITEMS', data)
          commit('SET_MESSAGE', { text: rootGetters.languages('success.add'), color: res.data.msg }, { root: true })
        } else commit('SET_CATCH', null, { root: true })
      }).catch((error) => { commit('SET_CATCH', error, { root: true }) })
        .finally(() => { if (loading) rootState.$loadingCommit = false })
    },
    async update({ commit, state, rootGetters, rootState }, loading = true) {
      // Loading
      if (loading) rootState.$loadingCommit = true
      // http
      const data = { ...state.item, ...{ lang_code: state.lang_code } }
      await vnptbkn.put(collection, data).then(function (res) {
        if (res.status == 200) {
          if (res.data.msg === 'danger') {
            commit('SET_MESSAGE', { text: rootGetters.languages('error.data'), color: res.data.msg }, { root: true })
            return
          }
          // Success
          commit('UPDATE_ITEMS', data)
          commit('SET_MESSAGE', { text: rootGetters.languages('success.update'), color: res.data.msg }, { root: true })
        } else commit('SET_CATCH', null, { root: true })
      }).catch((error) => { commit('SET_CATCH', error, { root: true }) })
        .finally(() => { if (loading) rootState.$loadingCommit = false })
    },
    async delete({ commit, state, rootGetters, rootState }, loading = true) {
      // Loading
      if (loading) rootState.$loadingCommit = true
      // http
      await vnptbkn.put(`${collection}/delete`, state.selected.map(x => ({ id: x.id, flag: x.flag === 0 ? 1 : 0 }))).then(function (res) {
        if (res.status == 200) {
          if (res.data.msg === 'danger') {
            commit('SET_MESSAGE', { text: rootGetters.languages('error.data'), color: res.data.msg }, { root: true })
            return
          }
          // Success
          // commit(REMOVE_ITEMS, data)
          //state.selected.forEach(e => { commit(REMOVE_ITEMS, e) })
          state.selected = []
          commit('SET_ITEM')
          commit('SET_MESSAGE', { text: rootGetters.languages('success.delete'), color: res.data.msg }, { root: true })
        } else commit('SET_CATCH', null, { root: true })
      }).catch((error) => { commit('SET_CATCH', error, { root: true }) })
        .finally(() => { if (loading) rootState.$loadingCommit = false })
    }
  }
}
