<template>
  <v-dialog v-model="$store.state.roles.dialog" :persistent="loading" max-width="1024px">
    <!-- <v-btn slot="activator" color="primary" dark class="mb-2">New Item</v-btn> -->
    <v-card>
      <v-card-title class="headline grey lighten-2">
        {{ item.id ?
        $store.getters.languages(['global.details']) :
        $store.getters.languages(['global.add']) }}
      </v-card-title>
      <v-card-text>
        <v-form v-model="valid" ref="form">
          <v-container grid-list-md>
            <v-tabs v-model="tabActive" color="secondary" dark>
              <v-tab>{{$store.getters.languages(['global.main_info'])}}</v-tab>
              <v-tab>{{$store.getters.languages(['global.roles'])}}</v-tab>
              <v-tab-item>
                <v-layout wrap class="pt-2">
                  <v-flex xs12 sm6 md6>
                    <v-text-field v-model.trim="item.name" :rules="[v => !!v || $store.getters.languages('error.required')]"
                      :label="$store.getters.languages(['roles.name'])"></v-text-field>
                  </v-flex>
                  <!-- <v-flex xs12 md6 sm6>
                    <v-select :items="permissions" v-model="permissions_selected"
                      multiple :menu-props="{ maxHeight: '400' }" item-text="title"
                      item-value="code" :label="$store.getters.languages(['permissions.title'])"
                      persistent-hint :hint="$store.getters.languages(['permissions.select'])"
                      :rules="[v => v.length>0 || $store.getters.languages(['error.required_select'])]"></v-select>
                  </v-flex> -->
                  <v-flex xs12 sm6 md6>
                  </v-flex>
                  <v-flex xs6 sm3 md3>
                    <v-text-field type="number" v-model.trim="item.orders" :label="$store.getters.languages(['global.orders'])"
                      :rules="[v => !!v || $store.getters.languages('error.required')]"></v-text-field>
                  </v-flex>
                  <v-flex xs6 sm3 md3>
                    <v-switch color="primary" :label="item.flag===1?$store.getters.languages(['global.show']):$store.getters.languages(['global.hide'])"
                      :true-value="1" :false-value="0" v-model.number="item.flag"></v-switch>
                  </v-flex>
                  <v-flex xs12 sm12 md12>
                    <v-textarea v-model.trim="item.descs" auto-grow box :placeholder="$store.getters.languages(['global.input',' ','global.descs'])"></v-textarea>
                  </v-flex>
                  <!-- <v-flex xs12 sm6 md6>
                  <v-text-field v-model.trim="item.attach_file" label="Tệp dữ liệu"
                    :disabled="true" class="text-color-initial"></v-text-field>
                </v-flex> -->
                </v-layout>
              </v-tab-item>
              <v-tab-item>
                <!-- <list-select :itemsLeft.sync="modules_items" :itemsRight.sync="modules_selected"
                  :checkbox="true" /> -->
                <v-layout wrap class="pt-2">
                  <v-flex xs12 sm12 md12>
                    <table class="v-datatable v-table theme--light custom-v-checkbox">
                      <thead>
                        <tr>
                          <th class="column text-xs-left">#</th>
                          <th class="column text-xs-left" v-for="(item,index) in permissions"
                            :key="index">
                            <v-checkbox :value="`${item.code}.all`" :label="item.code"></v-checkbox>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(item,index) in modules" :key="index">
                          <td>{{$store.getters.languages(`modules.${item.code}`)}}</td>
                          <td v-for="(per,index) in permissions" :key="index">
                            <v-checkbox :value="`${item.code}.${per.code}`" :label="per.code"></v-checkbox>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </v-flex>
                  <!-- <v-flex xs12 sm5 md5>
                    <div v-for="(item,index) in modules" :key="index" class="v-list__tile theme--light">
                      {{item.title}}
                    </div>
                  </v-flex> -->
                </v-layout>
              </v-tab-item>
            </v-tabs>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" flat @click.native="onSave" :loading="loading">
          {{$store.getters.languages(['global.update'])}}
        </v-btn>
        <v-btn color="secondary" flat @click.native="$store.state.roles.dialog=false"
          :disabled="loading">
          {{$store.getters.languages(['global.back'])}}
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
import listSelect from '@/components/list-select'
export default {
  components: {
    'vue-quill-editor': quillEditor,
    'list-select': listSelect
  },
  data: () => ({
    loading: false,
    valid: false,
    isExist: true,
    tabActive: null,
    list_selected: [],
    permissions: [],
    permissions_selected: []
  }),
  created() {
    this.$store.dispatch('roles/item')
    var _modules = []
    // modules
    if (this.$store.state.modules.isGetFirst) this.$store.dispatch('modules/select')

    // permissions
    if (this.$store.state.permissions.isGetFirst) this.$store.dispatch('permissions/select').then(() => {
      this.permissions = this.$store.getters['permissions/getFilter']({ sortBy: 'orders', find: { flag: 1 } })
    })
    else this.permissions = this.$store.getters['permissions/getFilter']({ sortBy: 'orders', find: { flag: 1 } })
    _modules.forEach(e => {
      this.modules.push({
        code: e.code,
        permissions: this.permissions.map(x => ({ code: x.code }))
      })
    })
  },
  computed: {
    item() {
      const item = this.$store.state.roles.item
      return item
    },
    modules() {
      const rs = this.$store.getters['modules/getFilter']({ sortBy: 'orders', find: { flag: 1 } })
      return rs.map(x => ({
        code: x.code,
        title: x.title,
        permissions: x.permissions.trim(',').split(',')
      }))
    }
    // navigation() {
    //   var filter = { sortBy: 'orders', find: { flag: 1 } };
    //   var item = this.$store.getters['navigation/getFilter'](filter)
    //   return item
    // },
    // permissions() {
    //   var filter = { sortBy: 'orders', find: { flag: 1 } };
    //   var item = this.$store.getters['permissions/getFilter'](filter)
    //   return item
    // }
  },
  watch: {
    uploadFiles: {
      handler(val) {
        if (val.files && val.files.length > 0)
          this.item.image = val.files[0].full_name
      },
      deep: true
    },
    item: {
      handler(val) {
        // if (this.permissions && this.permissions.length > 0) {
        //   this.permissions_selected = []
        //   this.permissions.forEach(e => {
        //     if (val.permissions.indexOf(`,${e.code},`) > -1) this.permissions_selected.push(e.code)
        //   });
        // }
      },
      deep: true
    }
  },
  methods: {
    onSave() {
      this.loading = true
      if (this.valid) {
        // this.item.permissions = `,${this.permissions_selected.join(',')},`
        if (this.item.id) this.$store.dispatch('roles/update').then(this.loading = false)
        else this.$store.dispatch('roles/insert').then((rs) => { this.reset() })
      }
    },
    reset() {
      this.loading = false
      if (!this.item.id || !this.$store.state.roles.dialog) this.$store.dispatch('roles/item')
      this.$refs.form.resetValidation()
      this.permissions_selected = []
    }
  }
}
</script>

<style>
</style>
