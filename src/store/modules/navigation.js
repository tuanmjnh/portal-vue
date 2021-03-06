import { vnptbkn } from '@/plugins/axios-config'
const collection = 'navigation'
export default {
  namespaced: true,
  state: {
    items: [],
    item: {},
    tabs: null,
    selected: [],
    valid: false,
    dialog: false,
    confirm: false,
    exist_code: true,
    isGetFirst: true,
    url_plus: { push: '', go: '', store: '' },
    headers: [
      // { text: 'ID', value: 'id', align: 'left' },
      { text: 'global.navigation_title', value: 'title', align: 'left' },
      { text: 'global.code', value: 'code' },
      // { text: 'global.dependent', value: 'dependent', align: 'left' },
      { text: 'global.url', value: 'url' },
      { text: 'global.orders', value: 'orders' },
      // { text: 'global.created_at', value: 'created_at' },
      { text: 'Icon', value: 'icon' },
      { text: '#', value: '#', sortable: false }
    ],
    pagination: {
      search: '',
      sortBy: 'app_key',
      toggle: 0,
      find: { flag: 1 }
    },
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
    getFilter: state => pagination => {
      let rs = [...state.items]
      if (pagination && pagination.find) rs = rs.filterValue(pagination.find)
      else rs = rs.filterValue(state.pagination.find)
      if (pagination && pagination.search) rs = rs.searchValue(pagination.search)
      else rs = rs.searchValue(state.pagination.search)
      if (pagination && pagination.sortBy) rs = rs.sortByKey(pagination.sortBy)
      else rs = rs.sortByKey(state.pagination.sortBy)
      return rs
    },
    headers: (state, getters, rootState, rootGetters) => {
      state.headers.forEach(e => { e.text = rootGetters.languages(e.text) })
      return state.headers
    },
    getDependent: state => {
      return state.items
        .filterValue({ flag: 1 })
        .filter(e => { return e.id != state.item.id })
        // .sortByKey('app_key')
        .map(e => ({ 'id': e.id, 'title': e.title }))
    },
    getRender: state => filter => {
      if (!filter.quyen) filter.quyen = ['dashboard.select', 'auth.select']
      let items = state.items
        .filter(row => { return row.flag === 1 })
        .filter(row => { return row.app_key === filter.position })
      if (filter.quyen && filter.quyen.length > 0)
        items = items.filter(row => { return filter.quyen.indexOfArray(row.url.trim(',').split(',')) > -1 })
      //items = items.filter(row => { return filter.quyen.indexOfArray(row.url.trim(',').split(',')) > -1 })
      const rs = items.filter(row => { return row.dependent.indexOf(',0,') > -1 })
      if (rs === 'head-right') {
        console.log(rs)
      }
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
    SET_ITEMS(state, items) {
      state.items = items
    },
    SET_ITEM(state, item) {
      if (item) {
        if (item.url_plus) state.url_plus = JSON.parse(item.url_plus)
        else state.url_plus = { push: '', go: '', store: '' }
        state.item = { ...item }
      } else state.item = { ...state.default }
    },
    SET_ITEM_ID(state, id) {
      if (id) {
        state.item = { ...state.items.find(x => x.id == id) }
        if (state.item.url_plus) state.url_plus = JSON.parse(state.item.url_plus)
        else state.url_plus = { push: '', go: '', store: '' }
      } else state.item = { ...state.default }
    },
    PUSH_ITEMS(state, item) {
      state.items.push(item)
    },
    UPDATE_ITEMS(state, item) {
      state.items.update(item, 'id')
    },
    REMOVE_ITEMS(state, item) {
      state.items.remove(item, 'id')
    }
  },
  actions: {
    async select({ commit, rootGetters, state, rootState }, loading = true) {
      // Loading
      if (loading) rootState.$loadingGet = true
      // http
      await vnptbkn().get(collection).then(function(res) {
        if (res.status === 200) {
          // res.data.data.forEach(e => { e.url_plus = e.url_plus ? JSON.parse(e.url_plus) : state.url_plus });
          commit('SET_ITEMS', res.data.sortByKey('orders'))
        } else
          commit('SET_MESSAGE', { text: rootGetters.languages('error.data'), color: 'danger' }, { root: true })

      }).catch((error) => {
        commit('SET_CATCH', error, { root: true })
      }).finally(() => {
        state.isGetFirst = false
        if (loading) rootState.$loadingGet = false
      })
    },
    async insert({ commit, state, rootGetters, rootState }, loading = true) {
      // Loading
      if (loading) rootState.$loadingCommit = true
      // http
      state.item.created_by = vnptbkn().defaults.headers.Author
      state.item.created_at = new Date()
      //state.item.url_plus = JSON.stringify(state.url_plus)
      return await vnptbkn().post(collection, state.item).then(function(res) {
        if (res.status === 201) {
          commit('SET_ITEM')
          commit('PUSH_ITEMS', res.data)
          commit('SET_MESSAGE', { text: rootGetters.languages('success.add'), color: 'success' }, { root: true })
          state.url_plus = { push: '', go: '', store: '' }
          return true;
        } else {
          commit('SET_MESSAGE', { text: rootGetters.languages('error.data'), color: 'danger' }, { root: true })
          return false;
        }
      }).catch((error) => {
        commit('SET_CATCH', error, { root: true })
      }).finally(() => {
        if (loading) rootState.$loadingCommit = false
      })
    },
    async update({ commit, state, rootGetters, rootState }, loading = true) {
      // Loading
      if (loading) rootState.$loadingCommit = true
      // http
      state.item.updated_by = vnptbkn().defaults.headers.Author
      state.item.updated_at = new Date()
      // state.item.url_plus = JSON.stringify(state.url_plus)
      return await vnptbkn().put(`${collection}/${state.item.id}`, state.item).then(function(res) {
        if (res.status === 200) {
          commit('UPDATE_ITEMS', res.data)
          commit('SET_MESSAGE', { text: rootGetters.languages('success.update'), color: 'success' }, { root: true })
          return true;
        } else {
          commit('SET_MESSAGE', { text: rootGetters.languages('error.data'), color: 'danger' }, { root: true })
          return false;
        }
      }).catch((error) => {
        commit('SET_CATCH', error, { root: true })
      }).finally(() => {
        if (loading) rootState.$loadingCommit = false
      })
    },
    async delete({ commit, state, rootGetters, rootState }, loading = true) {
      // Loading
      if (loading) rootState.$loadingCommit = true
      // http
      const data = state.selected.map(x => ({
        id: x.id,
        flag: x.flag === 0 ? 1 : 0,
        deleted_by: vnptbkn().defaults.headers.Author
      }))
      console.log(data)
      return await vnptbkn().patch(collection, data).then(function(res) {
        if (res.status === 200) {
          //state.selected.forEach(e => { commit(UPDATE_ITEMS, e) });
          state.selected.update(res.data, 'id')
          // console.log(state.items.findIndex((x) => { return x.id === res.data[0].id }))
          state.selected = []
          commit('SET_ITEM')
          commit('SET_MESSAGE', { text: rootGetters.languages('success.delete'), color: 'success' }, { root: true })
          return true;
        } else {
          commit('SET_MESSAGE', { text: rootGetters.languages('error.data'), color: 'danger' }, { root: true })
          return false
        }
      }).catch((error) => {
        commit('SET_CATCH', error, { root: true })
      }).finally(() => {
        if (loading) rootState.$loadingCommit = false
      })
    },
    async remove({ commit, state, rootGetters, rootState }, loading = true) {
      // Loading
      if (loading) rootState.$loadingCommit = true
      // http
      await vnptbkn().delete(collection, state.item).then(function(res) {
        if (res.status === 200) {
          commit('REMOVE_ITEMS', state.item)
          commit('SET_ITEM')
          commit('SET_MESSAGE', { text: rootGetters.languages('success.delete'), color: 'success' }, { root: true })
        } else commit('SET_MESSAGE', { text: rootGetters.languages('error.data'), color: 'danger' }, { root: true })
      }).catch((error) => {
        commit('SET_CATCH', error, { root: true })
      }).finally(() => {
        if (loading) rootState.$loadingCommit = false
      })
    },
    async exist_code({ commit, state, rootState }, loading = true) {
      // Loading
      if (loading) rootState.$loadingCommit = true
      // http
      await vnptbkn().get(`common/exist?obj=navigation&key=code&val=${state.item.code}`, { timeout: 1000 }).then(function(res) { //, { timeout: 3000 }
        if (res.status === 200) {
          state.exist_code = res.data === true ? false : true
        } else commit('SET_CATCH', null, { root: true })
      }).catch((error) => {
        commit('SET_CATCH', error, { root: true })
        return Promise.reject(error)
      }).finally(() => {
        if (loading) rootState.$loadingCommit = false
      })
    }
  }
}
