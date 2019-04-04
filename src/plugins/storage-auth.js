import * as Storage from './storage'
import { json } from 'body-parser';
const auth = 'authentication'
const header = {
  uid: null,
  token: null,
  username: null,
  remember: false,
}
const signIn = function(model) {
  // Storage.Set(header.user, model.username, model.remember);
  // Storage.Set(header.remember, model.remember, model.remember);
  // //Storage.Set(header.token, `Bearer ${ model.token}`, model.remember);
  // Storage.Set(header.token, model.token, model.remember);
  // Storage.Set('full_name', model.full_name, model.remember);
  // if (extras)
  // Object.keys(extras).forEach(function(key, index) {
  //   Storage.Set(key, extras[key], model.remember);
  // });
  // Object.keys(model).forEach(function(key, index) {
  //   Storage.Set(key, model[key], model.remember);
  // });
  Storage.Set(auth, JSON.stringify(model), model.remember);
}
const signOut = function(extras = null) {
  // Storage.Remove(header.user, this.GetRemember());
  // Storage.Remove(header.remember, this.GetRemember());
  // Storage.Remove(header.token, this.GetRemember());
  // if (extras)
  // Object.keys(extras).forEach(function(key, index) {
  //   Storage.Remove(key, $this.GetRemember());
  // });
  // let $this = this
  // Object.keys(header).forEach(function(key, index) {
  //   Storage.Remove(key, $this.GetRemember());
  // });
  Storage.Remove(auth, this.GetRemember());
}
const GetStorage = function() {
  const rs = Storage.Get(auth, true) || Storage.Get(auth, false)
  return rs ? JSON.parse(rs) : header;
}
const GetRemember = function() {
  return this.GetStorage().remember
}
const GetAccount = function() {
  return this.GetStorage().account
}
const GetToken = function() {
  return this.GetStorage().token
}
const GetUid = function() {
  return this.GetStorage().uid
}
const Authenticated = function() {
  return this.GetStorage().token && this.GetStorage().uid ? true : false;
}
export { signIn, signOut, GetStorage, GetUid, GetAccount, GetToken, GetRemember, Authenticated };
