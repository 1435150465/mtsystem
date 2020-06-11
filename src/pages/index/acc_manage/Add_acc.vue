<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <p>添加账号</p>
      </div>
      <div class="pwd_change_div">
        <p>账号</p>
        <el-input v-model="info.account" placeholder="请输入内容"></el-input>
      </div>
      <div class="pwd_change_div">
        <p>密码</p>
        <el-input v-model="info.password" show-password placeholder="请输入密码"></el-input>
      </div>
      <div class="pwd_change_div">
        <p>用户组</p>
        <el-select v-model="info.userGroup" placeholder="请选择用户组">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <p class="btn_p">
        <el-button type="primary" @click="add_acc">添加</el-button>
        <el-button>重置</el-button>
      </p>
    </el-card>
  </div>
</template>

<script>
import { ADD_ACCOUNT_API } from "../../../api/acc_manage";
export default {
  data() {
    return {
      info: {
        // 账号输入框数据双向绑定
        account: "",
        // 密码输入框数据双向绑定
        password: "",
        // 用户组选项数据双向绑定
        userGroup: ""
      },
      // 用户组下拉框渲染
      options: [
        {
          value: "超级管理员",
          label: "超级管理员"
        },
        {
          value: "普通管理员",
          label: "普通管理员"
        }
      ]
    };
  },
  methods: {
    // 点击添加按钮
    add_acc() {      
      ADD_ACCOUNT_API(this.info.account,this.info.password,this.info.userGroup).then(res=>{
        if(res.data.code == 0){
          // 弹框提醒账号添加成功
           this.$message({
              message: "账号添加成功",
              type: "success", //提示框的类型
              center: true, //提示框文本居中
              duration: 1100, //提示框显示的时间
              offset: 50 //提示框距离顶部的偏移量
            })
            // 跳转后台首页
            setTimeout(()=>{
              this.$router.push('/index/acc_list')
            },1500)
        }else{
           this.$message({
              message: "账户添加失败，请重试",
              type: "error", //提示框的类型
              center: true, //提示框文本居中
              duration: 1100, //提示框显示的时间
              offset: 50 //提示框距离顶部的偏移量
            });
        }
        
      })
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
.el-select {
  width: 300px;
}
</style>