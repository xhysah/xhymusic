import Vue from 'vue'
import VueRouter from 'vue-router'
const phoneLogin = () => import('../views/Login/phoneLogin')
const register = () => import('../views/register/register')
const index = () => import('../views/index')
const recommend = () => import('../views/recommend/recommend')
const profileMusic = () => import('../views/profileMusic/profileMusic')
const ranking = () => import('../views/ranking/ranking')
const songMenu = () => import('../views/songMenu/songMenu')
const newsRadio = () => import('../views/newsRadio/newsRadio')
const singer = () => import('../views/singer/singer')
const detail = () => import('../views/songMenu/detail/detail')
const singerInformation = () => import('../views/singer/singerInformation/singerInformation')
const search = () => import('../views/search/search')

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: index,
    children: [
      {
        path: '/',
        redirect: '/recommend'
      },
      {
        path: '/recommend',
        name: 'recommend',
        component: recommend
      },
      {
        path: '/profileMusic',
        name: 'profileMusic',
        component: profileMusic
      },
      {
        path: '/ranking',
        name: 'ranking',
        component: ranking
      },
      {
        path: '/songMenu',
        name: 'songMenu',
        component: songMenu
        // beforeEnter: (to, from, next) => {
        //   if (from.path === '/recommend') {
        //
        //   }
        //   console.log(to)
        //   console.log(from)
        //   console.log(next)
        // }
      },
      {
        path: '/newsRadio',
        name: 'newsRadio',
        component: newsRadio
      },
      {
        path: '/singer',
        name: 'singer',
        component: singer
      },
      {
        path: '/search',
        name: 'search',
        component: search
      },
      {
        path: '/artist/:sid',
        name: 'singerInformation',
        component: singerInformation
      },
      {
        path: '/songMenuDetail',
        name: 'songMenuDetail',
        component: detail
      }
    ]
  },
  {
    path: '/register',
    name: 'register',
    component: register
  },
  {
    path: '/login',
    name: 'phoneLogin',
    component: phoneLogin
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
// router.afterEach((to, from) => {
//   console.log(to.name)
//   console.log(Vue.$store.state.active)
//   this.$store.commit('editActiveName', to.name)
// })
export default router
