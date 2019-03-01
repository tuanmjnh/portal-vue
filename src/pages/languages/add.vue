<template>
  <v-dialog v-model="localDialog" max-width="1024px">
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
              <v-tab>Thông tin</v-tab>
              <v-tab>Ghi chú</v-tab>
              <v-tab-item>
                <v-layout wrap class="pt-2">
                  <v-flex xs12 sm8 md8>
                    <v-text-field v-model.trim="item.title" :rules="[rules.required.title]"
                      :label="$store.getters.languages('languages.title')"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm4 md4>
                    <v-text-field v-model.trim="item.code" :rules="[rules.required.code,rules.exist.code]"
                      :label="$store.getters.languages('global.code')" v-on:keyup="checkExistCode(item.code)"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md6 class="text-append-icon">
                    <v-text-field v-model.trim="item.icon" label="Icon"></v-text-field>
                    <div class="icon" v-html="item.icon"></div>
                  </v-flex>
                  <v-flex xs12 sm3 md3>
                    <v-text-field type="number" v-model.trim="item.orders" :rules="[rules.required.orders]"
                      :label="$store.getters.languages('global.orders')"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm3 md3>
                    <v-switch color="primary" :label="item.flag===1?$store.getters.languages('global.show'):$store.getters.languages('global.hide')"
                      :true-value="1" :false-value="0" v-model.number="item.flag"></v-switch>
                  </v-flex>
                  <v-flex xs12 sm6 md6>
                    <v-text-field v-model.trim="item.attach_file" :disabled="true" class="text-color-initial"
                      :label="$store.getters.languages('global.attach')"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md4>
                    <display-files :files="uploadFiles.files" :baseUrl="vnptbkn.defaults.host"
                      :isShowName="false" classes="w-x"></display-files>
                  </v-flex>
                  <v-flex xs12 sm6 md4 v-if="item.code">
                    <upload-files @handleUpload="uploadFiles=$event" :buttonUse="false"
                      :basePath="uploadFiles.basePath" :multiple="false" :autoName="false"
                      :fileName="item.code" :http="vnptbkn" extension="application/json"
                      :buttonText="$store.getters.languages('global.upload_drag')"></upload-files>
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
        <v-btn color="primary" flat @click.native="onSave" :disabled="!valid" :loading="submitLoading">
          <!-- <i class="material-icons">check</i> -->
          {{$store.getters.languages('global.update')}}
        </v-btn>
        <v-btn color="secondary" flat @click.native="localDialog=false" :disabled="submitLoading">
          <!-- <i class="material-icons">close</i>  -->
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
import uploadFiles from '@/components/upload-files'
import displayFiles from '@/components/display-files'
import { vnptbkn } from '@/plugins/axios-config'
export default {
  components: {
    'vue-quill-editor': quillEditor,
    'upload-files': uploadFiles,
    'display-files': displayFiles
  },
  props: {
    dialog: { type: Boolean, default: false }
  },
  data: () => ({
    localDialog: false,
    tabActive: null,
    valid: false,
    submitLoading: false,
    vnptbkn: vnptbkn,
    uploadFiles: { files: [], basePath: 'Languages' },
    rules: {
      required: {
        title: val => !!val || 'Required.',
        code: val => !!val || 'Required.',
        orders: val => !!val || 'Required.'
      },
      exist: {
        code: val => true || 'Exist.' //{
        //console.log(val)
        //var check = this.$store.dispatch('languages/existCode')
        //true || 'Exist.'
        //},
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
    this.$store.dispatch('languages/item')
  },
  created() {
  },
  computed: {
    item() {
      var item = this.$store.state.languages.item
      if (item.attach) item.attach_file = item.attach.replace('Languages/', '')
      return item
    }
  },
  watch: {
    dialog(val) { this.localDialog = val },
    localDialog(val) {
      this.$emit('handleDialog', val)
      if (!val) this.$store.dispatch('languages/item')
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
      this.submitLoading = true
      if (this.valid) {
        if (this.item.id) this.$store.dispatch('languages/update').then(this.submitLoading = false)
        else this.$store.dispatch('languages/insert').then((result) => {
          this.$store.dispatch('languages/item')
          this.submitLoading = false
        })
      }
    },
    checkExistCode(code) {
      var $this = this;
      if (code && !this.item.id)
        //setTimeout(function () {
        $this.$store.dispatch('languages/existCode', code).then(rs => {
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
