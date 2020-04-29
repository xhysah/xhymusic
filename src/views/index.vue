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
      <span @click="loginVisible=true">登录</span>
    </el-menu>
    <!--    显示的页面-->
    <keep-alive>
      <router-view/>
    </keep-alive>
    <!--    显示登录对话框-->
    <el-dialog
      title="登录"
      :visible.sync="loginVisible"
      width="30%">
      <div class="button-group">
<!--        <el-button size="medium" round @click="showPhoneLogin">登录</el-button>-->
<!--        <el-button round size="medium" @click="showRegister">注册</el-button>-->
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'index',
  data () {
    return {
      activeIndex: 'recommend',
      // 登录显示
      loginVisible: false
    }
  },
  components: {
  },
  methods: {
  },
  computed: {
  },
  watch: {
  }
}
</script>

<style lang="stylus" scoped>
.el-menu-demo
  display flex
  justify-content center
  span
    position relative
    left 150px
    margin auto 0px
    font-size 10px
    color #909399
.el-menu.el-menu--horizontal
  border-bottom none
.button-group
  background-color black
  text-align center
  .el-button
    background-color #353535
    width 200px
    margin 5px 0
    +.el-button
      margin-left 0px
</style>
