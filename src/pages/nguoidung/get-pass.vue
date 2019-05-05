<template>
  <v-card>
    <v-card-title class="headline">
      Lấy mật khẩu tài khoản
    </v-card-title>
    <v-card-text>
      <v-container grid-list-md>
        <v-form v-model="valid" ref="form">
          <v-layout wrap>
            <v-flex xs12 sm6 md6>
              <v-text-field v-model.trim="ma_nd" label="Nhập mã người dùng" :rules="[v=>!!v||$store.getters.languages('error.required')]"></v-text-field>
            </v-flex>
            <v-flex xs12 sm6 md6>
              <v-text-field v-model.trim="mk" label="Mật khẩu người dùng" class="text-color-initial"></v-text-field>
            </v-flex>
          </v-layout>
        </v-form>
      </v-container>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="primary" flat @click.native="onSave" :disabled="!valid" :loading="$store.state.$loadingCommit">
        {{$store.getters.languages('global.accept')}}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  data: () => {
    return {
      valid: false,
      ma_nd: '',
      mk: ''
    }
  },
  methods: {
    onSave(item) {
      if (this.valid) {
        this.$store.dispatch('nguoidung/GetPassword', { loading: true, ma_nd: this.ma_nd }).then((x) => {
          this.mk = x.GIAIMA_MK
        })
      }
    }
  }
}
</script>

<style>
</style>