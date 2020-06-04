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
      <template v-for="(item, index) in playlist">
        <el-link type="info"  :key="index" style="margin: 0 20px" @click="goSongMenu(item.name)"><span>{{item.name}}</span></el-link>
      </template>
    </el-row>
    <div class="line"></div>
    <!--    网友精选-->
    <div class="el-main">
      <div class="hot" @click="goSongMenu('全部')">推荐歌单<i class="el-icon-arrow-right"></i></div>
      <div class="flex">
        <template v-for="(item, index) in toplist">
          <div @click="songlist(item.id)" :key="index">
            <song-outline length="150px" height="150px" active="active">
              <template v-slot:img>
                <img :src="item.picUrl" alt="">
              </template>
              <template v-slot:creator>
                <span><i class="el-icon-caret-right"></i>{{count(item.playCount)}}</span>
              </template>
              <template v-slot:sentence>
                <div>{{item.name}}</div>
              </template>
            </song-outline>
          </div>
        </template>
      </div>
      <div class="hot">独家放送<i class="el-icon-arrow-right"></i></div>
      <div class="flex-1">
        <template v-for="item in exclusive">
          <div :key="item.id" @click="goMv(item.id, item.type)">
            <song-outline length="180px">
              <template v-slot:img>
                <img :src="item.sPicUrl" alt="">
              </template>
              <template v-slot:creator>
                <span>{{item.copywriter}}</span>
              </template>
              <template v-slot:sentence>
                <div>{{item.copywriter}}</div>
              </template>
            </song-outline>
          </div>
        </template>
      </div>
      <div class="hot" @click="goLatest">最新音乐<i class="el-icon-arrow-right"></i></div>
      <div class="flex-1 latest">
        <template v-for="item in latestMusic">
          <music-outline :key="item.id" :music="item"></music-outline>
        </template>
      </div>
      <div class="hot">推荐MV<i class="el-icon-arrow-right"></i></div>
      <div class="flex-1">
        <template v-for="item in mvs">
          <div :key="item.id" @click="goMv(item.id, item.type)">
            <song-outline length="180px">
              <template v-slot:img>
                <img :src="item.picUrl" alt="">
              </template>
              <template v-slot:creator>
                <span>{{item.copywriter}}</span>
              </template>
              <template v-slot:sentence>
                <div>{{item.name}}</div>
              </template>
            </song-outline>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import musicOutline from '../../components/songOutline /musicOutline'
import songOutline from '../../components/songOutline /songOutline'
export default {
  name: 'recommend',
  components: {
    songOutline,
    musicOutline
  },
  data () {
    return {
      // banner数据
      banners: {},
      // 热门推荐
      playlist: {},
      // 网友精选碟
      toplist: [],
      latestMusic: [],
      mvs: [],
      exclusive: []
    }
  },
  created () {
    // 处理请求
    this.getBanner()
    this.getHot()
    this.getTop()
    this.getLatestMusic()
    this.getMv()
    this.getExclusive()
    this.$store.commit('editActiveName', 'recommend')
  },
  methods: {
    // 获取banner数据
    getBanner () {
      this.$http.get('/banner').then(data => {
        this.banners = data.banners
      })
    },
    // 获取热门分类数据
    getHot () {
      this.$http.get('/playlist/hot').then(data => {
        this.playlist = data.tags
      })
    },
    // 获取热门歌单
    getTop () {
      this.$http.get('/personalized?limit=10').then(data => {
        this.toplist = data.result
      })
    },
    // 获取最新音乐
    getLatestMusic () {
      this.$http.get('/top/song?limit=10').then(data => {
        this.latestMusic = data.data.splice(0, 10)
      })
    },
    // 获取推荐mv
    getMv () {
      this.$http.get('/personalized/mv').then(data => {
        this.mvs = data.result
      })
    },
    // 获取独家放送
    getExclusive () {
      this.$http.get('/personalized/privatecontent').then(data => {
        this.exclusive = data.result
      })
    },
    // 去往歌单详情页
    songlist (id) {
      this.$store.commit('editActiveName', 'songMenu')
      this.$router.push({ path: '/songMenuDetail', query: { id } })
    },
    goLatest () {
      this.$router.push({
        path: '/latest'
      })
    },
    // 根据热门分类，去往对应歌单分类
    goSongMenu (name) {
      this.$router.push({
        path: '/songMenu',
        query: {
          name: name
        }
      })
    },
    count (number) {
      if (number / 10000 > 1) {
        return `${(Math.floor(number / 10000))}万`
      } else {
        return number
      }
    },
    goMv (id, type) {
      if (type === 1) {
        this.$router.push({
          path: '/videos',
          query: {
            id,
            type
          }
        })
      } else {
        this.$router.push({
          path: '/mv',
          query: {
            id,
            type
          }
        })
      }
    }
  },
  computed: {
  }
}
</script>

<style lang="stylus" scoped>
  .el-carousel__item
    display flex
    justify-content center
  .hot
    font-size 20px
    margin 0 20px
    color white
    cursor pointer
  .el-main
    margin 0 160px
    .flex
      margin-bottom 50px
  .banner
    height auto
    max-width 900px
  .el-row
    padding-bottom 4px
  .latest
    margin 20px
</style>
