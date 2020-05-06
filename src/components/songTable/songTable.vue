<template>
  <div class="flex">
    <table>
      <tr v-for="(item, index) in songs" :key="index">
        <td>{{index+1}}</td>
<!--        <i class="el-icon-video-play"  :class="{'el-icon-video-pause':active == item.id}"  @click="play(item.id, item.al.picUrl,item.name,item.al.name)"></i>-->
        <i class="el-icon-video-play"  :class="{'el-icon-video-pause':active == item.id}"  @click="play(item.id, item.al.picUrl,item.name,item.al.name)"></i>
        <td>{{item.name}}</td>
        <td>{{item.al.name}}</td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  name: 'songTable',
  props: {
    songs: {
      type: Array
    }
  },
  data () {
    return {
    }
  },
  methods: {
    // 播放歌曲
    play (id, img, name, singer) {
      if (this.active === id) {
        this.$store.commit('editActive', id + 1)
        // this.active = id + 1
        this.$store.commit('pauseMusic')
        // this.$emit('pause')
      } else if (this.active === id + 1) {
        // this.$emit('play')
        this.$store.commit('playMusic')
        // this.active = id
        this.$store.commit('editActive', id)
      } else {
        this.$http.get(`/song/url?id=${id}`).then(({ data }) => {
          if (data.code !== 200) {
            return this.$message.error('获取歌信息失败')
          }
          // this.active = id
          this.$store.commit('editActive', id)
          this.$store.commit('playUrl', { url: data.data[0].url, img, name, singer })
        })
      }
    }
  },
  computed: {
    active () {
      return this.$store.state.active
    }
  }
}
</script>

<style lang="stylus" scoped>
  table tr:nth-child(odd)
    background-color #1c1c1c
  table tr:nth-child(even)
    color #909399
  table
    font-size 14px
    width 100%
    border-collapse collapse
  td,i
    cellspacing 10
    padding 5px
  i
    font-size 1.5em
</style>
