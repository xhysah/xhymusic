<template xmlns:song="http://www.w3.org/1999/html">
  <div>
    <template v-for="(item, index) in rankings">
      <song :key="item.id" :songs="item" :menu="rankingList[index]"></song>
    </template>
    <div class="grid-4">
      <template v-for="(item, index) in rankingList.slice(4)">
        <div :key="index" @click="goDetail(item.id)">
          <song-outline>
            <template v-slot:img>
              <img :src="item.coverImgUrl" alt="">
            </template>
            <template v-slot:creator>
              <span><i class="el-icon-caret-right"></i>{{count(item.playCount)}}</span>
            </template>
            <template v-slot:sentence>
              <div>{{item.name}}</div>
            </template>
          </song-outline>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import song from '../../components/songTable/song'
import songOutline from '../../components/songOutline /songOutline'
export default {
  name: 'ranking',
  components: {
    songOutline,
    song
  },
  created () {
    // 得到排行数据和第一个排行的详细数据
    this.getRanking()
    this.getMyselfRanking(0, 3)
    this.getMyselfRanking(1, 0)
    this.getMyselfRanking(2, 2)
    this.getMyselfRanking(3, 1)
    // 修改当前活跃的主菜单名
    this.$store.commit('editActiveName', 'ranking')
  },
  data () {
    return {
      // 排行榜数据
      rankingList: {},
      // 正在查看的排行榜音乐数据
      rankings: [],
      // 根据这个值去请求排行榜数据
      idx: [3, 0, 2, 1, 23, 24, 25, 26, 27, 22, 28, 36, 29, 30, 5, 6, 21, 7, 8, 10, 9, 20, 31, 32, 19, 35],
      // 当前排行榜的idx
      active: 3,
      // 评论数据
      // 当前排行榜id
      currentId: 0
    }
  },
  methods: {
    // 获取排行榜数据
    getRanking () {
      this.$http.get('/toplist/detail').then(data => {
        this.rankingList = data.list
      })
    },
    // 根据id获取排行榜详细数据
    getMyselfRanking (i, idx) {
      this.active = idx
      this.$http.get(`/top/list?idx=${idx}`).then(data => {
        console.log(data.playlist.tracks.slice(0, 10))
        // this.rankings = data.playlist.tracks.slice(0, 5)
        this.$set(this.rankings, i, data.playlist.tracks.slice(0, 5))
        this.currentId = data.playlist.id
      })
    },
    count (number) {
      if (number / 10000 > 1) {
        return `${(Math.floor(number / 10000))}万`
      } else {
        return number
      }
    },
    // 根据歌单的id，去往歌单详细信息页面
    goDetail (id) {
      this.$router.push({
        path: '/songMenuDetail',
        query: {
          id
        }
      })
    }
  },
  computed: {
    // 得到用户id
    accountId () {
      return this.$store.state.accountId
    }
  },
  watch: {
  }
}
</script>

<style lang="stylus" scoped>
</style>
