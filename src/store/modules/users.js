import { vnptbkn } from '@/plugins/axios-config'
const collection = 'users'
export default {
  namespaced: true,
  state: {
    items: [],
    item: {},
    donvi_id: 0,
    selected: [],
    dialog: false,
    isGetFirst: true,
    default: {
      user_id: '',
      parent_id: '',
      group_id: '',
      username: '',
      password: '',
      salt: '',
      full_name: '',
      email: '',
      mobile: '',
      address: '',
      descs: '',
      images: '',
      created_by: '',
      created_at: new Date(),
      updated_by: '',
      updated_at: null,
      deleted_by: '',
      deleted_at: null,
      last_login: null,
      last_change_password: null,
      donvi_id: 5588,
      roles_id: '',
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
    getFilterDonvi: state => pagination => {
      if (state.donvi_id > 0)
        return state.items.filterValue({ ...pagination.find, ...{ donvi_id: state.donvi_id } })
      else
        return state.items.filterValue(pagination.find)
    }
  },
  mutations: {
    SET_ITEMS(state, items) {
      state.items = items
    },
    SET_ITEM(state, item) {
      state.item = item ? { ...item } : { ...state.default }
    },
    PUSH_ITEMS(state, item) {
      state.items.push(item)
    },
    UPDATE_ITEMS(state, item) {
      state.items.update(item)
    },
    REMOVE_ITEMS(state, item) {
      state.items.remove(item)
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
            state.isGetFirst = false
            commit('SET_ITEMS', res.data.data)
          }
        } else commit('SET_CATCH', null, { root: true })
      }).catch(function (error) {
        commit('SET_CATCH', error, { root: true })
      }).finally(() => { if (loading) rootState.$loadingGet = false })
    },
    async insert({ commit, state, rootGetters, rootState }, loading = true) {
      // Loading
      if (loading) rootState.$loadingCommit = true
      // http
      state.item.created_by = vnptbkn.defaults.headers.Author
      state.item.created_at = new Date()
      await vnptbkn.post(collection, state.item).then(function (res) {
        if (res.status == 200) {
          if (res.data.msg === 'exist') {
            commit('SET_MESSAGE', { text: rootGetters.languages('modules.err_exist'), color: 'warning' }, { root: true })
            return
          }
          if (res.data.msg === 'danger') {
            commit('SET_MESSAGE', { text: rootGetters.languages('error.data'), color: res.data.msg }, { root: true })
            return
          }
          // Success
          commit('PUSH_ITEMS', res.data.data)
          commit('SET_ITEM')
          commit('SET_MESSAGE', { text: rootGetters.languages('success.add'), color: res.data.msg }, { root: true })
        } else commit('SET_CATCH', null, { root: true })
      }).catch(function (error) {
        commit('SET_CATCH', error, { root: true })
      }).finally(() => { if (loading) rootState.$loadingCommit = false })
    },
    async update({ commit, state, rootGetters, rootState }, loading = true) {
      // Loading
      if (loading) rootState.$loadingCommit = true
      // http
      state.item.updated_by = vnptbkn.defaults.headers.Author
      state.item.updated_at = new Date()
      await vnptbkn.put(collection, state.item).then(function (res) {
        if (res.status == 200) {
          if (res.data.msg === 'danger') {
            commit('SET_MESSAGE', { text: rootGetters.languages('error.data'), color: res.data.msg }, { root: true })
            return
          }
          // Success
          commit('UPDATE_ITEMS', state.item)
          commit('SET_MESSAGE', { text: rootGetters.languages('success.update'), color: res.data.msg }, { root: true })
        } else commit('SET_CATCH', null, { root: true })
      }).catch(function (error) {
        commit('SET_CATCH', error, { root: true })
      }).finally(() => { if (loading) rootState.$loadingCommit = false })
    },
    async delete({ commit, state, rootGetters, rootState }, loading = true) {
      // Loading
      if (loading) rootState.$loadingCommit = true
      // http
      const data = state.selected.map(x => ({ id: x.user_id, flag: x.flag === 0 ? 1 : 0 }))
      await vnptbkn.put(collection + '/delete', data).then(function (res) {
        if (res.status == 200) {
          if (res.data.msg === 'danger') {
            commit('SET_MESSAGE', { text: rootGetters.languages('error.data'), color: res.data.msg }, { root: true })
            return
          }
          // Success
          //state.selected.forEach(e => { commit(UPDATE_ITEMS, e) });
          state.selected.update(data, 'id')
          state.selected = []
          commit('SET_ITEM')
          commit('SET_MESSAGE', { text: rootGetters.languages('success.delete'), color: res.data.msg }, { root: true })
        } else commit('SET_CATCH', null, { root: true })
      }).catch(function (error) {
        commit('SET_CATCH', error, { root: true })
      }).finally(() => { if (loading) rootState.$loadingCommit = false })
    },
    async remove({ commit, state, rootGetters, rootState }, loading = true) {
      // Loading
      if (loading) rootState.$loadingCommit = true
      // http
      await vnptbkn.delete(collection, state.selected).then(function (res) {
        if (res.status == 200) {
          if (res.data.msg === 'danger') {
            commit('SET_MESSAGE', { text: rootGetters.languages('error.data'), color: res.data.msg }, { root: true })
            return
          }
          // Success
          state.selected.forEach(e => { commit('REMOVE_ITEMS', encodeURI) })
          state.selected = []
          commit('SET_ITEM')
          commit('SET_MESSAGE', { text: rootGetters.languages('success.delete'), color: res.data.msg }, { root: true })
        } else commit('SET_CATCH', null, { root: true })
      }).catch(function (error) {
        commit('SET_CATCH', error, { root: true })
      }).finally(() => { if (loading) rootState.$loadingCommit = false })
    },
    exist_username({ commit, state, rootState }, loading = true) {
      // Loading
      if (loading) rootState.$loadingCommit = true
      // http
      const promise = new Promise(function (resolve, reject) {
        resolve(state.items.findIndex(x => x.username === state.item.username) < 0 ? false : true);
        reject(Error('Error'));
      });
      return promise.catch(function (error) {
        commit('SET_CATCH', error, { root: true })
      }).finally(() => { if (loading) rootState.$loadingCommit = false })
    }
  }
}
