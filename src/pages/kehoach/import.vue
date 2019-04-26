<template>
  <v-card>
    <v-card-title class="headline">Nhập dữ liệu thuê bao</v-card-title>
    <v-divider></v-divider>
    <v-card-text class="p-0">
      <v-form v-model="valid" ref="form">
        <v-container grid-list-md>
          <v-layout wrap class="pt-2">
            <v-flex xs6 sm6 md6 v-if="$store.state.kehoach.import_tb.success||$store.state.kehoach.import_tb.error">
              Tải lên thành công: <b class="success--text">{{$store.state.kehoach.import_tb.success}}</b>
              thuê bao
              <br />
              Lỗi không thể nhập : <b class="error--text">{{$store.state.kehoach.import_tb.error.length}}</b>
              thuê bao
            </v-flex>
            <v-flex xs6 sm6 md6 v-if="$store.state.kehoach.import_tb.error">
              <export-data :getData="getErrorExport" tooltip="Tải danh sách lỗi" color="error" :items="[{title:$store.getters.languages(['global.export',' ',' .csv']),type:'csv'}]" />
            </v-flex>
            <v-flex xs12 sm12 md12>
              <v-radio-group v-model="$store.state.kehoach.import_tb.nhomkh_id" column
                :rules="[v=>!!v||$store.getters.languages('error.required_select')]">
                <v-radio :key="index" v-for="(item,index) in nhom_kh" :label="item.title"
                  :value="item.id"></v-radio>
              </v-radio-group>
            </v-flex>
            <v-flex xs12 sm6 md6>
              <v-text-field v-model.trim="$store.state.kehoach.import_tb.file_name" label="Tệp dữ liệu"
                :disabled="true" class="text-color-initial" :rules="[v=>!!v||$store.getters.languages('error.required')]"></v-text-field>
            </v-flex>
            <v-flex xs12 sm6 md6></v-flex>
            <v-flex xs12 sm6 md4>
              <upload-files @handleUpload="uploadFiles=$event" :buttonUse="false"
                :multiple="false" :http="http" extension=".csv" :basePath="uploadFiles.basePath"
                :autoName="false" :buttonText="$store.getters.languages('global.upload_drag')"></upload-files>
            </v-flex>
            <v-flex xs12 sm6 md8 v-if="uploadFiles.files.length>0">
              <display-files :files="uploadFiles.files" icon="list_alt" :baseUrl="http.defaults.host"
                :isShowName="false" classes="p-10"></display-files>
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
    uploadFiles: { files: [], basePath: 'Uploads/KeHoach' },
  }),
  computed: {
    nhom_kh() {
      return this.$store.getters['kehoach/getNhomKH'] // this.$store.state.kehoach.nhom_kh
    },
  },
  watch: {
    uploadFiles: {
      handler(val) {
        if (val.files && val.files.length > 0) {
          this.$store.state.kehoach.import_tb.file_name = val.files[0].full_name.replace('Uploads/KeHoach/', '')
          this.$store.state.kehoach.import_tb.file_upload = val.files[0].full_name
        }
      },
      deep: true
    }
  },
  methods: {
    onSave() {
      if (this.valid) {
        this.$store.dispatch('kehoach/import_tb').then(()=>{
          this.$store.state.kehoach.import_tb.nhomkh_id = 0
          this.$store.state.kehoach.import_tb.file_name = ''
          this.$store.state.kehoach.import_tb.file_upload = ''
          this.uploadFiles.files = []
          this.$refs.form.resetValidation()
        })
      }
    },
    getErrorExport() {
      return new Promise((resolve, reject) => {
        resolve(this.$store.state.kehoach.import_tb.error)
      })
    }
  }
}
</script>

<style>
</style>
