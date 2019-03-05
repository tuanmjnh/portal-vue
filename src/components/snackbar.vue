<template>
  <v-snackbar v-model="snackbar.show" :color="snackbar.color" :bottom="snackbar.y==='bottom'"
    :left="snackbar.x==='left'" :multi-line="snackbar.mode==='multi-line'" :right="snackbar.x==='right'"
    :timeout="snackbar.timeout" :top="snackbar.y==='top'" :vertical="snackbar.mode==='vertical'">
    {{ snackbar.text }}
    <v-btn color="" flat @click="snackbar.show=false"> <i class="material-icons">close</i></v-btn>
  </v-snackbar>
</template>

<script>
export default {
  data: () => ({
    // snackbar: false,
    // y: 'top',
    // x: 'right',
    // mode: '',
    // timeout: 6000,
    // text: 'Hello, I\'m a snackbar'
  }),
  watch: {
    // show(val) {
    //     console.log(this.$store.state._message.show)
    //     // this.$store.dispatch('messageClose', val)
    // }
  },
  computed: {
    snackbar() {
      var x = this.$store.state.$message
      return x
    }
  }
}
</script>

<style>
</style>
