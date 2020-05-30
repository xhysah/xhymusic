<template>
  <div>
<!--    <div class="lyric" v-for="(item,index) in txt" :key="index">{{item}}</div>-->
<!--    <div>{{txts}}</div>-->
    <div class="lyric" :class="{active:key===newTime}" v-for="(item,key) in timeLyric" :key="key">{{item}}</div>
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
      timeLyric: {},
      active: false,
      keyValue: '',
      newTime: this.time
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
          v = v.match('[0-9][0-9]:[0-6][0-9]') + ''
          if (v !== 'null') {
            if (a !== 'null') {
              this.timeLyric[v] = a
            }
          }
        })
      })
      console.log(this.timeLyric)
    }
  },
  watch: {
    lyric () {
      this.getLyric()
    },
    time (newValue) {
      for (const key in this.timeLyric) {
        if (key === newValue) {
          this.keyValue = newValue
          this.newTime = newValue
          this.$emit('changeScroll', 10)
        } else {
          this.newTime = this.keyValue
          // this.$emit('changeScroll', 1)
        }
      }
    }
  },
  computed: {
  }
}
</script>

<style lang="stylus" scoped>
  .lyric
    padding 14px
    text-align center
    font-size 12px
    color rgba(136, 136, 136, 0.96)
  .active
    font-size 14px
    color red
</style>
