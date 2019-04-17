<template>
  <!-- <router-view></router-view> -->
  <div class="mid-center" v-if="$store.state.$loadingGet">
    <v-progress-circular :size="130" :width="10" color="primary" indeterminate></v-progress-circular>
  </div>
  <div v-else>
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
    // if (this.$store.state.navigation.isGetFirst) 
    this.$store.dispatch('navigation/select')
  }
}
</script>

<style>
</style>
