<template>
  <div>
    <!--      主体部分-->
    <el-main>
      <!--      主体上面部分-->
      <div class="aside">
        <img :src="activeRanking.coverImgUrl" alt="">
        <span class="actives">{{activeRanking.name}}
          <span>最近更新：{{updateTime}}</span>
        </span>
        <div>
          <el-button size="mini" type="danger" icon="el-icon-video-play" plain @click="play()">播放</el-button>
          <i v-if="collected===false" class="el-icon-star-off" @click="collect(1)"><span>收藏</span></i>
          <i v-else class="el-icon-star-on" @click="collect(2)"><span>已收藏</span></i>
        </div>
      </div>
      <!--      主体下面部分-->
      <div class="main">
        <div class="main-title">
          <span>歌曲列表</span>
          <span class="songNum">{{activeRanking.trackCount}}首歌</span>
          <span>播放：<span>{{activeRanking.playCount}}</span><span>次</span></span>
        </div>
        <song-table :songs="ranking"></song-table>
      </div>
      <div class="comments">
        <div class="all">全部评论</div>
        <div>
          <template v-for="item in comments">
            <div :key="item.commentId">
              <div class="simLine"></div>
              <comments-table :comment="item" width="530px"></comments-table>
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
  </div>
</template>

<script>
import commentsTable from '../../../components/commentsTable/commentsTable'
import songTable from '../../../components/songTable/songTable'
export default {
  name: 'rankingDetail',
  components: {
    songTable,
    commentsTable
  },
  data () {
    return {
      // 评论数据
      comments: {},
      // 第一页分页
      currentPage: 1,
      // 总的评论数量
      total: 0,
      // 是否被收藏
      collected: false
    }
  },
  methods: {
    // 根据歌单id获取歌单评论
    getComments (id) {
      return this.$http.get(`/comment/playlist?id=${id}&limit=5`).then(data => {
        this.total = data.total
        this.currentPage = 1
        this.comments = data.comments
      })
    },
    getnextComments (value) {
      this.$http.get(`/comment/playlist?id=${this.currentId}&limit=5&offset=${(value - 1) * 5}`).then(data => {
        this.comments = data.comments
      })
    },
    // 全部播放时的操作
    play () {
      this.$store.commit('getTotal', this.activeRanking.trackCount)
      this.$store.commit('getSongs', this.ranking)
      this.$store.dispatch('play', { num: 0, name: 'songTable' })
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
    // 收藏该歌单
    collect (value) {
      if (this.accountId !== null) {
        this.$http.get(`/playlist/subscribe?t=${value}&id=${this.currentId}`).then(data => {
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
    // 对更新时间做计算
    updateTime () {
      const time = new Date()
      time.setTime(this.activeRanking.updateTime)
      // console.log(time.toLocaleDateString())
      return time.toLocaleDateString()
    },
    // 得到用户id
    accountId () {
      return this.$store.state.accountId
    }
  }
}
</script>

<style lang="stylus" scoped>

</style>
