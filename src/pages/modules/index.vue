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
    if (this.$store.state.modules.isGetFirst) this.$store.dispatch('modules/select', true)
    if (this.$store.state.permissions.isGetFirst) this.$store.dispatch('permissions/select', false)
  }
}
</script>

<style>
</style>
