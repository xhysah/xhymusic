<template>
  <div>
    <el-main>
      <!--      选择栏-->
      <el-row>
        <span class="all">{{cateName}}</span>
        <el-button type="danger" plain size="mini" @click="categoriesVisible=true">选择分类</el-button>
        <span class="hot" @click="cate(cateName)">热门</span>
      </el-row>
      <!--      分割线-->
      <div class="line"></div>
      <!--      歌单列表-->
      <div class="flex">
        <template v-for="(item, index) in songMenu">
          <song-outline :key="index" length="150px" height="150px">
            <template v-slot:img>
              <img :src="item.coverImgUrl" alt=""  @click="songsDetail(item.id)">
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
    </el-main>
    <!--    分类对话框-->
    <el-dialog center :visible.sync="categoriesVisible" width="50%" :modal="false" class="dialog">
      <el-button type="danger" plain size="mini" @click="highQuality">全部</el-button>
      <div v-for="(item, index) in categories" :key="index">
        <div  class="category">
          <i :class="icon[index]"></i>
          {{item}}
        </div>
        <div class="category-item">
          <span class="category-item-item" v-for="(items, index) in reduction[index]" :key="index" @click="cate(items.name)">{{items.name}}
            <el-divider direction="vertical"></el-divider>
          </span>
        </div>
      </div>
    </el-dialog>
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
import songOutline from '../../components/songOutline /songOutline'
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
      this.highQuality()
      console.log('ewe')
    } else {
      this.cate(this.$route.query.name)
      console.log('aada')
    }
    this.$store.commit('editActiveName', 'songMenu')
  },
  data () {
    return {
      // 歌单分类数据名称
      cateName: '',
      categories: {},
      sub: {},
      // 分类对话框是否显示
      categoriesVisible: false,
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
      total: 0
    }
  },
  methods: {
    // 分类数据
    getSongMenu () {
      this.$http.get('/playlist/catlist').then(({ data }) => {
        if (data.code !== 200) {
          return this.$message.error('获取歌单分类数据失败')
        }
        this.categories = data.categories
        this.sub = data.sub
        console.log(data)
      })
    },
    // 获取精品歌单
    highQuality () {
      this.$http.get('/top/playlist?limit=20').then(({ data }) => {
        if (data.code !== 200) {
          return this.$message.error('获取精品歌单数据失败')
        }
        this.currentPage = 1
        this.total = data.total
        this.songMenu = data.playlists
        this.cateName = '全部'
        this.categoriesVisible = false
        console.log(data)
      })
    },
    // 根据cat值，来获取对应歌单
    cate (cat, offset) {
      let info = ''
      console.log(offset)
      if (offset !== undefined) {
        info = `/top/playlist?cat=${cat}&limit=20&offset=${20 * (offset - 1)}`
      } else {
        info = `/top/playlist?cat=${cat}&limit=20`
        this.currentPage = 1
      }
      this.$http.get(info).then(({ data }) => {
        if (data.code !== 200) {
          return this.$message.error('获取分类数据失败')
        }
        this.total = data.total
        this.songMenu = data.playlists
        this.categoriesVisible = false
        this.cateName = cat
        console.log(data)
      })
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
    pre (a) {
      this.cate(this.cateName, a)
    },
    next (a) {
      this.cate(this.cateName, a)
    },
    current (a) {
      this.cate(this.cateName, a)
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
  .el-main
    width 80%
    margin 0 auto
    .hot
      position relative
      left 70%
      background-color red
      font-size 13px
      padding 3px 10px
      border-radius 5px
      cursor pointer
    .all
      font-size 25px
      margin-left 50px
      margin-right 20px
    .el-button
      position relative
      top -2px
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
    font-size 12px
    line-height 18px
    left 80px
    top -25px
  .el-button
    position relative
    top -20px
  .category-item-item:hover
    font-size 15px
    text-decoration underline
  .dialog
    /*color white*/
    margin-top 10px
    >>>.el-dialog__header
      background-color black
      border 1px solid red
      border-bottom none
      padding 5px
    >>>.el-dialog__body
      background-color black
      border 1px solid red
      border-top none
      color white
      padding 25px 25px 0 25px
  .el-pagination
    display flex
    justify-content center
    position relative
    top -20px
</style>
