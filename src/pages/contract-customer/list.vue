<template>
  <div>
    <v-card>
      <v-card-title>
        <v-text-field v-model="query.search" append-icon="search" label="Tìm kiếm hợp đồng" single-line hide-details></v-text-field>
        <v-spacer></v-spacer>
        <v-tooltip bottom>
          <v-btn slot="activator" color="primary" small fab flat @click="localDialog=!localDialog">
            <i class="material-icons">add</i>
          </v-btn>
          <span>Nhập mới hợp đồng</span>
        </v-tooltip>
        <v-btn-toggle v-model="toggle_one" mandatory>
          <v-tooltip bottom>
            <v-btn slot="activator" flat @click="query.flag=1">
              <i class="material-icons">view_list</i>
            </v-btn>
            <span>Danh sách hợp đồng</span>
          </v-tooltip>
          <v-tooltip bottom>
            <v-btn slot="activator" flat @click="query.flag=0">
              <i class="material-icons">delete</i>
            </v-btn>
            <span>Danh sách hợp đồng đã cập nhật</span>
          </v-tooltip>
        </v-btn-toggle>
      </v-card-title>
      <v-data-table class="elevation-1" v-model="selected" item-key="user_id" :headers="headers"
        :items="items" :rows-per-page-items="rowPerPage" :loading="loading">
        <!-- select-all :loading="loading" :pagination.sync="pagination" :total-items="totalItems" -->
        <template slot="items" slot-scope="props">
          <tr>
            <!-- <td>
              <v-checkbox v-model="props.selected" primary hide-details></v-checkbox>
            </td> -->
            <!-- <td>{{ props.item.id }}</td> -->
            <td>{{ props.item.ma_gd }}</td>
            <td>{{ props.item.ten_kh }}</td>
            <td>{{ props.item.so_dt }}</td>
            <td>{{ props.item.created_by }}</td>
            <td>{{ props.item.created_at|formatDate('DD/MM/YYYY') }}</td>
            <td class="justify-center layout px-0">
              <a class="mx-0 v-btn v-btn--icon theme--info" :href="host+props.item.attach" target="_blank"><i class="material-icons">attachment</i></a>
              <v-btn icon class="mx-0" @click="onEdit(props.item)">
                <i class="material-icons teal--text">assignment</i>
              </v-btn>
              <!-- <v-btn icon class="mx-0" @click="onDelete(props.item)">
                <i v-if="query.flag===1" class="material-icons error--text">delete</i>
                <i v-else class="material-icons info--text">refresh</i>
              </v-btn> -->
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card>
    <tpl-confirm :dialog="confirmDialog" @ok="onConfirm"></tpl-confirm>
  </div>
</template>

<script>
import confirm from '@/components/confirm'
import { vnptbkn } from '@/plugins/axios-config'
export default {
  components: { 'tpl-confirm': confirm },
  props: { dialog: { type: Boolean, default: false } },
  data: () => {
    return {
      loading: true,
      selected: [],
      toggle_one: 0,
      localDialog: false,
      confirmDialog: false,
      query: { search: '', flag: 1 },
      rowPerPage: [5, 10, 25, 50, 100, { text: "All", value: -1 }],
      host: vnptbkn.defaults.host,
      headers: [
        { text: 'Mã hợp đồng', value: 'contract_code' },
        { text: 'Tên khách hàng', value: 'customer_name' },
        { text: 'Điện thoại', value: 'customer_phone' },
        { text: 'Người tạo', value: 'created_by' },
        { text: 'Ngày tạo', value: 'created_at' },
        // { text: '#', value: 'attachs' },
        { text: '#', value: '#', sortable: false }
      ]
    }
  },
  computed: {
    items() {
      var rs = this.$store.getters['contract_customer/getFilter'](this.query)
      return rs
    }
  },
  watch: {
    dialog(val) { this.localDialog = val },
    localDialog(val) {
      this.$emit('handleDialog', val)
      if (!val) this.$store.dispatch('contract_customer/khachhang')
    }
  },
  created() {
    this.$store.dispatch('contract_customer/select').then(this.loading = false)
  },
  methods: {
    onEdit(item) {
      this.$store.dispatch('contract_customer/khachhang', item)
      this.localDialog = true
    },
    onDelete(item) {
      this.confirmDialog = !this.confirmDialog
      this.$store.dispatch('contract_customer/khachhang', item)
    },
    onConfirm() {
      this.$store.dispatch('contract_customer/delete')
    }
  }
}
</script>

<style>
</style>