// Register a global custom directive called `v-focus`
import Vue from 'vue'
Vue.directive('focus', {
  // When the bound element is inserted into the DOM...
  inserted: function(el, binding, vnode) {
    // Focus the element
    if (binding.modifiers.vuetify)
      el.children[0].children[0].children[0].children[1].focus()
    else el.focus()
    // console.log(binding.modifiers.vuetify)
  }
})
Vue.directive('uppercase', {
  update(el, binding, vnode) {
    if (binding.modifiers.vuetify) {
      var _el = el.children[0].children[0].children[0].children[1];
      _el.value = _el.value ? _el.value.toUpperCase() : _el.value
    } else el.value = el.value ? el.value.toUpperCase() : el.value
  },
})
Vue.directive('lowercase', {
  update(el, binding, vnode) {
    if (binding.modifiers.vuetify) {
      var _el = el.children[0].children[0].children[0].children[1];
      _el.value = _el.value ? _el.value.toLowerCase() : _el.value
    } else el.value = el.value ? el.value.toLowerCase() : el.value
  },
})
