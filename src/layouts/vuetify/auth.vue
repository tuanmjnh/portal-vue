<template>
  <div>
    <v-layout wrap class="align-center justify-center">
      <v-flex xs12 sm4>
        <v-card>
          <!-- <v-img src="https://cdn.vuetifyjs.com/images/cards/desert.jpg" aspect-ratio="2.75"></v-img> -->
          <v-card-title primary-title>
            <div>
              <h3 class="headline mb-0">{{$store.state.$languages.auth.title}}</h3>
            </div>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm12 md12>
                  <v-text-field v-model="item.username" :label="$store.state.$languages.auth.username" v-focus.vuetify></v-text-field>
                </v-flex>
                <v-flex xs12 sm12 md12>
                  <v-text-field type="password" v-model="item.password" :label="$store.state.$languages.auth.password"></v-text-field>
                </v-flex>
                <v-flex xs12 sm12 md12>
                  <div class="spacer"></div>
                  <v-checkbox v-model="item.remember" :label="$store.state.$languages.auth.remember"></v-checkbox>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <div class="spacer"></div>
            <v-btn flat color="primary" @click="login">{{$store.state.$languages.global.login}}</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
      <v-flex xs12 sm12></v-flex>
    </v-layout>
    <v-layout wrap class="align-center justify-center">
      <v-flex xs6 sm6 md3>
        <v-select label="languages" :items="languages" v-model="current_language"
          :hide-selected="true" item-text="title" item-value="code"></v-select>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
export default {
  data: () => ({
    loading: false,
    current_language: ''
  }),
  beforeCreate() {
  },
  created() {
    this.current_language = this.language
    this.$store.dispatch('auth/item')
  },
  computed: {
    item() {
      var rs = this.$store.state.auth.item
      return rs
    },
    languages() {
      var rs = this.$store.state.languages.items
      return rs
    },
    language_items() {
      var rs = this.$store.state._language_items
      return rs
    },
    language() {
      var rs = this.$store.state.$language
      return rs
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
