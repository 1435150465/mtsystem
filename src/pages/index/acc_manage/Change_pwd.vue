<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <p>修改密码</p>
      </div>
      <div class="pwd_change_div">
        <p>原密码</p>
        <el-input v-model="old_pwd" show-password placeholder="请输入内容"></el-input>
      </div>
      <div class="pwd_change_div">
        <p>新密码</p>
        <el-input v-model="newPwd" show-password placeholder="请输入内容"></el-input>
      </div>
      <div class="pwd_change_div">
        <p>确认新密码</p>
        <el-input v-model="newPwd_agn" show-password placeholder="请输入内容"></el-input>
      </div>
      <p class="btn_p">
        <el-button type="primary" @click="is_change_pwd">确定</el-button>
        <el-button>重置</el-button>
      </p>
    </el-card>
  </div>
</template>

<script>
import { CAHNGE_PWD_API } from "../../../api/acc_manage";
import { CHECK_OLDPWD } from "../../../api/acc_manage";
export default {
  data() {
    return {
      old_pwd: "",
      newPwd: "",
      newPwd_agn: ""
    };
  },
  methods: {
    is_change_pwd() {
      // 1.获取用户的id
      var id = Number(localStorage.id);
      // 2.如果两次输入的密码不一样，阻止
      if (this.newPwd != this.newPwd_agn) {
        this.$message({
          type: "error",
          message: "两次输入的密码不一样!",
          duration: 1000
        });
        // 3.清空两次密码
        this.newPwd_agn = "";
        this.newPwd = "";
        return 
      }
      // 4.发送axios,验证原始密码是否正确
      CHECK_OLDPWD(id, this.old_pwd).then(res => {
        if (res.data.code == "00") {
          // 发送axios，修改新密码
          CAHNGE_PWD_API(id, this.newPwd).then(res => {
            console.log(res);
            this.$message({
              type: "success",
              message: res.data.msg,
              duration: 1000
            });
            //5. 跳转到登录页面
            setTimeout(() => {
              this.$router.push("/");
            }, 1300);
          });
        } else {
          this.$message({
            type: "error",
            message: "原密码输入错误，请重试!",
            duration: 1000
          });
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.pwd_change_div {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  p {
    width: 120px;
    text-align: right;
    margin-right: 20px;
  }
  .el-input {
    width: 300px;
  }
}
.btn_p {
  text-indent: 50px;
  button {
    margin: 0px 20px;
  }
}
</style>