import Vue from 'vue'
import VueRouter from 'vue-router'
const index = () => import('../views/index')
const recommend = () => import('../views/recommend/recommend')
const ranking = () => import('../views/ranking/ranking')
const songMenu = () => import('../views/songMenu/songMenu')
const singer = () => import('../views/singer/singer')
const detail = () => import('../views/songMenu/detail/detail')
const singerInformation = () => import('../views/singer/singerInformation/singerInformation')
const search = () => import('../views/search/search')
const myMusic = () => import('../views/myMusic/myMusic')
const album = () => import('../views/album/album')
const mv = () => import('../views/mv/mv')
const videos = () => import('../views/mv/videos')

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
        path: '/myMusic',
        name: 'myMusic',
        component: myMusic
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
      },
      {
        path: '/album',
        name: 'album',
        component: album
      },
      {
        path: '/mv',
        name: 'mv',
        component: mv
      },
      {
        path: '/videos',
        name: 'videos',
        component: videos
      }
    ]
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
// router.beforeEach((to, from, next) => {
//   if (window.localStorage.getItem('token')) {
//     store.commit('getLoginIf', true)
//     next()
//   } else {
//     store.commit('getLoginIf', false)
//     next()
//   }
// })
export default router
