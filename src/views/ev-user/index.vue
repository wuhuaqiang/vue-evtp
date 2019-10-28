<template>
  <div>
    <div class="steps-container">
      <!--      <el-steps :space="200" :active="active" finish-status="success">-->
      <el-steps :active="active" finish-status="success" simple style="margin-top: 20px">
        <el-step title="提交报价" />
        <el-step title="报价匹配中" />
        <el-step title="匹配成功" />
        <el-step title="验证匹配结果" />
        <el-step title="发起交易" />
      </el-steps>
    </div>
    <el-button style="margin-top: 12px;" @click="next">下一步</el-button>
    <!--    <template v-if="active==0">-->
    <!--      <quotation @func="getActive"/>-->
    <!--    </template>-->
    <map-tip />
  </div>
</template>

<script>
import Quotation from './components/Quotation'
import MapTip from './components/Map-Tip'
export default {
  name: 'EVUser',
  // eslint-disable-next-line vue/no-unused-components
  components: { Quotation, MapTip },
  data() {
    return {
      active: 0
    }
  },

  methods: {
    next() {
      console.log(this.active)
      if (this.active++ > 4) this.active = 0
    },
    getActive(number) {
      this.active = parseInt(number)
      console.log(number)
    }
  }
}
</script>

<style scoped>
 .steps-container{
   width: 100%;
   /*border: #a8a9a9 2px solid;*/
  /* padding: 10px;
   margin: 10px;*/
 }
</style>
