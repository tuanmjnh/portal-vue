<template>
  <v-snackbar v-model="snackbar" :bottom="y === 'bottom'" :left="x === 'left'" :multi-line="mode === 'multi-line'"
    :right="x === 'right'" :timeout="timeout" :top="y === 'top'" :vertical="mode === 'vertical'">
    {{ text }}
    <v-btn color="pink" flat @click="snackbar = false"> x</v-btn>
  </v-snackbar>
</template>

<script>
export default {
    data: () => {
        return {
            snackbar: false,
            // y: 'top',
            // x: 'right',
            // mode: '',
            // timeout: 6000,
            // text: 'Hello, I\'m a snackbar'
        }
    },
    watch: {
        // show(val) {
        //     console.log(this.$store.state._message.show)

        //     // this.$store.dispatch('messageClose', val)
        // }
    },
    computed: {
        show() {
            var x = this.$store.state._message.show
            return x
        },
        text() {
            var x = this.$store.state._message.text
            return x
        },
        mode() {
            var x = this.$store.state._message.mode
            return x
        },
        timeout() {
            var x = this.$store.state._message.timeout
            return x
        },
        x() {
            var x = this.$store.state._message.x
            return x
        },
        y() {
            var x = this.$store.state._message.y
            return x
        },
    }
}
</script>

<style>
</style>
