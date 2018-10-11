import Vue from 'vue'
import store from '@/store'
// define a mixin object
var mixin = {
  data: function() {
    return {
      get global() {}
    }
  },
  beforeCreate: function() {},
  created: function() {},
  watch: {},
  computed: {},
  methods: {}
}
Vue.mixin(mixin)
export default mixin
