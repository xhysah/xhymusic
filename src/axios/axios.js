import axios from 'axios'

axios.defaults.baseURL = 'http://192.168.1.5:3000'
axios.defaults.withCredentials = true// 跨域请求
// axios.interceptors.request.use(config => {
//   // const token = window.localStorage.getItem('token')
//   // return config
// })
axios.interceptors.response.use(config => {
  console.log(config)
  if (config.status === 200) {
    return config.data
  } else {
    console.log('dasda')
  }
}, error => {
  console.log(error)
  return Promise.reject(error)
}
)
