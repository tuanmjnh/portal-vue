<template>
  <div>
    <v-card>
      <v-card-title>
        <v-layout wrap>
          <v-flex xs6 sm4 md4 class="mr-3" v-if="this.$store.getters['auth/inRoles']('donvi.select')">
            <v-select :items="donvi" v-model="$store.state.contract_customer.pagination.donvi_id"
              :hide-selected="true" item-text="ten_dv" item-value="donvi_id" :label="$store.getters.languages(['global.local'])"></v-select>
          </v-flex>
          <v-flex xs6 sm5 md5>
            <v-text-field v-model="$store.state.contract_customer.pagination.search"
              append-icon="search" :label="$store.getters.languages('global.search')"
              single-line hide-details></v-text-field>
          </v-flex>
          <v-spacer></v-spacer>
        </v-layout>
        <v-tooltip bottom>
          <v-btn slot="activator" color="primary" small fab flat @click="$store.state.contract_customer.dialog=true">
            <i class="material-icons">add</i>
          </v-btn>
          <span>{{$store.getters.languages('contract_customer.add')}}</span>
        </v-tooltip>
        <!-- <v-btn-toggle v-model="toggle" mandatory>
          <v-tooltip bottom>
            <v-btn slot="activator" flat @click="$store.state.contract_customer.pagination.flag=1">
              <i class="material-icons">view_list</i>
            </v-btn>
            <span>{{$store.getters.languages('contract_customer.use')}}</span>
          </v-tooltip>
          <v-tooltip bottom>
            <v-btn slot="activator" flat @click="$store.state.contract_customer.pagination.flag=4">
              <i class="material-icons">delete</i>
            </v-btn>
            <span>{{$store.getters.languages('contract_customer.deleted')}}</span>
          </v-tooltip>
        </v-btn-toggle> -->
        <export-data :getData="getDataExport" :tooltip="$store.getters.languages('global.export')"
          :items="[{title:$store.getters.languages(['global.export',' ',' .csv']),type:'csv'}]" />
      </v-card-title>
      <v-data-table class="elevation-1" v-model="$store.state.contract_customer.selected"
        select-all item-key="id" :headers="this.$store.getters['contract_customer/headers']"
        :items="items" :rows-per-page-text="$store.getters.languages(['global.rows_per_page'])"
        :pagination.sync="$store.state.contract_customer.pagination" :rows-per-page-items="[8, 25, 50, 100, 200, 500]"
        :total-items="$store.state.contract_customer.totalItems" :loading="$store.state.$loadingGet">
        <!-- select-all :loading="loading" :total-items="totalItems" :search="$store.state.contract_customer.pagination.search"-->
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
                  `${$store.getters.languages('contract_customer.details')}:${props.item.ma_gd}`
                  }}
                </span>
              </v-tooltip>
              <v-tooltip left>
                <v-btn flat icon slot="activator" color="teal" class="mx-0" @click="onEdit(props.item)">
                  <v-icon>assignment</v-icon>
                </v-btn>
                <span>{{$store.getters.languages('contract_customer.details')}}</span>
              </v-tooltip>
              <v-tooltip left v-if="$store.state.contract_customer.pagination.flag===1">
                <v-btn flat icon slot="activator" color="danger" class="mx-0" @click="onDelete(props.item)">
                  <v-icon>highlight_off</v-icon>
                </v-btn>
                <span>{{$store.getters.languages('contract_customer.cancel')}}</span>
              </v-tooltip>
              <!-- <v-btn icon class="mx-0" @click="onDelete(props.item)">
                <i v-if="$store.state.contract_customer.pagination.flag===1" class="material-icons error--text">delete</i>
                <i v-else class="material-icons info--text">refresh</i>
              </v-btn> -->
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card>
    <tpl-confirm :dialog.sync="$store.state.contract_customer.confirm" @onAccept="onCFMAccept"
      @onCancel="onCFMCancel" :title="$store.getters.languages(['global.message'])"
      :content="$store.getters.languages(['messages.confirm_content'])" :btnAcceptText="$store.getters.languages(['global.accept'])"
      :btnCancelText="$store.getters.languages(['global.cancel'])" />
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
    toggle: 0,
  }),
  computed: {
    items() {
      // return this.$store.getters['contract_customer/getFilter']()
      return this.$store.getters['contract_customer/getAll']
    },
    donvi() {
      var rs = this.$store.getters['donvi/getFilter']({ sortBy: 'ma_dvi' })
      return [...[{ donvi_id: 0, ten_dv: this.$store.getters.languages('global.select_all') }], ...rs] //.unshift({ donvi_id: 0, ten_donvi: '-- Tất cả --' })
    },
    pagination: {
      get: function () {
        return this.$store.state.contract_customer.pagination
      },
      set: function (value) {
        this.$store.state.contract_customer.pagination = value
      }
    }
  },
  watch: {
    pagination: {
      handler(val) {
        // if (!this.$store.state.$loadingGet)
        this.$store.dispatch('contract_customer/select')
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
    getDataExport() {
      return this.$store.dispatch('contract_customer/select', true)
    }
  },
  created() {
    // console.log(this.$store.getters['auth/inRoles']('donvi.select'))
  }
}
</script>

<style>
</style>