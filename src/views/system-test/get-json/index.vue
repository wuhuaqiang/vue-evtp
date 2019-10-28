<template>
  <div class="dashboard-editor-container">
    <h1>从后端获取Json数据绘图</h1>
    <el-button type="primary" plain @click="getJsonDate">获取数据</el-button>
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData" />
    </el-row>
    <add />
  </div>

</template>

<script>
import { getJson } from '@/api/search'
import LineChart from './components/LineChart'
import Add from './components/Add'

export default {
  name: 'GetJson',
  components: {
    LineChart,
    Add
  },
  filters: {
  },
  data() {
    return {
      lineChartData: {}
    }
  },
  methods: {
    getJsonDate() {
      getJson().then(res => {
        console.log(res.data.newVisitis)
        this.lineChartData = res.data.newVisitis
      }).catch()
      this.$message({
        message: '已提交',
        type: 'success'
      })
    }
  }
}
</script>

<style scoped>
  .dashboard-editor-container {
    padding: 32px;
    background-color: rgb(240, 242, 245);
    position: relative;
  }
</style>
