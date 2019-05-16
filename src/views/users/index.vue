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
    // if (this.$store.state.users.isGetFirst) 
    this.$store.dispatch('users/select')
    // if (this.$store.state.db_donvi.isGetFirst) 
    this.$store.dispatch('db_donvi/select', false)
  }
}
</script>

<style>
</style>
