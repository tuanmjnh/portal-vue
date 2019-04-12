<template>
  <!-- <router-view></router-view> -->
  <div>
    <list></list>
    <add></add>
  </div>
</template>
<script>
import list from './list'
import add from './add'
export default {
  components: { list, add },
  data: () => ({}),
  beforeCreate() {
    if (this.$store.state.contract_customer.isGetFirst) this.$store.dispatch('contract_customer/select', true)
  }
}
</script>

<style>
</style>
