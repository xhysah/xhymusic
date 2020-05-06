import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    playSong: {
      url: '',
      img: '',
      name: '',
      singer: ''
    },
    playIf: false,
    duration: '00:00',
    currentTime: '00:00',
    audio: {},
    active: 0
  },
  mutations: {
    playUrl (state, payload) {
      state.playSong.url = payload.url
      state.playSong.img = payload.img
      state.playSong.name = payload.name
      state.playSong.singer = payload.singer
      state.playIf = true
    },
    ended (state) {
      // 让musicPlayer里面的播放标签变为停止标签
      state.playIf = false
      state.active--
      // console.log(this.$refs.songTable.active--)
    },
    getDuration (state, audio) {
      state.duration = `${Math.floor(audio.duration / 60)}:${Math.floor(audio.duration % 60)}`
      state.audio = audio
    },
    getCurrentTime (state) {
      state.currentTime = `${Math.floor(state.audio.currentTime / 60)}:${Math.floor(state.audio.currentTime % 60)}`
    },
    // 返回两位数
    double (state, num) {
      if (num.toString().length !== 2) {
        return '0' + num
      }
      return num
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
