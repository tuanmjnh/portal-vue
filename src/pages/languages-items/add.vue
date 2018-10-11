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
            <v-flex xs12 sm8 md8>
              <v-text-field v-model="item.name" label="Name"></v-text-field>
            </v-flex>
            <v-flex xs12 sm4 md4>
              <v-text-field v-model="item.code" label="Code"></v-text-field>
            </v-flex>
            <v-flex xs12 sm6 md4>
              <v-text-field v-model="item.icon" label="Icon"></v-text-field>
            </v-flex>
            <v-flex xs12 sm6 md4>
              <v-text-field v-model="item.orders" label="Orders"></v-text-field>
            </v-flex>
            <v-flex xs12 sm6 md4>
              <v-switch color="primary" :label="item.flag===1?'Show':'Hide'" :true-value="1" :false-value="0"
                v-model.number="item.flag"></v-switch>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" flat @click.native="handleSave">
          <!-- <i class="material-icons">check</i> -->
          Update
        </v-btn>
        <v-btn color="secondary" flat @click.native="localDialog=false">
          <!-- <i class="material-icons">close</i>  -->
          Cancel
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { FBStore, timestamp } from '@/plugins/firebaseInit'
export default {
  props: {
    dialog: { type: Boolean, default: false }
  },
  data: () => ({
    localDialog: false,
    editedIndex: -1
  }),
  mounted() {
    this.$store.dispatch('languages_items/item')
  },
  computed: {
    formTitle() {
      return this.$store.state.languages.item.id ? 'Edit Item' : 'New Item'
    },
    item() {
      var item = this.$store.state.languages.item
      return item
    }
  },
  watch: {
    dialog(val) { this.localDialog = val },
    localDialog(val) {
      this.$emit('handleDialog', val)
      if (!val) this.$store.dispatch('languages_items/item')
    }
  },
  methods: {
    handleSave() {
      if (this.item.id) this.$store.dispatch('languages_items/update')
      else this.$store.dispatch('languages_items/insert')
    }
  }
}
</script>

<style>
</style>
