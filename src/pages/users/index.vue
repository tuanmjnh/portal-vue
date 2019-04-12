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
    if (this.$store.state.users.isGetFirst) this.$store.dispatch('users/select', true)
    if (this.$store.state.db_donvi.isGetFirst) this.$store.dispatch('db_donvi/select', false)
  }
}
</script>

<style>
</style>
