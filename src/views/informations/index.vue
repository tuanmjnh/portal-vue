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
    // if (this.$store.state.navigation.isGetFirst) 
    this.$store.dispatch('navigation/select')
  }
}
</script>

<style>
</style>
