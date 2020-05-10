<template>
  <div>
    <!--    导航菜单-->
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      background-color="black"
      text-color="white"
      active-text-color="red">
      <el-menu-item index="recommend" @click="go('/recommend')">推荐</el-menu-item>
      <el-menu-item index="profileMusic" @click="go('/profileMusic')">我的音乐</el-menu-item>
      <el-menu-item index="ranking" @click="go('/ranking')">排行榜</el-menu-item>
      <el-menu-item index="songMenu" @click="go('/songMenu')">歌单</el-menu-item>
      <el-menu-item index="newsRadio" @click="go('/newsRadio')">主播电台</el-menu-item>
      <el-menu-item index="singer" @click="go('/singer')">歌手</el-menu-item>
      <el-input class="input" v-model="input" autofocus placeholder="专辑/歌手/歌单/用户"
                prefix-icon="el-icon-search" @keyup.enter.native="searchInf(input)"
                @input="changeValue" @blur="blur"
      ></el-input>
      <span @click="loginVisible=true" v-if="loginIf === 0" ref="login">登录</span>
      <!--        登录后显示-->
      <el-popover
        v-else
        placement="bottom"
        trigger="hover">
        <ul>
          <li><i class="el-icon-user"></i>我的主页</li>
          <li><i class="el-icon-message"></i>我的消息</li>
          <li><i class="el-icon-setting"></i>个人设置</li>
          <li><i class="el-icon-circle-close"></i>退出</li>
        </ul>
        <img :src="headImgUrl" alt="hhh" slot="reference">
      </el-popover>
    </el-menu>
    <!--    显示的页面-->
    <router-view/>
    <!--    显示登录对话框-->
    <div class="dialog">
      <el-dialog
        :visible.sync="loginVisible"
        width="400px"
        :title="title"
        @close="change(0,'没有账号？请先注册')">
        <div class="button-group" v-if="active == 0">
          <el-button size="medium" round @click="change(1, '手机登录')">手机登录</el-button>
          <el-button round size="medium" @click="change(2, '注册')">注册</el-button>
        </div>
        <phone-login v-else-if="active == 1" @register="editActive" @success="login"></phone-login>
        <register v-else @login="editActive"></register>
      </el-dialog>
    </div>
    <!--    音乐栏显示-->
    <transition name="music">
      <music-player class="music" v-show="show"></music-player>
    </transition>
    <!--    显示搜索框-->
    <div v-show="Object.keys(result).length !== 0" class="search">
      <!--          歌曲-->
      <div v-if="result.songs">
        <i class="el-icon-headset"></i>单曲
        <div v-for="(item, index) in result.songs" :key="index">
          <div class="item">{{item.name}}-
            <template v-for="(item1, index) in item.artists"><span :key="index"></span>{{item1.name}}</template>
          </div>
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
          <div class="item" :key="index">{{item.name}}-
            <template v-for="(item1, index) in item.artists"><span :key="index"></span>{{item1.name}}</template>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import musicPlayer from '../components/musicPlayer/musicPlayer'
import phoneLogin from './Login/phoneLogin'
import register from './register/register'
export default {
  name: 'index',
  data () {
    return {
      // 是否显示对话框
      loginVisible: false,
      // 在登录框中，哪一个内容该显示
      active: 0,
      // 搜索框的值
      input: '',
      // 根据搜索框内容搜索到的结果
      result: {},
      // 登录框标题
      title: '没有账号？请先注册',
      // 头像显示，还是登录显示
      loginIf: 0,
      // 控制音乐栏显示
      show: false
    }
  },
  created () {
    if (window.sessionStorage.getItem('phone') && window.sessionStorage.getItem('password')) {
      this.loginIf = 1
    }
  },
  // created () {
  //   // this.$nextTick(function () {
  //   //   console.log(this.$refs.login)
  //   // })
  //   setTimeout(function () {
  //     console.log(this.$refs.login)
  //   }, 1)
  // },
  mounted () {
    // 判断音乐栏是否显示
    function show () {
      if ((window.innerHeight - event.clientY) < 200) {
        this.show = true
      } else {
        this.show = false
      }
    }
    window.addEventListener('mousemove', show.bind(this))
    // window.addEventListener('beforeunload', function () {
    //   window.sessionStorage.setItem('url', this.$store.state.playSong.url)
    //   window.sessionStorage.setItem('img', this.$store.state.playSong.img)
    //   window.sessionStorage.setItem('name', this.$store.state.playSong.name)
    //   window.sessionStorage.setItem('singer', this.$store.state.playSong.singer)
    // })
  },
  components: {
    phoneLogin,
    register,
    musicPlayer
  },
  methods: {
    // 监听子组件事件
    editActive (value) {
      this.active = value.value
      this.title = value.title
    },
    // 根据input里面的值发送请求，得到结果
    search (value) {
      if (value === '') {
        return
      }
      this.$http.get(`/search/suggest?keywords=${value}`).then(({ data }) => {
        if (data.code !== 200) {
          return this.$message.error('搜索失败')
        }
        this.result = data.result
        console.log(data.result)
      })
    },
    // 在登录框中，为显示哪个做改变
    change (value, title) {
      this.active = value
      this.title = title
    },
    login (value) {
      this.loginVisible = false
      this.headImgUrl = value
      this.loginIf = 1
    },
    // 去往哪一个子页面
    go (value) {
      this.$router.push(value)
    },
    // 在input里面写值并按enter键，进入serch页面
    searchInf (value) {
      if (value === '') {
        return
      }
      this.$router.push({
        path: '/search',
        query: { keywords: value }
      })
      this.result = {}
    },
    changeValue (value) {
      if (value === '') {
        this.result = {}
        console.log('sdd')
      }
      this.search(value)
    },
    blur () {
      this.result = {}
      this.input = ''
    }
  },
  computed: {
    // 头像地址
    headImgUrl: {
      get () {
        if (window.sessionStorage.getItem('phone') && window.sessionStorage.getItem('password')) {
          return window.sessionStorage.getItem('imgUrl')
        }
        return ''
      },
      set (newValue) {
        console.log('sasa')
      }
    },
    activeIndex () {
      return this.$store.state.activeName
    }
  }
}
</script>
<style lang="stylus" scoped>
  .music
    position fixed
    bottom 0
    width 100%
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
      margin-top 20px
      +.el-button
        margin-left 0
        margin-bottom 30px
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
  .dialog
    /*color white*/
    >>>.el-dialog__header
      background-color black
      border 1px solid red
      border-bottom none
    >>>.el-dialog__body
      background-color black
      border 1px solid red
      border-top none
      padding 5px 0
    >>>.el-dialog__title
      color white
  img
    width 30px
    height 30px
    border-radius 50%
    margin auto
  .music-enter-active, .music-leave-active
    transition opacity 1s
  .music-enter, .music-leave-to
    opacity 0
  .search
    position fixed
    top 52px
    right 24%
    width 220px
    background-color purple
    z-index 20
    padding 20px
    border-radius 5px
    .item
      width 130px
      //超粗文字部分，隐藏
      overflow hidden
      // 文本被修建
      text-overflow ellipsis
      white-space nowrap
      position relative
      left 70px
      top -20px
      font-size 12px
      cursor pointer
    .line
      position relative
      top -10px
</style>
