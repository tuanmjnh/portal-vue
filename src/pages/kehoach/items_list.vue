<template>
  <div>
    <tpl-add :http="http" />
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
              <v-select :items="category" v-model="pagination.code" :label="$languages.get('category.group')"
                item-text="title" item-value="id"></v-select>
            </v-flex>
            <v-flex xs12 sm12 md12>
              <v-select :items="$store.state.app_key.items" v-model="pagination.app_key"
                :label="$languages.get('category.app_key')" item-text="title" item-value="app_key"></v-select>
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
          <span class="title">{{$languages.get('navigation.items_kh')}}</span>
          <v-spacer></v-spacer>
        </v-layout>
        <v-spacer></v-spacer>
        <v-tooltip bottom>
          <v-btn flat icon slot="activator" color="primary" @click="$store.state.news.dialog=true">
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
        <v-tooltip bottom v-if="$store.state.news.selected.length>0 && pagination.flag===1">
          <v-btn flat icon slot="activator" color="danger" @click="onDelete()">
            <v-icon>delete</v-icon>
          </v-btn>
          <span>{{$languages.get('global.delete_selected')}}</span>
        </v-tooltip>
        <v-tooltip bottom v-if="$store.state.news.selected.length>0 && pagination.flag===0">
          <v-btn flat icon slot="activator" color="info" @click="onDelete()">
            <v-icon>refresh</v-icon>
          </v-btn>
          <span>{{$languages.get('global.recover_selected')}}</span>
        </v-tooltip>
        <export-data :getData="getDataExport" :tooltip="$languages.get('global.export')"
          :items="[{title:$store.getters.languages(['global.export',' ',' .csv']),type:'csv'}]" />
      </v-card-title>
      <!-- <v-form ref="form" v-model="valid" lazy-validation> -->
      <v-data-table class="elevation-1" v-model="$store.state.news.selected" select-all
        item-key="id" :headers="headers" :items="items" :rows-per-page-items="[10, 25, 50, 100, 200, 500]"
        :rows-per-page-text="$languages.get('global.rows_per_page')" :pagination.sync="pagination"
        :loading="$store.state.$loadingGet" :total-items="$store.state.news.totalItems">
        <!--:loading="loading" :pagination.sync="pagination" :total-items="totalItems" -->
        <template slot="items" slot-scope="props">
          <tr>
            <td>
              <v-checkbox v-model="props.selected" primary hide-details></v-checkbox>
            </td>
            <td>{{ props.item.title }}</td>
            <td>{{ props.item.orders }}</td>
            <td>{{ props.item.created_at|formatDate('DD/MM/YYYY hh:mm') }}</td>
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
    <tpl-confirm :dialog="confirm" @onAccept="onCFMAccept" @onCancel="onCFMCancel" :title="$languages.get('global.message')"
      :content="$languages.get('messages.confirm_content')" :btnAcceptText="$languages.get('global.accept')"
      :btnCancelText="$languages.get('global.cancel')"></tpl-confirm>
  </div>
</template>

<script>
import { vnptbkn } from '@/plugins/axios-config'
import confirm from '@/components/confirm'
import exportData from '@/components/export-data'
import add from './items_add'
export default {
  components: {
    'tpl-confirm': confirm,
    'export-data': exportData,
    'tpl-add': add
  },
  data: () => ({
    http: vnptbkn(),
    dialog_filter: false,
    confirm: false,
    totalItems: 0,
    pagination: {
      loading: true,
      search: '',
      sortBy: 'app_key,code,orders,title,id',
      descending: false,
      toggle: 0,
      flag: 1,
      page: 1,
      rowsPerPage: 10,
      app_key: 'lydo',
      code: 702,
    },
    headers: [
      { text: 'news.title', value: 'title', align: 'left' },
      { text: 'global.orders', value: 'orders' },
      { text: 'global.created_at', value: 'created_at' },
      { text: 'Icon', value: 'icon' },
      { text: '#', value: '#', sortable: false },
    ]
  }),
  beforeCreate() {
    if (this.$store.state.app_key.items.length < 1)
      this.$store.dispatch('app_key/select', { loading: false, app_key: ['lydo', 'goicuoc'], flag: 1 })
    this.$store.dispatch('category/select', {
      loading: true,
      rowsPerPage: 0,
      orders: 'orders',
      app_key: 'kehoach',
      dependent: 501,
      flag: 1
    })
  },
  mounted() {
    this.headers.forEach(e => { e.text = this.$store.getters.languages(e.text) })
  },
  computed: {
    items() {
      return this.$store.state.news.items
    },
    app_key() {
      return this.$store.getters['app_key/getFilter']()
    },
    category() {
      return this.$store.state.category.items
    }
  },
  watch: {
    pagination: {
      handler(val) {
        this.$store.dispatch('news/select', this.pagination).then((x) => {
          if (x && x.total) this.totalItems = x.total
        })
      },
      deep: true
    },
  },
  methods: {
    onEdit(item) {
      this.$store.commit('news/SET_ITEM', item)
      this.$store.state.news.dialog = true
    },
    onDelete(item) {
      this.confirm = true
      if (item) this.$store.state.news.selected.push(item);
    },
    onCFMAccept() {
      this.$store.dispatch('news/delete')
    },
    onCFMCancel() {
      this.$store.state.news.selected = []
    },
    getDataExport() {
      let params = { ...this.pagination }
      params.sortBy = 'app_key,code,orders,title'
      params.loading = true
      params.is_export = true
      return this.$store.dispatch('news/select', params)
    }
  }
}
</script>

<style>
</style>