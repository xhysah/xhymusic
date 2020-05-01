<template>
  <el-container>
    <el-main>
    <div>{{artist.name}}</div>
    <div class="img">
      <img :src="artist.picUrl" alt="">
    </div>
    <el-tabs type="border-card" style="background-color: black">
      <el-tab-pane label="热门作品">
        <audio :src="playUrl" autoplay="autoplay"></audio>
<!--        <div v-for="(item, index) in hotSongs" :key="index">-->
<!--          <div @click="play(item.id)">{{item.name}}&#45;&#45;&#45;&#45;&#45;&#45;{{item.al.name}}</div>-->
<!--        </div>-->
        <table>
          <tr v-for="(item, index) in hotSongs" :key="index">
            <td>{{index+1}}</td>
            <i class="el-icon-video-play" :class="{'el-icon-video-pause':active == item.id}" @click="play(item.id)"></i>
            <td>{{item.name}}</td>
            <td>{{item.al.name}}</td>
          </tr>
        </table>
      </el-tab-pane>
      <el-tab-pane label="所有专辑">
        <template v-for="(item, index) in album">
          <song-outline :key="index" length="150px">
            <template v-slot:img>
              <img :src="item.picUrl" alt="">
            </template>
            <template v-slot:sentence>
              <div>{{item.name}}</div>
            </template>
          </song-outline>
        </template>
      </el-tab-pane>
      <el-tab-pane label="相关mv">
        <template v-for="(item, index) in mv">
          <song-outline :key="index" length="200px">
            <template v-slot:img>
              <img :src="item.imgurl16v9" alt="">
            </template>
            <template v-slot:sentence>
              <div>{{item.name}}</div>
            </template>
          </song-outline>
        </template>
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
    <el-aside width="240px">
    </el-aside>
  </el-container>
</template>

<script>
import songOutline from '../../../components/songOutline /songOutline'
export default {
  name: 'singerInformation',
  components: {
    songOutline
  },
  created () {
    this.getSimSinger()
    this.getSingerInformation()
    this.getAlbum()
    this.getMv()
    this.getDesc()
  },
  data () {
    return {
      // 歌手信息
      artist: {},
      // 歌手的热门歌曲
      hotSongs: {},
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
      active: 0,
      // 相似歌手
      simArtists: {}
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
      })
    },
    // 播放歌曲
    play (id) {
      this.$http.get(`/song/url?id=${id}`).then(({ data }) => {
        if (data.code !== 200) {
          return this.$message.error('获取歌信息失败')
        }
        this.playUrl = data.data[0].url
        this.active = id
      })
    },
    // 获得相似的歌手
    getSimSinger () {
      this.$http.get(`/simi/artist?id=${this.sid}`).then(({ data }) => {
        if (data.code !== 200) {
          return this.$message.error('获取相似歌手信息失败')
        }
        this.simArtists = data.artists.slice(0, 8)
        console.log(data.artists.slice(0, 8))
      })
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
  audio
    background-color yellow
  table tr:nth-child(odd)
    background-color red
  table tr:nth-child(even)
    color #909399
  table
    font-size 14px
    width 100%
  td
    cellspacing 0
    padding 5px 0
  .header
    font-size 20px
    +div
      margin 10px 30px
      font-size 14px
      color #909399
      text-indent 2em
</style>
