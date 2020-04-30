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
      :visible.sync="loginVisible"
      width="30%"
      @close="active=0">
      <div class="button-group" v-if="active == 0">
        <el-button size="medium" round @click="active=1">登录</el-button>
        <el-button round size="medium" @click="active=2">注册</el-button>
      </div>
      <phone-login v-else-if="active == 1" @register="editActive"></phone-login>
      <register v-else @login="editActive" ></register>
    </el-dialog>
  </div>
</template>

<script>
import phoneLogin from './Login/phoneLogin'
import register from './register/register'
export default {
  name: 'index',
  data () {
    return {
      activeIndex: 'recommend',
      // 是否显示对话框
      loginVisible: false,
      active: 0
    }
  },
  components: {
    phoneLogin,
    register
  },
  methods: {
    editActive (value) {
      this.active = value
    }
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
    margin auto 0
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
      margin-left 0
</style>
