<template>
  <div>
    <el-container>
      <el-aside>
        <div v-for="(item, index) in playlists" :key="index" class="aside" @click="goDetail(item.id)">
          <img :src="item.coverImgUrl" alt="">
          <div>
            <span>{{item.name}}</span><br>
            <span>{{item.trackCount}}首 by{{item.creator.nickname}}</span>
          </div>
        </div>
      </el-aside>
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
            <i v-if="collected===false" class="el-icon-star-off"><span>收藏</span></i>
            <i v-else class="el-icon-star-on"><span>已收藏</span></i>
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
        <div>全部评论</div>
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
      </el-main>

    </el-container>
  </div>
</template>

<script>
import commentsTable from '../../components/commentsTable/commentsTable'
import songTable from '../../components/songTable/songTable'
export default {
  name: 'myMusic',
  components: {
    songTable,
    commentsTable
  },
  created () {
    this.getInf()
  },
  data () {
    return {
      playlists: {},
      songMenuDetail: {
        creator: {}
      },
      comments: {},
      currentPage: 1,
      currentId: 0,
      // 总的评论数量
      total: 0,
      // 是否一收藏
      collected: false
    }
  },
  methods: {
    getInf () {
      this.$http.get(`/user/playlist?uid=${this.accountId}`).then(data => {
        this.playlists = data.playlist
        console.log(data)
      })
    },
    // 根据id获取歌单的详细信息
    getDetail (id) {
      this.$http.get(`/playlist/detail?id=${id}`).then(data => {
        this.currentId = id
        this.songMenuDetail = data.playlist
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
      this.getComments(id)
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
    pre (a) {
      this.getnextComments(a)
    },
    next (a) {
      this.getnextComments(a)
    },
    current (a) {
      this.getnextComments(a)
    }
  },
  computed: {
    accountId () {
      return this.$store.state.accountId
    },
    createTime () {
      const time = new Date()
      time.setTime(this.songMenuDetail.createTime)
      console.log(time.toLocaleDateString())
      return time.toLocaleDateString()
    }
  }
}
</script>

<style lang="stylus" scoped>
  .el-container
    width 70%
    margin auto
    .header
      margin 20px 0
      height 220px
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
  .aside
    margin 10px 10px 0 10px
    height 80px
    img
      width 60px
      height 60px
    div
      position relative
      left 70px
      top -60px
      span
        display inline-block
        width 190px
        overflow hidden
        text-overflow ellipsis
        white-space nowrap
        ~span
          font-size 12px
          color #888888
  .aside:hover
    img
      width 70px
      height 70px
    div
      left 80px
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
</style>
