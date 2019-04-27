<template>
  <v-card>
    <v-card-title class="headline">Nhập dữ liệu thuê bao</v-card-title>
    <v-divider></v-divider>
    <v-card-text class="p-0">
      <v-form v-model="valid" ref="form">
        <v-container grid-list-md>
          <v-layout wrap v-if="$store.state.kehoach.import_tb.nhomkh_id<1&&attach_upload.files.length<1">
            <v-flex xs6 sm6 md6 v-if="$store.state.kehoach.import_tb.success||$store.state.kehoach.import_tb.error.length>0">
              Tải lên thành công: <b class="success--text">{{$store.state.kehoach.import_tb.success}}</b>
              thuê bao
              <br />
              Lỗi không thể nhập : <b class="error--text">{{$store.state.kehoach.import_tb.error.length}}</b>
              thuê bao
            </v-flex>
            <v-flex xs6 sm6 md6 v-if="$store.state.kehoach.import_tb.error.length>0">
              <export-data :getData="getErrorExport" tooltip="Tải danh sách lỗi" color="error"
                filename="import_error" :items="[{title:$store.getters.languages(['global.export',' ',' .csv']),type:'csv'}]" />
            </v-flex>
          </v-layout>
          <v-layout wrap>
            <v-flex xs12 sm6 md6>
              <v-radio-group v-model="$store.state.kehoach.import_tb.nhomkh_id" column
                :rules="[v=>!!v||$store.getters.languages('error.required_select')]">
                <v-radio :key="index" v-for="(item,index) in nhom_kh" :label="item.title"
                  :value="item.id"></v-radio>
              </v-radio-group>
            </v-flex>
            <v-flex xs12 sm6 md6 class="text-sm-right">
              <v-tooltip left v-if="attach_nhomkh">
                <a slot="activator" class="mx-0 theme--info" :href="`${http.defaults.host}/${attach_nhomkh}`"
                  target="_blank">Tệp dữ liệu mẫu</a>
                <!-- <i class="material-icons">attachment</i> -->
                <span>{{attach_nhomkh.split('/').last()}}</span>
              </v-tooltip>
            </v-flex>
            <!-- <v-flex xs12 sm6 md6>
              <v-text-field v-model.trim="$store.state.kehoach.import_tb.file_name" label="Tệp dữ liệu"
                :disabled="true" class="text-color-initial" :rules="[v=>!!v||$store.getters.languages('error.required')]"></v-text-field>
            </v-flex> -->
            <v-flex xs12 sm6 md6 class="hide">
              <v-text-field v-model="$store.state.kehoach.import_tb.file_name" :disabled="true"
                class="text-color-initial" :rules="[v=>!!v||$store.getters.languages('error.required')]"></v-text-field>
            </v-flex>
            <v-flex xs12 sm12 md12 v-if="attach_upload.files.length>0">
              <p style="position:relative;top:13px;">
                {{$store.getters.languages('global.attach')}}:
                <a :href="`${http.defaults.host}/${attach_upload.basePath}/${attach_upload.files[0].name}`"
                  target="_blank">{{attach_upload.files[0].name}}</a>
              </p>
            </v-flex>
            <v-flex xs12 sm6 md6>
              <upload-files :files.sync="attach_upload.files" :http="http" :autoName="false"
                :buttonUse="false" :loading.sync="attach_upload.loading" :buttonText="$store.getters.languages('global.upload_drag')"
                :basePath="attach_upload.basePath" :multiple="false"></upload-files>
            </v-flex>
          </v-layout>
        </v-container>
      </v-form>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="primary" flat @click.native="onSave" :disabled="!valid" :loading="$store.state.$loadingCommit">
        {{$store.getters.languages('global.update')}}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { vnptbkn } from '@/plugins/axios-config'
import uploadFiles from '@/components/upload-files'
import displayFiles from '@/components/display-files'
import exportData from '@/components/export-data'
export default {
  components: {
    'upload-files': uploadFiles,
    'display-files': displayFiles,
    'export-data': exportData
  },
  data: () => ({
    http: vnptbkn(),
    valid: false,
    groups: [],
    attach_nhomkh: '',
    attach_upload: {
      files: [],
      basePath: 'Uploads/KeHoach',
      loading: false//true
    },
  }),
  computed: {
    nhom_kh() {
      return this.$store.getters['kehoach/getNhomKH'] // this.$store.state.kehoach.nhom_kh
    },
    import_tb() {
      return this.$store.state.kehoach.import_tb
    }
  },
  watch: {
    attach_upload: {
      handler(val) {
        if (val.files.length > 0) {
          this.$store.state.kehoach.import_tb.file_name = val.files[0].name
          this.$store.state.kehoach.import_tb.file_upload = `${this.attach_upload.basePath}/${val.files[0].name}`
        }
      },
      deep: true
    },
    import_tb: {
      handler(val) {
        if (val.nhomkh_id > 0) {
          this.attach_nhomkh = this.nhom_kh.find((x) => { return x.id === val.nhomkh_id }).attach
        }
      },
      deep: true
    },
  },
  methods: {
    onSave() {
      if (this.valid) {
        this.$store.dispatch('kehoach/import_tb').then(() => { this.reset() })
      }
    },
    getErrorExport() {
      return new Promise((resolve, reject) => {
        resolve(this.$store.state.kehoach.import_tb.error)
      })
    },
    reset() {
      this.attach_upload.files = []
      this.$refs.form.resetValidation()
    }
  }
}
</script>

<style>
</style>
