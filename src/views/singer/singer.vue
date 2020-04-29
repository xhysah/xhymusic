<template>
  <div>
    <el-container>
      <!--      侧边栏-->
      <el-aside width="200px">
        <div class="header">推荐</div>
        <div class="normal" @click="show('/top/artists')"><div class="point"></div>热门歌手</div>
        <el-divider></el-divider>
        <div class="header">华语</div>
        <div class="normal" @click="show('/artist/list?type=1&area=7')"><div class="point"></div>华语男歌手</div>
        <div class="normal" @click="show('/artist/list?type=2&area=7')"><div class="point"></div>华语女歌手</div>
        <div class="normal" @click="show('/artist/list?type=3&area=7')"><div class="point"></div>华语组合/乐队</div>
        <el-divider></el-divider>
        <div class="header">欧美</div>
        <div class="normal" @click="show('/artist/list?type=1&area=96')"><div class="point"></div>欧美男歌手</div>
        <div class="normal" @click="show('/artist/list?type=2&area=96')"><div class="point"></div>欧美女歌手</div>
        <div class="normal" @click="show('/artist/list?type=3&area=96')"><div class="point"></div>欧美组合/乐队</div>
        <el-divider></el-divider>
        <div class="header">日本</div>
        <div class="normal" @click="show('/artist/list?type=1&area=8')"><div class="point"></div>日本男歌手</div>
        <div class="normal" @click="show('/artist/list?type=2&area=8')"><div class="point"></div>日本女歌手</div>
        <div class="normal" @click="show('/artist/list?type=3&area=8')"><div class="point"></div>日本组合/乐队</div>
        <el-divider></el-divider>
        <div class="header">韩国</div>
        <div class="normal" @click="show('/artist/list?type=1&area=16')"><div class="point"></div>韩国男歌手</div>
        <div class="normal" @click="show('/artist/list?type=2&area=16')"><div class="point"></div>韩国女歌手</div>
        <div class="normal" @click="show('/artist/list?type=3&area=16')"><div class="point"></div>韩国组合/乐队</div>
        <el-divider></el-divider>
        <div class="header">其他</div>
        <div class="normal" @click="show('/artist/list?type=1&area=0')"><div class="point"></div>其他男歌手</div>
        <div class="normal" @click="show('/artist/list?type=2&area=0')"><div class="point"></div>其他女歌手</div>
        <div class="normal" @click="show('/artist/list?type=13&area=0')"><div class="point"></div>其他组合/乐队</div>
      </el-aside>
      <!--      页面主体-->
      <el-main>
        <template v-for="item in singers">
          <song-outline :key="item.id" length="100px">
            <template v-slot:img>
              <img :src="item.img1v1Url" alt="">
            </template>
            <template v-slot:sentence>
              <div>{{item.name}}</div>
            </template>
          </song-outline>
        </template>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import songOutline from '../../components/songOutline /songOutline'
export default {
  name: 'singer',
  components: {
    songOutline
  },
  data () {
    return {
      singers: {}
    }
  },
  methods: {
    show (params) {
      this.$http.get(params).then(({ data }) => {
        if (data.code !== 200) {
          return this.$message.error('获取歌手信息失败')
        }
        this.singers = data.artists
        console.log(data)
      })
    }
  },
  computed: {}
}
</script>

<style lang="stylus" scoped>
  .el-container
    width 70%
    margin 0 auto
    .el-aside
      margin 20px
      .header
        font-size 20px
      .normal
        font-size 12px
  .point
    display inline-block
    width 5px
    height 5px
    border-radius 50%
    background-color white
    margin 0 10px
    margin-top -2px
</style>
