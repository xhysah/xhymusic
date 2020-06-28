<template>
  <div class="box" @click="goSongMenu(music.id)">
    <img :src="music.coverImgUrl">
    <div class="name">{{music.name}}</div>
    <div class="copywriter">{{music.copywriter}}</div>
    <div class="creator">by {{music.creator.nickname}}</div>
  </div>
</template>

<script>
export default {
  name: 'highOutline',
  props: {
    music: Object
  },
  data () {
    return {}
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
  computed: {}
}
</script>

<style lang="stylus" scoped>
  .box:hover
    background-color #0e0e0e
  .box
    position relative
    width 100%
    padding 4px 0
    .copywriter
      position absolute
      left 130px
      top 90px
      font-size 12px
      color #888888
    .name
      position absolute
      top 10px
      left 130px
    .creator
      position absolute
      top 50px
      left 130px
      font-size 12px
      color #616060
  img
    width 120px
    height 120px
    margin auto
</style>
