<template>
  <div>
    <!--    banner-->
    <el-carousel :interval="5000" indicator-position="outside">
      <el-carousel-item v-for="(item, index) in banners" :key="index">
        <img class="banner" :src="item.imageUrl" :alt="item.typeTitle">
      </el-carousel-item>
    </el-carousel>
    <!--    热门-->
    <el-row type="flex" class="row-bg" justify="center">
      <span class="hot">热门推荐</span>
      <template v-for="(item, index) in playlist">
        <el-link type="info"  :key="index" style="margin: 0 20px"><span>{{item.name}}</span></el-link>
      </template>
    </el-row>
    <div class="line"></div>
    <!--    网友精选-->
    <div class="flex">
      <template v-for="(item, index) in toplist">
        <song-outline :key="index" length="150px">
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
      toplist: {}
    }
  },
  created () {
    // 获取banner的数据
    this.getBanner()
    this.getHot()
    this.getTop()
  },
  methods: {
    getBanner () {
      this.$http.get('/banner').then(({ data }) => {
        if (data.code !== 200) {
          return this.$message.error('获取banner数据失败')
        }
        this.banners = data.banners
      })
    },
    getHot () {
      this.$http.get('/playlist/hot').then(({ data }) => {
        if (data.code !== 200) {
          return this.$message.error('获取热门推荐数据失败')
        }
        this.playlist = data.tags
      })
    },
    getTop () {
      this.$http.get('/top/playlist?offset=12').then(({ data }) => {
        if (data.code !== 200) {
          return this.$message.error('获取网友精选数据失败')
        }
        this.toplist = data.playlists
        console.log(data.playlists)
      })
    },
    songlist (id) {
      this.$router.push({ name: 'songMenuDetail', query: { path: '/top/playlist/id=', id: id } })
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
