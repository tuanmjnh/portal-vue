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
          <v-container grid-list-md>
            <v-tabs v-model="tabs" color="secondary" dark>
              <v-tab>{{$languages.get('global.main_info')}}</v-tab>
              <v-tab>{{$languages.get('global.images')}}</v-tab>
              <v-tab>{{$languages.get('global.contents')}}</v-tab>
              <v-tab-item>
                <v-layout wrap class="pt-2">
                  <v-flex xs12 sm5 md5>
                    <v-select :items="category" v-model.trim="item.code" item-value="id"
                      item-text="title" :label="$languages.get('category.group')"
                      :rules="[v=>!!v||$languages.get('error.required_select')]"></v-select>
                  </v-flex>
                  <v-flex xs12 sm7 md7>
                    <v-text-field v-model.trim="item.title" :rules="[v=>!!v||$languages.get('error.required')]"
                      :label="$languages.get('news.title')"></v-text-field>
                  </v-flex>
                  <v-flex xs3 sm1 md1>
                    <v-text-field type="number" v-model.trim="item.orders" :label="$languages.get('global.orders')"
                      :rules="[v =>!!v||$languages.get('error.required')]"></v-text-field>
                  </v-flex>
                  <v-flex xs3 sm1 md1>
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
                        {{tag}}
                        <div class="v-chip__close" @click="removeTag()">
                          <i aria-hidden="true" class="v-icon material-icons theme--light">cancel</i>
                        </div>
                      </v-chip>
                    </template>
                  </v-flex>
                </v-layout>
              </v-tab-item>
              <v-tab-item>
                <v-layout wrap class="pt-2">
                  <v-flex xs12 sm12 md12 v-if="item.id">
                    <display-files :files="item.attach" :baseUrl="http.defaults.host"
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
                </v-layout>
              </v-tab-item>
              <v-tab-item>
                <v-layout wrap class="pt-2">
                  <v-flex xs12 sm12 md12>
                    <v-textarea v-model.trim="item.descs" auto-grow box :placeholder="$store.getters.languages(['global.input',' ','global.descs'])"></v-textarea>
                  </v-flex>
                  <v-flex xs12 sm12 md12>
                    <vue-quill-editor v-model.trim="item.contents" ref="Content"
                      :placeholder="$languages.get('global.contents')"></vue-quill-editor>
                  </v-flex>
                </v-layout>
              </v-tab-item>
            </v-tabs>
          </v-container>
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
  </v-dialog>
</template>

<script>
import uploadFiles from '@/components/upload-files'
import displayFiles from '@/components/display-files'
import { quillEditor } from 'vue-quill-editor'
export default {
  components: {
    'upload-files': uploadFiles,
    'display-files': displayFiles,
    'vue-quill-editor': quillEditor,
  },
  props: { http: null },
  data: () => ({
    valid: false,
    tabs: null,
    tag: '',
    tags: [],
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
    uploadFiles: {
      handler(val) {
        if (val.files && val.files.length > 0)
          this.item.image = val.files[0].full_name
      },
      deep: true
    }
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
    reset() {
      this.$store.commit('news/SET_ITEM')
      // this.dependent_selected = [0]
      this.tags = []
      this.$refs.form.resetValidation()
    }
  }
}
</script>

<style>
</style>
