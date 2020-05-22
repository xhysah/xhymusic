<template>
  <div>
    <el-container>
      <el-main>
        <div class="header">{{artist.name}}</div>
        <div class="img">
          <img :src="artist.picUrl" alt="">
          <el-button v-if="collected===true" size="mini" type="danger" icon="el-icon-folder-add" @click="collect(2)">
            已收藏
          </el-button>
          <el-button  v-else size="mini" type="danger" icon="el-icon-folder-add" plain @click="collect(1)">
            收藏
          </el-button>
        </div>
        <el-tabs type="border-card" style="background-color: black" :stretch="true" class="tabs">
          <el-tab-pane label="热门作品">
            <song-table :songs="hotSongs"></song-table>
          </el-tab-pane>
          <el-tab-pane label="所有专辑">
            <div class="flex">
              <template v-for="(item, index) in album">
                <album-outline :key="index" length="150px" height="150px">
                  <template v-slot:img>
                    <img :src="item.picUrl" alt="">
                  </template>
                  <template v-slot:sentence>
                    <div>{{item.name}}</div>
                  </template>
                </album-outline>
              </template>
            </div>
          </el-tab-pane>
          <el-tab-pane label="相关mv">
            <div class="flex">
              <template v-for="(item, index) in mv">
                <album-outline :key="index" length="260px" height="150px">
                  <template v-slot:img>
                    <img :src="item.imgurl16v9" alt="">
                  </template>
                  <template v-slot:sentence>
                    <div>{{item.name}}</div>
                  </template>
                </album-outline>
              </template>
            </div>
          </el-tab-pane>
          <el-tab-pane label="艺人介绍">
            <div class="header">
              <el-divider direction="vertical"></el-divider>
              {{artist.name}}简介
            </div>
            <div>{{disc.briefDesc}}</div>
            <template v-for="(item, index) in disc.introduction">
              <div :key="index">
                <div class="header">
                  <el-divider direction="vertical"></el-divider>
                  {{item.ti}}
                </div>
                <div>{{item.txt}}</div>
              </div>
            </template>
          </el-tab-pane>
        </el-tabs>
      </el-main>
      <el-aside width="280px">
        <div class="simiHeader">相似歌手</div>
        <div class="line"></div>
        <div class="flex" v-if="Object.keys(simArtists).length !== 0">
          <template v-for="(item, index) in simArtists">
            <singer-outline :key="index" length="50px" height="50px">
              <template v-slot:img>
                <img :src="item.img1v1Url" alt="" @click="goSinger(item.id)">
              </template>
              <template v-slot:sentence>
                <div>{{item.name}}</div>
              </template>
            </singer-outline>
          </template>
        </div>
        <div v-else class="center">暂无相似歌手</div>
      </el-aside>
    </el-container>
  </div>
</template>

<script>
import albumOutline from '../../../components/songOutline /albumOutline'
import singerOutline from '../../../components/songOutline /singerOutline'
import songTable from '../../../components/songTable/songTable'
export default {
  name: 'singerInformation',
  components: {
    songTable,
    singerOutline,
    albumOutline
  },
  created () {
    this.goSinger(this.sid)
    this.$store.commit('editActiveName', 'singer')
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
      // 相似歌手
      simArtists: {},
      collected: false,
      // 当前歌手id
      currentId: 0
    }
  },
  methods: {
    // 获取歌手信息
    getSingerInformation (id) {
      this.$http.get(`/artists?id=${id}`).then(data => {
        this.artist = data.artist
        this.hotSongs = data.hotSongs
      })
    },
    // 获取专辑数据
    getAlbum (id) {
      this.$http.get(`/artist/album?id=${id}`).then(data => {
        this.album = data.hotAlbums
      })
    },
    // 获取mv数据
    getMv (id) {
      this.$http.get(`/artist/mv?id=${id}`).then(data => {
        this.mv = data.mvs
      })
    },
    // 获取歌手描述信息
    getDesc (id) {
      this.$http.get(`/artist/desc?id=${id}`).then(data => {
        console.log(data)
        this.disc.briefDesc = data.briefDesc
        this.disc.introduction = data.introduction
      })
    },
    // 获得相似的歌手
    getSimSinger (id) {
      this.$http.get(`/simi/artist?id=${id}`).then(data => {
        this.simArtists = data.artists.slice(0, 6)
      })
    },
    // 点击相似歌手，数据跟着变化
    goSinger (id) {
      this.currentId = id
      this.getSimSinger(id)
      this.getSingerInformation(id)
      this.getAlbum(id)
      this.getMv(id)
      this.getDesc(id)
      if (this.accountId !== null) {
        this.getCollectedValue(id)
      }
    },
    // 判断是否收藏该歌手
    getCollectedValue (id) {
      this.collected = false
      this.$http.get(`/artist/sublist?uid=${this.accountId}`).then(data => {
        for (const key of data.data) {
          if (Number(id) === key.id) {
            this.collected = true
          }
        }
      })
    },
    collect (value) {
      if (this.accountId !== null) {
        this.$http.get(`/artist/sub?t=${value}&id=${this.currentId}`).then(data => {
          if (data.code === 200) {
            if (value === 1) {
              this.collected = true
            } else {
              this.collected = false
            }
          }
        })
      } else {
        this.$message.error('请登录')
      }
    }
  },
  computed: {
    // 对歌手id进行赋值
    sid () {
      return this.$route.params.sid
    },
    accountId () {
      return this.$store.state.accountId
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
        bottom 120px
        display block
        position relative
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
  .tabs>>>.el-tabs__item.is-active
    color red
  .tabs>>>.el-tabs__item:hover
    color red !important
  .center
    margin 10px
    color #888888
  .el-button
    position relative
    z-index 100
    top -280px
    left 530px
</style>
