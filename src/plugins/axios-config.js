import axios from 'axios'
import * as _auth from './storage-auth'
let host = 'http://localhost:5000/'
let api = 'api/'
const source = axios.CancelToken.source();
const vnptbkn = axios.create({
  host: host,
  api: api,
  upload: 'filemanager',
  baseURL: host + api,
  // timeout: 5000,
  headers: {
    Authorization: _auth.GetToken() || '',
    Author: _auth.GetUser() || '',
    Remember: _auth.GetRemember()
  }
})
// vnptbkn.CancelToken = axios.CancelToken;
// vnptbkn.isCancel = axios.isCancel;
host = 'http://localhost:8080/'
api = ''
const localhost = axios.create({
  host: host,
  api: api,
  upload: 'filemanager',
  baseURL: host + api,
  // timeout: 1000,
  headers: {
    Authorization: _auth.GetToken() || '',
    Author: _auth.GetUser() || '',
    Remember: _auth.GetRemember()
  }
})
const setHeaderAuth = function() {
  vnptbkn.defaults.headers.Author = _auth.GetUser() || ''
  vnptbkn.defaults.headers.Authorization = _auth.GetToken() || ''
  vnptbkn.defaults.headers.Remember = _auth.GetRemember()
}
// another api service
// const amazonApi = axios.create({
//   baseURL: 'https://amazon-domain.com/api/',
//   timeout: 2000,
//   headers: {
//     'X-Custom-Header': 'CustomHeader2'
//   }
// });

export { vnptbkn, setHeaderAuth, localhost, source }
