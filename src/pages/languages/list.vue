<template>
  <div>
    <v-card>
      <v-card-title>
        <v-text-field v-model="pagination.search" append-icon="search" label="Search" single-line hide-details></v-text-field>
        <v-spacer></v-spacer>
        <v-tooltip bottom>
          <v-btn slot="activator" color="primary" small fab flat @click="localDialog=!localDialog">
            <i class="material-icons">add</i>
          </v-btn>
          <span>Add</span>
        </v-tooltip>
        <v-btn-toggle v-model="toggle_one" mandatory>
          <v-tooltip bottom>
            <v-btn slot="activator" flat @click="pagination.flag=1">
              <i class="material-icons">view_list</i>
            </v-btn>
            <span>List use</span>
          </v-tooltip>
          <v-tooltip bottom>
            <v-btn slot="activator" flat @click="pagination.flag=0">
              <i class="material-icons">delete</i>
            </v-btn>
            <span>List delete</span>
          </v-tooltip>
        </v-btn-toggle>
      </v-card-title>
      <v-data-table class="elevation-1" v-model="selected" select-all item-key="id" :headers="headers"
        :items="items" :rows-per-page-items="rowPerPage" :pagination.sync="pagination" :search="pagination.search">
        <!--:loading="loading" :pagination.sync="pagination" :total-items="totalItems" -->
        <template slot="items" slot-scope="props">
          <tr>
            <td>
              <v-checkbox v-model="props.selected" primary hide-details></v-checkbox>
            </td>
            <!-- <td>{{ props.item.id }}</td> -->
            <td>{{ props.item.name }}</td>
            <td>{{ props.item.code }}</td>
            <td>{{ props.item.orders }}</td>
            <td>{{ FormatDate(props.item.created_at,'DD/MM/YYYY hh:mm',true) }}</td>
            <td v-html="props.item.icon"></td>
            <td class="justify-center layout px-0">
              <v-btn v-if="pagination.flag===1" icon class="mx-0" @click="handleItems(props.item)">
                <i class="material-icons info--text">layers</i>
              </v-btn>
              <v-btn icon class="mx-0" @click="handleEdit(props.item)">
                <i class="material-icons teal--text">edit</i>
              </v-btn>
              <v-btn icon class="mx-0" @click="handleDelete(props.item)">
                <i v-if="pagination.flag===1" class="material-icons error--text">delete</i>
                <i v-else class="material-icons info--text">refresh</i>
              </v-btn>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card>
    <v-dialog v-model="confirmDialog" width="500">
      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>
          Message
        </v-card-title>
        <v-card-text>
          Are you sure?
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat @click="handleConfirm">
            I accept
          </v-btn>
          <v-btn color="secondary" flat @click="confirmDialog=false">
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    dialog: { type: Boolean, default: false },
    itemsDialog: { type: Boolean, default: false },
  },
  data: () => ({
    loading: true,
    selected: [],
    // totalItems: 0,
    // items: [],
    toggle_one: 0,
    localDialog: false,
    localItemsDialog: false,
    confirmDialog: false,
    // query: { search: '', sort: 'orders', direction: 'asc', flag: 1 },
    pagination: {search:'', sortBy: 'orders', flag: 1},
    rowPerPage: [5, 10, 25, 50, 100, { text: "All", value: -1 }],
    headers: [
      // { text: 'ID', value: 'id', align: 'left' },
      { text: 'Name', value: 'name', align: 'left' },
      { text: 'Code', value: 'code', align: 'left' },
      { text: 'Orders', value: 'orders', sortable: true  },
      { text: 'Created', value: 'created.at' },
      { text: 'Icon', value: 'icon' },
      { text: '#', value: '#', sortable: false }
    ]
  }),
  mounted() {
    this.$store.dispatch('languages/init')
  },
  computed: {
    items() {
      // var pagination = {
      // search: this.search,
      // page: this.pagination.page,
      // descending: this.pagination.descending,
      // rowsPerPage: this.pagination.rowsPerPage,
      // sortBy: this.pagination.sortBy,
      // totalItems: this.pagination.totalItems,
      // flag: 0
      // }
      var rs = this.$store.getters['languages/getFilter'](this.pagination)
      return rs
    }
  },
  watch: {
    // pagination: {
    //   handler() {
    //     this.items = this.$store.dispatch('languages/pagination', this.pagination)
    //   },
    //   deep: true
    // },
    // items(val) {
    // this.totalItems = val.length
    // console.log(this.pagination)
    // },
    dialog(val) { this.localDialog = val },
    localDialog(val) {
      this.$emit('handleDialog', val)
      if (!val) this.$store.dispatch('languages/item')
    },
    itemsDialog(val) { this.localItemsDialog = val },
    localItemsDialog(val) { this.$emit('handleItemsDialog', val) }
  },
  created() {
    // this.$store.dispatch('languages/select')
    //{
    //     descending: this.pagination.descending,
    //     page: this.pagination.page,
    //     rowsPerPage: this.pagination.rowsPerPage,
    //     sortBy: this.pagination.sortBy,
    //     totalItems: this.pagination.totalItems
    // }
  },
  methods: {
    handleList(flag) {

    },
    handleItems(item) {
      this.$store.dispatch('languages/item', item)
      this.localItemsDialog = !this.localItemsDialog
    },
    handleEdit(item) {
      this.$store.dispatch('languages/item', item)
      this.localDialog = true
    },
    handleDelete(item) {
      this.confirmDialog = true
      this.$store.dispatch('languages/item', item)
      // console.log(this.$store.state.languages.item)
      // const index = this.desserts.indexOf(item)
      // confirm('Are you sure you want to delete this item?') && this.desserts.splice(index, 1)
    },
    handleConfirm() {
      this.confirmDialog = false
      this.$store.dispatch('languages/delete')
    }
  }
}
</script>

<style>
</style>