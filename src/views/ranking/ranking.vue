<template>
  <div>
    <el-container v-if="ranking">
      <!--    侧边栏部分-->
      <el-aside width="300px">
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
        <div>
          <img :src="activeRanking.coverImgUrl" alt="">
          <span class="actives">{{activeRanking.name}}
          <span>最近更新：{{updateTime}}</span>
        </span>
          <div class="btn-group">
            <el-button size="mini" type="primary" icon="el-icon-video-play" plain @click="play()">播放</el-button>
<!--            <el-button size="mini" type="danger" :round="true" plain icon="el-icon-chat-line-square">-->
<!--              ({{activeRanking.commentCount}})-->
<!--            </el-button>-->
            <i v-if="collected===false" class="el-icon-star-off" @click="collect(1)"><span>收藏</span></i>
            <i v-else class="el-icon-star-on" @click="collect(2)"><span>已收藏</span></i>
<!--            <el-button size="mini" type="danger" :round="true" plain icon="el-icon-share">-->
<!--              ({{activeRanking.shareCount}})-->
<!--            </el-button>-->
<!--            <el-button size="mini" type="danger" :round="true" plain icon="el-icon-folder-add">-->
<!--              ({{activeRanking.subscribedCount}})-->
<!--            </el-button>-->
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
                <comments-table :comment="item" width="400px"></comments-table>
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
    this.$store.commit('editActiveName', 'ranking')
  },
  data () {
    return {
      // 排行榜数据
      rankingList: {},
      // 正在查看的排行榜
      activeRanking: {},
      // 正在查看的排行榜数据
      ranking: [],
      idx: [3, 0, 2, 1, 23, 24, 25, 26, 27, 22, 28, 36, 29, 30, 5, 6, 21, 7, 8, 10, 9, 20, 31, 32, 19, 35],
      active: 3,
      comments: {},
      currentPage: 1,
      currentId: 0,
      // 总的评论数量
      total: 0,
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
      this.$http.get('/top/list', { params: { idx: idx } }).then(data => {
        this.activeRanking = data.playlist
        this.ranking = data.playlist.tracks
        this.currentId = data.playlist.id
        this.getComments(data.playlist.id)
        this.getCollectedValue(data.playlist.id)
        console.log(data)
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
    pre (a) {
      this.getnextComments(a)
    },
    next (a) {
      this.getnextComments(a)
    },
    current (a) {
      this.getnextComments(a)
    },
    // 收藏该歌单
    collect (value) {
      if (this.accountId) {
        this.$http.get(`/playlist/subscribe?t=${value}&id=${this.currentId}`).then(data => {
          if (data.code === 200) {
            if (value === 1) {
              this.collected = true
            } else {
              this.collected = false
            }
          }
        })
      } else {
        console.log('hdjahd')
      }
    },
    getCollectedValue (id) {
      if (this.accountId) {
        this.collected = false
        this.$http.get(`/user/playlist?uid=${this.accountId}`).then(data => {
          for (const key of data.playlist) {
            if (Number(id) === key.id) {
              this.collected = true
            }
          }
        })
      }
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
    width 70%
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
    box-shadow 0 0 10 color
  .main
    display flex
    justify-content center
    flex-wrap wrap
    flex-direction column
    margin -20px 20px
  .actives
    position relative
    top -120px
    font-size 25px
    margin 20px
    +div
      position relative
      left -190px
      top -50px
      margin 20px
    span
      font-size 12px
      position absolute
      left 10px
      top 40px
  .el-main
    margin 0 30px
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
  .btn-group
    display inline-block
  .imgChange
    width 70px
    height 70px
  .el-pagination
    display flex
    justify-content center
  .el-pagination.is-background .el-pager li:not(.disabled)
  >>>.active
    background-color red !important
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
