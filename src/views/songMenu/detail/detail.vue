<template>
  <div class="container">
    <el-container>
      <el-main>
        <div class="header">
          <img :src="songMenuDetail.coverImgUrl" alt="">
          <span class="head"><span>歌单</span><div></div>{{songMenuDetail.name}}</span>
          <div class="creator">
            <img :src="songMenuDetail.creator.avatarUrl" alt="">
            <span>{{songMenuDetail.creator.nickname}}</span>
            <span>{{createTime}}创建</span>
          </div>
          <div class="button-group">
            <el-button size="mini" type="primary" icon="el-icon-video-play" plain @click="play()">播放全部</el-button>
            <i v-if="collected===false" class="el-icon-star-off" @click="collect(1)"><span>收藏</span></i>
            <i v-else class="el-icon-star-on" @click="collect(2)"><span>已收藏</span></i>
          </div>
          <div class="tags">标签:
            <template v-for="(item, index) in songMenuDetail.tags">
              <span :key="index">{{item}}</span>
            </template>
          </div>
          <div class="introduce">介绍: {{songMenuDetail.description}}</div>
        </div>
        <div class="songHead">歌曲列表
          <span>{{songMenuDetail.trackCount}}首歌</span>
          <span>播放：<span>{{songMenuDetail.playCount}}</span><span>次</span></span>
        </div>
        <song-table :songs="songMenuDetail.tracks"></song-table>
        <!--        评论-->
        <div class="comments">
          <div class="all">全部评论</div>
          <div>
            <template v-for="item in comments">
              <div :key="item.commentId">
                <div class="simLine"></div>
                <comments-table :comment="item"></comments-table>
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
      <el-aside width="260px">
        <div class="simiHeader">相似歌单</div>
        <div class="line"></div>
        <div v-for="(item, index) in relateSongMenu" :key="index" class="sim"  @click="goDetail(item.id)">
          <img :src="item.coverImgUrl" alt="">
          <div class="word">
            <span>{{item.name}}</span><br>
            <span>by{{item.creator.nickname}}</span>
          </div>
        </div>
      </el-aside>
    </el-container>
  </div>
</template>

<script>
import commentsTable from '../../../components/commentsTable/commentsTable'
import songTable from '../../../components/songTable/songTable'
export default {
  name: 'detail',
  components: {
    songTable,
    commentsTable
  },
  created () {
    this.$store.commit('editActiveName', 'songMenu')
    this.goDetail(this.did)
  },
  data () {
    return {
      // 描述信息
      songMenuDetail: {
        creator: {}
      },
      // 类似歌单
      relateSongMenu: {},
      // 评论数据
      comments: {},
      // 当前分页值
      currentPage: 1,
      // 当前歌单id
      currentId: 0,
      // 总的评论数量
      total: 0,
      // 是否一收藏
      collected: false
    }
  },
  methods: {
    // 根据id获取歌单的详细信息
    getDetail (id) {
      this.$http.get(`/playlist/detail?id=${id}`).then(data => {
        this.currentId = id
        this.songMenuDetail = data.playlist
      })
    },
    // 根据歌单的id获取歌单的相似歌单
    getRelateSongMenu (id) {
      return this.$http.get(`/related/playlist?id=${id}`).then(data => {
        this.relateSongMenu = data.playlists
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
    goDetail (id) {
      this.getDetail(id)
      this.getRelateSongMenu(id)
      this.getComments(id)
      if (this.accountId !== null) {
        this.getCollectedValue(id)
      }
    },
    getnextComments (value) {
      this.$http.get(`/comment/playlist?id=${this.currentId}&limit=5&offset=${(value - 1) * 5}`).then(data => {
        this.comments = data.comments
      })
    },
    play () {
      this.$store.commit('getTotal', this.songMenuDetail.trackCount)
      this.$store.commit('getSongs', this.songMenuDetail.tracks)
      this.$store.dispatch('play', { num: 0, name: 'songTable' })
    },
    // 上一页分页
    pre (value) {
      this.getnextComments(value)
    },
    // 下一页分页
    next (value) {
      this.getnextComments(value)
    },
    // 当前分页
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
                message: '成功收藏该歌单',
                type: 'success'
              })
              this.collected = true
            } else {
              this.$message({
                message: '取消收藏该歌单',
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
    // 判断该歌单是否被收藏
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
    did () {
      return this.$route.query.id
    },
    createTime () {
      const time = new Date()
      time.setTime(this.songMenuDetail.createTime)
      return time.toLocaleDateString()
    },
    accountId () {
      return this.$store.state.accountId
    }
  }
}
</script>

<style lang="stylus" scoped>
  .container
    width 70%
    margin 20px auto
    .header
      margin 20px 0
      height 220px
      div
        width 450px
      img
        width 200px
        height 200px
        border-radius 20px
        border 1px solid red
      .button-group
        position relative
        left 230px
        top -140px
      .tags
        position relative
        left 230px
        top -130px
        font-size 12px
        span
          font-size 10px
          color #434343
          background-color #d8d8d8
          border-radius 5px
          padding 1px 10px 1px 10px
          margin-left 10px
      .creator
        position relative
        left 230px
        top -150px
        img
          border none
          border-radius 2px
          width 40px
          height 40px
          margin-right 20px
        span
          position relative
          top 7px
          font-size 14px
          vertical-align top
          margin-right 10px
          +span
            color #888888
            font-size 12px
      .head
        position relative
        left 20px
        top -170px
        font-size 20px
        overflow hidden
        text-overflow ellipsis
        white-space nowrap
        span
          background-color red
          font-size 16px
          padding-left 5px
          padding-right 5px
          +div
            position relative
            top 5px
            width 0
            height 0
            display inline-block
            border 11px solid
            border-color transparent transparent transparent red
  .songHead
    margin-bottom 10px
    font-size 20px
    span
      font-size 12px
      color #888888
      +span
        float right
        :first-child
          color red
          margin-right 5px
  .introduce
    font-size 12px
    width 460px
    position relative
    left 230px
    top -110px
    // 必须结合的属性 ，将对象作为弹性伸缩盒子模型显示
    display -webkit-box
    // 必须结合的属性 ，设置或检索伸缩盒对象的子元素的排列方式
    -webkit-box-orient vertical
    // 一个块元素显示的文本的行数
    -webkit-line-clamp 2
    overflow hidden
  .simiHeader
    margin-top 80px
    margin-bottom 10px
  .word
    width 170px
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
  .el-pagination
    display flex
    justify-content center
  .el-pagination.is-background .el-pager li:not(.disabled)
  >>>.active
    background-color red !important
  i
    margin-left 10px
    span
      font-size 10px
      margin-left 2px
  .comments
    margin-top 20px
    .all
      margin-bottom 10px
</style>
