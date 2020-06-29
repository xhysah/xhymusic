<template>
  <div class="box">
    <img :src="music.album.picUrl">
    <div class="num">{{double(index+1)}}</div>
    <div class="name">{{music.name}}</div>
    <div class="singer">
      <template v-for="(item, index) in music.artists">
        <span :key="index" v-if="index===0" @click="goSinger(item.id)">{{item.name}}</span>
        <span :key="index" v-else @click="goSinger(item.id)">/{{item.name}}</span>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'musicOutline',
  props: {
    music: Object,
    index: Number
  },
  data () {
    return {}
  },
  methods: {
    goSinger (id) {
      this.$router.push({ name: 'singerInformation', params: { sid: id } })
    },
    double (num) {
      if (num.toString().length >= 2) {
        return num
      } else {
        if (num === 0) {
          return '00'
        }
        return '0' + num
      }
    }
  },
  computed: {}
}
</script>

<style lang="stylus" scoped>
  .box:hover
    background-color #0e0e0e
  .box
    cursor pointer
    position relative
    width 100%
    padding 4px 0
    .singer
      position absolute
      left 100px
      top 40px
      font-size 12px
      color #888888
      span:hover
        color #5f5e5e
        cursor pointer
    .name
      position absolute
      top 10px
      left 100px
    .num
      position absolute
      left 70px
      top 20px
      color #555454
      font-size 14px
  img
    width 60px
    height 60px
    margin auto
</style>
