<template>
  <div :class="classes" v-if="loading">
    <v-progress-circular :size="size" :width="width" :color="color" indeterminate></v-progress-circular>
  </div>
</template>

<script>
export default {
  props: {
    loading: { type: Boolean, default: true },
    size: { type: Number, default: 130 },
    width: { type: Number, default: 10 },
    timeout: { type: Number, default: 600 },
    color: { type: String, default: 'primary' },
    classes: { type: String, default: 'mid-center' }
  },
  data: () => ({
    // loading: true
  }),
  created() {
    this.$emit('update:loading', true)
  },
  mounted() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.$emit('update:loading', false)
        resolve()
        reject()
      }, this.timeout)
    })
  }
}
</script>

<style>
</style>
