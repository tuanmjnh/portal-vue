<template>
  <v-dialog v-model="localDialog" max-width="1024px">
    <!-- <v-btn slot="activator" color="primary" dark class="mb-2">New Item</v-btn> -->
    <v-card>
      <v-card-title>
        <span class="headline">{{ item.id ? 'details' : 'add' }}</span>
      </v-card-title>
      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap class="pt-2">
            <v-flex xs12 sm6 md6>
              <v-select label="Modules" :items="modules" v-model="modules_selected"
                item-text="title" item-value="code"></v-select>
            </v-flex>
            <v-flex xs12 sm6 md6>
            </v-flex>
            <v-flex xs12 sm4 md4>
              <v-text-field v-model.trim="item.key" label="Key" :rules="[rules.required.key]"></v-text-field>
            </v-flex>
            <v-flex xs12 sm8 md8>
              <v-text-field v-model.trim="item.value" label="Value" :rules="[rules.required.value]"></v-text-field>
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
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'
export default {
  components: {
    'vue-quill-editor': quillEditor,
  },
  props: {
    dialog: { type: Boolean, default: false }
  },
  data: () => ({
    localDialog: false,
    tabActive: null,
    modules_selected: [],
    rules: {
      required: {
        key: val => !!val || 'Required.',
        value: val => !!val || 'Required.',
      }
    }
  }),
  mounted() {
    this.$store.dispatch('language_items/item')
    if (this.modules && this.modules.length < 1) this.$store.dispatch('modules/select')
  },
  created() {
  },
  computed: {
    item() {
      var item = this.$store.state.language_items.item
      if (item.attach) item.attach_file = item.attach.replace('language_items/', '')
      return item
    },
    modules() {
      var filter = { sortBy: 'orders', find: { flag: 1 } };
      var item = this.$store.getters['modules/getFilter'](filter)
      return item
    }
  },
  watch: {
    dialog(val) { this.localDialog = val },
    localDialog(val) {
      this.$emit('handleDialog', val)
      if (!val) this.$store.dispatch('language_items/item')
    },
    uploadFiles: {
      handler(val) {
        if (val.files && val.files.length > 0)
          this.item.attach = val.files[0].full_name
      },
      deep: true
    }
  },
  methods: {
    handleSave() {
      if (this.item.id) this.$store.dispatch('language_items/update')
      else this.$store.dispatch('language_items/insert').then((result) => {
        this.$store.dispatch('language_items/item')
      })
    },
    checkExistCode() {
      var $this = this;
      this.item.code = this.item.code.toString().toLowerCase()
      if (this.item.code && !this.item.id)
        //setTimeout(function () {
        $this.$store.dispatch('language_items/existCode').then(rs => {
          if (rs) $this.rules.exist.code = true
          else $this.rules.exist.code = 'Exist'
        })
      //}, 1000);
    }
  }
}
</script>

<style>
</style>
