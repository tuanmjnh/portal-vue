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
              <v-select :items="donvi" v-model="pagination.donvi_id" item-text="ten_dv"
                item-value="donvi_id" :label="$languages.get('global.local')"></v-select>
            </v-flex>
            <v-flex xs12 sm12 md12 v-if="$store.getters['auth/inRoles']('kehoach.update')">
              <v-select :items="pagination_nguoidung" v-model="pagination.ma_nd"
                item-text="ten_nd_dv" item-value="ma_nd" label="Thuê bao theo nhân viên"></v-select>
            </v-flex>
            <v-flex xs12 sm12 md12>
              <v-select :items="nhom_kh" v-model="pagination.nhomkh_id" item-text="title"
                item-value="id" label="Nhóm kế hoạch"></v-select>
            </v-flex>
            <v-flex xs12 sm12 md12>
              <v-select :items="flag" v-model="pagination.flag" label="Trạng thái thực hiện"></v-select>
            </v-flex>
          </v-layout>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <!-- <v-btn color="primary" flat @click.native="onSave">
                {{$languages.get('global.accept')}}
              </v-btn> -->
          <v-btn color="primary" flat @click.native="dialog_filter=false">
            {{$languages.get('global.back')}}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-card>
      <v-card-title>
        <span class="title">Danh sách thuê bao kế hoạch</span>
        <v-spacer></v-spacer>
        <v-tooltip bottom>
          <v-btn slot="activator" flat icon color="primary" @click="dialog_filter=true">
            <v-icon>filter_list</v-icon>
          </v-btn>
          <span>{{$languages.get('global.filter_data')}}</span>
        </v-tooltip>
        <!-- <export-data :getData="getDataExport" filename="kehoach_thuebao" :suffixFileName="true"
          :tooltip="$languages.get('global.export')" color="success" :items="[{title:$store.getters.languages(['global.export',' ',' .csv']),type:'csv'}]" /> -->
      </v-card-title>
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
      ma_nd: '$all',
      ket_qua: ''
    },
    flag: [
      { value: 1, text: 'Chưa thực hiện' },
      { value: 2, text: 'Đã thực hiện' }
    ],
  }),
  computed: {
    donvi() {
      return this.$store.state.donvi.items //this.$store.getters['donvi/getPBH']
    },
    nhom_kh() {
      return this.$store.getters['kehoach/getNhomKH']
    },
    pagination_nguoidung() {
      const rs = this.$store.getters['kehoach/getFilterDonvi'](this.pagination) // this.$store.state.kehoach.nguoidung.map((x) => ({ value: x.ma_nd, text: x.ten_nd_dv }))
      //return rs.unshift([{ ma_nd: '', ten_nd_dv: '-- Chưa được gán nhân viên --' }])
      return [
        ...[{ ma_nd: '$all', ten_nd_dv: this.$languages.get('global.select_all') }],
        ...[{ ma_nd: '', ten_nd_dv: '-- Chưa được gán nhân viên --' }],
        ...rs
      ]
    },
  },
  watch: {

  },
  methods: {

  }
}
</script>

<style>
</style>