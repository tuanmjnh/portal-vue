<template>
  <v-dialog v-model="$store.state.permissions.dialog" max-width="1024px" persistent>
    <v-card>
      <v-card-title class="headline grey lighten-2">
        {{ item.id ?
        $languages.get('global.details') :
        $languages.get('global.add') }}
      </v-card-title>
      <v-card-text class="p-0">
        <v-form v-model="$store.state.permissions.valid" ref="form">
          <v-container grid-list-md>
            <v-tabs v-model="$store.state.permissions.tabs" color="secondary" dark>
              <v-tab>{{$languages.get('global.main_info')}}</v-tab>
              <v-tab>{{$languages.get('global.note')}}</v-tab>
              <v-tab-item>
                <v-layout wrap class="pt-2">
                  <v-flex xs12 sm8 md8>
                    <v-text-field v-model.trim="item.title" :label="$languages.get('permissions.title')"
                      :rules="[!!item.title || $languages.get('error.required')]"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm4 md4>
                    <v-text-field v-model.trim="item.code" class="text-color-initial"
                      @keyup="onExistCode()" :disabled="item.id?true:false" :label="$languages.get('global.code')"
                      :rules="[v => !!v  || $languages.get('error.required'),$store.state.permissions.exist_code||$languages.get('error.exist')]"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md4>
                    <v-text-field type="number" v-model.trim="item.orders" :label="$languages.get('global.orders')"
                      :rules="[v => !!v || $languages.get('messages.err_required')]"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm3 md3>
                    <v-switch color="primary" :label="item.flag===1?$languages.get('global.show'):$languages.get('global.hide')"
                      :true-value="1" :false-value="0" v-model.number="item.flag"></v-switch>
                  </v-flex>
                </v-layout>
              </v-tab-item>
              <v-tab-item>
                <v-flex xs12 sm12 md12>
                  <vue-quill-editor v-model.trim="item.descs" ref="descs"></vue-quill-editor>
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
        <v-btn color="primary" flat @click.native="onSave" :disabled="!$store.state.permissions.valid"
          :loading="$store.state.$loadingCommit">
          {{$languages.get('global.update')}}
        </v-btn>
        <v-btn color="secondary" flat @click.native="$store.state.permissions.dialog=false"
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
  components: { 'vue-quill-editor': quillEditor, },
  data: () => ({}),
  mounted() {
    this.reset()
  },
  computed: {
    dialog() {
      return this.$store.state.permissions.dialog
    },
    item() {
      return this.$store.state.permissions.item
    }
  },
  watch: {
    dialog(val) {
      if (!val) this.reset()
    },
    // item: {
    //   handler(val) {
    //     if (this.item.code) {
    //       this.item.code = this.item.code.toString().toLowerCase()
    //       if (!this.item.id) this.$store.dispatch('permissions/exist_code')
    //     }
    //   },
    //   deep: true
    // }
  },
  methods: {
    onSave() {
      if (this.$store.state.permissions.valid) {
        if (this.item.id) this.$store.dispatch('permissions/update')
        else this.$store.dispatch('permissions/insert').then(() => { this.reset() })
      }
    },
    onExistCode() {
      this.item.code = this.item.code.toString().toLowerCase()
      if (!this.item.id) this.$store.dispatch('permissions/exist_code')
    },
    reset() {
      this.$store.commit('permissions/SET_ITEM')
      this.$refs.form.resetValidation()
    }
  }
}
</script>

<style>
</style>
