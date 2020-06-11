<template>
  <el-card class="box-card Shop_add">
    <!-- 头部 -->
    <div slot="header" class="clearfix">
      <span>商品添加</span>
    </div>
    <div class="text item">
      <!-- 商品名称 -->
      <p>
        <span class="title">商品名称</span>
        <el-input v-model="formInline.name" style="width:300px" placeholder="请输入商品名称"></el-input>
      </p>
      <!-- 商品分类 -->
      <p>
        <span class="title">商品分类</span>
        <el-select v-model="formInline.category" placeholder="请选择">
          <el-option
            v-for="(item,index) in shop_class_selct"
            :key="index"
            :label="item.cateName"
            :value="item.cateName"
          ></el-option>
        </el-select>
      </p>
      <!-- 商品价格 -->
      <p>
        <span class="title">商品价格：</span>
        <el-input-number v-model="formInline.price" :min="1" label="商品价格"></el-input-number>
      </p>
      <!-- 商品图片 -->
      <p class="img_p">
        <span class="title">商品图片：</span>
        <el-upload
          class="avatar-uploader"
          action="http://127.0.0.1:5000/goods/goods_img_upload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </p>
      <!-- 商品描述 -->
      <p class="disc_p">
        <span class="title">商品描述</span>
        <el-input type="textarea" v-model="formInline.disc"></el-input>
      </p>
    </div>
    <!-- 添加商品 -->
    <p class="btn_p">
      <el-button type="primary" @click="add_goods_btn">添加商品</el-button>
    </p>
  </el-card>
</template>

<script>
// 获取所有商品分类
import {
  GET_ALLSHOP_API, //获取所有商品分类
  GOODS_ADD_API //添加商品
} from "@/api/groods_manage";
export default {
  data() {
    return {
      // 商品分类下拉框内容
      shop_class_selct: [],
      // 上传的商品值
      formInline: {
        name: "", // 商品名称
        price: 1, //商品价格
        category: "", //商品分类
        disc: "" //商品描述
      },
      //   当前图片显示图片的路径
      imageUrl: "",
      // 上传图片地址
      upload_img: ""
    };
  },
  methods: {
    // 商品图片上传成功后出发
    handleAvatarSuccess(res, file) {
      // 设置需要上传的图片文件名
      this.upload_img = res.imgUrl;
      // 设置图片上传成功后显示的路径
      this.imageUrl = URL.createObjectURL(file.raw);
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
    // 添加商品按钮
    add_goods_btn() {
      // 解构当前输入的对象的值
      let { name, price, category, disc } = this.formInline;
      GOODS_ADD_API(name, category, price, this.upload_img, disc).then(res => {
        if (res.data.code == 0) {
          this.$message({
            message: "添加成功",
            type: "success", //提示框的类型
            center: true, //提示框文本居中
            duration: 600, //提示框显示的时间
          });
          setTimeout(() => {
            this.$router.push("/index/shop_list");
          },600);
        } else {
          this.$message({
            message: "添加成功",
            type: "success", //提示框的类型
            center: true, //提示框文本居中
            duration: 600, //提示框显示的时间
          });
        }
      });
    }
  },
  created() {
    // 发送请求获取全部商品分类
    GET_ALLSHOP_API().then(res => {
      this.shop_class_selct = res.data.categories;
    });
  }
};
</script>

<style lang="less" scoped>
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
.el-icon-plus {
  border: 1px dashed #ccc;
}
.img_p {
  padding: 20px 0px;
  display: flex;
}
.disc_p {
  display: flex;
}
.btn_p {
  margin-top: 20px;
  text-indent: 72px;
}
// 本页总样式
.el-card {
  .text {
    // 每个输入框的一整行
    > p {
      margin: 20px 0px;
      // 每个输入框前面的文字样式
      .title {
        font-size: 14px;
        margin-right: 12px;
        color: #606266;
        display: inline-block;
        width: 80px;
      }
    }
  }
}
</style>
<style lang="less">
.Shop_add {
  .el-textarea__inner {
    width: 400px;
    height: 80px;
  }
}
</style>