<template>
  <div>
    <loading :loading.sync="loading"></loading>
    <div :class="loading?'hide':''">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
import loading from '@/components/loading-content'
export default {
  components: { loading },
  data: () => ({
    loading: true,
  }),
  beforeCreate() {
    const $this = this
    // this.$store.dispatch('kehoach/select')
   
    // $this.$store.dispatch('category/GetByKey', ({ key: 'data', code: 'kehoach' })).then(x => {
    //   $this.$store.state.kehoach.nhom_kh = x
    // })
  }
}
</script>

<style>
</style>
