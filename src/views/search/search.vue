<template>
  <div>
    <el-main>
      <el-row>
        <div class="search">
        <el-input v-model="keywords"><el-button slot="append" icon="el-icon-search"></el-button></el-input>
        </div>
      </el-row>
      <div class="tabs">
        <div class="title">搜索"{{keywords}}", 找到</div>
        <el-tabs type="card" v-model="activeName" :stretch="true">
          <el-tab-pane label="单曲" name="songs">
            <songs :songs="searchResult[0].songs"></songs>
          </el-tab-pane>
          <el-tab-pane label="歌手" name="singer">
            <template v-for="(item, index) in searchResult[1].artists">
              <song-outline :key="index" length="150px" height="150px">
                <template v-slot:img>
                  <img :src="item.img1v1Url" alt="" @click="songlist(item.id)">
                </template>
                <template v-slot:sentence>
                  <div>{{item.name}}</div>
                </template>
              </song-outline>
            </template>
          </el-tab-pane>
          <el-tab-pane label="专辑" name="album">
            <template v-for="(item, index) in searchResult[2].albums">
              <song-outline :key="index" length="150px" height="150px">
                <template v-slot:img>
                  <img :src="item.blurPicUrl" alt="" @click="songlist(item.id)">
                </template>
                <template v-slot:sentence>
                  <div>{{item.name}}</div>
                </template>
              </song-outline>
            </template>
          </el-tab-pane>
          <el-tab-pane label="视频" name="mv">
            <template v-for="(item, index) in searchResult[3].videos">
              <song-outline :key="index" length="150px">
                <template v-slot:img>
                  <img :src="item.coverUrl" alt="" @click="songlist(item.id)">
                </template>
                <template v-slot:sentence>
                  <div>{{item.title}}</div>
                </template>
              </song-outline>
            </template>
          </el-tab-pane>
          <el-tab-pane label="歌词" name="lyric">
            <template v-for="(item , index) in searchResult[4].songs">
              <lyric :key="index" :song="item"></lyric>
            </template>
          </el-tab-pane>
          <el-tab-pane label="歌单" name="songList">
            <songmenu :songs="searchResult[5].playlists"></songmenu>
          </el-tab-pane>
          <el-tab-pane label="主播电台" name="station">
            <template v-for="(item, index) in searchResult[6].djRadios">
              <song-outline :key="index" length="150px">
                <template v-slot:img>
                  <img :src="item.picUrl" alt="" @click="songlist(item.id)">
                </template>
                <template v-slot:sentence>
                  <div>{{item.desc}}</div>
                </template>
              </song-outline>
            </template>
          </el-tab-pane>
          <el-tab-pane label="用户" name="user">
            <user :users="searchResult[7].userprofiles"></user>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-main>
  </div>
</template>

<script>
import user from '../../components/songTable/user'
import songmenu from '../../components/songTable/songmenu'
import lyric from '../../components/lyric/lyric'
import songOutline from '../../components/songOutline /songOutline'
import songs from '../../components/songTable/songs'
export default {
  name: 'search',
  components: {
    songs,
    songOutline,
    lyric,
    songmenu,
    user
  },
  created () {
    this.search(1, 0)
    this.search(100, 1)
    this.search(10, 2)
    this.search(1014, 3)
    this.search(1006, 4)
    this.search(1000, 5)
    this.search(1009, 6)
    this.search(1002, 7)
  },
  data () {
    return {
      activeName: 'songs',
      searchResult: [
        {}, {}, {}, {}, {}, {}, {}, {}
      ]
    }
  },
  methods: {
    search (type, i) {
      this.$http.get(`/search?keywords=${this.keywords}&type=${type}`).then(({ data }) => {
        if (data.code !== 200) {
          return this.$message.error('搜索失败')
        }
        this.searchResult[i] = data.result
        // console.log(this.searchResult[7])
      })
    },
    songlist (id) {
      this.$router.push({ name: 'songMenuDetail', query: { path: '/top/playlist/id=', id: id } })
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
    .title
      color #909399
      font-size 14px
      margin-bottom 6px
      padding-left 10px
</style>
