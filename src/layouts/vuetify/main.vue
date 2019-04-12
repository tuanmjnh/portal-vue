<template>
  <div>
    <!--temporary-->
    <v-navigation-drawer :mini-variant="miniVariant" :clipped="clipped" v-model="drawer"
      enable-resize-watcher fixed app>
      <v-toolbar flat>
        <v-list>
          <v-list-tile @click="$router.push(navHeadLeft.push)">
            <v-list-tile-action v-html="navHeadLeft.icon">
            </v-list-tile-action>
            <v-list-tile-content class="title">
              <v-list-tile-title>{{navHeadLeft.title}}</v-list-tile-title>
            </v-list-tile-content>
            <!-- <v-list-tile-title class="title">
              TM Store
            </v-list-tile-title> -->
          </v-list-tile>
        </v-list>
      </v-toolbar>
      <v-divider></v-divider>
      <v-list>
        <template v-for="(item, i) in $store.getters['navigation/getRender']({position: 'content-left',roles:$store.state.auth.user.roles})">
          <v-list-tile v-if="item.children.length<1" :key="i" @click="MenuAction(item)">
            <v-list-tile-action v-html="item.icon">
              <!-- <v-icon v-html="item.icon"></v-icon> -->
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title v-text="$store.getters.languages(`navigation.${item.code}`)"></v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-group v-else :key="i" no-action>
            <v-list-tile slot="activator">
              <v-list-tile-action v-html="item.icon"></v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title v-text="$store.getters.languages(`navigation.${item.code}`)"></v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <template v-for="(children, ii) in item.children">
              <v-list-tile :key="ii" v-if="children.children.length<1" @click="MenuAction(children)">
                <v-list-tile-title v-text="$store.getters.languages(`navigation.${children.code}`)" />
                <v-list-tile-action v-html="children.icon" />
              </v-list-tile>
              <v-list-group v-else :key="ii" no-action sub-group>
                <v-list-tile slot="activator">
                  <v-list-tile-title v-text="$store.getters.languages(`navigation.${children.code}`)" />
                  <v-list-tile-action v-html="children.icon" />
                </v-list-tile>
                <template v-for="(child, iii) in children.children">
                  <v-list-tile :key="iii" @click="MenuAction(child)">
                    <v-list-tile-title v-text="$store.getters.languages(`navigation.${child.code}`)" />
                    <v-list-tile-action v-html="child.icon" />
                  </v-list-tile>
                </template>
              </v-list-group>
            </template>

            <!-- </v-list-group> -->
            <!-- <template v-if="item.children.length>0">
              <v-list-tile v-for="(children, ii) in item.children" :key="ii" @click="MenuAction(children)">

                <v-list-group v-if="children.children.length>0" no-action sub-group value="true">
                  <v-list-tile-title v-text="$store.getters.languages(`navigation.${children.code}`)" />
                  <v-list-tile-action v-html="children.icon" />

                  <v-list-tile v-for="(admin, iii) in admins" :key="iii">
                    <v-list-tile-title v-text="admin[0]"></v-list-tile-title>
                    <v-list-tile-action>
                      <v-icon v-text="admin[1]"></v-icon>
                    </v-list-tile-action>
                  </v-list-tile>
                </v-list-group> 

                <template>
                  <v-list-tile-title v-text="$store.getters.languages(`navigation.${children.code}`)" />
                  <v-list-tile-action v-html="children.icon" />
                </template>
              </v-list-tile>
            </template> -->
          </v-list-group>
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar app :clipped-left="clipped">
      <v-toolbar-side-icon v-if="clipped" @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-btn v-if="!clipped" icon @click.stop="miniVariant = !miniVariant">
        <v-icon v-html="miniVariant ? 'chevron_right' : 'chevron_left'"></v-icon>
      </v-btn>
      <!-- <v-btn icon @click.stop="clipped = !clipped">
        <v-icon>web</v-icon>
      </v-btn> -->
      <!-- <v-btn icon @click.stop="fixed = !fixed">
        <v-icon>remove</v-icon>
      </v-btn> -->
      <!-- <v-toolbar-title v-text="title"></v-toolbar-title> -->
      <v-spacer></v-spacer>
      <!-- <v-btn icon @click.stop="ShowSnackbar">
        <v-icon>notifications</v-icon>
      </v-btn> -->
      <!-- <v-btn icon @click.stop="rightDrawer = !rightDrawer">
        <v-icon>notifications</v-icon>
      </v-btn>-->
      <!-- <v-btn icon @click.stop="rightDrawer = !rightDrawer">
        <v-icon>apps</v-icon>
      </v-btn> -->
      <template v-for="(item, index) in $store.getters['navigation/getRender']({position: 'head-right'})">
        <template v-if="item.children.length>0">
          <v-menu :key="item.id" bottom :min-width="166">
            <v-tooltip slot="activator" bottom :key="index" v-if="item.icon">
              <v-btn flat icon slot="activator" color="primary">
                <div class="v-btn__content" v-html="item.icon"></div>
              </v-btn>
              <span>{{$store.getters.languages(`navigation.${item.code}`)}}</span>
            </v-tooltip>
            <v-btn slot="activator" :key="index" flat v-else>
              <div class="v-btn__content" v-if="item.code=='userlogged'">{{$store.state.auth.user.ten_nd}}
                <v-icon>arrow_drop_down</v-icon>
              </div>
              <div class="v-btn__content" v-else>{{$store.getters.languages(`navigation.${children.code}`)}}</div>
            </v-btn>

            <v-list>
              <v-list-tile :key="index" v-for="(children, index) in item.children" @click="MenuAction(children)">
                <v-list-tile-action v-html="children.icon"></v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title>{{$store.getters.languages(`navigation.${children.code}`)}}</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>
          </v-menu>
        </template>
        <template v-else>
          <v-tooltip bottom :key="index" v-if="item.icon">
            <v-btn flat icon slot="activator" @click="MenuAction(item)">
              <div class="v-btn__content" v-html="item.icon"></div>
            </v-btn>
            <span>{{$store.getters.languages(`navigation.${item.code}`)}}</span>
          </v-tooltip>
          <!-- <v-btn :key="index" icon v-if="item.icon">
            <div class="v-btn__content" v-html="item.icon"></div>
          </v-btn> -->
          <v-btn :key="index" flat v-else>
            <div class="v-btn__content">{{$store.getters.languages(`navigation.${children.code}`)}}</div>
          </v-btn>
        </template>
      </template>
      <!-- <v-menu bottom :min-width="166">
        <v-btn slot="activator" flat class="text-transform-initial">
          {{getAuth('full_name')}} <v-icon>arrow_drop_down</v-icon>
        </v-btn>
        <v-list>
          <v-list-tile @click="$router.push('/profile')">
            <v-list-tile-action>
              <i class="material-icons">ballot</i>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{$store.getters.languages(['global.profile'])}}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile @click="$router.push('/setting')">
            <v-list-tile-action>
              <i class="material-icons">settings_applications</i>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{$store.getters.languages(['global.setting'])}}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile @click="Logout">
            <v-list-tile-action>
              <i class="material-icons">exit_to_app</i>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{$store.getters.languages(['global.logout'])}}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-menu> -->
    </v-toolbar>
    <v-content>
      <!-- <HelloWorld/> -->
      <div class="container page">
        <v-snackbar v-model="snackbar.show" :color="snackbar.color" :right="snackbar.x==='right'"
          :left="snackbar.x==='left'" :bottom="snackbar.y==='bottom'" :top="snackbar.y==='top'"
          :timeout="snackbar.timeout" :multi-line="snackbar.mode==='multi-line'"
          :vertical="snackbar.mode==='vertical'">
          {{ snackbar.text }}
          <v-btn color="" flat @click="snackbar.show=false">
            <i class="material-icons">close</i>
          </v-btn>
        </v-snackbar>
        <div class="mid-center" v-if="$store.state.$loadingGet">
          <v-progress-circular :size="130" :width="10" color="primary" indeterminate></v-progress-circular>
        </div>
        <router-view v-else></router-view>
      </div>
    </v-content>
    <v-navigation-drawer temporary :right="right" v-model="$store.state.$notification"
      fixed app>
      <!-- {{$store.getters.languages('navigation.notification')}} -->
      <v-layout row v-if="notification.length<1">
        <v-flex xs12 sm12>
          <p class="text-md-center mt-3 primary--text">{{$store.getters.languages('messages.no_notification')}}</p>
        </v-flex>
      </v-layout>
      <v-list two-line v-else>
        <template v-for="(item, index) in notification">
          <v-subheader v-if="item.header" :key="item.header">
            {{ item.header }}
          </v-subheader>
          <v-divider v-else-if="item.divider" :key="index" :inset="item.inset"></v-divider>
          <v-list-tile v-else :key="item.title" avatar>
            <v-list-tile-avatar>
              <img :src="item.avatar">
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title v-html="item.title"></v-list-tile-title>
              <v-list-tile-sub-title v-html="item.subtitle"></v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </template>
      </v-list>
      <!-- <v-list>
        <v-list-tile @click="right = !right">
          <v-list-tile-action>
            <v-icon>compare_arrows</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>Switch drawer (click me)</v-list-tile-title>
        </v-list-tile>
      </v-list> -->
    </v-navigation-drawer>
    <v-footer :fixed="fixed" app>
      <!-- <v-layout wrap class="pl-3"> -->
      <v-flex xs3 sm3 md2 class="pl-3">
        <v-select :items="$store.getters['languages/getFilter']({flag:1})" v-model="$store.state.$language"
          :hide-selected="true" item-text="title" item-value="code"></v-select>
      </v-flex>
      <v-spacer></v-spacer>
      <!-- <v-flex xs9 sm9 md10></v-flex> -->
      <v-flex xs3 sm3 md2 class="text-lg-right">
        <span>Coppyright &copy; 2019</span>
      </v-flex>
      <!-- </v-layout> -->
    </v-footer>
  </div>
