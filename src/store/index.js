import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 当前播放音乐的地址，图片，歌曲名，歌手，歌词，在歌单里的位置信息
    playSong: {
      url: window.sessionStorage.getItem('url'),
      img: window.sessionStorage.getItem('img'),
      name: window.sessionStorage.getItem('name'),
      singer: window.sessionStorage.getItem('singer'),
      lyric: JSON.parse(window.sessionStorage.getItem('lyric')),
      num: window.sessionStorage.getItem('num')
    },
    // 音乐是否处于播放状态，决定小图标该显示哪一个
    playIf: false,
    // 获取的audio dom 元素
    audio: {},
    // 记录audio的状态，id值加一代表处于暂停状态
    active: window.sessionStorage.getItem('active') + 1,
    // 元总播放时长
    metaDuration: 0,
    //  元已经播放的时长
    metaCurrentTime: 0,
    // 菜单应该选到哪里
    activeName: '',
    // 歌曲列表
    songs: JSON.parse(window.sessionStorage.getItem('songs')),
    // 总歌曲数
    total: window.sessionStorage.getItem('total'),
    // songstable还是songs
    tableName: window.sessionStorage.getItem('tableName'),
    // 用户id，看是否存在用户id，判断用户是否登录
    accountId: window.localStorage.getItem('accountId'),
    // 用户的歌单id，用于添加/取消收藏歌曲
    songMenuId: window.localStorage.getItem('songMenuId'),
    checkFalse: true,
    memberSong: false
  },
  getters: {
    // 播放进度
    percentage (state) {
      if (state.metaDuration === 0) {
        return 0
      }
      return Math.floor(state.metaCurrentTime / state.metaDuration * 100)
    },
    // 播放总时长分钟
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
    // 已经播放的分钟
    currentTime (state) {
      const double = function (num) {
        if (num.toString().length !== 2) {
          if (num === 0) {
            return '00'
          }
          return '0' + num
        }
        return num
      }
      return `${double(Math.floor(state.metaCurrentTime / 60))}:${double(Math.floor(state.metaCurrentTime % 60))}`
    }
  },
  mutations: {
    // 提交当前播放音乐的地址，图片，歌曲名，歌手，歌词，在歌单里的位置信息并存在session里面
    playUrl (state, payload) {
      state.playSong.url = payload.url
      state.playSong.img = payload.img
      state.playSong.name = payload.name
      state.playSong.singer = payload.singer
      state.playSong.lyric = payload.lyric
      state.playSong.num = payload.num
      state.playIf = true
      window.sessionStorage.setItem('url', payload.url)
      window.sessionStorage.setItem('img', payload.img)
      window.sessionStorage.setItem('name', payload.name)
      window.sessionStorage.setItem('singer', payload.singer)
      window.sessionStorage.setItem('lyric', JSON.stringify(payload.lyric))
      window.sessionStorage.setItem('num', payload.num)
    },
    // 一首音乐结束操作
    ended (state, num) {
      // 让musicPlayer里面的播放标签变为停止标签
      if (state.playSong.num === state.total - 1) {
        state.playSong.num = 0
      } else {
        state.playSong.num = num + 1
      }
      state.playIf = false
      state.active = 0
    },
    // 得到元总时长
    getDuration (state, audio) {
      state.metaDuration = audio.duration
      state.metaCurrentTime = audio.currentTime
      state.audio = audio
    },
    // 得到元已经播放的时间
    getCurrentTime (state) {
      state.metaCurrentTime = state.audio.currentTime
    },
    // 暂停音乐，songTable
    pauseMusic (state) {
      state.playIf = false
      state.audio.pause()
    },
    // 放音乐，songTable
    playMusic (state) {
      if (state.playSong !== '') {
        state.audio.play()
        state.playIf = true
      }
    },
    // 放音乐。musicPlayer
    playSongs (state) {
      if (state.playUrl !== '') {
        console.log(state.active)
        state.audio.play()
        state.playIf = true
        state.active = state.active - 1
      }
    },
    // 暂停音乐，musicPlayer
    pauseSongs (state) {
      state.playIf = false
      state.audio.pause()
      console.log(state.active)
      state.active = state.active + 1
    },
    // 通过控制active，来记录audio状态
    editActive (state, num) {
      state.active = num
    },
    // 修改活跃主菜单的名称
    editActiveName (state, name) {
      state.activeName = name
    },
    // 得到一个歌单的总的歌曲数并存在session里
    getTotal (state, total) {
      window.sessionStorage.setItem('total', total)
      state.total = total
    },
    // 上一首播放
    editPreNum (state) {
      if (state.playSong.num === 0) {
        state.playSong.num = state.total - 1
      } else {
        state.playSong.num--
      }
    },
    // 下一首播放
    editNextNum (state) {
      if (state.playSong.num === state.total - 1) {
        state.playSong.num = 0
      } else {
        state.playSong.num++
      }
    },
    // 得到歌单的总歌曲信息并存在session里
    getSongs (state, songs) {
      window.sessionStorage.setItem('songs', JSON.stringify(songs))
      state.songs = songs
      // this.play(0)
    },
    // 修改是哪一种类型的歌曲列表
    editName (state, name) {
      state.tableName = name
    },
    // 得到用户id
    getAccountId (state, value) {
      state.accountId = value
      window.localStorage.setItem('accountId', value)
    },
    // 得到用户歌单id
    getSongMenuId (state, value) {
      state.songMenuId = value
      window.localStorage.setItem('songMenuId', value)
    },
    editCheckFalse (state, value) {
      state.checkFalse = value
    },
    editMemberSong (state, value) {
      state.memberSong = value
    },
    addSongs (state, value) {
      window.sessionStorage.setItem('total', state.total + 1)
      state.total = state.total + 1
      state.songs.push(value)
      console.log(state.songs)
    }
  },
  actions: {
    play (context, payload) {
      context.commit('editCheckFalse', true)
      context.commit('editMemberSong', false)
      console.log(context.state.songs[payload.num])
      axios.get(`/check/music?id=${context.state.songs[payload.num].id}`).then(() => {
        axios.all([axios.get(`/song/url?id=${context.state.songs[payload.num].id}`), axios.get(`/lyric?id=${context.state.songs[payload.num].id}`)])
          .then(axios.spread((songUrl, lyric) => {
            if (songUrl.data[0].url !== null) {
              window.sessionStorage.setItem('active', context.state.songs[payload.num].id)
              context.commit('editActive', context.state.songs[payload.num].id)
              context.commit('editName', payload.name)
              window.sessionStorage.setItem('tableName', payload.name)
              if (payload.name === 'songs') {
                context.commit('playUrl', {
                  url: songUrl.data[0].url,
                  img: context.state.songs[payload.num].artists[0].img1v1Url,
                  name: context.state.songs[payload.num].name,
                  singer: context.state.songs[payload.num].artists[0].name,
                  lyric: lyric,
                  num: payload.num
                })
              } else if (payload.name === 'songTable') {
                context.commit('playUrl', {
                  url: songUrl.data[0].url,
                  img: context.state.songs[payload.num].al.picUrl,
                  name: context.state.songs[payload.num].name,
                  singer: context.state.songs[payload.num].al.name,
                  lyric: lyric,
                  num: payload.num
                })
              } else {
                context.commit('playUrl', {
                  url: songUrl.data[0].url,
                  img: context.state.songs[payload.num].album.picUrl,
                  name: context.state.songs[payload.num].name,
                  // singer: context.state.songs[payload.num].al[0].name,
                  lyric: lyric,
                  num: payload.num
                })
              }
            } else {
              context.commit('editMemberSong', true)
            }
          }))
      }).catch(() => {
        context.commit('editCheckFalse', false)
      })
    }
  },
  modules: {
  }
})
