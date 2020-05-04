<template>
  <el-container>
    <el-main>
    <div class="header">{{artist.name}}</div>
    <div class="img">
      <img :src="artist.picUrl" alt="">
    </div>
    <el-tabs type="border-card" style="background-color: black" :stretch="true" class="tabs">
      <el-tab-pane label="热门作品">
<!--        <div v-for="(item, index) in hotSongs" :key="index">-->
<!--          <div @click="play(item.id)">{{item.name}}&#45;&#45;&#45;&#45;&#45;&#45;{{item.al.name}}</div>-->
<!--        </div>-->
<!--        <table>-->
<!--          <tr v-for="(item, index) in hotSongs" :key="index">-->
<!--            <td>{{index+1}}</td>-->
<!--            <i class="el-icon-video-play" :class="{'el-icon-video-pause':active == item.id}" @click="play(item.id)"></i>-->
<!--            <td>{{item.name}}</td>-->
<!--            <td>{{item.al.name}}</td>-->
<!--          </tr>-->
<!--        </table>-->
        <song-table :songs="hotSongs" @playurl="editUrl" @pause="pauseMusics" @play="playMusics" ref="songTable"></song-table>
      </el-tab-pane>
      <el-tab-pane label="所有专辑">
        <div class="flex">
          <template v-for="(item, index) in album">
            <song-outline :key="index" length="150px" height="150px">
              <template v-slot:img>
                <img :src="item.picUrl" alt="">
              </template>
              <template v-slot:sentence>
                <div>{{item.name}}</div>
              </template>
            </song-outline>
          </template>
        </div>
      </el-tab-pane>
      <el-tab-pane label="相关mv">
        <div class="flex">
          <template v-for="(item, index) in mv">
            <song-outline :key="index" length="260px">
              <template v-slot:img>
                <img :src="item.imgurl16v9" alt="">
              </template>
              <template v-slot:sentence>
                <div>{{item.name}}</div>
              </template>
            </song-outline>
          </template>
        </div>
      </el-tab-pane>
      <el-tab-pane label="艺人介绍">
        <div class="header"><el-divider direction="vertical"></el-divider>{{artist.name}}简介</div>
        <div>{{disc.briefDesc}}</div>
        <template v-for="(item, index) in disc.introduction">
          <div :key="index">
            <div class="header"><el-divider direction="vertical"></el-divider>{{item.ti}}</div>
            <div>{{item.txt}}</div>
          </div>
        </template>
      </el-tab-pane>
    </el-tabs>
  </el-main>
    <el-aside width="280px">
      <div class="simiHeader">相似歌手</div>
      <div class="line"></div>
      <div class="flex">
        <template v-for="(item, index) in simArtists">
          <song-outline :key="index" length="50px" height="50px">
            <template v-slot:img>
              <img :src="item.img1v1Url" alt="">
            </template>
            <template v-slot:sentence>
              <div>{{item.name}}</div>
            </template>
          </song-outline>
        </template>
      </div>
    </el-aside>
    <div class="audio">
      <img :src="img" alt="">
      <i class="el-icon-caret-left"></i>
      <i class="el-icon-video-pause" v-if="playIf" @click="pauseMusic"></i>
      <i class="el-icon-video-play" v-else @click="playMusic"></i>
      <i class="el-icon-caret-right"></i>
      <audio :src="playUrl" autoplay="autoplay" ref="audio" @ended="ended"></audio>
    </div>
  </el-container>
</template>

