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
              <v-select :items="category" v-model="pagination.code" :label="$languages.get('category.title')"
                :rules="[v=>!!v||$languages.get('error.required_select')]" item-text="title"
                item-value="id"></v-select>
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
          <span class="title">{{$languages.get('modules.guide')}}: </span>
          <span class="title font-italic">{{findCategory(pagination.code).title}}</span>
          <v-spacer></v-spacer>
        </v-layout>
        <v-tooltip bottom>
          <v-btn slot="activator" flat icon color="primary" @click="dialog_filter=true">
            <v-icon>filter_list</v-icon>
          </v-btn>
          <span>{{$languages.get('global.filter_data')}}</span>
        </v-tooltip>
      </v-card-title>
      <v-card-text>
        <!-- <v-layout row>
          <v-flex xs12 sm12 md12>
            <v-list two-line>
              <template v-for="(item, index) in items">
                <v-list-tile :key="item.title" avatar ripple>
                  <v-list-tile-content>
                    <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                    <v-list-tile-sub-title class="text--primary">{{ item.descs }}</v-list-tile-sub-title>
                    <v-list-tile-sub-title v-html="item.content"></v-list-tile-sub-title>
                  </v-list-tile-content>
                  <v-list-tile-action>
                    <v-list-tile-action-text v-if="item.url">
                      <v-tooltip left>
                        <a slot="activator" class="decoration" :href="item.url" target="_blank">
                          <v-icon color="primary lighten-1">
                            link
                          </v-icon>
                        </a>
                        <span>{{$languages.get('global.link')}}</span>
                      </v-tooltip>
                    </v-list-tile-action-text>
                    <v-list-tile-action-text v-if="item.attach">
                      <v-tooltip left>
                        <a slot="activator" class="decoration" :href="item.attach" target="_blank">
                          <v-icon color="primary lighten-1">
                            attachment
                          </v-icon>
                        </a>
                        <span>{{$languages.get('global.attach')}}</span>
                      </v-tooltip>
                    </v-list-tile-action-text>
                  </v-list-tile-action>
                </v-list-tile>
                <v-divider v-if="index + 1 < items.length" :key="index"></v-divider>
              </template>
            </v-list>
          </v-flex>
        </v-layout> -->
        <v-container grid-list-md>
          <v-layout wrap>
            <template v-for="(item,index) in items">
              <v-flex xs12 sm12 md9 :key="`${index}-content`">
                <div class="">{{item.title}}</div>
                <div class="" v-if="item.descs">{{item.descs}}</div>
                <div class="" v-if="item.content" v-html="item.content"></div>
              </v-flex>
              <v-spacer :key="`${index}-spacer`"></v-spacer>
              <v-flex xs12 sm12 md1 :key="`${index}-action`">
                <v-tooltip bottom class="mr-2" v-if="item.url">
                  <a slot="activator" class="decoration" :href="item.url" target="_blank">
                    <v-icon color="primary lighten-1">
                      link
                    </v-icon>
                  </a>
                  <span>{{$languages.get('global.link')}}</span>
                </v-tooltip>
                <v-tooltip bottom v-if="item.attach">
                  <a slot="activator" class="decoration" :href="`${http.defaults.host}/${item.attach}`" target="_blank">
                    <v-icon color="primary lighten-1">
                      attachment
                    </v-icon>
                  </a>
                  <span>{{$languages.get('global.attach')}}</span>
                </v-tooltip>
              </v-flex>
              <v-flex xs12 sm12 md12 :key="`${index}-divider`">
                <v-divider v-if="index + 1 < items.length" :key="index"></v-divider>
              </v-flex>
            </template>
          </v-layout>
        </v-container>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { vnptbkn } from '@/plugins/axios-config'
export default {
  components: {},
  data: () => ({
    http: vnptbkn(),
    dialog_filter: false,
    pagination: {
      loading: true,
      search: '',
      sortBy: 'app_key,code,orders,title,id',
      descending: false,
      toggle: 0,
      flag: 1,
      page: 1,
      rowsPerPage: 0,
      code: 201,
      app_key: 'guide',
      dependent: 101
    },
  }),
  created() {
    this.$store.dispatch('category/select', {
      loading: true,
      sortBy: 'app_key,code,dependent,orders,title,id',
      flag: 1,
      page: 1,
      rowsPerPage: 0,
      dependent: 101,
      app_key: 'guide',
    }).then((x) => { })
    this.$store.dispatch('news/select', this.pagination).then((x) => {

    })
  },
  mounted() {
  },
  computed: {
    items() {
      return this.$store.state.news.items
    },
    category() {
      return this.$store.state.category.items
    },
    app_key() {
      return this.$store.getters['app_key/getFilter']()
    }
  },
  watch: {
    pagination: {
      handler(val) {
        this.$store.dispatch('news/select', this.pagination).then((x) => {
        })
      },
      deep: true
    },
  },
  methods: {
    findCategory(id) {
      const rs = this.category.find((x) => { return x.id === id })
      return rs ? rs : { title: this.$languages.get('modules.guide') }
    }
  }
}
</script>

<style>
</style>