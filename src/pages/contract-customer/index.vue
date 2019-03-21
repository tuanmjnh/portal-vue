<template>
  <div class="mid-center" v-if="$store.state.$loading">
    <v-progress-circular :size="130" :width="10" color="primary" indeterminate></v-progress-circular>
  </div>
  <div v-else>
    <add></add>
    <list></list>
  </div>
</template>

<script>
import list from './list'
import add from './add'
export default {
  components: { list, add },
  data: () => ({})
}
</script>

<style>
</style>
