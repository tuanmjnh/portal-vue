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
            <v-flex xs6 sm12 md12 v-if="this.$store.getters['auth/inRoles']('donvi.select')">
              <v-select :items="donvi" v-model="pagination.donvi_id" :hide-selected="true"
                item-text="ten_dv" item-value="donvi_id" :label="$languages.get('global.local')"></v-select>
            </v-flex>
            <v-flex xs12 sm6 md6>
              <v-menu v-model="start_at_menu" :nudge-right="40" lazy transition="scale-transition"
                offset-y full-width min-width="290px">
                <template v-slot:activator="{on}">
                  <v-text-field :value="pagination.start_at.formatDate('DD/MM/YYYY')"
                    :label="$languages.get('global.start_at')" prepend-icon="event"
                    readonly v-on="on" persistent-hint :hint="`${$languages.get('global.format')}: DD/MM/YYYY`"></v-text-field>
                </template>
                <v-date-picker v-model="pagination.start_at" @input="menu2=false"></v-date-picker>
              </v-menu>
            </v-flex>
            <v-flex xs12 sm6 md6>
              <v-menu v-model="end_at_menu" :nudge-right="40" lazy transition="scale-transition"
                offset-y full-width min-width="290px">
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
        <span class="title">{{$languages.get('contract_customer.title')}}</span>
        <v-spacer></v-spacer>
        <v-tooltip bottom>
          <v-btn slot="activator" color="primary" small fab flat @click="$store.state.contract_customer.dialog=true">
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
            <span>{{$languages.get('contract_customer.use')}}</span>
          </v-tooltip>
          <v-tooltip bottom>
            <v-btn slot="activator" flat @click="pagination.flag=4">
              <i class="material-icons">delete</i>
            </v-btn>
            <span>{{$languages.get('contract_customer.deleted')}}</span>
          </v-tooltip>
        </v-btn-toggle> -->
        <export-data :getData="getDataExport" :tooltip="$languages.get('global.export')"
          :items="[{title:`${$languages.get('global.export')} .csv`,type:'csv'}]" />
      </v-card-title>
      <v-data-table class="elevation-1" v-model="$store.state.contract_customer.selected"
        select-all item-key="id" :headers="headers" :items="items" :rows-per-page-text="$languages.get('global.rows_per_page')"
        :pagination.sync="pagination" :rows-per-page-items="[8, 25, 50, 100, 200, 500]"
        :total-items="totalItems" :loading="$store.state.$loadingGet">
        <!-- select-all :loading="loading" :total-items="totalItems" :search="pagination.search"-->
        <template slot="items" slot-scope="props">
          <tr>
            <td>
              <v-checkbox v-model="props.selected" primary hide-details></v-checkbox>
            </td>
            <!-- <td>{{ props.item.id }}</td> -->
            <td>{{ props.item.ma_gd }}</td>
            <td>{{ props.item.ten_kh }}</td>
            <td>{{ props.item.so_dt }}</td>
            <td>{{ props.item.created_by }}</td>
            <td>{{ props.item.created_at|formatDate('DD/MM/YYYY') }}</td>
            <td class="justify-center layout px-0">
              <v-tooltip left>
                <a slot="activator" class="mx-0 v-btn v-btn--icon theme--info" :href="`${http.defaults.host}/${props.item.attach}`"
                  target="_blank"><i class="material-icons">attachment</i></a>
                <span>
                  {{
                  `${$languages.get('contract_customer.details')}:${props.item.ma_gd}`
                  }}
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
              <!-- <v-btn icon class="mx-0" @click="onDelete(props.item)">
                <i v-if="pagination.flag===1" class="material-icons error--text">delete</i>
                <i v-else class="material-icons info--text">refresh</i>
              </v-btn> -->
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card>
    <tpl-confirm :dialog.sync="$store.state.contract_customer.confirm" @onAccept="onCFMAccept"
      @onCancel="onCFMCancel" :title="$languages.get('global.message')" :content="$languages.get('messages.confirm_content')"
      :btnAcceptText="$languages.get('global.accept')" :btnCancelText="$languages.get('global.cancel')" />
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
    toggle: 0,
    totalItems: 0,
    start_at_menu: false,
    end_at_menu: false,
    headers: [
      { text: 'contract_customer.contract_code', value: 'ma_gd' },
      { text: 'contract_customer.customer_name', value: 'ten_kh' },
      { text: 'nguoidung.mobile', value: 'so_dt' },
      { text: 'global.created_by', value: 'created_by' },
      { text: 'global.created_at', value: 'created_at' },
      { text: '#', value: '#', sortable: false }
    ],
    pagination: {
      loading: true,
      search: '',
      sortBy: 'created_at',
      descending: true,
      toggle: 0,
      flag: 1,
      donvi_id: 0,
      start_at: '',//new Date().toISOString().substr(0, 10),
      end_at: '',//new Date().toISOString().substr(0, 10),
      // filter: { flag: 1, donvi_id: 0 },
      page: 1,
      rowsPerPage: 8
    },
  }),
  mounted() {
    this.headers.forEach(e => { e.text = this.$languages.get(e.text) })
  },
  computed: {
    items() {
      // return this.$store.getters['contract_customer/getFilter']()
      return this.$store.getters['contract_customer/getAll']
    },
    donvi() {
      var rs = this.$store.getters['donvi/getFilter']({ sortBy: 'ma_dvi' })
      return [...[{ donvi_id: 0, ten_dv: this.$languages.get('global.select_all') }], ...rs] //.unshift({ donvi_id: 0, ten_donvi: '-- Tất cả --' })
    },
    // pagination: {
    //   get: function () {
    //     return this.pagination
    //   },
    //   set: function (value) {
    //     this.pagination = value
    //   }
    // }
  },
  watch: {
    pagination: {
      handler(val) {
        // if (!this.$store.state.$loadingGet)
        this.$store.dispatch('contract_customer/select', this.pagination).then((x) => {
          if (x && x.total) this.totalItems = x.total
        })
      },
      deep: true
    },
  },
  methods: {
    onEdit(item) {
      this.$store.commit('contract_customer/SET_KHACHHANG', item)
      this.$store.dispatch('contract_customer/getThuebao')
      this.$store.state.contract_customer.dialog = true
    },
    onDelete(item) {
      this.$store.state.contract_customer.confirm = true
      if (item) this.$store.state.contract_customer.selected.push(item);
    },
    onCFMAccept() {
      this.$store.dispatch('contract_customer/delete')
    },
    onCFMCancel() {
      this.$store.state.contract_customer.selected = []
    },
    dateStartAtFormat() {
      return this.start_at.date.formatDate('MM/YYYY')
    },
    getDataExport() {
      let params = { ...this.pagination }
      params.sortBy = 'created_at'
      params.loading = true
      params.is_export = true
      return this.$store.dispatch('contract_customer/select', params)
    },
    getHeaderText(val) {
      return this.$languages.get(val)
    }
  }
}
</script>

<style>
</style>