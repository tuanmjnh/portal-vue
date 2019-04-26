<template>
  <v-dialog v-model="$store.state.dictionary.dialog" max-width="1024px" persistent>
    <v-card>
      <v-card-title class="headline grey lighten-2">
        {{ item.id ?
        $store.getters.languages('global.details') :
        $store.getters.languages('global.add') }}
      </v-card-title>
      <v-card-text class="p-0">
        <v-form v-model="$store.state.dictionary.valid" ref="form">
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
        <v-btn color="primary" flat @click.native="onSave" :disabled="!$store.state.dictionary.valid"
          :loading="$store.state.$loadingCommit">
          {{$store.getters.languages('global.update')}}
        </v-btn>
        <v-btn color="secondary" flat @click.native="$store.state.dictionary.dialog=false"
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
  mounted() {
    this.reset()
  },
  computed: {
    dialog() {
      return this.$store.state.dictionary.dialog
    },
    item() {
      return this.$store.state.dictionary.item
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
      return this.$store.getters['languages/getFilter']({ sortBy: 'orders', find: { flag: 1 } })
    }
  },
  watch: {
    dialog(val) {
      if (!val) this.reset()
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
      if (this.$store.state.dictionary.valid) {
        if (this.item.id) this.$store.dispatch('dictionary/update')
        else this.$store.dispatch('dictionary/insert').then(this.reset())
      }
    },
    reset() {
      this.$store.commit('dictionary/SET_ITEM')
      this.$refs.form.resetValidation()
    }
  }
}
</script>

<style>
</style>
