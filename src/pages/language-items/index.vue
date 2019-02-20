<template>
  <!-- <router-view></router-view> -->
  <div>
    <add :dialog="dialog" @handleDialog="dialog=$event"></add>
    <list :dialog="dialog" @handleDialog="dialog=$event"></list>
  </div>
</template>

<script>
import list from './list'
import add from './add'
export default {
  components: { list, add },
  data: () => ({ dialog: false }),
  mounted() {
    if (this.$store.state.languages.items && this.$store.state.languages.items.length < 1) this.$store.dispatch('languages/select')
    if (this.$store.state.modules.items && this.$store.state.modules.items.length < 1) this.$store.dispatch('modules/select')
  }
}
</script>

<style>
</style>
