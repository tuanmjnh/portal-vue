<template>
  <div>
    <v-card>
      <v-card-title>
        <v-layout wrap class="pt-2">
          <v-flex xs12 sm6 md6 class="mr-3">
            <v-text-field v-model="pagination.search" append-icon="search" :label="$store.getters.languages('global.search')"
              single-line hide-details></v-text-field>
          </v-flex>
          <v-spacer></v-spacer>
          <v-flex xs12 sm5 md5 class="mr-3">
            <v-select :items="db_donvi" v-model="$store.state.nguoidung.donvi_id"
              :hide-selected="true" item-text="ten_donvi" item-value="donvi_id" :label="$store.getters.languages(['global.local'])"></v-select>
          </v-flex>
          <!-- <v-tooltip bottom>
            <v-btn flat icon slot="activator" color="primary" @click="$store.state.nguoidung.dialog=true">
              <v-icon>add</v-icon>
            </v-btn>
            <span>{{$store.getters.languages('global.add')}}</span>
          </v-tooltip>
          <v-tooltip bottom v-if="$store.state.nguoidung.selected.length>0 && pagination.find.trangthai===1">
            <v-btn flat icon slot="activator" color="danger" @click="onDelete()">
              <v-icon>delete</v-icon>
            </v-btn>
            <span>{{$store.getters.languages('global.delete_selected')}}</span>
          </v-tooltip>
          <v-tooltip bottom v-if="$store.state.nguoidung.selected.length>0 && pagination.find.trangthai===0">
            <v-btn flat icon slot="activator" color="info" @click="onDelete()">
              <v-icon>refresh</v-icon>
            </v-btn>
            <span>{{$store.getters.languages('global.recover_selected')}}</span>
          </v-tooltip> -->
        </v-layout>
        <!-- <v-btn-toggle v-model="toggle_one" mandatory>
          <v-tooltip bottom>
            <v-btn slot="activator" flat @click="pagination.find.trangthai=1">
              <v-icon>view_list</v-icon>
            </v-btn>
            <span>{{$store.getters.languages('global.using')}}</span>
          </v-tooltip>
          <v-tooltip bottom>
            <v-btn slot="activator" flat @click="pagination.find.trangthai=0">
              <v-icon>delete</v-icon>
            </v-btn>
            <span>{{$store.getters.languages('global.deleted')}}</span>
          </v-tooltip>
        </v-btn-toggle> -->
      </v-card-title>
      <v-data-table class="elevation-1" v-model="$store.state.nguoidung.selected"
        item-key="nguoidung_id" :headers="headers" :items="items" :rows-per-page-items="rowPerPage"
        :rows-per-page-text="$store.getters.languages('global.rows_per_page')"
        :pagination.sync="pagination" :search="pagination.search">
        <!--:loading="loading" :pagination.sync="pagination" :total-items="totalItems" -->
        <template slot="items" slot-scope="props">
          <tr>
            <td>{{ props.item.ma_nd }}</td>
            <td>{{ props.item.ten_nd }}</td>
            <td>{{ props.item.so_dt }}</td>
            <td>{{ props.item.email }}</td>
            <td><v-chip :color="JSON.parse(props.item.color).cover" :text-color="JSON.parse(props.item.color).text" small>{{ props.item.roles_name }}</v-chip></td>
            <td class="justify-center layout px-0">
              <v-tooltip bottom>
                <v-btn flat icon slot="activator" color="warning" class="mx-0" @click="changePassword(props.item)">
                  <v-icon>restore</v-icon>
                </v-btn>
                <span>{{$store.getters.languages('global.reset_password')}}</span>
              </v-tooltip>
              <!-- <v-tooltip bottom>
                <v-btn flat icon slot="activator" color="teal" class="mx-0" @click="onEdit(props.item)">
                  <v-icon>edit</v-icon>
                </v-btn>
                <span>{{$store.getters.languages('global.edit')}}</span>
              </v-tooltip>
              <v-tooltip bottom v-if="pagination.find.trangthai===1">
                <v-btn flat icon slot="activator" color="error" class="mx-0" @click="onDelete(props.item)">
                  <v-icon>delete</v-icon>
                </v-btn>
                <span>{{$store.getters.languages('global.delete')}}</span>
              </v-tooltip>
              <v-tooltip bottom v-else>
                <v-btn flat icon slot="activator" color="info" class="mx-0" @click="onDelete(props.item)">
                  <v-icon>refresh</v-icon>
                </v-btn>
                <span>{{$store.getters.languages('global.recover')}}</span>
              </v-tooltip> -->
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card>
    <tpl-confirm :dialog.sync="confirmDialog" @onAccept="onCFMAccept" @onCancel="onCFMCancel"
      :title="$store.getters.languages('global.message')" :content="$store.getters.languages('messages.confirm_content')"
      :btnAcceptText="$store.getters.languages('global.accept')" :btnCancelText="$store.getters.languages('global.cancel')" />
  </div>
</template>

<script>
import confirm from '@/components/confirm'
export default {
  components: { 'tpl-confirm': confirm },
  data: () => {
    return {
      selected: [],
      donvi_id: null,
      toggle_one: 0,
      confirmDialog: false,
      pagination: { search: '', sortBy: 'created_at', direction: false, find: { trangthai: 1 } },
      rowPerPage: [10, 25, 50, 100, 200, 500], //  { text: "All", value: -1 }
      headers: [
        { text: 'nguoidung.username', value: 'ma_nd' },
        { text: 'nguoidung.full_name', value: 'ten_nd' },
        { text: 'nguoidung.mobile', value: 'so_dt' },
        { text: 'nguoidung.email', value: 'email' },
        { text: 'global.roles', value: 'roles_name' },
        { text: '#', value: '#', sortable: false }
      ]
    }
  },
  created() {
    this.headers.forEach(e => { e.text = this.$store.getters.languages(e.text) });
    if (this.$store.state.nguoidung.isGetFirst) this.$store.dispatch('nguoidung/select', true)
    if (this.$store.state.db_donvi.isGetFirst) this.$store.dispatch('db_donvi/select', true)
  },
  computed: {
    items() {
      var rs = this.$store.getters['nguoidung/getFilterDonvi'](this.pagination)
      return rs
    },
    db_donvi() {
      var rs = this.$store.getters['db_donvi/getFilter']({ sortBy: 'ma_dvi' })
      return [...[{ donvi_id: 0, ten_donvi: '-- Tất cả --' }], ...rs] //.unshift({ donvi_id: 0, ten_donvi: '-- Tất cả --' })
    }
  },
  methods: {
    changePassword(item) {
      this.confirmDialog = !this.confirmDialog
      if (item) this.$store.state.nguoidung.selected.push(item);
    },
    onEdit(item) {
      this.$store.dispatch('nguoidung/item', item)
      this.$store.state.nguoidung.dialog = true
    },
    onDelete(item) {
      this.confirmDialog = !this.confirmDialog
      if (item) this.$store.state.nguoidung.selected.push(item);
    },
    onCFMAccept() {
      this.$store.dispatch('nguoidung/reset_password')
    },
    onCFMCancel() {
      this.$store.state.nguoidung.selected = []
    }
  }
}
</script>

<style>
</style>