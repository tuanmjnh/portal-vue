<template>
  <div class="mid-center" v-if="$store.state.$loadingGet">
    <v-progress-circular :size="130" :width="10" color="primary" indeterminate></v-progress-circular>
  </div>
  <div v-else>
    <v-card>
      <v-card-title>
        <v-layout wrap class="pt-2">
          <v-flex xs12 sm3 md3>
            <v-switch label="Save refresh form" v-model="isRefreshForm"></v-switch>
          </v-flex>
        </v-layout>
      </v-card-title>
    </v-card>
  </div>
</template>

<script>
export default {
  data: () => ({
    isRefreshForm: false
  }),
  mounted() {
  },
  created() {
  },
  computed: {
  },
  watch: {
  },
  methods: {
  }
}
</script>

<style>
</style>
