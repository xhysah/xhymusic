<template>
  <div>
    <!--      选择栏-->
    <div class="header" v-if="Object.keys(highqualityList).length!==0">
      <el-row>
        <img :src="highqualityList[0].coverImgUrl" alt="" @click="goHighQuality">
        <div>
          <button @click="goHighQuality">精品歌单</button>
          <span class="name" @click="goHighQuality">{{highqualityList[0].name}}</span>
          <span class="writer" @click="goHighQuality">{{highqualityList[0].copywriter}}</span>
        </div>
      </el-row>
    </div>
    <el-row>
      <el-popover
        placement="bottom-start"
        width="800"
        v-model="popovervisible">
        <button class="cate" @click="highCate">全部歌单</button>
        <div v-for="(item, index) in categories" :key="index">
          <div  class="category">
            <i :class="icon[index]"></i>
            {{item}}
          </div>
          <div class="category-item">
          <span class="category-item-item" v-for="(items, indexs) in reduction[index]" :key="indexs" @click="cate(items.name)">{{items.name}}
            <el-divider v-if="indexs!==reduction[index].length-1" direction="vertical"></el-divider>
          </span>
          </div>
        </div>
        <el-button class="button" slot="reference">{{cateName}}<i class="el-icon-arrow-right"></i></el-button>
      </el-popover>
      <div class="link">
        <template v-for="(item, index) in playlist">
          <el-link type="info" :key="index" style="margin: 0 10px" @click="cate(item.name)">
            <span>{{item.name}}</span></el-link>
        </template>
      </div>
    </el-row>
    <!--      歌单列表-->
    <div class="grid-4">
      <template v-for="(item, index) in songMenu">
        <song-outline :key="index">
          <template v-slot:img>
            <img :src="item.coverImgUrl" alt="" @click="songsDetail(item.id)">
          </template>
          <template v-slot:creator>
            <span>by {{item.creator.nickname}}</span>
          </template>
          <template v-slot:sentence>
            <div>{{item.name}}</div>
          </template>
        </song-outline>
      </template>
    </div>
    <!--    分页-->
    <el-pagination
      background
      layout="prev, pager, next"
      :page-size="20"
      :total="total"
      @prev-click="pre"
      @next-click="next"
      @current-change="current"
      :current-page.sync="currentPage">
    </el-pagination>
  </div>
</template>

<script>
import songOutline from '../../components/songOutline/songOutline'
export default {
  name: 'songMenu',
  components: {
    songOutline
  },
  created () {
    // 获取歌单分类数据
    this.getSongMenu()
    // 判断是当前路由有没有定义name值，如果没有，则显示全部精品歌单数据，如果有，则根据name值来显示
    if (this.$route.query.name === undefined) {
      this.highCate()
    } else {
      this.cate(this.$route.query.name)
    }
    this.getHot()
    this.getHighQuality()
    this.$store.commit('editActiveName', 'songMenu')
  },
  data () {
    return {
      // 歌单分类数据名称
      cateName: '',
      categories: {},
      sub: {},
      // 分类对话框是否显示
      // 歌单
      songMenu: {},
      icon: [
        'el-icon-edit',
        'el-icon-cold-drink',
        'el-icon-headset',
        'el-icon-sunny',
        'el-icon-scissors'
      ],
      // 当前的页码值
      currentPage: 1,
      // 总的页码值
      total: 0,
      playlist: [],
      highqualityList: [],
      popovervisible: false
    }
  },
  methods: {
    // 获取热门分类数据
    getHot () {
      this.$http.get('/playlist/hot').then(data => {
        this.playlist = data.tags
      })
    },
    // 分类数据
    getSongMenu () {
      this.$http.get('/playlist/catlist').then(data => {
        this.categories = data.categories
        this.sub = data.sub
      })
    },
    // 获取分类歌单
    highCate () {
      this.$http.get('/top/playlist?limit=20').then(data => {
        this.currentPage = 1
        this.total = data.total
        this.songMenu = data.playlists
        this.cateName = '全部歌单'
        this.popovervisible = false
        this.getHighQuality('全部')
      })
    },
    getHighQuality (cat) {
      this.$http.get(`/top/playlist/highquality?cat=${cat}&&limit=1`).then(data => {
        if (Object.keys(data.playlists).length !== 0) {
          this.highqualityList = data.playlists
        } else {
          this.highqualityList = []
        }
      })
    },
    // 根据cat值，来获取对应歌单
    cate (cat, offset) {
      let info = ''
      if (offset !== undefined) {
        info = `/top/playlist?cat=${cat}&limit=20&offset=${20 * (offset - 1)}`
      } else {
        info = `/top/playlist?cat=${cat}&limit=20`
        this.currentPage = 1
      }
      this.$http.get(info).then(data => {
        this.total = data.total
        this.songMenu = data.playlists
        this.popovervisible = false
        this.cateName = cat
      })
      this.getHighQuality(cat)
    },
    // 根据歌单的id，去往歌单详细信息页面
    songsDetail (id) {
      this.$router.push({
        path: '/songMenuDetail',
        query: {
          id
        }
      })
    },
    // 上一页分页
    pre (value) {
      this.cate(this.cateName, value)
    },
    // 下一页分页
    next (value) {
      this.cate(this.cateName, value)
    },
    // 当前分页
    current (value) {
      this.cate(this.cateName, value)
    },
    goHighQuality () {
      this.$router.push({
        path: '/highQuality',
        query: {
          name: this.cateName
        }
      })
    }
  },
  computed: {
    reduction () {
      const list = [0, 1, 2, 3, 4]
      const cateList = list.map((value) => {
        const cate = this.sub.filter((n) => {
          return n.category === value
        })
        return cate
      })
      return cateList
    }
  }
}
</script>

<style lang="stylus" scoped>
  .el-row
    margin 10px
  .category
    font-size 18px
    i
      margin 0 5px
  .category-item
    display flex
    flex-wrap wrap
    margin-right 55px
  .category-item-item
    cursor pointer
    position relative
    margin 3px 0
    font-size 14px
    line-height 18px
    left 80px
    top -25px
  .category-item-item:hover
    color red
  .el-pagination
    display flex
    justify-content center
    position relative
    margin-top 10px
  .link
    display inline-block
    float right
  .header
    cursor pointer
    background-color #131313
    margin 15px
    position relative
    img
      width 150px
      height 150px
      border-radius 20px
    .name
      position absolute
      top 70px
      left 170px
    .writer
      position absolute
      left 170px
      top 100px
      font-size 14px
      color #888888
    button
      cursor pointer
      width 110px
      position absolute
      left 170px
      top 30px
      border 1px solid #ffaa00
      color #ffaa00
      background-color transparent
      border-radius 14px
      padding 5px
  .button
    margin-left 10px
    border-radius 10px
    background-color black
    color #cdc9c9
    padding 5px 15px
    border 1px solid #888888
  .cate
    margin 10px
    border-radius 10px
    background-color black
    color #cdc9c9
    padding 2px 15px
    border 1px solid #888888
</style>
