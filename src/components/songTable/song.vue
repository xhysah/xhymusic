<template>
  <div>
    <el-container>
      <el-aside width="220px">
        <div :key="menu.id" @click="goDetail(menu.id)">
          <song-outline>
            <template v-slot:img>
              <img :src="menu.coverImgUrl" alt="">
            </template>
            <template v-slot:creator>
              <span><i class="el-icon-caret-right"></i>{{count(menu.playCount)}}</span>
            </template>
          </song-outline>
        </div>
      </el-aside>
      <el-main>
        <div v-for="(item, index) in songs" :key="index" class="row" :class="{odd: index%2 ===0}">
          <span class="num" :class="{one:index<3}">{{index+1}}</span>
          <span>{{item.name}}</span>
          <span class="singer">
          <template v-for="(items, index) in item.ar">
            <span :key="index" v-if="index===0" @click="goSinger(items.id)">{{items.name}}</span>
            <span :key="index" v-else @click="goSinger(items.id)">/{{items.name}}</span>
          </template>
            </span>
        </div>
        <div class="all" @click="goDetail(menu.id)">查看全部<i class="el-icon-arrow-right"></i></div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import songOutline from '../songOutline /songOutline'
export default {
  name: 'song',
  components: {
    songOutline
  },
  props: {
    songs: {
      type: Array
    },
    menu: {
      type: Object
    }
  },
  data () {
    return {}
  },
  methods: {
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
    },
    goSinger (id) {
      this.$router.push({ name: 'singerInformation', params: { sid: id } })
    }
  },
  computed: {}
}
</script>

<style lang="stylus" scoped>
  .el-container
    margin 20px 0
    .el-main
      padding 5px 10px
      .all
        cursor pointer
        margin-top 10px
        margin-left 5px
        font-size 12px
        color: #888888
      .odd
        background-color #131313
      .row:hover
        background-color #131313
      .row
        padding 5px
        .num
          margin-right 10px
          color #888888
        .one
          color red
        .singer
          float right
          color #888888
          font-size 14px
          span
            cursor pointer
          span:hover
            color white
</style>
