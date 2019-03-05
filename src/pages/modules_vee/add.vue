<template>
  <v-dialog v-model="localDialog" :persistent="isLoading" max-width="1024px">
    <!-- <v-btn slot="activator" color="primary" dark class="mb-2">New Item</v-btn> -->
    <v-card>
      <v-card-title class="headline grey lighten-2">
        {{ item.id ?
        $store.getters.languages(['global.details']) :
        $store.getters.languages(['global.add']) }}
      </v-card-title>
      <v-card-text>
        <form>
          <v-container grid-list-md>
            <v-tabs v-model="tabActive" color="secondary" dark>
              <v-tab>{{$store.getters.languages(['global.main_info'])}}</v-tab>
              <v-tab>{{$store.getters.languages(['global.note'])}}</v-tab>
              <v-tab-item>
                <v-layout wrap class="pt-2">
                  <v-flex xs12 sm8 md8>
                    <!-- <v-text-field v-model.trim="item.title" :label="$store.getters.languages(['modules.title'])"
                      :rules="[!!item.title || $store.getters.languages(['messages.err_required')]"></v-text-field> -->
                    <v-text-field v-model.trim="item.title" v-validate="'required'" name="title"
                      :error-messages="$store.getters.languages(errors.items.getRule('title'))"
                      :label="$store.getters.languages(['modules.title'])"></v-text-field>
                    <!-- <span>{{errors.items.getRule('title')}}</span> -->
                    <!-- <span v-show="errors.has('title')">{{ errors.first('title') }}</span> -->
                  </v-flex>
                  <v-flex xs12 sm4 md4>
                    <v-text-field v-model.trim="item.code" v-validate="'required|exist'"
                      name="code" :error-messages="$store.getters.languages(errors.items.getRule('code'))"
                      :label="$store.getters.languages(['global.code'])"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md6>
                    <v-text-field v-model.trim="item.urls" v-validate="'required'" name="urls"
                      :error-messages="$store.getters.languages(errors.items.getRule('urls'))"
                      :label="$store.getters.languages(['global.url'])"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md6 class="text-append-icon">
                    <v-text-field v-model.trim="item.icon" label="Icon"></v-text-field>
                    <div class="icon" v-html="item.icon"></div>
                  </v-flex>
                  <v-flex xs12 md6 sm6>
                    <v-select :items="permissions" v-model="permissions_selected"
                      multiple :menu-props="{ maxHeight: '400' }" item-text="title"
                      item-value="code" :label="$store.getters.languages(['permissions.title'])"
                      persistent-hint :hint="$store.getters.languages(['permissions.select'])"></v-select>
                  </v-flex>
                  <v-flex xs6 sm3 md3>
                    <v-text-field type="number" v-model.trim="item.orders" v-validate="'required|numeric'"
                      name="orders" :label="$store.getters.languages(['global.orders'])"
                      :error-messages="$store.getters.languages(errors.items.getRule('orders'))"></v-text-field>
                  </v-flex>
                  <v-flex xs6 sm3 md3>
                    <v-switch color="primary" :label="item.flag===1?$store.getters.languages(['global.show']):$store.getters.languages(['global.hide'])"
                      :true-value="1" :false-value="0" v-model.number="item.flag"></v-switch>
                  </v-flex>
                  <!-- <v-flex xs12 sm6 md6>
                  <v-text-field v-model.trim="item.attach_file" label="Tệp dữ liệu"
                    :disabled="true" class="text-color-initial"></v-text-field>
                </v-flex> -->
                  <v-flex xs12 sm6 md4>
                    <upload-files @handleUpload="uploadFiles=$event" :buttonUse="false"
                      :multiple="false" :http="vnptbkn" extension="image/*" :basePath="uploadFiles.basePath"
                      :autoName="true" :buttonText="$store.getters.languages(['global.upload_drag'])"></upload-files>
                  </v-flex>
                  <v-flex xs12 sm6 md8>
                    <display-files :files="uploadFiles.files" :baseUrl="vnptbkn.defaults.host"
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
                      :placeholder="$store.getters.languages(['global.contents'])"></vue-quill-editor>
                    <!-- <tinymce id="desc" v-model="item.desc"></tinymce> -->
                  </v-flex>
                </v-layout>
              </v-tab-item>
            </v-tabs>
          </v-container>
        </form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" flat @click.native="onSave" :disabled="isValid" :loading="isLoading">
          {{$store.getters.languages(['global.update'])}}
        </v-btn>
        <v-btn color="secondary" flat @click.native="localDialog=false" :disabled="isLoading">
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
import uploadFiles from '@/components/upload-files'
import displayFiles from '@/components/display-files'
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
    $this: this,
    localDialog: false,
    tabActive: null,
    isLoading: false,
    vnptbkn: vnptbkn,
    permissions_selected: [],
    uploadFiles: { files: [], basePath: 'modules' },
    rules: { code: val => true || false }
  }),
  beforeCreate() { },
  created() {
    let self = this
    self.$store.dispatch('modules/item')
    if (self.$store.state.permissions.items.length < 1) self.$store.dispatch('permissions/select')
    self.$validator.extend('exist', {
      getMessage(field, val) { return 'error.exist' },
      validate: value => {
        if (value) {
          value = value.toString().toLowerCase()
          return self.$store.dispatch('modules/existCode')
        }
      }
    })
  },
  beforeMount() { },
  mounted() { },
  computed: {
    item() {
      var item = this.$store.state.modules.item
      if (item.attach) item.attach_file = item.attach.replace('modules/', '')
      if (item.code) item.code = item.code.toString().toLowerCase()
      return item
    },
    permissions() {
      var filter = { sortBy: 'orders', find: { flag: 1 } };
      var item = this.$store.getters['permissions/getFilter'](filter)
      return item
    },
    isValid() {
      return Object.keys(this.fields).some(key => this.fields[key].invalid);
    }
  },
  watch: {
    dialog(val) { this.localDialog = val },
    localDialog(val) {
      this.$emit('handleDialog', val)
      if (!val) this.$store.dispatch('modules/item')
    },
    uploadFiles: {
      handler(val) {
        if (val.files && val.files.length > 0)
          this.item.image = val.files[0].full_name
      },
      deep: true
    },
    item(val) {
      if (this.permissions && this.permissions.length > 0) {
        this.permissions_selected = []
        this.permissions.forEach(e => {
          if (val.permissions.indexOf(`,${e.code},`) > -1) this.permissions_selected.push(e.code)
        });
      }
    }
  },
  methods: {
    onSave() {
      this.isLoading = true
      this.$validator.validateAll().then(result => {
        if (result) {
          this.item.permissions = `,${this.permissions_selected.join(',')},`
          if (this.item.id) this.$store.dispatch('modules/update').then(this.isLoading = false)
          else this.$store.dispatch('modules/insert').then((result) => {
            this.$store.dispatch('modules/item')
            this.isLoading = false
          })
        }
      })
    }
  }
}
</script>

<style>
</style>
