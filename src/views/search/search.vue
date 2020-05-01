<template>
  <div>
    <el-main>
      <el-row>
        <div class="search">
        <el-input v-model="search"><el-button slot="append" icon="el-icon-search"></el-button></el-input>
        </div>
      </el-row>
      <el-tabs  type="card" v-model="activeName">
        <el-tab-pane label="单曲" name="single">单曲</el-tab-pane>
        <el-tab-pane label="单曲" name="singer">歌手</el-tab-pane>
        <el-tab-pane label="专辑" name="album">专辑</el-tab-pane>
        <el-tab-pane label="视频" name="mv">视频</el-tab-pane>
        <el-tab-pane label="歌词" name="lyric">歌词</el-tab-pane>
        <el-tab-pane label="歌单" name="songList">歌单</el-tab-pane>
        <el-tab-pane label="主播电台" name="station">主播电台</el-tab-pane>
        <el-tab-pane label="用户" name="user">用户</el-tab-pane>
      </el-tabs>
    </el-main>
  </div>
</template>

<script>
export default {
  name: 'search',
  data () {
    return {
      search: '',
      activeName: 'single'
    }
  },
  methods: {},
  computed: {}
}
</script>

<style lang="stylus" scoped>
  .el-main
    margin 0 auto
    .search
      width 400px
      margin 10px auto
  .el-input
    border-radius 20px
    :focus
      border-color: red
</style>
