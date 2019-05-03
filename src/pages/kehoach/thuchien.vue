<template>
  <div>
    <v-card>
      <v-card-title>
        <span class="title">Danh sách thuê bao kế hoạch</span>
        <v-spacer></v-spacer>
        <v-tooltip bottom>
          <v-btn slot="activator" flat icon color="primary" @click="dialogFilter=true">
            <v-icon>filter_list</v-icon>
          </v-btn>
          <span>{{$store.getters.languages('global.filter_data')}}</span>
        </v-tooltip>
        <export-data :getData="getDataExport" filename="kehoach_thuchien" :suffixFileName="true"
          :tooltip="$store.getters.languages('global.export')" color="success" :items="[{title:$store.getters.languages(['global.export',' ',' .csv']),type:'csv'}]" />
        <v-dialog v-model="dialogFilter" max-width="600px" persistent>
          <v-card>
            <v-card-title class="headline grey lighten-2">
              {{$store.getters.languages('global.filter_data')}}
            </v-card-title>
            <v-card-text>
              <v-layout wrap>
                <v-flex xs12 sm12 md12 v-if="this.$store.getters['auth/inRoles']('donvi.select')">
                  <v-select :items="donvi" v-model="pagination.donvi_id" :hide-selected="true"
                    item-text="ten_dv" item-value="donvi_id" :label="$store.getters.languages('global.local')"></v-select>
                </v-flex>
                <v-flex xs12 sm12 md12>
                  <v-select :items="nhom_kh" v-model="pagination.nhomkh_id"
                    :hide-selected="true" item-text="title" item-value="id" label="Nhóm kế hoạch"></v-select>
                </v-flex>
                <v-flex xs12 sm12 md12 v-if="this.$store.getters['auth/inRoles']('kehoach.select')">
                  <v-select :items="nguoidung" v-model="pagination.ma_nd" item-value="ma_nd"
                    item-text="ten_nd_dv" :hide-selected="true" label="Nhân viên"></v-select>
                </v-flex>
                <v-flex xs12 sm12 md12>
                  <v-text-field v-model="pagination.search" append-icon="search" :label="$store.getters.languages('global.search')"
                    single-line hide-details></v-text-field>
                </v-flex>
              </v-layout>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <!-- <v-btn color="primary" flat @click.native="onSave">
                {{$store.getters.languages('global.accept')}}
              </v-btn> -->
              <v-btn color="primary" flat @click.native="dialogFilter=false">
                {{$store.getters.languages('global.back')}}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="dialogThuchien" max-width="600px" persistent>
          <v-card>
            <v-card-title class="headline grey lighten-2">
              Xác nhận thực hiện
            </v-card-title>
            <v-card-text>
              <v-form v-model="valid" ref="form">
                <v-layout wrap>
                  <v-flex xs12 sm12 md12>
                    <v-radio-group v-model="item.ket_qua" :column="false" :rules="[v=>v>1||$store.getters.languages('error.required_select')]">
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
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" flat @click.native="onSave" :disabled="!valid">
                {{$store.getters.languages('global.accept')}}
              </v-btn>
              <v-btn color="secondary" flat @click.native="dialogThuchien=false">
                {{$store.getters.languages('global.back')}}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <!-- <v-tooltip bottom>
          <v-btn flat icon slot="activator" color="primary" @click="$store.state.kehoach.dialog=true">
            <v-icon>add</v-icon>
          </v-btn>
          <span>{{$store.getters.languages('global.add')}}</span>
        </v-tooltip> -->
        <!-- <v-tooltip bottom v-if="$store.state.kehoach.selected.length>0 && $store.state.kehoach.pagination.flag===1">
          <v-btn flat icon slot="activator" color="danger" @click="onDelete()">
            <v-icon>delete</v-icon>
          </v-btn>
          <span>{{$store.getters.languages('global.delete_selected')}}</span>
        </v-tooltip>
        <v-tooltip bottom v-if="$store.state.kehoach.selected.length>0 && $store.state.kehoach.pagination.flag===0">
          <v-btn flat icon slot="activator" color="info" @click="onDelete()">
            <v-icon>refresh</v-icon>
          </v-btn>
          <span>{{$store.getters.languages('global.recover_selected')}}</span>
        </v-tooltip> -->

        <!-- <v-btn-toggle v-model="$store.state.kehoach.pagination.toggle" mandatory>
          <v-tooltip bottom>
            <v-btn slot="activator" flat @click="$store.state.kehoach.pagination.flag=1">
              <v-icon>view_list</v-icon>
            </v-btn>
            <span>{{$store.getters.languages('global.using')}}</span>
          </v-tooltip>
          <v-tooltip bottom>
            <v-btn slot="activator" flat @click="$store.state.kehoach.pagination.flag=0">
              <v-icon>delete</v-icon>
            </v-btn>
            <span>{{$store.getters.languages('global.deleted')}}</span>
          </v-tooltip>
        </v-btn-toggle> -->
      </v-card-title>
      <!-- <v-form ref="form" v-model="valid" lazy-validation> -->
      <v-data-table class="elevation-1" item-key="id" :headers="headers" :items="items"
        :rows-per-page-items="[10, 25, 50, 100, 200, 500]" :rows-per-page-text="$store.getters.languages('global.rows_per_page')"
        :pagination.sync="pagination" :loading="$store.state.$loadingGet" :total-items="totalItems">
        <!--:loading="loading" :pagination.sync="pagination" :total-items="totalItems" v-model="$store.state.kehoach.selected_th" -->
        <template slot="items" slot-scope="props">
          <tr>
            <!-- <td>
              <v-checkbox v-model="props.selected" primary hide-details></v-checkbox>
            </td> -->
            <td>{{ props.item.ma_tb }}</td>
            <td>{{ props.item.ten_tb }}</td>
            <td>{{ props.item.so_dt }}</td>
            <td>{{ props.item.thang_bd }}</td>
            <td>{{ props.item.thang_kt }}</td>
            <td>{{ getKetQua(props.item.ket_qua) }}</td>
            <td class="justify-center layout px-0">
              <v-tooltip bottom>
                <v-btn flat icon slot="activator" color="teal" class="mx-0" @click="onEdit(props.item)">
                  <v-icon>offline_pin</v-icon>
                </v-btn>
                <span>Xác nhận</span>
              </v-tooltip>
              <!-- <v-tooltip bottom v-if="$store.state.kehoach.pagination.flag===1">
                <v-btn flat icon slot="activator" color="error" class="mx-0" @click="onDelete(props.item)">
                  <v-icon>delete</v-icon>
                </v-btn>
                <span>{{$store.getters.languages('global.delete')}}</span>
              </v-tooltip>
              <v-tooltip bottom v-else>
                <v-btn flat icon slot="activator" color="info" class="mx-0" @click="onDelete(props.item)">
                  <v-icon>refresh</v-icon>
                </v-btn>
                <span>{{$store.getters.languages('global.recover')}}</span>
              </v-tooltip> -->
            </td>
          </tr>
        </template>
      </v-data-table>
      <!-- </v-form> -->
    </v-card>
    <tpl-confirm :dialog.sync="dialogConfirm" @onAccept="onCFMAccept" @onCancel="onCFMCancel"
      :title="$store.getters.languages('global.message')" :content="$store.getters.languages('messages.confirm_content')"
      :btnAcceptText="$store.getters.languages('global.accept')" :btnCancelText="$store.getters.languages('global.cancel')"></tpl-confirm>
  </div>
