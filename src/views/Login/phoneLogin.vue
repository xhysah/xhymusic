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
        <div @click="register(2)"><i class="el-icon-back"></i>注册</div>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'phoneLogin',
  data () {
    return {
      loginForm: {
        phone: '',
        password: ''
      },
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
    login () {
      this.$refs.loginForm.validate((valid) => {
        if (!valid) {
          return this.$message.error('请填写完整信息')
        }
        this.$http.get('/login/cellphone', { params: this.loginForm }).then(({ data }) => {
          if (data.code === 200) {
            document.cookie = data.token
            console.log(data)
            console.log(data.account.id)
            console.log(data.profile.avatarUrl)
            // console.log(data.backgroundUrl)
            window.sessionStorage.setItem('phone', this.loginForm.phone)
            window.sessionStorage.setItem('password', this.loginForm.password)
            window.sessionStorage.setItem('imgUrl', data.profile.avatarUrl)
            this.$emit('success', data.profile.avatarUrl)
          }
        })
      })
    },
    register (value) {
      this.$emit('register', { value: value, title: '注册' })
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
</style>
