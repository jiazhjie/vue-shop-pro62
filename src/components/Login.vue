<template>
  <div id="login-container">
    <div id="login-box">
      <div id="logo-box">
        <img src="../assets/img/logo.png" alt>
      </div>

      <el-form :rules="loginFormRules" ref="loginFormRef" :model="loginForm">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" v-model="loginForm.password"></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-row>
          <el-col :offset="15">
            <el-button type="primary" @click="login">登录</el-button>
            <el-button type="info" @click="resetForm">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 登录form表单需要的数据对象
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 给每个用户名校验规则
      loginFormRules: {
        username: [
          // required:非空  message:错误提示  trigger:触发校验机制
          { required: true, message: '请输入用户名称', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      }
    }
  },
  methods: {
    login() {
      // 对登录账号信息进行校验
      this.$refs.loginFormRef.validate(async valid => {
        if (valid === true) {
          const { data: res } = await this.$http.post('/login', this.loginForm)
          if (res.meta.status !== 200) {
            return this.$message.error('用户名或密码不存在')
          }
          window.sessionStorage.setItem('token', res.data.token)
          // (校验成功)页面重定向到后台首页(/home)
          this.$router.push('/home')
        }
      })
    },
    // 重置表单
    resetForm() {
      this.$refs.loginFormRef.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
#login-container {
  background-color: #2b4b6b;
  height: 100%;
  overflow: hidden;
  #login-box {
    width: 450px;
    height: 304px;
    background-color: #ffffff;
    border-radius: 4px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .el-form {
      position: absolute;
      bottom: 0;
      width: 100%;
      padding: 20px;
      box-sizing: border-box;
    }
    #logo-box {
      width: 130px;
      height: 130px;
      border: 1px solid#eee;
      border-radius: 50%;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #fff;
      padding: 8px;
      box-shadow: 0 0 10px #eee;
      img {
        width: 130px;
        height: 130px;
        border-radius: 50%;
        background-color: #eee;
      }
    }
  }
}
</style>

