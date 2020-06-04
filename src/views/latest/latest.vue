<template>
  <div>
    <el-row type="flex" class="row-bg" justify="center">
      <el-link type="info" :underline="false">全部</el-link>
      <el-link type="info" :underline="false">华语</el-link>
      <el-link type="info" :underline="false">欧美</el-link>
      <el-link type="info" :underline="false">韩国</el-link>
      <el-link type="info" :underline="false">日本</el-link>
    </el-row>
    <template  v-for="item in musics" class="box">
      <div :key="item.id">
        <img :src="item.album.picUrl">
        <div class="name">{{item.name}}</div>
        <div class="singer">
          <template v-for="(items, index) in item.artists">
            <span :key="index" v-if="index===0" @click="goSinger(items.id)">{{items.name}}</span>
            <span :key="index" v-else @click="goSinger(items.id)">/{{items.name}}</span>
          </template>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'latest',
  created () {
    this.getSongs()
    this.$store.commit('editActiveName', 'latest')
  },
  data () {
    return {
      musics: []
    }
  },
  methods: {
    getSongs () {
      this.$http.get('/top/song').then(data => {
        this.musics = data.data
        console.log(data.data)
      })
    },
    goSinger (id) {
      this.$router.push({ name: 'singerInformation', params: { sid: id } })
    }
  },
  computed: {}
}
</script>

<style lang="stylus" scoped>
  img
    width 80px
    height 80px
</style>
