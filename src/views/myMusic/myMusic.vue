<template>
  <div>
    <el-container v-if="accountId!==null">
      <el-main>
        <div v-if="singerIf===true">
          <div>我的歌手</div>
          <div class="line"></div>
          <div v-for="(item, index) in singers" :key="index" class="singer"  @click="gosinger(item.id)">
            <img :src="item.img1v1Url" alt="">
            <div class="word">
              <span>{{item.name}}</span><br>
              <span>{{item.mvSize}}个mv</span>
              <span>{{item.albumSize}}个mv</span>
            </div>
          </div>
        </div>
        <div v-else-if="videoIf===true">
          <div>我的视频</div>
          <div class="line"></div>
          <div class="flex">
            <div v-for="(item, index) in videos" :key="index" class="video" @click="goVideo(item.vid, item.type)">
              <img :src="item.coverUrl" alt="">
            </div>
          </div>
        </div>
        <div v-else>
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
          <div v-if="Object.keys(comments).length !== 0">
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
          </div>
        </div>
      </el-main>
    </el-container>
    <el-container v-else class="noLogin">
      <div class="img">
        <img src="../../assets/cry.png" alt="">
        <div class="word">您还没有登录哟!</div>
      </div>
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
    if (this.name === 'singer') {
      this.getSinger()
    } else if (this.name === 'video') {
      this.getVideo()
    } else {
      if (this.accountId !== null) {
        this.goDetail(this.name)
      }
    }
    // 判断是否有用户id
  },
  data () {
    return {
      // 收藏歌单的简略信息
      playlists: {},
      // 歌单详细信息
      songMenuDetail: {
        creator: {}
      },
      comments: {},
      // 当前分页位置
      currentPage: 1,
      // 当前的歌单id
      currentId: 0,
      // 总的评论数量
      total: 0,
      // 是否一收藏
      collected: false,
      singerIf: false,
      singers: [],
      videoIf: false,
      videos: []
    }
  },
  methods: {
    getSinger () {
      this.videoIf = false
      this.singerIf = true
      this.$http.get(`/artist/sublist?uid=${this.accountId}`).then(data => {
        this.singers = data.data
      })
    },
    // 根据id获取歌单的详细信息
    getDetail (id) {
      this.singerIf = false
      this.videoIf = false
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
    // 获取歌单信息和评论信息同时判断是否该歌单被收藏
    goDetail (id) {
      this.getDetail(id)
      this.getComments(id)
      this.getCollectedValue(id)
    },
    // 分页的处理函数
    getnextComments (value) {
      this.$http.get(`/comment/playlist?id=${this.currentId}&limit=5&offset=${(value - 1) * 5}`).then(data => {
        this.comments = data.comments
      })
    },
    // 播放音乐
    play () {
      this.$store.commit('getTotal', this.songMenuDetail.trackCount)
      this.$store.commit('getSongs', this.songMenuDetail.tracks)
      this.$store.dispatch('play', { num: 0, name: 'songTable' })
    },
    // 上面五条评论
    pre (value) {
      this.getnextComments(value)
    },
    // 下面五条评论
    next (value) {
      this.getnextComments(value)
    },
    // 当前值的评论
    current (value) {
      this.getnextComments(value)
    },
    // 收藏/取消收藏歌单
    collect (value) {
      this.$http.get(`/playlist/subscribe?t=${value}&id=${this.currentId}`).then(data => {
        if (data.code === 200) {
          if (value === 1) {
            this.collected = true
          } else {
            this.$message({
              message: '您已取消收藏该歌单',
              type: 'warning'
            })
            // this.collected = false
            window.location.reload()
          }
        }
      })
    },
    // 判断是否收藏该歌单
    getCollectedValue (id) {
      this.collected = false
      this.$http.get(`/user/playlist?uid=${this.accountId}`).then(data => {
        for (const key of data.playlist) {
          if (Number(id) === key.id) {
            this.collected = true
          }
        }
      })
    },
    gosinger (id) {
      this.$router.push({ name: 'singerInformation', params: { sid: id } })
    },
    getVideo () {
      this.singerIf = false
      this.videoIf = true
      this.$http.get(`mv/sublist??uid=${this.accountId}`).then(data => {
        this.videos = data.data
        console.log(data.data)
      })
    },
    goVideo (id, type) {
      if (type === 1) {
        this.$router.push({
          path: '/videos',
          query: {
            id,
            type
          }
        })
      } else {
        this.$router.push({
          path: '/mv',
          query: {
            id,
            type
          }
        })
      }
    }
  },
  computed: {
    // 从vuex中得到用户id
    accountId () {
      return this.$store.state.accountId
    },
    // 计算是什么时间创建的该歌单
    createTime () {
      const time = new Date()
      time.setTime(this.songMenuDetail.createTime)
      return time.toLocaleDateString()
    },
    name () {
      return this.$route.query.name
    }
  }
}
</script>

<style lang="stylus" scoped>
  .el-container
    .header
      margin 20px 0
      height 220px
      position relative
      div
        width 470px
      img
        width 200px
        height 200px
        border-radius 20px
        border 1px solid red
      .button-group
        position absolute
        left 230px
        top 90px
      .tags
        position absolute
        left 230px
        top 130px
        font-size 12px
        span
          font-size 10px
          color #434343
          background-color #d8d8d8
          border-radius 5px
          padding 1px 10px 1px 10px
          margin-left 10px
      .creator
        position absolute
        left 230px
        top 40px
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
        position absolute
        left 230px
        font-size 20px
        width 470px
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
      .introduce
        font-size 12px
        width 470px
        position absolute
        left 230px
        top 170px
        // 必须结合的属性 ，将对象作为弹性伸缩盒子模型显示
        display -webkit-box
        // 必须结合的属性 ，设置或检索伸缩盒对象的子元素的排列方式
        -webkit-box-orient vertical
        // 一个块元素显示的文本的行数
        -webkit-line-clamp 2
        overflow hidden
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
  .el-pagination
    display flex
    justify-content center
  i
    margin-left 10px
    span
      font-size 10px
      margin-left 2px
  .singer
    cursor pointer
    margin 10px 10px 0 10px
    height 80px
    img
      width 70px
      height 70px
    div
      position relative
      left 90px
      top -70px
      span
        display inline-block
        margin-left 10px
        ~span
          font-size 12px
          color #888888
  .noLogin
    width 70%
    margin-top 50px
    .img
      position relative
      img
        position absolute
        width 400px
        height auto
        top 100px
        left 180px
      div
        top 100px
        left 700px
        position absolute
        font-size 30px
  .video
    img
      width 200px
      height auto
</style>
