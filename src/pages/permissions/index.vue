<template>
  <router-view></router-view>
  <!-- <div class="mid-center" v-if="$store.state.$loadingGet">
    <v-progress-circular :size="130" :width="10" color="primary" indeterminate></v-progress-circular>
  </div>
  <div v-else>
    <add></add>
    <list></list>
  </div> -->
</template>

<script>
import { create } from 'domain';
export default {
  data: () => ({}),
  beforeCreate() {
    if (this.$store.state.permissions.isGetFirst) this.$store.dispatch('permissions/select', true)
  }
}
</script>

<style>
</style>
