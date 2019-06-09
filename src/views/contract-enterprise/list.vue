<template>
  <div>
    <v-dialog v-model="dialog_filter" max-width="512px">
      <v-card>
        <v-card-title class="headline grey lighten-2">
          {{$languages.get('global.filter_data')}}
        </v-card-title>
        <v-card-text>
          <v-layout wrap>
            <v-flex xs6 sm12 md12>
              <v-text-field v-model="pagination.search" append-icon="search" :label="$languages.get('global.search')"
                single-line hide-details></v-text-field>
            </v-flex>
            <v-flex xs12 sm12 md12>
              <v-select :items="nhom_dich_vu" v-model="pagination.group_id"
                :hide-selected="true" item-text="title" item-value="id" label="loại dịch vụ"></v-select>
            </v-flex>
            <v-flex xs12 sm6 md6>
              <v-menu v-model="start_at_menu" :close-on-content-click="false"
                :nudge-right="40" lazy transition="scale-transition" offset-y full-width
                min-width="290px">
                <template v-slot:activator="{on}">
                  <v-text-field :value="pagination.start_at.formatDate('DD/MM/YYYY')"
                    :label="$languages.get('global.start_at')" prepend-icon="event"
                    readonly v-on="on" persistent-hint :hint="`${$languages.get('global.format')}: DD/MM/YYYY`"></v-text-field>
                </template>
                <v-date-picker v-model="pagination.start_at" @input="menu2=false"></v-date-picker>
              </v-menu>
            </v-flex>
            <v-flex xs12 sm6 md6>
              <v-menu v-model="end_at_menu" :close-on-content-click="false" :nudge-right="40"
                lazy transition="scale-transition" offset-y full-width min-width="290px">
                <template v-slot:activator="{on}">
                  <v-text-field :value="pagination.end_at.formatDate('DD/MM/YYYY')"
                    :label="$languages.get('global.end_at')" prepend-icon="event"
                    readonly v-on="on" persistent-hint :hint="`${$languages.get('global.format')}: DD/MM/YYYY`"></v-text-field>
                </template>
                <v-date-picker v-model="pagination.end_at" @input="menu2=false"></v-date-picker>
              </v-menu>
            </v-flex>
          </v-layout>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat @click.native="dialog_filter=false">
            {{$languages.get('global.back')}}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-card>
      <v-card-title>
        <span class="title">Hợp đồng các dịch vụ công nghệ thông tin</span>
        <v-spacer></v-spacer>
        <v-tooltip bottom>
          <v-btn slot="activator" color="primary" small fab flat @click="$store.state.contract_enterprise.dialog=true">
            <i class="material-icons">add</i>
          </v-btn>
          <span>{{$languages.get('contract_customer.add')}}</span>
        </v-tooltip>
        <v-tooltip bottom>
          <v-btn slot="activator" flat icon color="primary" @click="dialog_filter=true">
            <v-icon>filter_list</v-icon>
          </v-btn>
          <span>{{$languages.get('global.filter_data')}}</span>
        </v-tooltip>
        <!-- <v-btn-toggle v-model="toggle" mandatory>
          <v-tooltip bottom>
            <v-btn slot="activator" flat @click="pagination.flag=1">
              <i class="material-icons">view_list</i>
            </v-btn>
            <span>{{$languages.get('contract_enterprise.use')}}</span>
          </v-tooltip>
          <v-tooltip bottom>
            <v-btn slot="activator" flat @click="pagination.flag=4">
              <i class="material-icons">delete</i>
            </v-btn>
            <span>{{$languages.get('contract_enterprise.deleted')}}</span>
          </v-tooltip>
        </v-btn-toggle> -->
        <export-data :getData="getDataExport" :tooltip="$languages.get('global.export')"
          :items="[{title:`${$languages.get('global.export')} .csv`,type:'csv'}]" />
      </v-card-title>
      <v-data-table class="elevation-1" v-model="$store.state.contract_enterprise.selected"
        select-all item-key="id" :headers="headers" :items="items" :rows-per-page-items="$store.state.$row_per_page"
        :rows-per-page-text="$languages.get('global.rows_per_page')" :pagination.sync="pagination"
        :search="pagination.search">
        <!--:loading="loading" :pagination.sync="pagination" :total-items="totalItems" -->
        <template slot="items" slot-scope="props">
          <tr>
            <td>
              <v-checkbox v-model="props.selected" primary hide-details></v-checkbox>
            </td>
            <!-- <td>{{ props.item.id }}</td> -->
            <td>{{ props.item.ma_hd }}</td>
            <td>{{ props.item.ten_kh }}</td>
            <td>{{ props.item.nguoi_dd }}</td>
            <td>{{ props.item.sdt }}</td>
            <td>{{ (props.item.tien+props.item.thue).format()}}</td>
            <td>{{ props.item.ngay_tao|formatDate('DD/MM/YYYY') }}</td>
            <td class="justify-center layout px-0">
              <v-tooltip left>
                <a slot="activator" :href="`${http.defaults.host}/${props.item.tep_dk}`"
                  target="_blank" class="mx-0 v-btn v-btn--icon theme--info">
                  <i class="material-icons">attachment</i>
                </a>
                <span>
                  {{`${$languages.get('contract_customer.details')}:
                  ${props.item.ma_hd}`}}
                </span>
              </v-tooltip>
              <v-tooltip left>
                <v-btn flat icon slot="activator" color="teal" class="mx-0" @click="onEdit(props.item)">
                  <v-icon>assignment</v-icon>
                </v-btn>
                <span>{{$languages.get('contract_customer.details')}}</span>
              </v-tooltip>
              <v-tooltip left v-if="pagination.flag===1">
                <v-btn flat icon slot="activator" color="danger" class="mx-0" @click="onDelete(props.item)">
                  <v-icon>highlight_off</v-icon>
                </v-btn>
                <span>{{$languages.get('contract_customer.cancel')}}</span>
              </v-tooltip>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card>
    <tpl-confirm :dialog.sync="dialog_confirm" @onAccept="onCFMAccept" @onCancel="onCFMCancel"
      :title="$languages.get('global.message')" :content="$languages.get('messages.confirm_content')"
      :btnAcceptText="$languages.get('global.accept')" :btnCancelText="$languages.get('global.cancel')"></tpl-confirm>
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
  props: { http: null },
  data: () => ({
    dialog_filter: false,
    dialog_confirm: false,
    toggle: 0,
    totalItems: 0,
    start_at_menu: false,
    end_at_menu: false,
    headers: [
      { text: 'Mã hợp đồng', value: 'ma_hd' },
      { text: 'Tên cơ quan', value: 'ten_kh' },
      { text: 'Người đại diện', value: 'nguoi_dd' },
      { text: 'Số điện thoại', value: 'sdt' },
      { text: 'Tiền hợp đồng', value: 'tien' },
      { text: 'Ngày nhập', value: 'ngay_tao' },
      { text: '#', value: '#', sortable: false }
    ],
    pagination: {
      loading: true,
      search: '',
      sortBy: '"ngay_tao"',
      descending: true,
      toggle: 0,
      flag: 1,
      group_id: 0,
      start_at: '',//new Date().toISOString().substr(0, 10),
      end_at: '',//new Date().toISOString().substr(0, 10),
      // filter: { flag: 1, donvi_id: 0 },
      page: 1,
      rowsPerPage: 8
    },
  }),
  computed: {
    items() {
      // return this.$store.getters['contract_enterprise/getFilter']()
      return this.$store.state.contract_enterprise.items
    },
    nhom_dich_vu() {
      let rs = this.$store.state.contract_enterprise.category
      rs = rs ? rs.filter(x => { return (x.dependent !== ',0,') }) : []
      return [...[{ id: 0, title: this.$languages.get('global.select_all') }], ...rs]
    }
  },
  watch: {
    pagination: {
      handler(val) {
        // if (!this.$store.state.$loadingGet)
        this.$store.dispatch('contract_enterprise/select', this.pagination).then((x) => {
          if (x && x.total) this.totalItems = x.total
        })
      },
      deep: true
    },
  },
  methods: {
    onEdit(item) {
      this.$store.commit('contract_enterprise/SET_ITEM', item)
      this.$store.state.contract_enterprise.dialog = true
    },
    onDelete(item) {
      this.$store.state.contract_enterprise.confirm = true
      if (item) this.$store.state.contract_enterprise.selected.push(item)
    },
    onCFMAccept() {
      this.$store.dispatch('contract_enterprise/delete')
    },
    onCFMCancel() {
      this.$store.state.contract_enterprise.selected = []
    },
    dateStartAtFormat() {
      return this.start_at.date.formatDate('MM/YYYY')
    },
    getDataExport() {
      let params = { ...this.pagination }
      params.sortBy = 'created_at'
      params.loading = true
      params.is_export = true
      return this.$store.dispatch('contract_enterprise/select', params)
    }
  }
}
</script>

<style>
</style>