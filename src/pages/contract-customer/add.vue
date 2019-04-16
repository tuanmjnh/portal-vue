<template>
  <v-dialog v-model="$store.state.contract_customer.dialog" max-width="1024px" persistent>
    <v-card>
      <v-card-title class="headline grey lighten-2">
        {{ khachhang.id ?
        $store.getters.languages('global.details') :
        $store.getters.languages('global.add') }}
      </v-card-title>
      <v-card-text class="p-0">
        <div class="mid-center" v-if="$store.state.$loadingCommit">
          <v-progress-circular :size="130" :width="10" color="primary" indeterminate></v-progress-circular>
        </div>
        <v-form v-else v-model="$store.state.contract_customer.valid" ref="form">
          <v-container grid-list-md>
            <v-tabs v-model="$store.state.contract_customer.tabs" color="secondary" dark>
              <v-tab>Thông tin khách hàng</v-tab>
              <v-tab>Thông tin thuê bao</v-tab>
              <v-tab>Thông tin chi tiết</v-tab>
              <v-tab>Ghi chú</v-tab>
              <v-tab-item>
                <v-layout wrap class="pt-2">
                  <v-flex xs12 sm6 md4>
                    <v-text-field v-model.trim="khachhang.ma_gd" label="Mã giao dịch"
                      class="text-color-initial" v-on:keyup.enter="getContract" :disabled="khachhang.id?true:false"
                      :rules="[v=>!!v||$store.getters.languages('error.required')]"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md4>
                    <v-text-field v-model.trim="khachhang.ma_hd" label="Mã hợp đồng"
                      :disabled="true" class="text-color-initial"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md4>
                    <v-text-field v-model.trim="khachhang.ma_kh" label="Mã khách hàng"
                      :disabled="true" class="text-color-initial"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm4 md4>
                    <v-text-field v-model.trim="khachhang.ten_kh" label="Tên khách hàng"
                      :disabled="true" class="text-color-initial"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm4 md4>
                    <v-text-field v-model.trim="khachhang.so_dt" label="Điện thoại liên hệ"
                      :disabled="true" class="text-color-initial"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm4 md4>
                    <v-text-field :value="khachhang.ten_dv" label="Đơn vị" :disabled="true"
                      class="text-color-initial"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md6>
                    <v-text-field v-model.trim="khachhang.diachi_kh" label="Địa chỉ khách hàng"
                      :disabled="true" class="text-color-initial"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md6>
                    <v-text-field v-model.trim="khachhang.hokhau" label="Hộ khẩu"
                      :disabled="true" class="text-color-initial"></v-text-field>
                  </v-flex>
                  <!-- <v-flex xs12 sm12 md12>
              <v-text-field v-model="khachhang.diachi_tb" label="Địa chỉ thuê bao"></v-text-field>
            </v-flex>
            <v-flex xs12 sm12 md12>
              <v-text-field v-model="khachhang.diachi_ld" label="Địa chỉ lắp đặt"></v-text-field>
            </v-flex> -->
                  <v-flex xs12 sm12 md12 v-if="khachhang.id">
                    Hợp đồng: <a class="mx-0 v-btn v-btn--icon theme--info" :href="vnptbkn.defaults.host+khachhang.attach"
                      target="_blank"><i class="material-icons">attachment</i></a>
                  </v-flex>
                  <template v-else>
                    <v-flex xs12 sm6 md6 v-if="khachhang.hdkh_id">
                      <upload-files @handleUpload="uploadFiles=$event" :buttonUse="false"
                        :basePath="uploadFiles.basePath" :multiple="false" :autoName="false"
                        :fileName="khachhang.hdkh_id.toString()" :http="vnptbkn"
                        extension="application/pdf" buttonText="Ấn vào đây để chọn hợp đồng"></upload-files>
                      <!-- :fileName="khachhang.ma_gd.replace(/\//g,'_')" -->
                    </v-flex>
                    <v-flex xs12 sm6 md6 v-if="khachhang.ma_gd">
                      <display-files :files="uploadFiles.files" :baseUrl="vnptbkn.defaults.host"
                        :isShowName="false" classes="w-x"></display-files>
                    </v-flex>
                  </template>
                  <!-- <v-flex xs12 sm6 md4>
              <v-switch color="primary" :label="khachhang.flag===1?'Show':'Hide'" :true-value="1"
                :false-value="0" v-model.number="khachhang.flag"></v-switch>
            </v-flex> -->
                </v-layout>
              </v-tab-item>
              <v-tab-item>
                <v-data-table :headers="headers" :items="thuebao" class="elevation-1"
                  hide-actions>
                  <template slot="items" slot-scope="props">
                    <td>{{ props.item.ma_tb }}</td>
                    <td>{{ props.item.ten_tb }}</td>
                    <td>{{ props.item.diachi_tb }}</td>
                    <!-- <td>{{ props.item.diachi_ld }}</td> -->
                    <td>{{ props.item.ten_dt }}</td>
                    <td>{{ props.item.ten_dvvt }}</td>
                    <td>{{ props.item.loaihinh_tb }}</td>
                    <!-- <td>{{ props.item.ten_dv }}</td> -->
                    <td>{{ props.item.ngay_ht|formatDate }}</td>
                  </template>
                </v-data-table>
              </v-tab-item>
              <v-tab-item>
                <v-layout wrap class="pt-2">
                  <v-flex xs12 sm4 md4>
                    <v-text-field v-model.trim="khachhang.so_gt" label="Số giấy tờ"
                      :disabled="true" class="text-color-initial"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm4 md4>
                    <v-text-field :value="khachhang.ngaycap|formatDate" label="Ngày cấp"
                      :disabled="true" class="text-color-initial"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm4 md4>
                    <v-text-field v-model.trim="khachhang.noicap" label="Nơi cấp"
                      :disabled="true" class="text-color-initial"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm4 md4>
                    <v-text-field v-model.trim="khachhang.mst" label="Mã số thuế"
                      :disabled="true" class="text-color-initial"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm4 md4>
                    <v-text-field v-model.trim="khachhang.stk" label="Số tài khoản"
                      :disabled="true" class="text-color-initial"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm4 md4>
                    <v-text-field v-model.trim="khachhang.so_fax" label="Số Fax"
                      :disabled="true" class="text-color-initial"></v-text-field>
                  </v-flex>

                  <v-flex xs12 sm4 md4>
                    <v-text-field :value="khachhang.ten_loaihd" label="Loại hợp đồng"
                      :disabled="true" class="text-color-initial"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm4 md4>
                    <v-text-field v-model="khachhang.ten_loaikh" label="Loại khách hàng"
                      :disabled="true" class="text-color-initial"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm4 md4>
                    <v-text-field v-model="khachhang.nguoi_dd" label="Người đại diện"
                      :disabled="true" class="text-color-initial"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm4 md4>
                    <v-text-field v-model="khachhang.nguoi_cn" label="Người cập nhật"
                      :disabled="true" class="text-color-initial"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm4 md4>
                    <v-text-field v-model="khachhang.may_cn" label="Máy cập nhật"
                      :disabled="true" class="text-color-initial"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm4 md4>
                    <v-text-field :value="khachhang.ngay_cn|formatDate" label="Ngày cập nhật"
                      :disabled="true" class="text-color-initial"></v-text-field>
                  </v-flex>
                </v-layout>
              </v-tab-item>
              <v-tab-item>
                <v-layout wrap class="pt-2">
                  <v-flex xs12 sm12 md12>
                    <vue-quill-editor v-model.trim="khachhang.details" ref="Ghi chú">
                    </vue-quill-editor>
                    <!-- <tinymce id="desc" v-model="khachhang.desc"></tinymce> -->
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
        <v-btn v-if="!khachhang.id&&uploadFiles.files.length>0" color="primary" flat
          @click.native="onSave" :disabled="!$store.state.contract_customer.valid"
          :loading="$store.state.$loadingCommit">
          {{$store.getters.languages('global.update')}}
        </v-btn>
        <v-btn color="secondary" flat @click.native="$store.state.contract_customer.dialog=false"
          :disabled="$store.state.$loadingCommit">
          {{$store.getters.languages(['global.back'])}}
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
  data: () => ({
    uploadFiles: { files: [], basePath: 'Uploads/HopDong' },
    vnptbkn: vnptbkn,
    headers: [
      { text: 'Mã TB', align: 'left', value: 'ma_tb' },
      { text: 'Tên TB', value: 'ten_tb' },
      { text: 'Địa chỉ TB', value: 'diachi_tb' },
      // { text: 'Địa chỉ LĐ', value: 'diachi_ld' },
      { text: 'Đối tượng', value: 'ten_dt' },
      { text: 'Dịch vụ', value: 'ten_dvvt' },
      { text: 'Loại hình', value: 'loaihinh_tb' },
      // { text: 'Đơn vị', value: 'ten_dv' },
      { text: 'Ngày HT', value: 'ngay_ht' }
    ]
  }),
  mounted() {
    this.reset()
  },
  computed: {
    dialog() {
      return this.$store.state.contract_customer.dialog
    },
    khachhang() {
      return this.$store.state.contract_customer.khachhang
    },
    thuebao() {
      return this.$store.state.contract_customer.thuebao
    }
  },
  watch: {
    dialog(val) {
      if (!val) this.reset()
    },
    uploadFiles: {
      handler(val) {
        if (val.files && val.files.length > 0)
          this.khachhang.attach = val.files[0].full_name
      },
      deep: true
    }
  },
  methods: {
    onSave() {
      // if (this.khachhang.id) this.$store.dispatch('contract_customer/update')
      // else this.$store.dispatch('contract_customer/insert')
      if (this.$store.state.contract_customer.valid) {
        this.$store.dispatch('contract_customer/insert').then(this.reset())
      }
    },
    getContract() {
      const ma_gd = this.khachhang.ma_gd
      this.reset().then(() => {
        this.khachhang.ma_gd = ma_gd
        if (this.khachhang.ma_gd.length > 0)
          this.$store.dispatch('contract_customer/getContract')
      })
    },
    reset() {
      const $this = this
      return new Promise(function (resolve, reject) {
        $this.$store.commit('contract_customer/SET_KHACHHANG')
        $this.$store.commit('contract_customer/SET_THUEBAO')
        $this.uploadFiles.files = []
        $this.$refs.form.resetValidation()
        resolve()
        reject()
      })
    }
  }
}
</script>

<style>
.file-item-view a {
  padding: 10px;
}
</style>
