import axios from 'axios'
import * as _auth from './storage-auth'
var host = 'http://localhost:5000/'
// var host = 'http://mle.dominet.com.vn/'
// var host = 'http://localhost/mle/'
var api = 'api/'
const vnptbkn = axios.create({
  host: host,
  api: api,
  baseURL: host + api,
  // timeout: 1000,
  headers: {
    Authorization: _auth.GetToken() || '',
    Author: _auth.GetUser() || '',
    Remember: _auth.GetRemember()
  }
})

// another api service
// const amazonApi = axios.create({
//   baseURL: 'https://amazon-domain.com/api/',
//   timeout: 2000,
//   headers: {
//     'X-Custom-Header': 'CustomHeader2'
//   }
// });

export { vnptbkn }
