<template>
  <v-dialog v-model="$store.state.roles.dialog" max-width="1024px" persistent>
    <v-card>
      <v-card-title class="headline grey lighten-2">
        {{ item.id ?
        $languages.get('global.details') :
        $languages.get('global.add') }}
      </v-card-title>
      <v-card-text class="p-0">
        <v-form v-model="valid" ref="form">
          <v-container grid-list-md>
            <v-tabs v-model="tabs" color="secondary" dark>
              <v-tab>{{$languages.get('global.main_info')}}</v-tab>
              <v-tab>{{$languages.get('global.roles')}}</v-tab>
              <v-tab>{{$languages.get('global.note')}}</v-tab>
              <v-tab-item>
                <v-layout wrap class="pt-2">
                  <v-flex xs12 sm6 md6>
                    <v-text-field v-model.trim="item.name" :rules="[v=>!!v||$languages.get('error.required')]"
                      :label="$languages.get('roles.name')"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md6>
                    <v-text-field v-model.trim="item.code" :rules="[v=>!!v||$languages.get('error.required')]"
                      :label="$languages.get('global.code')"></v-text-field>
                  </v-flex>
                  <!-- <v-flex xs12 md6 sm6>
                    <v-select :items="permissions" v-model="$store.state.roles.roles_selected"
                      multiple :menu-props="{ maxHeight: '400' }" item-text="title"
                      item-value="code" :label="$languages.get('permissions.title'])"
                      persistent-hint :hint="$languages.get('permissions.select'])"
                      :rules="[v => v.length>0 || $languages.get('error.required_select'])]"></v-select>
                  </v-flex> -->
                  <v-flex xs6 sm2 md2>
                    <v-text-field type="number" v-model.trim="item.levels" :label="$languages.get('global.levels')"
                      :rules="[v=>!!v||$languages.get('error.required')]"></v-text-field>
                  </v-flex>
                  <v-flex xs6 sm2 md2>
                    <v-text-field type="number" v-model.trim="item.orders" :label="$languages.get('global.orders')"
                      :rules="[v=>!!v||$languages.get('error.required')]"></v-text-field>
                  </v-flex>
                  <v-flex xs6 sm8 md8>
                    <v-switch color="primary" :label="item.flag===1?$languages.get('global.show'):$languages.get('global.hide')"
                      :true-value="1" :false-value="0" v-model.number="item.flag"></v-switch>
                  </v-flex>
                  <v-flex xs6 sm4 md4>
                    <v-text-field v-model.trim="$store.state.roles.item.color.cover"
                      :label="$languages.get('global.color_cover')" :rules="[v=>!!v||$languages.get('error.required')]"></v-text-field>
                  </v-flex>
                  <v-flex xs6 sm4 md4>
                    <v-text-field v-model.trim="$store.state.roles.item.color.text"
                      :label="$languages.get('global.color_text')" :rules="[v=>!!v||$languages.get('error.required')]"></v-text-field>
                  </v-flex>
                  <v-flex xs6 sm4 md4 class="mt-3">
                    <v-chip small :color="$store.state.roles.item.color.cover"
                      :text-color="$store.state.roles.item.color.text">
                      {{item.name}}
                    </v-chip>
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
                          <th class="column text-xs-left">{{$languages.get('roles.name')}}</th>
                          <th class="column text-xs-left">{{$languages.get('roles.code')}}</th>
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
                          <td>{{item.code}}</td>
                          <td v-for="(per,index) in permissions" :key="index">
                            <v-checkbox v-model="$store.state.roles.roles_selected"
                              :value="`${item.code}.${per.code}`" :label="$store.getters.languages(`roles.${per.code}`)"></v-checkbox>
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
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" flat @click.native="onSave" :disabled="!valid"
          :loading="$store.state.$loadingCommit">
          {{$languages.get('global.update')}}
        </v-btn>
        <v-btn color="secondary" flat @click.native="$store.state.roles.dialog=false"
          :disabled="$store.state.$loadingCommit">
          {{$languages.get('global.back')}}
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
// import listSelect from '@/components/list-select'
export default {
  components: {
    'vue-quill-editor': quillEditor,
    // 'list-select': listSelect
  },
  data: () => ({
    valid: false,
    tabs: null,
    // roles_selected: [],
    // color: {}
  }),
  mounted() {
    this.reset()
  },
  computed: {
    dialog() {
      return this.$store.state.roles.dialog
    },
    item() {
      return this.$store.state.roles.item
    },
    modules() {
      return this.$store.getters['modules/getFilter']({ sortBy: 'orders', find: { flag: 1 } }).sortByKey('orders')
      // return rs.map(x => ({
      //   orders:x.orders,
      //   code: x.code,
      //   title: x.title,
      //   permissions: x.permissions.trim(',').split(',')
      // })).sortByKey
    },
    permissions() {
      return this.$store.getters['permissions/getFilter']({ sortBy: 'orders', find: { flag: 1 } }).sortByKey('orders')
    }
    // navigation() {
    //   var filter = { sortBy: 'orders', find: { flag: 1 } };
    //   var item = this.$store.getters['navigation/getFilter'](filter)
    //   return item
    // },
  },
  watch: {
    dialog(val) {
      if (!val) this.reset()
    },
    // item: {
    //   handler(val) {
    //     // if (JSON.parse(val.color) != null)
    //     //   this.color = JSON.parse(val.color)
    //     // this.roles_selected = this.item.roles.trim(',').split(',')
    //     // if (this.permissions && this.permissions.length > 0) {
    //     //   this.roles_selected = []
    //     //   this.permissions.forEach(e => {
    //     //     if (val.permissions.indexOf(`,${e.code},`) > -1) this.roles_selected.push(e.code)
    //     //   });
    //     // }
    //   },
    //   deep: true
    // }
  },
  methods: {
    onSave() {
      if (this.valid) {
        if (this.item.id) this.$store.dispatch('roles/update')
        else this.$store.dispatch('roles/insert').then(() => { this.reset() })
      }
    },
    selectAll(event, item) {
      if (event)
        this.modules.forEach(e => {
          if (this.$store.state.roles.roles_selected.indexOf(`${e.code}.${item}`) < 0)
            this.$store.state.roles.roles_selected.push(`${e.code}.${item}`)
        })
      else
        this.modules.forEach(e => {
          this.$store.state.roles.roles_selected.splice(this.$store.state.roles.roles_selected.indexOf(`${e.code}.${item}`), 1)
        })
    },
    reset() {
      this.$store.commit('roles/SET_ITEM')
      // this.roles_selected = []
      // this.color = { cover: "default", text: "white" }
      this.$refs.form.resetValidation()
    }
  }
}
</script>

<style>
</style>
