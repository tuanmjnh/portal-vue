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
    if (this.$store.state.navigation.isGetFirst) this.$store.dispatch('navigation/select', true)
  }
}
</script>

<style>
</style>
