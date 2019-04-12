<template>
  <div>
    <v-card>
      <v-card-title>
        <v-text-field v-model="$store.state.contract_customer.pagination.search"
          append-icon="search" label="Tìm kiếm hợp đồng" single-line hide-details></v-text-field>
        <v-spacer></v-spacer>
        <v-tooltip bottom>
          <v-btn slot="activator" color="primary" small fab flat @click="$store.state.contract_customer.dialog=true">
            <i class="material-icons">add</i>
          </v-btn>
          <span>Nhập mới hợp đồng</span>
        </v-tooltip>
        <v-btn-toggle v-model="$store.state.contract_customer.pagination.toggle"
          mandatory>
          <v-tooltip bottom>
            <v-btn slot="activator" flat @click="$store.state.contract_customer.pagination.find.flag=1">
              <i class="material-icons">view_list</i>
            </v-btn>
            <span>Danh sách hợp đồng</span>
          </v-tooltip>
          <v-tooltip bottom>
            <v-btn slot="activator" flat @click="$store.state.contract_customer.pagination.find.flag=0">
              <i class="material-icons">delete</i>
            </v-btn>
            <span>Danh sách hợp đồng đã cập nhật</span>
          </v-tooltip>
        </v-btn-toggle>
      </v-card-title>
      <v-data-table class="elevation-1" v-model="$store.state.contract_customer.selected"
        select-all item-key="cc_id" :headers="this.$store.getters['contract_customer/headers']"
        :items="items" :rows-per-page-items="$store.state.$row_per_page"
        :rows-per-page-text="$store.getters.languages(['global.rows_per_page'])"
        :pagination.sync="$store.state.contract_customer.pagination" :search="$store.state.contract_customer.pagination.search">
        <!-- select-all :loading="loading" :total-items="totalItems" -->
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
              <v-tooltip bottom>
                <a slot="activator" class="mx-0 v-btn v-btn--icon theme--info" :href="vnptbkn.defaults.host+props.item.attach"
                  target="_blank"><i class="material-icons">attachment</i></a>
                <span>Hợp đồng {}</span>
              </v-tooltip>
              <v-btn icon class="mx-0" @click="onEdit(props.item)">
                <i class="material-icons teal--text">assignment</i>
              </v-btn>
              <!-- <v-btn icon class="mx-0" @click="onDelete(props.item)">
                <i v-if="pagination.find.flag===1" class="material-icons error--text">delete</i>
                <i v-else class="material-icons info--text">refresh</i>
              </v-btn> -->
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card>
    <tpl-confirm :dialog="$store.state.contract_customer.confirm" @onAccept="onCFMAccept"
      @onCancel="onCFMCancel" :title="$store.getters.languages(['global.message'])"
      :content="$store.getters.languages(['messages.confirm_content'])" :btnAcceptText="$store.getters.languages(['global.accept'])"
      :btnCancelText="$store.getters.languages(['global.cancel'])"></tpl-confirm>
  </div>
</template>

<script>
import confirm from '@/components/confirm'
import { vnptbkn } from '@/plugins/axios-config'
export default {
  components: { 'tpl-confirm': confirm },
  data: () => ({
    vnptbkn: vnptbkn
  }),
  computed: {
    items() {
      return this.$store.getters['contract_customer/getFilter']()
    }
  },
  methods: {
    onEdit(item) {
      this.$store.commit('contract_customer/SET_ITEM', item)
      this.$store.dispatch('contract_customer/getThuebao')
      this.$store.state.contract_customer.dialog = true
    },
    onDelete(item) {
      this.$store.state.contract_customer.confirm = true
      if (item) this.$store.state.contract_customer.selected.push(item);
    },
    onCFMAccept() {
      this.$store.dispatch('navigation/delete')
    },
    onCFMCancel() {
      this.$store.state.navigation.selected = []
    }
  }
}
</script>

<style>
</style>