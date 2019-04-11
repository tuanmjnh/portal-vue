<template>
  <div>
    <v-card>
      <v-card-title>
        <v-text-field v-model="$store.state.permissions.pagination.search" append-icon="search"
          :label="$store.getters.languages('global.search')" single-line hide-details></v-text-field>
        <v-spacer></v-spacer>
        <v-tooltip bottom>
          <v-btn flat icon slot="activator" color="primary" @click="$router.push('add')">
            <v-icon>add</v-icon>
          </v-btn>
          <span>{{$store.getters.languages('global.add')}}</span>
        </v-tooltip>
        <v-tooltip bottom v-if="$store.state.permissions.selected.length>0 && $store.state.permissions.pagination.find.flag===1">
          <v-btn flat icon slot="activator" color="danger" @click="onDelete()">
            <v-icon>delete</v-icon>
          </v-btn>
          <span>{{$store.getters.languages('global.delete_selected')}}</span>
        </v-tooltip>
        <v-tooltip bottom v-if="$store.state.permissions.selected.length>0 && $store.state.permissions.pagination.find.flag===0">
          <v-btn flat icon slot="activator" color="info" @click="onDelete()">
            <v-icon>refresh</v-icon>
          </v-btn>
          <span>{{$store.getters.languages('global.recover_selected')}}</span>
        </v-tooltip>
        <v-btn-toggle v-model="$store.state.permissions.pagination.toggle" mandatory>
          <v-tooltip bottom>
            <v-btn slot="activator" flat @click="$store.state.permissions.pagination.find.flag=1">
              <v-icon>view_list</v-icon>
            </v-btn>
            <span>{{$store.getters.languages('global.using')}}</span>
          </v-tooltip>
          <v-tooltip bottom>
            <v-btn slot="activator" flat @click="$store.state.permissions.pagination.find.flag=0">
              <v-icon>delete</v-icon>
            </v-btn>
            <span>{{$store.getters.languages('global.deleted')}}</span>
          </v-tooltip>
        </v-btn-toggle>
      </v-card-title>
      <v-data-table class="elevation-1" v-model="$store.state.permissions.selected"
        select-all item-key="id" :headers="$store.getters['permissions/headers']" :items="items"
        :rows-per-page-items="$store.state.permissions.rowPerPage" :rows-per-page-text="$store.getters.languages('global.rows_per_page')"
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
                <v-btn flat icon slot="activator" color="teal" class="mx-0" @click="$router.push(`add/${props.item.id}`)">
                  <!-- @click="onEdit(props.item)" -->
                  <v-icon>edit</v-icon>
                </v-btn>
                <span>{{$store.getters.languages('global.edit')}}</span>
              </v-tooltip>
              <v-tooltip bottom v-if="$store.state.permissions.pagination.find.flag===1">
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
    <tpl-confirm :dialog.sync="$store.state.permissions.confirm" @onAccept="onCFMAccept"
      @onCancel="onCFMCancel" :title="$store.getters.languages('global.message')"
      :content="$store.getters.languages('messages.confirm_content')" :btnAcceptText="$store.getters.languages('global.accept')"
      :btnCancelText="$store.getters.languages('global.cancel')"></tpl-confirm>
  </div>
</template>

<script>
import confirm from '@/components/confirm'
export default {
  components: { 'tpl-confirm': confirm },
  computed: {
    items() {
      var rs = this.$store.getters['permissions/getFilter'](this.$store.state.permissions.pagination)
      return rs
    }
  },
  methods: {
    onEdit(item) {
      this.$store.dispatch('permissions/item', item)
      this.$router.push(`add/${item.id}`)
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