import Vue from 'vue'
import VeeValidate from 'vee-validate'
// import { Validator } from 'vee-validate'
// Validator.extend('exist', {
//   getMessage: field => 'error.exist',
//   validate: value => !!value
// });
Vue.use(VeeValidate, {
  // inject: false,
  locale: 'en',
  // dictionary: {
  //   en: {
  //     attributes: {},
  //     messages: {
  //       after: 'error.after',
  //       alpha: 'error.alpha',
  //       alpha_dash: 'error.alpha_dash',
  //       alpha_num: 'error.alpha_num',
  //       alpha_spaces: 'error.alpha_spaces',
  //       before: 'error.before',
  //       between: (field, arg) => `error.between:${arg}`,
  //       confirmed: 'error.confirmed',
  //       credit_card: 'error.credit_card',
  //       date_between: 'error.date_between',
  //       date_format: 'error.date_format',
  //       decimal: 'error.decimal',
  //       digits: 'error.digits',
  //       dimensions: 'error.dimensions',
  //       email: 'error.email',
  //       ext: 'error.ext',
  //       image: 'error.image',
  //       included: 'error.included',
  //       integer: 'error.integer',
  //       ip: 'error.ip',
  //       is: 'error.is',
  //       is_not: 'error.is_not',
  //       length: 'error.length',
  //       max: 'error.max',
  //       max_value: 'error.max_value',
  //       mimes: 'error.mimes',
  //       min: 'error.err_min',
  //       min_value: 'error.min_value',
  //       excluded: 'error.excluded',
  //       numeric: 'error.numeric',
  //       regex: 'error.regex',
  //       required: 'error.required',
  //       required_if: 'error.required_if',
  //       size: 'error.size',
  //       url: 'error.url',
  //     }
  //   }
  // }
})
