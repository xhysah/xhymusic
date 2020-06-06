<template>
  <div>
    <div class="grid-2">
      <template v-for="item in highqualityList">
        <!--      <img  :src="item.coverImgUrl" alt="">-->
        <!--        <music-outline :key="item.id" :music="item"></music-outline>-->
        <high-outline :key="item.id" :music="item"></high-outline>
      </template>
    </div>
  </div>
</template>

<script>
import highOutline from '../../../components/songOutline /highOutline'
export default {
  name: 'highuality',
  components: {
    highOutline
  },
  created () {
    this.$store.commit('editActiveName', 'songMenu')
    this.getHighQuality()
  },
  data () {
    return {
      highqualityList: []
    }
  },
  methods: {
    getHighQuality () {
      this.$http.get(`/top/playlist/highquality?cat=${this.name}`).then(data => {
        console.log(data.playlists)
        this.highqualityList = data.playlists
      })
    }
  },
  computed: {
    name () {
      return this.$route.query.name
    }
  }
}
</script>

<style lang="stylus" scoped>
  .grid-2
    cursor pointer
</style>
