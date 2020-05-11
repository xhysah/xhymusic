<template>
  <div>
    <!--    banner-->
    <el-carousel :interval="5000" indicator-position="outside">
      <audio :src="playurl" autoplay="autoplay"></audio>
      <el-carousel-item v-for="(item, index) in banners" :key="index">
        <img class="banner" :src="item.imageUrl" :alt="item.typeTitle" @click="play(item.targetId)">
      </el-carousel-item>
    </el-carousel>
    <!--    热门-->
    <el-row type="flex" class="row-bg" justify="center">
      <span class="hot" @click="handleCurrentChange">热门推荐</span>
      <template v-for="(item, index) in playlist">
        <el-link type="info"  :key="index" style="margin: 0 20px" @click="goSongMenu(item.name)"><span>{{item.name}}</span></el-link>
      </template>
    </el-row>
    <div class="line"></div>
    <!--    网友精选-->
    <div class="flex">
      <template v-for="(item, index) in toplist">
        <song-outline :key="index" length="150px" height="150px">
          <template v-slot:img>
            <img :src="item.coverImgUrl" alt="" @click="songlist(item.id)">
          </template>
          <template v-slot:sentence>
            <div>{{item.name}}</div>
          </template>
        </song-outline>
      </template>
    </div>
  </div>
</template>

<script>
import songOutline from '../../components/songOutline /songOutline'
export default {
  name: 'recommend',
  components: {
    songOutline
  },
  data () {
    return {
      // banner数据
      banners: {},
      // 热门推荐
      playlist: {},
      // 网友精选碟
      toplist: [],
      playurl: ''
    }
  },
  created () {
    // 处理请求
    this.$http.all([this.getBanner(), this.getHot(), this.getTop()])
      .then(this.$http.spread(({ data: data1 }, { data: data2 }, { data: data3 }) => {
        if (data1.code !== 200 || data2.code !== 200 || data3.code !== 200) {
          return this.$message.error('获取数据失败')
        }
        this.banners = data1.banners
        this.playlist = data2.tags
        this.toplist = data3.playlists
      }))
    this.$store.commit('editActiveName', 'recommend')
  },
  methods: {
    // 获取banner数据
    getBanner () {
      return this.$http.get('/banner')
    },
    // 获取热门分类数据
    getHot () {
      return this.$http.get('/playlist/hot')
    },
    // 获取热门歌单
    getTop () {
      return this.$http.get('/top/playlist/highquality?limit=15')
    },
    songlist (id) {
      this.$store.commit('editActiveName', 'songMenu')
      this.$router.push({ path: '/songMenuDetail', query: { id } })
    },
    play (id) {
      this.$http.get(`/song/url?id=${id}`).then(({ data }) => {
        if (data.code !== 200) {
          return this.$message.error('获取歌曲失败')
        }
        this.playurl = data.data[0].url
        console.log(data)
      })
    },
    goSongMenu (name) {
      console.log(name)
      this.$router.push({
        path: '/songMenu',
        query: {
          name: name
        }
      })
    },
    handleCurrentChange () {
      this.$http.get(`/top/playlist/highquality?before=${this.toplist[this.toplist.length - 1].updateTime}&limit=15`).then(({ data }) => {
        if (data.code !== 200) {
          return this.$message.error('获取网友精选数据失败')
        }
        this.toplist = data.playlists
        console.log(data.playlists)
      })
    }
  },
  computed: {}
}
</script>

<style lang="stylus" scoped>
  .el-carousel__item
    display flex
    justify-content center
  .hot
    font-size 22px
    margin 0 20px
    color white
  .flex
    margin 0 160px
  .banner
    height auto
    max-width 900px
</style>
