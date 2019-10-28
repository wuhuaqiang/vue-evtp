<template>
  <div>
    <div class="quote-Form">
      <el-form ref="form" :model="sizeForm" label-width="120px" size="medium">
        <el-form-item label="最低价格">
          <el-input-number v-model="sizeForm.minPrice" />
        </el-form-item>
        <el-form-item label="最高价格">
          <el-input-number v-model="sizeForm.maxPrice" />
        </el-form-item>
        <el-form-item label="数量">
          <el-input-number v-model="sizeForm.number" />
        </el-form-item>
        <el-form-item size="large">
          <el-button type="primary" @click="onSubmit">提交</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Quotation',
  data() {
    return {
      sizeForm: {
        minPrice: '',
        maxPrice: '',
        number: ''
      }
    }
  },
  methods: {
    onSubmit() {
      console.log('submit!')
      this.$emit('func', '1')
    }
  }
}
</script>

<style scoped>
 .quote-Form{
   padding: 20px;
   /*border: 5px solid grey;*/
   margin: auto;
   width: 50%;
 }
</style>
