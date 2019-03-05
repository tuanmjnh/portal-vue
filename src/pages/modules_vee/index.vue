<template>
  <!-- <router-view></router-view> -->
  <div>
    <add :dialog="dialog" @handleDialog="dialog=$event"></add>
    <list :dialog="dialog" @handleDialog="dialog=$event"></list>
  </div>
</template>

<script>
import list from './list'
import add from './add'
export default {
  components: { list, add },
  data: () => ({ dialog: false })
}
</script>

<style>
</style>
