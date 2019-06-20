<template>
  <v-dialog v-model="$store.state.news.dialog" max-width="1024px" persistent>
    <v-card>
      <v-card-title class="headline grey lighten-2">
        {{ item.id ?
        $languages.get('global.details') :
        $languages.get('global.add')
        }}
      </v-card-title>
      <v-card-text class="p-0">
        <v-form v-model="valid" ref="form">
          <v-tabs v-model="tabs" color="secondary" dark>
            <v-tab>{{$languages.get('global.main_info')}}</v-tab>
            <v-tab>{{$languages.get('global.attach')}}</v-tab>
            <v-tab>{{$languages.get('global.images')}}</v-tab>
            <v-tab>{{$languages.get('global.contents')}}</v-tab>
            <v-tab-item>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 sm6 md6>
                    <v-select :items="category" v-model.trim="item.code" item-value="id"
                      item-text="title" :label="$languages.get('global.dependent')"
                      :rules="[v=>!!v||$languages.get('error.required_select')]"></v-select>
                  </v-flex>
                  <v-flex xs12 sm6 md6>
                    <v-select :items="app_key" v-model="item.app_key" :label="$languages.get('category.app_key')"
                      :rules="[v=>!!v||$languages.get('error.required_select')]"
                      item-text="title" item-value="app_key"></v-select>
                  </v-flex>
                  <v-flex xs12 sm5 md5>
                    <v-text-field v-model.trim="item.title" :rules="[v=>!!v||$languages.get('error.required')]"
                      :label="$languages.get('news.title')"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm7 md7>
                    <v-text-field v-model.trim="item.url" :label="$languages.get('global.url')"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md6 class="text-append-icon">
                    <v-text-field v-model.trim="item.icon" label="Icon"></v-text-field>
                    <div class="icon" v-html="item.icon"></div>
                  </v-flex>
                  <v-flex xs3 sm2 md2>
                    <v-text-field type="number" v-model.trim="item.orders" :label="$languages.get('global.orders')"
                      :rules="[v =>!!v||$languages.get('error.required')]"></v-text-field>
                  </v-flex>
                  <v-flex xs3 sm2 md2>
                    <v-text-field type="number" v-model.trim="item.quantity" :label="$languages.get('global.quantity')"></v-text-field>
                  </v-flex>
                  <v-flex xs6 sm2 md2>
                    <v-switch color="primary" :label="item.flag===1?$languages.get('global.show'):$languages.get('global.hide')"
                      :true-value="1" :false-value="0" v-model.number="item.flag"></v-switch>
                  </v-flex>
                  <v-flex xs12 sm6 md6 class="text-append-icon">
                    <v-text-field v-model.trim="tag" :label="$languages.get('global.tags')"></v-text-field>
                    <v-tooltip bottom>
                      <div slot="activator" class="icon pointer" @click="addTag()">
                        <i class="material-icons">spellcheck</i>
                      </div>
                      <span>{{$languages.get('global.add')}}</span>
                    </v-tooltip>
                  </v-flex>
                  <v-flex xs12 sm12 md12>
                    <template v-for="(tag,index) in tags">
                      <v-chip color="orange" text-color="white" :key="index">
                        <!-- <v-avatar>
                          <v-icon right>turned_in</v-icon>
                        </v-avatar> -->
                        {{tag}}
                        <div class="v-chip__close" @click="removeTag()">
                          <i aria-hidden="true" class="v-icon material-icons theme--light">cancel</i>
                        </div>
                      </v-chip>
                      <!-- 
                      <v-chip :v-model="true" close color="green" outline :key="index">
                        {{tag}}
                      </v-chip> -->
                    </template>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-tab-item>
            <v-tab-item>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 sm12 md12 v-if="this.item.attach">
                    <!-- <p style="position:relative;top:13px;"> -->
                    <!-- {{$languages.get('global.attach')}} -->
                    <v-list>
                      <v-list-tile>
                        <v-list-tile-content>
                          <v-list-tile-title>
                            <a :href="`${http.defaults.host}/${this.item.attach}`" target="_blank">{{this.item.attach.replace(attach_upload.basePath+'/','')}}</a>
                          </v-list-tile-title>
                        </v-list-tile-content>
                        <v-list-tile-action>
                          <v-tooltip left>
                            <v-icon slot="activator" class="pointer danger--text" @click="removeAttach()">clear</v-icon>
                            <span>{{$languages.get('global.delete')}}</span>
                          </v-tooltip>
                        </v-list-tile-action>
                      </v-list-tile>
                    </v-list>
                    <!-- <a :href="`${http.defaults.host}/${this.item.attach}`" target="_blank">{{this.item.attach.replace(attach_upload.basePath+'/','')}}</a> -->
                    <!-- </p> -->
                  </v-flex>
                  <v-flex xs12 sm6 md6>
                    <upload-files :http="http" :autoName="true" :buttonUse="false"
                      :multiple="true" extension="*" :files.sync="attach_upload.files"
                      :loading.sync="attach_upload.loading" :buttonText="$languages.get('global.upload_drag')"
                      :basePath="attach_upload.basePath"></upload-files>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-tab-item>
            <v-tab-item>
              <v-container grid-list-md>
                <!-- <v-layout wrap class="pt-2">
                  <v-flex xs12 sm12 md12 v-if="item.id">
                    <display-files :files="item.image" :baseUrl="http.defaults.host"
                      :isShowName="false" classes="w-50"></display-files>
                  </v-flex>
                  <v-flex xs12 sm6 md4>
                    <upload-files @handleUpload="uploadFiles=$event" :buttonUse="false"
                      :multiple="false" :http="http" extension="image/*" :basePath="uploadFiles.basePath"
                      :autoName="true" :buttonText="$languages.get('global.upload_drag')"></upload-files>
                  </v-flex>
                  <v-flex xs12 sm6 md8>
                    <display-files :files="uploadFiles.files" :baseUrl="http.defaults.host"
                      :isShowName="false" classes="w-50"></display-files>
                  </v-flex>
                </v-layout> -->
              </v-container>
            </v-tab-item>
            <v-tab-item>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 sm12 md12>
                    <v-textarea v-model.trim="item.descs" auto-grow box :placeholder="$store.getters.languages(['global.input',' ','global.descs'])"></v-textarea>
                  </v-flex>
                  <v-flex xs12 sm12 md12>
                    <vue-quill-editor v-model.trim="item.content" ref="Content"
                      :placeholder="$languages.get('global.contents')"></vue-quill-editor>
                    <!-- <tinymce id="desc" v-model="item.desc"></tinymce> -->
                  </v-flex>
                </v-layout>
              </v-container>
            </v-tab-item>
          </v-tabs>
        </v-form>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" flat @click.native="onSave" :disabled="!valid" :loading="$store.state.$loadingCommit">
          {{$languages.get('global.update')}}
        </v-btn>
        <v-btn color="secondary" flat @click.native="$store.state.news.dialog=false"
          :disabled="$store.state.$loadingCommit">
          {{$languages.get('global.back')}}
        </v-btn>
      </v-card-actions>
    </v-card>
    <tpl-confirm :dialog.sync="dialog_confirm" @onAccept="onCFMAccept" :title="$languages.get('global.message')"
      :content="$languages.get('messages.confirm_content')" :btnAcceptText="$languages.get('global.accept')"
      :btnCancelText="$languages.get('global.cancel')"></tpl-confirm>
  </v-dialog>
