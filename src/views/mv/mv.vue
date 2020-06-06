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
            <span :key="items.id" v-if="index===0" @click="goSinger(items.id)">{{items.name}}</span>
            <span :key="items.id" v-else @click="goSinger(items.id)">/{{items.name}}</span>
          </template>
            </span>
          <span class="btn-group">
            <i v-if="collected===false" class="el-icon-star-off" @click="collect(1)"><span>收藏</span></i>
            <i v-else class="el-icon-star-on" @click="collect(2)"><span>已收藏</span></i>
          </span>
        </div>
        <div class="video">
<!--          <i class="el-icon-video-pause" v-if="playIf===true"></i>-->
          <i class="el-icon-video-play" v-if="playIf===false"></i>
          <video ref="video" :src="mvUrl" controls @play="play" @pause="pause" @ended="pause"></video>
        </div>
        <div class="comments">
          <div class="all">全部评论 <span>评论数量<span>{{mvInf.commentCount}}</span></span></div>
          <div>
            <template v-for="item in mvComments">
              <div :key="item.commentId">
                <div class="simLine"></div>
                <comments-table :comment="item" width="600px"></comments-table>
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
      <el-aside width="300px">
        <div class="simiHeader">视频简介</div>
        <div class="line"></div>
        <div class="word">发布时间：{{mvInf.publishTime}}</div>
        <div class="word">播放次数：{{mvInf.playCount}}次</div>
        <div class="simiHeader">相似MV</div>
        <div class="line"></div>
        <div v-for="(item, index) in simiMvs" :key="index" class="sim"  @click="goMvDetail(item.id, item.type)">
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
    this.goMvDetail(this.id, this.type)
    if (this.$store.state.playIf === true) {
      this.pauseMusic()
    }
  },
  data () {
    return {
      mvInf: {},
      mvUrl: '',
      mvComments: [],
      total: 0,
      currentPage: 1,
      collected: false,
      simiMvs: [],
      playIf: false
    }
  },
  methods: {
    // 获取mv信息
    getMvInf (id) {
      this.$http.get(`/mv/detail?mvid=${id}`).then(data => {
        this.mvInf = data.data
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
      this.$http.get(`/comment/mv?id=${id}&limit=5`).then(data => {
        this.mvComments = data.comments
        this.total = data.total
      })
    },
    getnextComments (value) {
      this.$http.get(`/comment/mv?id=${this.id}&limit=5&offset=${(value - 1) * 5}`).then(data => {
        this.mvComments = data.comments
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
        this.$http.get(`/mv/sub?t=${value}&mvid=${this.id}`).then(data => {
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
    goMvDetail (id, type) {
      if (type === 1) {
        this.$router.push({
          path: '/videos',
          query: {
            id,
            type
          }
        })
      } else {
        this.id = id
        this.getMvInf(id)
        this.getMvAdd(id)
        this.getSimiMv(id)
        this.getMvComments(id)
        if (this.accountId !== null) {
          this.getCollectedValue(id)
        }
      }
    },
    // 获取相似mv
    getSimiMv (id) {
      this.$http.get(`/simi/mv?mvid=${id}`).then(data => {
        this.simiMvs = data.mvs
        console.log(data)
      })
    },
    // 判断该歌单是否被收藏
    getCollectedValue (id) {
      this.collected = false
      this.$http.get(`/mv/sublist?uid=${this.accountId}`).then(data => {
        for (const key of data.data) {
          if (id === key.vid) {
            this.collected = true
          }
        }
      })
    },
    // 去往歌手页面
    goSinger (id) {
      this.$router.push({ name: 'singerInformation', params: { sid: id } })
    },
    pauseMusic () {
      this.$store.commit('pauseSongs')
    },
    play () {
      this.playIf = true
    },
    pause () {
      this.playIf = false
    }
  },
  computed: {
    id: {
      get () {
        return this.$route.query.id
      },
      set (newValue) {
        return newValue
      }
    },
    type () {
      return this.$route.query.type
    },
    accountId () {
      return this.$store.state.accountId
    }
  }
}
</script>

<style lang="stylus" scoped>
  .el-pagination
    display flex
    justify-content center
  .comments
    width 92%
    margin auto
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
  .simiHeader
    margin-top 80px
    margin-bottom 10px
  .word
    width 170px
    font-size 12px
    color #888888
    margin-top 5px
  .sim
    margin 10px 10px 0 0
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
        width 190px
        overflow hidden
        text-overflow ellipsis
        white-space nowrap
        ~span
          font-size 12px
          color #888888
  .sim:hover
    img
      width 95px
      height auto
    div
      left 110px
  .header
    margin-top 20px
    margin-left 22px
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
      span:hover
        text-decoration underline
        cursor pointer
  .video
    margin 20px 10px
    width 100%
    display flex
    justify-content center
    align-items center
    video
      width 94%
    i
      font-size 80px
      position absolute
  .btn-group
    margin-bottom 5px
    margin-top 10px
    margin-right 30px
    float right
    font-size 13px
</style>
