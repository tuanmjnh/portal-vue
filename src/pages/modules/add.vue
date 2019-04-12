<template>
  <v-dialog v-model="$store.state.modules.dialog" max-width="1024px" persistent>
    <v-card>
      <v-card-title class="headline grey lighten-2">
        {{ item.id ?
        $store.getters.languages(['global.details']) :
        $store.getters.languages(['global.add']) }}
      </v-card-title>
      <v-card-text class="p-0">
        <v-form v-model="$store.state.modules.valid" ref="form">
          <v-container grid-list-md>
            <v-tabs v-model="$store.state.modules.tabs" color="secondary" dark>
              <v-tab>{{$store.getters.languages(['global.main_info'])}}</v-tab>
              <v-tab>{{$store.getters.languages(['global.note'])}}</v-tab>
              <v-tab-item>
                <v-layout wrap class="pt-2">
                  <v-flex xs12 sm8 md8>
                    <!-- <v-text-field v-model.trim="item.title" :label="$store.getters.languages(['modules.title'])"
                      :rules="[!!item.title || $store.getters.languages(['messages.err_required')]"></v-text-field> -->
                    <v-text-field v-model.trim="item.title" :rules="[v => !!v || $store.getters.languages('error.required')]"
                      :label="$store.getters.languages(['modules.title'])"></v-text-field>
                    <!-- <span>{{errors.items.getRule('title')}}</span> -->
                    <!-- <span v-show="errors.has('title')">{{ errors.first('title') }}</span> -->
                  </v-flex>
                  <v-flex xs12 sm4 md4>
                    <v-text-field v-model.trim="item.code" class="text-color-initial"
                      :disabled="item.id?true:false" :label="$store.getters.languages(['global.code'])"
                      :rules="[v => !!v || $store.getters.languages('error.required'),$store.state.modules.exist_code||$store.getters.languages('error.exist')]"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md6>
                    <v-text-field v-model.trim="item.url" :rules="[v => !!v || $store.getters.languages('error.required')]"
                      :label="$store.getters.languages(['global.url'])"></v-text-field>
                  </v-flex>
                  <v-flex xs12 md6 sm6>
                    <v-select :items="permissions" v-model="permissions_selected"
                      multiple :menu-props="{ maxHeight: '400' }" item-text="title"
                      item-value="code" :label="$store.getters.languages(['permissions.title'])"
                      persistent-hint :hint="$store.getters.languages(['permissions.select'])"
                      :rules="[v => v.length>0 || $store.getters.languages(['error.required_select'])]"></v-select>
                  </v-flex>
                      <v-flex xs6 sm3 md3>
                    <v-text-field v-model.trim="item.alias" label="Alias"></v-text-field>
                  </v-flex>
                  <v-flex xs6 sm3 md3>
                    <v-text-field type="number" v-model.trim="item.orders" :label="$store.getters.languages(['global.orders'])"
                      :rules="[v => !!v || $store.getters.languages('error.required')]"></v-text-field>
                  </v-flex>
                  <v-flex xs6 sm3 md3>
                    <v-switch color="primary" :label="item.flag===1?$store.getters.languages(['global.show']):$store.getters.languages(['global.hide'])"
                      :true-value="1" :false-value="0" v-model.number="item.flag"></v-switch>
                  </v-flex>
                  <v-flex xs6 sm3 md3>
                    <v-switch color="primary" :label="$store.getters.languages(['modules.auth'])"
                      :true-value="1" :false-value="0" v-model.number="item.required_auth"></v-switch>
                  </v-flex>
                  <!-- <v-flex xs12 sm6 md4>
                    <upload-files @handleUpload="uploadFiles=$event" :buttonUse="false"
                      :multiple="false" :http="vnptbkn" extension="image/*" :basePath="uploadFiles.basePath"
                      :autoName="true" :buttonText="$store.getters.languages(['global.upload_drag'])"></upload-files>
                  </v-flex>
                  <v-flex xs12 sm6 md8>
                    <display-files :files="uploadFiles.files" :baseUrl="vnptbkn.defaults.host"
                      :isShowName="false" classes="w-50"></display-files>
                  </v-flex> -->
                </v-layout>
              </v-tab-item>
              <v-tab-item>
                <v-layout wrap class="pt-2">
                  <v-flex xs12 sm12 md12>
                    <v-textarea v-model.trim="item.descs" auto-grow box :placeholder="$store.getters.languages(['global.input',' ','global.descs'])"></v-textarea>
                  </v-flex>
                  <v-flex xs12 sm12 md12>
                    <vue-quill-editor v-model.trim="item.contents" ref="Content"
                      :placeholder="$store.getters.languages(['global.contents'])"></vue-quill-editor>
                    <!-- <tinymce id="desc" v-model="item.desc"></tinymce> -->
                  </v-flex>
                </v-layout>
              </v-tab-item>
            </v-tabs>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" flat @click.native="onSave" :disabled="!$store.state.modules.valid"
          :loading="$store.state.$loadingCommit">
          {{$store.getters.languages('global.update')}}
        </v-btn>
        <v-btn color="secondary" flat @click.native="$store.state.modules.dialog=false"
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
import { vnptbkn } from '@/plugins/axios-config'
// import uploadFiles from '@/components/upload-files'
// import displayFiles from '@/components/display-files'
export default {
  components: {
    'vue-quill-editor': quillEditor,
    // 'upload-files': uploadFiles,
    // 'display-files': displayFiles
  },
  data: () => ({
    valid: false,
    isExist: true,
    tabActive: null,
    vnptbkn: vnptbkn,
    permissions_selected: [],
    uploadFiles: { files: [], basePath: 'modules' },
  }),
  mounted() {
    this.reset()
  },
  // created() {
  //   if (this.$route.params.id)
  //     this.$store.commit('modules/SET_ITEM', this.$route.params.id)
  //   else {
  //     this.permissions_selected = []
  //     this.$store.commit('modules/SET_ITEM')
  //   }
  // },
  computed: {
    dialog() {
      return this.$store.state.modules.dialog
    },
    item() {
      return this.$store.state.modules.item
    },
    permissions() {
      return this.$store.getters['permissions/getFilter']({ sortBy: 'orders', find: { flag: 1 } })
    }
  },
  watch: {
    dialog(val) {
      if (!val) this.reset()
    },
    item: {
      handler(val) {
        if (this.permissions && this.permissions.length > 0)
          this.permissions_selected = this.item.permissions.trim(',').split(',')
        if (this.item.code) {
          this.item.code = this.item.code.toString().toLowerCase()
          if (!this.item.id) this.$store.dispatch('modules/existCode').then((rs) => { this.isExist = rs })
        }
      },
      deep: true
    },
    // uploadFiles: {
    //   handler(val) {
    //     if (val.files && val.files.length > 0)
    //       this.item.image = val.files[0].full_name
    //   },
    //   deep: true
    // }
  },
  methods: {
    onSave() {
      if (this.$store.state.modules.valid) {
        this.item.permissions = `,${this.permissions_selected.join(',')},`
        if (this.item.id) this.$store.dispatch('modules/update')
        else this.$store.dispatch('modules/insert')
      }
    },
    reset() {
      this.$store.commit('modules/SET_ITEM')
      this.permissions_selected = []
      this.$refs.form.resetValidation()
    }
  }
}
</script>

<style>
</style>
