const get = function(isDefault = false) {
  if (isDefault)
    return {
      token: '',
      user: '',
      remember: true
    }
  else {
    var remember =
      localStorage.getItem('user-remember') &&
      localStorage.getItem('user-remember') !== undefined
        ? true
        : false
    if (remember === true) {
      return {
        token: localStorage.getItem('user-token') || '',
        user: localStorage.getItem('user-auth') || '',
        remember: remember
      }
    } else {
      return {
        token: sessionStorage.getItem('user-token') || '',
        user: sessionStorage.getItem('user-auth') || '',
        remember: remember
      }
    }
  }
}
const set = function(axios, value, isRemove = false) {
  if (isRemove) {
    // if the request fails, remove any possible user token if possible localstorage
    localStorage.removeItem('user-token')
    localStorage.removeItem('user-auth')
    localStorage.removeItem('user-remember')
    // if the request fails, remove any possible user token if possible sessionStorage
    sessionStorage.removeItem('user-token')
    sessionStorage.removeItem('user-auth')
    sessionStorage.removeItem('user-remember')
    //
    axios.defaults.headers.Authorization = `Bearer `
    axios.defaults.headers.Author = ''
    axios.defaults.headers.Remember = true
  } else {
    if (value.remember) {
      // store the token in localstorage
      localStorage.setItem('user-token', value.token)
      localStorage.setItem('user-auth', value.user)
      localStorage.setItem('user-remember', value.remember)
    } else {
      // store the token in sessionStorage
      sessionStorage.setItem('user-token', value.token)
      sessionStorage.setItem('user-auth', value.user)
      sessionStorage.setItem('user-remember', value.remember)
    }
    axios.defaults.headers.Authorization = `Bearer ${value.token}`
    axios.defaults.headers.Author = value.user
    axios.defaults.headers.Remember = value.remember
  }
}

export { get, set }
