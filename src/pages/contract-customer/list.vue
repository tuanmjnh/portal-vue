<template>
  <div>
    <v-card>
      <v-card-title>
        <v-text-field v-model="query.search" append-icon="search" label="Search" single-line hide-details></v-text-field>
        <v-spacer></v-spacer>
        <v-tooltip bottom>
          <v-btn slot="activator" color="primary" small fab flat @click="localDialog=!localDialog">
            <i class="material-icons">add</i>
          </v-btn>
          <span>Add</span>
        </v-tooltip>
        <v-btn-toggle v-model="toggle_one" mandatory>
          <v-tooltip bottom>
            <v-btn slot="activator" flat @click="query.flag=1">
              <i class="material-icons">view_list</i>
            </v-btn>
            <span>List use</span>
          </v-tooltip>
          <v-tooltip bottom>
            <v-btn slot="activator" flat @click="query.flag=0">
              <i class="material-icons">delete</i>
            </v-btn>
            <span>List delete</span>
          </v-tooltip>
        </v-btn-toggle>
      </v-card-title>
      <v-data-table class="elevation-1" v-model="selected" select-all item-key="user_id" :headers="headers"
        :items="items" :rows-per-page-items="rowPerPage" :loading="loading">
        <!--:loading="loading" :pagination.sync="pagination" :total-items="totalItems" -->
        <template slot="items" slot-scope="props">
          <tr>
            <td>
              <v-checkbox v-model="props.selected" primary hide-details></v-checkbox>
            </td>
            <!-- <td>{{ props.item.id }}</td> -->
            <td>{{ props.item.username }}</td>
            <td>{{ props.item.full_name }}</td>
            <td>{{ props.item.mobile }}</td>
            <td>{{ props.item.email }}</td>
            <td class="justify-center layout px-0">
              <v-btn icon class="mx-0" @click="onEdit(props.item)">
                <i class="material-icons teal--text">edit</i>
              </v-btn>
              <v-btn icon class="mx-0" @click="onDelete(props.item)">
                <i v-if="query.flag===1" class="material-icons error--text">delete</i>
                <i v-else class="material-icons info--text">refresh</i>
              </v-btn>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card>
    <tpl-confirm :dialog="confirmDialog" @ok="onConfirm"></tpl-confirm>
  </div>
</template>

<script>
import confirm from '@/components/confirm'
export default {
  components: { 'tpl-confirm': confirm },
  props: { dialog: { type: Boolean, default: false } },
  data: () => {
    return {
      loading: true,
      selected: [],
      toggle_one: 0,
      localDialog: false,
      confirmDialog: false,
      query: { search: '', flag: 1 },
      rowPerPage: [5, 10, 25, 50, 100, { text: "All", value: -1 }],
      headers: [
        { text: 'Tài khoản', value: 'username' },
        { text: 'Họ tên', value: 'full_name' },
        { text: 'Điện thoại', value: 'mobile' },
        { text: 'Email', value: 'email' },
        { text: '#', value: '#', sortable: false }
      ]
    }
  },
  computed: {
    items() {
      var rs = this.$store.getters['users/getFilter'](this.query)
      return rs
    }
  },
  watch: {
    dialog(val) { this.localDialog = val },
    localDialog(val) {
      this.$emit('handleDialog', val)
      if (!val) this.$store.dispatch('users/item')
    }
  },
  created() {
    this.$store.dispatch('users/select').then(this.loading = false)
  },
  methods: {
    onEdit(item) {
      this.$store.dispatch('users/item', item)
      this.localDialog = true
    },
    onDelete(item) {
      this.confirmDialog = !this.confirmDialog
      this.$store.dispatch('users/item', item)
    },
    onConfirm() {
      this.$store.dispatch('users/delete')
    }
  }
}
</script>

<style>
</style>