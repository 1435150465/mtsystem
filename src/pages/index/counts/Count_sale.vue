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
       <el-button type="primary">查询</el-button>   
    </div>
    <div class="echars">

    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
.block{
    span{
        margin-right: 20px;
        margin-left: 20px;
    }
    .el-button{
        margin-left: 20px;
    }
}
.echars{
    height: 400px;
    background: #fff;
    margin: 20px;
}
</style>