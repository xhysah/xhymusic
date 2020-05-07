<template>
  <div>
    <el-main>
      <el-row>
        <div class="search">
        <el-input v-model="searchValue"><el-button slot="append" icon="el-icon-search"></el-button></el-input>
        </div>
      </el-row>
      <div class="tabs">
        <el-tabs type="card" v-model="activeName" :stretch="true">
          <el-tab-pane label="单曲" name="single">单曲</el-tab-pane>
          <el-tab-pane label="歌手" name="singer">歌手</el-tab-pane>
          <el-tab-pane label="专辑" name="album">专辑</el-tab-pane>
          <el-tab-pane label="视频" name="mv">视频</el-tab-pane>
          <el-tab-pane label="歌词" name="lyric">歌词</el-tab-pane>
          <el-tab-pane label="歌单" name="songList">歌单</el-tab-pane>
          <el-tab-pane label="主播电台" name="station">主播电台</el-tab-pane>
          <el-tab-pane label="用户" name="user">用户</el-tab-pane>
        </el-tabs>
      </div>
    </el-main>
  </div>
</template>

<script>
export default {
  name: 'search',
  created () {
    this.search()
  },
  data () {
    return {
      searchValue: '',
      activeName: 'single',
      searchResult: {}
    }
  },
  methods: {
    search () {
      this.$http.get(`/search/multimatch?keywords=${this.keywords}`).then(({ data }) => {
        if (data.code !== 200) {
          return this.$message.error('搜索失败')
        }
        console.log(data)
        this.searchResult = data.result
      })
    }
  },
  computed: {
    keywords () {
      return this.$route.query.keywords
    }
  }
}
</script>

<style lang="stylus" scoped>
  .el-main
    margin 0 auto
    .search
      width 400px
      margin 10px auto
  .el-input
    :focus
      border-color: red
  .tabs
    width 70%
    margin 0 auto
    >>>.el-tabs__item
      color white
    >>>.is-active
      color red
</style>
