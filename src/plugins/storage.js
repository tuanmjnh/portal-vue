const Set = function(key, value, isLocal = true, isRemove = true) {
  if (isLocal) {
    localStorage.setItem(key, value);
    if (isRemove) Remove(key, false);
  } else {
    sessionStorage.setItem(key, value);
    if (isRemove) Remove(key, true);
  }
};
const Get = function(key, isLocal = true) {
  if (isLocal) return localStorage.getItem(key);
  return sessionStorage.getItem(key);
};
const Remove = function(key, isLocal = true) {
  if (isLocal) localStorage.removeItem(key);
  else sessionStorage.removeItem(key);
};

export { Set, Get, Remove };
// export class Storage {
//   Set(key, value, isSession = false) {
//     if (isSession) return sessionStorage.setItem(key, value);
//     else return localStorage.setItem(key, value);
//   }
//   Get(key, isSession = false) {
//     if (isSession) return sessionStorage.getItem(key);
//     else return localStorage.getItem(key);
//   }
//   Remove(key, isSession = false) {
//     if (isSession) return sessionStorage.removeItem(key);
//     else return localStorage.removeItem(key);
//   }
// }
