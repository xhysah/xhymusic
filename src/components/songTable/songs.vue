<template>
  <div class="flex">
    <table>
      <tr v-for="(item, index) in songs" :key="index">
        <td>{{index+1}}</td>
        <!--        <i class="el-icon-video-play"  :class="{'el-icon-video-pause':active == item.id}"  @click="play(item.id, item.al.picUrl,item.name,item.al.name)"></i>-->
        <td><i class="el-icon-video-play"  :class="{'el-icon-video-pause':active == item.id}"  @click="play(item.id, index)"></i></td>
        <td  class="td"><div>{{item.name}}</div></td>
        <td  class="td">
          <div>
            <template v-for="(items, index) in item.artists">
              <span :key="items.id" v-if="index===0">{{items.name}}</span>
              <span :key="items.id" v-else>/{{items.name}}</span>
            </template>
          </div>
        </td>
        <td  class="td"><div>{{item.album.name}}</div></td>
<!--        <td class="collect">-->
<!--          <i class="el-icon-star-on"><span>已收藏</span></i>-->
<!--          <i class="el-icon-star-off no" ><span>收藏</span></i>-->
<!--        </td>-->
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  name: 'song',
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
    // 播放歌曲
    play (id, index) {
      if (this.active === id) {
        this.$store.commit('editActive', id + 1)
        // this.active = id + 1
        this.$store.commit('pauseMusic')
        // this.$emit('pause')
      } else if (this.active === id + 1) {
        // this.$emit('play')
        this.$store.commit('playMusic')
        // this.active = id
        this.$store.commit('editActive', id)
      } else {
        if (window.sessionStorage.getItem('songs') !== this.songs) {
          this.$store.commit('getSongs', this.songs)
        }
        this.$store.commit('getTotal', this.songs.length)
        this.$store.commit('editActive', id)
        this.$store.dispatch('play', { num: index, name: 'songs' })
      }
    }
  },
  computed: {
    active () {
      return this.$store.state.active
    }
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
  i
    font-size 1.5em
  .td
    width 26%
    div
      width 290px
      overflow hidden
      text-overflow ellipsis
      white-space nowrap
</style>
