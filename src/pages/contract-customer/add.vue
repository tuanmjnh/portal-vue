<template>
  <v-dialog v-model="$store.state.contract_customer.dialog" max-width="1024px" persistent>
    <v-card>
      <v-card-title class="headline grey lighten-2">
        {{ khachhang.id ?
        $store.getters.languages('global.details') :
        $store.getters.languages('global.add') }}
      </v-card-title>
      <v-card-text class="p-0">
        <v-form v-model="$store.state.contract_customer.valid" ref="form">
          <v-container grid-list-md>
            <v-tabs v-model="$store.state.contract_customer.tabs" color="secondary" dark>
              <v-tab>Thông tin khách hàng</v-tab>
              <v-tab>Thông tin thuê bao</v-tab>
              <v-tab>Thông tin chi tiết</v-tab>
              <v-tab>Ghi chú</v-tab>
              <v-tab-item>
                <v-layout wrap class="pt-2">
                  <v-flex xs12 sm12 md4>
                    <v-text-field v-model.trim="khachhang.ma_gd" label="Mã hợp đồng"
                      class="text-color-initial" v-on:keyup.enter="getContract" :disabled="khachhang.cc_id?true:false"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm12 md8>
                    <v-text-field v-model.trim="khachhang.ten_kh" label="Tên khách hàng"
                      :disabled="true" class="text-color-initial"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm12 md12>
                    <v-text-field v-model.trim="khachhang.diachi_kh" label="Địa chỉ khách hàng"
                      :disabled="true" class="text-color-initial"></v-text-field>
                  </v-flex>
                  <!-- <v-flex xs12 sm12 md12>
              <v-text-field v-model="khachhang.diachi_tb" label="Địa chỉ thuê bao"></v-text-field>
            </v-flex>
            <v-flex xs12 sm12 md12>
              <v-text-field v-model="khachhang.diachi_ld" label="Địa chỉ lắp đặt"></v-text-field>
            </v-flex> -->
                  <v-flex xs12 sm6 md6>
                    <v-text-field v-model.trim="khachhang.so_dt" label="Điện thoại liên hệ"
                      :disabled="true" class="text-color-initial"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md6>
                    <v-text-field v-model.trim="khachhang.so_gt" label="Số giấy tờ"
                      :disabled="true" class="text-color-initial"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md6>
                    <v-text-field v-model.trim="khachhang.mst" label="Mã số thuế"
                      :disabled="true" class="text-color-initial"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md6>
                    <v-text-field v-model.trim="khachhang.stk" label="Số tài khoản"
                      :disabled="true" class="text-color-initial"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm12 md12 v-if="khachhang.cc_id">
                    Hợp đồng: <a class="mx-0 v-btn v-btn--icon theme--info" :href="vnptbkn.defaults.host+khachhang.attach"
                      target="_blank"><i class="material-icons">attachment</i></a>
                  </v-flex>
                  <template v-if="!khachhang.cc_id">
                    <v-flex xs12 sm6 md6 v-if="khachhang.ma_gd">
                      <upload-files @handleUpload="uploadFiles=$event" :buttonUse="false"
                        :basePath="uploadFiles.basePath" :multiple="false" :autoName="true"
                        :http="vnptbkn" extension="application/pdf" buttonText="Ấn vào đây để chọn hợp đồng"></upload-files>
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
                    <td>{{ props.item.diachi_ld }}</td>
                    <td>{{ props.item.loaihinh_tb }}</td>
                    <td>{{ props.item.ten_dv }}</td>
                  </template>
                </v-data-table>
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
              <v-tab-item>
                <v-layout wrap class="pt-2">
                  <v-flex xs12 sm6 md6>
                    <v-text-field :value="khachhang.ten_dv" label="Đơn vị" :disabled="true"
                      class="text-color-initial"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md6>
                    <v-text-field :value="khachhang.ten_loaihd" label="Loại hợp đồng"
                      :disabled="true" class="text-color-initial"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md6>
                    <v-text-field v-model="khachhang.ten_loaikh" label="Loại khách hàng"
                      :disabled="true" class="text-color-initial"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md6>
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
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <template v-if="!khachhang.cc_id">
          <v-btn color="primary" flat @click.native="handleSave" v-if="uploadFiles.files.length>0">
            <!-- <i class="material-icons">check</i> -->
            {{khachhang.cc_id ? 'Cập nhật':'Thêm mới' }}
          </v-btn>
        </template>
        <v-btn color="secondary" flat @click.native="$store.state.contract_customer.dialog=false">
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
  data: () => ({
    uploadFiles: { files: [], basePath: 'Uploads\\HopDong' },
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
    this.reset()
  },
  computed: {
    dialog() {
      return this.$store.state.navigation.dialog
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
    handleSave() {
      // if (this.khachhang.id) this.$store.dispatch('contract_customer/update')
      // else this.$store.dispatch('contract_customer/insert')
      if (!this.khachhang.cc_id)
        this.$store.dispatch('contract_customer/insert').then(() => {
          this.$store.dispatch('contract_customer/khachhang')
          this.$store.dispatch('contract_customer/thuebao')
          this.uploadFiles.files = []
        })
    },
    getContract() {
      if (this.khachhang.ma_gd.length > 0)
        this.$store.dispatch('contract_customer/getContract').then()
    },
    reset() {
      this.$store.commit('contract_customer/SET_KHACHHANG')
      this.$refs.form.resetValidation()
    }
  }
}
</script>

<style>
.file-item-view a {
  padding: 10px;
}
</style>
