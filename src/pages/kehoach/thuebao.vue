<template>
  <div>
    <v-card>
      <v-form v-model="valid" ref="form">
        <v-card-title>
          <v-layout wrap>
            <v-flex xs12 sm5 md5>
              <v-select :items="nguoidung" v-model="$store.state.kehoach.thuebao_nguoidung.nguoidung_id"
                item-value="ma_nv" item-text="ten_nv" :hide-selected="true" label="Nhân viên"
                :rules="[v=>v&&v.length>0||$store.getters.languages('error.required_select')]"></v-select>
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
      <v-card-title>
        <span class="title">Danh sách thuê bao kế hoạch</span>
        <v-spacer></v-spacer>
        <v-tooltip bottom>
          <v-btn slot="activator" flat icon color="primary" @click="$store.state.kehoach.dialog=true">
            <v-icon>filter_list</v-icon>
          </v-btn>
          <span>{{$store.getters.languages('global.filter_data')}}</span>
        </v-tooltip>
        <export-data :getData="getDataExport" :tooltip="$store.getters.languages('global.export')"
          color="success" :items="[{title:$store.getters.languages(['global.export',' ',' .csv']),type:'csv'}]" />
        <v-dialog v-model="$store.state.kehoach.dialog" max-width="600px" persistent>
          <v-card>
            <v-card-title class="headline grey lighten-2">
              {{$store.getters.languages('global.filter_data')}}
            </v-card-title>
            <v-card-text>
              <v-layout wrap>
                <v-flex xs12 sm12 md12 v-if="this.$store.getters['auth/inRoles']('donvi.select')">
                  <v-select :items="donvi" v-model="$store.state.kehoach.pagination.donvi_id"
                    :hide-selected="true" item-text="ten_dv" item-value="donvi_id" :label="$store.getters.languages('global.local')"></v-select>
                </v-flex>
                <v-flex xs12 sm12 md12>
                  <v-select :items="nhom_kh" v-model="$store.state.kehoach.pagination.nhomkh_id"
                    :hide-selected="true" item-text="title" item-value="id" label="Nhóm kế hoạch"></v-select>
                </v-flex>
                <v-flex xs12 sm12 md12>
                  <v-text-field v-model="$store.state.kehoach.pagination.search"
                    append-icon="search" :label="$store.getters.languages('global.search')"
                    single-line hide-details></v-text-field>
                </v-flex>
              </v-layout>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <!-- <v-btn color="primary" flat @click.native="onSave">
                {{$store.getters.languages('global.accept')}}
              </v-btn> -->
              <v-btn color="primary" flat @click.native="$store.state.kehoach.dialog=false">
                {{$store.getters.languages('global.back')}}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <!-- <v-tooltip bottom>
          <v-btn flat icon slot="activator" color="primary" @click="$store.state.kehoach.dialog=true">
            <v-icon>add</v-icon>
          </v-btn>
          <span>{{$store.getters.languages('global.add')}}</span>
        </v-tooltip> -->
        <!-- <v-tooltip bottom v-if="$store.state.kehoach.selected.length>0 && $store.state.kehoach.pagination.flag===1">
          <v-btn flat icon slot="activator" color="danger" @click="onDelete()">
            <v-icon>delete</v-icon>
          </v-btn>
          <span>{{$store.getters.languages('global.delete_selected')}}</span>
        </v-tooltip>
        <v-tooltip bottom v-if="$store.state.kehoach.selected.length>0 && $store.state.kehoach.pagination.flag===0">
          <v-btn flat icon slot="activator" color="info" @click="onDelete()">
            <v-icon>refresh</v-icon>
          </v-btn>
          <span>{{$store.getters.languages('global.recover_selected')}}</span>
        </v-tooltip> -->

        <!-- <v-btn-toggle v-model="$store.state.kehoach.pagination.toggle" mandatory>
          <v-tooltip bottom>
            <v-btn slot="activator" flat @click="$store.state.kehoach.pagination.flag=1">
              <v-icon>view_list</v-icon>
            </v-btn>
            <span>{{$store.getters.languages('global.using')}}</span>
          </v-tooltip>
          <v-tooltip bottom>
            <v-btn slot="activator" flat @click="$store.state.kehoach.pagination.flag=0">
              <v-icon>delete</v-icon>
            </v-btn>
            <span>{{$store.getters.languages('global.deleted')}}</span>
          </v-tooltip>
        </v-btn-toggle> -->
      </v-card-title>
      <!-- <v-form ref="form" v-model="valid" lazy-validation> -->
      <v-data-table class="elevation-1" v-model="$store.state.kehoach.selected"
        select-all item-key="id" :headers="headers" :items="items" :rows-per-page-items="[10, 25, 50, 100, 200, 500]"
        :rows-per-page-text="$store.getters.languages('global.rows_per_page')"
        :pagination.sync="$store.state.kehoach.pagination" :loading="$store.state.$loadingGet"
        :total-items="$store.state.kehoach.totalItems">
        <!--:loading="loading" :pagination.sync="pagination" :total-items="totalItems" -->
        <template slot="items" slot-scope="props">
          <tr>
            <td>
              <v-checkbox v-model="props.selected" primary hide-details></v-checkbox>
            </td>
            <td>{{ props.item.ma_tb }}</td>
            <td>{{ props.item.ten_tb }}</td>
            <td>{{ props.item.so_dt }}</td>
            <td>{{ props.item.thang_bd }}</td>
            <td>{{ props.item.thang_kt }}</td>
            <td class="justify-center layout px-0">
              <v-tooltip bottom>
                <v-btn flat icon slot="activator" color="teal" class="mx-0" @click="onEdit(props.item)">
                  <v-icon>edit</v-icon>
                </v-btn>
                <span>{{$store.getters.languages('global.edit')}}</span>
              </v-tooltip>
              <v-tooltip bottom v-if="$store.state.kehoach.pagination.flag===1">
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
              </v-tooltip>
            </td>
          </tr>
        </template>
      </v-data-table>
      <!-- </v-form> -->
    </v-card>
    <tpl-confirm :dialog="confirm" @onAccept="onCFMAccept" @onCancel="onCFMCancel" :title="$store.getters.languages('global.message')"
      :content="$store.getters.languages('messages.confirm_content')" :btnAcceptText="$store.getters.languages('global.accept')"
      :btnCancelText="$store.getters.languages('global.cancel')"></tpl-confirm>
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
  data: () => ({
    confirm: false,
    valid: false,
    headers: [
      { text: 'Mã TB', value: 'ma_tb', align: 'left' },
      { text: 'Tên TB', value: 'ten_tb' },
      { text: 'Số ĐT', value: 'so_dt' },
      { text: 'Tháng BĐ', value: 'thang_bd' },
      { text: 'Tháng KT', value: 'thang_kt' },
      { text: '#', value: '#', sortable: false },
    ]
  }),
  created() {
    const $this = this
    if ($this.$store.state.donvi.items < 1)
      $this.$store.dispatch('donvi/select', false, null, false)
    $this.$store.dispatch('kehoach/GetNguoidung', { loading: false })
  },
  mounted() {
    this.headers.forEach(e => { e.text = this.$store.getters.languages(e.text) })
  },
  computed: {
    items() {
      return this.$store.state.kehoach.kehoach_tb
    },
    pagination() {
      return this.$store.state.kehoach.pagination
    },
    donvi() {
      const rs = this.$store.getters['donvi/getFilter']({ sortBy: 'ma_dvi' })
      return [
        ...[{ donvi_id: 0, ten_dv: this.$store.getters.languages('global.select_all') }],
        ...rs
      ]
    },
    nhom_kh() {
      const rs = this.$store.getters['kehoach/getNhomKH']
      return [
        ...[{ id: 0, title: this.$store.getters.languages('global.select_all') }],
        ...rs
      ]
    },
    nguoidung() {
      return this.$store.state.kehoach.nguoidung
    }
  },
  watch: {
    pagination: {
      handler(val) {
        this.$store.dispatch('kehoach/select')
      },
      deep: true
    },
  },
  methods: {
    onEdit(item) {
      this.$store.commit('kehoach/SET_ITEM', item)
      this.$store.state.kehoach.dialog = true
    },
    onDelete(item) {
      this.confirm = true
      if (item) this.$store.state.kehoach.selected.push(item);
    },
    onCFMAccept() {
      this.$store.dispatch('kehoach/delete')
    },
    onCFMCancel() {
      this.$store.state.kehoach.selected = []
    },
    getDataExport() {
      let params = { ...this.$store.state.kehoach.pagination }
      params.sortBy = 'ten_dv,title,thang_bd'
      params.loading = true
      params.isExport = true
      return this.$store.dispatch('kehoach/export_data', params)
    },
    onSave() {

    }
  }
}
</script>

<style>
</style>