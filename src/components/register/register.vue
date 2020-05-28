<template>
  <div class="center">
<!--    发送验证码-->
    <el-card class="box-card">
      <el-form ref="phoneForm" :model="phoneForm" :rules="phoneRules" v-if="show">
        <el-form-item prop="phone">
          <el-input v-model="phoneForm.phone" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <div class="center">
          <el-button type="danger" class="loginButton" @click="confirmPhone">确定</el-button>
        </div>
        <div class="login" @click="phoneLogin(1)"><i class="el-icon-back"></i>手机号登录</div>
      </el-form>
      <!--    注册-->
      <el-form ref="registerForm" :model="registerForm" :rules="registerRules" label-width="80px" v-else-if="name==='register'">
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
          <el-button type="danger" class="loginButton" @click="registerByPhone">确定</el-button>
        </div>
      </el-form>
      <!--      修改密码-->
      <el-form ref="forgetForm" :model="forgetForm" :rules="forgetRules" label-width="80px" v-else>
        <el-form-item prop="captcha" label="验证码">
          <el-input v-model="forgetForm.captcha" placeholder="请输入验证码"></el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码">
          <el-input v-model="forgetForm.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <div class="center">
          <el-button type="danger" class="loginButton" @click="forgetByPhone">确定</el-button>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'register',
  props: {
    name: {
      type: String
    }
  },
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
      },
      forgetForm: {
        phone: 15522102778,
        password: '',
        captcha: ''
      },
      forgetRules: {
        captcha: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
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
        this.$http.get(`/cellphone/existence/check?phone=${this.phoneForm.phone}`).then(data => {
          this.$http.get('/captcha/sent', { params: this.phoneForm }).then(() => {
            this.show = false
          })
          if (data.exist !== 1) {
            this.forgetForm.nickname = data.nickname
            this.forgetForm.phone = this.phoneForm.phone
          } else {
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
        this.$http.get('/register/cellphone', { params: this.registerForm }).then(() => {
          this.$message.success('注册成功')
          let t = 3
          setInterval(function () {
            if (t === 0) {
              this.phoneLogin(1)
            } else {
              this.$message.success(`${t}秒钟跳转到登录页面`)
              t--
            }
          }, 1000)
        }).catch(err => {
          console.log(err)
        })
      })
    },
    forgetByPhone () {
      this.$refs.forgetForm.validate((valid) => {
        if (!valid) {
          return this.$message.error('请填写完整信息')
        }
        this.$http.get('/register/cellphone', { params: this.forgetForm }).then(() => {
          this.$message.success('修改密码成功')
          this.phoneLogin(1)
        }).catch(err => {
          console.log(err)
        })
      })
    },
    phoneLogin (value) {
      this.$emit('login', { value: value, title: '手机登录' })
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
    border none
    background-color black
  .loginButton
    width 120px
  .login
    cursor pointer
    color #888888
</style>
