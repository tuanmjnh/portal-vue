<template>
  <div>
    <v-card>
      <v-card-title>
        <v-text-field v-model="$store.state.languages.pagination.search" append-icon="search"
          :label="$store.getters.languages('global.search')" single-line hide-details></v-text-field>
        <v-spacer></v-spacer>
        <v-tooltip bottom>
          <v-btn flat icon slot="activator" color="primary" @click="$store.state.languages.dialog=true">
            <v-icon>add</v-icon>
          </v-btn>
          <span>{{$store.getters.languages('global.add')}}</span>
        </v-tooltip>
        <v-tooltip bottom v-if="$store.state.languages.selected.length>0 && $store.state.languages.pagination.find.flag===1">
          <v-btn flat icon slot="activator" color="danger" @click="onDelete()">
            <v-icon>delete</v-icon>
          </v-btn>
          <span>{{$store.getters.languages('global.delete_selected')}}</span>
        </v-tooltip>
        <v-tooltip bottom v-if="$store.state.languages.selected.length>0 && $store.state.languages.pagination.find.flag===0">
          <v-btn flat icon slot="activator" color="info" @click="onDelete()">
            <v-icon>refresh</v-icon>
          </v-btn>
          <span>{{$store.getters.languages('global.recover_selected')}}</span>
        </v-tooltip>
        <v-btn-toggle v-model="$store.state.languages.pagination.toggle" mandatory>
          <v-tooltip bottom>
            <v-btn slot="activator" flat @click="$store.state.languages.pagination.find.flag=1">
              <v-icon>view_list</v-icon>
            </v-btn>
            <span>{{$store.getters.languages('global.using')}}</span>
          </v-tooltip>
          <v-tooltip bottom>
            <v-btn slot="activator" flat @click="$store.state.languages.pagination.find.flag=0">
              <v-icon>delete</v-icon>
            </v-btn>
            <span>{{$store.getters.languages('global.deleted')}}</span>
          </v-tooltip>
        </v-btn-toggle>
      </v-card-title>
      <v-data-table class="elevation-1" v-model="$store.state.languages.selected"
        select-all item-key="id" :headers="$store.getters['permissions/headers']" :items="items"
        :rows-per-page-items="$store.state.$row_per_page" :rows-per-page-text="$store.getters.languages('global.rows_per_page')"
        :pagination.sync="$store.state.languages.pagination" :search="$store.state.languages.pagination.search">
        <!--:loading="loading" :total-items="totalItems" -->
        <!-- <template slot="headers" slot-scope="props">
          <th>
            <v-checkbox :input-value="props.all" :indeterminate="props.indeterminate"
              primary hide-details @click.stop="toggleAll"></v-checkbox>
          </th>
          <th v-for="header in props.headers" :key="header.text" 
          :class="['column sortable', $store.state.languages.pagination.descending ? 'desc' : 'asc', header.value === $store.state.languages.pagination.sortBy ? 'active' : '', header.align]"
            @click="changeSort(header.value)">
            <v-icon small>arrow_upward</v-icon>{{ $store.getters.languages('header.text') }}</th>
        </template> -->
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
                <span>{{$store.getters.languages('global.edit')}}</span>
              </v-tooltip>
              <v-tooltip bottom v-if="$store.state.languages.pagination.find.flag===1">
                <v-btn flat icon slot="activator" color="error" class="mx-0" @click="onDelete(props.item)">
                  <v-icon>delete</v-icon>
                </v-btn>
                <span>{{$store.getters.languages('global.delete')}}</span>
              </v-tooltip>
              <v-tooltip bottom v-else>
                <v-btn flat icon slot="activator" color="info" class="mx-0" @click="onDelete(props.item)">
                  <v-icon>refresh</v-icon>
                </v-btn>
                <span>{{$store.getters.languages('global.recover')}}</span>
              </v-tooltip>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card>
    <tpl-confirm :dialog="$store.state.navigation.confirm" @onAccept="onCFMAccept"
      @onCancel="onCFMCancel" :title="$store.getters.languages('global.message')"
      :content="$store.getters.languages('messages.confirm_content')" :btnAcceptText="$store.getters.languages('global.accept')"
      :btnCancelText="$store.getters.languages('global.cancel')"></tpl-confirm>
  </div>
</template>

<script>
import confirm from '@/components/confirm'
export default {
  components: { 'tpl-confirm': confirm },
  data: () => ({}),
  computed: {
    items() {
      return this.$store.getters['languages/getFilter']()
    }
  },
  methods: {
    onItems(item) {
      this.$store.commit('languages/SET_ITEM', item)
      this.$store.state.languages.dialog = true
    },
    onEdit(item) {
      this.$store.commit('languages/SET_ITEM', item)
      this.$store.state.languages.dialog = true
    },
    onDelete(item) {
      this.$store.state.languages.confirm = true
      if (item) this.$store.state.languages.selected.push(item);
    },
    onCFMAccept() {
      this.$store.dispatch('languages/delete')
    },
    onCFMCancel() {
      this.$store.state.languages.selected = []
    }
  }
}
</script>

<style>
</style>