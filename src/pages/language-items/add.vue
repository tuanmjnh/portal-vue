<template>
  <v-dialog v-model="localDialog" :persistent="submitLoading" max-width="1024px">
    <!-- <v-btn slot="activator" color="primary" dark class="mb-2">New Item</v-btn> -->
    <v-card>
      <v-card-title class="headline grey lighten-2">
        {{ item.id ?
        $store.getters.languages('global.details') :
        $store.getters.languages('global.add') }}
      </v-card-title>
      <v-card-text>
        <v-form v-model="valid" ref="form">
          <v-container grid-list-md>
            <v-layout wrap class="pt-2">
              <!-- <v-flex xs12 sm6 md6>
                <v-select label="languages" :items="languages" v-model="item.lang_code"
                  :rules="[rules.required.lang_code]" :hide-selected="true" item-text="title"
                  item-value="code"></v-select>
              </v-flex> -->
              <v-flex xs12 sm6 md6>
                <v-combobox v-model.trim="item.module_code" :items="modules" :rules="[!!item.module_code || $store.getters.languages('messages.err_required')]"
                  label="Modules" hint="Select module"></v-combobox>
              </v-flex>
              <v-flex xs12 sm6 md6>
              </v-flex>
              <v-flex xs12 sm4 md4>
                <v-text-field v-model.trim="item.key" label="Key" :rules="[!!item.key || $store.getters.languages('messages.err_required')]"></v-text-field>
              </v-flex>
              <v-flex xs12 sm8 md8>
                <v-text-field v-model.trim="item.value" label="Value" :rules="[!!item.value || $store.getters.languages('messages.err_required')]"></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
        </v-form>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" flat @click.native="onSave" :disabled="!valid" :loading="submitLoading">
          {{$store.getters.languages('global.update')}}
        </v-btn>
        <v-btn color="secondary" flat @click.native="localDialog=false" :disabled="submitLoading">
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
  props: {
    dialog: { type: Boolean, default: false }
  },
  data: () => ({
    localDialog: false,
    tabActive: null,
    valid: false,
    submitLoading: false,
    // module_code: '',
    // key: '',
    // value: '',
    // lang_data: {},
  }),
  created() {
    this.$store.dispatch('language_items/item')
  },
  mounted() {
  },
  computed: {
    item() {
      const rs = this.$store.state.language_items.item
      if (rs.attach) rs.attach_file = rs.attach.replace('language_items/', '')
      return rs
    },
    modules() {
      const rs = this.$store.state.language_items.modules
      const tmp = this.$store.getters['modules/getFilter']({ sortBy: 'orders', find: { flag: 1 } }).map(e => e.code)
      rs.pushIfNotExist(tmp)
      return rs
      // const rs = this.$store.state.language_items.modules
      // return rs
    },
    languages() {
      const rs = this.$store.getters['languages/getFilter']({ sortBy: 'orders', find: { flag: 1 } })
      return rs
    }
  },
  watch: {
    dialog(val) { this.localDialog = val },
    localDialog(val) {
      this.$emit('handleDialog', val)
      if (!val) this.$store.dispatch('language_items/item')
    },
    uploadFiles: {
      handler(val) {
        if (val.files && val.files.length > 0)
          this.item.attach = val.files[0].full_name
      },
      deep: true
    }
  },
  methods: {
    onSave() {
      // var data = JSON.parse(`{"${this.module}":{"${this.key}":"${this.value}"}}`)
      // var data = { module_code: this.module_code, key: this.key, value: this.value }
      this.submitLoading = true
      if (this.valid) {
        if (this.item.id) this.$store.dispatch('language_items/update').then(this.submitLoading = false)
        else this.$store.dispatch('language_items/insert').then(() => {
          this.$store.dispatch('languages/item')
          this.submitLoading = false
        })
      }
    },
    checkExistCode() {
      var $this = this;
      this.item.code = this.item.code.toString().toLowerCase()
      if (this.item.code && !this.item.id)
        //setTimeout(function () {
        $this.$store.dispatch('language_items/existCode').then(rs => {
          if (rs) $this.rules.exist.code = true
          else $this.rules.exist.code = 'Exist'
        })
      //}, 1000);
    }
  }
}
</script>

<style>
</style>
