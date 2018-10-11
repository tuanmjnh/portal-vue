<template>
  <v-dialog v-model="localDialog" max-width="1024px">
    <!-- <v-btn slot="activator" color="primary" dark class="mb-2">New Item</v-btn> -->
    <v-card>
      <v-card-title>
        <span class="headline">{{ formTitle }}</span>
      </v-card-title>

      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12 sm6 md4>
              <v-text-field v-model="editedItem.name" label="Dessert name"></v-text-field>
            </v-flex>
            <v-flex xs12 sm6 md4>
              <v-text-field v-model="editedItem.calories" label="Calories"></v-text-field>
            </v-flex>
            <v-flex xs12 sm6 md4>
              <v-text-field v-model="editedItem.fat" label="Fat (g)"></v-text-field>
            </v-flex>
            <v-flex xs12 sm6 md4>
              <v-text-field v-model="editedItem.carbs" label="Carbs (g)"></v-text-field>
            </v-flex>
            <v-flex xs12 sm6 md4>
              <v-text-field v-model="editedItem.protein" label="Protein (g)"></v-text-field>
            </v-flex>
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
    localDialog: false,
    editedIndex: -1,
    editedItem: {
      name: '',
      calories: 0,
      fat: 0,
      carbs: 0,
      protein: 0
    },
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    }
  },
  watch: {
    dialog(val) { this.localDialog = val },
    localDialog(val) { this.$emit('handleDialog', val) }
  },
  methods: {
  }
}
</script>

<style>
</style>
