import * as _store from '@/plugins/storage'
import vi_VN from './vi-VN.json'
import en_US from './en-US.json'
//const langitem = JSON.parse(_store.Get('language'))
// const Get = function(key = '', module = 'global') {
//   if (!langitem) return key
//   var rs = langitem.filter(function(row) {
//     return row['module_code'] === module && row['key'] === key
//   })
//   return rs.length > 0 ? rs[0].value ? rs[0].value : key : key
// };
// let language = _store.Get('language')
const GetLanguage = function (defaults) {
  const data = _store.Get('language')
  if (data) return data
  else {
    SetLanguage(defaults)
    return defaults
  }
}
const SetLanguage = function (language) {
  return new Promise((resolve, reject) => {
    _store.Set('language', language)
    resolve(true)
    reject(false)
  });
}
// const GetDictionary = function (defaults) {
//   const rs = _store.Get('dictionary')
//   return rs && rs !== 'undefined' ? JSON.parse(rs) : null
// }
const GetDictionary = function (defaults) {
  console.log(GetLanguage())
  const rs = _store.Get('dictionary')
  return rs && rs !== 'undefined' ? JSON.parse(rs) : null
}
const SetDictionary = function (dictionary) {
  return new Promise((resolve, reject) => {
    _store.Set('dictionary', JSON.stringify(dictionary))
    resolve(true)
    reject(false)
  });
}
export { GetLanguage, SetLanguage, GetDictionary, SetDictionary };
