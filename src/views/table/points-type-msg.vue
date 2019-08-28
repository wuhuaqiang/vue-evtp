<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.title" placeholder="Title" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <!--<el-table-column sortable="custom" align="center" width="80" fixed>-->
      <!--<template slot-scope="scope">-->
      <!--<span>{{ scope.row.num }}</span>-->
      <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column :label="'ID'" align="center">
        <template slot-scope="{row}">
          <el-tag>
            {{ row.id }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="'KEY'" align="center">
        <template slot-scope="{row}">
          <el-tag>
            {{ row.num }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="'VALUE'" align="center">
        <template slot-scope="{row}">
          <el-tag>
            {{ row.value }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="'REMARK'" align="center">
        <template slot-scope="{row}">
          <el-tag>
            {{ row.remark }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Actions" align="center" width="180" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">
            Edit
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row, list)">
            Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="50%">
      <el-form ref="dataForm" :model="temp" label-position="right" label-width="250px" class="demo-form-inline" style="width: 40%; margin-left:20px;">
        <el-form-item :label="'请输入关键词'">
          <el-input v-model="temp.value" style="width: 240px" placeholder="请输入关键词" />
        </el-form-item>
        <el-form-item :label="'请选择关键词分类'">
          <!--<el-input v-model="temp.remark" placeholder="请输入关键词分类名称" />-->
          <el-select v-model="temp.remark" class="filter-item" placeholder="请选择关键词分类" style="width: 240px" @change="changeAll">
            <el-option v-for="item in nameTypeOptions" :key="item.key" :label="item.value" :value="item.key" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { queryFabricConfigList } from '@/api/fabricConfig'
import { list, save, update, del } from '@/api/evtpPointsType'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
const nameTypeOptions = [
  { key: '吃', value: '吃' },
  { key: '住', value: '住' },
  { key: '出行', value: '出行' },
  { key: '游', value: '游' },
  { key: '银行', value: '银行' },
  { key: '购物', value: '购物' },
  { key: '生活服务', value: '生活服务' },
  { key: '充电站', value: '充电站' },
  { key: '公司', value: '公司' },
  { key: '家', value: '家' }
]
export default {
  name: 'EvtpPointsType',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: [],
      total: 0,
      configOptions: [],
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        value: undefined,
        remark: undefined
      },
      nameTypeOptions,
      temp: {
        id: '', // id
        num: '', // 键
        value: '', // 值
        remark: '' // 分类备注
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增'
      },
      check: true,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
    this.getConfigOptions()
    this.listLoading = false
  },
  methods: {
    getList() {
      this.listLoading = true
      list(this.listQuery).then(response => {
        console.log(response.data)
        this.list = response.data
        this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    getConfigOptions() {
      queryFabricConfigList(this.listQuery).then(response => {
        console.log(response.data)
        response.data.forEach((item) => {
          const key = item.league_id
          const value = item.org_name + ':' + item.channel_name
          const obj = { key: key, value: value }
          this.configOptions.push(obj)
        })
        // this.configOptions = response.data
        console.log(this.configOptions)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleDellRow(index, rows) {
      debugger
      console.log(rows)
      rows.splice(index, 1)
      this.$message({
        message: '操作Success',
        type: 'success'
      })
    },
    changeAll(value) {
    },
    resetTemp() {
      this.temp = {
        id: '', // id
        num: '', // 键
        value: '', // 值
        remark: '' // 分类备注
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.dialogFormVisible = false
          save(this.temp).then(() => {
            // this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
            this.getList()
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          // tempData.orderer_location = 'grpc://' + tempData.orderer_location + ':7050'
          // tempData.orderer_name = 'orderer' + tempData.orderer_name + '.example.com'
          update(tempData).then(() => {
            // for (const v of this.list) {
            //   if (v.row_id === this.temp.row_id) {
            //     const index = this.list.indexOf(v)
            //     this.list.splice(index, 1, this.temp)
            //     break
            //   }
            // }
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row) {
      /* delFabricUser(row.row_id).then(() => {
        this.$notify({
          title: 'Success',
          message: 'Delete Successfully',
          type: 'success',
          duration: 2000
        })
        const index = this.list.indexOf(row)
        this.list.splice(index, 1)
      })*/
      // row.is_delete = 1
      // debugger
      del(row.id).then(() => {
        this.$notify({
          title: '成功!',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        const index = this.list.indexOf(row)
        this.list.splice(index, 1)
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>
<style>
  .el-table .cell{
    white-space:pre-line;
  }
</style>
