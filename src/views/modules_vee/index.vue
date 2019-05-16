<template>
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
}
</script>

<style>
</style>
