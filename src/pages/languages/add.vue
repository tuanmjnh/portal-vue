<template>
  <v-card>
    <v-card-title class="headline">
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
                  <v-text-field v-model.trim="item.title" :label="$store.getters.languages('languages.title')"
                    :rules="[v => !!v || $store.getters.languages('error.required')]"></v-text-field>
                </v-flex>
                <v-flex xs12 sm4 md4>
                  <v-text-field v-model.trim="item.code" class="text-color-initial"
                    :disabled="item.id?true:false" :label="$store.getters.languages('global.code')"
                    :rules="[v => !!v  || $store.getters.languages('error.required'),isExist||$store.getters.languages('error.exist')]"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md6 class="text-append-icon">
                  <v-text-field v-model.trim="item.icon" label="Icon"></v-text-field>
                  <div class="icon" v-html="item.icon"></div>
                </v-flex>
                <v-flex xs12 sm3 md3>
                  <v-text-field type="number" v-model.trim="item.orders" :label="$store.getters.languages('global.orders')"
                    :rules="[v => !!v  || $store.getters.languages('error.required')]"></v-text-field>
                </v-flex>
                <v-flex xs6 sm3 md3>
                  <v-switch color="primary" :label="item.flag===1?$store.getters.languages('global.show'):$store.getters.languages('global.hide')"
                    :true-value="1" :false-value="0" v-model.number="item.flag"></v-switch>
                </v-flex>
                <v-flex xs6 sm6 md6>
                  <v-text-field v-model.trim="item.attach_file" :disabled="true" class="text-color-initial"
                    :label="$store.getters.languages('global.attach')"></v-text-field>
                </v-flex>
                <v-flex xs6 sm6 md4>
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
      <v-btn color="primary" flat @click.native="onSave" :disabled="!valid" :loading="$store.state.$loadingCommit">
        {{$store.getters.languages('global.update')}}
      </v-btn>
      <v-btn color="secondary" flat @click.native="$router.push($route.params.id ? '../list' : 'list')"
        :disabled="$store.state.$loadingCommit">
        {{$store.getters.languages('global.back')}}
      </v-btn>
    </v-card-actions>
  </v-card>
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
  data: () => ({
    valid: false,
    isExist: true,
    tabActive: null,
    vnptbkn: vnptbkn,
    uploadFiles: { files: [], basePath: 'Languages' },
    rules: { code: val => true || 'Exist.' }
  }),
  created() {
    this.$store.dispatch('languages/item')
  },
  computed: {
    dialog() {
      const rs = this.$store.state.languages.dialog
      return rs
    },
    item() {
      var item = this.$store.state.languages.item
      return item
    }
  },
  watch: {
    dialog(val) {
      if (!val) this.$store.dispatch('languages/item')
      this.$refs.form.resetValidation()
    },
    uploadFiles: {
      handler(val) {
        if (val.files && val.files.length > 0)
          this.item.attach = val.files[0].full_name
      },
      deep: true
    },
    item: {
      handler(val) {
        if (this.item.attach) this.item.attach_file = this.item.attach.replace('Languages/', '')
        if (this.item.code && !this.item.id) this.$store.dispatch('languages/existCode').then((rs) => { this.isExist = rs })
      },
      deep: true
    }
  },
  methods: {
    onSave() {
      if (this.valid) {
        if (this.item.id) this.$store.dispatch('languages/update')
        else this.$store.dispatch('languages/insert')
      }
    }
  }
}
</script>

<style>
</style>