<script>
import songOutline from '../../../components/songOutline /songOutline'
import songTable from '../../../components/songTable/songTable'
export default {
  name: 'singerInformation',
  components: {
    songOutline,
    songTable
  },
  created () {
    this.getSimSinger()
    this.getSingerInformation()
    this.getAlbum()
    this.getMv()
    this.getDesc()
  },
  mounted () {
    console.log(this.$refs.audio)
  },
  data () {
    return {
      // 歌手信息
      artist: {},
      // 歌手的热门歌曲
      hotSongs: [],
      // 歌手专辑
      album: {},
      // 歌手MV
      mv: {},
      // 歌手描述信息
      disc: {
        briefDesc: '',
        introduction: {}
      },
      playUrl: '',
      // 相似歌手
      simArtists: {},
      img: '',
      playIf: false
    }
  },
  methods: {
    // 获取歌手信息
    getSingerInformation () {
      this.$http.get(`/artists?id=${this.sid}`).then(({ data }) => {
        if (data.code !== 200) {
          return this.$message.error('获取歌手详细信息失败')
        }
        this.artist = data.artist
        this.hotSongs = data.hotSongs
        // console.log(data.hotSongs)
      })
    },
    // 获取专辑数据
    getAlbum () {
      this.$http.get(`/artist/album?id=${this.sid}`).then(({ data }) => {
        if (data.code !== 200) {
          return this.$message.error('获取专辑信息失败')
        }
        // console.log(data)
        this.album = data.hotAlbums
      })
    },
    // 获取mv数据
    getMv () {
      this.$http.get(`/artist/mv?id=${this.sid}`).then(({ data }) => {
        if (data.code !== 200) {
          return this.$message.error('获取MV信息失败')
        }
        this.mv = data.mvs
        // console.log(data.mvs)
      })
    },
    // 获取歌手描述信息
    getDesc () {
      this.$http.get(`/artist/desc?id=${this.sid}`).then(({ data }) => {
        if (data.code !== 200) {
          return this.$message.error('获取歌手描述信息失败')
        }
        console.log(data)
        this.disc.briefDesc = data.briefDesc
        this.disc.introduction = data.introduction
        // console.log(data.introduction[3].txt.split(' 2'))
      })
    },
    // 获得相似的歌手
    getSimSinger () {
      this.$http.get(`/simi/artist?id=${this.sid}`).then(({ data }) => {
        if (data.code !== 200) {
          return this.$message.error('获取相似歌手信息失败')
        }
        this.simArtists = data.artists.slice(0, 6)
        console.log(data.artists.slice(0, 8))
      })
    },
    editUrl (value, img) {
      this.playUrl = value
      this.img = img
      this.playIf = true
    },
    pauseMusics () {
      const audio1 = this.$refs.audio
      this.playIf = false
      audio1.pause()
    },
    playMusics () {
      if (this.playUrl !== '') {
        const audio = this.$refs.audio
        audio.play()
        this.playIf = true
      }
    },
    play (ca) {
      console.log(ca)
    },
    playMusic () {
      if (this.playUrl !== '') {
        const audio = this.$refs.audio
        audio.play()
        this.playIf = true
        console.log(this.$refs.songTable.active--)
      }
    },
    pauseMusic () {
      const audio1 = this.$refs.audio
      this.playIf = false
      audio1.pause()
      console.log(this.$refs.songTable.active++)
    },
    ended () {
      this.playIf = false
      console.log(this.$refs.songTable.active--)
    }
  },
  computed: {
    sid () {
      // console.log(this.$route.params.sid)
      return this.$route.params.sid
    }
  }
}
</script>

<style lang="stylus" scoped>
  color=#353535
  .el-divider
    background-color red
    width 2px
  .el-container
    width 70%
    margin auto
  .el-tabs
    margin 0 20px
  .el-main
    margin  20px auto
    border-left 1px solid color
    .img
      margin 0 20px
      height 300px
      overflow hidden
      img
        display block
        position relative
        bottom  120px
        height auto
  .el-aside
    border-left  1px solid color
    border-right 1px solid color
  .header
    font-size 20px
    +div
      margin 10px 30px
      font-size 14px
      color #909399
      text-indent 2em
  .simiHeader
    margin-top 80px
    margin-bottom 10px
  .audio
    img
      width 40px
      height 40px
</style>