</template>

<script>
import uploadFiles from '@/components/upload-files'
import displayFiles from '@/components/display-files'
import confirm from '@/components/confirm'
import { quillEditor } from 'vue-quill-editor'
export default {
  components: {
    'upload-files': uploadFiles,
    'display-files': displayFiles,
    'tpl-confirm': confirm,
    'vue-quill-editor': quillEditor,
  },
  props: { http: null },
  data: () => ({
    valid: false,
    tabs: null,
    tag: '',
    tags: [],
    attach: '',
    dialog_confirm: false,
    attach_upload: {
      files: [],
      basePath: 'Uploads/news',
      loading: false//true,
    },
    // dependent_selected: '',
    uploadFiles: { files: [], basePath: 'Uploads/news' },
  }),
  mounted() {
    this.reset()
  },
  computed: {
    dialog() {
      return this.$store.state.news.dialog
    },
    item() {
      return this.$store.state.news.item
    },
    category() {
      return this.$store.state.category.items.map(x => ({ id: x.id.toString(), title: x.title }))
    },
    app_key() {
      return this.$store.getters['app_key/getFilter']()
    }
  },
  watch: {
    dialog(val) {
      if (!val) this.reset()
      if (this.item.id) {
        // if (this.item.code) this.dependent_selected = this.item.code.trim(',').split(',').map(e => parseInt(e))
        if (this.item.tags) this.tags = this.item.tags.trim(',').split(',')
      }
    },
    attach_upload: {
      handler(val) {
        if (val.files.length > 0) {
          // this.params.file_name = val.files[0].name
          this.item.attach = `${this.attach_upload.basePath}/${val.files[0].name}`
        }
      },
      deep: true
    }
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
      if (this.valid) {
        // if (this.dependent_selected) this.item.code = `,${this.dependent_selected.join(',')},`
        if (this.tags) this.item.tags = `,${this.tags.join(',')},`
        if (this.item.id) this.$store.dispatch('news/update')
        else this.$store.dispatch('news/insert').then(() => { this.reset() })
      }
    },
    onExistCode() {
      this.item.code = this.item.code.toString().toLowerCase()
      if (!this.item.id) this.$store.dispatch('news/exist_code')
    },
    addTag() {
      this.tags.push(this.tag)
      this.tag = ''
    },
    removeTag() {
      this.tags.splice(this.item.tags.indexOf(this.tag), 1)
    },
    removeAttach() {
      this.dialog_confirm = true
    },
    onCFMAccept() {
      this.item.attach = ''
    },
    reset() {
      this.$store.commit('news/SET_ITEM')
      // this.dependent_selected = [0]
      this.tags = []
      this.$refs.form.resetValidation()
      this.attach_upload.files = []
    }
  }
}
</script>

<style>
</style>
