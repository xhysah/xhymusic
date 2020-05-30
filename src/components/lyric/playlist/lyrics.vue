<template>
  <div>
<!--    <div class="lyric" v-for="(item,index) in txt" :key="index">{{item}}</div>-->
<!--    <div>{{txts}}</div>-->
    <div class="lyric" :class="{active:key===time}" v-for="(item,key) in timeLyric" :key="key">{{item}}</div>
  </div>
</template>

<script>
export default {
  name: 'lyrics',
  props: {
    lyric: {
      type: Object
    },
    time: {
      type: String
    }
  },
  data () {
    return {
      timeLyric: {}
    }
  },
  created () {
    this.getLyric()
  },
  methods: {
    getLyric () {
      const lyricsList = this.lyric.lrc.lyric.split('\n')
      this.timeLyric = {}
      lyricsList.forEach(value => {
        const reg = /]/
        let a = value
        while (reg.test(a)) {
          a = String(String(a.match('[\\]^]+.*')).match('[^(\\])].*'))
        }
        let b = String(value.match('(\\[[0-9][0-9]:[0-6][0-9].[0-9][0-9]+])+'))
        b = b.split('[')
        b.forEach(v => {
          v = v.match('[0-9][0-9]:[0-6][0-9].[0-9][0-9]+') + ''
          if (v !== 'null') {
            this.timeLyric[v] = a
          }
        })
      })
    }
  },
  watch: {
    lyric () {
      this.getLyric()
    }
  },
  computed: {
  }
}
</script>

<style lang="stylus" scoped>
  .lyric
    text-align center
    font-size 14px
    color rgba(136, 136, 136, 0.96)
  .active
    font-size 16px
    color red
</style>
