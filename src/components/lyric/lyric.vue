<template>
  <div>
    <el-collapse-item :name="songItem.id">
      <template slot="title">
        <el-col :span="8">
          <i class="el-icon-video-play"></i>
          <span>{{songItem.name}}</span>
        </el-col>
        <el-col :offset="1" :span="5">
          <template v-for="(item, index) in songItem.artists">
            <span :key="index" v-if="index===0">{{item.name}}</span>
            <span :key="index" v-else>/{{item.name}}</span>
          </template>
        </el-col>
        <el-col :offset="1" :span="5"><span>《{{songItem.album.name}}》</span></el-col>
        <el-col :offset="1" :span="1"><span class="time">{{duration}}</span></el-col>
        <el-col :offset="1" :span="1"><i class="el-icon-star-on"></i></el-col>
      </template>
      <div>
        <template v-for="(item, index) in txt">
          <div :key="index">{{item}}</div>
        </template>
      </div>
    </el-collapse-item>
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
  methods: {
    double (num) {
      if (num.toString().length !== 2) {
        if (num === 0) {
          return '00'
        }
        return '0' + num
      }
      return num
    }
  },
  computed: {
    txt () {
      return this.songItem.lyrics.txt.split('\n')
    },
    duration () {
      return `${this.double(Math.floor(this.songItem.duration / 60000))}:${this.double(Math.floor(this.songItem.duration / 1000 % 60))}`
    }
  }
}
</script>

<style lang="stylus" scoped>
  .time
    font-size 14px
    color #62c6a5
  .el-col
    overflow hidden
    text-overflow ellipsis
    white-space nowrap
  .el-collapse-item
    background-color  #1c1c1c
    padding 15px
    >>>.el-collapse-item__header
      background-color  black
      padding-left 10px
      color white
</style>
