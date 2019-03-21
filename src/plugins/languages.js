import * as _store from '@/plugins/storage'
//const langitem = JSON.parse(_store.Get('language'))
// const Get = function(key = '', module = 'global') {
//   if (!langitem) return key
//   var rs = langitem.filter(function(row) {
//     return row['module_code'] === module && row['key'] === key
//   })
//   return rs.length > 0 ? rs[0].value ? rs[0].value : key : key
// };
// let language = _store.Get('language')
const GetLanguage = function() {
  return _store.Get('language')
}
const SetLanguage = function(language) {
  return new Promise(function(resolve, reject) {
    _store.Set('language', language)
  });
}
const GetDictionary = function() {
  const rs = _store.Get('dictionary')
  return rs && rs !== 'undefined' ? JSON.parse(rs) : null
}
const SetDictionary = function(dictionary) {
  return new Promise(function(resolve, reject) {
    _store.Set('dictionary', JSON.stringify(dictionary))
  });
}
export { GetLanguage, SetLanguage, GetDictionary, SetDictionary };
