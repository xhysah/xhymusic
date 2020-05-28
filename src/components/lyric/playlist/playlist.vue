<template>
  <div class="flex">
    <table>
      <tr v-for="(item, index) in songs" :key="item.id" @click="play(item.id, index)" :class="{active:index===Number(activeSongId)}">
        <td><div class="name">{{item.name}}</div></td>
<!--        <td class="creator">{{item.creator.nickname}}</td>-->
        <td>
          <div class="singer">
            <template v-for="(items, index) in item.ar">
              <span :key="items.id" v-if="index===0" @click="goSinger(items.id)">{{items.name}}</span>
              <span :key="items.id" v-else @click="goSinger(items.id)">/{{items.name}}</span>
            </template>
          </div>
        </td>
        <td>
          <div class="dt">
            <span>{{duration(item.dt)}}</span>
          </div>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  name: 'playlist',
  props: {
    songs: {
      type: Array
    },
    activeSongId: {
      type: String
    }
  },
  data () {
    return {
    }
  },
  methods: {
    duration (time) {
      return `${this.double(Math.floor(time / 60000))}:${this.double(Math.floor(time / 1000 % 60))}`
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
    goSinger (id) {
      this.$router.push({ name: 'singerInformation', params: { sid: id } })
    },
    play (id, index) {
      if (window.sessionStorage.getItem('songs') !== this.songs) {
        this.$store.commit('getSongs', this.songs)
      }
      this.$store.commit('getTotal', this.songs.length)
      this.$store.dispatch('play', {
        num: index,
        name: this.name
      })
    }
  },
  computed: {
    name () {
      return this.$store.state.tableName
    }
  }
}
</script>

<style lang="stylus" scoped>
  table
    color rgba(255, 255, 255, 0.82)
    font-size 12px
    td
      padding 5px 15px
    .singer
      width 80px
      span:hover
        text-decoration underline
        cursor pointer
    .dt
      width 40px
    .name
      width 360px
    div
      overflow hidden
      text-overflow ellipsis
      white-space nowrap
  tr:hover
    background-color black
  .active
    background-color red
</style>
