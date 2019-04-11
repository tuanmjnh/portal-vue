<template>
  <div>
    <v-card>
      <v-form v-model="valid" ref="form">
        <v-card-title>
          <v-layout wrap>
            <v-flex xs12 sm5 md5>
              <v-select :items="roles" v-model="roles_selected" item-value="id" item-text="name"
                :hide-selected="true" :label="$store.getters.languages('global.roles')"
                :rules="[v=>v.length>0||$store.getters.languages(['error.required_select'])]"></v-select>
            </v-flex>
            <v-spacer></v-spacer>
            <v-btn color="primary" flat @click.native="onSave" :disabled="!valid"
              :loading="$store.state.$loadingCommit">
              {{$store.getters.languages('global.update')}}
            </v-btn>
          </v-layout>
        </v-card-title>
      </v-form>
      <v-divider></v-divider>
      <v-card-text>
        <v-layout wrap>
          <v-flex xs12 sm5 md5>
            <v-select :items="db_donvi" v-model="$store.state.nguoidung.donvi_id"
              :hide-selected="true" item-text="ten_donvi" item-value="donvi_id" :label="$store.getters.languages('global.local')"></v-select>
          </v-flex>
          <v-spacer></v-spacer>
          <v-flex xs12 sm3 md3>
            <v-text-field v-model="pagination.search" append-icon="search" :label="$store.getters.languages('global.search')"
              single-line hide-details></v-text-field>
          </v-flex>
        </v-layout>
        <v-data-table class="elevation-1" v-model="$store.state.nguoidung.selected"
          item-key="nguoidung_id" select-all :headers="headers" :items="items"
          :rows-per-page-items="rowPerPage" :rows-per-page-text="$store.getters.languages('global.rows_per_page')"
          :pagination.sync="pagination" :search="pagination.search">
          <!--:loading="loading" :pagination.sync="pagination" :total-items="totalItems" -->
          <template slot="items" slot-scope="props">
            <tr>
              <td>
                <v-checkbox v-model="props.selected" primary hide-details></v-checkbox>
              </td>
              <td>{{ props.item.ma_nd }}</td>
              <td>{{ props.item.ten_nd }}</td>
              <td><v-chip :color="JSON.parse(props.item.color).cover" :text-color="JSON.parse(props.item.color).text" small>{{ props.item.roles_name }}</v-chip></td>
            </tr>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    <tpl-confirm :dialog.sync="confirmDialog" @onAccept="onCFMAccept" @onCancel="onCFMCancel"
      :title="$store.getters.languages('global.message')" :content="$store.getters.languages('messages.confirm_content')"
      :btnAcceptText="$store.getters.languages('global.accept')" :btnCancelText="$store.getters.languages('global.cancel')" />
  </div>
</template>

<script>
import confirm from '@/components/confirm'
import listSelect from '@/components/list-select'
export default {
  components: {
    'tpl-confirm': confirm,
    'list-select': listSelect
  },
  data: () => {
    return {
      valid: false,
      confirmDialog: false,
      roles_selected: '',
      pagination: { search: '', sortBy: 'ma_nd', direction: false, find: { trangthai: 1 } },
      rowPerPage: [10, 25, 50, 100, 200, 500], //  { text: "All", value: -1 }
      headers: [
        { text: 'nguoidung.username', value: 'ma_nd' },
        { text: 'nguoidung.full_name', value: 'ten_nd' },
        { text: 'global.roles', value: 'roles_name' },
      ]
    }
  },
  created() {
    this.headers.forEach(e => { e.text = this.$store.getters.languages([e.text]) });
    if (this.$store.state.nguoidung.isGetFirst) this.$store.dispatch('nguoidung/select').then(() => {
      this.nguoidung_list = this.$store.getters['nguoidung/getFilter']({ sortBy: 'ma_nd', find: { trangthai: 1 } })
    })
    if (this.$store.state.db_donvi.isGetFirst) this.$store.dispatch('db_donvi/select')
    if (this.$store.state.roles.isGetFirst) this.$store.dispatch('roles/select')
  },
  computed: {
    items() {
      var rs = this.$store.getters['nguoidung/getFilterDonvi'](this.pagination)
      return rs
    },
    db_donvi() {
      var rs = this.$store.getters['db_donvi/getFilter']({ sortBy: 'ma_dvi' })
      return [...[{ donvi_id: 0, ten_donvi: '-- Tất cả --' }], ...rs] //.unshift({ donvi_id: 0, ten_donvi: '-- Tất cả --' })
    },
    roles() {
      var rs = this.$store.getters['roles/getFilter']({ sortBy: 'orders', find: { flag: 1 } })
      return rs
    },
  },
  methods: {
    onSave(item) {
      if (this.valid) {
        this.confirmDialog = !this.confirmDialog
      }
    },
    onCFMAccept() {
      const _roles = this.roles.find(x => x.id === this.roles_selected)
      if (_roles !== undefined)
        this.$store.dispatch('nguoidung/set_roles', _roles)
    },
    onCFMCancel() {
      this.$store.state.nguoidung.selected = []
    }
  }
}
</script>

<style>
</style>