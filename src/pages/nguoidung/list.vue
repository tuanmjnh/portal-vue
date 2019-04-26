<template>
  <div>
    <v-card>
      <v-card-title>
        <v-layout wrap class="pt-2">
          <v-flex xs6 sm3 md3 class="mr-3">
            <v-select :items="donvi" v-model="$store.state.nguoidung.donvi_id"
              :hide-selected="true" item-text="ten_dv" item-value="donvi_id" :label="$store.getters.languages('global.local')"></v-select>
          </v-flex>
          <v-flex xs6 sm5 md5>
            <v-text-field v-model="$store.state.nguoidung.pagination.search" append-icon="search"
              :label="$store.getters.languages('global.search')" single-line hide-details></v-text-field>
          </v-flex>
          <v-spacer></v-spacer>
          <v-tooltip bottom>
            <v-btn flat icon slot="activator" color="primary" @click="$router.push('/nguoidung/set-roles')">
              <v-icon>how_to_reg</v-icon>
            </v-btn>
            <span>{{$store.getters.languages('nguoidung.set_roles')}}</span>
          </v-tooltip>
          <!-- <v-tooltip bottom v-if="$store.state.nguoidung.selected.length>0 && $store.state.nguoidung.pagination.find.trangthai===1">
            <v-btn flat icon slot="activator" color="danger" @click="onDelete()">
              <v-icon>delete</v-icon>
            </v-btn>
            <span>{{$store.getters.languages('global.delete_selected')}}</span>
          </v-tooltip>
          <v-tooltip bottom v-if="$store.state.nguoidung.selected.length>0 && $store.state.nguoidung.pagination.find.trangthai===0">
            <v-btn flat icon slot="activator" color="info" @click="onDelete()">
              <v-icon>refresh</v-icon>
            </v-btn>
            <span>{{$store.getters.languages('global.recover_selected')}}</span>
          </v-tooltip> -->
        </v-layout>
        <!-- <v-btn-toggle v-model="toggle_one" mandatory>
          <v-tooltip bottom>
            <v-btn slot="activator" flat @click="$store.state.nguoidung.pagination.find.trangthai=1">
              <v-icon>view_list</v-icon>
            </v-btn>
            <span>{{$store.getters.languages('global.using')}}</span>
          </v-tooltip>
          <v-tooltip bottom>
            <v-btn slot="activator" flat @click="$store.state.nguoidung.pagination.find.trangthai=0">
              <v-icon>delete</v-icon>
            </v-btn>
            <span>{{$store.getters.languages('global.deleted')}}</span>
          </v-tooltip>
        </v-btn-toggle> -->
      </v-card-title>
      <v-data-table class="elevation-1" v-model="$store.state.nguoidung.selected"
        item-key="nguoidung_id" :headers="$store.getters['nguoidung/headers']" :items="items"
        :rows-per-page-items="$store.state.$row_per_page" :rows-per-page-text="$store.getters.languages('global.rows_per_page')"
        :pagination.sync="$store.state.nguoidung.pagination" :search="$store.state.nguoidung.pagination.search">
        <!--:loading="loading" :total-items="totalItems" -->
        <template slot="items" slot-scope="props">
          <tr>
            <td>{{ props.item.ma_nd }}</td>
            <td>{{ props.item.ten_nd }}</td>
            <td>{{ props.item.so_dt }}</td>
            <td>{{ props.item.email }}</td>
            <td>
              <v-chip small :color="getColor(props.item,'cover')" :text-color="getColor(props.item,'text')">
                {{
                props.item.roles_name?props.item.roles_name:$store.getters.languages('global.undefined')
                }}
              </v-chip>
            </td>
            <td class="justify-center layout px-0">
              <v-tooltip bottom>
                <v-btn flat icon slot="activator" color="warning" class="mx-0" @click="changePassword(props.item)">
                  <v-icon>restore</v-icon>
                </v-btn>
                <span>{{$store.getters.languages('global.reset_password')}}</span>
              </v-tooltip>
              <!-- <v-tooltip bottom>
                <v-btn flat icon slot="activator" colofr="teal" class="mx-0" @click="onEdit(props.item)">
                  <v-icon>edit</v-icon>
                </v-btn>
                <span>{{$store.getters.languages('global.edit')}}</span>
              </v-tooltip>
              <v-tooltip bottom v-if="$store.state.nguoidung.pagination.find.trangthai===1">
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
    <tpl-confirm :dialog.sync="$store.state.nguoidung.confirm" @onAccept="onCFMAccept"
      @onCancel="onCFMCancel" :title="$store.getters.languages('global.message')"
      :content="$store.getters.languages('messages.confirm_content')" :btnAcceptText="$store.getters.languages('global.accept')"
      :btnCancelText="$store.getters.languages('global.cancel')" />
  </div>
</template>

<script>
import confirm from '@/components/confirm'
export default {
  components: { 'tpl-confirm': confirm },
  computed: {
    items() {
      var rs = this.$store.getters['nguoidung/getFilterDonvi']//({ find: { trangthai: 1, donvi_id: this.$store.state.nguoidung.donvi_id } })
      //console.log(rs)
      return rs
    },
    donvi() {
      var rs = this.$store.getters['donvi/getFilter']({ sortBy: 'ma_dvi' })
      return [...[{ donvi_id: 0, ten_dv: this.$store.getters.languages('global.select_all') }], ...rs] //.unshift({ donvi_id: 0, ten_donvi: '-- Tất cả --' })
    }
  },
  methods: {
    changePassword(item) {
      this.$store.state.nguoidung.confirm = true
      if (item) this.$store.state.nguoidung.selected.push(item);
    },
    onEdit(item) {
      this.$store.commit('nguoidung/SET_ITEM', item)
      this.$store.state.nguoidung.dialog = true
    },
    onDelete(item) {
      this.$store.state.nguoidung.confirm = true
      if (item) this.$store.state.nguoidung.selected.push(item);
    },
    onCFMAccept() {
      this.$store.dispatch('nguoidung/reset_password')
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