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
                <v-flex xs12 sm6 md6>
                  <v-text-field v-model.trim="item.urls" label="Url"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md6 class="text-append-icon">
                  <v-text-field v-model.trim="item.icon" label="Icon"></v-text-field>
                  <div class="icon" v-html="item.icon"></div>
                </v-flex>
                <v-flex xs12 md6 sm6>
                  <v-select :items="permissions" item-text="title" item-value="code"
                    v-model="permissions_selected" :menu-props="{ maxHeight: '400' }" :hide-selected="true"
                    label="Permissions" multiple persistent-hint hint="Pick your permissions"></v-select>
                </v-flex>
                <v-flex xs6 sm3 md3>
                  <v-text-field type="number" v-model.trim="item.orders" label="Orders"
                    :rules="[rules.required.orders]"></v-text-field>
                </v-flex>
                <v-flex xs6 sm3 md3>
                  <v-switch color="primary" :label="item.flag===1?'Show':'Hide'"
                    :true-value="1" :false-value="0" v-model.number="item.flag"></v-switch>
                </v-flex>
                <!-- <v-flex xs12 sm6 md6>
                  <v-text-field v-model.trim="item.attach_file" label="Tệp dữ liệu"
                    :disabled="true" class="text-color-initial"></v-text-field>
                </v-flex> -->
                <v-flex xs12 sm6 md4>
                  <upload-files @handleUpload="uploadFiles=$event" :buttonUse="false"
                    :basePath="uploadFiles.basePath" :multiple="false" :autoName="true"
                    :http="vnptbkn" extension="image/*" buttonText="Ấn vào đây để chọn tệp"></upload-files>
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
                  <v-textarea v-model.trim="item.descs" label="Desc" auto-grow box
                    placeholder="Nhập miêu tả"></v-textarea>
                </v-flex>
                <v-flex xs12 sm12 md12>
                  <vue-quill-editor v-model.trim="item.contents" ref="Content"
                    placeholder="Nhập nội dung"></vue-quill-editor>
                  <!-- <tinymce id="desc" v-model="item.desc"></tinymce> -->
                </v-flex>
              </v-layout>
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
    vnptbkn: vnptbkn,
    permissions_selected: [],
    uploadFiles: { files: [], basePath: 'modules' },
    rules: {
      required: {
        title: val => !!val || 'Required.',
        code: val => !!val || 'Required.',
        orders: val => !!val || 'Required.'
      },
      exist: {
        code: val => true || 'Exist.' //{
      }
    }
  }),
  mounted() {
    this.$store.dispatch('modules/item')
    if (this.permissions && this.permissions.length < 1) this.$store.dispatch('permissions/select')
  },
  created() {
  },
  computed: {
    item() {
      var item = this.$store.state.modules.item
      if (item.attach) item.attach_file = item.attach.replace('modules/', '')
      // this.permissions.forEach(e => { this.item.permissions += e + ',' });
      // if (item.permissions)
      //   console.log(item.permissions.trim(','))
      return item
    },
    permissions() {
      var filter = { sortBy: 'orders', find: { flag: 1 } };
      var item = this.$store.getters['permissions/getFilter'](filter)
      return item
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
    handleSave() {
      this.item.permissions = `,${this.permissions_selected.join(',')},`
      if (this.item.id) this.$store.dispatch('modules/update')
      else this.$store.dispatch('modules/insert').then((result) => {
        this.$store.dispatch('modules/item')
      })
    },
    checkExistCode() {
      var $this = this;
      this.item.code = this.item.code.toString().toLowerCase()
      if (this.item.code && !this.item.id)
        //setTimeout(function () {
        $this.$store.dispatch('modules/existCode').then(rs => {
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
