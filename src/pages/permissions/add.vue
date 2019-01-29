<template>
  <v-dialog v-model="localDialog" max-width="1024px">
    <!-- <v-btn slot="activator" color="primary" dark class="mb-2">New Item</v-btn> -->
    <v-card>
      <v-card-title>
        <span class="headline">{{ item.id ? 'details' : 'add' }}</span>
      </v-card-title>
      <v-card-text>
        <v-container grid-list-md>
          <v-tabs v-model="tabActive" color="secondary" dark>
            <v-tab>Thông tin</v-tab>
            <v-tab>Ghi chú</v-tab>
            <v-tab-item>
              <v-layout wrap class="pt-2">
                <v-flex xs12 sm8 md8>
                  <v-text-field v-model.trim="item.title" label="Title" :rules="[rules.required.title]"></v-text-field>
                </v-flex>
                <v-flex xs12 sm4 md4>
                  <v-text-field v-model.trim="item.code" label="Code" :rules="[rules.required.code,rules.exist.code]"
                    v-on:keyup="checkExistCode()"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field type="number" v-model.trim="item.orders" label="Orders"
                    :rules="[rules.required.orders]"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-switch color="primary" :label="item.flag===1?'Show':'Hide'"
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
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" flat @click.native="handleSave">
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
    rules: {
      required: {
        title: val => !!val || 'Required.',
        code: val => !!val || 'Required.',
        orders: val => !!val || 'Required.'
      },
      exist: {
        code: val => true || 'Exist.'
      },
      length: {
        counter: val => val.length <= 20 || 'Max 20 characters',
      },
      regex: {
        email: val => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(val) || 'Invalid e-mail.'
        }
      }
    }
  }),
  mounted() {
    this.$store.dispatch('permissions/item')
  },
  created() {
  },
  computed: {
    item() {
      var item = this.$store.state.permissions.item
      if (item.attach) item.attach_file = item.attach.replace('permissions/', '')
      return item
    }
  },
  watch: {
    dialog(val) { this.localDialog = val },
    localDialog(val) {
      this.$emit('handleDialog', val)
      if (!val) this.$store.dispatch('permissions/item')
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
    handleSave() {
      if (this.item.id) this.$store.dispatch('permissions/update')
      else this.$store.dispatch('permissions/insert').then((result) => {
        this.$store.dispatch('permissions/item')
      })
    },
    checkExistCode() {
      var $this = this;
      this.item.code = this.item.code.toString().toLowerCase()
      if (this.item.code && !this.item.id)
        //setTimeout(function () {
        $this.$store.dispatch('permissions/existCode').then(rs => {
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
