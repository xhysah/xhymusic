<template>
  <div class="center">
    <el-card class="box-card">
      <div slot="header">
        <span>手机登录</span>
      </div>
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules">
        <el-form-item prop="phone">
          <el-input v-model="loginForm.phone" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <div class="center">
          <el-button type="primary" class="loginButton" @click="login">登录</el-button>
          <el-button @click="register(2)">注册</el-button>
        </div>
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
            this.emit('success')
          }
        })
      })
    },
    register (value) {
      this.$emit('register', value)
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
    width 450px
  .loginButton
    width 120px
</style>
