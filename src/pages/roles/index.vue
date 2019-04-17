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
    // roles
    // if (this.$store.state.roles.isGetFirst) 
    this.$store.dispatch('roles/select')
    // modules
    // if (this.$store.state.modules.isGetFirst) 
    this.$store.dispatch('modules/select', false)
    // permissions
    // if (this.$store.state.permissions.isGetFirst) 
    this.$store.dispatch('permissions/select', false)
  }
}
</script>

<style>
</style>
