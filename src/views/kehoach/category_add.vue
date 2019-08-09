<template>
  <v-dialog v-model="$store.state.category.dialog" max-width="1024px" persistent>
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
              <v-tab>{{$languages.get('global.note')}}</v-tab>
              <v-tab-item>
                <v-layout wrap class="pt-2">
                  <v-flex xs12 sm6 md6>
                    <v-text-field v-model.trim="item.title" :rules="[v=>!!v||$languages.get('error.required')]"
                      :label="$languages.get('category.name')"></v-text-field>
                  </v-flex>
                  <!-- <v-flex xs12 sm6 md6>
                    <v-select :items="items" v-model="dependent_selected" multiple
                      :menu-props="{maxHeight:'400'}" item-value="id" item-text="title"
                      persistent-hint :hint="$languages.get('global.dependent_select')"
                      :label="$languages.get('global.dependent')" :rules="[v=>v.length>0||$languages.get('error.required_select')]"></v-select>
                  </v-flex> -->
                  <!-- <v-flex xs12 sm4 md4>
                    <v-select :items="code_category" v-model="item.code" :label="$languages.get('category.group')"
                      :rules="[v=>!!v||$languages.get('error.required_select')]"></v-select>
                  </v-flex> -->
                  <!-- <v-flex xs12 sm6 md6>
                    <v-text-field v-model.trim="item.url" :rules="[v =>!!v||$languages.get('error.required')]"
                      :label="$languages.get('global.url')"></v-text-field>
                  </v-flex> -->
                  <!-- <v-flex xs12 sm4 md4>
                    <v-select v-model.trim="item.app_key" :items="$store.state.category.app_key"
                      item-value="id" item-text="title" :hide-selected="true" :label="$languages.get('global.position'])"
                      :rules="[v => !!v || $languages.get('error.required_select')]"></v-select>
                  </v-flex> -->
                  <!-- <v-flex xs12 sm6 md6 class="text-append-icon">
                    <v-text-field v-model.trim="item.icon" label="Icon"></v-text-field>
                    <div class="icon" v-html="item.icon"></div>
                  </v-flex> -->
                  <!-- <v-flex xs12 md6 sm6>
                    <v-select :items="permissions" v-model="permissions_selected"
                      multiple :menu-props="{ maxHeight: '400' }" item-text="title"
                      item-value="code" :label="$languages.get('permissions.title'])"
                      persistent-hint :hint="$languages.get('permissions.select'])"
                      :rules="[v => v.length>0 || $languages.get('error.required_select'])]"></v-select>
                  </v-flex> -->
                  <v-flex xs6 sm3 md3>
                    <v-text-field type="number" v-model.trim="item.orders" :label="$languages.get('global.orders')"
                      :rules="[v =>!!v||$languages.get('error.required')]"></v-text-field>
                  </v-flex>
                  <v-flex xs6 sm3 md3>
                    <v-switch color="primary"
                      :label="item.flag===1?$languages.get('global.show'):$languages.get('global.hide')" :true-value="1"
                      :false-value="0" v-model.number="item.flag"></v-switch>
                  </v-flex>
                  <!-- <v-flex xs12 sm12 md12 v-if="item.id">
                    {{$languages.get('global.contract')}}: <a class="mx-0 v-btn v-btn--icon theme--info"
                      :href="`${http.defaults.host}/${item.attach}`" target="_blank"><i
                        class="material-icons">attachment</i></a>
                  </v-flex> -->
                  <!-- <v-flex xs10 sm6 md6 v-if="item.attach">
                    <v-text-field v-model="item.attach" :label="" :disabled="true" class="text-color-initial"
                      prepend-icon="attachment"></v-text-field>
                  </v-flex> -->
                  <v-flex xs1 sm1 md1 v-if="item.title">
                    <upload-files :files.sync="attach_upload.files" :http="http" :fileName="item.title.convertToAscii()"
                      :autoName="false" :buttonUse="true" :loading.sync="attach_upload.loading"
                      :buttonText="item.id?$languages.get('global.upload_btn'):$languages.get('global.upload_drag')"
                      :basePath="attach_upload.basePath" :multiple="false"></upload-files>
                  </v-flex>
                  <v-flex xs12 sm6 md6 v-if="item.attach">
                    <p style="position:relative;top:13px;">
                      {{$languages.get('global.attach')}}:
                      <a :href="`${http.defaults.host}/${item.attach}`" target="_blank">
                        {{item.attach.replace(attach_upload.basePath+'/','')}}
                      </a>
                    </p>
                  </v-flex>
                  <!-- <v-flex xs12 sm6 md8>
                    <display-files :files="attach_upload.files" :preFixName="attach_upload.basePath"
                      :baseUrl="http.defaults.host" icon="data-type" :isShowName="false"
                      classes="p-10"></display-files>
                  </v-flex> -->
                </v-layout>
              </v-tab-item>
              <v-tab-item>
                <v-layout wrap class="pt-2">
                  <v-flex xs12 sm12 md12>
                    <v-textarea v-model.trim="item.descs" auto-grow box :placeholder="$languages.get('global.note')">
                    </v-textarea>
                  </v-flex>
                </v-layout>
              </v-tab-item>
            </v-tabs>
          </v-container>
        </v-form>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" flat @click.native="onSave" :disabled="!valid" :loading="$store.state.$loadingCommit">
          {{$languages.get('global.update')}}
        </v-btn>
        <v-btn color="secondary" flat @click.native="$store.state.category.dialog=false"
          :disabled="$store.state.$loadingCommit">
          {{$languages.get('global.back')}}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import uploadFiles from '@/components/upload-files'
import displayFiles from '@/components/display-files'
export default {
  components: {
    'upload-files': uploadFiles,
    'display-files': displayFiles
  },
  props: { http: null },
  data: () => ({
    valid: false,
    tabs: null,
    attach_upload: {
      files: [],
      basePath: 'Uploads/Groups/Attach',
      loading: false//true
    }
  }),
  mounted() {
    this.reset()
  },
  computed: {
    item() {
      return this.$store.state.category.item
    }
  },
  watch: {
    attach_upload: {
      handler(val) {
        if (val.files.length > 0)
          this.item.attach = `${this.attach_upload.basePath}/${val.files[0].name}`
      },
      deep: true
    }
  },
  methods: {
    onSave() {
      if (this.valid) {
        this.item.app_key = 'kehoach'
        this.item.dependent = ',501,'
        this.item.url = this.item.title.convertToAscii()
        if (this.item.id) this.$store.dispatch('category/update')
        else this.$store.dispatch('category/insert').then(() => { this.reset() })
      }
    },
    onCheckCode() {
      this.item.code = this.item.code.toString().toLowerCase()
      console.log(this.item.code)
    },
    reset() {
      this.$store.commit('category/SET_ITEM')
      this.attach_upload.files = []
      this.$refs.form.resetValidation()
    }
  }
}
</script>

<style>
</style>
