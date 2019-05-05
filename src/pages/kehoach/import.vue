<template>
  <v-card>
    <v-card-title class="headline">Nhập dữ liệu thuê bao</v-card-title>
    <v-divider></v-divider>
    <v-card-text class="p-0">
      <v-form v-model="valid" ref="form">
        <v-container grid-list-md>
          <v-layout wrap v-if="$store.state.kehoach.import_tb.nhomkh_id<1&&attach_upload.files.length<1">
            <v-flex xs6 sm6 md6 v-if="$store.state.kehoach.import_tb.success||$store.state.kehoach.import_tb.error.length>0">
              Nhập thành công: <b class="success--text">{{$store.state.kehoach.import_tb.success}}</b>
              thuê bao
              <br />
              Lỗi dữ liệu nhập : <b class="error--text">{{$store.state.kehoach.import_tb.error.length}}</b>
              thuê bao
            </v-flex>
            <v-flex xs6 sm6 md6 v-if="$store.state.kehoach.import_tb.error.length>0">
              <export-data :getData="getErrorExport" tooltip="Tải danh sách lỗi" color="error"
                filename="import_error" :items="[{title:`${$languages.get('global.export')} .csv`,type:'csv'}]" />
            </v-flex>
          </v-layout>
          <v-layout wrap>
            <v-flex xs12 sm6 md6>
              <v-radio-group v-model="$store.state.kehoach.import_tb.nhomkh_id" column
                :rules="[v=>!!v||$languages.get('error.required_select')]"
                @click="getNhomKHAttach()">
                <v-radio :key="index" v-for="(item,index) in nhom_kh" :label="item.title"
                  :value="item.id"></v-radio>
              </v-radio-group>
            </v-flex>
            <v-flex xs12 sm6 md6>
              <!-- class="text-sm-right" -->
              <v-layout wrap>
                <v-flex xs12 sm12 md12>
                  <v-select :items="donvi" v-model="$store.state.kehoach.import_tb.donvi_id"
                    :hide-selected="true" item-text="ten_dv" item-value="donvi_id" :label="$languages.get('global.local')"></v-select>
                </v-flex>
                <v-flex xs12 sm6 md6>
                  <v-menu v-model="date_picker.menu" :nudge-right="40" lazy transition="scale-transition"
                    offset-y full-width min-width="290px">
                    <template v-slot:activator="{on}">
                      <v-text-field :value="datePickerFormat()" label="Tháng bắt đầu"
                        prepend-icon="event" readonly v-on="on" persistent-hint hint="Định dạng: MM/YYYY"></v-text-field>
                    </template>
                    <v-date-picker v-model="date_picker.date" @input="menu2=false"></v-date-picker>
                  </v-menu>
                </v-flex>
                <v-flex xs12 sm6 md6 class="pb-3">
                  <v-text-field :value="datePickerFormat()" label="Tháng kết thúc"
                    prepend-icon="event" :disabled="true" persistent-hint hint="Định dạng: MM/YYYY"></v-text-field>
                </v-flex>
                <v-flex xs12 sm12 md12 v-if="$store.state.kehoach.import_tb.nhomkh_attach">
                  Tệp dữ liệu mẫu:
                  <v-tooltip bottom>
                    <a :href="`${http.defaults.host}/${$store.state.kehoach.import_tb.nhomkh_attach}`"
                      slot="activator" class="mx-0 theme--info" target="_blank">template</a>
                    <!-- <i class="material-icons">attachment</i> -->
                    <span>{{$store.state.kehoach.import_tb.nhomkh_attach.split('/').pop()}}</span>
                  </v-tooltip>
                </v-flex>
              </v-layout>
            </v-flex>
            <!-- <v-flex xs12 sm6 md6>
              <v-text-field v-model.trim="$store.state.kehoach.import_tb.file_name" label="Tệp dữ liệu"
                :disabled="true" class="text-color-initial" :rules="[v=>!!v||$languages.get('error.required')]"></v-text-field>
            </v-flex> -->
            <v-flex xs12 sm6 md6 class="hide">
              <v-text-field v-model="$store.state.kehoach.import_tb.file_name" :disabled="true"
                class="text-color-initial" :rules="[v=>!!v||$languages.get('error.required')]"></v-text-field>
            </v-flex>
            <v-flex xs12 sm12 md12 v-if="attach_upload.files.length>0">
              <p style="position:relative;top:13px;">
                {{$languages.get('global.attach')}}:
                <a :href="`${http.defaults.host}/${attach_upload.basePath}/${attach_upload.files[0].name}`"
                  target="_blank">{{attach_upload.files[0].name}}</a>
              </p>
            </v-flex>
            <v-flex xs12 sm6 md6>
              <upload-files :http="http" :autoName="false" :buttonUse="false" :multiple="false"
                extension=".csv" :files.sync="attach_upload.files" :loading.sync="attach_upload.loading"
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
    date_picker: {
      menu: false,
      format: 'MM/YYYY',
      date: new Date().toISOString().substr(0, 10),
    },
    groups: [],
    attach_nhomkh: '',
    attach_upload: {
      files: [],
      basePath: 'Uploads/KeHoach',
      loading: false//true
    },
  }),
  computed: {
    donvi() {
      return this.$store.getters['donvi/getFilter']({ sortBy: 'ma_dvi' })
    },
    nhom_kh() {
      return this.$store.getters['kehoach/getNhomKH'] // this.$store.state.kehoach.nhom_kh
    },
    import_tb() {
      return this.$store.state.kehoach.import_tb
    },
    dateFormat() {
      return this.$store.state.kehoach.import_tb.start_at.formatDate('MM/YYYY')
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
    }
  },
  methods: {
    onSave() {
      if (this.valid) {
        this.$store.state.kehoach.import_tb.thang_bd = this.date_picker.date.formatDate('YYYYMM')
        this.$store.dispatch('kehoach/import_tb').then(() => { this.reset() })
      }
    },
    getErrorExport() {
      return new Promise((resolve, reject) => {
        resolve(this.$store.state.kehoach.import_tb.error)
      })
    },
    datePickerFormat() {
      return this.date_picker.date.formatDate('MM/YYYY')
    },
    getNhomKHAttach() {
      var x = this.nhom_kh.find((x) => { return x.id === this.$store.state.kehoach.import_tb.nhomkh_id })
      if (x && x.attach)
        this.$store.state.kehoach.import_tb.nhomkh_attach = x.attach
      else
        this.$store.state.kehoach.import_tb.nhomkh_attach = ''
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
