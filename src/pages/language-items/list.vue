<template>
  <div>
    <v-card>
      <v-card-title>
        <!-- <v-container grid-list-md> -->
        <v-layout wrap class="pt-2">
          <v-flex xs12 sm3 md3 class="mr-3">
            <v-select :items="languages" v-model="$store.state.language_items.lang_code"
              :hide-selected="true" item-text="title" item-value="code" :label="$store.getters.languages('languages.title')"></v-select>
          </v-flex>
          <v-flex xs12 sm4 md4>
            <v-combobox v-model="pagination.search" :items="modules" item-text="code"
              item-value="code" :auto-select-first="true" :label="$store.getters.languages('global.search')"></v-combobox>
            <!-- <v-text-field v-model="pagination.search" append-icon="search" label="Search"
              single-line hide-details></v-text-field> -->
          </v-flex>
          <v-spacer></v-spacer>
          <v-tooltip bottom>
            <v-btn flat icon slot="activator" color="primary" @click="localDialog=!localDialog">
              <v-icon>add</v-icon>
            </v-btn>
            <span>{{$store.getters.languages('global.add')}}</span>
          </v-tooltip>
        </v-layout>
        <!-- </v-container> -->
        <!-- <v-btn-toggle v-model="toggle_one" mandatory>
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
        </v-btn-toggle> -->
      </v-card-title>
      <v-data-table class="elevation-1" v-model="selected" select-all item-key="id"
        :headers="headers" :items="items" :rows-per-page-items="rowPerPage"
        :rows-per-page-text="$store.getters.languages('global.rows_per_page')"
        :pagination.sync="pagination" :search="pagination.search">
        <!--:loading="loading" :pagination.sync="pagination" :total-items="totalItems" -->
        <template slot="items" slot-scope="props">
          <tr>
            <td>
              <v-checkbox v-model="props.selected" primary hide-details></v-checkbox>
            </td>
            <!-- <td>{{ props.item.id }}</td> -->
            <td>
              <v-edit-dialog :return-value.sync="props.item.module_code" lazy @save="onQuickSave(props.item)">{{
                props.item.module_code }}
                <v-text-field slot="input" v-model="props.item.module_code" :rules="[rules.required.module_code]"
                  label="Edit" single-line></v-text-field>
              </v-edit-dialog>
            </td>
            <td>
              <!-- {{ props.item.key }} -->
              <v-edit-dialog :return-value.sync="props.item.key" lazy @save="onQuickSave(props.item)">{{
                props.item.key }}
                <v-text-field slot="input" v-model="props.item.key" :rules="[rules.required.key]"
                  label="Edit" single-line></v-text-field>
              </v-edit-dialog>
            </td>
            <td>
              <!-- {{ props.item.value }} -->
              <v-edit-dialog :return-value.sync="props.item.value" lazy @save="onQuickSave(props.item)">{{
                props.item.value }}
                <v-text-field slot="input" v-model="props.item.value" :rules="[rules.required.value]"
                  label="Edit" single-line></v-text-field>
              </v-edit-dialog>
            </td>
            <td class="justify-center layout px-0">
              <v-tooltip bottom>
                <v-btn flat icon slot="activator" color="teal" class="mx-0" @click="onEdit(props.item)">
                  <v-icon>edit</v-icon>
                </v-btn>
                <span>{{$store.getters.languages('global.edit')}}</span>
              </v-tooltip>
              <v-tooltip bottom>
                <v-btn flat icon slot="activator" color="error" class="mx-0" @click="onDelete(props.item)">
                  <v-icon>delete</v-icon>
                </v-btn>
                <span>{{$store.getters.languages('global.delete')}}</span>
              </v-tooltip>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card>
    <tpl-confirm :dialog="confirmDialog" @onAccept="onCFMAccept" @onCancel="onCFMCancel"
      :title="$store.getters.languages('global.message')" :content="$store.getters.languages('messages.confirm_content')"
      :btnAcceptText="$store.getters.languages('global.accept')" :btnCancelText="$store.getters.languages('global.cancel')"></tpl-confirm>
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
    rowPerPage: [25, 50, 100, 200, 500], //  { text: "All", value: -1 }
    pagination: { search: 'global', sortBy: 'key' },
    rules: {
      required: {
        module_code: val => (val || '').length > 0 || 'Required',
        key: val => !!val || 'Required.',
        value: val => !!val || 'Required.',
      }
    },
    headers: [
      // { text: 'ID', value: 'id', align: 'left' },
      { text: 'Modules', value: 'module_code', align: 'left' },
      { text: 'Key', value: 'key', align: 'left' },
      { text: 'Value', value: 'value' },
      { text: '#', value: '#', sortable: false }
    ]
  }),
  mounted() {
  },
  created() {
    this.$store.dispatch('language_items/selectByLang').then(this.loading = false)
  },
  computed: {
    item() {
      const rs = this.$store.state.language_items.item
      return rs
    },
    items() {
      const rs = JSON.parse(JSON.stringify(this.$store.getters['language_items/getFilter'](this.pagination)))
      return rs
    },
    languages() {
      const rs = this.$store.getters['languages/getFilter']({ sortBy: 'orders', find: { flag: 1 } })
      return rs
    },
    modules() {
      const rs = this.$store.state.language_items.modules
      const tmp = this.$store.getters['modules/getFilter']({ sortBy: 'orders', find: { flag: 1 } }).map(e => e.code)
      rs.pushIfNotExist(tmp)
      return rs
      // const rs = this.$store.state.language_items.modules
      // return rs
    },
    lang_code() {
      const rs = this.$store.state.language_items.lang_code
      return rs
    }
  },
  watch: {
    dialog(val) { this.localDialog = val },
    localDialog(val) {
      this.$emit('handleDialog', val)
      if (!val) this.$store.dispatch('language_items/item')
    },
    itemsDialog(val) { this.localItemsDialog = val },
    localItemsDialog(val) { this.$emit('handleItemsDialog', val) },
    lang_code(val) {
      this.$store.dispatch('language_items/selectByLang').then(this.loading = false)
    }
  },
  methods: {
    onEdit(item) {
      this.$store.dispatch('language_items/item', item)
      this.localDialog = true
    },
    onDelete(item) {
      this.confirmDialog = !this.confirmDialog
      this.selected.push(item);
    },
    onCFMAccept() {
      this.$store.dispatch('language_items/delete', this.selected).then(this.selected = [])
    },
    onCFMCancel() {
      this.selected = []
    },
    onQuickSave(item) {
      this.$store.dispatch('language_items/item', item).then(() => {
        this.$store.dispatch('language_items/update')
      })
    },
  }
}
</script>

<style>
</style>