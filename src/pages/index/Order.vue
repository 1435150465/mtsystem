<template>
  <div class="main_div">
    <p>
      <label>
        订单号：
        <el-input class="input_order" v-model="search_content.orderNo" placeholder="请输入订单号"></el-input>
      </label>
      <label>
        收货人：
        <el-input class="input_order" v-model="search_content.consignee" placeholder="请输入收货人"></el-input>
      </label>
      <label>
        手机号：
        <el-input class="input_order" v-model="search_content.phone" placeholder="请输入手机号"></el-input>
      </label>
      <label>
        订单状态：
        <template>
          <el-select v-model="search_content.orderState" placeholder="订单状态">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </template>
      </label>
    </p>

    <div class="block change_time">
      <span class="demonstration">选择时间：</span>
      <el-date-picker
        v-model="search_content.data"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      ></el-date-picker>
      <el-button type="primary" class="search_btn" @click="search_btn">搜索</el-button>
    </div>
    <div class="all_shop">
      <el-button type="primary" size="small" plain @click="get_order_list">全部商品</el-button>
    </div>
    <div class="block"></div>
    <el-table :data="tableData" border style="width: 100%" class="table_content">
      <el-table-column fixed prop="orderNo" label="订单号" width="150"></el-table-column>
      <el-table-column prop="orderTime" label="下单时间" width="120"></el-table-column>
      <el-table-column prop="phone" label="手机号" width="120"></el-table-column>
      <el-table-column prop="consignee" label="收货人" width="120"></el-table-column>
      <el-table-column prop="deliverAddress" label="配送地址" width="300"></el-table-column>
      <el-table-column prop="deliveryTime" label="送达时间" width="120"></el-table-column>
      <el-table-column prop="remarks" label="用户备注" width="120"></el-table-column>
      <el-table-column prop="orderAmount" label="订单金额" width="120"></el-table-column>
      <el-table-column prop="orderState" label="订单状态" width="120"></el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
          <el-button type="text" size="small" @click="edit_btn(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="block">
      <el-pagination
        @current-change="handleCurrentChange"
        :pageSize="pageSize"
        :current-page.sync="currentPage"
        layout="total,prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
    <!-- 查看和编辑模态框 -->
    <el-dialog :visible.sync="dialogVisible" width="30%">
      <div class="Modal">
        <p v-if="edit_flag">商品信息:{{goods_info.orderNo}}</p>
        <p v-else>
          <span>商品信息:</span>
          <el-input v-model="goods_info.orderNo"></el-input>
        </p>
        <p v-if="edit_flag">下单时间：{{goods_info.orderTime}}</p>
        <p v-else>
          <span>下单时间：</span>
          <el-input v-model="goods_info.orderTime"></el-input>
        </p>
        <p v-if="edit_flag">手机号：{{goods_info.phone}}</p>
        <p v-else>
          <span>手机号：</span>
          <el-input v-model="goods_info.phone"></el-input>
        </p>
        <p v-if="edit_flag">收货人：{{goods_info.consignee}}</p>
        <p v-else>
          <span>收货人：</span>
          <el-input v-model="goods_info.consignee"></el-input>
        </p>
        <p v-if="edit_flag">配送地址：{{goods_info.deliverAddress}}</p>
        <p v-else>
          <span>配送地址：</span>
          <el-input v-model="goods_info.deliverAddress"></el-input>
        </p>
        <p v-if="edit_flag">送达时间：{{goods_info.deliveryTime}}</p>
        <p v-else>
          <span>送达时间：</span>
          <el-input v-model="goods_info.deliveryTime"></el-input>
        </p>
        <p v-if="edit_flag">用户备注：{{goods_info.remarks}}</p>
        <p v-else>
          <span>用户备注：</span>
          <el-input v-model="goods_info.remarks"></el-input>
        </p>
        <p v-if="edit_flag">订单金额：{{goods_info.orderAmount}}</p>
        <p v-else>
          <span>订单金额：</span>
          <el-input v-model="goods_info.orderAmount"></el-input>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary " plain @click="dialogVisible = false" v-if="!edit_flag">取 消</el-button>
        <el-button type="primary" @click="sere_edit_btn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
 

