<template>
  <v-card>
    <v-card-title>
      <span class="headline">{{ formTitle() }}</span>
      <div class="flex text-xs-right">
        <v-tooltip bottom>
          <v-btn slot="activator" color="primary" small fab flat>
            <i class="material-icons">save</i>
          </v-btn>
          <span>Save</span>
        </v-tooltip>
        <v-tooltip bottom>
          <v-btn slot="activator" color="primary" small fab flat>
            <i class="material-icons">clear</i>
          </v-btn>
          <span>Back</span>
        </v-tooltip>
      </div>
    </v-card-title>
    <v-card-text>
      <v-container grid-list-md>
        <v-layout wrap>
          <v-flex xs12 sm6 md6>
            <v-text-field v-model="dataItem.name" label="Name"></v-text-field>
          </v-flex>
          <v-flex xs12 sm6 md6></v-flex>
          <v-flex xs12 sm6 md4>
            <v-text-field v-model="dataItem.icon" label="Icon"></v-text-field>
          </v-flex>
          <v-flex xs12 sm6 md2>
            <v-text-field v-model="dataItem.orders" type="number" label="Orders"></v-text-field>
          </v-flex>
          <v-flex xs12 sm6 md4>
            <v-switch color="primary" :label="`Switch 1: ${dataItem.flag}`" v-model="dataItem.flag"></v-switch>
            <!-- <v-text-field v-model="dataItem.flag" label="Trạng thái"></v-text-field> -->
          </v-flex>
          <v-flex xs12 sm12 md12>
            <!-- <editor v-model="dataItem.desc" apiKey="yat69ufb2vpeon5rcyk9z5jm6r9jjf85vmvw5t2aacdeupw6" :init="tinymceSettings"></editor> -->
            <tinymce id="d1" v-model="dataItem.desc"></tinymce>
            <!-- <textarea v-model="dataItem.desc"></textarea> -->
            <!-- <v-text-field v-model="dataItem.desc" label="Descriptions"></v-text-field> -->
          </v-flex>
        </v-layout>
      </v-container>
    </v-card-text>
    <v-card-title>
      <div class="flex text-xs-right">
        <v-tooltip bottom>
          <v-btn slot="activator" color="primary" small fab flat>
            <i class="material-icons">save</i>
          </v-btn>
          <span>Save</span>
        </v-tooltip>
        <v-tooltip bottom>
          <v-btn slot="activator" color="primary" small fab flat>
            <i class="material-icons">clear</i>
          </v-btn>
          <span>Back</span>
        </v-tooltip>
      </div>
      <!-- <v-spacer></v-spacer> -->
      <!-- <v-btn color="blue darken-1" flat @click.native="save">Save</v-btn> -->
      <!-- <v-btn color="blue darken-1" flat @click.native="close">Cancel</v-btn> -->
    </v-card-title>
  </v-card>
</template>

<script>
import tinymce from "vue-tinymce-editor";
export default {
    components: {
        tinymce
    },
    data: () => ({
        dataItem: {}
    }),
    methods: {
        formTitle() {
            return this.editedIndex === -1 ? "New Item" : "Edit Item";
        },
    }
}
</script>

<style>
</style>
