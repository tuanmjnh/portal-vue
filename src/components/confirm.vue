<template>
  <v-dialog v-model="localDialog" :persistent="persistent" width="500">
    <v-card>
      <v-card-title class="headline grey lighten-2" primary-title>
        {{title}}
      </v-card-title>
      <v-card-text>
        {{content}}
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" flat @click="onAccept">
          {{btnAcceptText}}
        </v-btn>
        <v-btn color="secondary" flat @click="onCancel">
          {{btnCancelText}}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    dialog: { type: Boolean, default: false },
    persistent: { type: Boolean, default: true },
    title: { type: String, default: 'Confirm' },
    content: { type: String, default: 'Are you sure?' },
    btnAcceptText: { type: String, default: 'I accept' },
    btnCancelText: { type: String, default: 'Cancel' },
  },
  data: () => ({
    localDialog: false
  }),
  watch: {
    dialog(val) {
      this.localDialog = true
    },
    localDialog(val) {
      if (!val) this.$emit('onCancel')
    }
  },
  methods: {
    onAccept() {
      this.localDialog = false
      this.$emit('onAccept')
    },
    onCancel() {
      this.localDialog = false
      // this.$emit('cancel')
    }
  }
}
</script>

<style>
</style>
