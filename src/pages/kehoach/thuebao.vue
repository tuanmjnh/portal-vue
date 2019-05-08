<template>
  <div>
    <v-dialog v-model="dialog_filter" max-width="521px" persistent>
      <v-card>
        <v-card-title class="headline grey lighten-2">
          {{$store.getters.languages('global.filter_data')}}
        </v-card-title>
        <v-card-text>
          <v-layout wrap>
            <v-flex xs12 sm12 md12>
              <v-text-field v-model="pagination.search" append-icon="search" :label="$store.getters.languages('global.search')"
                single-line hide-details></v-text-field>
            </v-flex>
            <v-flex xs12 sm12 md12 v-if="$store.getters['auth/inRoles']('donvi.select')">
              <v-select :items="donvi" v-model="pagination.donvi_id" multiple item-text="ten_dv"
                item-value="donvi_id" :label="$store.getters.languages('global.local')"></v-select>
            </v-flex>
            <v-flex xs12 sm12 md12 v-if="$store.getters['auth/inRoles']('kehoach.update')">
              <v-select :items="pagination_nguoidung" v-model="pagination.ma_nd" multiple
                label="Thuê bao theo nhân viên"></v-select>
            </v-flex>
            <v-flex xs12 sm12 md12>
              <v-select :items="nhom_kh" v-model="pagination.nhomkh_id" multiple
                item-text="title" item-value="id" label="Nhóm kế hoạch"></v-select>
            </v-flex>
          </v-layout>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <!-- <v-btn color="primary" flat @click.native="onSave">
                {{$store.getters.languages('global.accept')}}
              </v-btn> -->
          <v-btn color="primary" flat @click.native="dialog_filter=false">
            {{$store.getters.languages('global.back')}}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialog_import" max-width="521px" persistent>
      <v-form v-model="valid_import" ref="form">
        <v-card>
          <v-card-title class="headline grey lighten-2">
            Gán nhân viên theo tệp
          </v-card-title>
          <v-card-text>
            <v-layout wrap>
              <!-- <v-flex xs12 sm12 md12>
                <v-select :items="donvi_import" v-model="params_import.donvi_id"
                  :hide-selected="true" item-text="ten_dv" item-value="donvi_id" :label="$languages.get('global.local')"
                  :rules="[v=>!!v||$languages.get('error.required_select')]"></v-select>
              </v-flex> -->
              <!-- <v-flex xs12 sm12 md12>
                <v-radio-group v-model="params_import.nhomkh_id" column @click="getNhomKHAttach()"
                  :rules="[v=>!!v||$languages.get('error.required_select')]">
                  <v-radio :key="index" v-for="(item,index) in nhom_kh_import" :label="item.title"
                    :value="item.id"></v-radio>
                </v-radio-group>
              </v-flex> -->
              <v-flex xs12 sm12 md12>
                Tệp dữ liệu mẫu:
                <v-tooltip bottom>
                  <a :href="`${http.defaults.host}/Uploads/KeHoach/template/template.csv`"
                    slot="activator" class="mx-0 theme--info" target="_blank">template</a>
                  <!-- <i class="material-icons">attachment</i> -->
                  <span>Tệp dữ liệu mẫu</span>
                </v-tooltip>
              </v-flex>
            </v-layout>
          </v-card-text>
          <v-divider v-if="params_import.total>0"></v-divider>
          <v-card-text v-if="params_import.total>0">
            <v-layout wrap>
              <v-flex xs12 sm6 md6>
                Tổng số: <b class="primary--text">{{params_import.total}}</b> thuê bao<br />
                Thành công: <b class="success--text">{{params_import.success}}</b> thuê
                bao
                <br />
                Lỗi cập nhật: <b class="danger--text">{{params_import.error.length}}</b>
                thuê bao<br />
              </v-flex>
              <v-flex xs12 sm6 md6 v-if="params_import.error.length>0">
                Tệp dữ liệu lỗi:
                <export-data :getData="getDataErrorExport" filename="loi_capnhat_nhanvien"
                  :suffixFileName="true" :tooltip="$store.getters.languages('global.export')"
                  color="danger" :items="[{title:$store.getters.languages(['global.export',' ',' .csv']),type:'csv'}]" />
              </v-flex>
            </v-layout>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-text>
            <v-flex xs12 sm12 md12>
              Bước 1: Tải tệp dữ liệu mẫu <br />
              Bước 2: Nhập mã thuê bao, mã nhân viên vào tệp <br />
              Bước 2: Chọn tệp đã cập nhật tải lên hệ thống <br />
            </v-flex>
            <v-flex xs12 sm12 md12><br /></v-flex>
            <v-flex xs12 sm12 md12 v-if="attach_upload.files.length>0">
              <p style="position:relative;top:13px;">
                Tệp đã tải lên:
                <a :href="`${http.defaults.host}/${attach_upload.basePath}/${attach_upload.files[0].name}`"
                  target="_blank">{{attach_upload.files[0].name}}</a>
              </p>
            </v-flex>
            <v-flex xs12 sm12 md12>
              <upload-files :http="http" :autoName="false" :buttonUse="false" :multiple="false"
                extension=".csv" :files.sync="attach_upload.files" :loading.sync="attach_upload.loading"
                :buttonText="$languages.get('global.upload_drag')" :basePath="attach_upload.basePath"></upload-files>
            </v-flex>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <!-- <v-btn color="primary" flat @click.native="onSave">
                {{$store.getters.languages('global.accept')}}
              </v-btn> -->
            <v-btn slot="activator" color="primary" flat @click.native="onUpdateND()"
              :loading="$store.state.$loadingCommit">
              Cập nhật
            </v-btn>
            <v-btn slot="activator" color="secondary" flat @click.native="dialog_import=false">
              Quay lại
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
    <v-dialog v-model="dialog_thuchien" max-width="521px" persistent>
      <v-card>
        <v-card-title class="headline grey lighten-2">
          Xác nhận thực hiện
        </v-card-title>
        <v-card-text>
          <v-layout wrap>
            <v-form v-model="valid" ref="form">
              <v-layout wrap>
                <v-flex xs12 sm12 md12>
                  <v-radio-group v-model="item.ket_qua" :column="false" :rules="[v=>v>1||$languages.get('error.required_select')]">
                    <v-radio :key="index" v-for="(item,index) in ket_qua" :label="item.label"
                      :color="item.color" :value="item.value"></v-radio>
                  </v-radio-group>
                </v-flex>
              </v-layout>
              <v-divider></v-divider>
              <v-layout wrap>
                <v-flex xs12 sm12 md12>
                  <v-textarea v-model="item.ghichu" color="teal">
                    <template v-slot:label>
                      <div>
                        Ghi chú
                      </div>
                    </template>
                  </v-textarea>
                </v-flex>
              </v-layout>
            </v-form>
          </v-layout>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <!-- <v-btn color="primary" flat @click.native="onSave">
                {{$store.getters.languages('global.accept')}}
              </v-btn> -->
          <v-btn color="primary" flat @click.native="dialog_thuchien=false">
            {{$store.getters.languages('global.back')}}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-card>
      <v-form v-model="valid" ref="form" v-if="$store.getters['auth/inRoles']('kehoach.update')">
        <v-card-title>
          <v-layout wrap>
            <v-flex xs12 sm5 md5>
              <v-select :items="nguoidung" v-model="$store.state.kehoach.thuebao_nguoidung.nguoidung_id"
                item-value="ma_nd" item-text="ten_nd_dv" :hide-selected="true" label="Nhân viên"
                :rules="[v=>v&&v.length>0||$store.getters.languages('error.required_select')]"></v-select>
            </v-flex>
            <v-spacer></v-spacer>
            <v-tooltip left>
              <v-btn slot="activator" color="primary" flat icon @click.native="onSave"
                :disabled="!valid" :loading="$store.state.$loadingCommit">
                <v-icon>how_to_reg</v-icon>
              </v-btn>
              <span>Cập nhật gán thuê bao đã chọn cho nhân viên</span>
            </v-tooltip>
            <!-- <v-btn color="primary" flat @click.native="onSave" :disabled="!valid"
              :loading="$store.state.$loadingCommit">
              {{$store.getters.languages('global.update')}}
            </v-btn> -->
            <v-tooltip bottom>
              <v-btn slot="activator" color="success" flat icon @click.native="dialog_import=true">
                <v-icon>cloud_upload</v-icon>
              </v-btn>
              <span>Gán nhân viên theo tệp</span>
            </v-tooltip>
          </v-layout>
        </v-card-title>
      </v-form>
      <v-divider></v-divider>
      <v-card-title>
        <span class="title">Danh sách thuê bao kế hoạch</span>
        <v-spacer></v-spacer>
        <v-tooltip bottom>
          <v-btn slot="activator" flat icon color="primary" @click="dialog_filter=true">
            <v-icon>filter_list</v-icon>
          </v-btn>
          <span>{{$store.getters.languages('global.filter_data')}}</span>
        </v-tooltip>
        <export-data :getData="getDataExport" filename="kehoach_thuebao" :suffixFileName="true"
          :tooltip="$store.getters.languages('global.export')" color="success" :items="[{title:$store.getters.languages(['global.export',' ',' .csv']),type:'csv'}]" />
      </v-card-title>
      <v-data-table class="elevation-1" v-model="$store.state.kehoach.selected_tb"
        select-all item-key="id" :headers="headers" :items="items" :rows-per-page-items="[10, 25, 50, 100, 200, 500]"
        :rows-per-page-text="$store.getters.languages('global.rows_per_page')"
        :pagination.sync="pagination" :loading="$store.state.$loadingGet" :total-items="totalItems">
        <template slot="items" slot-scope="props">
          <tr>
            <td>
              <v-checkbox v-model="props.selected" primary hide-details></v-checkbox>
            </td>
            <td>{{ props.item.ma_tb }}</td>
            <td>{{ props.item.ten_tb }}</td>
            <td>{{ props.item.so_dt }}</td>
            <td>{{ props.item.ma_nd }}</td>
            <td class="justify-center layout px-0">
              <v-tooltip bottom>
                <v-btn flat icon slot="activator" color="teal" class="mx-0" @click="onEdit(props.item)">
                  <v-icon>offline_pin</v-icon>
                </v-btn>
                <span>Xác nhận</span>
              </v-tooltip>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card>
    <tpl-confirm :dialog="dialog_confirm" @onAccept="onCFMAccept" @onCancel="onCFMCancel"
      :title="$store.getters.languages('global.message')" :content="$store.getters.languages('messages.confirm_content')"
      :btnAcceptText="$store.getters.languages('global.accept')" :btnCancelText="$store.getters.languages('global.cancel')"></tpl-confirm>
  </div>
