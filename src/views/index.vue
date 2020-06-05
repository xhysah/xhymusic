<template>
  <div class="container">
    <el-header>
      <!--    导航菜单-->
      <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        background-color="black"
        text-color="white"
        active-text-color="red">
        <el-menu-item index="recommend" @click="go('/recommend')">推荐</el-menu-item>
        <el-menu-item index="ranking" @click="go('/ranking')">排行榜</el-menu-item>
        <el-menu-item index="songMenu" @click="go('/songMenu')">歌单</el-menu-item>
        <el-menu-item index="singer" @click="go('/singer')">歌手</el-menu-item>
        <el-menu-item index="latest" @click="go('/latest')">最新音乐</el-menu-item>
        <el-input class="input" v-model="input" autofocus placeholder="专辑/歌手/歌单/用户"
                  prefix-icon="el-icon-search" @keyup.enter.native="searchInf(input)"
                  @input="changeValue" ref="input" @blur="blur"
        ></el-input>
      </el-menu>
    </el-header>
    <el-container>
      <el-aside width="220px">
        <div class="mySinger">我的歌手</div>
        <div>我的视频</div>
        <div v-for="(item, index) in playlists" :key="index" class="aside">
          <img :src="item.coverImgUrl" alt="">
          <div>
            <span>{{item.name}}</span><br>
            <span>{{item.trackCount}}首 by{{item.creator.nickname}}</span>
          </div>
        </div>
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
            <register v-else @login="editActive" :name="this.title"></register>
          </el-dialog>
        </div>
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
            <li @click="loginOut"><i class="el-icon-circle-close"></i>退出</li>
          </ul>
          <img :src="headImgUrl" alt="hhh" slot="reference">
        </el-popover>
      </el-aside>
      <!--    显示的页面-->
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
    <!--    显示搜索框-->
    <div v-show="Object.keys(result).length !== 0" class="search">
      <!--          歌曲-->
      <div v-if="result.songs">
        <i class="el-icon-headset"></i>单曲
        <div v-for="(item, index) in result.songs" :key="index">
          <div class="item" @click="changeInputValue(item.name)">{{item.name}}-
            <template v-for="(item1, index) in item.artists"><span :key="index"></span>{{item1.name}}</template>
          </div>
        </div>
        <div v-if="result.artists||result.albums||result.mvs" class="line"></div>
      </div>
      <!--        歌手-->
      <div v-if="result.artists">
        <i class="el-icon-user"></i>歌手
        <div v-for="(item, index) in result.artists" :key="index">
          <div class="item" @click="changeInputValue(item.name)">{{item.name}}</div>
        </div>
        <div v-if="result.albums||result.mvs" class="line"></div>
      </div>
      <!--        专辑-->
      <div v-if="result.albums">
        <i class="el-icon-star-off"></i>专辑
        <div v-for="(item, index) in result.albums" :key="index">
          <div class="item" @click="changeInputValue(item.name)">{{item.name}}-{{item.artist.name}}</div>
        </div>
        <div v-if="result.mvs" class="line"></div>
      </div>
      <!--        mv-->
      <div v-if="result.mvs">
        <i class="el-icon-s-platform"></i>视频
        <template v-for="(item, index) in result.mvs">
          <div class="item" :key="index" @click="changeInputValue(item.name)">{{item.name}}-
            <template v-for="(item1, index) in item.artists"><span :key="index"></span>{{item1.name}}</template>
          </div>
        </template>
      </div>
    </div>
    <!--    音乐栏显示-->
    <transition name="music">
      <music-player class="music" v-show="show"></music-player>
    </transition>
  </div>
</template>

<script>
import musicPlayer from '../components/musicPlayer/musicPlayer'
import phoneLogin from '../components/Login/phoneLogin'
import register from '../components/register/register'
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
      show: false,
      playlists: []
    }
  },
  created () {
    // 判断session里面是否存在数据，有数据，就不用登录了
    if (window.localStorage.getItem('phone') && window.localStorage.getItem('password')) {
      this.loginIf = 1
    }
    this.getInf()
  },
  mounted () {
    // 判断音乐栏是否显示
    function show () {
      if ((window.innerHeight - event.clientY) < 1000) {
        this.show = true
      } else {
        this.show = false
      }
    }
    window.addEventListener('mousemove', show.bind(this))
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
      this.$http.get(`/search/suggest?keywords=${value}`).then(data => {
        this.result = data.result
      })
    },
    // 在登录框中，为显示哪个做改变
    change (value, title) {
      this.active = value
      this.title = title
    },
    // 登录成功后
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
    // 监听input值的改变
    changeValue (value) {
      if (value === '') {
        this.result = {}
      }
      this.search(value)
    },
    // 失去焦点时
    blur () {
      this.result = {}
      this.input = ''
    },
    changeInputValue (value) {
      this.result = {}
      this.$refs.input.focus()
      this.input = value
      this.searchInf(value)
    },
    //  退出登录
    loginOut () {
      this.$confirm('此操作将退出登录, 是否继续??', '提示', {
        confirmButtonText: '退出',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loginIf = 0
        window.localStorage.removeItem('token')
        window.localStorage.removeItem('phone')
        window.localStorage.removeItem('password')
        window.localStorage.removeItem('imgUrl')
        window.localStorage.removeItem('accountId')
        window.localStorage.removeItem('getAccountId')
        window.location.reload()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消退出'
        })
      })
    },
    getInf () {
      this.$http.get(`/user/playlist?uid=${this.accountId}`).then(data => {
        this.playlists = data.playlist
      })
    }
  },
  computed: {
    // 头像地址
    headImgUrl: {
      get () {
        if (window.localStorage.getItem('phone') && window.localStorage.getItem('password')) {
          return window.localStorage.getItem('imgUrl')
        }
        return ''
      },
      set () {
      }
    },
    activeIndex () {
      return this.$store.state.activeName
    }
  }
}
</script>
<style lang="stylus" scoped>
  .container
    margin-bottom 50px
  .music
    position fixed
    bottom 0
    width 100%
  .el-menu-demo
    display flex
    justify-content center
    span
      cursor pointer
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
      /*background-color #252525*/
      color #2f2f2f
      width 200px
      margin 5px 0
      border 1px solid #2f2f2f
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
      border-bottom none
    >>>.el-dialog__body
      background-color black
      border-top none
      padding 10px
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
    position absolute
    left 750px
    width 220px
    background-color black
    border 3px solid #252525
    z-index 20
    padding 10px 10px 0 10px
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
      padding 0 5px
    .line
      position relative
      top -10px
  .item:hover
    box-shadow 0 0 10px red
  .el-popover
    margin 0
    li:hover
      background-color #eeeeee
  .el-aside
    background-color #171717
</style>
