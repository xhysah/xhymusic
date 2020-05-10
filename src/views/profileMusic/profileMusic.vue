<template>
  <div>
    profilemusic
    <song-outline length="100px" height="100px">
      <template v-slot:img>
        <img src="http://p2.music.126.net/NWTxt74aTH4bejNmRb7y4Q==/18765364953000742.jpg" alt="">
      </template>
      <template v-slot:sentence>
        <div>我们都是我们都是我们都是我们都是我们都是我们都是我们都是我们都是我们都是我们都是</div>
      </template>
    </song-outline>
  </div>
</template>

<script>
import songOutline from '../../components/songOutline /songOutline'
export default {
  name: 'profileMusic',
  created () {
    this.$store.commit('editActiveName', 'profileMusic')
  },
  data () {
    return {}
  },
  methods: {},
  computed: {},
  components: {
    songOutline
  }
}
</script>

<style lang="stylus" scoped>
</style>
