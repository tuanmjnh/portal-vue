<template>
  <div>
    <v-card>
      <v-card-title>
        <v-text-field v-model="$store.state.permissions.pagination.search" append-icon="search"
          :label="$languages.get('global.search')" single-line hide-details></v-text-field>
        <v-spacer></v-spacer>
        <v-tooltip bottom>
          <v-btn flat icon slot="activator" color="primary" @click="$store.state.permissions.dialog=true">
            <v-icon>add</v-icon>
          </v-btn>
          <span>{{$languages.get('global.add')}}</span>
        </v-tooltip>
        <v-tooltip bottom v-if="$store.state.permissions.selected.length>0 && $store.state.permissions.pagination.find.flag===1">
          <v-btn flat icon slot="activator" color="danger" @click="onDelete()">
            <v-icon>delete</v-icon>
          </v-btn>
          <span>{{$languages.get('global.delete_selected')}}</span>
        </v-tooltip>
        <v-tooltip bottom v-if="$store.state.permissions.selected.length>0 && $store.state.permissions.pagination.find.flag===0">
          <v-btn flat icon slot="activator" color="info" @click="onDelete()">
            <v-icon>refresh</v-icon>
          </v-btn>
          <span>{{$languages.get('global.recover_selected')}}</span>
        </v-tooltip>
        <v-btn-toggle v-model="$store.state.permissions.pagination.toggle" mandatory>
          <v-tooltip bottom>
            <v-btn slot="activator" flat @click="$store.state.permissions.pagination.find.flag=1">
              <v-icon>view_list</v-icon>
            </v-btn>
            <span>{{$languages.get('global.using')}}</span>
          </v-tooltip>
          <v-tooltip bottom>
            <v-btn slot="activator" flat @click="$store.state.permissions.pagination.find.flag=0">
              <v-icon>delete</v-icon>
            </v-btn>
            <span>{{$languages.get('global.deleted')}}</span>
          </v-tooltip>
        </v-btn-toggle>
      </v-card-title>
      <v-data-table class="elevation-1" v-model="$store.state.permissions.selected"
        select-all item-key="id" :headers="$store.getters['permissions/headers']" :items="items"
        :rows-per-page-items="$store.state.$row_per_page" :rows-per-page-text="$languages.get('global.rows_per_page')"
        :pagination.sync="$store.state.permissions.pagination" :search="$store.state.permissions.pagination.search">
        <!--:loading="loading" :pagination.sync="pagination" :total-items="totalItems" -->
        <template slot="items" slot-scope="props">
          <tr>
            <td>
              <v-checkbox v-model="props.selected" primary hide-details></v-checkbox>
            </td>
            <!-- <td>{{ props.item.id }}</td> -->
            <td>{{ props.item.title }}</td>
            <td>{{ props.item.code }}</td>
            <td>{{ props.item.orders }}</td>
            <td>{{ props.item.created_at|formatDate('DD/MM/YYYY hh:mm') }}</td>
            <td class="justify-center layout px-0">
              <v-tooltip bottom>
                <v-btn flat icon slot="activator" color="teal" class="mx-0" @click="onEdit(props.item)">
                  <!-- @click="onEdit(props.item)" -->
                  <v-icon>edit</v-icon>
                </v-btn>
                <span>{{$languages.get('global.edit')}}</span>
              </v-tooltip>
              <v-tooltip bottom v-if="$store.state.permissions.pagination.find.flag===1">
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
              </v-tooltip>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card>
    <tpl-confirm :dialog.sync="$store.state.permissions.confirm" @onAccept="onCFMAccept"
      @onCancel="onCFMCancel" :title="$languages.get('global.message')"
      :content="$languages.get('messages.confirm_content')" :btnAcceptText="$languages.get('global.accept')"
      :btnCancelText="$languages.get('global.cancel')"></tpl-confirm>
  </div>
</template>

<script>
import confirm from '@/components/confirm'
export default {
  components: { 'tpl-confirm': confirm },
  computed: {
    items() {
      return this.$store.getters['permissions/getFilter']()
    }
  },
  methods: {
    onEdit(item) {
      this.$store.commit('permissions/SET_ITEM', item)
      this.$store.state.permissions.dialog = true
    },
    onDelete(item) {
      this.$store.state.permissions.confirm = true
      if (item) this.$store.state.permissions.selected.push(item)
    },
    onCFMAccept() {
      this.$store.dispatch('permissions/delete')
    },
    onCFMCancel() {
      this.$store.state.permissions.selected = []
    }
  }
}
</script>

<style>
</style>