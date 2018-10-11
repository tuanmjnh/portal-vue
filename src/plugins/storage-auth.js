import * as Storage from './storage'
const header = {
  user: 'auth_user',
  token: 'auth_token',
  remember: 'auth_remember',
}
const SetAuth = function(model, extras = null) {
  Storage.Set(header.user, model.username, model.remember);
  Storage.Set(header.remember, model.remember, model.remember);
  Storage.Set(header.token, `Bearer ${ model.token}`, model.remember);
  if (extras)
    Object.keys(extras).forEach(function(key, index) {
      Storage.Set(key, extras[key], model.remember);
    });
}
const RemoveAuth = function(extras = null) {
  Storage.Remove(header.user, this.GetRemember());
  Storage.Remove(header.remember, this.GetRemember());
  Storage.Remove(header.token, this.GetRemember());
  if (extras)
    Object.keys(extras).forEach(function(key, index) {
      Storage.Remove(key, this.GetRemember());
    });
}
const GetRemember = function() {
  const remember = Storage.Get(header.remember, true);
  if (remember) return true;
  else return false;
}
const GetStorage = function(key) {
  return Storage.Get(key, this.GetRemember());
}
const GetUser = function() {
  return Storage.Get(header.user, this.GetRemember());
}
const GetToken = function() {
  return Storage.Get(header.token, this.GetRemember());
}
const isAuth = function() {
  const token = this.GetStorage(header.token);
  if (token) return true;
  return false;
}
export { header, SetAuth, RemoveAuth, GetRemember, GetStorage, GetUser, GetToken, isAuth };
