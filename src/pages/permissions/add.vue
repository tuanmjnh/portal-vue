<template>
  <v-dialog v-model="localDialog" :persistent="loading" max-width="1024px">
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
            <v-tabs v-model="tabActive" color="secondary" dark>
              <v-tab>{{$store.getters.languages('global.main_info')}}</v-tab>
              <v-tab>{{$store.getters.languages('global.note')}}</v-tab>
              <v-tab-item>
                <v-layout wrap class="pt-2">
                  <v-flex xs12 sm8 md8>
                    <v-text-field v-model.trim="item.title" :label="$store.getters.languages('permissions.title')"
                      :rules="[!!item.title || $store.getters.languages('error.required')]"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm4 md4>
                    <v-text-field v-model.trim="item.code" :label="$store.getters.languages('global.code')"
                      :rules="[v => !!v  || $store.getters.languages('error.required'),isExist||$store.getters.languages('error.exist')]"></v-text-field>
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
                  <vue-quill-editor v-model.trim="item.descs" ref="descriptions"></vue-quill-editor>
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
        <v-btn color="primary" flat @click.native="onSave" :disabled="!valid" :loading="loading">
          {{$store.getters.languages('global.update')}}
        </v-btn>
        <v-btn color="secondary" flat @click.native="localDialog=false" :disabled="loading">
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
    loading: false,
    valid: false,
    isExist: true,
    localDialog: false,
    tabActive: null
  }),
  created() {
    this.$store.dispatch('permissions/item')
  },
  computed: {
    item() {
      var item = this.$store.state.permissions.item
      return item
    }
  },
  watch: {
    dialog(val) { this.localDialog = val },
    localDialog(val) {
      this.$emit('handleDialog', val)
      if (!val) {
        this.$store.dispatch('permissions/item')
        this.$refs.form.resetValidation()
      }
    },
    item: {
      handler(val) {
        if (this.item.code) {
          this.item.code = this.item.code.toString().toLowerCase()
          if (!this.item.id) this.$store.dispatch('permissions/existCode').then((rs) => { this.isExist = rs })
        }
      },
      deep: true
    }
  },
  methods: {
    onSave() {
      this.loading = true
      if (this.valid) {
        if (this.item.id) this.$store.dispatch('permissions/update').then(this.loading = false)
        else this.$store.dispatch('permissions/insert').then((result) => {
          this.$store.dispatch('permissions/item')
          this.$refs.form.resetValidation()
          this.loading = false
        })
      }
    }
  }
}
</script>

<style>
</style>
