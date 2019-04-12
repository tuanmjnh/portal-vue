<template>
  <div>
    <v-card>
      <v-card-title>
        <v-layout wrap class="pt-2">
          <v-flex xs12 sm4 md4 class="mr-3">
            <v-select :items="db_donvi" v-model="$store.state.users.donvi_id"
              :hide-selected="true" item-text="ten_donvi" item-value="donvi_id" :label="$store.getters.languages(['global.local'])"></v-select>
          </v-flex>
          <v-flex xs12 sm4 md4 class="mr-3">
            <v-text-field v-model="$store.state.users.pagination.search"
              append-icon="search" :label="$store.getters.languages('global.search')"
              single-line hide-details></v-text-field>
          </v-flex>
          <v-spacer></v-spacer>
          <v-tooltip bottom>
            <v-btn flat icon slot="activator" color="primary" @click="$store.state.navigation.dialog=true">
              <v-icon>add</v-icon>
            </v-btn>
            <span>{{$store.getters.languages('global.add')}}</span>
          </v-tooltip>
          <v-tooltip bottom v-if="$store.state.users.selected.length>0 && $store.state.users.pagination.find.flag===1">
            <v-btn flat icon slot="activator" color="danger" @click="onDelete()">
              <v-icon>delete</v-icon>
            </v-btn>
            <span>{{$store.getters.languages('global.delete_selected')}}</span>
          </v-tooltip>
          <v-tooltip bottom v-if="$store.state.users.selected.length>0 && $store.state.users.pagination.find.flag===0">
            <v-btn flat icon slot="activator" color="info" @click="onDelete()">
              <v-icon>refresh</v-icon>
            </v-btn>
            <span>{{$store.getters.languages('global.recover_selected')}}</span>
          </v-tooltip>
        </v-layout>
        <v-btn-toggle v-model="$store.state.navigation.pagination.toggle" mandatory>
          <v-tooltip bottom>
            <v-btn slot="activator" flat @click="$store.state.users.pagination.find.flag=1">
              <v-icon>view_list</v-icon>
            </v-btn>
            <span>{{$store.getters.languages('global.using')}}</span>
          </v-tooltip>
          <v-tooltip bottom>
            <v-btn slot="activator" flat @click="$store.state.users.pagination.find.flag=0">
              <v-icon>delete</v-icon>
            </v-btn>
            <span>{{$store.getters.languages('global.deleted')}}</span>
          </v-tooltip>
        </v-btn-toggle>
      </v-card-title>
      <v-data-table class="elevation-1" v-model="$store.state.users.selected" select-all
        item-key="user_id" :headers="$store.getters['users/headers']" :items="items"
        :rows-per-page-items="$store.state.$row_per_page" :rows-per-page-text="$store.getters.languages('global.rows_per_page')"
        :pagination.sync="$store.state.users.pagination" :search="$store.state.users.pagination.search">
        <!--:loading="loading" :pagination.sync="pagination" :total-items="totalItems" -->
        <template slot="items" slot-scope="props">
          <tr>
            <td>
              <v-checkbox v-model="props.selected" primary hide-details></v-checkbox>
            </td>
            <td>{{ props.item.username }}</td>
            <td>{{ props.item.full_name }}</td>
            <td>{{ props.item.mobile }}</td>
            <td>{{ props.item.email }}</td>
            <td class="justify-center layout px-0">
              <v-tooltip bottom>
                <v-btn flat icon slot="activator" color="teal" class="mx-0" @click="onEdit(props.item)">
                  <v-icon>edit</v-icon>
                </v-btn>
                <span>{{$store.getters.languages('global.edit')}}</span>
              </v-tooltip>
              <v-tooltip bottom v-if="$store.state.users.pagination.find.flag===1">
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
    </v-card>
    <tpl-confirm :dialog.sync="confirmDialog" @onAccept="onCFMAccept" @onCancel="onCFMCancel"
      :title="$store.getters.languages('global.message')" :content="$store.getters.languages('messages.confirm_content')"
      :btnAcceptText="$store.getters.languages('global.accept')" :btnCancelText="$store.getters.languages('global.cancel')"></tpl-confirm>
  </div>
</template>

<script>
import confirm from '@/components/confirm'
export default {
  components: { 'tpl-confirm': confirm },
  data: () => { },
  computed: {
    items() {
      return this.$store.getters['users/getFilterDonvi']
    },
    db_donvi() {
      var rs = this.$store.getters['db_donvi/getFilter']({ sortBy: 'ma_dvi' })
      return [...[{ donvi_id: 0, ten_donvi: '-- Tất cả --' }], ...rs] //.unshift({ donvi_id: 0, ten_donvi: '-- Tất cả --' })
    }
  },
  methods: {
    onEdit(item) {
      this.$store.dispatch('users/item', item)
      this.$store.state.users.dialog = true
    },
    onDelete(item) {
      this.$store.state.users.confirm = true
      if (item) this.$store.state.users.selected.push(item);
    },
    onCFMAccept() {
      this.$store.dispatch('users/delete')
    },
    onCFMCancel() {
      this.$store.state.users.selected = []
    }
  }
}
</script>

<style>
</style>