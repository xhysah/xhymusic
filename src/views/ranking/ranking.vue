<template>
  <div>
    <el-container v-if="ranking">
      <!--    侧边栏部分-->
      <el-aside width="300px">
        <template v-for="(item, index) in rankingList">
          <div :key="item.coverImgId" @click="getMyselfRanking(idx[index])" :class="{check:active===idx[index]}">
            <el-image :src="item.coverImgUrl"></el-image>
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
          <span class="active">{{activeRanking.name}}
          <span>最近更新：{{updateTime}}</span>
        </span>
          <div>
            <el-button size="mini" type="primary" icon="el-icon-video-play" plain>播放</el-button>
            <el-button size="mini" type="danger" :round="true" plain icon="el-icon-chat-line-square">
              ({{activeRanking.commentCount}})
            </el-button>
            <el-button size="mini" type="danger" :round="true" plain icon="el-icon-share">
              ({{activeRanking.shareCount}})
            </el-button>
            <el-button size="mini" type="danger" :round="true" plain icon="el-icon-folder-add">
              ({{activeRanking.subscribedCount}})
            </el-button>
          </div>
        </div>
        <!--      主体下面部分-->
        <div class="main">
          <div class="main-title">
            <span>歌曲列表</span>
            <span>播放：<span>{{activeRanking.playCount}}</span><span>次</span></span>
          </div>
          <song-table :songs="ranking"></song-table>
<!--          <song-table :songs="ranking" @playurl="editUrl" @pause="pauseMusics" @play="playMusics"-->
<!--                      ref="songTable"></song-table>-->
          <!--        <template v-for="(item, index) in ranking">-->
          <!--        <div :key="index" class="img-item">-->
          <!--&lt;!&ndash;          <img :src="item.al.picUrl" alt="">&ndash;&gt;-->
          <!--          <span>{{item.name}}</span>-->
          <!--          <span>{{item.alia[0]}}</span>-->
          <!--          <span>{{item.ar[0].name}}</span>-->
          <!--        </div>-->
          <!--      </template>-->
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import songTable from '../../components/songTable/songTable'
export default {
  name: 'ranking',
  components: {
    songTable
  },
  created () {
    this.getRanking()
    this.getMyselfRanking(3)
  },
  data () {
    return {
      // 排行榜数据
      rankingList: {},
      // 正在查看的排行榜
      activeRanking: {},
      // 正在查看的排行榜数据
      ranking: [],
      // playSong: {
      //   url: '',
      //   img: '',
      //   name: '',
      //   singer: ''
      // },
      // playIf: false,
      idx: [3, 0, 2, 1, 23, 24, 25, 26, 27, 22, 28, 36, 29, 30, 5, 6, 21, 7, 8, 10, 9, 20, 31, 32, 19, 35],
      active: 3
      // duration: '00:00',
      // metaDuration: 0,
      // currentTime: '00:00',
      // metaCurrentTime: 0,
      // percentage: 0
    }
  },
  methods: {
    // 获取排行榜数据
    getRanking () {
      this.$http.get('/toplist/detail').then(({ data }) => {
        if (data.code !== 200) {
          return this.$message.error('获取排行榜数据失败')
        }
        this.rankingList = data.list
        console.log(data.list)
      })
    },
    // 根据id获取排行榜详细数据
    getMyselfRanking (idx) {
      this.active = idx
      this.$http.get('/top/list', { params: { idx: idx } }).then(({ data }) => {
        if (data.code !== 200) {
          return this.$message.error('获取排行榜数据失败')
        }
        this.activeRanking = data.playlist
        this.ranking = data.playlist.tracks
        console.log(data)
      })
    }
    // 得到该单曲的音乐播放地址
    // editUrl (value, img, name, singer) {
    //   this.playSong.url = value
    //   this.playSong.img = img
    //   this.playSong.name = name
    //   this.playSong.singer = singer
    //   this.playIf = true
    //   console.log(img)
    // },
    // ended () {
    //   this.playIf = false
    //   console.log(this.$refs.songTable.active--)
    // },
    // playMusic () {
    //   if (this.playUrl !== '') {
    //     const audio = this.$refs.audio
    //     audio.play()
    //     this.playIf = true
    //     console.log(this.$refs.songTable.active--)
    //   }
    // },
    // pauseMusic () {
    //   const audio1 = this.$refs.audio
    //   this.playIf = false
    //   audio1.pause()
    //   console.log(this.$refs.songTable.active++)
    // },
    // pauseMusics () {
    //   const audio1 = this.$refs.audio
    //   this.playIf = false
    //   audio1.pause()
    // },
    // playMusics () {
    //   if (this.playUrl !== '') {
    //     const audio = this.$refs.audio
    //     audio.play()
    //     this.playIf = true
    //   }
    // },
    // getDuration () {
    //   const audio2 = this.$refs.audio
    //   this.metaDuration = audio2.duration
    //   this.duration = `${this.double(Math.floor(audio2.duration / 60))}:${this.double(Math.floor(audio2.duration % 60))}`
    // },
    // getCurrentTime () {
    //   const audio3 = this.$refs.audio
    //   this.metaCurrentTime = audio3.currentTime
    //   this.currentTime = `${this.double(Math.floor(audio3.currentTime / 60))}:${this.double(Math.floor(audio3.currentTime % 60))}`
    // },
    // // 返回两位数
    // double (num) {
    //   if (num.toString().length !== 2) {
    //     return '0' + num
    //   }
    //   return num
    // }
  },
  computed: {
    // 对更新时间做计算
    updateTime () {
      const time = new Date()
      time.setTime(this.activeRanking.updateTime)
      console.log(time.toLocaleDateString())
      return time.toLocaleDateString()
    }
  },
  watch: {
    // currentTime () {
    //   this.percentage = Math.floor(this.metaCurrentTime / this.metaDuration * 100)
    //   console.log(Math.floor(this.metaCurrentTime / this.metaDuration * 100))
    // }
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
    box-shadow 0px 0px 10px color
  .main
    display flex
    justify-content center
    flex-wrap wrap
    flex-direction column
    margin -20px 20px
  .active
    position relative
    top -120px
    font-size 25px
    margin 20px
    +div
      position relative
      left 150px
      top -90px
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
</style>
