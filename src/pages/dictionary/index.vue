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
    if (this.$store.state.dictionary.isGetFirst)
      this.$store.dispatch('dictionary/selectByLang', true).then(() => {
        if (this.$store.state.languages.isGetFirst) this.$store.dispatch('languages/select', false)
        if (this.$store.state.modules.isGetFirst) this.$store.dispatch('modules/select', false)
      })
  }
}
</script>

<style>
</style>
