<template>
  <v-dialog v-model="$store.state.nguoidung.dialog" max-width="1024px" persistent>
    <v-card>
      <v-card-title class="headline grey lighten-2">
        {{ item.id ?
        $languages.get('global.details') :
        $languages.get('global.add') }}
      </v-card-title>
      <v-card-text class="p-0">
        <v-form v-model="valid" ref="form">
          <v-container grid-list-md>
            <v-tabs v-model="tabs" color="secondary" dark>
              <v-tab>{{$languages.get('global.main_info')}}</v-tab>
              <v-tab>{{$languages.get('global.note')}}</v-tab>
              <v-tab-item>
                <v-layout wrap class="pt-2">
                  <v-flex xs12 md8 sm8>
                    <v-select :items="donvi" v-model="item.donvi_id" :menu-props="{ maxHeight: '400' }"
                      item-text="ten_dv" item-value="donvi_id" :label="$languages.get('global.local')"
                      persistent-hint :hint="$languages.get('global.local')"
                      :rules="[v=>!!v||$languages.get('error.required_select')]"></v-select>
                  </v-flex>
                  <v-flex xs12 md8 sm8>
                  </v-flex>
                  <v-flex xs12 sm8 md8>
                    <v-text-field v-model.trim="item.username" :label="$languages.get('nguoidung.username')"
                      :rules="[!!item.username||$languages.get('error.required'),$store.state.nguoidung.exist_username||$languages.get('error.exist')]"
                      :disabled="item.id?true:false" class="text-color-initial"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm4 md4>
                    <v-text-field v-model.trim="item.email" :label="$languages.get('nguoidung.email')"
                      :rules="[v=>!!v||$languages.get('error.required')]"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md6>
                    <v-text-field v-model.trim="item.password" :label="$languages.get('nguoidung.password')"
                      :rules="[v=>!!v||$languages.get('error.required')]"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md6>
                    <v-text-field v-model.trim="repassword" :label="$languages.get('nguoidung.repassword')"
                      :rules="[v=>!!v||$languages.get('error.required')]"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm4 md4>
                    <v-text-field v-model.trim="item.full_name" :label="$languages.get('nguoidung.full_name')"
                      :rules="[v=>!!v||$languages.get('error.required')]"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm4 md4>
                    <v-text-field v-model.trim="item.mobile" :label="$languages.get('nguoidung.mobile')"
                      :rules="[v=>!!v||$languages.get('error.required')]"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm3 md3>
                    <v-switch color="primary" :label="item.flag===1?$languages.get('global.show'):$languages.get('global.hide')"
                      :true-value="1" :false-value="0" v-model.number="item.flag"></v-switch>
                  </v-flex>
                  <v-flex xs12 sm12 md12>
                    <v-textarea v-model.trim="item.address" auto-grow box :placeholder="$store.getters.languages(['global.input',' ','nguoidung.address'])"></v-textarea>
                  </v-flex>
                  <!-- <v-flex xs12 sm6 md4>
                    <v-text-field type="number" v-model.trim="item.orders" :label="$languages.get('global.orders')"
                      :rules="[v =>!!v||$languages.get('messages.err_required')]"></v-text-field>
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
        <v-btn color="primary" flat @click.native="onSave" :disabled="!valid"
          :loading="$store.state.$loadingCommit">
          {{$languages.get('global.update')}}
        </v-btn>
        <v-btn color="secondary" flat @click.native="$store.state.nguoidung.dialog=false"
          :disabled="$store.state.$loadingCommit">
          {{$languages.get('global.back')}}
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
    tabs: null,
    repassword: '',
  }),
  created() {
    this.$store.commit('nguoidung/SET_ITEM')
  },
  computed: {
    item() {
      return this.$store.state.nguoidung.item
    },
    donvi() {
      return this.$store.getters['donvi/getFilter']({ sortBy: 'ma_dvi' })
    }
  },
  watch: {
    item: {
      handler(val) {
        if (this.item.code) {
          this.item.code = this.item.code.toString().toLowerCase()
          if (!this.item.id) this.$store.dispatch('nguoidung/exist_username')
        }
      },
      deep: true
    }
  },
  methods: {
    onSave() {
      if (this.valid) {
        if (this.item.id) this.$store.dispatch('nguoidung/update')
        else this.$store.dispatch('nguoidung/insert')
      }
    }
  }
}
</script>

<style>
</style>
