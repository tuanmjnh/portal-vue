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
    if ($this.$store.state.donvi.items < 1)
      $this.$store.dispatch('donvi/select', false, null, false)
    $this.$store.dispatch('category/GetByKey', ({ key: 'kehoach' })).then(x => {
      $this.$store.state.kehoach.nhom_kh = x
    })
    this.$store.dispatch('kehoach/GetNguoidung', {
      loading: false,
      // donvi_id: this.pagination.donvi_id,
      sortBy: 'donvi_id,ma_nd',
      rowsPerPage: 0
    })
  }
}
</script>

<style>
</style>