</template>

<script>
import confirm from '@/components/confirm'
import exportData from '@/components/export-data'
export default {
  components: {
    'tpl-confirm': confirm,
    'export-data': exportData
  },
  data: () => ({
    dialogConfirm: false,
    dialogFilter: false,
    dialogThuchien: false,
    valid: false,
    totalItems: 0,
    item_ket_qua: 0,
    ket_qua: [
      {
        label: "Thành công",
        value: 2,
        color: "primary"
      },
      {
        label: "Không thành công",
        value: 3,
        color: "red"
      }
    ],
    pagination: {
      search: '',
      sortBy: 'donvi_id,nhom_kh,thang_bd,id',
      descending: false,
      toggle: 0,
      flag: 1,
      page: 1,
      rowsPerPage: 10,
      donvi_id: 0,
      nhomkh_id: 0,
      ma_nd: '',
    },
    headers: [
      { text: 'Mã TB', value: 'ma_tb', align: 'left' },
      { text: 'Tên TB', value: 'ten_tb' },
      { text: 'Số ĐT', value: 'so_dt' },
      { text: 'Tháng BĐ', value: 'thang_bd' },
      { text: 'Tháng KT', value: 'thang_kt' },
      { text: 'Kết quả', value: 'ket_qua' },
      { text: '#', value: '#', sortable: false },
    ]
  }),
  created() {
    this.$store.dispatch('kehoach/GetNguoidung', { loading: false, donvi_id: this.pagination.donvi_id })
  },
  mounted() {
    this.headers.forEach(e => { e.text = this.$store.getters.languages(e.text) })
  },
  computed: {
    items() {
      return this.$store.state.kehoach.kehoach_th
    },
    item() {
      return this.$store.state.kehoach.item
    },
    donvi() {
      const rs = this.$store.getters['donvi/getFilter']({ sortBy: 'ma_dvi' })
      return [
        ...[{ donvi_id: 0, ten_dv: this.$store.getters.languages('global.select_all') }],
        ...rs]
    },
    nhom_kh() {
      const rs = this.$store.getters['kehoach/getNhomKH']
      return [
        ...[{ id: 0, title: this.$store.getters.languages('global.select_all') }],
        ...rs]
    },
    nguoidung() {
      const rs = this.$store.state.kehoach.nguoidung.map((x) => ({ ma_nd: x.ma_nd, ten_nd_dv: x.ten_nd_dv }))
      return [
        ...[{ ma_nd: '', ten_nd_dv: this.$store.getters.languages('global.select_all') }],
        ...rs]
    }
  },
  watch: {
    pagination: {
      handler(val) {
        this.$store.dispatch('kehoach/select_th',
          {
            pagination: this.pagination,
            totalItems: this.totalItems,
            loading: true
          }).then((x) => {
            if (x && x.total) this.totalItems = x.total
          })
      },
      deep: true
    },
  },
  methods: {
    onEdit(item) {
      this.$store.commit('kehoach/SET_ITEM', item)
      this.dialogThuchien = true
      this.$refs.form.resetValidation()
    },
    onCFMAccept() {
      this.dialogThuchien = false
      // this.$store.dispatch('kehoach/delete')
    },
    onCFMCancel() {
      this.$store.commit('kehoach/SET_ITEM')
      this.dialogThuchien = false
      // this.$refs.form.resetValidation()
    },
    onSave() {
      if (this.valid) {
        // this.$store.dispatch('kehoach/insert_th', { loading: true })
        this.dialogConfirm = true
      }
    },
    getKetQua(ket_qua) {
      if (ket_qua === 2)
        return 'Thành công'
      else if (ket_qua === 3)
        return 'Thành công'
      else return 'Đang thực hiện'
    },
    getDataExport() {
      let params = { ...this.pagination }
      params.sortBy = 'ten_dv,title,thang_bd'
      params.loading = true
      params.isExport = true
      return this.$store.dispatch('kehoach/export_data_th', params)
    }
  }
}
</script>

<style>
</style>