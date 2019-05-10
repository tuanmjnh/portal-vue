<template>
  <div>
    <v-card>
      <v-card-title>
        <v-layout wrap class="pt-2">
          <v-flex xs6 sm3 md3 class="mr-3">
            <v-select :items="donvi" v-model="pagination.donvi_id" multiple item-text="ten_dv"
              item-value="donvi_id" :label="$languages.get('global.local')"></v-select>
          </v-flex>
          <v-flex xs6 sm5 md5>
            <v-text-field v-model="pagination.search" append-icon="search" :label="$languages.get('global.search')"
              single-line hide-details></v-text-field>
          </v-flex>
          <v-spacer></v-spacer>
          <v-tooltip bottom>
            <v-btn flat icon slot="activator" color="primary" @click="$router.push('/nguoidung/set-roles')">
              <v-icon>how_to_reg</v-icon>
            </v-btn>
            <span>{{$languages.get('nguoidung.set_roles')}}</span>
          </v-tooltip>
          <!-- <v-tooltip bottom v-if="$store.state.nguoidung.selected.length>0 && pagination.find.trangthai===1">
            <v-btn flat icon slot="activator" color="danger" @click="onDelete()">
              <v-icon>delete</v-icon>
            </v-btn>
            <span>{{$languages.get('global.delete_selected')}}</span>
          </v-tooltip>
          <v-tooltip bottom v-if="$store.state.nguoidung.selected.length>0 && pagination.find.trangthai===0">
            <v-btn flat icon slot="activator" color="info" @click="onDelete()">
              <v-icon>refresh</v-icon>
            </v-btn>
            <span>{{$languages.get('global.recover_selected')}}</span>
          </v-tooltip> -->
        </v-layout>
        <!-- <v-btn-toggle v-model="toggle_one" mandatory>
          <v-tooltip bottom>
            <v-btn slot="activator" flat @click="pagination.find.trangthai=1">
              <v-icon>view_list</v-icon>
            </v-btn>
            <span>{{$languages.get('global.using')}}</span>
          </v-tooltip>
          <v-tooltip bottom>
            <v-btn slot="activator" flat @click="pagination.find.trangthai=0">
              <v-icon>delete</v-icon>
            </v-btn>
            <span>{{$languages.get('global.deleted')}}</span>
          </v-tooltip>
        </v-btn-toggle> -->
      </v-card-title>
      <v-data-table class="elevation-1" v-model="selected" item-key="nguoidung_id"
        :headers="headers" :items="items" :total-items="totalItems" :pagination.sync="pagination"
        :rows-per-page-items="[10, 25, 50, 100, 200, 500]" :rows-per-page-text="$languages.get('global.rows_per_page')"
        :loading="$store.state.$loadingGet" :no-data-text="$languages.get('global.no_data_text')"
        :no-results-text="$languages.get('global.no_results_text')">
        <template slot="items" slot-scope="props">
          <tr>
            <td>{{ props.item.ma_nd }}</td>
            <td>{{ props.item.ten_nd }}</td>
            <td>{{ props.item.so_dt }}</td>
            <td>{{ props.item.email }}</td>
            <td>
              <v-chip small :color="props.item.color?props.item.color.cover:''"
                :text-color="props.item.color?props.item.color.text:''">{{
                props.item.roles_name?props.item.roles_name:$languages.get('global.undefined')
                }}</v-chip>
            </td>
            <td class="justify-center layout px-0">
              <v-tooltip bottom>
                <v-btn flat icon slot="activator" color="warning" class="mx-0" @click="changePassword(props.item)">
                  <v-icon>restore</v-icon>
                </v-btn>
                <span>{{$languages.get('global.reset_password')}}</span>
              </v-tooltip>
              <!-- <v-tooltip bottom>
                <v-btn flat icon slot="activator" colofr="teal" class="mx-0" @click="onEdit(props.item)">
                  <v-icon>edit</v-icon>
                </v-btn>
                <span>{{$languages.get('global.edit')}}</span>
              </v-tooltip>
              <v-tooltip bottom v-if="pagination.find.trangthai===1">
                <v-btn flat icon slot="activator" color="error" class="mx-0" @click="onDelete(props.item)">
                  <v-icon>delete</v-icon>
                </v-btn>
                <span>{{$languages.get('global.delete')}}</span>
              </v-tooltip>
              <v-tooltip bottom v-else>
                <v-btn flat icon slot="activator" color="info" class="mx-0" @click="onDelete(props.item)">
                  <v-icon>refresh</v-icon>
                </v-btn>
                <span>{{$languages.get('global.recover')}}</span>
              </v-tooltip> -->
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card>
    <tpl-confirm :dialog.sync="dialog_confirm" @onAccept="onCFMAccept" @onCancel="onCFMCancel"
      :title="$languages.get('global.message')" :content="$languages.get('messages.confirm_content')"
      :btnAcceptText="$languages.get('global.accept')" :btnCancelText="$languages.get('global.cancel')" />
  </div>
</template>

<script>
import confirm from '@/components/confirm'
export default {
  components: { 'tpl-confirm': confirm },
  data: () => ({
    dialog_confirm: false,
    totalItems: 0,
    selected: [],
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
      { text: 'nguoidung.mobile', value: 'so_dt' },
      { text: 'nguoidung.email', value: 'email' },
      { text: 'global.roles', value: 'roles_name' },
      { text: '#', value: '#', sortable: false }
    ]
  }),
  mounted() {
    this.headers.forEach(e => { e.text = this.$languages.get(e.text) })
  },
  computed: {
    items() {
      // var rs = this.$store.getters['nguoidung/getFilterDonvi']//({ find: { trangthai: 1, donvi_id: this.$store.state.nguoidung.donvi_id } })
      return this.$store.state.nguoidung.items// this.$store.getters['nguoidung/getAll']
    },
    donvi() {
      // return this.$store.getters['donvi/getFilter']({ sortBy: 'ma_dvi' })
      // return [...[{ donvi_id: 0, ten_dv: this.$languages.get('global.select_all') }], ...rs] //.unshift({ donvi_id: 0, ten_donvi: '-- Tất cả --' })
      return this.$store.state.donvi.items
    }
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
    changePassword(item) {
      this.dialog_confirm = true
      if (item) this.selected.push(item);
    },
    onEdit(item) {
      this.$store.commit('nguoidung/SET_ITEM', item)
      this.$store.state.nguoidung.dialog = true
    },
    onDelete(item) {
      this.dialog_confirm = true
      if (item) this.selected.push(item);
    },
    onCFMAccept() {
      this.$store.dispatch('nguoidung/reset_password')
    },
    onCFMCancel() {
      this.selected = []
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