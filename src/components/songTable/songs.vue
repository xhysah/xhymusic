<template>
  <div class="flex">
    <table>
      <thead>
      <tr>
        <td colspan="3">歌曲列表</td>
        <td>时长</td>
        <td>歌手</td>
        <td colspan="3">专辑</td>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(item, index) in songs" :key="index">
        <td>{{index+1}}</td>
        <!--        <i class="el-icon-video-play"  :class="{'el-icon-video-pause':active == item.id}"  @click="play(item.id, item.al.picUrl,item.name,item.al.name)"></i>-->
        <td><i class="el-icon-video-play"  :class="{'el-icon-video-pause':active == item.id}"  @click="play(item.id, index)"></i></td>
        <td  class="td"><div class="songName">{{item.name}}</div></td>
        <!--        时长-->
        <td class="td">
          <span>{{duration(item.duration)}}</span>
        </td>
        <!--        歌手-->
        <td  class="td">
          <div class="singer">
            <template v-for="(items, index) in item.artists">
              <span :key="items.id" v-if="index===0" @click="goSinger(items.id)">{{items.name}}</span>
              <span :key="items.id" v-else @click="goSinger(items.id)">/{{items.name}}</span>
            </template>
          </div>
        </td>
        <!--        专辑-->
        <td  class="td"><div class="album" @click="goAlbum(item.album.id)">{{item.album.name}}</div></td>
        <td class="collect">
          <i v-if="collected[item.id]!==undefined" class="el-icon-star-on" @click="collect('del', item.id)"><span>已收藏</span></i>
          <i v-else class="el-icon-star-off no" @click="collect('add', item.id)"><span>收藏</span></i>
        </td>
      </tr>
      </tbody>
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
      collected: {}
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
    },
    collect (value, id) {
      if (this.accountId !== null) {
        this.$http.get(`/playlist/tracks?op=${value}&pid=${this.songMenuId}&tracks=${id}`).then(data => {
          if (data.code === 200) {
            if (value === 'add') {
              this.$message({
                message: '成功收藏该歌曲',
                type: 'success'
              })
              this.$set(this.collected, id, id)
              // this.collected[id] = id
            } else {
              this.$message({
                message: '您取消收藏该歌曲',
                type: 'warning'
              })
              this.$delete(this.collected, id)
              // delete this.collected[id]
            }
          }
        })
      } else {
        this.$message.error('请登录')
      }
    },
    // 判断是否收藏
    getCollectedValue () {
      this.collected = {}
      this.$http.get(`/playlist/detail?id=${this.songMenuId}`).then(data => {
        for (const key of data.playlist.tracks) {
          this.$set(this.collected, key.id, key.id)
        }
      })
    },
    double (num) {
      if (num.toString().length !== 2) {
        if (num === 0) {
          return '00'
        }
        return '0' + num
      }
      return num
    },
    duration (time) {
      return `${this.double(Math.floor(time / 60000))}:${this.double(Math.floor(time / 1000 % 60))}`
    },
    goAlbum (id) {
      this.$router.push({
        path: '/album',
        query: {
          id
        }
      })
    },
    goSinger (id) {
      this.$router.push({ name: 'singerInformation', params: { sid: id } })
    }
  },
  computed: {
    active () {
      return this.$store.state.active
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
  table tbody tr:nth-child(odd)
    background-color #1c1c1c
  table tbody tr:nth-child(even)
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
    cursor pointer
  .td
    .songName
      width 230px
      overflow hidden
      text-overflow ellipsis
      white-space nowrap
    .singer,.album
      margin-left 10px
      font-size 12px
      width 100px
      overflow hidden
      text-overflow ellipsis
      white-space nowrap
      color #888888
    span
      font-size 10px
      color #888888
  .collect
    .no
      visibility hidden
    i
      font-size 16px
      width 60px
      margin-left 10px
      span
        font-size 12px
        margin-left 2px
  table tr:hover
    .collect
      i
        visibility visible
  table thead tr
    background-color #b93e37
    td
      margin-left 20px
  .album:hover
    text-decoration underline
    cursor pointer
  .singer span:hover
    text-decoration underline
    cursor pointer
</style>
