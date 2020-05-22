<template>
  <div class="flex">
    <table>
      <tr v-for="(item, index) in songs" :key="index">
<!--        <td>{{index+1}}</td>-->
        <td @click="goSongMenu(item.id)" class="go"><i class="el-icon-video-play"></i></td>
<!--        <i class="el-icon-video-play"  :class="{'el-icon-video-pause':active == item.id}"  @click="play(item.id, item.track,item.name,item.album.name)"></i>-->
        <td><img :src="item.coverImgUrl" alt=""></td>
        <td><div>{{item.name}}</div></td>
        <td class="creator">{{item.creator.nickname}}</td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  name: 'songmenu',
  props: {
    songs: {
      type: Array
    }
  },
  data () {
    return {
    }
  },
  methods: {
    goSongMenu (id) {
      this.$router.push({
        path: '/songMenuDetail',
        query: {
          id
        }
      })
    }
  },
  computed: {
  }
}
</script>

<style lang="stylus" scoped>
  table tr:nth-child(odd)
    background-color #1c1c1c
  table tr:nth-child(even)
    color #909399
  table
    font-size 14px
    width 100%
    border-collapse collapse
  td,i
    cellspacing 10
    padding 5px
    vertical-align middle
  i
    font-size 1.5em
  tr
    div
      width 300px
      overflow hidden
      text-overflow ellipsis
      white-space nowrap
  img
    vertical-align middle
    width 40px
    height 40px
  .go
    cursor pointer
  .creator
    font-size 12px
</style>
