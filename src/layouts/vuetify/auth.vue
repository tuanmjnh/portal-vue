<template>
  <div>
    <!-- {{$store.getters.languages('auth.title')}} -->
    <!-- {{$store.state.$languages.auth.title}} -->
    <v-layout wrap class="align-center justify-center">
      <v-flex xs12 sm4>
        <v-card>
          <!-- <v-img src="https://cdn.vuetifyjs.com/images/cards/desert.jpg" aspect-ratio="2.75"></v-img> -->
          <v-card-title primary-title>
            <div>
              <h3 class="headline mb-0">{{$store.getters.languages('auth.title')}}</h3>
            </div>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm12 md12>
                  <v-text-field v-model="item.username" :label="$store.getters.languages('auth.username')"
                    v-focus.vuetify></v-text-field>
                </v-flex>
                <v-flex xs12 sm12 md12>
                  <v-text-field type="password" v-model="item.password" :label="$store.getters.languages('auth.password')"></v-text-field>
                </v-flex>
                <v-flex xs12 sm12 md12>
                  <div class="spacer"></div>
                  <v-checkbox v-model="item.remember" :label="$store.getters.languages('auth.remember')"></v-checkbox>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <div class="spacer"></div>
            <v-btn flat color="primary" @click="login">{{$store.getters.languages('global.login')}}</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
      <v-flex xs12 sm12></v-flex>
    </v-layout>
    <v-layout wrap class="align-center justify-center">
      <v-flex xs6 sm6 md3>
        <v-select :label="$store.getters.languages('global.languages')" :items="dataLanguages"
          v-model="$store.state.$language" :hide-selected="true" item-text="title"
          item-value="code"></v-select>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
export default {
  data: () => ({
    loading: false,
  }),
  beforeCreate() {
  },
  created() {
    this.$store.dispatch('auth/item')
    // this.$store.dispatch('TEST')
  },
  computed: {
    item() {
      const rs = this.$store.state.auth.item
      return rs
    },
    dataLanguages() {
      const rs = this.$store.state.languages.items
      return rs
    },
    language() {
      const rs = this.$store.state.$language
      return rs
    },
    languages() {
      const rs = this.$store.state.$languages
      return rs
    },
  },
  watch: {
    language(val) {
      this.$store.dispatch('setLanguage')
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
