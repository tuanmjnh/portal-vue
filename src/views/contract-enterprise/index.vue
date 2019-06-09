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
    if (this.$store.state.donvi.items < 1)
      this.$store.dispatch('donvi/select', { loading: false, flag: 1 })
    this.$store.dispatch('category/GetByKey', ({ key: 'enterprise' })).then(x => {
      this.$store.state.contract_enterprise.category = x
    })
  }
}
</script>

<style>
</style>
