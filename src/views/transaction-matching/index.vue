<template>
  <div class="dashboard-editor-container">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="匹配轮次">
        <el-input v-model="formInline.count" placeholder="匹配轮次" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column
        prop="userID"
        label="用户ID"
        width="180"
      />
      <el-table-column
        prop="PMAX"
        label="最高报价"
        width="180"
      />
      <el-table-column
        prop="Pmin"
        label="最低报价"
      />
      <el-table-column
        prop="soc"
        label="交易电量"
      />
      <el-table-column
        prop="RFlag"
        label="用户角色"
      />
      <el-table-column
        prop="time"
        label="报价时间"
      />
    </el-table>
  </div>
</template>

<script>
import { query } from '@/api/register'
export default {
  name: 'Match',
  data() {
    return {
      tableData: [],
      formInline: {
        count: 1,
        MatchStrategy: 0
      }
    }
  },
  methods: {
    onSubmit() {
      console.log(this.formInline)
      query(this.formInline).then(res => {
        console.log(res)
        this.tableData = res.data
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
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;}
</style>
