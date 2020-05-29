<template>
  <div>
    <el-container v-if="ranking">
      <!--    侧边栏部分-->
      <el-aside width="260px">
        <template v-for="(item, index) in rankingList">
          <div :key="item.coverImgId" @click="getMyselfRanking(idx[index])" :class="{check:active===idx[index]}" class="categories">
            <el-image :src="item.coverImgUrl" :class="{imgChange:active===idx[index]}"></el-image>
            <span class="first">{{item.name}}</span>
            <div style="position: relative"><span class="small">{{item.updateFrequency}}</span></div>
          </div>
        </template>
      </el-aside>
      <!--      主体部分-->
      <el-main>
        <!--      主体上面部分-->
        <div class="aside">
          <img :src="activeRanking.coverImgUrl" alt="">
          <span class="actives">{{activeRanking.name}}
          <span>最近更新：{{updateTime}}</span>
        </span>
          <div>
            <el-button size="mini" type="danger" icon="el-icon-video-play" plain @click="play()">播放</el-button>
            <i v-if="collected===false" class="el-icon-star-off" @click="collect(1)"><span>收藏</span></i>
            <i v-else class="el-icon-star-on" @click="collect(2)"><span>已收藏</span></i>
          </div>
        </div>
        <!--      主体下面部分-->
        <div class="main">
          <div class="main-title">
            <span>歌曲列表</span>
            <span class="songNum">{{activeRanking.trackCount}}首歌</span>
            <span>播放：<span>{{activeRanking.playCount}}</span><span>次</span></span>
          </div>
          <song-table :songs="ranking"></song-table>
        </div>
        <div class="comments">
          <div class="all">全部评论</div>
          <div>
            <template v-for="item in comments">
              <div :key="item.commentId">
                <div class="simLine"></div>
                <comments-table :comment="item" width="530px"></comments-table>
              </div>
            </template>
          </div>
          <el-pagination
            v-if="total/5>1"
            background
            layout="prev, pager, next"
            :page-size="5"
            :total="total"
            @prev-click="pre"
            @next-click="next"
            @current-change="current"
            :current-page.sync="currentPage">
          </el-pagination>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import commentsTable from '../../components/commentsTable/commentsTable'
