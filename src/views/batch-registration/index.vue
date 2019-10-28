<template>
  <div class="chart-wrapper">
    <h2>请输入注册信息</h2>
    <el-form :inline="true" :model="temp" class="demo-form-inline">
      <el-form-item label="用户数">
        <el-input v-model="temp.usernum" placeholder="用户数" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { add } from '@/api/register'

export default {
  name: 'BatchRegistration',
  filters: {
  },
  data() {
    return {
      temp: {
        id: undefined,
        usernum: '10'
      }
    }
  },
  created() {
  },
  methods: {
    onSubmit() {
      console.log(this.temp)
      add(this.temp).then(res => {
        console.log(res)
      }).catch()
      this.$message({
        message: 'The title has been edited',
        type: 'success'
      })
    }
  }
}
</script>

<style scoped>
.chart-wrapper {
   background: #fff;
   padding: 16px 16px 0;
   margin-bottom: 32px;
 }
</style>
