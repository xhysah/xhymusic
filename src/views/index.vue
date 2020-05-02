<template>
  <div>
    <!--    导航菜单-->
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      background-color="black"
      text-color="white"
      active-text-color="red"
      router>
      <el-menu-item index="recommend">推荐</el-menu-item>
      <el-menu-item index="profileMusic">我的音乐</el-menu-item>
      <el-menu-item index="ranking">排行榜</el-menu-item>
      <el-menu-item index="songMenu">歌单</el-menu-item>
      <el-menu-item index="newsRadio">主播电台</el-menu-item>
      <el-menu-item index="singer">歌手</el-menu-item>
      <el-popover
        placement="bottom"
        trigger="focus">
        <!--          歌曲-->
        <div v-if="result.songs">
          <i class="el-icon-headset"></i>单曲
          <div v-for="(item, index) in result.songs" :key="index">
            <div class="item">{{item.name}}-<template v-for="(item1, index) in item.artists"><span  :key="index"></span>{{item1.name}} </template></div>
          </div>
          <div class="line"></div>
        </div>
        <!--        歌手-->
        <div v-if="result.artists">
          <i class="el-icon-user"></i>歌手
          <div v-for="(item, index) in result.artists" :key="index">
            <div class="item">{{item.name}}</div>
          </div>
          <div class="line"></div>
        </div>
        <!--        专辑-->
        <div v-if="result.albums">
          <i class="el-icon-star-off"></i>专辑
          <div v-for="(item, index) in result.albums" :key="index">
            <div class="item">{{item.name}}-{{item.artist.name}}</div>
          </div>
          <div class="line"></div>
        </div>
        <!--        mv-->
        <div v-if="result.mvs">
          <i class="el-icon-s-platform"></i>视频
          <template v-for="(item, index) in result.mvs">
            <div class="item" :key="index">{{item.name}}-<template v-for="(item1, index) in item.artists"><span  :key="index"></span>{{item1.name}}</template></div>
          </template>
        </div>
      <el-input class="input" slot="reference" v-model="input" autofocus placeholder="专辑/歌手/歌单/用户" prefix-icon="el-icon-search"></el-input>
      </el-popover>
<!--      <button  @click="$router.push('search')">dsd</button>-->
      <span @click="loginVisible=true">登录</span>
    </el-menu>
    <!--    显示的页面-->
    <keep-alive>
      <router-view/>
    </keep-alive>
    <!--    显示登录对话框-->
    <div class="dialog">
      <el-dialog
        :visible.sync="loginVisible"
        width="400px"
        :title="title"
        @close="active=0">
        <div class="button-group" v-if="active == 0">
          <el-button size="medium" round @click="active=1">手机登录</el-button>
          <el-button round size="medium" @click="active=2">注册</el-button>
        </div>
        <phone-login v-else-if="active == 1" @register="editActive"></phone-login>
        <register v-else @login="editActive"></register>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import phoneLogin from './Login/phoneLogin'
import register from './register/register'
export default {
  name: 'index',
  created () {
    this.firstIndex()
  },
  data () {
    return {
      activeIndex: 'recommend',
      // 是否显示对话框
      loginVisible: false,
      active: 0,
      input: '',
      result: {},
      title: '我我哦我'
    }
  },
  watch: {
    input (value) {
      this.search(value)
    }
  },
  components: {
    phoneLogin,
    register
  },
  methods: {
    editActive (value) {
      this.active = value
    },
    firstIndex () {
      this.$router.push('recommend')
    },
    search (value) {
      this.$http.get(`/search/suggest?keywords=${value}`).then(({ data }) => {
        if (data.code !== 200) {
          return this.$message.error('搜索失败')
        }
        this.result = data.result
        console.log(data.result)
      })
    }
  },
  computed: {
  }
}
</script>

<style lang="stylus" scoped>
  .el-menu-demo
    display flex
    justify-content center
    span
      position relative
      margin auto 0
      font-size 10px
      color #909399
  .el-menu.el-menu--horizontal
    border-bottom none
  .button-group
    background-color black
    text-align center
    .el-button
      background-color #252525
      color white
      width 200px
      margin 5px 0
      border 1px solid red
      +.el-button
        margin-left 0
  .el-input
    width auto
    margin auto 20px
    :focus
      border-color red
  .input>>>.el-input__inner
    border-radius 20px
    height: 33px
    font-size 12px
    width 90%
  i
    margin-right 10px
    font-size 1.3em
  .item
    position relative
    left 70px
    top -20px
    font-size 13px
    margin 1px 0
  .line
    position relative
    top -10px
  .dialog
    >>>.el-dialog__header
      background-color black
      border 1px solid red
      border-bottom none
    >>>.el-dialog__body
      background-color black
      border 1px solid red
      border-top none
      padding 5px 0
</style>
