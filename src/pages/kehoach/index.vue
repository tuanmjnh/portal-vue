<template>
  <div>
    <loading :loading.sync="loading"></loading>
    <router-view :class="loading?'hide':''"></router-view>
    <!-- <list :class="loading?'hide':''" :http="http"></list>
    <add :class="loading?'hide':''" :http="http"></add> -->
  </div>
</template>
<script>
import loading from '@/components/loading-content'
// import list from './list'
// import add from './add'
export default {
  components: { loading },//, list, add
  data: () => ({
    loading: true,
  }),
  beforeCreate() {
    const $this = this
    $this.$store.dispatch('category/GetByKey', ({ key: 'data', code: 'kehoach' })).then(x => {
      $this.$store.state.kehoach.nhom_kh = x
    })
  }
}
</script>

<style>
</style>
