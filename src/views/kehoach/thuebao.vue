<template>
  <div>
    <v-dialog v-model="dialog_filter" max-width="521px">
      <v-card>
        <v-card-title class="headline grey lighten-2">
          {{$languages.get('global.filter_data')}}
        </v-card-title>
        <v-card-text>
          <v-layout wrap>
            <v-flex xs12 sm12 md12>
              <v-text-field v-model="pagination.search" append-icon="search" :label="$languages.get('global.search')"
                single-line hide-details></v-text-field>
            </v-flex>
            <v-flex xs12 sm12 md12 v-if="$store.getters['auth/inRoles']('donvi.select')">
              <v-select :items="donvi" v-model="pagination.donvi_id" item-text="ten_dv" item-value="donvi_id"
                :label="$languages.get('global.local')"></v-select>
            </v-flex>
            <v-flex xs12 sm12 md12>
              <v-select :items="nhom_kh" v-model="pagination.nhomkh_id" item-text="title" item-value="id"
                label="Nhóm kế hoạch"></v-select>
            </v-flex>
            <v-flex xs12 sm12 md12 v-if="$store.getters['auth/inRoles']('kehoach.update')">
              <v-select :items="pagination_nguoidung" v-model="pagination.ma_nd" item-text="ten_nd_dv"
                item-value="ma_nd" label="Thuê bao theo nhân viên"></v-select>
            </v-flex>
            <v-flex xs12 sm12 md12>
              <v-menu v-model="date_picker_th.menu" :nudge-right="40" lazy transition="scale-transition" offset-y
                full-width min-width="290px" :close-on-content-click="false">
                <template v-slot:activator="{on}">
                  <v-text-field :value="datePickerFormat(date_picker_th.date)" label="Tháng thực hiện"
                    append-icon="event" readonly v-on="on" persistent-hint hint="Định dạng: MM/YYYY"></v-text-field>
                </template>
                <v-date-picker v-model="date_picker_th.date" @input="date_picker_th.menu=false"></v-date-picker>
              </v-menu>
            </v-flex>
            <v-flex xs12 sm12 md12>
              <v-select :items="flag" v-model="pagination.flag" label="Trạng thái thực hiện"></v-select>
            </v-flex>
          </v-layout>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat @click.native="onFilter">
            {{$languages.get('global.accept')}}
          </v-btn>
          <v-btn color="primary" flat @click.native="dialog_filter=false">
            {{$languages.get('global.back')}}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialog_chitiet" max-width="600px" persistent v-if="$store.state.kehoach.item">
      <v-card>
        <v-card-title class="headline grey lighten-2">
          Chi tiết thuê bao
        </v-card-title>
        <v-card-text>
          <v-tabs v-model="tabs_deatils" color="secondary" dark>
            <v-tab>Thông tin thuê bao</v-tab>
            <v-tab>Thông tin thực hiện</v-tab>
            <v-tab-item>
              <v-container fluid grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 sm6 md6>
                    <v-text-field :value="getNhomKHDetails($store.state.kehoach.item.nhom_kh)" label="Nhóm kế hoạch"
                      :disabled="true" class="text-color-initial"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md6>
                    <v-text-field :value="$store.state.kehoach.item.ma_tb" label="Mã Thuê bao" :disabled="true"
                      class="text-color-initial"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md6>
                    <v-text-field :value="$store.state.kehoach.item.ten_tb" label="Tên thuê bao" :disabled="true"
                      class="text-color-initial"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md6>
                    <v-text-field :value="$store.state.kehoach.item.diachi_tb" label="Địa chỉ thuê bao" :disabled="true"
                      class="text-color-initial"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md6>
                    <v-text-field :value="$store.state.kehoach.item.so_dt" label="Số điện thoại" :disabled="true"
                      class="text-color-initial"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md6>
                    <v-text-field :value="$store.state.kehoach.item.ma_nd" label="Nhân viên thực hiện" :disabled="true"
                      class="text-color-initial"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md6>
                    <v-text-field :value="$store.state.kehoach.item.nguoi_nhap" label="Người nhập" :disabled="true"
                      class="text-color-initial"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md6>
                    <v-text-field :value="getFormatDate($store.state.kehoach.item.ngay_nhap)" label="Ngày nhập"
                      :disabled="true" class="text-color-initial"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm12 md12>
                    <v-textarea :value="$store.state.kehoach.item.ghichu" label="Ghi chú thuê bao" :disabled="true"
                      class="text-color-initial" :rows="2"></v-textarea>
                  </v-flex>
                  <!-- <v-flex xs12 sm6 md6>
                <v-text-field :value="$store.state.kehoach.item.ip_nhap" label="Nhân viên thực hiện"
                  :disabled="true" class="text-color-initial"></v-text-field>
              </v-flex> -->
                </v-layout>
              </v-container>
            </v-tab-item>
            <v-tab-item>
              <v-container fluid grid-list-md>
                <v-layout wrap v-if="pagination.flag===1">
                  <v-flex xs12 sm6 md6>
                    <b>Chưa thực hiện</b>
                  </v-flex>
                </v-layout>
                <v-layout wrap v-else>
                  <v-flex xs12 sm6 md6>
                    <v-text-field :value="getFormatDate($store.state.kehoach.item.ngay_th)" label="Ngày thực hiện"
                      :disabled="true" class="text-color-initial"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md6>
                    <v-text-field :value="getKetQua($store.state.kehoach.item.ket_qua).label" label="Kết quả"
                      :disabled="true" class="text-color-initial"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md6>
                    <v-text-field :value="$store.state.kehoach.item.goicuoc" label="Gói cước" :disabled="true"
                      class="text-color-initial"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md6>
                    <v-text-field :value="$store.state.kehoach.item.lydo" label="Lý do" :disabled="true"
                      class="text-color-initial"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md6>
                    <v-text-field :value="$store.state.kehoach.item.de_xuat" label="Đề xuất" :disabled="true"
                      class="text-color-initial"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm12 md12>
                    <v-textarea :value="$store.state.kehoach.item.ghichu_th" label="Ghi chú thực hiện" :disabled="true"
                      class="text-color-initial" :rows="2"></v-textarea>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-tab-item>
          </v-tabs>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat @click.native="dialog_chitiet=false">
            {{$languages.get('global.back')}}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialog_import" max-width="521px" persistent>
      <v-form v-model="valid_import" ref="valid_import">
        <v-card>
          <v-card-title class="headline grey lighten-2">
            Gán nhân viên theo tệp
          </v-card-title>
          <v-card-text>
            <!-- <v-container grid-list-md> -->
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
                  <a :href="`${http.defaults.host}/Uploads/KeHoach/template/template.csv`" slot="activator"
                    class="mx-0 theme--info" target="_blank">template</a>
                  <!-- <i class="material-icons">attachment</i> -->
                  <span>Tệp dữ liệu mẫu</span>
                </v-tooltip>
              </v-flex>
            </v-layout>
            <!-- </v-container> -->
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
                <export-data :getData="getDataErrorExport" filename="loi_capnhat_nhanvien" :suffixFileName="true"
                  :tooltip="$languages.get('global.export')" color="danger"
                  :items="[{title:$store.getters.languages(['global.export',' ',' .csv']),type:'csv'}]" />
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
              <upload-files :http="http" :autoName="false" :buttonUse="false" :multiple="false" extension=".csv"
                :files.sync="attach_upload.files" :loading.sync="attach_upload.loading"
                :buttonText="$languages.get('global.upload_drag')" :basePath="attach_upload.basePath"></upload-files>
            </v-flex>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <!-- <v-btn color="primary" flat @click.native="onSave">
                {{$languages.get('global.accept')}}
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
    <v-dialog v-model="dialog_thuchien" max-width="600px" persistent>
      <v-card>
        <v-card-title class="headline grey lighten-2">
          Xác nhận thực hiện
        </v-card-title>
        <v-card-text v-if="!$store.state.$loadingGet">
          <v-form v-model="valid_thuchien" ref="valid_thuchien">
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm12 md12>
                  <span class="subheading primary--text">Chọn kết quả: </span>
                </v-flex>
                <v-flex xs12 sm12 md12>
                  <v-radio-group v-model="params_thuchien.ket_qua" :column="false"
                    :rules="[v=>!!v||$languages.get('error.required_select')]">
                    <v-radio :key="index" v-for="(item,index) in ket_qua" :label="item.label" :color="item.color"
                      :value="item.value"></v-radio>
                  </v-radio-group>
                </v-flex>
              </v-layout>
              <v-divider></v-divider>
              <v-layout>
                <v-flex xs12 sm12 md12 v-if="kehoach_extra.goicuoc&&kehoach_extra.goicuoc.length>0">
                  <v-select :items="kehoach_extra.goicuoc" v-model="params_thuchien.goicuoc" item-text="title"
                    :rules="[v=>!!v||$languages.get('error.required_select')]" item-value="id" label="Gói cước"
                    hint="Chọn một gói cước" persistent-hint></v-select>
                </v-flex>
                <v-flex xs12 sm12 md12 v-else>
                  <v-text-field v-model.trim="params_thuchien.goicuoc"
                    :rules="[v=>!!v||$languages.get('error.required')]" :label="'Gói cước'"
                    hint="Nhập gói cước gói cước" persistent-hint></v-text-field>
                </v-flex>
              </v-layout>
              <v-divider v-if="params_thuchien.ket_qua===2"></v-divider>
              <v-layout wrap v-if="params_thuchien.ket_qua===2">
                <!-- <v-flex xs12 sm12 md12>
                  <span class="subheading primary--text">Lý do: </span>
                </v-flex> -->
                <v-flex xs12 sm12 md12 class="mb-3">
                  <v-select :items="kehoach_extra.lydo" v-model="params_thuchien.lydo" item-text="title"
                    :rules="[v=>!!v||$languages.get('error.required_select')]" item-value="id" label="Lý do"
                    hint="Chọn một lý do" persistent-hint></v-select>
                </v-flex>
              </v-layout>
              <v-divider v-if="params_thuchien.ket_qua===2"></v-divider>
              <v-layout wrap v-if="params_thuchien.ket_qua===2">
                <v-flex xs12 sm12 md12>
                  <v-textarea v-model="params_thuchien.de_xuat" color="info"
                    :rules="[v=>!!v||$languages.get('error.required_select')]">
                    <template v-slot:label>
                      <div>
                        Nhập Đề xuất
                      </div>
                    </template>
                  </v-textarea>
                </v-flex>
              </v-layout>
              <v-divider></v-divider>
              <v-layout wrap>
                <v-flex xs12 sm12 md12>
                  <v-textarea v-model="params_thuchien.ghichu" color="info">
                    <template v-slot:label>
                      <div>
                        Nhập ghi chú nếu có
                      </div>
                    </template>
                  </v-textarea>
                </v-flex>
              </v-layout>
            </v-container>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat :disabled="!valid_thuchien" @click.native="onThuchien"
            :loading="$store.state.$loadingCommit">
            {{$languages.get('global.accept')}}
          </v-btn>
          <v-btn color="secondary" flat @click.native="dialog_thuchien=false">
            {{$languages.get('global.back')}}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-card>
      <v-form v-model="valid" ref="valid_update" v-if="$store.getters['auth/inRoles']('kehoach.update')">
        <v-card-title>
          <v-layout wrap>
            <v-flex xs12 sm12 md12>
              <span class="title">Giao thuê bao cho nhân viên</span>
            </v-flex>
            <v-flex xs12 sm5 md5>
              <v-select :items="nguoidung" v-model="selected_nd" item-value="ma_nd" item-text="ten_nd_dv"
                :hide-selected="true" label="Nhân viên"
                :rules="[v=>v&&v.length>0||$languages.get('error.required_select')]" hint="Chọn một nhân viên"
                persistent-hint></v-select>
            </v-flex>
            <v-spacer></v-spacer>
            <!-- <v-tooltip left>
              <v-btn slot="activator" color="primary" flat icon @click.native="onSave"
                :disabled="!valid" :loading="$store.state.$loadingCommit">
                <v-icon>how_to_reg</v-icon>
              </v-btn>
              <span>Cập nhật gán thuê bao đã chọn cho nhân viên</span>
            </v-tooltip> -->
            <v-btn color="primary" flat @click.native="onUpdateNVTB" :disabled="!valid"
              :loading="$store.state.$loadingCommit">
              {{$languages.get('global.update')}}
            </v-btn>
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
          <span>{{$languages.get('global.filter_data')}}</span>
        </v-tooltip>
        <v-tooltip bottom v-if="$store.getters['auth/inRoles']('kehoach.update')">
          <v-btn slot="activator" color="success" flat icon @click.native="dialog_import=true">
            <v-icon>cloud_upload</v-icon>
          </v-btn>
          <span>Giao thuê bao theo tệp</span>
        </v-tooltip>
        <export-data :getData="getDataExport" filename="kehoach_thuebao" :suffixFileName="true"
          :tooltip="$languages.get('global.export')" color="success"
          :items="[{title:$store.getters.languages(['global.export',' ',' .csv']),type:'csv'}]" />
      </v-card-title>
      <v-data-table class="elevation-1" v-model="selected_tb" select-all item-key="id" :headers="headers" :items="items"
        :rows-per-page-items="[10, 25, 50, 100, 200, 500]" :rows-per-page-text="$languages.get('global.rows_per_page')"
        :pagination.sync="pagination" :no-data-text="$languages.get('global.no_data_text')"
        :no-results-text="$languages.get('global.no_results_text')" :loading="$store.state.$loadingGet"
        :total-items="totalItems">
        <template slot="items" slot-scope="props">
          <tr>
            <td>
              <v-checkbox v-model="props.selected" primary hide-details></v-checkbox>
            </td>
            <td>{{ props.item.ma_tb }}</td>
            <td>{{ props.item.ten_tb }}</td>
            <td>{{ props.item.so_dt }}</td>
            <td>{{ props.item.ma_nd }}</td>
            <td>{{ props.item.diachi_tb }}</td>
            <td class="justify-center layout px-0">
              <v-tooltip bottom>
                <v-btn flat icon slot="activator" color="primary" class="mx-0" @click="onDetails(props.item)">
                  <v-icon>event_note</v-icon>
                </v-btn>
                <span>Chi tiết</span>
              </v-tooltip>
              <v-tooltip bottom v-if="pagination.flag===1 && pagination.thang_th >= currentNow">
                <v-btn flat icon slot="activator" color="primary" class="mx-0" @click="onEdit(props.item)">
                  <v-icon>input</v-icon>
                </v-btn>
                <span>Xác nhận thực hiện</span>
              </v-tooltip>
              <template v-else>
                <v-tooltip bottom>
                  <v-btn flat icon slot="activator" :color="props.item.ket_qua_color" class="mx-0">
                    <v-icon>{{props.item.ket_qua_icon}}</v-icon>
                  </v-btn>
                  <span>{{props.item.ket_qua_title}}</span>
                </v-tooltip>
              </template>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card>
    <tpl-confirm :dialog.sync="dialog_confirm" @onAccept="onCFMAccept" @onCancel="onCFMCancel"
      :title="$languages.get('global.message')" :content="$languages.get('messages.confirm_content')"
      :btnAcceptText="$languages.get('global.accept')" :btnCancelText="$languages.get('global.cancel')"></tpl-confirm>
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
    dialog_chitiet: false,
    valid: false,
    valid_import: false,
    valid_thuchien: false,
    totalItems: 0,
    tabs_deatils: null,
    selected_tb: [],
    selected_nd: '',
    pagination: {
      loading: true,
      search: '',
      sortBy: 'donvi_id,nhom_kh,ngay_cn_th,thang_bd,id',
      descending: false,
      toggle: 0,
      flag: 1,
      page: 1,
      rowsPerPage: 10,
      donvi_id: 5588,
      nhomkh_id: 702,
      ma_nd: '0',
      ket_qua: '',
      thang_th: 0,
    },
    headers: [
      { text: 'Mã TB', value: 'ma_tb', align: 'left' },
      { text: 'Tên TB', value: 'ten_tb' },
      { text: 'Số ĐT', value: 'so_dt' },
      { text: 'Mã NV', value: 'ma_nd' },
      { text: 'Địa chỉ', value: 'diachi_tb' },
      // { text: '#', value: '#f', sortable: false },
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
    },
    params_thuchien: {
      loading: true,
      nhomkh_id: '',
      kehoachtb_id: '',
      ket_qua: 0,
      goicuoc: '',
      lydo: '',
      de_xuat: '',
      ghichu: '',
    },
    flag: [
      { value: 1, text: 'Chưa thực hiện' },
      { value: 2, text: 'Đã thực hiện' }
    ],
    ket_qua: [
      {
        value: 1,
        color: 'success',
        icon: 'offline_pin',
        label: 'Thành công',
      },
      {
        value: 2,
        color: 'danger',
        icon: 'cancel',
        label: 'Không thành công',
      }
    ],
    date_picker_th: {
      menu: false,
      format: 'MM/YYYY',
      date: new Date().toISOString().substr(0, 10),
    },
    currentNow: parseInt(new Date().formatDate('YYYYMM'))
  }),
  mounted() {
    this.headers.forEach(e => { e.text = this.$store.getters.languages(e.text) })
  },
  computed: {
    items() {
      let rs = this.$store.state.kehoach.kehoach_tb
      rs.forEach(e => {
        const x = this.ket_qua.find((x) => { return x.value === e.ket_qua })
        if (x) {
          e.ket_qua_title = x.label
          e.ket_qua_color = x.color
          e.ket_qua_icon = x.icon
        }
        else {
          e.ket_qua_title = 'Quá hạn'
          e.ket_qua_color = 'danger'
          e.ket_qua_icon = 'sync_problem'
        }
      })
      return rs
    },
    donvi() {
      // const rs = this.$store.getters['donvi/getFilter']({ sortBy: 'ma_dvi' })
      // return [
      //   ...[{ donvi_id: 0, ten_dv: this.$languages.get('global.select_all') }],
      //   ...rs
      // ]
      return this.$store.state.donvi.items //this.$store.getters['donvi/getPBH']
    },
    nhom_kh() {
      // const rs = this.$store.getters['kehoach/getNhomKH']
      // return [
      //   ...[{ id: 0, title: this.$languages.get('global.select_all') }],
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
      //return this.$store.getters['nguoidung/getFilterDonvi'](this.pagination.donvi_id)
      return this.$store.state.kehoach.nguoidung
    },
    pagination_nguoidung() {
      const rs = this.$store.getters['kehoach/getFilterDonvi']({
        donvi_id: this.$store.getters['auth/inRoles']('donvi.select') ? this.pagination.donvi_id : this.$store.state.auth.user.donvi_id
      }) // this.$store.state.kehoach.nguoidung.map((x) => ({ value: x.ma_nd, text: x.ten_nd_dv }))
      //return rs.unshift([{ ma_nd: '', ten_nd_dv: '-- Chưa được gán nhân viên --' }])
      return [
        ...[{ ma_nd: '0', ten_nd_dv: this.$languages.get('global.select_all') }],
        ...[{ ma_nd: '', ten_nd_dv: '-- Chưa được gán nhân viên --' }],
        ...rs
      ]
    },
    kehoach_extra() {
      return this.$store.state.kehoach.kehoach_extra
    }
  },
  watch: {
    // pagination: {
    //   handler(val) {
    //     this.$store.dispatch('kehoach/select_tb', this.pagination).then((x) => {
    //       if (x && x.total) this.totalItems = x.total
    //     })
    //   },
    //   deep: true
    // },
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
    },
    dialog_thuchien: {
      handler(val) {
        if (val) {
          this.$store.dispatch('kehoach/GetLyDo', this.params_thuchien)
          this.params_thuchien.ket_qua = 0
          this.params_thuchien.goicuoc = ''
          this.params_thuchien.lydo = ''
          this.params_thuchien.de_xuat = ''
          this.params_thuchien.ghichu = ''
        }
      },
      deep: true
    }
  },
  methods: {
    onFilter() {
      this.dialog_filter = false
      this.pagination.thang_th = parseInt(this.date_picker_th.date.formatDate('YYYYMM'))
      this.$store.dispatch('kehoach/select_tb', this.pagination).then((x) => {
        if (x && x.total) this.totalItems = x.total
      })
    },
    onEdit(item) {
      // this.$store.commit('kehoach/SET_ITEM', item)
      this.params_thuchien.nhomkh_id = item.nhom_kh
      this.params_thuchien.kehoachtb_id = item.id
      this.dialog_thuchien = true
    },
    onDetails(item) {
      this.$store.commit('kehoach/SET_ITEM', item)
      this.dialog_chitiet = true
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
    onUpdateNVTB() {
      if (this.valid) {
        this.$store.dispatch('kehoach/updateNVTB', {
          loading: true,
          tb: this.selected_tb,
          nd: this.selected_nd
        }).then(() => {
          this.selected_tb = []
          this.selected_nd = ''
          this.$refs.valid_update.resetValidation()
        })
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
    onThuchien() {
      this.$store.dispatch('kehoach/Thuchien', this.params_thuchien).then((x) => {
        this.dialog_thuchien = false
        this.params_thuchien.nhomkh_id = ''
        this.params_thuchien.kehoachtb_id = ''
        this.params_thuchien.ket_qua = 0
        this.params_thuchien.lydo = ''
        this.params_thuchien.de_xuat = ''
        this.params_thuchien.ghichu = ''
        this.$refs.valid_thuchien.resetValidation()
      })
    },
    getNhomKHAttach() {
      var x = this.nhom_kh_import.find((x) => { return x.id === this.params_import.nhomkh_id })
      if (x && x.attach)
        this.params_import.nhomkh_attach = x.attach
      else
        this.params_import.nhomkh_attach = ''
    },
    getNhomKHDetails(nhom_kh) {
      const x = this.nhom_kh.find((x) => { return x.id === nhom_kh })
      return x ? x.title : 'Chưa xác định'
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
    getKetQua(val) {
      let rs = this.ket_qua.find((x) => { return x.value === val })
      return rs ? rs : { label: 'Không xác định', color: 'red' }
    },
    getFormatDate(val) {
      if (val) return val.formatDate()
      else return 'Không có thông tin'
    },
    reset() {
      this.params_import.total = 0
      this.params_import.success = 0
      this.params_import.error = []
      this.$refs.valid_import.resetValidation()
    },
    datePickerFormat(date) {
      return date.formatDate('MM/YYYY')
    }
  }
}
</script>

<style>
</style>