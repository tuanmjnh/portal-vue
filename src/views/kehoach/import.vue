<template>
  <v-card>
    <v-card-title class="headline">Nhập dữ liệu thuê bao</v-card-title>
    <v-divider></v-divider>
    <v-card-text class="p-0">
      <v-form v-model="valid" ref="form">
        <v-container grid-list-md>
          <v-layout wrap v-if="params.nhomkh_id<1&&attach_upload.files.length<1">
            <v-flex xs6 sm6 md6 v-if="params.success||params.error.length>0">
              Nhập thành công: <b class="success--text">{{params.success}}</b>
              thuê bao
              <br />
              Lỗi dữ liệu nhập : <b class="error--text">{{params.error.length}}</b>
              thuê bao
            </v-flex>
            <v-flex xs6 sm6 md6 v-if="params.error.length>0">
              <export-data :getData="getErrorExport" tooltip="Tải danh sách lỗi" color="error" filename="import_error"
                :items="[{title:`${$languages.get('global.export')} .csv`,type:'csv'}]" />
            </v-flex>
          </v-layout>
          <v-layout wrap>
            <v-flex xs12 sm6 md6>
              <v-radio-group v-model="params.nhomkh_id" column @click="getNhomKHAttach()"
                :rules="[v=>!!v||$languages.get('error.required_select')]">
                <v-radio :key="index" v-for="(item,index) in nhom_kh" :label="item.title" :value="item.id"></v-radio>
              </v-radio-group>
            </v-flex>
            <v-flex xs12 sm6 md6>
              <!-- class="text-sm-right" -->
              <v-layout wrap>
                <v-flex xs12 sm12 md12>
                  <v-select :items="donvi" v-model="params.donvi_id" :hide-selected="true" item-text="ten_dv"
                    item-value="donvi_id" :label="$languages.get('global.local')"
                    :rules="[v=>!!v||$languages.get('error.required_select')]"></v-select>
                </v-flex>
                <v-flex xs12 sm6 md6>
                  <v-menu v-model="date_picker_start.menu" :nudge-right="40" lazy transition="scale-transition" offset-y
                    full-width min-width="290px" :close-on-content-click="false">
                    <template v-slot:activator="{on}">
                      <v-text-field :value="datePickerFormat(date_picker_start.date)" label="Tháng bắt đầu" prepend-icon="event" readonly
                        v-on="on" persistent-hint hint="Định dạng: MM/YYYY"></v-text-field>
                    </template>
                    <v-date-picker v-model="date_picker_start.date" @input="date_picker_start.menu=false"></v-date-picker>
                  </v-menu>
                </v-flex>
                <v-flex xs12 sm6 md6 class="pb-3">
                  <v-menu v-model="date_picker_end.menu" :nudge-right="40" lazy transition="scale-transition" offset-y
                    full-width min-width="290px" :close-on-content-click="false">
                    <template v-slot:activator="{on}">
                      <v-text-field :value="datePickerFormat(date_picker_end.date)" label="háng kết thúc" prepend-icon="event" readonly
                        v-on="on" persistent-hint hint="Định dạng: MM/YYYY"></v-text-field>
                    </template>
                    <v-date-picker v-model="date_picker_end.date" @input="date_picker_end.menu=false"></v-date-picker>
                  </v-menu>
                </v-flex>
                <!-- <v-flex xs12 sm6 md6 class="pb-3">
                  <v-text-field :value="datePickerFormat()" label="Tháng kết thúc"
                    prepend-icon="event" readonly persistent-hint hint="Định dạng: MM/YYYY"></v-text-field>
                </v-flex> -->
                <v-flex xs12 sm12 md12 v-if="params.nhomkh_attach">
                  Tệp dữ liệu mẫu:
                  <v-tooltip bottom>
                    <a :href="`${http.defaults.host}/${params.nhomkh_attach}`" slot="activator" class="mx-0 theme--info"
                      target="_blank">template</a>
                    <!-- <i class="material-icons">attachment</i> -->
                    <span>{{params.nhomkh_attach.split('/').pop()}}</span>
                  </v-tooltip>
                </v-flex>
              </v-layout>
            </v-flex>
            <!-- <v-flex xs12 sm6 md6>
              <v-text-field v-model.trim="params.file_name" label="Tệp dữ liệu"
                :disabled="true" class="text-color-initial" :rules="[v=>!!v||$languages.get('error.required')]"></v-text-field>
            </v-flex> -->
            <v-flex xs12 sm6 md6 class="hide">
              <v-text-field v-model="params.file_name" :disabled="true" class="text-color-initial"
                :rules="[v=>!!v||$languages.get('error.required')]"></v-text-field>
            </v-flex>
            <v-flex xs12 sm12 md12 v-if="attach_upload.files.length>0">
              <p style="position:relative;top:13px;">
                {{$languages.get('global.attach')}}:
                <a :href="`${http.defaults.host}/${attach_upload.basePath}/${attach_upload.files[0].name}`"
                  target="_blank">{{attach_upload.files[0].name}}</a>
              </p>
            </v-flex>
            <v-flex xs12 sm6 md6 v-if="params.nhomkh_id>0">
              <upload-files :http="http" :autoName="false" :buttonUse="false" :multiple="false" extension=".csv"
                :files.sync="attach_upload.files" :loading.sync="attach_upload.loading"
                :buttonText="$languages.get('global.upload_drag')" :basePath="attach_upload.basePath"></upload-files>
            </v-flex>
          </v-layout>
        </v-container>
      </v-form>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="primary" flat @click.native="onSave" :disabled="!valid" :loading="$store.state.$loadingCommit">
        Cập nhật thuê bao
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
    date_picker_start: {
      menu: false,
      format: 'MM/YYYY',
      date: new Date().toISOString().substr(0, 10),
    },
    date_picker_end: {
      menu: false,
      format: 'MM/YYYY',
      date: new Date().toISOString().substr(0, 10),
    },
    params: {
      loading: true,
      donvi_id: 0,
      nhomkh_id: 0,
      nhomkh_attach: '',
      file_name: '',
      file_upload: '',
      thang_bd: 0,
      success: '',
      error: []
    },
  }),
  computed: {
    donvi() {
      return this.$store.state.donvi.items //this.$store.getters['donvi/getPBH']
    },
    nhom_kh() {
      return this.$store.getters['kehoach/getNhomKH'] // this.$store.state.kehoach.nhom_kh
    },
    dateFormat() {
      return this.params.start_at.formatDate('MM/YYYY')
    }
  },
  watch: {
    attach_upload: {
      handler(val) {
        if (val.files.length > 0) {
          this.params.file_name = val.files[0].name
          this.params.file_upload = `${this.attach_upload.basePath}/${val.files[0].name}`
        }
      },
      deep: true
    }
  },
  methods: {
    onSave() {
      if (this.valid) {
        this.params.thang_bd = this.date_picker_start.date.formatDate('YYYYMM')
        this.params.thang_kt = this.date_picker_end.date.formatDate('YYYYMM')
        this.$store.dispatch('kehoach/import_tb', this.params).then((x) => {
          if (x) {
            this.params.success = x.success
            this.params.error = x.error
          }
          this.reset()
        })
      }
    },
    getErrorExport() {
      return new Promise((resolve, reject) => {
        resolve(this.params.error)
      })
    },
    datePickerFormat(date) {
      return date.formatDate('MM/YYYY')
    },
    getNhomKHAttach() {
      var x = this.nhom_kh.find((x) => { return x.id === this.params.nhomkh_id })
      if (x && x.attach)
        this.params.nhomkh_attach = x.attach
      else
        this.params.nhomkh_attach = ''
    },
    reset() {
      this.params.nhomkh_id = 0
      this.params.donvi_id = 0
      this.params.file_name = ''
      this.params.file_upload = ''
      this.attach_upload.files = []
      this.$refs.form.resetValidation()
    }
  }
}
</script>

<style>
</style>
