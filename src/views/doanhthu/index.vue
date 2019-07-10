<template>
  <div>
    <v-list>
      <div class="title">
        Doanh thu
      </div>
      <template v-for="(item, index) in category">
        <v-list-tile :key="item.title">
          <!-- <v-list-tile-avatar>
            <img :src="item.avatar">
          </v-list-tile-avatar> -->
          <v-list-tile-content>
            <v-list-tile-title><a :href="`${http.defaults.host}/${item.attach}`" target="_blank">{{item.title}}</a></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider :key="index"></v-divider>
      </template>
    </v-list>
  </div>
</template>

<script>
import { vnptbkn } from '@/plugins/axios-config'
export default {
  data: () => {
    return {
      http: vnptbkn(),
      category: [],
      items: [
        {
          avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
          title: 'Brunch this weekend?',
          subtitle: "<span class='text--primary'>Ali Connors</span> &mdash; I'll be in your neighborhood doing errands this weekend. Do you want to hang out?"
        },
        { divider: true, inset: true },
        {
          avatar: 'https://cdn.vuetifyjs.com/images/lists/2.jpg',
          title: 'Summer BBQ <span class="grey--text text--lighten-1">4</span>',
          subtitle: "<span class='text--primary'>to Alex, Scott, Jennifer</span> &mdash; Wish I could come, but I'm out of town this weekend."
        },
        { divider: true, inset: true },
        {
          avatar: 'https://cdn.vuetifyjs.com/images/lists/3.jpg',
          title: 'Oui oui',
          subtitle: "<span class='text--primary'>Sandra Adams</span> &mdash; Do you have Paris recommendations? Have you ever been?"
        }
      ]
    }
  },
  beforeCreate() {
    this.$store.dispatch('category/GetByKey', ({ key: 'doanhthu' })).then(x => {
      this.category = x.filter((x) => { return x.dependent != ',0,' })
    })
  }
}
</script>

<style>
</style>
