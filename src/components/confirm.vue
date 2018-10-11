<template>
  <v-dialog v-model="localDialog" width="500">
    <v-card>
      <v-card-title class="headline grey lighten-2" primary-title>
        Message
      </v-card-title>
      <v-card-text>
        Are you sure?
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" flat @click="onConfirm">
          I accept
        </v-btn>
        <v-btn color="secondary" flat @click="onCancel">
          Cancel
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    dialog: { type: Boolean, default: false },
  },
  data: () => {
    return {
      localDialog: false
    }
  },
  watch: {
    dialog(val) {
      this.localDialog = true
    }
  },
  methods: {
    onConfirm() {
      this.localDialog = false
      this.$emit('ok')
    },
    onCancel() {
      this.localDialog = false
      this.$emit('cancel')
    }
  }
}
</script>

<style>
</style>
