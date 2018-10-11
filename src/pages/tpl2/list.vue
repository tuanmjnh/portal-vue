<template>
  <div>
    <v-card>
      <v-card-title>
        <v-text-field v-model="localSearch" append-icon="search" label="Search" single-line hide-details></v-text-field>
        <v-spacer></v-spacer>
        <v-tooltip right>
          <v-btn slot="activator" color="primary" small fab flat @click="$emit('handleDialog',true)">
            <i class="material-icons">add</i>
          </v-btn>
          <span>Add</span>
        </v-tooltip>
      </v-card-title>
      <v-data-table v-model="selected" select-all :item-key="itemKey" :headers="headers" :items="items"
        :total-items="totalItems" :pagination.sync="localPagination" :rows-per-page-items="rowPerPage"
        :loading="loading" class="elevation-1">
        <!-- <template slot="headers" slot-scope="props">
          <tr>
            <th>
              <v-checkbox :input-value="props.all" :indeterminate="props.indeterminate" primary hide-details
                @click.native="toggleAll"></v-checkbox>
            </th>
            <template v-for="header in props.headers">
              <th v-if="header.value!=='checkbox'" :key="header.text" :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']"
                @click="changeSort(header.value)">
                <v-icon small>arrow_upward</v-icon>
                {{ header.text }}
              </th>
            </template>
          </tr>
        </template> -->
        <template slot="items" slot-scope="props">
          <tr>
            <td>
              <v-checkbox v-model="props.selected" primary hide-details></v-checkbox>
            </td>
            <td>{{ props.item.name }}</td>
            <td class="text-xs-right">{{ props.item.calories }}</td>
            <td class="text-xs-right">{{ props.item.fat }}</td>
            <td class="text-xs-right">{{ props.item.carbs }}</td>
            <td class="text-xs-right">{{ props.item.protein }}</td>
            <td class="text-xs-right">{{ props.item.iron }}</td>
            <td class="justify-center layout px-0">
              <v-btn icon class="mx-0" @click="editItem(props.item)">
                <v-icon color="teal">edit</v-icon>
              </v-btn>
              <v-btn icon class="mx-0" @click="deleteItem(props.item)">
                <v-icon color="pink">delete</v-icon>
              </v-btn>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
export default {
  props: {
    dialog: { type: Boolean, default: false },
    loading: { type: Boolean, default: true },
    items: { type: Array, default: null },
    totalItems: { type: Number, default: 0 },
    selected: { type: Array, default: null },
    itemKey: { type: String, default: 'id' },
    headers: { type: Array, default: null },
    search: { type: String, default: '' },
    pagination: { type: Object, default: null },
    rowPerPage: { type: Array, default: () => { [5, 10, 25, 50, 100, { text: "All", value: -1 }] } },
  },
  data: () => ({
    localPagination: {},
    localSearch: '',
    defaultItem: {
      name: '',
      calories: 0,
      fat: 0,
      carbs: 0,
      protein: 0
    }
  }),
  watch: {
    localPagination(val) {
      this.$emit('handlePagination', val)
    },
    localSearch(val) {
      this.$emit('handleSearch', val)
    }
  }
}
</script>

<style>
</style>
