import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:3000'
axios.defaults.withCredentials = true// 跨域请求
// axios.interceptors.request.use(config => {
//   // const token = window.localStorage.getItem('token')
//   // return config
// })
axios.interceptors.response.use(config => {
  if (config.status === 200) {
    return config.data
  } else {
    return Promise.reject(config)
  }
})
