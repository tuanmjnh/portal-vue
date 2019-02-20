<template>
  <div>
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
