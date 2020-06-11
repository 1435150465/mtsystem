<template>
  <div class="login_div">
    <div class="login_box">
      <el-input
        placeholder="请输入用户名"
        clearable
        prefix-icon="el-icon-user-solid"
        v-model="acc_input"
        class="acc_input"
      ></el-input>
      <el-input
        placeholder="请输入密码"
        v-model="pwd_input"
        show-password
        prefix-icon="el-icon-s-goods"
        class="pwd_input"
      ></el-input>
      <el-button @click="is_login" class="login_btn" type="primary">登录</el-button>
    </div>
  </div>
</template>

<script>
import { LOGIN_API } from "../api/acc_manage";
export default {
  data() {
    return {
      // 防止用户登录误操作
      login_flag: false,
      //   密码框数据
      pwd_input: "",
      //   用户名框数据
      acc_input: ""
    };
  },
  methods: {
    is_login() {
      // 1.如果登录状态为false，拦截
      if (this.login_flag) return;

      // 2.否则的话发送axios
      LOGIN_API(this.acc_input, this.pwd_input).then(res => {        
        if (res.data.code == 0) {
          //  将当前登录的用户id保存在本地存储
          localStorage.id=res.data.id
          // 保存用户的token值
          localStorage.token = res.data.token;
          // 保存用户的用户名
          localStorage.username = this.acc_input;
          // 保存用户当前的权限身份
          localStorage.role = res.data.role
          // 2.1显示登录提示框
          this.$message({
            message: "恭喜你，登录成功",
            type: "success", //提示框的类型
            center: true, //提示框文本居中
            duration: 1100, //提示框显示的时间
            offset: 50 //提示框距离顶部的偏移量
          });
          // 2.2延时跳转
          setTimeout(() => {
            this.$router.push("/index/home");
          }, 1300);
        } else {
          this.$message({
            message: "用户名或密码错误，请重试",
            type: "error", //提示框的类型
            center: true, //提示框文本居中
            duration: 1100, //提示框显示的时间
            offset: 50 //提示框距离顶部的偏移量
          });
        }
      });
      // 3.将登录标杆设置为true
      this.login_flag = true;
      // 4.延时器的主要原因是防止用户的频繁操作
      setTimeout(() => {
        this.login_flag = false;
      }, 3000);
    }
  }
};
</script>

<style lang="less" >
.login_div {
  width: 100%;
  height: 100%;
  background: rgb(45, 58, 75);
  .login_box {
    width: 410px;
    height: 300px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -40%);
    .acc_input {
      margin-bottom: 20px;
      margin-top: 10px;
    }
    .acc_input::before,
    .pwd_input::before {
      position: absolute;
      top: 9px;
      left: 8px;
      font-size: 20px;
    }

    .login_btn {
      width: 100%;
      margin-top: 20px;
      background: rgb(64, 158, 255);
    }
    .el-input__inner {
      padding: 0px 30px;
      background: transparent;
    }
  }
}
</style>