<template>
  <div>
    <!-- {{$store.getters.languages(['auth.title')}} -->
    <!-- {{$store.state.$languages.auth.title}} -->
    <v-layout wrap class="align-center justify-center">
      <v-flex xs12 sm4>
        <v-card>
          <!-- <v-img src="https://cdn.vuetifyjs.com/images/cards/desert.jpg" aspect-ratio="2.75"></v-img> -->
          <v-card-title primary-title>
            <div>
              <h3 class="headline mb-0">{{$store.getters.languages(['auth.title'])}}</h3>
            </div>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm12 md12>
                  <v-text-field v-model="item.ma_nd" :label="$store.getters.languages(['auth.username'])"
                    v-focus.vuetify></v-text-field>
                </v-flex>
                <v-flex xs12 sm12 md12>
                  <v-text-field type="password" v-model="item.password" :label="$store.getters.languages(['auth.password'])"></v-text-field>
                </v-flex>
                <v-flex xs12 sm12 md12>
                  <div class="spacer"></div>
                  <v-checkbox v-model="item.matkhau" :label="$store.getters.languages(['auth.remember'])"></v-checkbox>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <div class="spacer"></div>
            <v-btn flat color="primary" @click="signIn">{{$store.getters.languages(['global.signin'])}}</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
      <v-flex xs12 sm12></v-flex>
    </v-layout>
    <v-layout wrap class="align-center justify-center">
      <v-flex xs6 sm6 md3>
        <v-select :items="$store.getters['languages/getFilter']({find:{flag:1}})" v-model="$store.state.$language"
          :hide-selected="true" item-text="title" item-value="code"></v-select>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
export default {
  data: () => ({}),
  beforeCreate() {
    this.$store.commit('auth/SET_ITEM')
    // this.$store.dispatch('TEST')
  },
  computed: {
    item() {
      return this.$store.state.auth.item
    },
    language() {
      return this.$store.state.$language
    }
  },
  watch: {
    language(val) {
      this.$store.dispatch('setLanguage')
    }
  },
  methods: {
    signIn() {
      this.$store.dispatch('auth/signIn', true).then(() => { this.$router.push('/') })
    }
  }
}
</script>

<style>
</style>
