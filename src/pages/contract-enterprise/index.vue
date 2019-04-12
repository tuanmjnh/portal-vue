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
    if (this.$store.state.contract_enterprise.isGetFirst) this.$store.dispatch('contract_enterprise/select', true)
  }
}
</script>

<style>
</style>
