<template>
  <div>
    <v-card>
      <v-card-title>
        <v-text-field v-model="pagination.search" append-icon="search" :label="$store.getters.languages(['global.search'])"
          single-line hide-details></v-text-field>
        <v-spacer></v-spacer>
        <v-tooltip bottom>
          <v-btn flat icon slot="activator" color="primary" @click="localDialog=!localDialog">
            <v-icon>add</v-icon>
          </v-btn>
          <span>{{$store.getters.languages(['global.add'])}}</span>
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
      <v-data-table class="elevation-1" v-model="selected" select-all item-key="id"
        :headers="headers" :items="items" :rows-per-page-items="rowPerPage"
        :rows-per-page-text="$store.getters.languages(['global.rows_per_page'])"
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
  props: {
    dialog: { type: Boolean, default: false },
    itemsDialog: { type: Boolean, default: false },
  },
  data: () => ({
    loading: true,
    selected: [],
    valid: false,
    toggle_one: 0,
    localDialog: false,
    localItemsDialog: false,
    confirmDialog: false,
    rowPerPage: [10, 25, 50, 100, 200, 500], //  { text: "All", value: -1 }
    pagination: { search: '', sortBy: 'orders', find: { flag: 1 } },
    headers: [
      // { text: 'ID', value: 'id', align: 'left' },
      { text: 'modules.title', value: 'title', align: 'left' },
      { text: 'global.code', value: 'code', align: 'left' },
      { text: 'global.orders', value: 'orders', sortable: true },
      { text: 'global.created_at', value: 'created_at' },
      { text: 'Icon', value: 'icon' },
      { text: '#', value: '#', sortable: false }
    ]
  }),
  beforeCreate() { },
  created() {
    this.headers.forEach(e => { e.text = this.$store.getters.languages([e.text]) });
    if (this.$store.state.modules.isGetFirst) this.$store.dispatch('modules/select').then(this.loading = false)
  },
  beforeMount() { },
  mounted() { },
  computed: {
    items() {
      var rs = JSON.parse(JSON.stringify(this.$store.getters['modules/getFilter'](this.pagination)))
      // var rs = this.$store.getters['modules/getFilter'](this.pagination)
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
    onCFMAccept() {
      this.$store.dispatch('modules/delete', this.selected).then(this.selected = [])
    },
    onCFMCancel() {
      this.selected = []
    },
    onQuickSave(item) {
      // if (this.valid) {
      //   this.$store.dispatch('modules/item', item).then(() => {
      //     this.$store.dispatch('modules/update')
      //   })
      // }
      this.$validator.validate().then(result => {
        if (!result) {
          console.log(this.errors)
        }
        console.log(result)
      });
    }
  }
}
</script>

<style>
</style>