import axios from 'axios'
import * as storageAuth from './storage-auth'
import { env } from '@/environment.js';
// console.log(environment.production)
const source = axios.CancelToken.source();

const vnptbkn = () => {
  return axios.create({
    upload: env.upload,
    host: env.api[0],
    baseURL: env.api.join('/'), //'http://localhost:5000/',
    // timeout: 5000,
    headers: {
      Authorization: storageAuth.GetToken() || '',
      Author: storageAuth.GetUid() || '',
      Remember: storageAuth.GetRemember(),
      LocalIP: document.getElementById('local-ip').value
    }
  })
}
// vnptbkn.CancelToken = axios.CancelToken;
// vnptbkn.isCancel = axios.isCancel;
const localhost = axios.create({
  upload: 'filemanager',
  baseURL: 'http://localhost:8080/',
  // timeout: 1000,
  headers: {
    Authorization: storageAuth.GetToken() || '',
    Author: storageAuth.GetUid() || '',
    Remember: storageAuth.GetRemember()
  }
})
// const setHeaderAuth = function () {
//   vnptbkn.defaults.headers.Author = storageAuth.GetUid() || ''
//   vnptbkn.defaults.headers.Authorization = storageAuth.GetToken() || ''
//   vnptbkn.defaults.headers.Remember = storageAuth.GetRemember()
// }

// another api service
// const amazonApi = axios.create({
//   baseURL: 'https://amazon-domain.com/api/',
//   timeout: 2000,
//   headers: {
//     'X-Custom-Header': 'CustomHeader2'
//   }
// });

export { vnptbkn, localhost, source }
