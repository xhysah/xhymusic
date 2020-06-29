<template>
  <div>
    <!--    banner-->
    <el-carousel :interval="5000" type="card" height="180px">
      <el-carousel-item v-for="(item, index) in banners" :key="index">
        <img class="banner" :src="item.imageUrl" :alt="item.typeTitle">
      </el-carousel-item>
    </el-carousel>
    <!--    网友精选-->
    <div class="container">
      <div class="hotFirst" @click="goSongMenu('全部')">推荐歌单<i class="el-icon-arrow-right"></i></div>
      <div class="grid-5">
        <template v-for="(item, index) in toplist">
          <div @click="songlist(item.id)" :key="index">
            <song-outline>
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
      <div class="grid-4">
        <template v-for="item in exclusive">
          <div :key="item.id" @click="goMv(item.id, item.type)">
            <song-outline>
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
      <div class="grid-2 latest">
        <template v-for="(item, index) in latestMusic">
          <div :key="item.id">
            <music-outline :music="item" :index="index"></music-outline>
          </div>
        </template>
      </div>
      <div class="hot">推荐MV<i class="el-icon-arrow-right"></i></div>
      <div class="grid-4">
        <template v-for="item in mvs">
          <div :key="item.id" @click="goMv(item.id, item.type)">
            <song-outline>
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
  .container
    margin 0 -20px
  .hotFirst
    margin 0 0 10px 20px
    cursor pointer
  .hot
    margin 50px 0 10px 20px
    cursor pointer
  .el-row
    padding-bottom 4px
  .latest
    margin 10px 20px
    div
      width 100%
</style>