</template>

<script>
import { vnptbkn } from '@/plugins/axios-config'
import confirm from '@/components/confirm'
import uploadFiles from '@/components/upload-files'
import exportData from '@/components/export-data'
export default {
  components: {
    'tpl-confirm': confirm,
    'upload-files': uploadFiles,
    'export-data': exportData
  },
  data: () => ({
    http: vnptbkn(),
    dialog_confirm: false,
    dialog_filter: false,
    dialog_import: false,
    dialog_thuchien: false,
    valid: false,
    valid_import: false,
    totalItems: 0,
    pagination: {
      loading: true,
      search: '',
      sortBy: 'donvi_id,nhom_kh,thang_bd,id',
      descending: false,
      toggle: 0,
      flag: 1,
      page: 1,
      rowsPerPage: 10,
      donvi_id: [5588],
      nhomkh_id: [702],
      ma_nd: ['']
    },
    headers: [
      { text: 'Mã TB', value: 'ma_tb', align: 'left' },
      { text: 'Tên TB', value: 'ten_tb' },
      { text: 'Số ĐT', value: 'so_dt' },
      { text: 'Mã NV', value: 'ma_nd' },
      { text: '#', value: '#', sortable: false },
      // { text: 'Tháng BĐ', value: 'thang_bd' },
      // { text: 'Tháng KT', value: 'thang_kt' },
      // { text: '#', value: '#', sortable: false },
    ],
    attach_upload: {
      files: [],
      basePath: 'Uploads/KeHoach',
      loading: false
    },
    params_import: {
      donvi_id: 0,
      nhomkh_id: 0,
      file_name: '',
      file_upload: '',
      nhomkh_attach: '',
      total: 0,
      success: 0,
      error: []
    }
  }),
  created() {
    this.$store.dispatch('kehoach/GetNguoidung', { loading: false, donvi_id: this.pagination.donvi_id })
  },
  mounted() {
    this.headers.forEach(e => { e.text = this.$store.getters.languages(e.text) })
  },
  computed: {
    items() {
      return this.$store.state.kehoach.kehoach_tb
    },
    donvi() {
      // const rs = this.$store.getters['donvi/getFilter']({ sortBy: 'ma_dvi' })
      // return [
      //   ...[{ donvi_id: 0, ten_dv: this.$store.getters.languages('global.select_all') }],
      //   ...rs
      // ]
      return this.$store.getters['donvi/getFilter']({ sortBy: 'ma_dvi' })
    },
    nhom_kh() {
      // const rs = this.$store.getters['kehoach/getNhomKH']
      // return [
      //   ...[{ id: 0, title: this.$store.getters.languages('global.select_all') }],
      //   ...rs
      // ]
      return this.$store.getters['kehoach/getNhomKH']
    },
    donvi_import() {
      return this.$store.getters['donvi/getFilter']({ sortBy: 'ma_dvi' })
    },
    nhom_kh_import() {
      return this.$store.getters['kehoach/getNhomKH'] // this.$store.state.kehoach.nhom_kh
    },
    nguoidung() {
      return this.$store.state.kehoach.nguoidung
    },
    pagination_nguoidung() {
      const rs = this.$store.state.kehoach.nguoidung.map((x) => ({ value: x.ma_nd, text: x.ten_nd_dv }))
      return [
        ...[{ value: '', text: '-- Chưa được gán nhân viên --' }],
        ...rs
      ]
    }
  },
  watch: {
    pagination: {
      handler(val) {
        this.$store.dispatch('kehoach/select_tb', this.pagination).then((x) => {
          if (x && x.total) this.totalItems = x.total
        })
      },
      deep: true
    },
    attach_upload: {
      handler(val) {
        if (val.files.length > 0) {
          this.params_import.file_name = val.files[0].name
          this.params_import.file_upload = `${this.attach_upload.basePath}/${val.files[0].name}`
          //
          this.params_import.total = 0
          this.params_import.success = 0
          this.params_import.error = []
        }
      },
      deep: true
    },
    dialog_import: {
      handler(val) {
        this.attach_upload.files = []
        this.reset()
      },
      deep: true
    }
  },
  methods: {
    onEdit(item) {
      this.$store.commit('kehoach/SET_ITEM', item)
      this.dialog_filter = true
    },
    onDelete(item) {
      this.dialog_confirm = true
      if (item) this.$store.state.kehoach.selected.push(item)
    },
    onCFMAccept() {
      this.$store.dispatch('kehoach/delete')
    },
    onCFMCancel() {
      this.$store.state.kehoach.selected = []
    },
    onSave() {
      if (this.valid) {
        this.$store.dispatch('kehoach/insert_th', { loading: true })
      }
    },
    onUpdateND() {
      if (this.valid_import) {
        this.$store.dispatch('kehoach/updateND', this.params_import).then((x) => {
          this.params_import.total = x.total
          this.params_import.success = x.success
          this.params_import.error = x.error
        })
      }
    },
    getNhomKHAttach() {
      var x = this.nhom_kh_import.find((x) => { return x.id === this.params_import.nhomkh_id })
      if (x && x.attach)
        this.params_import.nhomkh_attach = x.attach
      else
        this.params_import.nhomkh_attach = ''
    },
    getDataExport() {
      let params = { ...this.pagination }
      params.sortBy = 'ten_dv,nhom_kh,ma_tb'
      params.loading = true
      params.is_export = true
      return this.$store.dispatch('kehoach/select_tb', params)
    },
    getDataErrorExport() {
      return new Promise((resolve, reject) => {
        resolve(this.params_import.error)
      })
    },
    reset() {
      this.params_import.total = 0
      this.params_import.success = 0
      this.params_import.error = []
    }
  }
}
</script>

<style>
</style>