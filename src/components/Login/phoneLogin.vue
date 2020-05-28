<template>
  <div class="center">
    <el-card class="box-card">
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules">
        <el-form-item prop="phone">
          <el-input v-model="loginForm.phone" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <div class="center">
          <el-button type="danger" class="loginButton" @click="login">登录</el-button>
        </div>
        <div class="register div" @click="register(2)"><i class="el-icon-back"></i>注册</div>
        <div class="forget div" @click="forget(2)">忘记密码<i class="el-icon-right"></i></div>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'phoneLogin',
  data () {
    return {
      // 登录表单
      loginForm: {
        phone: '',
        password: ''
      },
      // 登录规则
      loginRules: {
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    // 登录
    login () {
      this.$refs.loginForm.validate((valid) => {
        if (!valid) {
          return this.$message.error('请填写完整信息')
        }
        // 得到token，用户id
        this.$http.get('/login/cellphone', { params: this.loginForm }).then(data => {
          window.localStorage.setItem('token', data.token)
          // 得到用户的歌单id
          this.$http.get(`/user/playlist?uid=${data.account.id}`).then(data => {
            this.$store.commit('getSongMenuId', data.playlist[0].id)
          })
          this.$store.commit('getAccountId', data.account.id)
          window.localStorage.setItem('phone', this.loginForm.phone)
          window.localStorage.setItem('password', this.loginForm.password)
          window.localStorage.setItem('imgUrl', data.profile.avatarUrl)
          this.$emit('success', data.profile.avatarUrl)
        }).catch(() => {
          this.$message.error('密码错误')
        })
      })
    },
    // 跳转注册页面
    register (value) {
      this.$emit('register', { value: value, title: '注册' })
    },
    forget (value) {
      this.$emit('register', { value: value, title: '修改密码' })
    }
  },
  computed: {}
}
</script>

<style lang="stylus" scoped>
  .center
    display flex
    justify-content center
    align-items center
  .box-card
    border none
    width 450px
    background-color black
  .loginButton
    width 120px
  .forget
    right 0
    bottom 25px
    margin-right 20px
    position absolute
  .register
    position relative
  .div
    cursor pointer
    color #888888
</style>
