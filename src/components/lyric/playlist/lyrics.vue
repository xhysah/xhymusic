<template>
  <div>
    <div class="lyric" v-for="(item,index) in txt" :key="index">{{item}}</div>
  </div>
</template>

<script>
export default {
  name: 'lyrics',
  props: {
    lyric: {
      type: Object
    }
  },
  data () {
    return {}
  },
  methods: {
  },
  computed: {
    txt () {
      // [+[0-9][0-9]:[0-5][0-9]\.[0-5][0-9]*[0-9]]
      return this.lyric.lrc.lyric.split('\n')
    }
  }
}
</script>

<style lang="stylus" scoped>
  .lyric
    text-align center
    font-size 14px
</style>
