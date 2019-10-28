<template>
  <div :class="className" :style="{height:height,width:width}">
    <h1>加法测试</h1>
    <p>以Json格式向后端提交并获取数据！</p>
    <p>请输入A</p>
    <el-input v-model="parameters.num1" placeholder="请输入内容" />
    <p>请输入B</p>
    <el-input v-model="parameters.num2" placeholder="请输入内容" />
    <el-button type="primary" plain @click="getResult">提交数据</el-button>
    <p>A+B的结果为:{{ result }}</p>
  </div>

</template>

<script>
import { getAddResult } from '@/api/register'
export default {
  name: 'Add',
  props: {
    width: {
      type: String,
      default: '50%'
    },
    height: {
      type: String,
      default: '350px'
    },
    className: {
      type: String,
      default: 'chart'
    }
  },
  data() {
    return {
      parameters: {
        num1: 1,
        num2: 2
      },
      result: ''
    }
  },
  methods: {
    getResult() {
      console.log(JSON.stringify(this.parameters))
      getAddResult(this.parameters).then(res => {
        console.log(res.data.result)
        this.result = res.data.result
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

</style>
