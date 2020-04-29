<template>
  <div class="center">
<!--    发送验证码-->
    <el-card class="box-card">
      <div slot="header">
        <span>注册</span>
      </div>
      <el-form ref="phoneForm" :model="phoneForm" :rules="phoneRules" label-width="80px" v-if="show">
        <el-form-item prop="phone" label="手机号">
          <el-input v-model="phoneForm.phone" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <div class="center">
          <el-button type="primary" class="loginButton" @click="confirmPhone">确定</el-button>
        </div>
      </el-form>
      <!--    注册-->
      <el-form ref="registerForm" :model="registerForm" :rules="registerRules" label-width="80px" v-else>
        <el-form-item prop="captcha" label="验证码">
          <el-input v-model="registerForm.captcha" placeholder="请输入验证码"></el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码">
          <el-input v-model="registerForm.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item prop="nickname" label="昵称">
          <el-input v-model="registerForm.nickname" placeholder="请输入昵称"></el-input>
        </el-form-item>
        <div class="center">
          <el-button type="primary" class="loginButton" @click="registerByPhone">确定</el-button>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'register',
  data () {
    return {
      // 设置哪一个表单显示
      show: true,
      // 电话表单
      phoneForm: {
        phone: ''
      },
      phoneRules: {
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' }
        ]
      },
      // 登录表单
      registerForm: {
        phone: '',
        password: '',
        captcha: '',
        nickname: ''
      },
      // 登录规则
      registerRules: {
        captcha: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        nickname: [
          { required: true, message: '请输入昵称', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    confirmPhone () {
      this.$refs.phoneForm.validate((valid) => {
        if (!valid) {
          return this.$message.error('请填写完整信息')
        }
        this.$http.get('/captcha/sent', { params: this.phoneForm }).then(response => {
          const { data } = response
          if (data.code === 200) {
            this.show = false
            this.registerForm.phone = this.phoneForm.phone
          }
        })
      })
    },
    registerByPhone () {
      this.$refs.registerForm.validate((valid) => {
        if (!valid) {
          return this.$message.error('请填写完整信息')
        }
        this.$http.get('/register/cellphone', { params: this.registerForm }).then(response => {
          console.log(response)
        }).catch(err => {
          console.log(err)
        })
      })
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
