<template>
  <v-layout class="align-center justify-center">
    <v-flex xs12 sm4>
      <v-card>
        <!-- <v-img src="https://cdn.vuetifyjs.com/images/cards/desert.jpg" aspect-ratio="2.75"></v-img> -->
        <v-card-title primary-title>
          <div>
            <h3 class="headline mb-0">Đăng nhập hệ thống</h3>
          </div>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm12 md12>
                <v-text-field v-model="item.username" label="Tài khoản" v-focus.vuetify></v-text-field>
              </v-flex>
              <v-flex xs12 sm12 md12>
                <v-text-field type="password" v-model="item.password" label="Mật khẩu"></v-text-field>
              </v-flex>
              <v-flex xs12 sm12 md12>
                <div class="spacer"></div>
                <v-checkbox v-model="item.remember" label="Ghi nhớ"></v-checkbox>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <div class="spacer"></div>
          <v-btn flat color="primary" @click="login">Đăng nhập</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  data: () => ({
    loading: false,
  }),
  created() {
    this.$store.dispatch('auth/item')
  },
  computed: {
    item() {
      var item = this.$store.state.auth.item
      return item
    }
  },
  methods: {
    login() {
      this.$store.dispatch('auth/login').then(() => { this.$router.push('/') })
    }
  }
}
</script>

<style>
</style>
