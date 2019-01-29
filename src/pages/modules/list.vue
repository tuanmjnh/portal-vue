<template>
  <div>
    <v-card>
      <v-card-title>
        <v-text-field v-model="pagination.search" append-icon="search" label="Search"
          single-line hide-details></v-text-field>
        <v-spacer></v-spacer>
        <v-tooltip bottom>
          <v-btn slot="activator" color="primary" small fab flat @click="localDialog=!localDialog">
            <i class="material-icons">add</i>
          </v-btn>
          <span>Add</span>
        </v-tooltip>
        <v-btn-toggle v-model="toggle_one" mandatory>
          <v-tooltip bottom>
            <v-btn slot="activator" flat @click="pagination.find.flag=1">
              <i class="material-icons">view_list</i>
            </v-btn>
            <span>List use</span>
          </v-tooltip>
          <v-tooltip bottom>
            <v-btn slot="activator" flat @click="pagination.find.flag=0">
              <i class="material-icons">delete</i>
            </v-btn>
            <span>List delete</span>
          </v-tooltip>
        </v-btn-toggle>
      </v-card-title>
      <v-data-table class="elevation-1" v-model="selected" select-all item-key="id"
        :headers="headers" :items="items" :rows-per-page-items="rowPerPage"
        :pagination.sync="pagination" :search="pagination.search">
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
            <td v-html="props.item.icon"></td>
            <td class="justify-center layout px-0">
              <v-btn v-if="pagination.find.flag===1" icon class="mx-0" @click="onItems(props.item)">
                <i class="material-icons info--text">layers</i>
              </v-btn>
              <v-btn icon class="mx-0" @click="onEdit(props.item)">
                <i class="material-icons teal--text">edit</i>
              </v-btn>
              <v-btn icon class="mx-0" @click="onDelete(props.item)">
                <i v-if="pagination.find.flag===1" class="material-icons error--text">delete</i>
                <i v-else class="material-icons info--text">refresh</i>
              </v-btn>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card>
    <tpl-confirm :dialog="confirmDialog" @ok="onOkConfirm" @cancel="onCancelConfirm"></tpl-confirm>
  </div>
</template>

<script>
import confirm from '@/components/confirm'
export default {
  components: { 'tpl-confirm': confirm },
  props: {
    dialog: { type: Boolean, default: false },
    itemsDialog: { type: Boolean, default: false },
  },
  data: () => ({
    loading: true,
    selected: [],
    toggle_one: 0,
    localDialog: false,
    localItemsDialog: false,
    confirmDialog: false,
    rowPerPage: [10, 25, 50, 100, 200, 500], //  { text: "All", value: -1 }
    pagination: { search: '', sortBy: 'orders', find: { flag: 1 } },
    headers: [
      // { text: 'ID', value: 'id', align: 'left' },
      { text: 'Title', value: 'title', align: 'left' },
      { text: 'Code', value: 'code', align: 'left' },
      { text: 'Orders', value: 'orders', sortable: true },
      { text: 'Created', value: 'created_at' },
      { text: 'Icon', value: 'icon' },
      { text: '#', value: '#', sortable: false }
    ]
  }),
  mounted() {
  },
  created() {
    this.$store.dispatch('modules/select').then(this.loading = false)
  },
  computed: {
    items() {
      var rs = this.$store.getters['modules/getFilter'](this.pagination)
      return rs
    }
  },
  watch: {
    dialog(val) { this.localDialog = val },
    localDialog(val) {
      this.$emit('handleDialog', val)
      if (!val) this.$store.dispatch('modules/item')
    },
    itemsDialog(val) { this.localItemsDialog = val },
    localItemsDialog(val) { this.$emit('handleItemsDialog', val) }
  },
  methods: {
    onItems(item) {
      this.$store.dispatch('modules/item', item)
      this.localItemsDialog = !this.localItemsDialog
    },
    onEdit(item) {
      this.$store.dispatch('modules/item', item)
      this.localDialog = true
    },
    onDelete(item) {
      this.confirmDialog = !this.confirmDialog
      this.selected.push(item);
    },
    onOkConfirm() {
      this.$store.dispatch('modules/delete', this.selected).then(this.selected = [])
    },
    onCancelConfirm() {
      this.selected = []
    }
  }
}
</script>

<style>
</style>