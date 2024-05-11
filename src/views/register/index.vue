<template>
  <div>
    <div
      class="page-header align-items-start min-vh-50 pt-5 pb-11 m-3 border-radius-lg"
      style="
        background-image: url('https://raw.githubusercontent.com/creativetimofficial/public-assets/master/argon-dashboard-pro/assets/img/signup-cover.jpg');
        background-position: top;
      "
    >
      <span class="mask bg-gradient-dark opacity-6"></span>

      <div class="container">
        <h1>Welcome!</h1>
        <p>Use these awesome forms to login or create new account in your project for free.</p>
      </div>
    </div>

    <el-card class="login-form-layout">
      <el-form autoComplete="on" :model="registerForm" :rules="loginRules" ref="registerForm" label-position="left">
        <div style="text-align: center">
          <img
            src="https://vspace-1259276655.cos.ap-shanghai.myqcloud.com/vcross/public/logoHome.png"
            style="width: 200px"
          />
        </div>
        <h2 class="login-title color-main">IDB 国际惠买</h2>
        <el-form-item prop="username">
          <el-input
            name="username"
            type="text"
            v-model="registerForm.username"
            autoComplete="on"
            placeholder="请输入用户名"
          >
            <span slot="prefix">
              <svg-icon icon-class="user" class="color-main"></svg-icon>
            </span>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            name="password"
            :type="pwdType"
            v-model="registerForm.password"
            autoComplete="on"
            placeholder="请输入密码"
          >
            <span slot="prefix">
              <svg-icon icon-class="password" class="color-main"></svg-icon>
            </span>
            <span slot="suffix" @click="showPwd">
              <svg-icon icon-class="eye" class="color-main"></svg-icon>
            </span>
          </el-input>
        </el-form-item>
        <el-form-item prop="confirm_password">
          <el-input
            name="confirm_password"
            :type="pwdType"
            v-model="registerForm.confirm_password"
            autoComplete="on"
            placeholder="请输入确认密码"
          >
            <span slot="prefix">
              <svg-icon icon-class="password" class="color-main"></svg-icon>
            </span>
          </el-input>
        </el-form-item>
        <el-form-item prop="email">
          <el-input name="email" type="text" v-model="registerForm.email" autoComplete="on" placeholder="请输入邮箱">
            <span slot="prefix">
              <svg-icon icon-class="password" class="color-main"></svg-icon>
            </span>
          </el-input>
        </el-form-item>
        <el-form-item prop="captcha">
          <el-row :gutter="10">
            <el-col :span="18">
              <el-input
                name="captcha"
                type="text"
                v-model="registerForm.captcha"
                autoComplete="on"
                placeholder="请输入验证码"
              >
                <span slot="prefix">
                  <svg-icon icon-class="password" class="color-main"></svg-icon>
                </span>
              </el-input>
            </el-col>
            <el-col :span="4">
              <el-button type="primary" style="background-color: #e6a23c" @click="handleGetCode">发送验证码</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item style="margin-bottom: 60px; text-align: center">
          <el-button
            style="width: 100%; background-color: #e6a23c"
            type="primary"
            :loading="loading"
            @click.native.prevent="handleRegister"
          >
            注册
          </el-button>
          <!-- <el-button style="width: 45%" type="primary" @click.native.prevent="handleTry">
            获取体验账号
          </el-button> -->
          <div>
            已有账户?
            <a class="color-main" @click="pushLogin">去登录</a>
          </div>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { isvalidUsername } from '@/utils/validate'
import { setSupport, getSupport, setCookie, getCookie } from '@/utils/support'
import login_center_bg from '@/assets/images/login_center_bg.png'
import { register, getCode } from '@/api/register'
import { valueAxis } from 'echarts/lib/theme/dark'
export default {
  name: 'login',
  data() {
    const validatePass = (rule, value, callback) => {
      if (value.length < 3) {
        callback(new Error('密码不能小于3位'))
      } else {
        callback()
      }
    }
    const validateComfirmPass = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入确认密码'))
      } else if (value !== this.registerForm.password) {
        callback(new Error('密码不一致'))
      } else {
        callback()
      }
    }
    return {
      registerForm: {
        username: '',
        password: '',
        email: '',
        confirm_password: '',
      },
      loginRules: {
        password: [{ required: true, trigger: 'blur', validator: validatePass }],
        confirm_password: [{ required: true, trigger: 'blur', validator: validateComfirmPass }],
        email: [{ required: true, trigger: 'blur', message: '请输入邮箱' }],
        username: [{ required: true, trigger: 'blur', message: '请输入用户名' }],
        captcha: [{ required: true, trigger: 'blur', message: '请输入验证码' }],
      },
      loading: false,
      pwdType: 'password',
      login_center_bg,
      dialogVisible: false,
      supportDialogVisible: false,
      d: [
        {
          filed: '颜色',
          enFiled: 'color',
          values: [
            {
              zh: '黄色',
              en: 'yellow',
            },
            {
              zh: '蓝色',
              en: 'blue',
            },
            {
              zh: '红色',
              en: 'red',
            },
          ],
        },
        {
          filed: '型号',
          enFiled: 'type',
          values: [
            {
              zh: 'S',
              en: 'S',
            },
            {
              zh: 'M',
              en: 'M',
            },
            {
              zh: 'L',
              en: 'L',
            },
          ],
        },
      ],
    }
  },
  created() {},
  methods: {
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },

    handleRegister() {
      this.$refs.registerForm.validate((valid) => {
        if (valid) {
          this.loading = true
          this.registerForm.role = 'supplier'
          register(this.registerForm).then((res) => {
            if (res.code) {
              this.loading = false
              this.pushLogin()
            }
          })
        } else {
          console.log('参数验证不合法！')
          return false
        }
      })
    },

    pushLogin() {
      this.$router.push({ path: '/login' })
    },
    handleTry() {
      this.dialogVisible = true
    },
    dialogConfirm() {
      this.dialogVisible = false
      setSupport(true)
    },
    dialogCancel() {
      this.dialogVisible = false
      setSupport(false)
    },
    handleGetCode() {
      if (!this.registerForm.email) {
        this.$message({
          showClose: true,
          message: '邮箱没有填',
          type: 'error',
        })
        return
      }
      getCode({ email: this.registerForm.email }).then((res) => {
        if (res.success) {
          this.$message({
            showClose: true,
            message: '验证码已发送',
            type: 'success',
          })
        }
      })
    },
  },
}
</script>

<style scoped>
.login-form-layout {
  position: fixed;
  left: 38%;
  top: 20vh;
  width: 24%;
  border-top: 10px solid #e6a23c;
  z-index: 9999;
}

.login-title {
  text-align: center;
}

.login-center-layout {
  background: #e6a23c;
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
  margin-top: 200px;
}
.page-header {
  padding: 0;
  position: relative;
  overflow: hidden;
  display: flex;
  padding: 50px 20px;
  background-size: cover;
  justify-content: center;
  width: 100%;
  height: 50vh;
}
.mask {
  position: absolute;
  background-position: 50%;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.8;
}
.bg-gradient-dark {
  background-image: linear-gradient(310deg, #212229, #212529);
}
.container {
  color: #fff;
  z-index: 999;
  text-align: center;
}
.el-button--primary {
  border-color: #e6a23c;
}
</style>
