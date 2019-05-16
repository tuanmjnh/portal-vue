<template>
  <div>
    <v-card>
      <v-form v-model="valid" ref="form">
        <v-card-title>
          <v-layout wrap>
            <v-flex xs12 sm5 md5>
              <v-select :items="roles" v-model="roles_selected" item-value="id" item-text="name"
                :hide-selected="true" :label="$languages.get('global.roles')" :rules="[v=>v.length>0||$languages.get('error.required_select')]"></v-select>
            </v-flex>
            <v-spacer></v-spacer>
            <v-btn color="primary" flat @click.native="onSave" :disabled="!valid"
              :loading="$store.state.$loadingCommit">
              {{$languages.get('global.update')}}
            </v-btn>
            <v-btn color="secondary" flat @click="$router.push('/nguoidung')" :disabled="$store.state.$loadingCommit">
              {{$languages.get('global.back')}}
            </v-btn>
          </v-layout>
        </v-card-title>
      </v-form>
      <v-divider></v-divider>
      <v-card-text>
        <v-layout wrap>
          <!-- <v-flex xs12 sm5 md5>
            <v-select :items="donvi" v-model="$store.state.nguoidung.donvi_id"
              :hide-selected="true" item-text="ten_dv" item-value="donvi_id" :label="$languages.get('global.local')"></v-select>
          </v-flex> -->
           <v-flex xs6 sm5 md5>
            <v-select :items="donvi" v-model="pagination.donvi_id" multiple item-text="ten_dv"
              item-value="donvi_id" :label="$languages.get('global.local')"></v-select>
          </v-flex>
          <v-spacer></v-spacer>
          <v-flex xs12 sm3 md3>
            <v-text-field v-model="pagination.search" append-icon="search" :label="$languages.get('global.search')"
              single-line hide-details></v-text-field>
          </v-flex>
        </v-layout>
        <v-data-table class="elevation-1" v-model="$store.state.nguoidung.selected"
          item-key="nguoidung_id" select-all :headers="headers" :items="items"
          :total-items="totalItems" :rows-per-page-items="[10, 25, 50, 100, 200, 500]"
          :rows-per-page-text="$languages.get('global.rows_per_page')" :pagination.sync="pagination"
          :loading="$store.state.$loadingGet" :no-data-text="$languages.get('global.no_data_text')"
          :no-results-text="$languages.get('global.no_results_text')">
          <template slot="items" slot-scope="props">
            <tr>
              <td>
                <v-checkbox v-model="props.selected" primary hide-details></v-checkbox>
              </td>
              <td>{{ props.item.ma_nd }}</td>
              <td>{{ props.item.ten_nd }}</td>
              <td>
                <v-chip small :color="getColor(props.item,'cover')" :text-color="getColor(props.item,'text')">
                  {{
                  props.item.roles_name?props.item.roles_name:$languages.get('global.undefined')
                  }}
                </v-chip>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    <tpl-confirm :dialog.sync="confirmDialog" @onAccept="onCFMAccept" @onCancel="onCFMCancel"
      :title="$languages.get('global.message')" :content="$languages.get('messages.confirm_content')"
      :btnAcceptText="$languages.get('global.accept')" :btnCancelText="$languages.get('global.cancel')" />
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
      totalItems: 0,
      pagination: {
        loading: true,
        search: '',
        sortBy: 'donvi_id,ma_nd',
        descending: false,
        toggle: 0,
        flag: 1,
        page: 1,
        rowsPerPage: 10,
        donvi_id: [5588],
      },
      headers: [
        { text: 'nguoidung.username', value: 'ma_nd' },
        { text: 'nguoidung.full_name', value: 'ten_nd' },
        { text: 'global.roles', value: 'roles_name' },
      ]
    }
  },
  created() {
    this.headers.forEach(e => { e.text = this.$store.getters.languages([e.text]) });
    // if (this.$store.state.nguoidung.isGetFirst) this.$store.dispatch('nguoidung/select').then(() => {
    //   this.nguoidung_list = this.$store.getters['nguoidung/getFilter']({ sortBy: 'ma_nd', find: { trangthai: 1 } })
    // })
    // if (this.$store.state.donvi.isGetFirst) this.$store.dispatch('donvi/select', false)
    if (this.$store.state.roles.isGetFirst) this.$store.dispatch('roles/select', false)
  },
  computed: {
    items() {
      return this.$store.state.nguoidung.items// this.$store.getters['nguoidung/getAll']
    },
    donvi() {
      // var rs = this.$store.getters['donvi/getFilter']({ sortBy: 'ma_dvi' })
      // return [...[{ donvi_id: 0, ten_dv: '-- Tất cả --' }], ...rs] //.unshift({ donvi_id: 0, ten_donvi: '-- Tất cả --' })
      return this.$store.state.donvi.items
    },
    roles() {
      var rs = this.$store.getters['roles/getFilter']({ sortBy: 'orders', find: { flag: 1 } })
      return rs
    },
  },
  watch: {
    pagination: {
      handler(val) {
        this.$store.dispatch('nguoidung/select', this.pagination).then((x) => {
          if (x && x.total) this.totalItems = x.total
        })
      },
      deep: true
    }
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
    },
    getColor(item, element) {
      if (item) {
        const rs = JSON.parse(item.color)
        if (rs && rs[element]) return rs[element]
      }
      return ''
    }
  }
}
</script>

<style>
</style>