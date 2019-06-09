<template>
  <v-card>
    <v-dialog v-model="dialog_nguoi_gt" max-width="512px">
      <v-card>
        <v-card-title class="headline grey lighten-2">
          Chọn người giới thiệu
        </v-card-title>
        <v-card-text>
          <v-form v-model="valid_nguoi_gt" ref="form">
            <v-layout wrap>
              <v-flex xs12 sm12 md12>
                <v-select :items="donvi" v-model="donvi_id_gt" :hide-selected="true"
                  item-text="ten_dv" item-value="donvi_id" label="Đơn vị"></v-select>
              </v-flex>
              <v-flex xs12 sm12 md12>
                <v-select :items="nguoidung" :hide-selected="true" @change="onChangeNguoiGT($event)"
                  label="Nhân viên" :rules="[v=>!!v||$languages.get('error.required')]">
                  <template v-slot:item="data">
                    {{ data.item.ten_nd }} - {{ data.item.ma_nd }}
                  </template>
                  <template v-slot:selection="data">
                    {{ data.item.ten_nd }} - {{ data.item.ma_nd }}
                  </template>
                </v-select>
              </v-flex>
            </v-layout>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat @click.native="dialog_nguoi_gt=false" :disabled="!valid_nguoi_gt">
            {{$languages.get('global.accept')}}
          </v-btn>
          <v-btn color="default" flat @click.native="dialog_nguoi_gt=false">
            {{$languages.get('global.back')}}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="$store.state.contract_enterprise.dialog" max-width="1024px"
      persistent>
      <v-card>
        <v-card-title class="headline grey lighten-2">
          {{ item.id ?
          $languages.get('global.details') :
          $languages.get('global.add') }}
        </v-card-title>
        <v-card-text class="p-0">
          <div class="mid-center" v-if="$store.state.$loadingCommit">
            <v-progress-circular :size="130" :width="10" color="primary" indeterminate></v-progress-circular>
          </div>
          <v-form v-else v-model="valid" ref="form">
            <v-tabs v-model="tabs" color="secondary" dark>
              <v-tab>Thông tin khách hàng</v-tab>
              <v-tab>Thông tin hợp đồng</v-tab>
              <v-tab>Ghi chú</v-tab>
              <v-tab-item>
                <v-container grid-list-md>
                  <v-layout wrap>
                    <v-flex xs12 sm6 md6>
                      <v-text-field v-model.trim="item.ten_kh" label="Tên cơ quan" :rules="[v=>!!v||$languages.get('error.required')]"></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm6 md6>
                      <v-text-field v-model.trim="item.nguoi_dd" label="Người đại diện"
                        :rules="[v=>!!v||$languages.get('error.required')]"></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm12 md12>
                      <v-text-field v-model.trim="item.diachi_kh" label="Địa chỉ" :rules="[v=>!!v||$languages.get('error.required')]"></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm4 md4>
                      <v-text-field type="number" v-model.trim="item.sdt" label="Số điện thoại"
                        :rules="[v=>!!v||$languages.get('error.required')]"></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm4 md4>
                      <v-text-field v-model.trim="item.stk" label="Số tài khoản" :rules="[v=>!!v||$languages.get('error.required')]"></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm4 md4>
                      <v-text-field v-model.trim="item.mst" label="Mã số thuế"></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm4 md4>
                      <v-text-field v-model.trim="item.sgt" label="Số giấy tờ (số CMND)"></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm4 md4>
                      <v-text-field v-model.trim="item.noi_cap" label="Nơi cấp"></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm4 md4>
                      <v-menu v-model="date_menu_ngay_cap" :close-on-content-click="false"
                        :nudge-right="40" lazy transition="scale-transition" offset-y
                        full-width min-width="290px">
                        <template v-slot:activator="{on}">
                          <v-text-field :value="item.ngay_cap?item.ngay_cap.formatDate('DD/MM/YYYY'):''"
                            label="Ngày cấp" prepend-icon="event" readonly v-on="on"
                            persistent-hint hint="Định dạng: DD/MM/YYYY"></v-text-field>
                        </template>
                        <v-date-picker v-model="item.ngay_cap" @input="date_menu_ngay_cap=false"></v-date-picker>
                      </v-menu>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-tab-item>
              <v-tab-item>
                <v-container grid-list-md>
                  <v-layout wrap>
                    <v-flex xs12 sm6 md6>
                      <v-select :items="nhom_dich_vu" v-model="item.group_id"
                        :hide-selected="true" item-text="title" item-value="id" label="loại dịch vụ"
                        :rules="[v=>!!v||$languages.get('error.required_select')]"></v-select>
                    </v-flex>
                    <v-flex xs12 sm6 md6>
                      <v-text-field v-model.trim="item.ma_hd" label="Mã hợp đồng" class="text-color-initial"
                        :persistent-hint="true" hint="Nhập chính xác mã hợp đồng đã tạo trên các hệ thống"
                        :rules="[v=>!!v||$languages.get('error.required')]"></v-text-field>
                    </v-flex>
                    <!-- <v-flex xs12 sm6 md6>
                    <v-text-field v-model.trim="item.ngay_bd" label="Ngày bắt đầu" :rules="[v=>!!v||$languages.get('error.required')]"></v-text-field>
                  </v-flex> -->
                    <!-- <v-flex xs12 sm6 md6>
                    <v-text-field v-model.trim="item.ngay_kt" label="Ngày kết thúc"
                      :rules="[v=>!!v||$languages.get('error.required')]"></v-text-field>
                  </v-flex> -->
                    <v-flex xs12 sm4 md4>
                      <v-text-field type="number" v-model.trim="item.so_luong" label="Số lượng"
                        :rules="[v=>!!v||$languages.get('error.required')]"></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm4 md4>
                      <v-menu v-model="date_menu_ngay_bd" :close-on-content-click="false"
                        :nudge-right="40" lazy transition="scale-transition" offset-y
                        full-width min-width="290px">
                        <template v-slot:activator="{on}">
                          <v-text-field :value="item.ngay_bd?item.ngay_bd.formatDate('DD/MM/YYYY'):''"
                            label="Ngày bắt đầu hợp đồng" prepend-icon="event" readonly
                            v-on="on" persistent-hint hint="Định dạng: DD/MM/YYYY"></v-text-field>
                        </template>
                        <v-date-picker v-model="item.ngay_bd" @input="date_menu_ngay_bd=false"></v-date-picker>
                      </v-menu>
                    </v-flex>
                    <v-flex xs12 sm4 md4>
                      <v-menu v-model="date_menu_ngay_kt" :close-on-content-click="false"
                        :nudge-right="40" lazy transition="scale-transition" offset-y
                        full-width min-width="290px">
                        <template v-slot:activator="{on}">
                          <v-text-field :value="item.ngay_kt?item.ngay_kt.formatDate('DD/MM/YYYY'):''"
                            label="Ngày kết thúc hợp đồng" prepend-icon="event" readonly
                            v-on="on" persistent-hint hint="Định dạng: DD/MM/YYYY"></v-text-field>
                        </template>
                        <v-date-picker v-model="item.ngay_kt" @input="date_menu_ngay_kt=false"></v-date-picker>
                      </v-menu>
                    </v-flex>
                    <v-flex xs12 sm4 md4>
                      <v-text-field v-model.trim="money" @keyup="onKeyUpMoney()" label="Tiền"
                        :rules="[v=>!!v||$languages.get('error.required'),rules.money]"></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm4 md4>
                      <v-text-field name="thue" :value="Math.round(this.item.tien * 0.1).format()"
                        label="Thuế" :disabled="true" class="text-color-initial"></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm4 md4>
                      <v-text-field name="tongcong" :value="Math.round(this.item.tien * 1.1).format()"
                        label="Tổng cộng" :disabled="true" class="text-color-initial"></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm6 md6 class="text-append-icon">
                      <v-text-field v-model="nguoi_gt" label="Người giới thiệu" :disabled="true"
                        class="text-color-initial"></v-text-field>
                      <i class="icon material-icons pointer" @click="dialog_nguoi_gt=true">pageview</i>
                    </v-flex>
                    <v-flex xs12 sm6 md6 class="text-append-icon" offset-xs0 offset-sm6
                      offset-md6>
                    </v-flex>
                    <v-flex xs12 sm12 md12 v-if="item.id">
                      Hợp đồng: <a class="mx-0 v-btn v-btn--icon theme--info" :href="`${http.defaults.host}/${item.tep_dk}`"
                        target="_blank"><i class="material-icons">attachment</i></a>
                    </v-flex>
                    <template v-else>
                      <v-flex xs12 sm6 md6 v-if="item.ma_hd">
                        <upload-files :files.sync="attach_upload.files" :http="http"
                          :autoName="true" :buttonUse="false" :loading.sync="attach_upload.loading"
                          :basePath="attach_upload.basePath" :multiple="false" :fileName="item.ma_hd.toString()"
                          extension="application/pdf" buttonText="Ấn vào đây để chọn hợp đồng"></upload-files>
                        <!-- :fileName="item.ma_gd.replace(/\//g,'_')" -->
                      </v-flex>
                      <v-flex xs12 sm6 md6 v-if="item.ma_hd">
                        <display-files :files="attach_upload.files" :baseUrl="http.defaults.host"
                          :preFixName="attach_upload.basePath" :isShowName="false"
                          classes="w-x"></display-files>
                      </v-flex>
                    </template>
                  </v-layout>
                </v-container>
              </v-tab-item>
              <v-tab-item>
                <v-container grid-list-md>
                  <v-layout wrap>
                    <v-flex xs12 sm12 md12>
                      <v-textarea v-model.trim="item.ghi_chu" solo label="Ghi chú"></v-textarea>
                    </v-flex>
                    <v-flex xs12 sm12 md12>
                      <vue-quill-editor v-model.trim="item.noi_dung" ref="descs">
                      </vue-quill-editor>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-tab-item>
            </v-tabs>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn v-if="!item.id&&attach_upload.files.length>0" color="primary" flat
            @click.native="onSave" :disabled="!valid" :loading="$store.state.$loadingCommit">
            {{$languages.get('global.update')}}
          </v-btn>
          <v-btn color="secondary" flat @click.native="$store.state.contract_enterprise.dialog=false"
            :disabled="$store.state.$loadingCommit">
            {{$languages.get('global.back')}}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
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
    valid: false,
    valid_nguoi_gt: false,
    tabs: null,
    money: '0',
    donvi_id_gt: 24233,
    nguoi_gt: '',
    nguoidung: [],
    dialog_nguoi_gt: false,
    date_menu_ngay_cap: false,
    date_menu_ngay_bd: false,
    date_menu_ngay_kt: false,
    rules: {
      money: value => {
        const pattern = /^(?!,$)[\d,.]+$/
        return pattern.test(value) || 'Sai định dạng'
      }
    },
    attach_upload: {
      files: [],
      basePath: 'Uploads/HDKHDN',
      loading: false
    }
  }),
  mounted() {
    this.reset()
    this.$store.dispatch('nguoidung/GetByDonvi', { loading: false, flag: 1, donvi_id: this.donvi_id_gt, }).then(x => {
      this.nguoidung = x
    })
  },
  computed: {
    dialog() {
      return this.$store.state.contract_enterprise.dialog
    },
    item() {
      return this.$store.state.contract_enterprise.item
    },
    nhom_dich_vu() {
      const rs = this.$store.state.contract_enterprise.category
      return rs ? rs.filter(x => { return (x.dependent !== ',0,') }) : []
    },
    donvi() {
      return this.$store.state.donvi.items
    }
  },
  watch: {
    dialog(val) {
      if (!val) this.reset()
    },
    attach_upload: {
      handler(val) {
        if (val.files && val.files.length > 0)
          this.item.tep_dk = `${this.attach_upload.basePath}/${val.files[0].name}`
      },
      deep: true
    },
    donvi_id_gt(val) {
      this.$store.dispatch('nguoidung/GetByDonvi', { loading: false, flag: 1, donvi_id: val, }).then(x => {
        this.nguoidung = x
      })
    }
  },
  methods: {
    onSave() {
      if (this.valid) {
        this.$store.dispatch('contract_enterprise/insert').then(() => { this.reset() })
      }
    },
    onKeyUpMoney() {
      if (this.money) {
        this.item.tien = parseInt(this.money.replace(/,/g, ''))
        this.money = this.item.tien.format('.')
      }
      else {
        this.money = '0'
        this.item.tien = 0
      }
    },
    onChangeNguoiGT(val) {
      this.nguoi_gt = `${val.ten_nd} - ${val.ma_nd}`
      this.item.nguoi_gt = val.ma_nd
    },
    reset() {
      this.$store.commit('contract_enterprise/SET_ITEM')
      this.attach_upload.files = []
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
