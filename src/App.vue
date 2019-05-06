<template>
  <v-app>
    <tpl-snackbar />
    <div class="mid-center" v-if="$store.state.$loadingApp">
      <v-progress-circular :size="130" :width="10" color="primary" indeterminate></v-progress-circular>
    </div>
    <template v-else>
      <tpl-main v-if="$store.state.auth.isAuth" />
      <tpl-auth v-else />
    </template>
    <!-- <tpl-test /> -->
  </v-app>
</template>

<script>
import snackbar from './components/snackbar'
import auth from './layouts/vuetify/auth'
import main from './layouts/vuetify/main'
// import test from './layouts/vuetify/test'
import * as _store from './plugins/storage'
// import * as _languages from '@/plugins/languages'
import * as storageAuth from './plugins/storage-auth'
export default {
  name: 'App',
  components: {
    'tpl-snackbar': snackbar,
    'tpl-main': main,
    'tpl-auth': auth,
    // 'tpl-test': test
  },
  // data: () => ({}),
  beforeCreate() {
    // Get Languages
    if (this.$store.state.languages.isGetFirst) this.$store.dispatch('languages/select')
    // Get Dictionary
    // if (!this.$store.state.$language || !this.$store.state.$dictionary) this.$store.dispatch('setLanguage')
    // if (!this.$store.state.$language) this.$store.dispatch('setLanguage')
    // Get Navigation
    if (this.$store.state.navigation.isGetFirst) this.$store.dispatch('navigation/select')
    // Check Authenticated Refresh
    this.$store.dispatch('auth/setIsAuth', storageAuth.Authenticated())
    // this.$store.commit('SET_CATCH', { response: { status: 401 } })
  },
  computed: {
    // isAuth() {
    // if (_auth.GetRemember()) 
    // this.$store.dispatch('auth/item', {
    //   username: _auth.GetUser(),
    //   password: '',
    //   token: _auth.GetToken(),
    //   remember: _auth.GetRemember()
    // })
    // console.log(this.$store.state._message)
    // return this.$store.state.auth.isAuth
    // }
  }
}
</script>
<style lang="scss">
</style>
