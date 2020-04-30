<template>
  <el-container>
    <!--    侧边栏部分-->
    <el-aside width="300px">
      <template v-for="(item, index) in rankingList">
        <div :key="item.coverImgId" @click="getMyselfRanking(index)">
          <el-image :src="item.coverImgUrl"></el-image>
          <span class="first">{{item.name}}</span>
          <div style="position: relative"><span class="small">{{item.updateFrequency}}</span></div>
        </div>
      </template>
    </el-aside>
    <!--      主体部分-->
    <el-main>
      <!--      主体上面部分-->
      <div>
        <img :src="activeRanking.coverImgUrl" alt="">
        <span class="active">{{activeRanking.name}}
          <span>最近更新：{{updateTime}}</span>
        </span>
        <div>
          <el-button size="mini" type="primary" icon="el-icon-video-play" plain>播放</el-button>
          <el-button size="mini" type="danger" :round="true" plain icon="el-icon-chat-line-square">({{activeRanking.commentCount}})</el-button>
          <el-button size="mini" type="danger" :round="true" plain icon="el-icon-share">({{activeRanking.shareCount}})</el-button>
          <el-button size="mini" type="danger" :round="true" plain icon="el-icon-folder-add">({{activeRanking.subscribedCount}})</el-button>
        </div>
      </div>
      <!--      主体下面部分-->
      <div class="main">
        <div class="main-title">
          <span>歌曲列表</span>
          <span>播放：<span>{{activeRanking.playCount}}</span><span>次</span></span>
        </div>
        <template v-for="(item, index) in ranking">
        <div :key="index" class="img-item">
<!--          <img :src="item.al.picUrl" alt="">-->
          <span>{{item.name}}</span>
          <span>{{item.alia[0]}}</span>
          <span>{{item.ar[0].name}}</span>
        </div>
      </template>
      </div>
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: 'ranking',
  created () {
    this.getRanking()
    this.getMyselfRanking(0)
  },
  data () {
    return {
      // 排行榜数据
      rankingList: {},
      // 正在查看的排行榜
      activeRanking: {},
      // 正在查看的排行榜数据
      ranking: {}
    }
  },
  methods: {
    getRanking () {
      this.$http.get('/toplist/detail').then(({ data }) => {
        if (data.code !== 200) {
          return this.$message.error('获取排行榜数据失败')
        }
        this.rankingList = data.list
        console.log(data.list)
      })
    },
    getMyselfRanking (idx) {
      this.$http.get('/top/list', { params: { idx: idx } }).then(({ data }) => {
        if (data.code !== 200) {
          return this.$message.error('获取排行榜数据失败')
        }
        this.activeRanking = data.playlist
        this.ranking = data.playlist.tracks
        console.log(data)
      })
    }
  },
  computed: {
    updateTime () {
      const time = new Date()
      time.setTime(this.activeRanking.updateTime)
      console.log(time.toLocaleDateString())
      return time.toLocaleDateString()
    }
  }
}
</script>

<style lang="stylus" scoped>
color=#353535
.el-container
  width 70%
  margin 0 auto
  margin-top 50px
  .el-aside
    border 2px solid color
.el-image
  width 60px
  height 60px
  margin 10px
.small
  font-size 10px
  color #909399
  position absolute
  left 90px
  top -40px
.first
  font-size 15px
  position relative
  top -50px
img
  width 150px
  height 150px
  border 2px solid color
  margin 3px
  box-shadow 0px 0px 10px color
.main
  display flex
  justify-content center
  flex-wrap wrap
  flex-direction column
  margin -20px 20px
  .img-item
    margin 10px 20px
    img
      width 30px
      height 30px
.active
  position relative
  top -120px
  font-size 25px
  margin 20px
  +div
    position relative
    left 150px
    top -90px
    margin 20px
  span
    font-size 12px
    position absolute
    left 10px
    top 40px
.el-main
  margin 0px 30px
  border 2px solid color
.main-title
  :last-child
    float right
    font-size 12px
    :first-child
      color red
</style>
