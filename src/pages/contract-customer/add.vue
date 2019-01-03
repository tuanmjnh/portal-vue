<template>
  <v-dialog v-model="localDialog" max-width="1024px">
    <!-- <v-btn slot="activator" color="primary" dark class="mb-2">New Item</v-btn> -->
    <v-card>
      <v-card-title>
        <span class="headline">{{
          this.$store.state.contract_customer.item.contract_customer_id ?
          'Chi tiết hợp đồng lưu trữ' :
          'Thêm mới hợp đồng lưu trữ' }}</span>
      </v-card-title>
      <v-card-text>
        <v-container grid-list-md>

          <v-tabs v-model="tabActive" color="cyan" dark slider-color="yellow">
            <v-tab>Thông tin chính</v-tab>
            <v-tab>Thông tin thêm</v-tab>
            <v-tab>Ghi chú</v-tab>
            <v-tab-item>
              <v-layout wrap class="pt-2">
                <v-flex xs12 sm12 md4>
                  <v-text-field v-model.trim="item.ma_gd" label="Mã hợp đồng"
                    v-on:keyup.enter="getContract"></v-text-field>
                </v-flex>
                <v-flex xs12 sm12 md8>
                  <v-text-field v-model="item.ten_kh" label="Tên khách hàng" :disabled="true"
                    class="text-color-initial"></v-text-field>
                </v-flex>
                <v-flex xs12 sm12 md12>
                  <v-text-field v-model="item.diachi_kh" label="Địa chỉ khách hàng"
                    :disabled="true" class="text-color-initial"></v-text-field>
                </v-flex>
                <!-- <v-flex xs12 sm12 md12>
              <v-text-field v-model="item.diachi_tb" label="Địa chỉ thuê bao"></v-text-field>
            </v-flex>
            <v-flex xs12 sm12 md12>
              <v-text-field v-model="item.diachi_ld" label="Địa chỉ lắp đặt"></v-text-field>
            </v-flex> -->
                <v-flex xs12 sm6 md6>
                  <v-text-field v-model="item.so_dt" label="Điện thoại liên hệ" :disabled="true"
                    class="text-color-initial"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md6>
                  <v-text-field v-model="item.so_gt" label="Số giấy tờ" :disabled="true"
                    class="text-color-initial"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md6>
                  <v-text-field v-model="item.mst" label="Mã số thuế" :disabled="true"
                    class="text-color-initial"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md6>
                  <v-text-field v-model="item.stk" label="Số tài khoản" :disabled="true"
                    class="text-color-initial"></v-text-field>
                </v-flex>
                <v-flex xs12 sm12 md12>
                  Dang sach: <display-files></display-files>
                </v-flex>
                <v-flex xs12 sm12 md12 v-if="item.ma_gd">
                  <display-files></display-files>
                  <div class="spacer"></div>
                  <upload-files @handleUpload="uploadFiles=$event" :buttonUse="true"
                    :multiple="false" :autoName="true" :http="vnptbkn"></upload-files>
                  <!-- :fileName="item.ma_gd.replace(/\//g,'_')" -->
                </v-flex>
                <!-- <v-flex xs12 sm6 md4>
              <v-switch color="primary" :label="item.flag===1?'Show':'Hide'" :true-value="1"
                :false-value="0" v-model.number="item.flag"></v-switch>
            </v-flex> -->
              </v-layout>
            </v-tab-item>
            <v-tab-item>
              <v-layout wrap class="pt-2">
                <v-flex xs12 sm6 md6>
                  <v-text-field v-model="item.nguoi_cn" label="Người cập nhật" :disabled="true"
                    class="text-color-initial"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md6>
                  <v-text-field :value="item.ngay_cn|formatDate" label="Ngày cập nhật"
                    :disabled="true" class="text-color-initial"></v-text-field>
                </v-flex>
              </v-layout>
            </v-tab-item>
            <v-tab-item>
              <v-layout wrap class="pt-2">
                <v-flex xs12 sm12 md12>
                  <vue-quill-editor v-model="item.details" ref="Ghi chú">
                  </vue-quill-editor>
                  <!-- <tinymce id="desc" v-model="item.desc"></tinymce> -->
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
          {{this.$store.state.contract_customer.item.contract_customer_id ? 'Cập nhật'
          :'Thêm mới' }}
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
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
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
    vnptbkn: vnptbkn
  }),
  mounted() {
    this.$store.dispatch('contract_customer/item')
  },
  computed: {
    item() {
      var item = this.$store.state.contract_customer.item
      return item
    }
  },
  watch: {
    dialog(val) { this.localDialog = val },
    localDialog(val) {
      this.$emit('handleDialog', val)
      if (!val) this.$store.dispatch('contract_customer/item')
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
      if (this.item.id) this.$store.dispatch('contract_customer/update')
      else this.$store.dispatch('contract_customer/insert')
    },
    getContract() {
      if (this.item.ma_gd.length > 0)
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
