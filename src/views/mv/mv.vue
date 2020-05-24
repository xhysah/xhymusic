<template>
  <div>
    <el-container>
      <el-main>
        <div class="header">
          <span class="mv">MV</span>
          <span class="mvName">{{mvInf.name}}</span>
          <span class="singers">
            <span>by</span>
          <template v-for="(items, index) in mvInf.artists">
            <span :key="items.id" v-if="index===0">{{items.name}}</span>
            <span :key="items.id" v-else>/{{items.name}}</span>
          </template>
            </span>
          <span class="btn-group">
            <i v-if="collected===false" class="el-icon-star-off" @click="collect(1)"><span>收藏</span></i>
            <i v-else class="el-icon-star-on" @click="collect(2)"><span>已收藏</span></i>
          </span>
        </div>
        <div class="video">
          <video :src="mvUrl" autoplay></video>
        </div>
        <div class="comments">
          <div class="all">全部评论 <span>评论数量<span>{{mvInf.commentCount}}</span></span></div>
          <div>
            <template v-for="item in mvComments">
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
      <el-aside width="240px">
        <div class="simiHeader">视频简介</div>
        <div class="line"></div>
        <div class="word">发布时间{{mvInf.publishTime}}</div>
        <div class="word">播放次数{{mvInf.playCount}}</div>
        <div class="simiHeader">相似MV</div>
        <div class="line"></div>
        <div v-for="(item, index) in simiMvs" :key="index" class="sim"  @click="goMvDetail(item.id)">
          <img :src="item.cover" alt="">
          <div>
            <span>{{item.name}}</span><br>
            <span>by{{item.artistName}}</span>
          </div>
        </div>
      </el-aside>
    </el-container>
  </div>
</template>

<script>
import commentsTable from '../../components/commentsTable/commentsTable'
export default {
  name: 'mv',
  components: {
    commentsTable
  },
  created () {
    this.getMvInf(this.id)
    this.getMvAdd(this.id)
    this.getSimiMv(this.id)
    this.getMvComments(this.id)
  },
  data () {
    return {
      mvInf: {},
      mvUrl: '',
      mvComments: [],
      total: 0,
      currentPage: 1,
      collected: false,
      simiMvs: []
    }
  },
  methods: {
    // 获取mv信息
    getMvInf (id) {
      this.$http.get(`/mv/detail?mvid=${id}`).then(data => {
        this.mvInf = data.data
        console.log(data)
      })
    },
    // 获取mv地址
    getMvAdd (id) {
      this.$http.get(`/mv/url?id=${id}`).then(data => {
        this.mvUrl = data.data.url
      })
    },
    // 获取mv评论信息
    getMvComments (id) {
      this.$http.get(`/comment/mv?id=${id}`).then(data => {
        this.mvComments = data.hotComments
        this.total = data.hotComments.length
        console.log(data)
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
        this.$http.get(`/mv/sub?t=${value}&id=${this.currentId}`).then(data => {
          if (data.code === 200) {
            if (value === 1) {
              this.$message({
                message: '成功收藏该mv',
                type: 'success'
              })
              this.collected = true
            } else {
              this.$message({
                message: '取消收藏该mv',
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
    goMvDetail (id) {
      this.getMvInf(id)
      this.getMvAdd(id)
      this.getSimiMv(id)
      this.getMvComments(id)
    },
    // 获取相似mv
    getSimiMv (id) {
      this.$http.get(`/simi/mv?mvid=${id}`).then(data => {
        this.simiMvs = data.mvs
        console.log(data)
      })
    }
  },
  computed: {
    id () {
      return this.$route.query.id
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
      width 55px
      height 55px
    div
      position relative
      left 70px
      top -60px
      span
        display inline-block
        width 170px
        overflow hidden
        text-overflow ellipsis
        white-space nowrap
        ~span
          font-size 12px
          color #888888
  .sim:hover
    img
      width 65px
      height 65px
    div
      left 80px
  .header
    .mv
      position relative
      margin-right 10px
      top -2px
      font-size 14px
      padding-left 2px
      padding-right 2px
      border 1px solid red
      color antiquewhite
    .mvName
      font-size 23px
      margin-right 20px
    .singers
      font-size 10px
      color aquamarine
      :first-child
        color white
        margin-right 5px
  .el-main
    margin 30px
  .video
    margin 10px
    width 100%
    video
      border 1px solid red
      width 700px
  .btn-group
    margin-top 10px
    margin-right 30px
    float right
    font-size 13px
</style>
