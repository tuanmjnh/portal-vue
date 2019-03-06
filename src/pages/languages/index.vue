<template>
  <div class="mid-center" v-if="$store.state.$loading">
    <v-progress-circular :size="130" :width="10" color="primary" indeterminate></v-progress-circular>
  </div>
  <div v-else>
    <add :dialog="dialog" @handleDialog="dialog=$event"></add>
    <items :dialog="itemsDialog" @handleDialog="itemsDialog=$event"></items>
    <list :dialog="dialog" :itemsDialog="itemsDialog" @handleDialog="dialog=$event" @handleItemsDialog="itemsDialog=$event"></list>
  </div>
</template>

<script>
import list from './list'
import add from './add'
import items from './items'
export default {
  components: { list, add, items },
  data: () => ({
    dialog: false,
    itemsDialog: false
  })
}
</script>

<style>
</style>
