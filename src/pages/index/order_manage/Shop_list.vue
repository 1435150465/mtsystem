<template>
  <div class="shop_list">
    <p>商品列表</p>
    <!-- 商品表格 -->
    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="商品id：">
              <span>{{ props.row.id }}</span>
            </el-form-item>
            <el-form-item label="商品名称：">
              <span>{{ props.row.name }}</span>
            </el-form-item>
            <el-form-item label="所属分类：">
              <span>{{ props.row.category }}</span>
            </el-form-item>
            <el-form-item label="商品价格：">
              <span>{{ props.row.price}}</span>
            </el-form-item>

            <el-form-item label="商品图片：">
              <span>
                <img :src="props.row.imgUrl" />
              </span>
            </el-form-item>
            <el-form-item label="商品评价：">
              <span>{{ props.row.rating }}</span>
            </el-form-item>
            <el-form-item label="商品描述：">
              <span>{{ props.row.goodsDesc }}</span>
            </el-form-item>
            <el-form-item label="创建时间：">
              <span>{{ props.row.ctime }}</span>
            </el-form-item>
            <el-form-item label="商品销量：">
              <span>{{ props.row.sellCount }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column width="200" label="商品名称" prop="name"></el-table-column>
      <el-table-column width="200" label="所属分类" prop="category"></el-table-column>
      <el-table-column width="200" label="商品价格" prop="price"></el-table-column>
      <el-table-column width="200" label="商品图片">
        <template slot-scope="scope">
          <img :src="scope.row.imgUrl" />
        </template>
      </el-table-column>
      <el-table-column label="商品描述" prop="goodsDesc"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" @click="edit_shop(scope.row)">编辑</el-button>
          <el-button type="danger" @click="remove_shop(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 商品分页 -->
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        background
        :current-page="currentPage"
        :page-sizes="[4,8,12,16]"
        :page-size="5"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
    <!-- 点击编辑按钮，弹出模态框 -->
    <el-dialog title="提示" :visible.sync="dialogVisible1" width="30%">
      <!-- 弹出模态框的input -->
      <div>
        <span>分类名字</span>
        <el-input
          v-model="edit.name"
          clearable
          style="width:340px;margin:10px 0px 20px 20px"
          placeholder="请输入分类名称"
        ></el-input>
      </div>
      <div>
        <span>商品分类</span>
        <el-select
          v-model="edit.category"
          style="width:340px;margin:10px 0px 20px 20px"
          placeholder="请选择"
        >
          <el-option
            v-for="(item,index) in shop_class_selct"
            :key="index"
            :label="item.cateName"
            :value="item.cateName"
          ></el-option>
        </el-select>
      </div>
      <div>
        <span>商品价格</span>
        <el-input
          v-model="edit.price"
          clearable
          style="width:340px;margin:10px 0px 20px 20px"
          placeholder="请输入商品价格"
        ></el-input>
      </div>
      <div class="onload_img_div">
        <!-- 商品图片 -->
        <span class="title">商品图片</span>
        <el-upload
          class="avatar-uploader"
          action="http://127.0.0.1:5000/goods/goods_img_upload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="edit.imgUrl" :src="edit.imgUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </div>
      <div class="shop_disc">
        <span>商品描述</span>
        <el-input
          type="textarea"
          style="width:340px;margin:10px 0px 20px 20px"
          :rows="2"
          v-model="edit.goodsDesc"
        ></el-input>
      </div>

      <!-- 取消和确定按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible1 = false">取 消</el-button>
        <el-button type="primary" @click="sure_change_btn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  GET_SHOP_LIST_API, //获取商品列表
  GOODS_DEL_API, //删除商品
  GET_ALLSHOP_API, //获取所有商品分类
  CHANGE_GOODS_API //改变商品信息
} from "@/api/groods_manage";
export default {
  data() {
    return {
      // 需要渲染的数据
      tableData: [],
      //   默认显示当前页
      currentPage: 1,
      pageSize: 4,
      // 总页数
      total: 0,
      // 编辑模态框的状态
      dialogVisible1: false,
      // 获取所有商品的分类数组
      shop_class_selct: [],

      // 编辑数据绑定
      edit: {
        name: "",
        category: "",
        price: "",
        goodsDesc: "",
        imgUrl: ""
      },
      // 上传图片
      load_urlimg: ""
    };
  },
  methods: {
    // 改变分页，每页显示的条数
    handleSizeChange(val) {
      // 改变页数
      this.pageSize = val;
      // 发送axious
      this.sendAxios();
    },
    // 改变当前页
    handleCurrentChange(val) {
      // 当前页页数
      this.currentPage = val;
      // 发送axious
      this.sendAxios();
    },
    // 封装发送axious函数
    sendAxios() {
      GET_SHOP_LIST_API(this.currentPage, this.pageSize).then(res => {
        for (let v of res.data.data) {
          v.imgUrl = "http://127.0.0.1:5000/upload/imgs/goods_img/" + v.imgUrl;
        }
        this.total = res.data.total;
        // 将数据绑定在data上
        this.tableData = res.data.data;
      });
    },
    // 删除按钮函数
    remove_shop(row) {
      // 弹框提示用户
      this.$confirm("您确定删除该账号信息吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          //用户点击确定执行 发送axios
          GOODS_DEL_API(row.id).then(res => {
            if (res.data.code == 0) {
              //删除成功
              this.$message({
                type: "success",
                message: "删除成功!",
                duration: 1000
              });
              // 发送ajax到后台，重新渲染数据
              this.sendAxios();
            } else {
              //删除失败
              this.$message({
                type: "error",
                message: "删除失败，请重试!",
                duration: 1000
              });
            }
          });
        })
        .catch(() => {
          //用户点击取消执行
          this.$message({
            type: "info",
            message: "已取消删除"
          });
          return false;
        });
    },
    // 编辑按钮函数
    edit_shop(row) {
      this.dialogVisible1 = true;
      this.edit = JSON.parse(JSON.stringify(row));
    },
    // 确定编辑修改函数
    sure_change_btn() {
      // 获取数据
      // console.log(this.edit); //上传的文字信息
      console.log(this.load_urlimg); //上传的图片文件名
      // name, category,price,imgUrl,goodsDesc,id
      let { name, category, price, goodsDesc, id } = this.edit;

      // 如果用户没有其他的修改，则等于当前的图片路径
      if(!this.load_urlimg){
       this.load_urlimg =  this.edit.imgUrl.replace('http://127.0.0.1:5000/upload/imgs/goods_img/','')
      } 
      //  this.load_urlimg =  'http://127.0.0.1:5000/upload/imgs/goods_img/' +   this.load_urlimg
      CHANGE_GOODS_API(
        name,
        category,
        price,
        this.load_urlimg,
        goodsDesc,
        id
      ).then(res => {
        console.log(res);
        if (res.data.code == 0) {
          this.sendAxios();
          this.$message({
            message: "修改成功",
            type: "success", //提示框的类型
            center: true, //提示框文本居中
            duration: 600, //提示框显示的时间
            offset: 50 //提示框距离顶部的偏移量
          });
          setTimeout(()=>{
            this.dialogVisible1=false
          },800)
        } else {
          this.$message({
            message: "修改失败，请重试",
            type: "error", //提示框的类型
            center: true, //提示框文本居中
            duration: 800, //提示框显示的时间
            offset: 50 //提示框距离顶部的偏移量
          });
        }
      });
    },
    // 商品图片上传成功后回调
    handleAvatarSuccess(res, file) {
      this.load_urlimg = res.imgUrl;
      // 设置图片上传成功后显示的路径
      this.edit.imgUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload() {}
  },
  // 钩子函数
  created() {
    this.sendAxios();
    // 发送请求获取全部商品分类
    GET_ALLSHOP_API().then(res => {
      this.shop_class_selct = res.data.categories;
    });
  }
};
</script>

<style lang="less" scoped>
.shop_list {
  p {
    padding-top: 10px;
    padding-bottom: 10px;
    line-height: 30px;
    background: #fff;
    text-indent: 30px;
    font-size: 18px;
    border-bottom: 1px solid rgb(240, 224, 245);
  }
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
  img {
    width: 60px;
    height: 60px;
    margin-right: 15px;
  }
  .onload_img_div,
  .shop_disc {
    display: flex;
    img {
      margin-left: 20px;
    }
  }
}
</style>
<style lang="less">
</style>
 