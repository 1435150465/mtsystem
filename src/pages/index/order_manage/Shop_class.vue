<template>
  <el-card class="box-card">
    <!-- 顶部标题和添加分类按钮 -->
    <div slot="header" class="clearfix">
      <span>商品分类</span>
      <el-button
        style="float: right; padding: 7px 0;margin-right:20px "
        @click="dialogVisible = true"
        type="primary"
      >添加分类</el-button>
    </div>
    <!-- table表格渲染数据 -->
    <el-table :data="tableData" style="width: 100%">
      <el-table-column label="序号" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{scope.$index}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="cateName" label="分类名称" width="240"></el-table-column>
      <el-table-column prop="state" label="是否启用" width="240">
        <template slot-scope="scope">
          <el-switch disabled  v-model="scope.row.state" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete( scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页默认页数 -->
    <div class="block">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page.sync="page.currentPage"
        :page-size="page.pageSize"
        layout="total,   prev, pager, next, jumper"
        :total="page.total"
      ></el-pagination>
    </div>
    <!-- 添加商品按钮 -->
    <el-dialog title="添加分类" :visible.sync="dialogVisible" width="30%">
      <p>
        <span>分类名称</span>
        <!-- 商品分类的input框 -->
        <el-input v-model="add_shopclass" style="width:80%;margin:20px 10px;" placeholder="分类名称"></el-input>
      </p>
      <!-- 商品分类的开关 -->
      <span class="use_text_span">是否启用</span>
      <el-switch v-model="switch_status" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
      <!-- 用户可以选择确定和取消按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sure_addclass">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 用户点击编辑，弹出模态框 -->
    <el-dialog title="提示" :visible.sync="dialogVisible1" width="30%" :modal="false">
      <!-- 弹出模态框的input -->
      <div>
        <span>分类名称</span>
        <el-input
          v-model="cate_name"
          clearable
          style="width:340px;margin:10px 0px 20px 20px"
          placeholder="请输入分类名称"
        ></el-input>
      </div>
      <!-- 是否启用 -->
      <div>
        <span>是否启用</span>
        <el-switch
          v-model="is_enable"
          active-color="#13ce66"
          inactive-color="#ff4949"
          style="margin-left:20px"
        ></el-switch>
      </div>
      <!-- 取消和确定按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible1 = false">取 消</el-button>
        <el-button type="primary" @click="sure_change_btn">确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
// 添加商品分类
import { ADD_SHOPCLASS_API } from "../../../api/groods_manage";
// 获取商品分类
import {
  GET_SHOPCLASS_API, //获取商品分类
  DEL_SHOPCLASS_API, //删除商品分类
  EDIT_CATE_API //修改分类
} from "../../../api/groods_manage";

export default {
  data() {
    return {
      // 表格渲染数据
      tableData: [],
      // page分页
      page: {
        // 分页默认页数
        currentPage: 1,
        // 默认显示多少条
        pageSize: 5,
        // 显示总共几条数据
        total: 0
      },
      // 用户点击添加商品，弹出模态框，默认隐藏
      dialogVisible: false,
      // 用户输入需要添加的类
      add_shopclass: "",
      // 用户添加商品类是否启用开关
      switch_status: true,
      // 用户点击获取编辑，弹出input框的值cate_name
      cate_name: "",
      // 用户点击编辑按钮，弹出模态框的状态
      dialogVisible1: false,
      // 用户点击编辑按钮，弹出是否启用的状态
      is_enable: ""
    };
  },
  methods: {
    // 用户点击翻页
    handleCurrentChange(val) {
      this.page.currentPage = val;
      // 调用渲染table的函数
      this.gettable_data();
    },

    // 用户点击编辑，弹出编辑模态框
    handleEdit(index, row) {
      // 弹出修改内容的模态框
      this.dialogVisible1 = true;
      // 将本行的分类名称显示在input里面
      this.cate_name = row.cateName;
      // 将本行的是否启用渲染到模态框里面
      this.is_enable = row.state;
      // 将当前的id值保存在全局(以便以点击确定按钮，传参)
      this.cate_id = row.id;
    },
    // 用户点击确认修改内容按钮
    sure_change_btn() {
      // 发送修改内容的axious
      // this.cate_id 需要修改的id
      // this.cate_name需要新修改的内容
      // JSON.stringify(this.is_enable) 是否启用的状态，转为字符串
      EDIT_CATE_API(
        this.cate_id,
        this.cate_name,
        JSON.stringify(this.is_enable)
      ).then(res => {
        if (res.data.code == 0) {
          this.$message({
            message: "修改成功",
            type: "success", //提示框的类型
            center: true, //提示框文本居中
            duration: 800, //提示框显示的时间
            offset: 50 //提示框距离顶部的偏移量
          });
          setTimeout(() => {
            this.dialogVisible1 = false;
          }, 1000);
          // 重新渲染页面
          this.gettable_data();
        } else {
          this.$message({
            message: "修改数据失败，请重试",
            type: "error", //提示框的类型
            center: true, //提示框文本居中
            duration: 800, //提示框显示的时间
            offset: 50 //提示框距离顶部的偏移量
          });
        }
      });
    },

    // 确定添加商品分类
    sure_addclass() {
      // 1.获取input框的值
      var cateName = this.add_shopclass;
      // 2.获取开关的状态
      var state = this.switch_status.toString();
      // 3.发送axios
      ADD_SHOPCLASS_API(cateName, state).then(res => {
        if (res.data.code == 0) {
          this.$message({
            type: "success",
            message: "商品分类添加成功",
            duration: 800
          });
          // 1s后关闭弹框
          setTimeout(() => {
            // 退出弹框
            this.dialogVisible = false;
            // 清空输入框
            this.add_shopclass = "";
            // 键输入框的状态设置为true
            this.switch_status = true;
          }, 1000);
        } else {
          this.$message({
            type: "error",
            message: "商品分类添加失败",
            duration: 800
          });
        }
      });
      // 4.el-card调用渲染table的函数
      this.gettable_data();
    },
    // 封装渲染table表格函数
    gettable_data() {
      GET_SHOPCLASS_API(this.page.currentPage, this.page.pageSize).then(res => {
        for (let v of res.data.data) {
          // 判断status的状态
          v.state = v.state == 1 ? true : false;
        }
        // 复制给总的页数
        this.page.total = res.data.total;
        // 赋值数据给渲染的数组
        this.tableData = res.data.data;
      });
    },

    // 用户点击删除按钮
    handleDelete(row) {
      this.$confirm("确定要删除该数据嘛？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // 发送删除的axious
          DEL_SHOPCLASS_API(row.id).then(res => {
            if (res.data.code == 0) {
              this.$message({
                type: "success",
                message: "删除成功!",
                duration: 800
              });
            }
            // 重新渲染表格
            this.gettable_data();
          });
        })
        .catch(() => {});

      // .then(res => {
      //   console.log(res);
      //   // 调用渲染table的函数,重新渲染
      //
      // });
    }
  },
  // 钩子函数
  created() {
    // 调用渲染table的函数
    this.gettable_data();
  }
};
</script>

<style lang="less" scoped>
.el-pagination {
  margin-top: 30px;
}
.el-card__header {
  padding: 0px;
  line-height: 30px;
}
.use_text_span {
  margin-right: 10px;
}
</style>