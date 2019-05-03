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
              <v-tab>{{$store.getters.languages('contract_customer.customer_info')}}</v-tab>
              <v-tab>{{$store.getters.languages('contract_customer.subscribers_info')}}</v-tab>
              <v-tab>{{$store.getters.languages('contract_customer.details')}}</v-tab>
              <v-tab>{{$store.getters.languages('global.note')}}</v-tab>
              <v-tab-item>
                <v-layout wrap class="pt-2">
                  <v-flex xs12 sm6 md4>
                    <v-text-field v-model.trim="khachhang.ma_gd" :label="$store.getters.languages('contract_customer.ma_gd')"
                      class="text-color-initial" :persistent-hint="true" hint="Nhập Mã GD, Mã HD, Mã KH, Mã TB, Số GT"
                      v-on:keyup.enter="getContract" :disabled="khachhang.id?true:false"
                      :rules="[v=>!!v||$store.getters.languages('error.required')]"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md4>
                    <v-text-field v-model.trim="khachhang.ma_hd" :label="$store.getters.languages('contract_customer.ma_hd')"
                      :disabled="true" class="text-color-initial"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md4>
                    <v-text-field v-model.trim="khachhang.ma_kh" :label="$store.getters.languages('contract_customer.ma_kh')"
                      :disabled="true" class="text-color-initial"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm4 md4>
                    <v-text-field v-model.trim="khachhang.ten_kh" :label="$store.getters.languages('contract_customer.ten_kh')"
                      :disabled="true" class="text-color-initial"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm4 md4>
                    <v-text-field v-model.trim="khachhang.so_dt" :label="$store.getters.languages('nguoidung.mobile')"
                      :disabled="true" class="text-color-initial"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm4 md4>
                    <v-text-field :value="khachhang.ten_dv" :label="$store.getters.languages('global.local')"
                      :disabled="true" class="text-color-initial"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md6>
                    <v-text-field v-model.trim="khachhang.diachi_kh" :label="$store.getters.languages('contract_customer.diachi_kh')"
                      :disabled="true" class="text-color-initial"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md6>
                    <v-text-field v-model.trim="khachhang.hokhau" :label="$store.getters.languages('contract_customer.hokhau')"
                      :disabled="true" class="text-color-initial"></v-text-field>
                  </v-flex>
                  <!-- <v-flex xs12 sm12 md12>
              <v-text-field v-model="khachhang.diachi_tb" label="Địa chỉ thuê bao"></v-text-field>
            </v-flex>
            <v-flex xs12 sm12 md12>
              <v-text-field v-model="khachhang.diachi_ld" label="Địa chỉ lắp đặt"></v-text-field>
            </v-flex> -->
                  <v-flex xs12 sm12 md12 v-if="khachhang.id">
                    {{$store.getters.languages('global.contract')}}: <a class="mx-0 v-btn v-btn--icon theme--info"
                      :href="`${http.defaults.host}/${khachhang.attach}`" target="_blank"><i
                        class="material-icons">attachment</i></a>
                  </v-flex>
                  <template v-else>
                    <v-flex xs12 sm6 md6 v-if="khachhang.hdkh_id">
                      <upload-files :files.sync="attach_upload.files" :http="http"
                        :autoName="true" :buttonUse="false" :loading.sync="attach_upload.loading"
                        :basePath="attach_upload.basePath" :multiple="false" :fileName="khachhang.hdkh_id.toString()"
                        extension="application/pdf" :buttonText="$store.getters.languages('contract_customer.upload_btn')"></upload-files>
                      <!-- :fileName="khachhang.ma_gd.replace(/\//g,'_')" -->
                    </v-flex>
                    <v-flex xs12 sm6 md6 v-if="khachhang.ma_gd">
                      <display-files :files="attach_upload.files" :baseUrl="http.defaults.host"
                        :preFixName="attach_upload.basePath" :isShowName="false" classes="w-x"></display-files>
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
                    <v-text-field v-model.trim="khachhang.so_gt" :label="$store.getters.languages('contract_customer.so_gt')"
                      :disabled="true" class="text-color-initial"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm4 md4>
                    <v-text-field :value="khachhang.ngaycap|formatDate" :label="$store.getters.languages('contract_customer.ngaycap')"
                      :disabled="true" class="text-color-initial"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm4 md4>
                    <v-text-field v-model.trim="khachhang.noicap" :label="$store.getters.languages('contract_customer.noicap')"
                      :disabled="true" class="text-color-initial"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm4 md4>
                    <v-text-field v-model.trim="khachhang.mst" :label="$store.getters.languages('contract_customer.mst')"
                      :disabled="true" class="text-color-initial"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm4 md4>
                    <v-text-field v-model.trim="khachhang.stk" :label="$store.getters.languages('contract_customer.stk')"
                      :disabled="true" class="text-color-initial"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm4 md4>
                    <v-text-field v-model.trim="khachhang.so_fax" label="Fax" :disabled="true"
                      class="text-color-initial"></v-text-field>
                  </v-flex>

                  <v-flex xs12 sm4 md4>
                    <v-text-field :value="khachhang.ten_loaihd" :label="$store.getters.languages('contract_customer.ten_loaihd')"
                      :disabled="true" class="text-color-initial"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm4 md4>
                    <v-text-field v-model="khachhang.ten_loaikh" :label="$store.getters.languages('contract_customer.ten_loaikh')"
                      :disabled="true" class="text-color-initial"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm4 md4>
                    <v-text-field v-model="khachhang.nguoi_dd" :label="$store.getters.languages('contract_customer.nguoi_dd')"
                      :disabled="true" class="text-color-initial"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm4 md4>
                    <v-text-field v-model="khachhang.nguoi_cn" :label="$store.getters.languages('global.updated_by')"
                      :disabled="true" class="text-color-initial"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm4 md4>
                    <v-text-field v-model="khachhang.may_cn" :label="$store.getters.languages('global.updated_comp')"
                      :disabled="true" class="text-color-initial"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm4 md4>
                    <v-text-field :value="khachhang.ngay_cn|formatDate" :label="$store.getters.languages('global.updated_at')"
                      :disabled="true" class="text-color-initial"></v-text-field>
                  </v-flex>
                </v-layout>
              </v-tab-item>
              <v-tab-item>
                <v-layout wrap class="pt-2">
                  <v-flex xs12 sm12 md12>
                    <vue-quill-editor v-model.trim="khachhang.descs" ref="descs">
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
        <v-btn v-if="!khachhang.id&&attach_upload.files.length>0" color="primary" flat
          @click.native="onSave" :disabled="!$store.state.contract_customer.valid"
          :loading="$store.state.$loadingCommit">
          {{$store.getters.languages('global.update')}}
        </v-btn>
        <v-btn color="secondary" flat @click.native="$store.state.contract_customer.dialog=false"
          :disabled="$store.state.$loadingCommit">
          {{$store.getters.languages('global.back')}}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { quillEditor } from 'vue-quill-editor'
