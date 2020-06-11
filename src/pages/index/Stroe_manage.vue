<template>
  <div class="stroe_manage">
    <el-row>
      <el-col :span="12">
        <!-- 店铺名称 -->
        <div class="distribution_p">
          <p>店铺名称</p>
          <el-input :disabled="edit_flag" v-model="shops_info.name" placeholder="请输入内容"></el-input>
        </div>
        <!-- 商品描述： -->
        <div class="disc_p">
          <p>商品描述</p>
          <el-input :disabled="edit_flag" type="textarea" v-model="shops_info.bulletin"></el-input>
        </div>
        <!-- 配送描述等 -->
        <div class="distribution_p">
          <p>配送费</p>
          <el-input :disabled="edit_flag" v-model="shops_info.deliveryPrice" placeholder="请输入内容"></el-input>
        </div>
        <div class="distribution_p">
          <p>送达时间</p>
          <el-input :disabled="edit_flag" v-model="shops_info.deliveryTime" placeholder="请输入内容"></el-input>
        </div>
        <div class="distribution_p">
          <p>配送描述</p>
          <el-input :disabled="edit_flag" v-model="shops_info.description" placeholder="请输入内容"></el-input>
        </div>
        <div class="distribution_p">
          <p>店铺评分</p>
          <el-input :disabled="edit_flag" v-model="shops_info.score" placeholder="请输入内容"></el-input>
        </div>
        <div class="distribution_p">
          <p>销量</p>
          <el-input :disabled="edit_flag" v-model="shops_info.sellCount" placeholder="请输入内容"></el-input>
        </div>
        <!-- 营业时间 -->
        <div class="distribution_p">
          <p>营业时间</p>
          <el-time-picker
            :disabled="edit_flag"
            is-range
            :default-time ="['00:00:00','23:59:59']"
            value-format="yyyy-MM-dd HH:mm:ss"
            v-model="shops_info.date"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围"
          ></el-time-picker>
        </div>
      </el-col>
      <el-col :span="12">
        <!-- 店铺头像 -->
        <div class="shop_title distribution_p">
          <p style="margin-right:11px">店铺头像</p>
          <el-upload
            class="avatar-uploader"
            action="http://127.0.0.1:5000/shop/upload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :disabled="edit_flag"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </div>

        <!-- 店铺图片 -->
        <div class="shop_phone_div distribution_p">
          <p class="phone_p">店铺照片</p>
          <div>
            <img v-for="item in shops_info.pics" :key="item.id" :src="item" alt />
            <el-upload
              action="http://127.0.0.1:5000/shop/upload"
              list-type="picture-card"
              :on-remove="handleRemove"
              :on-success="shop_phone_success"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
          </div>
        </div>

        <!-- 多选框 -->
        <div class="distribution_p">
          <p class="active_p">活动</p>
          <el-checkbox-group v-model="checked_goods" :disabled="edit_flag">
            <el-checkbox v-for="item in goods_info" :label="item" :key="item">{{item}}</el-checkbox>
          </el-checkbox-group>
        </div>
        <!-- 底部操作按钮 -->
        <div class="bottom_btn">
          <el-button plain v-if="edit_flag" @click="edit_goods_info">修改</el-button>
          <el-button plain type="success" v-else @click="edit_goods_info">取消</el-button>
          <el-button type="primary" plain @click="save_edit_btn">保存</el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  SHOP_INFO_API, //商品信息修改
  SHOP_EDIT_API //店铺内容修改
} from "../../api/groods_manage";