import songTable from '../../components/songTable/songTable'
export default {
  name: 'ranking',
  components: {
    songTable,
    commentsTable
  },
  created () {
    // 得到排行数据和第一个排行的详细数据
    this.getRanking()
    this.getMyselfRanking(3)
    // 修改当前活跃的主菜单名
    this.$store.commit('editActiveName', 'ranking')
  },
  data () {
    return {
      // 排行榜数据
      rankingList: {},
      // 正在查看的排行榜
      activeRanking: {},
      // 正在查看的排行榜音乐数据
      ranking: [],
      // 根据这个值去请求排行榜数据
      idx: [3, 0, 2, 1, 23, 24, 25, 26, 27, 22, 28, 36, 29, 30, 5, 6, 21, 7, 8, 10, 9, 20, 31, 32, 19, 35],
      // 当前排行榜的idx
      active: 3,
      // 评论数据
      comments: {},
      // 第一页分页
      currentPage: 1,
      // 当前排行榜id
      currentId: 0,
      // 总的评论数量
      total: 0,
      // 是否被收藏
      collected: false
    }
  },
  methods: {
    // 获取排行榜数据
    getRanking () {
      this.$http.get('/toplist/detail').then(data => {
        this.rankingList = data.list
      })
    },
    // 根据id获取排行榜详细数据
    getMyselfRanking (idx) {
      this.active = idx
      this.$http.get(`/top/list?idx=${idx}`).then(data => {
        this.activeRanking = data.playlist
        this.ranking = data.playlist.tracks
        this.currentId = data.playlist.id
        this.getComments(data.playlist.id)
        // 判断是否收藏
        if (this.accountId !== null) {
          this.getCollectedValue(data.playlist.id)
        }
      })
    },
    // 根据歌单id获取歌单评论
    getComments (id) {
      return this.$http.get(`/comment/playlist?id=${id}&limit=5`).then(data => {
        this.total = data.total
        this.currentPage = 1
        this.comments = data.comments
      })
    },
    // 全部播放时的操作
    play () {
      this.$store.commit('getTotal', this.activeRanking.trackCount)
      this.$store.commit('getSongs', this.ranking)
      this.$store.dispatch('play', { num: 0, name: 'songTable' })
    },
    getnextComments (value) {
      this.$http.get(`/comment/playlist?id=${this.currentId}&limit=5&offset=${(value - 1) * 5}`).then(data => {
        this.comments = data.comments
      })
    },
    // 上一页评论
    pre (value) {
      this.getnextComments(value)
    },
    // 下一页评论
    next (value) {
      this.getnextComments(value)
    },
    // 当前评论
    current (value) {
      this.getnextComments(value)
    },
    // 收藏该歌单
    collect (value) {
      if (this.accountId !== null) {
        this.$http.get(`/playlist/subscribe?t=${value}&id=${this.currentId}`).then(data => {
          if (data.code === 200) {
            if (value === 1) {
              this.$message({
                message: '成功收藏该排行榜歌单',
                type: 'success'
              })
              this.collected = true
            } else {
              this.$message({
                message: '取消收藏该排行榜歌单',
                type: 'warning'
              })
              this.collected = false
            }
          }
        })
      } else {
        this.$message.error('请登录')
      }
    },
    getCollectedValue (id) {
      this.collected = false
      this.$http.get(`/user/playlist?uid=${this.accountId}`).then(data => {
        for (const key of data.playlist) {
          if (Number(id) === key.id) {
            this.collected = true
          }
        }
      })
    }
  },
  computed: {
    // 对更新时间做计算
    updateTime () {
      const time = new Date()
      time.setTime(this.activeRanking.updateTime)
      // console.log(time.toLocaleDateString())
      return time.toLocaleDateString()
    },
    // 得到用户id
    accountId () {
      return this.$store.state.accountId
    }
  },
  watch: {
  }
}
</script>

<style lang="stylus" scoped>
color=#353535
  .el-container
    width 74%
    margin 0 auto
    margin-top 50px
    .el-aside
      border 2px solid color
      .categories:hover
        .el-image
          width 70px
          height 70px
          box-shadow 0 0 10px red
  .el-image
    width 60px
    height 60px
    margin 10px
  .small
    font-size 8px
    color #909399
    position absolute
    left 90px
    top -40px
  .first
    font-size 13px
    position relative
    top -50px
  .main
    display flex
    justify-content center
    flex-wrap wrap
    flex-direction column
    margin 10px 20px
  .aside
    position relative
    .actives
      position absolute
      font-size 25px
      margin 20px
      +div
        position absolute
        left 160px
        top 70px
        margin 20px
      span
        color #909399
        font-size 12px
        position absolute
        left 10px
        top 40px
    img
      width 150px
      height 150px
      border 2px solid color
      margin 3px
      box-shadow 0 0 10 color
  .el-main
    margin 0 20px
    border 2px solid color
  .main-title
    margin-bottom 5px
    .songNum
      font-size 12px
      margin-left 20px
      color #888888
    :last-child
      float right
      font-size 12px
      :first-child
        color red
  .audio
    width 85%
    border-radius 10px 10px 0 0
    margin auto
    background-color #1c1c1c
    .i-group
      display inline-block
      margin auto
    .i
      width 70%
      display inline-block
      margin auto
      span
        margin 0
        color white
        font-size 13px
        +span
          font-size 12px
          color #888888
          margin 0 20px
    img
      width 30px
      height 30px
      display inline-block
      margin 0 15px
      position relative
      top 5px
    i
      display inline-block
      font-size 30px
      margin auto 2px
    span
      display inline-block
      margin 0 0 0 20px
      font-size 13px
      color #888888
  .check
    background-color #1c1c1c
  .imgChange
    width 70px
    height 70px
  .el-pagination
    display flex
    justify-content center
  .comments
    margin-top 30px
    .all
      margin-bottom 10px
  i
    margin-left 10px
    span
      font-size 10px
      margin-left 2px
</style>
