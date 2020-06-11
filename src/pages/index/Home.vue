<template>
  <div>
    <el-row type="flex" class="row-bg" justify="center" :gutter="30">
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <img src="../../assets/images/1.jpg" alt />
          <p>
            <span class="title">总订单</span>
            <span>{{totalOrder}}</span>
          </p>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <img src="../../assets/images/2.jpg" alt />
          <p>
            <span class="title">总销售额</span>
            <span>{{totalAmount}}</span>
          </p>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <img src="../../assets/images/3.jpg" alt />
          <p>
            <span class="title">今日订单数</span>
            <span>{{todayOrder}}</span>
          </p>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <img src="../../assets/images/4.jpg" alt />
          <p>
            <span class="title">今日销售额</span>
            <span>{{totayAmount}}</span>
          </p>
        </div>
      </el-col>
    </el-row>
    <div id="echarts"></div>
  </div>
</template>

<script>
// 1.引入echarts
import echarts from "echarts";
import { GET_ORDER_TOTAL_API } from "../../api/groods_manage";
export default {
  data() {
    return {
      totalOrder: "", //总订单
      totalAmount: "", //总销售额
      todayOrder: "", //今日订单
      totayAmount: "" //今日销售额
    };
  },
  //   totalOrder: 5486
  // totalAmount: 202466
  // todayOrder: 189
  // totayAmount: 2189
  // xData: (7) ["2019/11/17", "2019/11/18", "2019/11/19", "2019/11/20", "2019/11/21", "2019/11/22", "2019/11/23"]
  // orderData: (7) [120, 132, 101, 134, 90, 230, 210]
  // amountData: (7) [220, 282, 191, 234, 290, 330, 310]
  mounted() {
    // 2.实例化对象
    var myChart = echarts.init(document.getElementById("echarts"));
    // 当用户网页卡的时候，显示加载图标
    myChart.showLoading({
      text: "loading",
      color: "rgb(45,58,75)",
      textColor: "rgb(45,58,75)",
      maskColor: "rgba(255, 255, 255, 0.8)",
      zlevel: 0
    });
    //  3.引入对应数据图表样式
    setTimeout(() => {
      GET_ORDER_TOTAL_API().then(res => {
        console.log(res);
        let {
          xData,
          orderData,
          amountData,
          totayAmount,
          todayOrder,
          totalAmount,
          totalOrder
        } = res.data;
        this.totalOrder = totalOrder;
        this.totalAmount = totalAmount;
        this.todayOrder = todayOrder;
        this.totayAmount = totayAmount;
        let option = {
          title: {
            text: "数据统计"
          },
          tooltip: {
            trigger: "axis"
          },
          legend: {
            data: ["订单数据", "金额数据"]
          },
          grid: {
            left: "5%",
            right: "4%",
            bottom: "10%",
            containLabel: true
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          xAxis: {
            type: "category",
            boundaryGap: false,
            data: xData
          },
          yAxis: {
            type: "value"
          },
          series: [
            {
              name: "订单数据",
              type: "line",
              data: orderData
            },
            {
              name: "金额数据",
              type: "line",
              data: amountData
            }
          ]
        };
        // 4.渲染图表数据
        myChart.setOption(option);
        // 清空加载图标
        myChart.hideLoading();
      });
    }, 600);
  }
};
</script>

<style lang="less" scoped>
.grid-content {
  background: #fff;
  padding: 20px 20px;
  justify-content: center;
  display: flex;

  img {
    width: 50px;
    height: 50px;
  }
  p {
    display: flex;
    flex-direction: column;
    margin-left: 40px;
    text-align: center;
    .title {
      color: rgb(223, 223, 223);
    }
    span{
      color: rgb(45,58,75);

    }
  }
}
#echarts {
  margin-top: 40px;
  width: 100%;
  height: 400px;
  background: #fff;
}
</style>