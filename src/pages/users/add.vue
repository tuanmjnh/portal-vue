<template>
  <v-dialog v-model="$store.state.users.dialog" max-width="1024px" persistent>
    <v-card>
      <v-card-title class="headline">
        {{ item.id ?
        $store.getters.languages('global.details') :
        $store.getters.languages('global.add') }}
      </v-card-title>
      <v-card-text class="p-0">
        <v-form v-model="$store.state.users.valid" ref="form">
          <v-container grid-list-md>
            <v-tabs v-model="$store.state.users.tabs" color="secondary" dark>
              <v-tab>{{$store.getters.languages('global.main_info')}}</v-tab>
              <v-tab>{{$store.getters.languages('global.note')}}</v-tab>
              <v-tab-item>
                <v-layout wrap class="pt-2">
                  <v-flex xs12 md8 sm8>
                    <v-select :items="db_donvi" v-model="item.donvi_id" :menu-props="{maxHeight:'400'}"
                      item-text="ten_donvi" item-value="donvi_id" :label="$store.getters.languages('global.local')"
                      persistent-hint :hint="$store.getters.languages('global.local')"
                      :rules="[v=>!!v||$store.getters.languages('error.required_select')]"></v-select>
                  </v-flex>
                  <v-flex xs12 md8 sm8>
                  </v-flex>
                  <v-flex xs12 sm8 md8>
                    <v-text-field v-model.trim="item.username" :label="$store.getters.languages('users.username')"
                      :rules="[!!item.username||$store.getters.languages('error.required'),$store.state.permissions.exist_username||$store.getters.languages('error.exist')]"
                      :disabled="item.id?true:false" class="text-color-initial"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm4 md4>
                    <v-text-field v-model.trim="item.email" :label="$store.getters.languages('users.email')"
                      :rules="[v=>!!v||$store.getters.languages('error.required')]"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md6>
                    <v-text-field v-model.trim="item.password" :label="$store.getters.languages('users.password')"
                      :rules="[v=>!!v||$store.getters.languages('error.required')]"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md6>
                    <v-text-field v-model.trim="repassword" :label="$store.getters.languages('users.repassword')"
                      :rules="[v=>!!v||$store.getters.languages('error.required')]"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm4 md4>
                    <v-text-field v-model.trim="item.full_name" :label="$store.getters.languages('users.full_name')"
                      :rules="[v=>!!v||$store.getters.languages('error.required')]"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm4 md4>
                    <v-text-field v-model.trim="item.mobile" :label="$store.getters.languages('users.mobile')"
                      :rules="[v=>!!v||$store.getters.languages('error.required')]"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm3 md3>
                    <v-switch color="primary" :label="item.flag===1?$store.getters.languages('global.show'):$store.getters.languages('global.hide')"
                      :true-value="1" :false-value="0" v-model.number="item.flag"></v-switch>
                  </v-flex>
                  <v-flex xs12 sm12 md12>
                    <v-textarea v-model.trim="item.address" auto-grow box :placeholder="$store.getters.languages(['global.input',' ','users.address'])"></v-textarea>
                  </v-flex>
                  <!-- <v-flex xs12 sm6 md4>
                    <v-text-field type="number" v-model.trim="item.orders" :label="$store.getters.languages('global.orders')"
                      :rules="[v =>!!v||$store.getters.languages('messages.err_required')]"></v-text-field>
                  </v-flex> -->
                </v-layout>
              </v-tab-item>
              <v-tab-item>
                <v-flex xs12 sm12 md12>
                  <vue-quill-editor v-model.trim="item.desc" ref="desc"></vue-quill-editor>
                  <!-- <tinymce id="desc" v-model="item.desc"></tinymce> -->
                </v-flex>
              </v-tab-item>
            </v-tabs>
          </v-container>
        </v-form>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" flat @click.native="onSave" :disabled="!$store.state.users.valid"
          :loading="$store.state.$loadingCommit">
          {{$store.getters.languages('global.update')}}
        </v-btn>
        <v-btn color="secondary" flat @click.native="$router.push($route.params.id ? '../list' : 'list')"
          :disabled="$store.state.$loadingCommit">
          {{$store.getters.languages('global.back')}}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'
export default {
  components: {
    'vue-quill-editor': quillEditor,
  },
  data: () => ({
    repassword: ''
  }),
  beforeCreate() {
    if (!this.$route.params.id) this.$store.commit('permissions/SET_ITEM')
  },
  computed: {
    item() {
      if (this.$route.params.id) this.$store.commit('permissions/SET_ITEM', this.$route.params.id)
      return this.$store.state.users.item
    },
    db_donvi() {
      return this.$store.getters['db_donvi/getFilter']({ sortBy: 'ma_dvi' })
    }
  },
  watch: {
    item: {
      handler(val) {
        if (this.item.code) {
          this.item.code = this.item.code.toString().toLowerCase()
          if (!this.item.id) this.$store.dispatch('users/exist_username')
        }
      },
      deep: true
    }
  },
  methods: {
    onSave() {
      if (this.$store.state.users.valid) {
        if (this.item.id) this.$store.dispatch('users/update')
        else this.$store.dispatch('users/insert')
      }
    }
  }
}
</script>

<style>
</style>
