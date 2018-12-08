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
          <v-layout wrap>
            <v-flex xs12 sm12 md4>
              <v-text-field v-model.trim="item.ma_gd" label="Mã hợp đồng"
                v-on:keyup.enter="getContract"></v-text-field>
            </v-flex>
            <v-flex xs12 sm12 md8>
              <v-text-field v-model="item.ten_kh" label="Tên khách hàng"></v-text-field>
            </v-flex>
            <v-flex xs12 sm12 md12>
              <v-text-field v-model="item.diachi_kh" label="Địa chỉ khách hàng"></v-text-field>
            </v-flex>
            <v-flex xs12 sm12 md12>
              <v-text-field v-model="item.diachi_tb" label="Địa chỉ thuê bao"></v-text-field>
            </v-flex>
            <v-flex xs12 sm12 md12>
              <v-text-field v-model="item.diachi_ld" label="Địa chỉ lắp đặt"></v-text-field>
            </v-flex>
            <v-flex xs12 sm6 md6>
              <v-text-field v-model="item.so_dt" label="Điện thoại liên hệ"></v-text-field>
            </v-flex>
            <v-flex xs12 sm6 md6>
              <v-text-field v-model="item.so_gt" label="Số giấy tờ"></v-text-field>
            </v-flex>
            <v-flex xs12 sm6 md6>
              <v-text-field v-model="item.mst" label="Mã số thuế"></v-text-field>
            </v-flex>
            <v-flex xs12 sm6 md6>
              <v-text-field v-model="item.stk" label="Số tài khoản"></v-text-field>
            </v-flex>
            <v-flex xs12 sm6 md6>
              <v-text-field v-model="item.ma_tb" label="Mã thuê bao"></v-text-field>
            </v-flex>
            <!-- <v-flex xs12 sm6 md4>
              <v-switch color="primary" :label="item.flag===1?'Show':'Hide'" :true-value="1"
                :false-value="0" v-model.number="item.flag"></v-switch>
            </v-flex> -->
            <v-flex xs12 sm12 md12>
              <quill-editor v-model="item.details" ref="Ghi chú">
              </quill-editor>
              <!-- <tinymce id="desc" v-model="item.desc"></tinymce> -->
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" flat @click.native="handleSave">
          <!-- <i class="material-icons">check</i> -->
          Update
        </v-btn>
        <v-btn color="secondary" flat @click.native="localDialog=false">
          <!-- <i class="material-icons">close</i>  -->
          Cancel
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
export default {
  components: { quillEditor },
  props: {
    dialog: { type: Boolean, default: false }
  },
  data: () => ({
    localDialog: false,
    editedIndex: -1
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
    }
  },
  methods: {
    handleSave() {
      if (this.item.id) this.$store.dispatch('contract_customer/update')
      else this.$store.dispatch('contract_customer/insert')
    },
    getContract() {
      if (this.item.ma_gd.length > 0)
        this.$store.dispatch('contract_customer/getContract').then(console.log(this.item))
    }
  }
}
</script>

<style>
</style>
