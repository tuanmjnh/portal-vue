<template>
  <v-dialog v-model="$store.state.dictionary.dialog" :persistent="$store.state.$loadingCommit" max-width="1024px">
    <!-- <v-btn slot="activator" color="primary" dark class="mb-2">New Item</v-btn> -->
    <v-card>
      <v-card-title class="headline grey lighten-2">
        {{ item.id ?
        $store.getters.languages(['global.details']) :
        $store.getters.languages(['global.add']) }}
      </v-card-title>
      <v-card-text>
        <v-form v-model="valid" ref="form">
          <v-container grid-list-md>
            <v-layout wrap class="pt-2">
              <v-flex xs12 sm6 md6>
                <v-combobox v-model.trim="item.module_code" :items="modules" label="Modules"
                  :rules="[v => !!v || $store.getters.languages('error.required')]" hint="Select module"></v-combobox>
              </v-flex>
              <v-flex xs12 sm6 md6>
              </v-flex>
              <v-flex xs12 sm4 md4>
                <v-text-field v-model.trim="item.key" label="Key" :rules="[v => !!v || $store.getters.languages('error.required')]"></v-text-field>
              </v-flex>
              <v-flex xs12 sm8 md8>
                <v-text-field v-model.trim="item.value" label="Value" :rules="[v => !!v || $store.getters.languages('error.required')]"></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
        </v-form>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" flat @click.native="onSave" :disabled="!valid" :loading="$store.state.$loadingCommit">
          {{$store.getters.languages(['global.update'])}}
        </v-btn>
        <v-btn color="secondary" flat @click.native="$store.state.dictionary.dialog=false"
          :disabled="$store.state.$loadingCommit">
          {{$store.getters.languages(['global.back'])}}
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
    tabActive: null,
  }),
  created() {
    // this.$store.dispatch('dictionary/item')
  },
  computed: {
    dialog() {
      const rs = this.$store.state.dictionary.dialog
      return rs
    },
    item() {
      const rs = this.$store.state.dictionary.item
      return rs
    },
    modules() {
      const rs = this.$store.state.dictionary.modules
      const tmp = this.$store.getters['modules/getFilter']({ sortBy: 'orders', find: { flag: 1 } }).map(e => e.code)
      rs.pushIfNotExist(tmp)
      return rs
      // const rs = this.$store.state.dictionary.modules
      // return rs
    },
    languages() {
      const rs = this.$store.getters['languages/getFilter']({ sortBy: 'orders', find: { flag: 1 } })
      return rs
    }
  },
  watch: {
    dialog(val) {
      if (!val) this.$store.dispatch('dictionary/item')
      this.$refs.form.resetValidation()
    },
    item: {
      handler(val) {
        if (this.item.key) this.item.key = this.item.key.toString().toLowerCase()
      },
      deep: true
    }
  },
  methods: {
    onSave() {
      // var data = JSON.parse(`{"${this.module}":{"${this.key}":"${this.value}"}}`)
      // var data = { module_code: this.module_code, key: this.key, value: this.value }
      if (this.valid) {
        if (this.item.id) this.$store.dispatch('dictionary/update')
        else this.$store.dispatch('dictionary/insert')
      }
    }
  }
}
</script>

<style>
</style>
