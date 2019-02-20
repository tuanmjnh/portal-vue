<template>
  <v-app>
    <template-snackbar></template-snackbar>
    <template-main v-if="isAuth"></template-main>
    <template-auth v-else></template-auth>
  </v-app>
</template>

<script>
import snackbar from './components/snackbar'
import auth from './layouts/vuetify/auth'
import main from './layouts/vuetify/main'
import * as _store from './plugins/storage'
// import * as _languages from '@/plugins/languages'
import * as _auth from './plugins/storage-auth'
export default {
  name: 'App',
  components: {
    'template-snackbar': snackbar,
    'template-main': main,
    'template-auth': auth
  },
  data: () => ({
  }),
  beforeCreate() {
    if (!this.$store.state.$language || !this.$store.state.$languages) {
      this.$store.dispatch('setLanguage')
    }

    if (this.$store.state.languages.items && this.$store.state.languages.items.length < 1)
      this.$store.dispatch('languages/select').then(() => { })
    // if (this.$store.state.languages.items && this.$store.state.languages.items.length < 1)
    //   this.$store.dispatch('languages/select').then(() => {
    //     const x = this.$store.getters['languages/getFilter']({ sortBy: 'orders', find: { flag: 1 } })
    //     let language = _store.Get('language')
    //     if (!language) {
    //       this.$store.state._language = x.length > 0 ? x[0].code : this.$store.state._language
    //       this.$store.dispatch('language_items/selectByLang', this.$store.state._language).then(() => {
    //         var _items = '{'
    //         var _module_code = this.$store.state.language_items.items.map(e => `${e.module_code.toLowerCase()}:`).filter((value, index, self) => self.indexOf(value) === index)
    //         this.$store.state.language_items.items.forEach(e => {
    //           var x = _module_code.filter(m => {
    //             // console.log()
    //             return (String(m).toLowerCase().indexOf(`${String(e.module_code).toLowerCase()}:`) > -1)
    //           })
    //           console.log(x)
    //           // if (_module_code.indexOf(e.module_code) > -1) {
    //           //   _module_code.push(e.module_code)
    //           // } else {
    //           //   _items += `"${e.module_code}":"${e.value}",`
    //           // }
    //           //console.log(_module_code)
    //           //_items += `"${e.key}":"${e.value}",`
    //         });
    //         //const _data = JSON.stringify({ code: this.$store.state._language, items: JSON.parse(_items.trim(',') + '}') })
    //         const _data = JSON.stringify(this.$store.state.language_items.items)
    //         _store.Set('language', _data)
    //         language = _data
    //         this.$store.state._language_items = JSON.parse(_data)
    //         // location.reload();
    //       })
    //     }
    //     else {
    //       // console.log(this.$store.state._language_items)
    //     }
    //   })
  },
  created() {
    // var x = this.$store.state._language_items
    // console.log(x)
    // if (!x) location.reload();
    // window.addEventListener('beforeunload', () => {
    //   //I CAN ACCESS TO this VARIABLE
    //   console.log('abc');
    // }, false)
    // console.log(this.$store.state._language_items)
  },
  beforeMount() {
  },
  mounted() {
    // var x = this.$store.state._language_items
    // console.log(x)
  },
  computed: {
    isAuth() {
      // if (_auth.GetRemember()) 
      this.$store.dispatch('auth/setIsAuth', _auth.isAuth())
      this.$store.dispatch('auth/item', {
        username: _auth.GetUser(),
        password: '',
        token: _auth.GetToken(),
        remember: _auth.GetRemember()
      })
      var x = this.$store.state.auth.isAuth
      // console.log(this.$store.state._message)
      return x
    }
  },
  methods: {
  }
}
</script>
<style lang="scss">
</style>
