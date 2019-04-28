<template>
  <div>
    <loading :loading.sync="loading"></loading>
    <div :class="loading?'hide':''">
      <router-view></router-view>
    </div>
    <!-- <list :class="loading?'hide':''"></list>
    <add :class="loading?'hide':''"></add> -->
  </div>
</template>
<script>
import loading from '@/components/loading-content'
// import list from './list'
// import add from './add'
export default {
  components: { loading },
  data: () => ({ loading: true }),
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
