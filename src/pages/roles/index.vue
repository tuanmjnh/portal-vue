<template>
  <!-- <router-view></router-view> -->
  <div>
    <loading :loading.sync="loading"></loading>
    <list :class="loading?'hide':''"></list>
    <add :class="loading?'hide':''"></add>
  </div>
</template>
<script>
import loading from '@/components/loading-content'
import list from './list'
import add from './add'
export default {
  components: { loading, list, add },
  data: () => ({ loading: true }),
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
