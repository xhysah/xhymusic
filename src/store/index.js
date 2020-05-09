import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    playSong: {
      url: window.sessionStorage.getItem('url'),
      img: window.sessionStorage.getItem('img'),
      name: window.sessionStorage.getItem('name'),
      singer: window.sessionStorage.getItem('singer')
    },
    playIf: false,
    audio: {},
    active: 0,
    metaDuration: 0,
    metaCurrentTime: 0
  },
  getters: {
    percentage (state) {
      if (state.metaDuration === 0) {
        return 0
      }
      return Math.floor(state.metaCurrentTime / state.metaDuration * 100)
    },
    duration (state) {
      const double = function (num) {
        if (num.toString().length !== 2) {
          if (num === 0) {
            return '00'
          }
          return '0' + num
        }
        return num
      }
      return `${double(Math.floor(state.metaDuration / 60))}:${double(Math.floor(state.metaDuration % 60))}`
    },
    currentTime (state) {
      const double2 = function (num) {
        if (num.toString().length !== 2) {
          if (num === 0) {
            return '00'
          }
          return '0' + num
        }
        return num
      }
      return `${double2(Math.floor(state.metaCurrentTime / 60))}:${double2(Math.floor(state.metaCurrentTime % 60))}`
    }
    // 返回两位数
    // double (state, num) {
    //   if (num.toString().length !== 2) {
    //     return '0' + num
    //   }
    //   return num
    // },
  },
  mutations: {
    playUrl (state, payload) {
      state.playSong.url = payload.url
      state.playSong.img = payload.img
      state.playSong.name = payload.name
      state.playSong.singer = payload.singer
      state.playIf = true
      window.sessionStorage.setItem('url', payload.url)
      window.sessionStorage.setItem('img', payload.img)
      window.sessionStorage.setItem('name', payload.name)
      window.sessionStorage.setItem('singer', payload.singer)
    },
    ended (state) {
      // 让musicPlayer里面的播放标签变为停止标签
      state.playIf = false
      state.active--
      // console.log(this.$refs.songTable.active--)
    },
    getDuration (state, audio) {
      // state.duration = `${Math.floor(audio.duration / 60)}:${Math.floor(audio.duration % 60)}`
      state.metaDuration = audio.duration
      state.metaCurrentTime = audio.currentTime
      state.audio = audio
    },
    getCurrentTime (state) {
      // state.currentTime = `${Math.floor(state.audio.currentTime / 60)}:${Math.floor(state.audio.currentTime % 60)}`
      state.metaCurrentTime = state.audio.currentTime
    },
    pauseMusic (state) {
      state.playIf = false
      state.audio.pause()
    },
    playMusic (state) {
      if (state.playUrl !== '') {
        state.audio.play()
        state.playIf = true
      }
    },
    playSong (state) {
      if (state.playUrl !== '') {
        state.audio.play()
        state.playIf = true
        state.active = state.active - 1
      }
    },
    pauseSong (state) {
      state.playIf = false
      state.audio.pause()
      state.active = state.active + 1
    },
    editActive (state, num) {
      state.active = num
    }
  },
  actions: {
  },
  modules: {
  }
})
