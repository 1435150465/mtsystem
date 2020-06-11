<template>
  <el-card class="box-card">
    <!-- 内容头部 -->
    <div slot="header" class="clearfix">
      <span>管理员信息</span>
    </div>
    <!-- 渲染主要区域 -->
    <p class="adim_p">管理员id：{{infomation.id}}</p>
    <p class="adim_p">账号：{{infomation.account}}</p>
    <p class="adim_p">用户组：{{infomation.userGroup}}</p>
    <p class="adim_p">创建时间：{{infomation.ctime}}</p>
    <!-- 上传头像区域 -->
    <div class="demo-image">
      <div class="block">
        <span>管理员头像：</span>
        <el-upload
          class="avatar-uploader"
          action="http://127.0.0.1:5000/users/avatar_upload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :data="getid()"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </div>
    </div>
  </el-card>
</template>

<script>
import { PERSONAL_API } from "../../api/acc_manage";
export default {
  data() {
    return {
      // 渲染数据数组
      infomation: [],
      // 图片显示地址
      imageUrl: ""
    };
  },
  // 钩子函数
  created() {
    // 请求个人中心信息
    PERSONAL_API(localStorage.id).then(res => {      
      // 渲染当前页面
      this.infomation = res.data.accountInfo;
      this.imageUrl = res.data.accountInfo.imgUrl;
    });
  },
  methods: {
    // 上传图片触发函数
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      // 操作原生更换头像
      document.querySelector('#head_photo').src = this.imageUrl
        
      
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    // 删除图片id
    getid() {
      var id = localStorage.id  
      return { id };
    }
  }
};
</script>

<style lang="less" scoped>
.adim_p {
  height: 50px;
  line-height: 50px;
  border-bottom: 1px solid #eee;
}
.block {
  display: flex;
  align-items: center;
  padding-top: 10px;
  span {
    margin-right: 20px;
  }
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>