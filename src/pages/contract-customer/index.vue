<template>
  <!-- <router-view></router-view> -->
  <div>
    <loading :loading.sync="loading"></loading>
    <list :class="loading?'hide':''" :http="http"></list>
    <add :class="loading?'hide':''" :http="http"></add>
  </div>
</template>
<script>
import { vnptbkn } from '@/plugins/axios-config'
import loading from '@/components/loading-content'
import list from './list'
import add from './add'
export default {
  components: { loading, list, add },
  data: () => ({
    loading: true,
    http: vnptbkn(),
  }),
  beforeCreate() {
    // if (this.$store.state.contract_customer.isGetFirst) 
    // this.$store.dispatch('contract_customer/select')
    // if (!this.$store.state.donvi.items)
    this.$store.dispatch('donvi/select', false, { rowsPerPage: 0 }, false)
  }
}
</script>

<style>
</style>
