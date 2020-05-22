<template>
  <div>
    <el-container>
      <!--    侧边栏部分-->
<!--      <el-aside width="260px">-->
<!--        <template v-for="(item, index) in rankingList">-->
<!--          <div :key="item.coverImgId" @click="getMyselfRanking(idx[index])" :class="{check:active===idx[index]}" class="categories">-->
<!--            <el-image :src="item.coverImgUrl" :class="{imgChange:active===idx[index]}"></el-image>-->
<!--            <span class="first">{{item.name}}</span>-->
<!--            <div style="position: relative"><span class="small">{{item.updateFrequency}}</span></div>-->
<!--          </div>-->
<!--        </template>-->
<!--      </el-aside>-->
      <!--      主体部分-->
      <el-main>
        <!--      主体上面部分-->
        <div>
          <img :src="album.blurPicUrl" alt="">
          <span class="actives">{{album.name}}
          <span>最近更新：{{updateTime}}</span>
        </span>
<!--          <div class="btn-group">-->
<!--            <el-button size="mini" type="primary" icon="el-icon-video-play" plain @click="play()">播放</el-button>-->
<!--            <i v-if="collected===false" class="el-icon-star-off" @click="collect(1)"><span>收藏</span></i>-->
<!--            <i v-else class="el-icon-star-on" @click="collect(2)"><span>已收藏</span></i>-->
<!--          </div>-->
        </div>
        <!--      主体下面部分-->
<!--        <div class="main">-->
<!--          <div class="main-title">-->
<!--            <span>歌曲列表</span>-->
<!--            <span class="songNum">{{activeRanking.trackCount}}首歌</span>-->
<!--            <span>播放：<span>{{activeRanking.playCount}}</span><span>次</span></span>-->
<!--          </div>-->
<!--          <song-table :songs="ranking"></song-table>-->
<!--        </div>-->
<!--        <div class="comments">-->
<!--          <div class="all">全部评论</div>-->
<!--          <div>-->
<!--            <template v-for="item in comments">-->
<!--              <div :key="item.commentId">-->
<!--                <div class="simLine"></div>-->
<!--                <comments-table :comment="item" width="400px"></comments-table>-->
<!--              </div>-->
<!--            </template>-->
<!--          </div>-->
<!--          <el-pagination-->
<!--            v-if="total/5>1"-->
<!--            background-->
<!--            layout="prev, pager, next"-->
<!--            :page-size="5"-->
<!--            :total="total"-->
<!--            @prev-click="pre"-->
<!--            @next-click="next"-->
<!--            @current-change="current"-->
<!--            :current-page.sync="currentPage">-->
<!--          </el-pagination>-->
<!--        </div>-->
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'album',
  data () {
    return {
      album: {}
    }
  },
  created () {
    this.getAlbumDetail(this.id)
  },
  methods: {
    getAlbumDetail (id) {
      console.log('sasa')
      this.$http.get(`/album?id=${id}`).then(data => {
        this.album = data.album
        console.log(data)
      })
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
  img
    width 150px
    height 150px
    border 2px solid color
    margin 3px
    box-shadow 0 0 10 color
  .actives
    position relative
    top -120px
    font-size 25px
    margin 20px
</style>
