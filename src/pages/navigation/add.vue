<template>
  <v-dialog v-model="localDialog" :persistent="loading" max-width="1024px">
    <!-- <v-btn slot="activator" color="primary" dark class="mb-2">New Item</v-btn> -->
    <v-card>
      <v-card-title class="headline grey lighten-2">
        {{ item.id ?
        $store.getters.languages('global.details') :
        $store.getters.languages('global.add') }}
      </v-card-title>
      <v-card-text>
        <v-form v-model="valid" ref="form">
          <v-container grid-list-md>
            <v-tabs v-model="tabActive" color="secondary" dark>
              <v-tab>{{$store.getters.languages('global.main_info')}}</v-tab>
              <v-tab>{{$store.getters.languages('global.note')}}</v-tab>
              <v-tab-item>
                <v-layout wrap class="pt-2">
                  <v-flex xs12 sm6 md6>
                    <v-text-field v-model.trim="item.title" :rules="[v => !!v || $store.getters.languages('error.required')]"
                      :label="$store.getters.languages('global.navigation_title')"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md6>
                    <v-select :items="items" v-model="dependent_selected" multiple
                      :menu-props="{ maxHeight: '400' }" item-value="id" item-text="title"
                      persistent-hint :hint="$store.getters.languages(['global.dependent_select'])"
                      :label="$store.getters.languages('global.dependent')" :rules="[v => v.length>0 || $store.getters.languages('error.required_select')]"></v-select>
                  </v-flex>
                  <v-flex xs12 sm4 md4>
                    <v-text-field v-model.trim="item.code" class="text-color-initial"
                      :disabled="item.id?true:false" :label="$store.getters.languages(['global.code'])"
                      :rules="[v => !!v || $store.getters.languages('error.required'), isExist||$store.getters.languages('error.exist')]"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm4 md4>
                    <v-text-field v-model.trim="item.url" :rules="[v => !!v || $store.getters.languages('error.required')]"
                      :label="$store.getters.languages('global.url')"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm4 md4>
                    <v-select v-model.trim="item.app_key" :items="$store.state.navigation.app_key"
                      item-value="id" item-text="title" :hide-selected="true" :label="$store.getters.languages(['global.position'])"
                      :rules="[v => !!v || $store.getters.languages('error.required_select')]"></v-select>
                  </v-flex>
                  <v-flex xs12 sm4 md4>
                    <v-text-field v-model.trim="item.push" label="Push"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm4 md4>
                    <v-text-field v-model.trim="item.go" label="Go"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm4 md4>
                    <v-text-field v-model.trim="item.store" label="Store"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md6 class="text-append-icon">
                    <v-text-field v-model.trim="item.icon" label="Icon"></v-text-field>
                    <div class="icon" v-html="item.icon"></div>
                  </v-flex>
                  <!-- <v-flex xs12 md6 sm6>
                    <v-select :items="permissions" v-model="permissions_selected"
                      multiple :menu-props="{ maxHeight: '400' }" item-text="title"
                      item-value="code" :label="$store.getters.languages('permissions.title'])"
                      persistent-hint :hint="$store.getters.languages('permissions.select'])"
                      :rules="[v => v.length>0 || $store.getters.languages('error.required_select'])]"></v-select>
                  </v-flex> -->
                  <v-flex xs6 sm3 md3>
                    <v-text-field type="number" v-model.trim="item.orders" :label="$store.getters.languages('global.orders')"
                      :rules="[v => !!v || $store.getters.languages('error.required')]"></v-text-field>
                  </v-flex>
                  <v-flex xs6 sm3 md3>
                    <v-switch color="primary" :label="item.flag===1?$store.getters.languages('global.show'):$store.getters.languages('global.hide')"
                      :true-value="1" :false-value="0" v-model.number="item.flag"></v-switch>
                  </v-flex>
                  <!-- <v-flex xs12 sm6 md6>
                  </v-flex> -->
                  <v-flex xs12 sm6 md4>
                    <upload-files @handleUpload="uploadFiles=$event" :buttonUse="false"
                      :multiple="false" :http="vnptbkn" extension="image/*" :basePath="uploadFiles.basePath"
                      :autoName="true" :buttonText="$store.getters.languages('global.upload_drag')"></upload-files>
                  </v-flex>
                  <v-flex xs12 sm6 md8>
                    <display-files :files="uploadFiles.files" :baseUrl="vnptbkn.defaults.host"
                      :isShowName="false" classes="w-50"></display-files>
                  </v-flex>
                </v-layout>
              </v-tab-item>
              <v-tab-item>
                <v-layout wrap class="pt-2">
                  <v-flex xs12 sm12 md12>
                    <v-textarea v-model.trim="item.descs" auto-grow box :placeholder="$store.getters.languages(['global.input',' ','global.descs'])"></v-textarea>
                  </v-flex>
                </v-layout>
              </v-tab-item>
            </v-tabs>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" flat @click.native="onSave" :loading="loading">
          {{$store.getters.languages('global.update')}}
        </v-btn>
        <v-btn color="secondary" flat @click.native="localDialog=false" :disabled="loading">
          {{$store.getters.languages('global.back')}}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { vnptbkn } from '@/plugins/axios-config'
import uploadFiles from '@/components/upload-files'
import displayFiles from '@/components/display-files'
export default {
  components: {
    'upload-files': uploadFiles,
    'display-files': displayFiles
  },
  props: {
    dialog: { type: Boolean, default: false }
  },
  data: () => ({
    loading: false,
    valid: false,
    isExist: true,
    localDialog: false,
    tabActive: null,
    vnptbkn: vnptbkn,
    dependent_selected: [],
    uploadFiles: { files: [], basePath: 'navigation' },
  }),
  created() {
    this.$store.dispatch('navigation/item')
  },
  computed: {
    item() {
      const rs = this.$store.state.navigation.item
      return rs
    },
    items() {
      var rs = this.$store.getters['navigation/getDependent']({ sortBy: 'parent_id', find: { flag: 1 } })
      rs = [...[{ id: 0, title: `-- ${this.$store.getters.languages('global.navigation_main')} --` }], ...rs]
      return rs
    }
  },
  watch: {
    dialog(val) { this.localDialog = val },
    localDialog(val) {
      this.reset();
      this.$emit('handleDialog', val)
    },
    uploadFiles: {
      handler(val) {
        if (val.files && val.files.length > 0)
          this.item.image = val.files[0].full_name
      },
      deep: true
    },
    item: {
      handler(val) {
        if (this.item.dependent)
          this.dependent_selected = this.item.dependent.trim(',').split(',').map(e => parseInt(e))
        if (this.item.code) {
          this.item.code = this.item.code.toString().toLowerCase()
          if (!this.item.id) this.$store.dispatch('navigation/existCode').then((rs) => { this.isExist = rs })
        }
      },
      deep: true
    }
  },
  methods: {
    onSave() {
      this.loading = true
      if (this.valid) {
        this.item.dependent = `,${this.dependent_selected.join(',')},`
        if (this.item.id) this.$store.dispatch('navigation/update').then(this.loading = false)
        else this.$store.dispatch('navigation/insert').then(rs => { this.reset() })
      }
    },
    reset() {
      this.loading = false
      this.$refs.form.resetValidation()
      if (!this.item.id || !this.localDialog) {
        this.$store.dispatch('navigation/item')
        this.dependent_selected = [0]
      }
    }
  }
}
</script>

<style>
</style>
