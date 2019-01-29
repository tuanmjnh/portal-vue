<template>
  <v-dialog v-model="localDialog" max-width="1024px">
    <!-- <v-btn slot="activator" color="primary" dark class="mb-2">New Item</v-btn> -->
    <v-card>
      <v-card-title>
        <!-- <span class="headline">Update languages items -
          <span class="info--text">[{{language.code}}]</span>
        </span> -->
        <div class="flex xs12 sm12 md12">
          <span class="headline">{{language.name}} - [{{language.code}}]</span>
        </div>
        <v-select :items="items" v-model="modules" label="Modules" ></v-select> <!-- max-height="400" -->
        <v-spacer></v-spacer>
        <v-text-field v-model="query.search" append-icon="search" label="Search" single-line hide-details></v-text-field>
        <v-spacer></v-spacer>
        <v-tooltip bottom>
          <v-btn slot="activator" color="primary" small fab flat @click="addDialog=!addDialog">
            <i class="material-icons">add</i>
          </v-btn>
          <span>Add</span>
        </v-tooltip>
      </v-card-title>
      <v-card-text>
        <!-- <v-container grid-list-md> -->
        <!-- <v-layout wrap>
            <v-flex xs12 sm4 md4>
              <v-text-field v-model="dataItem.key" label="Key"></v-text-field>
            </v-flex>
            <v-flex xs12 sm8 md8>
              <v-text-field v-model="dataItem.value" label="Value"></v-text-field>
            </v-flex>
          </v-layout> -->
        <v-data-table class="elevation-1" v-model="selected" select-all item-key="name" :headers="headers"
          :items="data" :rows-per-page-items="rowPerPage">
          <!--:loading="loading" :pagination.sync="pagination" :total-items="totalItems" -->
          <template slot="items" slot-scope="props">
            <tr>
              <td>
                <v-checkbox v-model="props.selected" primary hide-details></v-checkbox>
              </td>
              <td>{{ props.item.key }}</td>
              <td>{{ props.item.value }}</td>
              <td class="justify-center layout px-0">
                <v-btn icon class="mx-0" @click="handleEdit(props.item)">
                  <i class="material-icons teal--text">edit</i>
                </v-btn>
                <v-btn icon class="mx-0" @click="handleDelete(props.item)">
                  <i v-if="query.flag===1" class="material-icons error--text">delete</i>
                  <i v-else class="material-icons info--text">refresh</i>
                </v-btn>
              </td>
            </tr>
          </template>
        </v-data-table>
        <v-dialog v-model="addDialog" max-width="600">
          <v-card>
            <v-card-title>
              <span class="headline">Add language item</span>
            </v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 sm8 md8>
                    <v-text-field v-model="item.name" label="Name"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm4 md4>
                    <v-text-field v-model="item.code" label="Code"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md4>
                    <v-text-field v-model="item.icon" label="Icon"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md4>
                    <v-text-field v-model="item.orders" label="Orders"></v-text-field>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" flat @click.native="handleSave">
                <!-- <i class="material-icons">check</i> -->
                Update
              </v-btn>
              <v-btn color="secondary" flat @click.native="localDialog=false">
                <!-- <i class="material-icons">close</i>  -->
                Cancel
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <!-- </v-container> -->
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    dialog: { type: Boolean, default: false }
  },
  data: () => ({
    loading: true,
    selected: [],
    localDialog: false,
    addDialog: false,
    toggle_one: 0,
    query: { search: '', flag: 1 },
    rowPerPage: [5, 10, 25, 50, 100, { text: "All", value: -1 }],
    dataItem: { key: '', value: '' },
    modules: '',
    headers: [
      { text: 'Key', value: 'key', align: 'left' },
      { text: 'Value', value: 'value', align: 'left' },
      { text: '#', value: '#', sortable: false }
    ],
    data: [
      { key: '', value: '' }
    ]
  }),
  mounted() {
    this.$store.dispatch('language_items/item')
  },
  computed: {
    items() {
      var rs = this.$store.getters['language_items/getFilter'](this.query)
      return rs
    },
    item() {
      var item = this.$store.state.languages.item
      return item
    },
    language() {
      var rs = this.$store.state.languages.item
      return rs
    }
  },
  watch: {
    dialog(val) { this.localDialog = val },
    localDialog(val) {
      this.$emit('handleDialog', val)
      if (!val) this.$store.dispatch('language_items/item')
    }
  },
  methods: {
    handleSave() {
      if (this.item.id) this.$store.dispatch('language_items/update')
      else this.$store.dispatch('language_items/insert')
    }
  },
  created() {
    this.$store.dispatch('language_items/item')
  },
}
</script>

<style>
</style>