export default {
  data() {
    return {
      // 店铺信息
      shops_info: {
        name: "", //店铺名称
        bulletin: "", //公告
        avatar: "", //店铺头像
        pics: "", //店铺图片
        date: "", //营业时间
        minPrice: "", //起送价格
        deliveryPrice: "", //配送费
        deliveryTime: "", //送达时间
        description: "", //描述
        score: "", //评分
        sellCount: "", //销量
        supports: "" //活动
      },
      // 图片上传标杆
      upload_flag: true,
      // 默认选中的商品
      checked_goods: [],
      // 商品列表
      goods_info: [
        "在线支付满28立减5元",
        "VC无限橙果汁全场8折",
        "单人精彩套餐",
        "特价烤翅限量抢购",
        "烧仙草奶茶买一赠一"
      ],
      // 编辑标杆
      edit_flag: true,
      // 店铺图片上传数组
      load_img_url: [],
      // 店铺头像渲染
      imageUrl: "",
      // 店铺头像上传地址
      load_shop_home_img: "",
      arr:["1970-01-01 08:00:00", "1970-01-01 22:30:00",]
    };
  },
  methods: {
    // 店铺图片上传成功后
    handleAvatarSuccess(res, file) {
      // 将需要上传的商铺照片地址保存
      this.load_shop_home_img = res.imgUrl;
      // 默认加载上传完成后的图片
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    // 判断是否为指定格式
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
    // 点击编辑按钮，切换页面状态为可编辑状态
    edit_goods_info() {
      this.edit_flag = !this.edit_flag;
    },
    // 店铺图片上传成功触发
    shop_phone_success(res) {
      // 将需要上传的img图片保存在上传图片数组
      this.load_img_url.push(res.imgUrl);
      console.log(this.load_img_url);
    },
    // 用户删除店铺上传图片触发
    handleRemove(filet) {
      // 保存当前的索引
      var index = this.load_img_url.indexOf(filet.response.imgUrl);
      // 删除在上传数组对应的索引值
      this.load_img_url.splice(index, 1);
    },
    // 用户点击保存按钮
    save_edit_btn() {
      console.log(this.checked_goods);//多选框
      
      console.log(this.shops_info);
      let {
        id,
        name,
        bulletin,
        avatar,
        deliveryPrice,
        deliveryTime,
        description,
        score,
        sellCount,
        supports,
        date,
        pics
      } = this.shops_info;
      console.log(
        id,
        name,
        bulletin,
        avatar,
        deliveryPrice,
        deliveryTime,
        description,
        score,
        sellCount,
        supports,
        date,
        pics
      );
    SHOP_EDIT_API(id,name,bulletin,avatar,deliveryPrice,description,score,sellCount,supports,JSON.stringify(date),pics).then(res=>{
      console.log(res);
      
    })

    }
  },
  created() {
    // 发送请求渲染页面
    SHOP_INFO_API().then(res => {
      this.imageUrl =
        "http://127.0.0.1:5000/upload/shop/" + res.data.data.avatar;
      res.data.data.pics.forEach((v, i, arr) => {
        arr[i] = "http://127.0.0.1:5000/upload/shop/" + v;
      });
      this.shops_info = res.data.data;
      // 默认选中的商品
      this.checked_goods = this.shops_info.supports;
    });
  }
};
</script>

<style lang="less" scoped>
.stroe_manage {
  background: #fff;
  padding: 20px;
  //   店铺头像
  .shop_title {
    display: flex;
    margin: 20px 0px;

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
      border: 1px dashed #ccc;
      margin-left: 12px;
    }
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
  }
  .shop_phone_div {
    display: flex;
  }
  //   店铺描述
  .disc_p {
    display: flex;
    p {
      margin: 0px 13px 0px 20px;
      width: 80px;
      text-align: right;
    }
  }
  //   配送费
  .distribution_p {
    padding: 20px 10px;
    display: flex;
    align-items: center;
    justify-content: flex-start;

    p {
      width: 80px;
      text-align: right;
      &.active_p {
        align-self: flex-start;
      }
      &.phone_p {
        margin-right: 22px;
      }
    }
    .el-input {
      width: 280px;
      margin-left: 20px;
    }
    .el-checkbox-group {
      margin-left: 15px;
      width: 500px;
      .el-checkbox {
        width: 200px;
        margin-bottom: 10px;
      }
    }
    .el-input__inner {
      margin-left: 15px;
    }
  }
}
.stroe_manage .shop_title .avatar[data-v-9092e8c4] {
  width: 60px;
  height: 60px;
}
.stroe_manage .distribution_p[data-v-9092e8c4] {
  padding: 15px;
}
// 店铺头像框
.stroe_manage .shop_title .avatar-uploader-icon[data-v-9092e8c4] {
  width: 80px;
  height: 80px;
  line-height: 80px;
}
.bottom_btn {
  padding-left: 320px;
  padding-top: 40px;
  .el-button {
    box-shadow: 4px 4px 2px #ccc;
    margin-right: 20px;
    &:hover {
      transition: 0.2s;
      transform: translate(2px, 2px);
      box-shadow: 6px 6px 4px #ccc;
    }
  }
}
</style>
<style lang="less" >
.stroe_manage {
  .el-upload--picture-card {
    width: 80px;
    height: 80px;
    line-height: 80px;
  }
  // 店铺照片框
  .el-upload-list--picture-card .el-upload-list__item {
    width: 80px;
    height: 80px;
  }
}
img {
  width: 80px;
  height: 80px;
  margin-right: 10px;
  margin-bottom: 10px;
}
.el-textarea__inner {
  height: 120px;
}
</style>