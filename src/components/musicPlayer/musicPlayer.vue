<template>
  <div>
    <div class="audio1">
      <div class="audio">
        <div class="i-group">
          <i class="el-icon-caret-left"></i>
          <i class="el-icon-video-pause" v-if="playIf" @click="pauseMusic"></i>
          <i class="el-icon-video-play" v-else @click="playMusic"></i>
          <i class="el-icon-caret-right"></i>
        </div>
        <img :src="playSong.img" alt="">
        <div class="i">
          <span>{{playSong.name}}</span><span>{{playSong.singer}}</span>
          <el-progress :percentage="percentage" color="red" :show-text="false"></el-progress>
        </div>
        <span>{{currentTime}}/{{duration}}</span>
        <audio :src="playSong.url" autoplay="autoplay" ref="audio" @ended="ended" @canplay="getDuration"
               @timeupdate="getCurrentTime"></audio>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'musicPlayer',
  data () {
    return {
    }
  },
  methods: {
    // 当音乐播放完毕后
    ended () {
      this.$store.commit('ended')
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
      this.$store.commit('pauseSong')
    },
    // 当点击了播放按钮
    playMusic () {
      this.$store.commit('playSong')
    }
  },
  computed: {
    // 从vuex里面获取到数据
    playSong () {
      return this.$store.state.playSong
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
    }
  }
}
</script>

<style lang="stylus" scoped>
  .audio1
    margin auto
  .audio
    padding 6px 15%
    border-radius 10px 10px 0 0
    margin auto
    background-color #1c1c1c
    .i-group
      display inline-block
      margin auto
    .i
      width 70%
      display inline-block
      margin auto
      span
        margin 0
        color white
        font-size 13px
        +span
          font-size 12px
          color #888888
          margin 0 20px
    img
      width 35px
      height 35px
      display inline-block
      margin 0 15px
      position relative
      top 5px
    i
      display inline-block
      font-size 30px
      margin auto 2px
    span
      display inline-block
      margin 0 0 0 20px
      font-size 13px
      color #888888
</style>
