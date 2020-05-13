<template>
  <div class="center">
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
            <el-button size="mini" type="primary" icon="el-icon-video-play" plain>播放全部</el-button>
            <el-button size="mini" type="danger" :round="true" plain icon="el-icon-chat-line-square">
            </el-button>
            <el-button size="mini" type="danger" :round="true" plain icon="el-icon-share">
            </el-button>
            <el-button size="mini" type="danger" :round="true" plain icon="el-icon-folder-add">
            </el-button>
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
      </el-main>
      <el-aside width="280px">
        <div class="simiHeader">相似歌单</div>
        <div class="line"></div>
        <div v-for="(item, index) in relateSongMenu" :key="index" class="sim"  @click="goDetail(item.id)">
          <img :src="item.coverImgUrl" alt="">
          <div>
            <span>{{item.name}}</span><br>
            <span>by{{item.creator.nickname}}</span>
          </div>
        </div>
      </el-aside>
    </el-container>
  </div>
</template>

<script>
import songTable from '../../../components/songTable/songTable'
export default {
  name: 'detail',
  components: {
    songTable
  },
  created () {
    // this.getDetail(this.sid)
    this.$store.commit('editActiveName', 'songMenu')
    // this.getRelateSongMenu(this.sid)
    this.goDetail(this.did)
  },
  data () {
    return {
      // 描述信息
      songMenuDetail: {
        creator: {}
      },
      relateSongMenu: {}
    }
  },
  methods: {
    // 根据id获取歌单的详细信息
    getDetail (id) {
      return this.$http.get(`/playlist/detail?id=${id}`)
    },
    // 根据歌单的id获取歌单的相似歌单
    getRelateSongMenu (id) {
      return this.$http.get(`/related/playlist?id=${id}`)
    },
    goDetail (id) {
      this.$http.all([this.getDetail(id), this.getRelateSongMenu(id)])
        .then(this.$http.spread(({ data: detail }, { data: relate }) => {
          if (detail.code !== 200 || relate.code !== 200) {
            return this.$message.error('获取数据失败')
          }
          this.songMenuDetail = detail.playlist
          console.log(this.songMenuDetail)
          this.relateSongMenu = relate.playlists
        }))
    }
  },
  computed: {
    did () {
      return this.$route.query.id
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
  .center
    width 70%
    margin 20px auto
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
          color #888888
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
  .sim
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
</style>
