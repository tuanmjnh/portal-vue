<template>
  <v-dialog v-model="localDialog" max-width="1024px">
    <!-- <v-btn slot="activator" color="primary" dark class="mb-2">New Item</v-btn> -->
    <v-card>
      <v-card-title>
        <span class="headline">{{ item.id ? 'details' : 'add' }}</span>
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
                <v-combobox v-model.trim="item.module_code" :items="modules" :rules="[rules.required.module_code]"
                  label="Modules" hint="Select module"></v-combobox>
              </v-flex>
              <v-flex xs12 sm6 md6>
              </v-flex>
              <v-flex xs12 sm4 md4>
                <v-text-field v-model.trim="item.key" label="Key" :rules="[rules.required.key]"></v-text-field>
              </v-flex>
              <v-flex xs12 sm8 md8>
                <v-text-field v-model.trim="item.value" label="Value" :rules="[rules.required.value]"></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" flat @click.native="onSave">
          <!-- :disabled="!valid" -->
          <!-- <i class="material-icons">check</i> -->
          Update
        </v-btn>
        <v-btn color="secondary" flat @click.native="localDialog=false">
          <!-- <i class="material-icons">close</i>  -->
          Cancel
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
    isRefreshForm: false,
    // module_code: '',
    // key: '',
    // value: '',
    lang_data: {},
    rules: {
      required: {
        lang_code: val => (val || '').length > 0 || 'Required',
        module_code: val => (val || '').length > 0 || 'Required',
        key: val => !!val || 'Required.',
        value: val => !!val || 'Required.',
      }
    }
  }),
  mounted() {
    // this.$store.dispatch('language_items/item')
  },
  created() {
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
      // if (!val) this.$store.dispatch('language_items/item')
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
      if (this.valid) {
        this.$store.dispatch('language_items/insert')
        // if (this.item.id) 
        // this.$store.dispatch('language_items/update')
        // else this.$store.dispatch('language_items/insert').then((result) => {
        //   // this.key = ''
        //   // this.value = ''
        //   // this.$store.dispatch('language_items/item')
        // })
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
