<template>
  <div>
    <div class="block">
      <span class="demonstration">时间范围</span>
      <el-date-picker
        v-model="value1"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      ></el-date-picker>
      <el-button type="primary" @click="search_btn">查询</el-button>
    </div>
    <div id="myecharts"></div>
  </div>
</template>

<script>
import { GET_TABLE_ORDER_API } from "../../../api/groods_manage";
// 引入echarts
import echarts from "echarts";
export default {
  data() {
    return {
      value1: "",
      data: ["2019-10-01 00:00:00", "2020-10-10 00:00:00"]
    };
  },
  methods: {
    // 转换日期函数
    change_data(old_time) {
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
    },
    // 点击查询按钮
    search_btn() {
      this.data = this.value1.map(v => {
        return this.change_data(v);
      });
      this.getDate();
    },
    getDate() {
      // 2.实例化echarts
      var myChart = echarts.init(document.getElementById("myecharts"));
      GET_TABLE_ORDER_API(JSON.stringify(this.data)).then(res => {
        var arr = res.data.data.map(v => {
          return this.change_data(v.orderTime);
        });
        // 定义一个最大值
        var max = res.data.data[0].orderAmount;
        // 获取最大值
        var arrCount = res.data.data.map(v => {
          max = max > v.orderAmount ? max : v.orderAmount;
          // 返回一个新的数组
          return v.orderAmount;
        });

        let option = {
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "cross",
              crossStyle: {
                color: "#999"
              }
            }
          },
          toolbox: {
            feature: {
              dataView: { show: true, readOnly: false },
              magicType: { show: true, type: ["line", "bar"] },
              restore: { show: true },
              saveAsImage: { show: true }
            }
          },
          xAxis: [
            {
              type: "category",
              data: arr,
              axisPointer: {
                type: "shadow"
              }
            }
          ],
          yAxis: [
            {
              type: "value",
              name: "订单金额",
              min: 0,
              max: Math.ceil(max * 1.2),
              interval: Math.ceil(max / 4),
              axisLabel: {
                formatter: "{value} 元"
              }
            }
          ],
          series: [
            {
              name: "订单金额",
              type: "bar",
              data: arrCount
            }
          ]
        };
        // 渲染图表
        myChart.setOption(option);
      });
    }
  },
  // data	所有订单数据
  // orderTime	下单时间
  // orderAmount	订单金额
  mounted() {
    this.getDate();
  }
};
</script>

<style lang="less" scoped>
.block {
  span {
    margin-right: 20px;
    margin-left: 20px;
  }
  .el-button {
    margin-left: 20px;
  }
}
#myecharts {
  height: 400px;
  background: #fff;
  margin: 20px;
}
</style>