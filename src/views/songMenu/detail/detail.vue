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
            <el-button size="mini" type="primary" icon="el-icon-video-play" plain>播放</el-button>
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
          <div>介绍: {{songMenuDetail.description}}</div>
        </div>
        <div>歌曲列表
          <span>{{songMenuDetail.trackCount}}首歌</span>
          <span>播放：<span></span>{{songMenuDetail.playCount}}<span>次</span></span>
        </div>
        <song-table :songs="songMenuDetail.tracks"></song-table>
      </el-main>
      <el-aside width="240px"></el-aside>
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
    this.getDetail()
    this.$store.commit('editActiveName', 'songMenu')
  },
  data () {
    return {
      // 描述信息
      songMenuDetail: {
        creator: {}
      }
    }
  },
  methods: {
    getDetail () {
      this.$http.get(`/playlist/detail?id=${this.did}`).then(({ data }) => {
        if (data.code !== 200) {
          return this.$message.error('获取歌单详细信息失败')
        }
        this.songMenuDetail = data.playlist
        console.log(data)
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
      console.log(time.toLocaleDateString())
      return time.toLocaleDateString()
    }
    // path () {
    //   return this.$route.query.path
    // }
  }
}
</script>

<style lang="stylus" scoped>
  .center
    width 70%
    margin 20px auto
    .header
      margin 20px 0
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
</style>
