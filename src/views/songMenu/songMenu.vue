<template>
  <div>
    <div>
        <el-row>
          <span>全部</span>
          <el-button @click="categoriesVisible=true">默认按钮</el-button>
          <span>热门</span>
        </el-row>
      <div class="line"></div>
      <div class="center">
        <template v-for="(item, index) in highQualities">
          <song-outline :key="index" length="150px">
            <template v-slot:img>
              <img :src="item.coverImgUrl" alt="">
            </template>
            <template v-slot:sentence>
              <div>{{item.name}}</div>
            </template>
          </song-outline>
        </template>
      </div>
    </div>
    <!--    分类对话框-->
    <el-dialog title="收货地址" :visible.sync="categoriesVisible">
      <div v-for="(item, index) in categories" :key="index">
        <div>{{item}}</div>
        <div v-for="(items, index) in reduction[index]" :key="index">------------{{items.name}}</div>
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
    this.highQuality()
  },
  data () {
    return {
      categories: {},
      sub: {},
      categoriesVisible: false,
      highQualities: {}
    }
  },
  methods: {
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
      this.$http.get('/top/playlist/highquality').then(({ data }) => {
        if (data.code !== 200) {
          return this.$message.error('获取精品歌单数据失败')
        }
        this.highQualities = data.playlists
        console.log(data)
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
  .center
    display flex
    justify-content center
    flex-wrap wrap
</style>
