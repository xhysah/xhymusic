<template>
  <div>
    <div class="audio1">
      <el-container v-show="show">
        <el-main v-if="songs !== null">
          <div>播放列表({{songs.length}})</div>
          <div class="scroll">
            <playlist :songs="songs" :activeSongId="Number(playSong.num)"></playlist>
          </div>
        </el-main>
        <el-aside v-if="lyrics !== null && lyrics.lrc !== undefined ">
          <div>{{playSong.name}}</div>
          <div ref="scroll" class="scroll">
            <lyrics :lyric="lyrics" :time="currentTime" @changeScroll="scrollEvent"></lyrics>
          </div>
        </el-aside>
        <el-aside v-else>
          <div>暂无歌词噢</div>
        </el-aside>
      </el-container>
      <div class="audio">
        <div class="i-group">
          <i class="el-icon-caret-left" @click="preSong"></i>
          <i class="el-icon-video-pause" v-if="playIf" @click="pauseMusic"></i>
          <i class="el-icon-video-play" v-else @click="playMusic"></i>
          <i class="el-icon-caret-right" @click="nextSong"></i>
        </div>
        <img :src="playSong.img" alt="">
        <div class="i">
          <span>{{playSong.name}}</span><span>{{playSong.singer}}</span>
          <el-progress :percentage="percentage" color="red" :show-text="false"></el-progress>
        </div>
        <div class="time">
          <span>{{currentTime}}/{{duration}}</span>
        </div>
        <i class="el-icon-caret-top" @click="showLyr"></i>
        <audio :src="playSong.url" ref="audio" autoplay @ended="ended" @canplay="getDuration"
               @timeupdate="getCurrentTime"></audio>
      </div>
<!--      <div class="lyric" v-if="playSong.lyric.hasOwnProperty('lrc')">{{playSong.lyric.lrc.lyric}}</div>-->
    </div>
  </div>
</template>

<script>
import lyrics from '../lyric/playlist/lyrics'
import playlist from '../lyric/playlist/playlist'
export default {
  name: 'musicPlayer',
  components: {
    playlist,
    lyrics
  },
  data () {
    return {
      show: false
    }
  },
  mounted () {
    // 页面刷新时，停止音乐播放
    window.onload = e => {
      this.$refs.audio.pause()
    }
  },
  methods: {
    // 当音乐播放完毕后
    ended () {
      this.$store.commit('ended', this.playSong.num)
    },
    // 当音乐准备好开始播放
    getDuration () {
      this.$store.commit('getDuration', this.$refs.audio)
    },
    // 获取音乐实时播放的时间
    getCurrentTime () {
      this.$store.commit('getCurrentTime')
    },
    // 当点击了停止按钮
    pauseMusic () {
      this.$store.commit('pauseSongs')
    },
    // 当点击了播放按钮
    playMusic () {
      if (this.songs !== null) {
        this.$store.commit('playSongs')
      } else {
        this.$message.warning('暂无播放歌曲')
      }
    },
    preSong () {
      if (this.songs !== null) {
        this.$store.commit('editPreNum')
      } else {
        this.$message.warning('暂无播放歌曲')
      }
    },
    nextSong () {
      if (this.songs !== null) {
        this.$store.commit('editNextNum')
      } else {
        this.$message.warning('暂无播放歌曲')
      }
    },
    showLyr () {
      if (this.songs !== null) {
        this.show = !this.show
      } else {
        this.$message.warning('暂无播放歌词')
      }
    },
    scrollEvent (value) {
      console.log(value)
      this.$refs.scroll.scrollBy(0, value)
    }
  },
  computed: {
    // 从vuex里面获取到数据
    playSong () {
      if (this.$store.state.playSong.img !== null) {
        return this.$store.state.playSong
      } else {
        return {
          name: '暂无播放音乐'
        }
      }
    },
    playIf () {
      return this.$store.state.playIf
    },
    duration () {
      return this.$store.getters.duration
    },
    currentTime () {
      return this.$store.getters.currentTime
    },
    percentage () {
      // console.log(this.$store.getters.percentage)
      return this.$store.getters.percentage
    },
    num () {
      return this.$store.state.playSong.num
    },
    name () {
      return this.$store.state.tableName
    },
    checkFalse () {
      return this.$store.state.checkFalse
    },
    memberSong () {
      return this.$store.state.memberSong
    },
    songs () {
      return this.$store.state.songs
    },
    lyrics () {
      console.log(this.$store.state.playSong.lyric)
      return this.$store.state.playSong.lyric
    }
  },
  watch: {
    num (newValue) {
      this.$refs.scroll.scrollTo(0, 0)
      this.$store.dispatch('play', { num: newValue, name: this.name })
    },
    checkFalse (newValue) {
      if (newValue === false) {
        this.$message.error('亲爱的,此歌暂无版权')
      }
    },
    memberSong (newValue) {
      if (newValue === true) {
        this.$message.warning('亲爱的，此歌是会员歌曲哦')
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
  .audio1
    padding 10px
    border-radius 10px 10px 0 0
    background-color #000000
  .audio
    width 100%
    .i-group
      display inline-block
      width 102px
      i
        display inline-block
        font-size 30px
    .i
      display inline-block
      width 60%
      span
        color white
        font-size 13px
        +span
          font-size 12px
          color #888888
          margin 0 20px
    img
      width 35px
      height 35px
      margin 0 15px
      position relative
      top 5px
    .time
      width 76px
      display inline-block
      margin 0 0 0 20px
      font-size 13px
      color #888888
  .el-icon-caret-top
    font-size 20px
    margin-left 10px
  .el-aside
    text-align center
    padding 20px 0
  .scroll
    margin-top 10px
    height 200px
    overflow scroll
</style>
