import axios from 'axios'

axios.defaults.baseURL = 'http://192.168.1.5:3000'
axios.defaults.withCredentials = true// 跨域请求
// axios.interceptors.request.use(config => {
//   const token = window.localStorage.getItem('token')
//   config.headers.Authorization = token
//   return config
// })
