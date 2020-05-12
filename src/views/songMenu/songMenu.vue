<template>
  <div>
    <el-main>
      <el-row>
        <span class="all">{{cateName}}</span>
        <el-button size="mini" @click="categoriesVisible=true">选择分类</el-button>
        <span class="hot" @click="cateHot">热门</span>
      </el-row>
      <div class="line"></div>
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
    <el-dialog center :visible.sync="categoriesVisible" width="50%" :modal="false">
      <el-button type="primary" plain size="mini" @click="highQuality">全部</el-button>
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
      // 歌单分类数据
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
      ]
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
    highQuality () {
      this.$http.get('/top/playlist').then(({ data }) => {
        if (data.code !== 200) {
          return this.$message.error('获取精品歌单数据失败')
        }
        this.songMenu = data.playlists
        this.cateName = '全部'
        this.categoriesVisible = false
        console.log(data)
      })
    },
    cate (cat) {
      this.$http.get(`/top/playlist?cat=${cat}`).then(({ data }) => {
        if (data.code !== 200) {
          return this.$message.error('获取分类数据失败')
        }
        this.songMenu = data.playlists
        this.categoriesVisible = false
        this.cateName = cat
        console.log(data)
      })
    },
    cateHot () {
      this.$http.get(`/top/playlist?cat=${this.cateName}`).then(({ data }) => {
        if (data.code !== 200) {
          return this.$message.error('获取分类数据失败')
        }
        this.songMenu = data.playlists
        console.log(data)
      })
    },
    songsDetail (id) {
      this.$router.push({
        path: '/songMenuDetail',
        query: {
          id
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
    margin-right 80px
  .category-item-item
    cursor pointer
    position relative
    margin 2px 0px
    font-size 10px
    left 80px
    top -25px
  .el-button
    position relative
    top -20px
</style>
