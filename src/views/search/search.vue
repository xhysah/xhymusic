<template>
  <div>
    <el-main>
      <el-row>
        <div class="search">
          <el-input v-model="keywords">
            <el-button slot="append" icon="el-icon-search" @keyup.enter.native="searchInf(input)"></el-button>
          </el-input>
        </div>
      </el-row>
      <div class="tabs">
        <div class="title">搜索"{{keywords}}", 找到</div>
        <el-tabs type="border-card" style="background-color: black" :stretch="true">
          <el-tab-pane label="单曲">
            <songs :songs="searchResult[0].songs"></songs>
          </el-tab-pane>
          <el-tab-pane label="歌手">
            <template v-for="(item, index) in searchResult[1].artists">
              <singer-outline :key="index" length="150px" height="150px">
                <template v-slot:img>
                  <img :src="item.img1v1Url" alt="" @click="goSinger(item.id)">
                </template>
                <template v-slot:sentence>
                  <div>{{item.name}}</div>
                </template>
              </singer-outline>
            </template>
          </el-tab-pane>
          <el-tab-pane label="专辑">
            <div class="flex">
              <template v-for="(item, index) in searchResult[2].albums">
                <album-outline :key="index" length="150px" height="150px">
                  <template v-slot:img>
                    <img :src="item.blurPicUrl" alt="" @click="songlist(item.id)">
                  </template>
                  <template v-slot:sentence>
                    <div>{{item.name}}</div>
                  </template>
                </album-outline>
              </template>
            </div>
          </el-tab-pane>
          <el-tab-pane label="视频">
            <div class="flex">
              <template v-for="(item, index) in searchResult[3].videos">
                <album-outline :key="index" length="150px" height="90px">
                  <template v-slot:img>
                    <img :src="item.coverUrl" alt="" @click="songlist(item.id)">
                  </template>
                  <template v-slot:sentence>
                    <div>{{item.title}}</div>
                  </template>
                </album-outline>
              </template>
            </div>
          </el-tab-pane>
          <el-tab-pane label="歌词">
            <template v-for="(item , index) in searchResult[4].songs">
              <lyric :key="index" :song="item"></lyric>
            </template>
          </el-tab-pane>
          <el-tab-pane label="歌单">
            <songmenu :songs="searchResult[5].playlists"></songmenu>
          </el-tab-pane>
          <el-tab-pane label="用户">
            <user :users="searchResult[6].userprofiles"></user>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-main>
  </div>
</template>

<script>
import albumOutline from '../../components/songOutline /albumOutline'
import singerOutline from '../../components/songOutline /singerOutline'
import user from '../../components/songTable/user'
import songmenu from '../../components/songTable/songmenu'
import lyric from '../../components/lyric/lyric'
import songs from '../../components/songTable/songs'
export default {
  name: 'search',
  components: {
    songs,
    lyric,
    songmenu,
    user,
    singerOutline,
    albumOutline
  },
  created () {
    this.search(1, 0)
    this.search(100, 1)
    this.search(10, 2)
    this.search(1014, 3)
    this.search(1006, 4)
    this.search(1000, 5)
    this.search(1002, 6)
  },
  mounted () {
    this.$store.commit('getSongs', this.searchResult[0].songs)
    this.$store.commit('getTotal', this.searchResult[0].songs.length)
  },
  data () {
    return {
      searchResult: [
        {}, {}, {}, {}, {}, {}, {}
      ]
    }
  },
  methods: {
    // 根据type值，来获取搜索信息的type数据
    search (type, i) {
      this.$http.get(`/search?keywords=${this.keywords}&type=${type}`).then(({ data }) => {
        if (data.code !== 200) {
          return this.$message.error('搜索失败')
        }
        this.$set(this.searchResult, i, data.result)
        // this.searchResult.splice(i, 0, data.result)
        console.log(this.searchResult[0])
      })
    },
    // 去往歌单详细信息
    songlist (id) {
      this.$router.push({ name: 'songMenuDetail', query: { path: '/top/playlist/id=', id: id } })
    },
    // 去往歌手详细信息
    goSinger (id) {
      this.$router.push({ name: 'singerInformation', params: { sid: id } })
    }
  },
  computed: {
    keywords () {
      return this.$route.query.keywords
    }
  },
  watch: {
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
    /*>>>.el-tabs__item*/
    /*  color white*/
    /*>>>.is-active*/
    /*  color red*/
    .title
      color #909399
      font-size 14px
      margin-bottom 6px
      padding-left 10px
  .tabs>>>.el-tabs__item.is-active
    color red
  .tabs>>>.el-tabs__item:hover
    color red !important
</style>
