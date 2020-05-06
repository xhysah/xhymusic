<template>
  <div>
    <div class="audio">
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
    ended () {
      this.$store.commit('ended')
    },
    getDuration () {
      this.$store.commit('getDuration', this.$refs.audio)
    },
    getCurrentTime () {
      this.$store.commit('getCurrentTime')
    },
    pauseMusic () {
      this.$store.commit('pauseSong')
    },
    playMusic () {
      this.$store.commit('playSong')
    }
  },
  computed: {
    playSong () {
      return this.$store.state.playSong
    },
    playIf () {
      return this.$store.state.playIf
    },
    duration () {
      return this.$store.state.duration
    },
    currentTime () {
      return this.$store.state.currentTime
    },
    percentage () {
      return this.$store.state.percentage
    }
  }
}
</script>

<style lang="stylus" scoped>
  .audio
    width 85%
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
      width 30px
      height 30px
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