import uploadFiles from '@/components/upload-files'
import displayFiles from '@/components/display-files'
export default {
  components: {
    'vue-quill-editor': quillEditor,
    'upload-files': uploadFiles,
    'display-files': displayFiles
  },
  props: { http: null },
  data: () => ({
    attach_upload: {
      files: [],
      basePath: 'Uploads/HopDong',
      loading: false
    },
    // uploadFiles: { files: [], basePath: 'Uploads/HopDong' },
    headers: [
      { text: 'contract_customer.ma_tb', align: 'left', value: 'ma_tb' },
      { text: 'contract_customer.ten_tb', value: 'ten_tb' },
      { text: 'contract_customer.diachi_tb', value: 'diachi_tb' },
      // { text: 'Địa chỉ LĐ', value: 'diachi_ld' },
      { text: 'contract_customer.ten_dt', value: 'ten_dt' },
      { text: 'contract_customer.ten_dvvt', value: 'ten_dvvt' },
      { text: 'contract_customer.loaihinh_tb', value: 'loaihinh_tb' },
      // { text: 'Đơn vị', value: 'ten_dv' },
      { text: 'contract_customer.ngay_ht', value: 'ngay_ht' }
    ]
  }),
  mounted() {
    this.headers.forEach(e => { e.text = this.$store.getters.languages(e.text) })
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
    attach_upload: {
      handler(val) {
        if (val.files && val.files.length > 0)
          this.khachhang.attach = `${this.attach_upload.basePath}/${val.files[0].name}`
      },
      deep: true
    }
  },
  methods: {
    onSave() {
      // if (this.khachhang.id) this.$store.dispatch('contract_customer/update')
      // else this.$store.dispatch('contract_customer/insert')
      if (this.$store.state.contract_customer.valid) {
        this.$store.dispatch('contract_customer/insert').then(() => { this.reset() })
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
        $this.attach_upload.files = []
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
