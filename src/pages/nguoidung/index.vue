<template>
  <div class="mid-center" v-if="$store.state.$loadingGet">
    <v-progress-circular :size="130" :width="10" color="primary" indeterminate></v-progress-circular>
  </div>
  <div v-else>
    <router-view v-if="$route.name==='set-roles'"></router-view>
    <template v-else>
      <list></list>
      <add></add>
    </template>
  </div>
</template>

<script>
import list from './list'
import add from './add'
export default {
  components: { list, add },
  data: () => ({}),
  beforeCreate() {
    // if (this.$store.state.nguoidung.isGetFirst) 
    this.$store.dispatch('nguoidung/select')
    // if (this.$store.state.donvi.isGetFirst) 
    this.$store.dispatch('donvi/select', false)
  }
}
</script>

<style>
</style>
