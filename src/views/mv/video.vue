<template>
  <div>
    <div>{{videoInf.name}}</div>
    <div>{{videoInf.artistName}}</div>
    <div>{{videoInf.publishTime}}</div>
    <div>播放次数发布时间{{videoInf.playCount}}</div>
    <div>mv时长{{videoInf.duration}}</div>
    <div>评论数量{{videoInf.commentCount}}</div>
    <div class="btn-group">
      <el-button size="mini" type="primary" icon="el-icon-video-play" plain @click="play()">播放</el-button>
      <i v-if="collected===false" class="el-icon-star-off" @click="collect(1)"><span>收藏</span></i>
      <i v-else class="el-icon-star-on" @click="collect(2)"><span>已收藏</span></i>
    </div>
    <video :src="videoUrl" autoplay></video>
    <div class="comments">
      <div class="all">全部评论</div>
      <div>
        <template v-for="item in videoComments">
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
  </div>
</template>

<script>
import commentsTable from '../../components/commentsTable/commentsTable'
export default {
  name: 'video',
  components: {
    commentsTable
  },
  created () {
    this.getMvInf(this.id)
    this.getMvAdd(this.id)
    this.getMvComments(this.id)
  },
  data () {
    return {
      videoInf: {},
      videoUrl: '',
      videoComments: [],
      total: 0,
      currentPage: 1,
      collected: false
    }
  },
  methods: {
    // 获取视频信息
    getMvInf (id) {
      this.$http.get(`/video/detail?id=${id}`).then(data => {
        this.videoInf = data.data
        console.log(data)
      })
    },
    // 获取视频地址
    getMvAdd (id) {
      this.$http.get(`/video/url?id=${id}`).then(data => {
        this.videoUrl = data.data.url
        console.log(data)
      })
    },
    // 获取视频评论信息
    getMvComments (id) {
      this.$http.get(`/comment/video?id=${id}`).then(data => {
        this.videoComments = data.hotComments
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
    }
  },
  computed: {
    id () {
      return this.$route.query.id
    }
  }
}
</script>

<style lang="stylus" scoped>

</style>
