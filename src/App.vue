<template>
  <v-app>
    <div class="mid-center" v-if="$store.state.$loadingApp">
      <v-progress-circular :size="130" :width="10" color="primary" indeterminate></v-progress-circular>
    </div>
    <template v-else>
      <template-snackbar></template-snackbar>
      <template-main v-if="isAuth"></template-main>
      <template-auth v-else></template-auth>
    </template>
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
  // data: () => ({}),
  beforeCreate() {
    if (!this.$store.state.$language || !this.$store.state.$languages)
      this.$store.dispatch('setLanguage')
    if (this.$store.state.languages.items.length < 1)
      this.$store.dispatch('languages/select', false)
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
  }
}
</script>
<style lang="scss">
</style>