</template>

<script>
import * as storageAuth from '@/plugins/storage-auth'
export default {
  components: {
  },
  data: () => ({
    // clipped: this.$vuetify.breakpoint.lgAndUp,
    drawer: true,
    fixed: false,
    right: true,
    miniVariant: false,
    // rightDrawer: false,
    admins: [
      ['Management', 'people_outline'],
      ['Settings', 'settings']
    ],
    items: [
      { icon: 'home', title: 'Trang chủ', push: 'dashboard' },
      {
        icon: 'description',
        title: 'Hợp đồng',
        push: 'contract-customer',
        children: [
          { icon: 'contacts', title: 'Khách hàng', push: 'contract-customer' },
          { icon: 'supervisor_account', title: 'DV CNTT', push: 'contract-enterprise' },
        ]
      },
      {
        icon: 'developer_board',
        title: 'Manager',
        push: 'users',
        children: [
          { icon: 'account_circle', title: 'Users', push: 'users' },
          { icon: 'vpn_key', title: 'Roles', push: 'roles' },
          { icon: 'navigation', title: 'Navigation', push: 'navigation' },
          { icon: 'apps', title: 'Modules', push: 'modules' },
          { icon: 'low_priority', title: 'Permissions', push: 'permissions' },
        ]
      },
      {
        icon: 'vertical_split',
        title: 'Common',
        push: 'languages',
        children: [
          { icon: 'outlined_flag', title: 'Languages', push: 'languages' },
          { icon: 'scatter_plot', title: 'Language items', push: 'language-items' },
          { icon: 'local_library', title: 'Informations', push: 'informations' }
        ]
      }
    ],
    menuUser: [
      { icon: "ballot", title: "Profile", push: "profile" },
      { icon: "settings_applications", title: "Setting", push: "setting" },
      { icon: "exit_to_app", title: "Logout", go: "auth", store: "auth/logout" }
    ]
  }),
  created() {
    // console.log(this.authUser)
    // this.$store.dispatch('languages_items/init')
  },
  computed: {
    snackbar() {
      return this.$store.state.$message
    },
    clipped() {
      var mobile = !this.$vuetify.breakpoint.lgAndUp
      return mobile
    },
    authUser() {
      var rs = this.$store.state.auth.user
      return rs
    },
    dataLanguages() {
      const rs = this.$store.state.languages.items
      return rs
    },
    language() {
      const rs = this.$store.state.$language
      return rs
    },
    notification() {
      const rs = this.$store.state.notification.items
      return rs
    },
    navHeadLeft() {
      const rs = this.$store.getters['navigation/getRender']({ position: 'head-left' })
      if (rs.length > 0) return rs[0]
      else return {
        title: 'Portal',
        icon: 'dashboard',
        url: '/',
        push: '/'
      }
    }
  },
  methods: {
    MenuAction(item) {
      if (item.store) this.$store.dispatch(item.store, true)
      if (item.go) this.$router.go('/' + item.go)
      if (item.push) this.$router.push('/' + item.push)
      // if (item.store) this.$store.commit(item.url_plus.store)
      // if (item.go) this.$router.go('/' + item.url_plus.go)
      // else this.$router.push('/' + item.url_plus.push)
    },
    ShowSnackbar() {
      this.$store.dispatch('message', { text: 'Hello, I\'m a snackbar' })
    },
    signOut() {
      this.$store.dispatch('auth/signOut', true).then(() => { this.$router.push('/auth') })
    },
    getAuth(key) {
      return storageAuth.GetStorage()[key]
    }
  },
  watch: {
    language(val) {
      this.$store.dispatch('setLanguage')
    }
  }
}
</script>
<style lang="scss">
@import "@/assets/scss/vuetify.scss";
@import "@/assets/scss/quill.scss";
</style>
