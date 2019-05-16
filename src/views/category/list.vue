<template>
  <div>
    <v-dialog v-model="dialog_filter" max-width="512px">
      <v-card>
        <v-card-title class="headline grey lighten-2">
          {{$languages.get('global.filter_data')}}
        </v-card-title>
        <v-card-text>
          <v-layout wrap>
            <v-flex xs12 sm12 md12>
              <v-text-field v-model="pagination.search" append-icon="search" :label="$languages.get('global.search')"
                single-line hide-details></v-text-field>
            </v-flex>
            <v-flex xs12 sm12 md12>
              <v-select :items="app_key" v-model="pagination.app_key" :label="$languages.get('category.app_key')"
                :rules="[v=>!!v||$languages.get('error.required_select')]" item-text="title"
                item-value="app_key"></v-select>
            </v-flex>
          </v-layout>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat @click.native="dialog_filter=false">
            {{$languages.get('global.back')}}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-card>
      <v-card-title>
        <v-layout wrap>
          <span class="title">{{$languages.get('category.title')}}</span>
          <v-spacer></v-spacer>
        </v-layout>
        <v-tooltip bottom>
          <v-btn flat icon slot="activator" color="primary" @click="$store.state.category.dialog=true">
            <v-icon>add</v-icon>
          </v-btn>
          <span>{{$languages.get('global.add')}}</span>
        </v-tooltip>
        <v-tooltip bottom>
          <v-btn slot="activator" flat icon color="primary" @click="dialog_filter=true">
            <v-icon>filter_list</v-icon>
          </v-btn>
          <span>{{$languages.get('global.filter_data')}}</span>
        </v-tooltip>
        <v-tooltip bottom v-if="$store.state.category.selected.length>0 && pagination.flag===1">
          <v-btn flat icon slot="activator" color="danger" @click="onDelete()">
            <v-icon>delete</v-icon>
          </v-btn>
          <span>{{$languages.get('global.delete_selected')}}</span>
        </v-tooltip>
        <v-tooltip bottom v-if="$store.state.category.selected.length>0 && pagination.flag===0">
          <v-btn flat icon slot="activator" color="info" @click="onDelete()">
            <v-icon>refresh</v-icon>
          </v-btn>
          <span>{{$languages.get('global.recover_selected')}}</span>
        </v-tooltip>
        <export-data :getData="getDataExport" :tooltip="$languages.get('global.export')"
          :items="[{title:$store.getters.languages(['global.export',' ',' .csv']),type:'csv'}]" />
        <v-btn-toggle v-model="pagination.toggle" mandatory>
          <v-tooltip bottom>
            <v-btn slot="activator" flat @click="pagination.flag=1">
              <v-icon>view_list</v-icon>
            </v-btn>
            <span>{{$languages.get('global.using')}}</span>
          </v-tooltip>
          <v-tooltip bottom>
            <v-btn slot="activator" flat @click="pagination.flag=0">
              <v-icon>delete</v-icon>
            </v-btn>
            <span>{{$languages.get('global.deleted')}}</span>
          </v-tooltip>
        </v-btn-toggle>
      </v-card-title>
      <!-- <v-form ref="form" v-model="valid" lazy-validation> -->
      <v-data-table class="elevation-1" v-model="$store.state.category.selected"
        select-all item-key="id" :headers="headers" :items="items" :rows-per-page-items="[10, 25, 50, 100, 200, 500]"
        :rows-per-page-text="$languages.get('global.rows_per_page')" :no-data-text="$languages.get('global.no_data_text')"
        :no-results-text="$languages.get('global.no_results_text')" :pagination.sync="pagination"
        :loading="$store.state.$loadingGet" :total-items="totalItems">
        <!--:loading="loading" :pagination.sync="pagination" :total-items="totalItems" -->
        <template slot="items" slot-scope="props">
          <tr>
            <td>
              <v-checkbox v-model="props.selected" primary hide-details></v-checkbox>
            </td>
            <!-- <td>{{ props.item.id }}</td> -->
            <td>{{ props.item.title }}</td>
            <!-- <td>{{ props.item.code }}</td> -->
            <!-- <td>{{ props.item.dependent }}</td> -->
            <td>{{ props.item.url }}</td>
            <td>{{ props.item.orders }}</td>
            <!-- <td>{{ props.item.created_at|formatDate('DD/MM/YYYY hh:mm') }}</td> -->
            <td v-html="props.item.icon"></td>
            <td class="justify-center layout px-0">
              <v-tooltip bottom>
                <v-btn flat icon slot="activator" color="teal" class="mx-0" @click="onEdit(props.item)">
                  <v-icon>edit</v-icon>
                </v-btn>
                <span>{{$languages.get('global.edit')}}</span>
              </v-tooltip>
              <v-tooltip bottom v-if="pagination.flag===1">
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
      <!-- </v-form> -->
    </v-card>
    <tpl-confirm :dialog="dialog_confirm" @onAccept="onCFMAccept" @onCancel="onCFMCancel"
      :title="$languages.get('global.message')" :content="$languages.get('messages.confirm_content')"
      :btnAcceptText="$languages.get('global.accept')" :btnCancelText="$languages.get('global.cancel')"></tpl-confirm>
  </div>
</template>

<script>
import confirm from '@/components/confirm'
import exportData from '@/components/export-data'
export default {
  components: {
    'tpl-confirm': confirm,
    'export-data': exportData
  },
  data: () => ({
    dialog_filter: false,
    dialog_confirm: false,
    totalItems: 0,
    pagination: {
      loading: true,
      search: '',
      sortBy: 'app_key,code,dependent,orders,title,id',
      descending: false,
      toggle: 0,
      flag: 1,
      page: 1,
      rowsPerPage: 10,
      app_key: 'guide'
    },
    headers: [
      { text: 'category.name', value: 'title', align: 'left' },
      // { text: 'global.code', value: 'code' },
      { text: 'global.url', value: 'url' },
      { text: 'global.orders', value: 'orders' },
      { text: 'Icon', value: 'icon' },
      { text: '#', value: '#', sortable: false }
    ],
  }),
  mounted() {
    this.headers.forEach(e => { e.text = this.$languages.get(e.text) })
  },
  computed: {
    items() {
      return this.$store.state.category.items
    },
    app_key() {
      return this.$store.getters['app_key/getFilter']()
    }
  },
  watch: {
    pagination: {
      handler(val) {
        this.$store.dispatch('category/select', this.pagination).then((x) => {
          if (x && x.total) this.totalItems = x.total
        })
      },
      deep: true
    },
  },
  methods: {
    onEdit(item) {
      this.$store.commit('category/SET_ITEM', item)
      this.$store.state.category.dialog = true
    },
    onDelete(item) {
      this.dialog_confirm = true
      if (item) this.$store.state.category.selected.push(item);
    },
    onCFMAccept() {
      this.$store.dispatch('category/delete')
    },
    onCFMCancel() {
      this.$store.state.category.selected = []
    },
    getDataExport() {
      let params = { ...this.pagination }
      params.sortBy = 'app_key,code,dependent,orders,title'
      params.loading = true
      params.is_export = true
      return this.$store.dispatch('category/select', params)
    }
  }
}
</script>

<style>
</style>