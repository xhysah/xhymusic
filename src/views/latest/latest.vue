<template>
  <div>
    <el-main>
      <el-row type="flex-1">
        <template v-for="item in cate">
          <span :class="{active:activeName===item.name}" :key="item.id" @click="getSongs(item.id, item.name)">{{item.name}}</span>
        </template>
        <el-button class="cate" icon="el-icon-video-play" plain @click="playAll">播放全部</el-button>
      </el-row>
      <template v-for="(item, index) in musics" class="box">
        <div :key="item.id" class="music" :class="{odd:index%2 ===0}" @click="play(item.id, index)">
          <div class="num">{{double(index+1)}}</div>
          <img :src="item.album.picUrl">
          <div class="name">{{item.name}}</div>
          <div class="singer">
            <template v-for="(items, index) in item.artists">
              <span :key="index" v-if="index===0" @click="goSinger(items.id)">{{items.name}}</span>
              <span :key="index" v-else @click="goSinger(items.id)">/{{items.name}}</span>
            </template>
          </div>
          <div class="albumName" @click="goSongMenu(item.album.id)">{{item.album.name}}</div>
          <div class="time">{{duration(item.duration)}}</div>
        </div>
      </template>
    </el-main>
  </div>
</template>

<script>
export default {
  name: 'latest',
  created () {
    this.getSongs(0, '全部')
    this.$store.commit('editActiveName', 'latest')
  },
  data () {
    return {
      musics: [],
      cate: [
        {
          name: '全部',
          id: 0
        },
        {
          name: '华语',
          id: 7
        },
        {
          name: '欧美',
          id: 96
        },
        {
          name: '韩国',
          id: 8
        },
        {
          name: '日本',
          id: 16
        }
      ],
      activeName: ''
    }
  },
  methods: {
    playAll () {
      this.$store.commit('getTotal', this.musics.length)
      this.$store.commit('getSongs', this.musics)
      this.$store.dispatch('play', { num: 0, name: 'playUrl' })
    },
    play (id, index) {
      if (this.active === id) {
        this.$store.commit('editActive', id + 1)
        this.$store.commit('pauseMusic')
      } else if (this.active === id + 1) {
        this.$store.commit('playMusic')
        this.$store.commit('editActive', id)
      } else {
        if (window.sessionStorage.getItem('songs') !== this.musics) {
          this.$store.commit('getSongs', this.musics)
        }
        this.$store.commit('getTotal', this.musics.length)
        this.$store.dispatch('play', { num: index, name: 'playUrl' })
      }
    },
    getSongs (type, name) {
      this.activeName = name
      this.$http.get(`/top/song?type=${type}`).then(data => {
        this.musics = data.data
        console.log(data.data)
      })
    },
    goSinger (id) {
      this.$router.push({ name: 'singerInformation', params: { sid: id } })
    },
    goSongMenu (id) {
      this.$router.push({
        path: '/album',
        query: {
          id
        }
      })
    },
    double (num) {
      if (num.toString().length >= 2) {
        return num
      } else {
        if (num === 0) {
          return '00'
        }
        return '0' + num
      }
    },
    duration (time) {
      return `${this.double(Math.floor(time / 60000))}:${this.double(Math.floor(time / 1000 % 60))}`
    }
  },
  computed: {
    active () {
      return this.$store.state.active
    }
  }
}
</script>

<style lang="stylus" scoped>
  .el-main
    padding 20px
    .el-row
      span
        cursor pointer
        color #888888
        margin 10px 30px
        font-size 16px
    .el-button
      float right
      margin-right 100px
  .music
    position relative
    margin 10px
    .num
      left -30px
    img
      width 80px
      height 80px
      margin-top 2px
    div
      font-size 14px
      color #888888
      position absolute
      top 30px
      overflow hidden
      text-overflow ellipsis
      white-space nowrap
    .name
      color white
      font-size 16px
      left 100px
      width 260px
    .singer
      left 400px
      width 160px
      span
        cursor pointer
    .albumName
      cursor pointer
      left 600px
      width 160px
    .time
      left 800px
  .active
    color white !important
  .odd
    background-color #0a0a0a
  .cate
    margin 10px
    border-radius 10px
    background-color #db5858
    color white
    padding 5px 15px
    border none
</style>
