<template>
  <div>
    <el-row>
      <el-col :span="10">
        <div class="login-form-layout">
          <el-form autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">
            <div style="text-align: left">
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
                v-model="loginForm.username"
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
                @keyup.enter.native="handleLogin"
                v-model="loginForm.password"
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
            <el-form-item style="margin-bottom: 60px; text-align: center">
              <el-button
                style="width: 100%; background-color: #e6a23c"
                type="primary"
                :loading="loading"
                @click.native.prevent="handleLogin"
              >
                登录
              </el-button>
              <!-- <el-button style="width: 45%" type="primary" @click.native.prevent="handleTry">
            获取体验账号
          </el-button> -->
              <div>
                还没有账户?
                <span class="color-main" style="cursor: pointer" @click="register">去注册</span>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
      <el-col :span="14">
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
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { isvalidUsername } from '@/utils/validate'
import { setSupport, getSupport, setCookie, getCookie } from '@/utils/support'
import login_center_bg from '@/assets/images/login_center_bg.png'

export default {
  name: 'login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!isvalidUsername(value)) {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }
    const validatePass = (rule, value, callback) => {
      if (value.length < 3) {
        callback(new Error('密码不能小于3位'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: '',
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePass }],
      },
      loading: false,
      pwdType: 'password',
      login_center_bg,
      dialogVisible: false,
      supportDialogVisible: false,
    }
  },
  created() {
    this.loginForm.username = getCookie('username')
    this.loginForm.password = getCookie('password')
    if (this.loginForm.username === undefined || this.loginForm.username == null || this.loginForm.username === '') {
      this.loginForm.username = 'admin'
    }
    if (this.loginForm.password === undefined || this.loginForm.password == null) {
      this.loginForm.password = ''
    }
  },
  methods: {
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },

    register() {
      console.log('去注册')
      this.$router.push({ path: '/register' })
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          // let isSupport = getSupport();
          // if(isSupport===undefined||isSupport==null){
          //   this.dialogVisible =true;
          //   return;
          // }
          this.loading = true
          this.$store
            .dispatch('Login', this.loginForm)
            .then(() => {
              this.loading = false
              setCookie('username', this.loginForm.username, 15)
              setCookie('password', this.loginForm.password, 15)
              this.$router.push({ path: '/' })
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('参数验证不合法！')
          return false
        }
      })
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
  },
}
</script>

<style scoped>
.login-form-layout {
  margin: 30vh auto;
  width: 45%;
}

.login-title {
  text-align: left;
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
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
}
.page-header::before {
  content: ''; /* 伪元素内容为空 */
  position: absolute; /* 绝对定位 */
  top: 0; /* 位于顶部 */
  left: 0; /* 位于左侧 */
  width: 0; /* 初始宽度为0 */
  height: 100vh; /* 初始高度为0 */
  border-left: 0px solid transparent; /* 左边的边框透明 */
  border-right: 250px solid transparent; /* 右边的边框透明 */
  border-top: 100vh solid #fff; /* 底部的边框，可以设置为半透明色 */
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
.mask::before {
  content: ''; /* 伪元素内容为空 */
  position: absolute; /* 绝对定位 */
  top: 0; /* 位于顶部 */
  left: 0; /* 位于左侧 */
  width: 0; /* 初始宽度为0 */
  height: 100vh; /* 初始高度为0 */
  border-left: 0px solid transparent; /* 左边的边框透明 */
  border-right: 250px solid transparent; /* 右边的边框透明 */
  border-top: 100vh solid #fff; /* 底部的边框，可以设置为半透明色 */
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
