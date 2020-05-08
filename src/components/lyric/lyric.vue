<template>
  <div>
    <div>{{songItem.name}}</div>
    <div>
      <template v-for="(item, index) in songItem.artists">
        <span :key="index">{{item.name}}</span>
      </template>
    </div>
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
  computed: {
  }
}
</script>

<style lang="stylus" scoped>

</style>
