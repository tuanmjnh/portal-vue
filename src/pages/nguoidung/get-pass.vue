<template>
  <v-card>
    <v-card-title class="headline">
      Lấy mật khẩu tài khoản
    </v-card-title>
    <v-card-text>
      <v-container grid-list-md>
        <v-form v-model="valid" ref="form">
          <v-layout wrap>
            <!-- <v-flex xs12 sm6 md6> -->
            <v-flex xs12 sm6 md6>
              <v-select :items="donvi" v-model="params.donvi_id" item-text="ten_dv"
                item-value="donvi_id" :label="$store.getters.languages('global.local')"></v-select>
            </v-flex>
            <v-flex xs12 sm6 md6 v-if="!$store.state.$loadingGet">
              <v-select :items="nguoidung" v-model="params.ma_nd" item-value="ma_nd"
                item-text="ten_nd" label="Mã người dùng"></v-select>
            </v-flex>
            <v-flex xs12 sm6 md6 v-if="params.ma_nd">
              <v-text-field v-model="params.ma_nd" disabled="" label="Tài khoản người dùng"
                class="text-color-initial"></v-text-field>
            </v-flex>
            <v-flex xs12 sm6 md6 v-if="matkhau">
              <v-text-field v-model="matkhau" disabled="" label="Mật khẩu người dùng"
                class="text-color-initial"></v-text-field>
            </v-flex>
            <!-- </v-flex> -->
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
  data: () => ({
    valid: false,
    matkhau: '',
    nguoidung: [],
    totalItems: 0,
    params: {
      loading: true,
      rowsPerPage: 0,
      flag: 1,
      donvi_id: 5588,
      ma_nd: '',
    }
  }),
  created() {
    this.$store.dispatch('nguoidung/select', this.params).then((x) => {
      // if (x && x.total) this.totalItems = x.total
      if (x) this.nguoidung = x.data
    })
  },
  computed: {
    donvi() {
      return this.$store.getters['donvi/getFilter']({ sortBy: 'ma_dvi' })
    }
  },
  watch: {
    params: {
      handler(val) {
        this.$store.dispatch('nguoidung/select', this.params).then((x) => {
          if (x && x.data) this.nguoidung = x.data
        })
        this.reset()
      },
      deep: true
    }
  },
  methods: {
    onSave(item) {
      if (this.valid) {
        this.$store.dispatch('nguoidung/GetPassword', this.params).then((x) => {
          this.matkhau = x.GIAIMA_MK
        })
      }
    },
    reset() {
      this.matkhau = ''
    }
  }
}
</script>

<style>
</style>