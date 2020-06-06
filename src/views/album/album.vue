<template>
  <div>
    <el-container>
      <!--      主体部分-->
      <el-main>
        <!--      主体上面部分-->
        <div>
          <img :src="album.blurPicUrl" alt="">
          <div class="aside">
            <span class="head"><span>专辑</span><div></div>{{album.name}}</span>
            <span class="singer" @click="showInformation(album.artist.id)">歌手：<span>{{album.artist.name}}</span></span>
            <span class="time">发布时间：{{changeTime(album.publishTime)}}</span>
            <div class="btn-group">
              <el-button size="mini" type="danger" icon="el-icon-video-play" plain @click="play()">播放</el-button>
              <i v-if="collected===false" class="el-icon-star-off" @click="collect(1)"><span>收藏</span></i>
              <i v-else class="el-icon-star-on" @click="collect(2)"><span>已收藏</span></i>
            </div>
          </div>
        </div>
        <!--      主体下面部分-->
        <div class="main">
          <div class="main-title">
            <span>专辑介绍:</span>
            <span class="songNum">{{album.description}}</span>
          </div>
          <song-table :songs="songs"></song-table>
        </div>
        <div class="comments" v-if="Object.keys(comments).length !== 0">
          <div class="all">全部评论</div>
          <div>
            <template v-for="item in comments">
              <div :key="item.commentId">
                <div class="simLine"></div>
                <comments-table :comment="item" width="580px"></comments-table>
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
        <div v-else class="center">暂无评论</div>
      </el-main>
      <!--    侧边栏部分-->
      <el-aside width="220px">
        <div class="otherHeader">
          <span>歌手其他专辑</span>
          <span @click="showInformation(album.artist.id)" class="more">更多</span>
        </div>
        <div class="line"></div>
        <div v-for="(item, index) in otherAlbums" :key="index" class="other"  @click="goAlbum(item.id)">
          <img :src="item.blurPicUrl" alt="">
          <div class="word">
            <span>{{item.name}}</span><br>
            <span>{{changeTime(item.publishTime)}}</span>
          </div>
        </div>
      </el-aside>
    </el-container>
  </div>
</template>

<script>
import commentsTable from '../../components/commentsTable/commentsTable'
import songTable from '../../components/songTable/songTable'
export default {
  name: 'album',
  components: {
    songTable,
    commentsTable
  },
  data () {
    return {
      album: {
        name: '',
        artist: {}
      },
      songs: [],
      // 评论数据
      comments: {},
      // 第一页分页
      currentPage: 1,
      // 总的评论数量
      total: 0,
      // 是否被收藏
      collected: false,
      otherAlbums: []
    }
  },
  created () {
    this.goAlbum(this.id)
  },
  methods: {
    getAlbumDetail (id) {
      this.id = id
      this.$http.get(`/album?id=${id}`).then(data => {
        this.album = data.album
        this.songs = data.songs
        this.getSingerOtherAlbum(data.album.artist.id)
      })
    },
    collect (value) {
      if (this.accountId !== null) {
        this.$http.get(`/album/sub?t=${value}&id=${this.id}`).then(data => {
          if (data.code === 200) {
            if (value === 1) {
              this.$message({
                message: '成功收藏专辑',
                type: 'success'
              })
              this.collected = true
            } else {
              this.$message({
                message: '取消收藏该专辑',
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
    // 全部播放时的操作
    play () {
      this.$store.commit('getTotal', this.album.size)
      this.$store.commit('getSongs', this.songs)
      this.$store.dispatch('play', { num: 0, name: 'songTable' })
    },
    getComments (id) {
      return this.$http.get(`/comment/album?id=${id}&limit=5`).then(data => {
        this.total = data.total
        this.currentPage = 1
        this.comments = data.comments
      })
    },
    getNextComments (value) {
      this.$http.get(`/comment/playlist?id=${this.id}&limit=5&offset=${(value - 1) * 5}`).then(data => {
        this.comments = data.comments
      })
    },
    // 上一页评论
    pre (value) {
      this.getNextComments(value)
    },
    // 下一页评论
    next (value) {
      this.getNextComments(value)
    },
    // 当前评论
    current (value) {
      this.getNextComments(value)
    },
    // 获取歌手其他专辑
    getSingerOtherAlbum (id) {
      this.$http.get(`/artist/album?id=${id}&limit=5`).then(data => {
        this.otherAlbums = data.hotAlbums
      })
    },
    changeTime (time) {
      const date = new Date()
      date.setTime(time)
      return date.toLocaleDateString()
    },
    goAlbum (id) {
      this.getAlbumDetail(id)
      this.getComments(id)
      if (this.accountId !== null) {
        this.getCollectedValue(id)
      }
    },
    // 判断该歌单是否被收藏
    getCollectedValue (id) {
      this.collected = false
      this.$http.get(`/album/sublist?uid=${this.accountId}`).then(data => {
        for (const key of data.data) {
          if (Number(id) === key.id) {
            this.collected = true
          }
        }
      })
    },
    // 根据id，去往歌手详细信息页面
    showInformation (id) {
      this.$router.push({ name: 'singerInformation', params: { sid: id } })
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
    accountId () {
      return this.$store.state.accountId
    }
  }
}
</script>

<style lang="stylus" scoped>
  img
    width 150px
    height 150px
    border 2px solid color
    margin 3px
    box-shadow 0 0 10 color
  .other
    margin 10px 0 0 0
    height 55px
    font-size 14px
    img
      width 50px
      height 50px
    div
      position relative
      left 60px
      top -60px
      width 160px
      cursor pointer
      span
        display inline-block
        width 160px
        overflow hidden
        text-overflow ellipsis
        white-space nowrap
        ~span
          font-size 12px
          color #888888
  .other:hover
    img
      width 55px
      height 55px
    div
      left 70px
  .otherHeader
    margin-top 80px
    margin-bottom 5px
    .more
      cursor pointer
      font-size 6px
      position relative
      color #888888
      left 10px
   .aside
     position relative
     left 170px
     top -155px
    .head
      position absolute
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
    .singer
      cursor pointer
      position absolute
      top 55px
      color #888888
      font-size 12px
      span
        color aquamarine
        font-size 10px
    .time
      font-size 12px
      color #888888
      position absolute
      top 80px
    .btn-group
      display inline
      position absolute
      top 110px
      .el-button
        margin-right 10px
  .el-pagination
    display flex
    justify-content center
  .comments
    margin-top 30px
    .all
      margin-bottom 10px
  .main
    margin-top 10px
    .main-title
      margin-bottom 10px
      .songNum
        font-size 12px
        color #888888
        display -webkit-box
        -webkit-box-orient vertical
        -webkit-line-clamp 2
        overflow hidden
        text-indent 2em
</style>
