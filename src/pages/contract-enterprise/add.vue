<template>
  <v-dialog v-model="$store.state.contract_enterprise.dialog" max-width="1024px" persistent>
    <v-card>
      <v-card-title class="headline grey lighten-2">
        {{ item.id ?
        $store.getters.languages('global.details') :
        $store.getters.languages('global.add') }}
      </v-card-title>
      <v-card-text class="p-0">
        <v-form v-model="$store.state.contract_enterprise.valid" ref="form">
          <v-container grid-list-md>
            <v-tabs v-model="$store.state.contract_enterprise.tabs" color="secondary" dark>
              <v-tab>{{$store.getters.languages('global.main_info')}}</v-tab>
              <v-tab>{{$store.getters.languages('global.note')}}</v-tab>
              <v-tab-item>
                <v-layout wrap class="pt-2">
                  <v-flex xs12 sm8 md8>
                    <v-text-field v-model.trim="item.title" :label="$store.getters.languages('contract_enterprise.title')"
                      :rules="[!!item.title || $store.getters.languages('error.required')]"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm4 md4>
                    <v-text-field v-model.trim="item.code" class="text-color-initial"
                      :disabled="item.id?true:false" :label="$store.getters.languages('global.code')"
                      :rules="[v => !!v  || $store.getters.languages('error.required'),$store.state.contract_enterprise.exist_code||$store.getters.languages('error.exist')]"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md4>
                    <v-text-field type="number" v-model.trim="item.orders" :label="$store.getters.languages('global.orders')"
                      :rules="[v => !!v || $store.getters.languages('messages.err_required')]"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm3 md3>
                    <v-switch color="primary" :label="item.flag===1?$store.getters.languages('global.show'):$store.getters.languages('global.hide')"
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
        <v-btn color="primary" flat @click.native="onSave" :disabled="!$store.state.contract_enterprise.valid"
          :loading="$store.state.$loadingCommit">
          {{$store.getters.languages('global.update')}}
        </v-btn>
        <v-btn color="secondary" flat @click.native="$store.state.contract_enterprise.dialog=false"
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
  components: { 'vue-quill-editor': quillEditor, },
  data: () => ({}),
  mounted() {
    this.reset()
  },
  computed: {
    dialog() {
      return this.$store.state.contract_enterprise.dialog
    },
    item() {
      return this.$store.state.contract_enterprise.item
    }
  },
  watch: {
    dialog(val) {
      if (!val) this.reset()
    },
    item: {
      handler(val) {
        if (this.item.code) {
          this.item.code = this.item.code.toString().toLowerCase()
          if (!this.item.id) this.$store.dispatch('contract_enterprise/exist_code')
        }
      },
      deep: true
    }
  },
  methods: {
    onSave() {
      if (this.$store.state.contract_enterprise.valid) {
        if (this.item.id) this.$store.dispatch('contract_enterprise/update')
        else this.$store.dispatch('contract_enterprise/insert')
      }
    },
    reset() {
      this.$store.commit('contract_enterprise/SET_ITEM')
      this.$refs.form.resetValidation()
    }
  }
}
</script>

<style>
</style>
