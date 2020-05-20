<template>
  <div class="flex">
    <table>
      <tr v-for="(item, index) in songs" :key="item.id">
        <td>{{index+1}}</td>
<!--        <i class="el-icon-video-play"  :class="{'el-icon-video-pause':active == item.id}"  @click="play(item.id, item.al.picUrl,item.name,item.al.name)"></i>-->
        <td><i :ref="item.id" class="el-icon-video-play"  :class="{'el-icon-video-pause':active == item.id}"  @click="play(item.id, index)"></i></td>
        <td class="td"><div>{{item.name}}</div></td>
        <td class="td"><div>{{item.al.name}}</div></td>
        <td class="collect"> <i v-if="collected===false" class="el-icon-star-off" @click="collect('add', item.id)"><span>收藏</span></i>
          <i v-else class="el-icon-star-on" @click="collect('del', item.id)"><span>已收藏</span></i></td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  name: 'songTable',
  props: {
    songs: {
      type: Array
    }
  },
  data () {
    return {
      collected: false
    }
  },
  created () {
    this.getCollectedValue()
  },
  methods: {
    // 播放歌曲
    play (id, index) {
      // console.log(info)
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
        // this.$http.all([this.$http.get(`/song/url?id=${id}`), this.$http.get(`/lyric?id=${id}`)])
        //   .then(this.$http.spread(({ data: url }, { data: lyric }) => {
        //     if (url.code !== 200 || lyric.code !== 200) {
        //       return this.$message.error('获取歌信息失败')
        //     }
        //     console.log(lyric)
        //     this.$store.commit('editActive', id)
        //     this.$store.commit('playUrl', { url: url.data[0].url, img, name, singer, lyric: lyric, num: index })
        //   }))
        if (window.sessionStorage.getItem('songs') !== this.songs) {
          this.$store.commit('getSongs', this.songs)
        }
        this.$store.commit('getTotal', this.songs.length)
        this.$store.dispatch('play', { num: index, name: 'songTable' })
        // this.$http.get(`/song/url?id=${id}`).then(({ data }) => {
        //   if (data.code !== 200) {
        //     return this.$message.error('获取歌信息失败')
        //   }
        //   console.log(data)
        //   // this.active = id
        //   this.$store.commit('editActive', id)
        //   this.$store.commit('playUrl', { url: data.data[0].url, img, name, singer })
        //   // this.$store.commit('getInfo', info)
        // })
      }
    },
    collect (value, id) {
      if (this.accountId) {
        this.$http.get(`/playlist/tracks?op=${value}&pid=${this.songMenuId}&tracks=${id}`).then(data => {
          if (data.code === 200) {
            if (value === 1) {
              this.collected = true
            } else {
              this.collected = false
            }
          }
        })
      } else {
        console.log('hdjahd')
      }
    },
    getCollectedValue () {
      if (this.accountId) {
        this.collected = false
        this.$http.get(`/playlist/detail?id=${this.songMenuId}`).then(data => {
          // for (const key of data.playlist) {
          //   if (Number(id) === key.id) {
          //     this.collected = true
          //   }
          // }
          console.log(data)
        })
      }
    }
  },
  computed: {
    active () {
      return this.$store.state.active
    }
  },
  watch: {
    active (newValue, oldValue) {
      // if (newValue === 0) {
      //   // console.log(newValue)
      //   // console.log(oldValue)
      //   // console.log(this.$refs[oldValue].this.play())
      //   }
    },
    songMenuId () {
      return this.$store.state.songMenuId
    },
    accountId () {
      return this.$store.state.accountId
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
    width 35%
    div
      width 200px
      overflow hidden
      text-overflow ellipsis
      white-space nowrap
  .collect
    i
      visibility hidden
      font-size 16px
      width 50px
      margin-left 10px
      span
        font-size 12px
        margin-left 2px
  table tr:hover
    .collect
      i
        visibility visible
</style>
