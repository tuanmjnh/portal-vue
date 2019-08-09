<template>
  <div>
    <v-dialog v-model="dialog_filter" max-width="521px">
      <v-card>
        <v-card-title class="headline grey lighten-2">
          Tạo báo cáo
        </v-card-title>
        <v-card-text>
          <v-layout wrap>
            <v-flex xs12 sm12 md12 v-if="$store.getters['auth/inRoles']('donvi.select')">
              <v-select :items="donvi" v-model="pagination.donvi_id" item-text="ten_dv" item-value="donvi_id"
                :label="$languages.get('global.local')"></v-select>
            </v-flex>
            <v-flex xs12 sm12 md12>
              <v-select :items="nhom_kh" v-model="pagination.nhomkh_id" item-text="title" item-value="id"
                label="Nhóm kế hoạch"></v-select>
            </v-flex>
            <v-flex xs12 sm12 md12>
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
            <v-flex xs12 sm12 md12 v-if="pagination.flag===2">
              <v-select :items="ket_qua" v-model="pagination.ket_qua" label="Kết quả thực hiện"></v-select>
            </v-flex>
          </v-layout>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat @click.native="onSave">
            {{$languages.get('global.accept')}}
          </v-btn>
          <v-btn color="secondary" flat @click.native="dialog_filter=false">
            {{$languages.get('global.back')}}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-card>
      <v-card-title>
        <span class="title">Báo cáo thực hiện kế hoạch</span>
        <v-spacer></v-spacer>
        <v-tooltip bottom>
          <v-btn slot="activator" flat icon color="primary" @click="dialog_filter=true">
            <v-icon>bar_chart</v-icon>
          </v-btn>
          <span>Tạo báo cáo</span>
        </v-tooltip>
        <!-- <export-data :getData="getDataExport" filename="kehoach_thuebao" :suffixFileName="true"
          :tooltip="$languages.get('global.export')" color="success" :items="[{title:$store.getters.languages(['global.export',' ',' .csv']),type:'csv'}]" /> -->
      </v-card-title>
      <v-card-text>
        <v-data-table class="elevation-1" :headers="items.thead" :items="items.tbody" hide-actions
          :rows-per-page-items="[500]" :loading="$store.state.$loadingGet"
          :rows-per-page-text="$languages.get('global.rows_per_page')"
          :no-data-text="$languages.get('global.no_data_text')"
          :no-results-text="$languages.get('global.no_results_text')">
          <template v-slot:items="props">
            <!-- <td>{{ props.item.ten_dv }}</td>
            <td>{{ props.item.soluong }}</td> -->
            <td v-for="(item,index) in props.item" :key="index">{{ item }}</td>
          </template>
        </v-data-table>
        <!-- <div class="v-table__overflow"></div>
        <table class="v-datatable v-table v-datatable--select-all theme--light">
          <thead>
            <tr>
              <th v-for="(item,index) in items.thead" :key="index">
                {{item}}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item,i) in items.tbody" :key="i">
              <td v-for="(val,ii) in item" :key="ii">
                {{val}}
              </td>
            </tr>
          </tbody>
        </table> -->
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { vnptbkn } from '@/plugins/axios-config'
import exportData from '@/components/export-data'
export default {
  components: {
    'export-data': exportData
  },
  data: () => ({
    dialog_filter: false,
    items: { thead: [], tbody: [] },
    pagination: {
      search: '',
      loading: true,
      sortBy: 'donvi_id,nhom_kh,id',
      descending: false,
      flag: 0,
      page: 1,
      rowsPerPage: 0,
      donvi_id: 0,
      nhomkh_id: 0,
      ma_nd: '0',
      ket_qua: 0,
      thang_th: 0
    },
    flag: [
      { value: 0, text: '-- Tất cả --' },
      { value: 1, text: 'Chưa thực hiện' },
      { value: 2, text: 'Đã thực hiện' }
    ],
    ket_qua: [
      { value: 0, text: '-- Tất cả --' },
      { value: 1, text: 'Thành công' },
      { value: 2, text: 'Không thành công' }
    ],
    mapHeader: [
      { value: 'ten_dv', text: 'Đơn vị' },
      { value: 'ma_nd', text: 'Mã nhân viên' },
      { value: 'ten_nd', text: 'Tên nhân viên' },
      { value: 'nhom_kh', text: 'Nhóm kế hoạch' },
      { value: 'trang_thai', text: 'Trạng thái' },
      { value: 'ket_qua', text: 'Kết quả' },
      { value: 'soluong', text: 'Số lượng' }
    ],
    date_picker_th: {
      menu: false,
      format: 'MM/YYYY',
      date: new Date().toISOString().substr(0, 10),
    }
  }),
  computed: {
    donvi() {
      const rs = this.$store.state.donvi.items
      return [
        ...[{ donvi_id: 0, ten_dv: '-- Toàn tỉnh --' }], //this.$store.getters['donvi/getPBH']
        ...rs
      ]
    },
    nhom_kh() {
      const rs = this.$store.getters['kehoach/getNhomKH']
      return [
        ...[{ id: 0, title: '-- Tất cả --' }],
        ...rs
      ]
    },
    pagination_nguoidung() {
      const rs = this.$store.getters['kehoach/getFilterDonvi']({
        donvi_id: this.$store.getters['auth/inRoles']('donvi.select') ? this.pagination.donvi_id : this.$store.state.auth.user.donvi_id
      })
      return [
        ...[{ ma_nd: '0', ten_nd_dv: '-- Tất cả --' }],
        ...rs
      ]
    },
  },
  watch: {
  },
  methods: {
    onSave() {
      this.pagination.thang_th = this.date_picker_th.date.formatDate('YYYYMM')
      if (this.$store.getters['auth/inRoles']('donvi.select') && !this.pagination.donvi_id)
        this.pagination.ma_nd = '0'
      if (this.pagination.flag < 2) this.pagination.ket_qua = 0
      this.$store.dispatch('kehoach/GetReport', this.pagination).then((x) => {
        this.items.thead = []
        this.items.tbody = []
        if (x && x.length > 0) {
          this.items.thead = Object.keys(x[0]).map((x) => ({
            value: x,
            sortable: false,
            text: this.mapHeader.find((t) => t.value === x).text
          }))
          this.items.tbody = x
        }
        this.dialog_filter = false
      })
    },
    getDataExport() {
      let params = { ...this.pagination }
      params.sortBy = 'app_key,code,dependent,orders,title'
      params.loading = true
      params.is_export = true
      return this.$store.dispatch('kehoach/select_tb', this.pagination)
    },
    getHeadTitle() {
      const rs = [
        { value: 'ten_dv', text: 'Đơn vị' },
        { value: 'ma_nd', text: 'Mã nhân viên' },
        { value: 'ten_nd', text: 'Tên nhân viên' },
        { value: 'nhom_kh', text: 'Nhóm kế hoạch' },
        { value: 'trang_thai', text: 'Trạng thái' },
        { value: 'ket_qua', text: 'Kết quả' },
        { value: 'soluong', text: 'Số lượng' }
      ]
    },
    datePickerFormat(date) {
      return date.formatDate('MM/YYYY')
    }
  }
}
</script>

<style>
</style>