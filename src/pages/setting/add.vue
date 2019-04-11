<template>
  <v-dialog v-model="$store.state.nguoidung.dialog" :persistent="$store.state.$loadingCommit" max-width="1024px">
    <!-- <v-btn slot="activator" color="primary" dark class="mb-2">New Item</v-btn> -->
    <v-card>
      <v-card-title class="headline grey lighten-2">
        {{ item.user_id ?
        $store.getters.languages('global.details') :
        $store.getters.languages('global.add') }}
      </v-card-title>
      <v-card-text>
        <v-form v-model="valid" ref="form">
          <v-container grid-list-md>
            <v-tabs v-model="tabActive" color="secondary" dark>
              <v-tab>{{$store.getters.languages('global.main_info')}}</v-tab>
              <v-tab>{{$store.getters.languages('global.note')}}</v-tab>
              <v-tab-item>
                <v-layout wrap class="pt-2">
                  <v-flex xs12 md8 sm8>
                    <v-select :items="db_donvi" v-model="item.donvi_id"
                      :menu-props="{ maxHeight: '400' }" item-text="ten_donvi" item-value="donvi_id"
                      :label="$store.getters.languages(['global.local'])" persistent-hint
                      :hint="$store.getters.languages(['global.local'])" :rules="[v =>!!v||$store.getters.languages(['error.required_select'])]"></v-select>
                  </v-flex>
                  <v-flex xs12 md8 sm8>
                  </v-flex>
                  <v-flex xs12 sm8 md8>
                    <v-text-field v-model.trim="item.username" :label="$store.getters.languages('nguoidung.username')"
                      :disabled="item.user_id?true:false" class="text-color-initial"
                      :rules="[!!item.username||$store.getters.languages('error.required'),exist_username||$store.getters.languages('error.exist')]"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm4 md4>
                    <v-text-field v-model.trim="item.email" :label="$store.getters.languages('nguoidung.email')"
                      :rules="[v =>!!v||$store.getters.languages('error.required')]"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md6>
                    <v-text-field v-model.trim="item.password" :label="$store.getters.languages('nguoidung.password')"
                      :rules="[v =>!!v||$store.getters.languages('error.required')]"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md6>
                    <v-text-field v-model.trim="repassword" :label="$store.getters.languages('nguoidung.repassword')"
                      :rules="[v =>!!v||$store.getters.languages('error.required')]"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm4 md4>
                    <v-text-field v-model.trim="item.full_name" :label="$store.getters.languages('nguoidung.full_name')"
                      :rules="[v =>!!v||$store.getters.languages('error.required')]"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm4 md4>
                    <v-text-field v-model.trim="item.mobile" :label="$store.getters.languages('nguoidung.mobile')"
                      :rules="[v =>!!v||$store.getters.languages('error.required')]"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm3 md3>
                    <v-switch color="primary" :label="item.flag===1?$store.getters.languages('global.show'):$store.getters.languages('global.hide')"
                      :true-value="1" :false-value="0" v-model.number="item.flag"></v-switch>
                  </v-flex>
                  <v-flex xs12 sm12 md12>
                    <v-textarea v-model.trim="item.address" auto-grow box :placeholder="$store.getters.languages(['global.input',' ','nguoidung.address'])"></v-textarea>
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
        <v-btn color="primary" flat @click.native="onSave" :disabled="!valid" :loading="$store.state.$loadingCommit">
          {{$store.getters.languages('global.update')}}
        </v-btn>
        <v-btn color="secondary" flat @click.native="$store.state.nguoidung.dialog=false"
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
    valid: false,
    exist_username: true,
    tabActive: null,
    repassword: ''
  }),
  created() {
    this.$store.dispatch('nguoidung/item')
  },
  computed: {
    dialog() {
      const rs = this.$store.state.nguoidung.dialog
      return rs
    },
    item() {
      var rs = this.$store.state.nguoidung.item
      return rs
    },
    db_donvi() {
      var rs = this.$store.getters['db_donvi/getFilter']({ sortBy: 'ma_dvi' })
      return rs
    }
  },
  watch: {
    dialog(val) {
      if (!val) this.$store.dispatch('nguoidung/item')
      this.$refs.form.resetValidation()
    },
    item: {
      handler(val) {
        if (this.item.code) {
          this.item.code = this.item.code.toString().toLowerCase()
          if (!this.item.user_id) this.$store.dispatch('nguoidung/exist_username').then((rs) => { this.exist_username = rs })
        }
      },
      deep: true
    }
  },
  methods: {
    onSave() {
      if (this.valid) {
        if (this.item.user_id) this.$store.dispatch('nguoidung/update')
        else this.$store.dispatch('nguoidung/insert')
      }
    }
  }
}
</script>

<style>
</style>
