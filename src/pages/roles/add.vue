<template>
  <v-dialog v-model="$store.state.roles.dialog" :persistent="$store.state.$loadingCommit"
    max-width="1024px">
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
              <v-tab>{{$store.getters.languages(['global.note'])}}</v-tab>
              <v-tab-item>
                <v-layout wrap class="pt-2">
                  <v-flex xs12 sm6 md6>
                    <v-text-field v-model.trim="item.name" :rules="[v => !!v || $store.getters.languages('error.required')]"
                      :label="$store.getters.languages(['roles.name'])"></v-text-field>
                  </v-flex>
                  <!-- <v-flex xs12 md6 sm6>
                    <v-select :items="permissions" v-model="roles_selected"
                      multiple :menu-props="{ maxHeight: '400' }" item-text="title"
                      item-value="code" :label="$store.getters.languages(['permissions.title'])"
                      persistent-hint :hint="$store.getters.languages(['permissions.select'])"
                      :rules="[v => v.length>0 || $store.getters.languages(['error.required_select'])]"></v-select>
                  </v-flex> -->
                  <v-flex xs6 sm3 md3>
                    <v-text-field type="number" v-model.trim="item.orders" :label="$store.getters.languages(['global.orders'])"
                      :rules="[v => !!v || $store.getters.languages('error.required')]"></v-text-field>
                  </v-flex>
                  <v-flex xs6 sm3 md3>
                    <v-switch color="primary" :label="item.flag===1?$store.getters.languages(['global.show']):$store.getters.languages(['global.hide'])"
                      :true-value="1" :false-value="0" v-model.number="item.flag"></v-switch>
                  </v-flex>
                  <v-flex xs6 sm6 md6>
                    <v-text-field v-model.trim="color.cover" :label="$store.getters.languages(['global.color_cover'])"
                      :rules="[v => !!v || $store.getters.languages('error.required')]"></v-text-field>
                  </v-flex>
                  <v-flex xs6 sm6 md6>
                    <v-text-field v-model.trim="color.text" :label="$store.getters.languages(['global.color_text'])"
                      :rules="[v => !!v || $store.getters.languages('error.required')]"></v-text-field>
                  </v-flex>
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
                            <v-checkbox :label="$store.getters.languages(`roles.${item.code}`)"
                              @change="selectAll($event,item.code)"></v-checkbox>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(item,index) in modules" :key="index">
                          <td>{{$store.getters.languages(`modules.${item.code}`)}}</td>
                          <td v-for="(per,index) in permissions" :key="index">
                            <v-checkbox v-model="roles_selected" :value="`${item.code}.${per.code}`"
                              :label="$store.getters.languages(`roles.${per.code}`)"></v-checkbox>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </v-flex>
                </v-layout>
              </v-tab-item>
              <v-tab-item>
                <v-flex xs12 sm12 md12>
                  <v-textarea v-model.trim="item.descs" auto-grow box :placeholder="$store.getters.languages(['global.input',' ','global.descs'])"></v-textarea>
                </v-flex>
              </v-tab-item>
            </v-tabs>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" flat @click.native="onSave" :loading="$store.state.$loadingCommit">
          {{$store.getters.languages(['global.update'])}}
        </v-btn>
        <v-btn color="secondary" flat @click.native="$store.state.roles.dialog=false"
          :disabled="$store.state.$loadingCommit">
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
    valid: false,
    isExist: true,
    tabActive: null,
    list_selected: [],
    color: { cover: "default", text: "white" },
    roles_selected: []
  }),
  created() {
    this.$store.dispatch('roles/item')
    var _modules = []
    // modules
    if (this.$store.state.modules.isGetFirst) this.$store.dispatch('modules/select')
    // permissions
    if (this.$store.state.permissions.isGetFirst) this.$store.dispatch('permissions/select')
  },
  computed: {
    dialog() {
      const rs = this.$store.state.roles.dialog
      return rs
    },
    item() {
      const rs = this.$store.state.roles.item
      return rs
    },
    modules() {
      const rs = this.$store.getters['modules/getFilter']({ sortBy: 'orders', find: { flag: 1 } }).sortByKey('orders')
      // return rs.map(x => ({
      //   orders:x.orders,
      //   code: x.code,
      //   title: x.title,
      //   permissions: x.permissions.trim(',').split(',')
      // })).sortByKey
      return rs
    },
    permissions() {
      var rs = this.$store.getters['permissions/getFilter']({ sortBy: 'orders', find: { flag: 1 } }).sortByKey('orders')
      return rs
    }
    // navigation() {
    //   var filter = { sortBy: 'orders', find: { flag: 1 } };
    //   var item = this.$store.getters['navigation/getFilter'](filter)
    //   return item
    // },
  },
  watch: {
    dialog(val) {
      if (!val) this.$store.dispatch('roles/item')
      else this.roles_selected = this.item.roles.trim(',').split(',')
      this.$refs.form.resetValidation()
      //this.roles_selected = []
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
        if (JSON.parse(val.color) != null)
          this.color = JSON.parse(val.color)
        // if (this.permissions && this.permissions.length > 0) {
        //   this.roles_selected = []
        //   this.permissions.forEach(e => {
        //     if (val.permissions.indexOf(`,${e.code},`) > -1) this.roles_selected.push(e.code)
        //   });
        // }
      },
      deep: true
    }
  },
  methods: {
    onSave() {
      if (this.valid) {
        this.item.roles = `,${this.roles_selected.join(',')},`
        this.item.color = JSON.stringify(this.color)
        if (this.item.id) this.$store.dispatch('roles/update')
        else this.$store.dispatch('roles/insert').then(() => {
          this.roles_selected = []
        })
      }
    },
    selectAll(event, item) {
      if (event)
        this.modules.forEach(e => {
          if (this.roles_selected.indexOf(`${e.code}.${item}`) < 0)
            this.roles_selected.push(`${e.code}.${item}`)
        })
      else
        this.modules.forEach(e => {
          this.roles_selected.splice(this.roles_selected.indexOf(`${e.code}.${item}`), 1)
        })
    }
  }
}
</script>

<style>
</style>
