<template>
  <div class="Acc_list">
    <!-- 数据渲染表格 -->
    <el-table
      ref="multipleTable"
      :data="tableData"
      class="table"
      stripe
      border
      :header-cell-class-name="headerStyle"
      tooltip-effect="dark"
      @selection-change="handleSelectionChange"
      style="width: 100%"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="账号" width="220">
        <template slot-scope="scope">
          <input class="edit_input" v-model="scope.row.account" v-if="scope.row.flag" />
          <span class="edit_span" v-else>{{ scope.row.account }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户组" width="220">
        <template slot-scope="scope">
          <!-- 用户点击编辑状态的下拉框 -->
          <el-select
            class="select"
            v-model="scope.row.userGroup"
            v-if="scope.row.flag"
            placeholder="请选择"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <span class="edit_span" v-else>{{ scope.row.userGroup }}</span>
        </template>
      </el-table-column>
      <el-table-column label="日期" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.ctime }}</template>
      </el-table-column>
      <el-table-column prop="id" label="操作">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.flag"
            type="primary"
            size="mini"
            @click="handleEdit( scope.row)"
          >保存</el-button>
          <el-button v-else size="mini" @click="handleEdit( scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="block paging">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[1,2,3,4,5]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
    <!-- 批量删除 -->
    <p class>
      <el-button type="danger" @click="del_some">批量删除</el-button>
      <el-button type="primary">取消选择</el-button>
    </p>
  </div>
</template>

<script>
// 获取账号列表
import { GETACC_API } from "../../../api/acc_manage";
// 删除
import { DELACC_API } from "../../../api/acc_manage";
// 批量删除
import { DELACC_SOME_API } from "../../../api/acc_manage";
// 修改账号信息
import { CHANGE_ACC } from "../../../api/acc_manage";

export default {
  data() {
    return {
      // 每页条数
      pageSize: 4,
      // 当前页码
      currentPage: 1,
      // 列表信息的总条数
      total: 9,
      // 列表用户
      tableData: [],
      // 批量删除保存需要传入的参数
      del_some_data: "",
      // 用户点击批量删除标杆（防止用户多次点击）
      click_flag: false,
      acc_input: "",
      // 用户点击修改，修改自己的权限组
      options: [
        {
          value: "普通管理员",
          label: "普通管理员"
        },
        {
          value: "超级管理员",
          label: "超级管理员"
        }
      ]
    };
  },
  created() {
    // 发送ajax，渲染页面分页以及table数据
    this.sendAjax(this.currentPage, this.pageSize);
  },
  methods: {
    // 用户改变当前显示的条数触发
    handleSizeChange(val) {
      this.pageSize = val;
      this.sendAjax(this.currentPage, this.pageSize);
    },
    // 洪湖改变当前页触发
    handleCurrentChange(val) {
      this.currentPage = val;
      this.sendAjax(this.currentPage, this.pageSize);
    },

    // 封装发送ajax，渲染table和分页
    sendAjax(currentPage, pageSize) {
      GETACC_API(currentPage, pageSize).then(res => {
        // 给数组的每一个对象添加flag属性(主要用于点击编辑时，用作的标杆)
        console.log(res);

        res.data.data.forEach(v => {
          v.flag = false;
        });
        this.tableData = res.data.data;
        this.total = res.data.total;
      });
    },

    // 用户点击编辑按钮
    handleEdit(row) {
      row.flag = !row.flag;
      // console.log(row.flag);
      if (!row.flag) {
        //保存的时候，row.falg为false

        // 发送axios
        CHANGE_ACC(row.id, row.account, row.userGroup).then(res => {
          console.log(res);
        });
      }
    },

    //用户点击删除按钮，删除当前点击的行数据
    handleDelete(index, row) {
      // 保存当前数据
      this.row = row;

      // 弹框提示用户
      this.$confirm("您确定删除该账号信息吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          //用户点击确定执行 发送axios
          DELACC_API(this.row.id).then(res => {
            if (res.data.code == 0) {
              //删除成功
              this.$message({
                type: "success",
                message: "删除成功!",
                duration: 1000
              });              
              // 点击删除的数据为最后一页 ，则渲染前一页的数据
              if (this.tableData.length == 1) {
                this.sendAjax(--this.currentPage, this.pageSize);
                return
              }
              // 发送ajax到后台，重新渲染数据
              this.sendAjax(this.currentPage, this.pageSize);
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

    //用户点击改变多选框的值，从而获取id
    handleSelectionChange(rows) {
      //rows会找到选中的对象，是个[{}]
      // 1.定义一个空数组保存
      var arr = [];
      // 2.循环遍历出rows的值
      for (let v of rows) {
        // 3.添加元素到数组
        arr.push(v.id);
      }
      // 4.将数组转成字符串，并且赋值给变量
      this.del_some_data = JSON.stringify(arr);
    },

    // 用户点击批量删除
    del_some() {
      // 1.判断用户是否选择了数据
      if (!this.del_some_data) {
        // 1.2.防止用户频繁点击
        if (this.click_flag) return;
        this.click_flag = true;
        // 1.3弹框提示用户
        this.$message({
          type: "warning",
          message: "请选择要删除的数据!",
          duration: 1500,
          center: true
        });
        // 1.4.将标杆的状态改为false
        setTimeout(() => {
          this.click_flag = false;
        }, 1500);
        // 2.否则表示用户选择了删除的数据
      } else {
        // 2.1发送axios
        DELACC_SOME_API(this.del_some_data).then(res => {
          if (!res.data.code) {
            this.$message({
              type: "success",
              message: "删除成功!",
              duration: 1500,
              center: true
            });
          } else {
            this.$message({
              type: "error",
              message: "批量删除数据失败!",
              duration: 1500,
              center: true
            });
          }
        });
        this.sendAjax(this.currentPage, this.pageSize);
      }
    },
    // 改变页头颜色，返回的一个类名
    headerStyle() {
      return "tableStyle";
    }
  }
};
</script>

<style lang="less" scoped>
// 分页
.paging {
  margin: 20px 0px;
}
.edit_input {
  border: 1px solid #eee;
  line-height: 30px;
  outline: none;
  text-indent: 10px;
  color: rgb(44, 133, 218);
}
.edit_span {
  display: inline-block;
  line-height: 38px;
  border: 1px solid transparent;
  text-indent: 10px;
}
</style>

<style lang="less">
.Acc_list {
  .tableStyle {
    background-color: #1989fa !important;
    color: #fff;
    font-weight: 400;
  }
}
</style>