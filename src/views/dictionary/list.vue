<template>
  <div>
    <v-card>
      <v-card-title>
        <!-- <v-container grid-list-md> -->
        <v-layout wrap class="pt-2">
          <v-flex xs12 sm3 md3 class="mr-3">
            <v-select :items="languages" v-model="$store.state.dictionary.lang_code"
              :hide-selected="true" item-text="title" item-value="code" :label="$languages.get('languages.title')"></v-select>
          </v-flex>
          <v-flex xs12 sm4 md4>
            <v-combobox v-model="$store.state.dictionary.pagination.search" :items="modules"
              item-text="code" item-value="code" :auto-select-first="true" :label="$languages.get('global.search')"></v-combobox>
            <!-- <v-text-field v-model="$store.state.dictionary.pagination.search" append-icon="search" label="Search"
              single-line hide-details></v-text-field> -->
          </v-flex>
          <v-spacer></v-spacer>
          <v-tooltip bottom>
            <v-btn flat icon slot="activator" color="primary" @click="$store.state.dictionary.dialog=true">
              <v-icon>add</v-icon>
            </v-btn>
            <span>{{$languages.get('global.add')}}</span>
          </v-tooltip>
          <v-tooltip bottom v-if="$store.state.dictionary.selected.length>0">
            <v-btn flat icon slot="activator" color="danger" @click="onDelete()">
              <v-icon>delete</v-icon>
            </v-btn>
            <span>{{$languages.get('global.delete_selected')}}</span>
          </v-tooltip>
        </v-layout>
      </v-card-title>
      <v-form v-model="valid" ref="form">
        <v-data-table class="elevation-1" v-model="$store.state.dictionary.selected"
          select-all item-key="id" :headers="$store.state.dictionary.headers" :items="items"
          :rows-per-page-items="[25, 50, 100, 200, 500]" :rows-per-page-text="$languages.get('global.rows_per_page')"
          :pagination.sync="$store.state.dictionary.pagination" :search="$store.state.dictionary.pagination.search">
          <!--:loading="loading" :total-items="totalItems" -->
          <template slot="items" slot-scope="props">
            <tr>
              <td>
                <v-checkbox v-model="props.selected" primary hide-details></v-checkbox>
              </td>
              <!-- <td>{{ props.item.id }}</td> -->
              <td>
                <v-edit-dialog :return-value.sync="props.item.module_code" lazy @save="onQuickSave(props.item)">
                  {{props.item.module_code }}
                  <v-text-field slot="input" v-model="props.item.module_code" single-line
                    :rules="[v => !!v || $languages.get('error.required')]"
                    :label="$languages.get('global.input')"></v-text-field>
                </v-edit-dialog>
              </td>
              <td>
                <!-- {{ props.item.key }} -->
                <v-edit-dialog :return-value.sync="props.item.key" lazy @save="onQuickSave(props.item)">
                  {{props.item.key }}
                  <v-text-field slot="input" v-model="props.item.key" single-line :label="$languages.get('global.input')"
                    :rules="[v => !!v || $languages.get('error.required')]"></v-text-field>
                </v-edit-dialog>
              </td>
              <td>
                <!-- {{ props.item.value }} -->
                <v-edit-dialog :return-value.sync="props.item.value" lazy @save="onQuickSave(props.item)">
                  {{props.item.value }}
                  <v-text-field slot="input" v-model="props.item.value" single-line
                    :label="$languages.get('global.input')" :rules="[v => !!v || $languages.get('error.required')]"></v-text-field>
                </v-edit-dialog>
              </td>
              <td class="justify-center layout px-0">
                <v-tooltip bottom>
                  <v-btn flat icon slot="activator" color="teal" class="mx-0" @click="onEdit(props.item)">
                    <v-icon>edit</v-icon>
                  </v-btn>
                  <span>{{$languages.get('global.edit')}}</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <v-btn flat icon slot="activator" color="error" class="mx-0" @click="onDelete(props.item)">
                    <v-icon>delete</v-icon>
                  </v-btn>
                  <span>{{$languages.get('global.delete')}}</span>
                </v-tooltip>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-form>
    </v-card>
    <tpl-confirm :dialog.sync="$store.state.navigation.confirm" @onAccept="onCFMAccept"
      @onCancel="onCFMCancel" :title="$languages.get('global.message')"
      :content="$languages.get('messages.confirm_content')" :btnAcceptText="$languages.get('global.accept')"
      :btnCancelText="$languages.get('global.cancel')"></tpl-confirm>
  </div>
</template>

<script>
import confirm from '@/components/confirm'
import { setTimeout } from 'timers';
export default {
  components: { 'tpl-confirm': confirm },
  data: () => ({
    valid: false
  }),
  computed: {
    // item() {
    //   return this.$store.state.dictionary.item
    // },
    items() {
      return JSON.parse(JSON.stringify(this.$store.getters['dictionary/getFilter']))
      // const rs = this.$store.getters['dictionary/getFilter'](this.pagination)
    },
    languages() {
      return this.$store.getters['languages/getFilter']({ sortBy: 'orders', find: { flag: 1 } })
    },
    modules() {
      const rs = this.$store.state.dictionary.modules
      const tmp = this.$store.getters['modules/getFilter']({ sortBy: 'orders', find: { flag: 1 } }).map(e => e.code)
      rs.pushIfNotExist(tmp)
      return rs
      // const rs = this.$store.state.dictionary.modules
      // return rs
    },
    lang_code() {
      return this.$store.state.dictionary.lang_code
    }
  },
  watch: {
    lang_code(val) { this.$store.dispatch('dictionary/selectByLang') }
  },
  methods: {
    onEdit(item) {
      this.$store.commit('dictionary/SET_ITEM', item)
      this.$store.state.dictionary.dialog = true
    },
    onDelete(item) {
      this.$store.state.dictionary.confirm = true
      if (item) this.$store.state.dictionary.selected.push(item);
    },
    onCFMAccept() {
      this.$store.dispatch('dictionary/delete')
    },
    onCFMCancel() {
      this.$store.state.languages.dictionary = []
    },
    onQuickSave(item) {
      if (this.valid) {
        this.$store.commit('dictionary/SET_ITEM', item)
        setTimeout(() => {
          this.$store.dispatch('dictionary/update')
        }, 100)
      }
      // this.$store.dispatch('dictionary/item', item).then(() => {
      //   this.$store.dispatch('dictionary/update')
      // })
    }
  },
  onCancelQuickSave(val) {
    console.log(val)
  }
}
</script>

<style>
</style>