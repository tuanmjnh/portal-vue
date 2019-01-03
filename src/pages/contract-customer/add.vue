<template>
  <v-dialog v-model="localDialog" max-width="1024px" persistent>
    <!-- <v-btn slot="activator" color="primary" dark class="mb-2">New Item</v-btn> -->
    <v-card>
      <v-card-title>
        <span class="headline">{{
          this.$store.state.contract_customer.khachhang.contract_customer_id ?
          'Chi tiết hợp đồng lưu trữ' :
          'Thêm mới hợp đồng lưu trữ' }}</span>
      </v-card-title>
      <v-card-text>
        <v-container grid-list-md>
          <v-tabs v-model="tabActive" color="transparent">
            <v-tab>Thông tin khách hàng</v-tab>
            <v-tab>Thông tin thuê bao</v-tab>
            <v-tab>Ghi chú</v-tab>
            <v-tab>Thông tin thêm</v-tab>
            <v-tab-item>
              <v-layout wrap class="pt-2">
                <v-flex xs12 sm12 md4>
                  <v-text-field v-model.trim="khachhang.ma_gd" label="Mã hợp đồng"
                    v-on:keyup.enter="getContract"></v-text-field>
                </v-flex>
                <v-flex xs12 sm12 md8>
                  <v-text-field v-model="khachhang.ten_kh" label="Tên khách hàng"
                    :disabled="true" class="text-color-initial"></v-text-field>
                </v-flex>
                <v-flex xs12 sm12 md12>
                  <v-text-field v-model="khachhang.diachi_kh" label="Địa chỉ khách hàng"
                    :disabled="true" class="text-color-initial"></v-text-field>
                </v-flex>
                <!-- <v-flex xs12 sm12 md12>
              <v-text-field v-model="khachhang.diachi_tb" label="Địa chỉ thuê bao"></v-text-field>
            </v-flex>
            <v-flex xs12 sm12 md12>
              <v-text-field v-model="khachhang.diachi_ld" label="Địa chỉ lắp đặt"></v-text-field>
            </v-flex> -->
                <v-flex xs12 sm6 md6>
                  <v-text-field v-model="khachhang.so_dt" label="Điện thoại liên hệ"
                    :disabled="true" class="text-color-initial"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md6>
                  <v-text-field v-model="khachhang.so_gt" label="Số giấy tờ" :disabled="true"
                    class="text-color-initial"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md6>
                  <v-text-field v-model="khachhang.mst" label="Mã số thuế" :disabled="true"
                    class="text-color-initial"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md6>
                  <v-text-field v-model="khachhang.stk" label="Số tài khoản" :disabled="true"
                    class="text-color-initial"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md6>
                  <v-text-field :value="khachhang.donvi_id" label="Đơn vị quản lý"
                    :disabled="true" class="text-color-initial"></v-text-field>
                </v-flex>
                <v-flex xs12 sm12 md12>
                  Dang sach: <display-files></display-files>
                </v-flex>
                <v-flex xs12 sm12 md12 v-if="khachhang.ma_gd">
                  <display-files></display-files>
                  <div class="spacer"></div>
                  <upload-files @handleUpload="uploadFiles=$event" :buttonUse="true"
                    :multiple="false" :autoName="true" :http="vnptbkn"></upload-files>
                  <!-- :fileName="khachhang.ma_gd.replace(/\//g,'_')" -->
                </v-flex>
                <!-- <v-flex xs12 sm6 md4>
              <v-switch color="primary" :label="khachhang.flag===1?'Show':'Hide'" :true-value="1"
                :false-value="0" v-model.number="khachhang.flag"></v-switch>
            </v-flex> -->
              </v-layout>
            </v-tab-item>
            <v-tab-item>
              <v-data-table :headers="headers" :items="thuebao" class="elevation-1" hide-actions>
                <template slot="items" slot-scope="props">
                  <td>{{ props.item.ma_tb }}</td>
                  <td>{{ props.item.ten_tb }}</td>
                  <td>{{ props.item.diachi_tb }}</td>
                  <td>{{ props.item.diachi_ld }}</td>
                  <td>{{ props.item.loaihinh_tb }}</td>
                  <td>{{ props.item.ten_dvql }}</td>
                </template>
              </v-data-table>
            </v-tab-item>
            <v-tab-item>
              <v-layout wrap class="pt-2">
                <v-flex xs12 sm12 md12>
                  <vue-quill-editor v-model="khachhang.details" ref="Ghi chú">
                  </vue-quill-editor>
                  <!-- <tinymce id="desc" v-model="khachhang.desc"></tinymce> -->
                </v-flex>
              </v-layout>
            </v-tab-item>
            <v-tab-item>
              <v-layout wrap class="pt-2">
                <v-flex xs12 sm6 md6>
                  <v-text-field :value="khachhang.loaihd_id" label="Loại hợp đồng"
                    :disabled="true" class="text-color-initial"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md6>
                  <v-text-field :value="khachhang.kieuhd_id" label="Kiểu hợp đồng"
                    :disabled="true" class="text-color-initial"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md6>
                  <v-text-field v-model="khachhang.nguoi_cn" label="Người cập nhật"
                    :disabled="true" class="text-color-initial"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md6>
                  <v-text-field :value="khachhang.ngay_cn|formatDate" label="Ngày cập nhật"
                    :disabled="true" class="text-color-initial"></v-text-field>
                </v-flex>
              </v-layout>
            </v-tab-item>
          </v-tabs>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" flat @click.native="handleSave" v-if="uploadFiles.files.length>0">
          <!-- <i class="material-icons">check</i> -->
          {{this.$store.state.contract_customer.khachhang.contract_customer_id ? 'Cập nhật':'Thêm mới' }}
        </v-btn>
        <v-btn color="secondary" flat @click.native="localDialog=false">
          <!-- <i class="material-icons">close</i>  -->
          Hủy bỏ
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
// import 'quill/dist/quill.core.css'
// import 'quill/dist/quill.snow.css'
// import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'
import uploadFiles from '@/components/upload-files'
import displayFiles from '@/components/display-files'
import { vnptbkn } from '@/plugins/axios-config'
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
    localDialog: false,
    tabActive: null,
    editedIndex: -1,
    uploadFiles: { files: [] },
    vnptbkn: vnptbkn,
    headers: [
      { text: 'Mã TB', align: 'left', value: 'ma_tb' },
      { text: 'Tên TB', value: 'ten_tb' },
      { text: 'Địa chỉ TB', value: 'diachi_tb' },
      { text: 'Địa chỉ LĐ', value: 'diachi_ld' },
      { text: 'Loại TB', value: 'loaitb_id' },
      { text: 'Đơn vị', value: 'donvi_id' }
    ]
  }),
  mounted() {
    this.$store.dispatch('contract_customer/khachhang')
  },
  computed: {
    khachhang() {
      var khachhang = this.$store.state.contract_customer.khachhang
      return khachhang
    },
    thuebao() {
      var thuebao = this.$store.state.contract_customer.thuebao
      return thuebao
    }
  },
  watch: {
    dialog(val) { this.localDialog = val },
    localDialog(val) {
      this.$emit('handleDialog', val)
      if (!val) {
        this.$store.dispatch('contract_customer/khachhang')
        this.$store.dispatch('contract_customer/thuebao')
      }
    },
    uploadFiles: {
      handler(val) {
        console.log(val)
      },
      deep: true
    }
  },
  methods: {
    handleSave() {
      if (this.khachhang.id) this.$store.dispatch('contract_customer/update')
      else this.$store.dispatch('contract_customer/insert')
    },
    getContract() {
      if (this.khachhang.ma_gd.length > 0)
        this.$store.dispatch('contract_customer/getContract').then()
    }
  },
  created() {
    // console.log(this.vnptbkn.defaults)
  }
}
</script>

<style>
</style>
