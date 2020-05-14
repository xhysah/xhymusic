<template>
  <div>
      <div>{{songItem.name}}</div>
        <template v-for="(item, index) in songItem.artists">
          <span :key="index" v-if="index===0">{{item.name}}</span>
          <span :key="index" v-else>/{{item.name}}</span>
        </template>
      <div>{{songItem.album.name}}</div>
      <div>{{songItem.lyrics.txt}}</div>
  </div>
</template>

<script>
export default {
  name: 'lyric',
  props: {
    song: {
      type: Object
    }
  },
  data () {
    return {
      songItem: this.song
    }
  },
  methods: {},
  computed: {}
}
</script>

<style lang="stylus" scoped>
</style>
