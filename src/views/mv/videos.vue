<template>
  <div>
    <el-container>
      <el-main>
        <div class="header">
          <span class="videoName">{{videoInf.title}}</span>
          <span class="singers">
            <span>by</span>
              <span>{{videoInf.creator.nickname}}</span>
            </span>
          <span class="btn-group">
            <i v-if="collected===false" class="el-icon-star-off" @click="collect(1)"><span>收藏</span></i>
            <i v-else class="el-icon-star-on" @click="collect(2)"><span>已收藏</span></i>
          </span>
        </div>
        <div class="video">
          <i class="el-icon-video-play" v-if="playIf===false"></i>
          <video :src="videoUrl" controls @play="play" @pause="pause" @canplay="pause"></video>
        </div>
        <div class="comments">
          <div class="all">全部评论 <span>评论数量<span>{{videoInf.commentCount}}</span></span></div>
          <div>
            <template v-for="item in videoComments">
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
      <el-aside width="280px">
        <div class="simiHeader">视频简介</div>
        <div class="line"></div>
        <div class="word">发布时间：{{publishTime}}</div>
        <div class="word">播放次数：{{videoInf.playTime}}次</div>
        <div class="simiHeader">相似MV</div>
        <div class="line"></div>
        <div v-for="(item, index) in relateVideos" :key="index" class="sim"  @click="goVideoDetail(item.vid)">
          <img :src="item.coverUrl" alt="">
          <div>
            <span>{{item.title}}</span><br>
            <span>by{{item.creator[0].userName}}</span>
          </div>
        </div>
      </el-aside>
    </el-container>
  </div>
</template>

<script>
import commentsTable from '../../components/commentsTable/commentsTable'
export default {
  name: 'videos',
  components: {
    commentsTable
  },
  created () {
    if (this.$store.state.playIf === true) {
      this.pauseMusic()
    }
    this.goVideoDetail(this.id)
  },
  data () {
    return {
      videoInf: {
        creator: {}
      },
      videoUrl: '',
      videoComments: [],
      total: 0,
      currentPage: 1,
      collected: false,
      playIf: false,
      relateVideos: []
    }
  },
  methods: {
    // 获取视频信息
    goVideoDetail (id) {
      this.getVideoInf(id)
      this.getVideoAdd(id)
      this.getVideoComments(id)
      this.getRelatedMv(id)
      if (this.accountId !== null) {
        this.getCollectedValue(id)
      }
    },
    getVideoInf (id) {
      this.$http.get(`/video/detail?id=${id}`).then(data => {
        this.videoInf = data.data
      })
    },
    // 获取视频地址
    getVideoAdd (id) {
      this.$http.get(`/video/url?id=${id}`).then(data => {
        if (data.urls[0].url !== undefined) {
          this.videoUrl = data.urls[0].url
        } else {
          this.$message.error('该视频地址不对')
        }
      })
    },
    // 获取视频评论信息
    getVideoComments (id) {
      this.$http.get(`/comment/video?id=${id}&limit=5`).then(data => {
        this.videoComments = data.comments
        this.total = data.total
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
    collect (value) {
      if (this.accountId !== null) {
        this.$http.get(`/video/sub?t=${value}&id=${this.id}`).then(data => {
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
    getnextComments (value) {
      this.$http.get(`/comment/video?id=${this.id}&limit=5&offset=${(value - 1) * 5}`).then(data => {
        this.videoComments = data.comments
      })
    },
    pauseMusic () {
      this.$store.commit('pauseSongs')
    },
    play () {
      this.playIf = true
    },
    pause () {
      this.playIf = false
    },
    getRelatedMv (id) {
      this.$http.get(`/related/allvideo?id=${id}`).then(data => {
        this.relateVideos = data.data
      })
    },
    getCollectedValue (id) {
      this.collected = false
      this.$http.get(`/mv/sublist?uid=${this.accountId}`).then(data => {
        for (const key of data.data) {
          if (id === key.vid) {
            this.collected = true
          }
        }
      })
    }
  },
  computed: {
    id () {
      return this.$route.query.id
    },
    publishTime () {
      const time = new Date()
      time.setTime(this.videoInf.publishTime)
      return time.toLocaleDateString()
    },
    accountId () {
      return this.$store.state.accountId
    }
  }
}
</script>

<style lang="stylus" scoped>
  .el-container
    width 74%
    margin auto
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
      margin-left 10px
      span
        margin-right 10px
        float right
        font-size 10px
        color #888888
        span
          color aquamarine
  .el-main
    margin 30px
  .video
    margin 10px
    width 100%
    display flex
    justify-content center
    align-items center
    video
      border 1px solid red
      width 700px
    i
      font-size 80px
      position absolute
  .comments
    margin-top 30px
    .all
      margin-bottom 10px
      margin-left 10px
      span
        margin-right 10px
        float right
        font-size 10px
        color #888888
        span
          margin-left 5px
          color aquamarine
  .header
    .videoName
      font-size 23px
      margin-right 20px
    .singers
      font-size 10px
      color aquamarine
      :first-child
        color white
        margin-right 5px
      span:hover
        text-decoration underline
        cursor pointer
  .btn-group
    margin-top 10px
    margin-bottom 5px
    float right
    font-size 13px
  .simiHeader
    margin-top 80px
    margin-bottom 10px
  .word
    width 170px
    font-size 12px
    color #888888
    margin-top 5px
  .sim
    margin 10px 10px 0 10px
    height 65px
    font-size 14px
    img
      width 90px
      height auto
    div
      position relative
      left 100px
      top -60px
      width 150px
      cursor pointer
      span
        display inline-block
        width 150px
        overflow hidden
        text-overflow ellipsis
        white-space nowrap
        ~span
          font-size 12px
          color #888888
  .sim:hover
    img
      width 100px
      height auto
    div
      left 110px
</style>