<script>
import {
  ORDER_LIST_API,
  ORDER_SEARCH_API,
  ORDER_EDIT_API
} from "../../api/order_manage";
export default {
  data() {
    return {
      // 订单状态下拉框数据
      options: [
        { label: "已受理", value: "已受理" },
        { label: "派送中", value: "派送中" },
        { label: "已完成", value: "已完成" }
      ],
      // 搜索框的所有必选内容
      search_content: {
        orderNo: "", //订单号
        consignee: "", //收货人
        phone: "", //手机号
        orderState: "" //订单状态
      },
      data: "",
      // 当前页数
      currentPage: 1,
      // 每页显示的数据条数
      pageSize: 5,
      // 表格渲染数组
      tableData: [],
      // 分页total
      total: 0,
      // 查看和编辑模态框
      dialogVisible: false,
      // 点击查看商品信息
      goods_info: {
        orderNo: "",
        orderTime: "",
        phone: "",
        consignee: "",
        deliverAddress: "",
        deliveryTime: "",
        remarks: "",
        orderAmount: "",
        orderState: ""
      },
      // 编辑状态
      edit_flag: false
    };
  },
  methods: {
    handleCurrentChange(val) {
      this.currentPage = val;
      this.get_order_list();
    },
    // 封装渲染列表函数
    get_order_list() {
      ORDER_LIST_API(this.currentPage, this.pageSize).then(res => {
        // 转换日期格式
        res.data.data.forEach(v => {
          v.orderTime = this.change_data_orderTime(v.orderTime);
          v.deliveryTime = this.change_data_orderTime(v.deliveryTime);
        });
        // 渲染列表
        this.tableData = res.data.data;
        // 设置当前的总条数
        this.total = res.data.total;
      });
    },
    // 搜索按钮触发搜索
    search_btn() {
      // 1.获取订单内容
      // 如果用户没有选择时间
      if (this.search_content.data) {
        // 将标准时间转成普通时间格式
        this.search_content.data = this.search_content.data.map(v => {
          return this.change_data_orderTime(v);
        });
      }

      // 查询接口
      ORDER_SEARCH_API(
        this.currentPage,
        this.pageSize,
        this.search_content.orderNo,
        this.search_content.consignee,
        this.search_content.phone,
        this.search_content.orderState,
        JSON.stringify(this.search_content.data)
      ).then(res => {
        console.log(res);
        if (res.data.data.length == 0) {
          this.$message({
            message: "暂无改订单信息",
            center: true, //提示框文本居中
            duration: 1000, //提示框显示的时间
            offset: 50 //提示框距离顶部的偏移量
          });
        } else {
          this.$message({
            message: "已为您查询到以下订单",
            type: "success",
            center: true, //提示框文本居中
            duration: 1000, //提示框显示的时间
            offset: 50 //提示框距离顶部的偏移量
          });
          this.tableData = res.data.data;
          this.total = res.data.total;
        }
      });
    },
    // 点击查看按钮
    handleClick(row) {
      // 弹出模态框
      this.dialogVisible = true;
      // 显示查看对应的页面
      this.edit_flag = true;
      // 渲染对应的页面
      this.goods_info = row;
    },
    // 点击编辑按钮
    edit_btn(row) {
      // 弹出模态框
      this.dialogVisible = true;
      // 显示编辑对应的页面
      this.edit_flag = false;
      this.goods_info = JSON.parse(JSON.stringify(row));
    },
    // 确认修改按钮
    sere_edit_btn() {
      // 如果编辑状态为真，则表示现在的按钮状态时查看
      if (this.edit_flag) {
        this.dialogVisible = false;
        return;
      }
      // 解构
      let {
        id,
        orderNo,
        orderTime,
        phone,
        consignee,
        deliverAddress,
        deliveryTime,
        remarks,
        orderAmount,
        orderState
      } = this.goods_info;
      // 发送axious
      ORDER_EDIT_API(
        id,
        orderNo,
        orderTime,
        phone,
        consignee,
        deliverAddress,
        deliveryTime,
        remarks,
        orderAmount,
        orderState
      ).then(res => {
        if (res.data.code == 0) {
          this.$message({
            message: "修改成功",
            type: "success", //提示框的类型
            center: true, //提示框文本居中
            duration: 500, //提示框显示的时间
            offset: 50 //提示框距离顶部的偏移量
          });
          // 重新渲染
          this.get_order_list()
          this.dialogVisible = false;
        }else{
          this.$message({
            message: "修改失败",
            type: "error", //提示框的类型
            center: true, //提示框文本居中
            duration: 500, //提示框显示的时间
            offset: 50 //提示框距离顶部的偏移量
          });
        }
        console.log(res);
      });
      // dialogVisible = false
    },
    // 封装改变日期函数
    change_data_orderTime(old_time) {
      var d = new Date(old_time);
      var mou = d.getMonth() + 1 < 10 ? `0${d.getMonth()}` : d.getMonth();
      var data = d.getDate() < 10 ? `0${d.getDate()}` : d.getDate();
      var hours = d.getHours() < 10 ? `0${d.getHours()}` : d.getHours();
      var minutes = d.getMinutes() < 10 ? `0${d.getMinutes()}` : d.getMinutes();
      var seconds = d.getSeconds() < 10 ? `0${d.getSeconds()}` : d.getSeconds();

      return (old_time =
        d.getFullYear() +
        "-" +
        mou +
        "-" +
        data +
        " " +
        hours +
        ":" +
        minutes +
        ":" +
        seconds);
    }
  },
  created() {
    this.get_order_list();
  }
};
</script>

<style lang="less" scoped>
.main_div {
  p {
    .el-input {
      width: 200px;
      margin-right: 30px;
      margin-bottom: 30px;
    }
  }
  .all_shop {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 10px;
    padding-right: 20px;
  }
}
.el-table {
  margin: 0px 0px 40px 0px;
}
.search_btn {
  margin-left: 26px;
}
.Modal {
  p {
    line-height: 40px;
    span {
      display: inline-block;
      width: 80px;
      text-align: right;
      margin-right: 10px;
    }
  }
}
</style>