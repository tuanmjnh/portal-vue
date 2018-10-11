<template>
  <v-dialog v-model="isShowDialog" max-width="1024px">
    <v-card>
      <v-card-title>
        <span class="headline">{{ formTitle }}</span>
      </v-card-title>
      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap>
           <slot name="content"></slot>
          </v-layout>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" flat @click.native="close">Cancel</v-btn>
        <v-btn color="blue darken-1" flat @click.native="save">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    dialog: { type: Boolean, default: false }
  },
  data: () => ({
    isShowDialog: false,
    editedIndex: -1
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    }
  },
  watch: {
    dialog(val) {
      this.isShowDialog = val
    },
    isShowDialog(val) {
      this.$emit('handleDialog', val)
    }
  },
  methods: {
  }
}
</script>

<style>
</style>
