<template>
  <div>
    <v-card>
      <v-card-title>
        <v-text-field v-model="$store.state.category.pagination.search" append-icon="search"
          :label="$store.getters.languages(['global.search'])" single-line hide-details></v-text-field>
        <v-spacer></v-spacer>
        <v-tooltip bottom>
          <v-btn flat icon slot="activator" color="primary" @click="$store.state.category.dialog=true">
            <v-icon>add</v-icon>
          </v-btn>
          <span>{{$store.getters.languages(['global.add'])}}</span>
        </v-tooltip>
        <v-tooltip bottom v-if="$store.state.category.selected.length>0 && $store.state.category.pagination.flag===1">
          <v-btn flat icon slot="activator" color="danger" @click="onDelete()">
            <v-icon>delete</v-icon>
          </v-btn>
          <span>{{$store.getters.languages('global.delete_selected')}}</span>
        </v-tooltip>
        <v-tooltip bottom v-if="$store.state.category.selected.length>0 && $store.state.category.pagination.flag===0">
          <v-btn flat icon slot="activator" color="info" @click="onDelete()">
            <v-icon>refresh</v-icon>
          </v-btn>
          <span>{{$store.getters.languages('global.recover_selected')}}</span>
        </v-tooltip>
        <export-data :getData="getDataExport" :tooltip="$store.getters.languages('global.export')"
          :items="[{title:$store.getters.languages(['global.export',' ',' .csv']),type:'csv'}]" />
        <v-btn-toggle v-model="$store.state.category.pagination.toggle" mandatory>
          <v-tooltip bottom>
            <v-btn slot="activator" flat @click="$store.state.category.pagination.flag=1">
              <v-icon>view_list</v-icon>
            </v-btn>
            <span>{{$store.getters.languages(['global.using'])}}</span>
          </v-tooltip>
          <v-tooltip bottom>
            <v-btn slot="activator" flat @click="$store.state.category.pagination.flag=0">
              <v-icon>delete</v-icon>
            </v-btn>
            <span>{{$store.getters.languages(['global.deleted'])}}</span>
          </v-tooltip>
        </v-btn-toggle>
      </v-card-title>
      <!-- <v-form ref="form" v-model="valid" lazy-validation> -->
      <v-data-table class="elevation-1" v-model="$store.state.category.selected"
        select-all item-key="id" :headers="this.$store.getters['category/headers']"
        :items="items" :rows-per-page-items="[10, 25, 50, 100, 200, 500]"
        :rows-per-page-text="$store.getters.languages(['global.rows_per_page'])"
        :pagination.sync="$store.state.category.pagination" :search="$store.state.category.pagination.search">
        <!--:loading="loading" :pagination.sync="pagination" :total-items="totalItems" -->
        <template slot="items" slot-scope="props">
          <tr>
            <td>
              <v-checkbox v-model="props.selected" primary hide-details></v-checkbox>
            </td>
            <!-- <td>{{ props.item.id }}</td> -->
            <td>{{ props.item.title }}</td>
            <td>{{ props.item.code }}</td>
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
                <span>{{$store.getters.languages(['global.edit'])}}</span>
              </v-tooltip>
              <v-tooltip bottom v-if="$store.state.category.pagination.flag===1">
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
    <tpl-confirm :dialog="$store.state.category.confirm" @onAccept="onCFMAccept"
      @onCancel="onCFMCancel" :title="$store.getters.languages(['global.message'])"
      :content="$store.getters.languages(['messages.confirm_content'])" :btnAcceptText="$store.getters.languages(['global.accept'])"
      :btnCancelText="$store.getters.languages(['global.cancel'])"></tpl-confirm>
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
  data: () => ({}),
  computed: {
    items() {
      return this.$store.getters['category/getFilter']()
    }
  },
  methods: {
    onEdit(item) {
      this.$store.commit('category/SET_ITEM', item)
      this.$store.state.category.dialog = true
    },
    onDelete(item) {
      this.$store.state.category.confirm = true
      if (item) this.$store.state.category.selected.push(item);
    },
    onCFMAccept() {
      this.$store.dispatch('category/delete')
    },
    onCFMCancel() {
      this.$store.state.category.selected = []
    },
    getDataExport() {
      return this.$store.dispatch('category/select', true)
    }
  }
}
</script>

<style>
</style>