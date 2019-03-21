<template>
  <div>
    <v-card>
      <v-card-title>
        <v-text-field v-model="pagination.search" append-icon="search" :label="$store.getters.languages(['global.search'])"
          single-line hide-details></v-text-field>
        <v-spacer></v-spacer>
        <v-tooltip bottom>
          <v-btn flat icon slot="activator" color="primary" @click="$store.state.roles.dialog=true">
            <v-icon>add</v-icon>
          </v-btn>
          <span>{{$store.getters.languages(['global.add'])}}</span>
        </v-tooltip>
        <v-tooltip bottom v-if="$store.state.roles.selected.length>0 && pagination.find.flag===1">
          <v-btn flat icon slot="activator" color="danger" @click="onDelete()">
            <v-icon>delete</v-icon>
          </v-btn>
          <span>{{$store.getters.languages('global.delete_selected')}}</span>
        </v-tooltip>
        <v-tooltip bottom v-if="$store.state.roles.selected.length>0 && pagination.find.flag===0">
          <v-btn flat icon slot="activator" color="info" @click="onDelete()">
            <v-icon>refresh</v-icon>
          </v-btn>
          <span>{{$store.getters.languages('global.recover_selected')}}</span>
        </v-tooltip>
        <v-btn-toggle v-model="toggle_one" mandatory>
          <v-tooltip bottom>
            <v-btn slot="activator" flat @click="pagination.find.flag=1">
              <v-icon>view_list</v-icon>
            </v-btn>
            <span>{{$store.getters.languages(['global.using'])}}</span>
          </v-tooltip>
          <v-tooltip bottom>
            <v-btn slot="activator" flat @click="pagination.find.flag=0">
              <v-icon>delete</v-icon>
            </v-btn>
            <span>{{$store.getters.languages(['global.deleted'])}}</span>
          </v-tooltip>
        </v-btn-toggle>
      </v-card-title>
      <!-- <v-form ref="form" v-model="valid" lazy-validation> -->
      <v-data-table class="elevation-1" v-model="$store.state.roles.selected" select-all
        item-key="id" :headers="headers" :items="items" :rows-per-page-items="rowPerPage"
        :rows-per-page-text="$store.getters.languages(['global.rows_per_page'])"
        :pagination.sync="pagination" :search="pagination.search">
        <!--:loading="loading" :pagination.sync="pagination" :total-items="totalItems" -->
        <template slot="items" slot-scope="props">
          <tr>
            <td>
              <v-checkbox v-model="props.selected" primary hide-details></v-checkbox>
            </td>
            <!-- <td>{{ props.item.id }}</td> -->
            <td>{{ props.item.name }}</td>
            <td>{{ props.item.orders }}</td>
            <td>{{ props.item.created_at|formatDate('DD/MM/YYYY hh:mm') }}</td>
            <td class="justify-center layout px-0">
              <v-tooltip bottom>
                <v-btn flat icon slot="activator" color="teal" class="mx-0" @click="onEdit(props.item)">
                  <v-icon>edit</v-icon>
                </v-btn>
                <span>{{$store.getters.languages(['global.edit'])}}</span>
              </v-tooltip>
              <v-tooltip bottom v-if="pagination.find.flag===1">
                <v-btn flat icon slot="activator" color="error" class="mx-0" @click="onDelete(props.item)">
                  <v-icon>delete</v-icon>
                </v-btn>
                <span>{{$store.getters.languages(['global.delete'])}}</span>
              </v-tooltip>
              <v-tooltip bottom v-else>
                <v-btn flat icon slot="activator" color="info" class="mx-0" @click="onDelete(props.item)">
                  <v-icon>refresh</v-icon>
                </v-btn>
                <span>{{$store.getters.languages(['global.recover'])}}</span>
              </v-tooltip>
            </td>
          </tr>
        </template>
      </v-data-table>
      <!-- </v-form> -->
    </v-card>
    <tpl-confirm :dialog="confirmDialog" @onAccept="onCFMAccept" @onCancel="onCFMCancel"
      :title="$store.getters.languages(['global.message'])" :content="$store.getters.languages(['messages.confirm_content'])"
      :btnAcceptText="$store.getters.languages(['global.accept'])" :btnCancelText="$store.getters.languages(['global.cancel'])"></tpl-confirm>
  </div>
</template>

<script>
import confirm from '@/components/confirm'
export default {
  components: { 'tpl-confirm': confirm },
  data: () => ({
    toggle_one: 0,
    confirmDialog: false,
    rowPerPage: [10, 25, 50, 100, 200, 500], //  { text: "All", value: -1 }
    pagination: { search: '', sortBy: 'orders', find: { flag: 1 } },
    headers: [
      // { text: 'ID', value: 'id', align: 'left' },
      { text: 'roles.name', value: 'name', align: 'left' },
      { text: 'global.orders', value: 'orders', sortable: true },
      { text: 'global.created_at', value: 'created_at', sortable: true },
      { text: '#', value: '#', sortable: false }
    ]
  }),
  created() {
    this.headers.forEach(e => { e.text = this.$store.getters.languages([e.text]) });
    if (this.$store.state.roles.isGetFirst) this.$store.dispatch('roles/select', true)
  },
  computed: {
    items() {
      var rs = JSON.parse(JSON.stringify(this.$store.getters['roles/getFilter'](this.pagination)))
      return rs
    }
  },
  methods: {
    onItems(item) {
      this.$store.dispatch('roles/item', item)
      // this.$store.state.roles.dialog=true
    },
    onEdit(item) {
      this.$store.dispatch('roles/item', item)
      this.$store.state.roles.dialog=true
    },
    onDelete(item) {
      this.confirmDialog = !this.confirmDialog
      if (item) this.$store.state.roles.selected.push(item);
    },
    onCFMAccept() {
      this.$store.dispatch('roles/delete')
    },
    onCFMCancel() {
      this.$store.state.roles.selected = []
    }
  }
}
</script>

<style>
</style>