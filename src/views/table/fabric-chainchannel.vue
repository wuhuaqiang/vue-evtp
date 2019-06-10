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
      <el-table-column sortable="custom" align="center" width="80" fixed>
        <template slot-scope="scope">
          <span>{{ scope.row.row_id }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'排序名称\n(ordererName)'" align="center">
        <template slot-scope="{row}">
          <el-tag>
            {{ row.orderer_name }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="'排序地址\n(ordererLocation)'" align="center">
        <template slot-scope="{row}">
          <el-tag>
            {{ row.orderer_location }}
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
      <el-form ref="dataForm" :model="temp" label-position="right" label-width="250px" class="demo-form-inline" style="width:80%; margin-left:20px;">
        <el-form-item size="small" :label="'配置信息(configInfo)'">
          <el-select v-model="temp.config_id" class="filter-item" placeholder="Please select" style="width: 210px" @change="changeAll">
            <el-option v-for="item in configOptions" :key="item.key" :label="item.value" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item :label="'排序名称(ordererName)'">
          <el-input v-model="temp.orderer_name" type="number" :min="0" :max="2">
            <template slot="prepend">orderer</template>
            <template slot="append">.example.com</template>
            <!--<el-input-number v-model="num" @change="handleChange" :min="1" :max="10" label="描述文字"></el-input-number>-->
          </el-input>
        </el-form-item>
        <el-form-item :label="'排序地址(ordererLocation)'">
          <el-input v-model="temp.orderer_location" placeholder="请输入IP地址">
            <template slot="prepend">grpc://</template>
            <template slot="append">:7050</template>
          </el-input>
          <!--<el-date-picker v-model="temp.timestamp" type="datetime" placeholder="Please pick a date" />-->
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
import { queryFabricOrdererList, createFabricOrderer, updateFabricOrderer } from '@/api/fabricOrderer'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

const orgOptions = [
  { key: 'Org1', value: 'Org1' },
  { key: 'Org2', value: 'Org2' },
  { key: 'Org3', value: 'Org3' },
  { key: 'Org4', value: 'Org4' }
]
const msp_idOptions = [
  { key: 'Org1MSP', value: 'Org1MSP' },
  { key: 'Org2MSP', value: 'Org2MSP' },
  { key: 'Org3MSP', value: 'Org3MSP' },
  { key: 'Org4MSP', value: 'Org4MSP' }
]
const orgDomainOptions = [
  { key: 'org1.example.com', value: 'org1.example.com' },
  { key: 'org2.example.com', value: 'org2.example.com' },
  { key: 'org3.example.com', value: 'org3.example.com' },
  { key: 'org4.example.com', value: 'org4.example.com' }
]
const ordererOptions = [
  { key: 'org1.example.com', value: 'org1.example.com' },
  { key: 'org2.example.com', value: 'org2.example.com' },
  { key: 'org3.example.com', value: 'org3.example.com' },
  { key: 'org4.example.com', value: 'org4.example.com' }
]
const channel_nameOptions = [
  { key: 'checkchannel', value: 'checkchannel' },
  { key: 'evtpchannel', value: 'evtpchannel' },
  { key: 'msgchannel', value: 'msgchannel' },
  { key: 'mychannel', value: 'mychannel' }
]

export default {
  name: 'FabricOrder',
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
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      orgOptions,
      msp_idOptions,
      orgDomainOptions,
      channel_nameOptions,
      ordererOptions,
      temp: {
        row_id: '', // 序号
        orderer_name: '', // 排序名称
        orderer_location: '', // 排序地址
        config_id: '', // 配置ID
        is_delete: 0 // 是否删除
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
      queryFabricOrdererList(this.listQuery).then(response => {
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
      const num = value.charAt(value.length - 1)
      // console.log(num)
      // console.log(orgDomainOptions)
      // console.log(orgDomainOptions[num - 1])
      this.temp.org_domain = orgDomainOptions[num - 1].value
      this.temp.org_mspid = msp_idOptions[num - 1].value
    },
    resetTemp() {
      this.temp = {
        row_id: '', // 序号
        orderer_name: '', // 排序名称
        orderer_location: '', // 排序地址
        config_id: '', // 配置ID
        is_delete: 0 // 是否删除
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
          // this.temp.map((item, index, array) => {
          //   console.log(item)
          //   console.log(index)
          //   console.log(array)
          // })
          this.temp.league_id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.row_id = this.temp.league_id
          this.temp.orderer_location = 'grpc://' + this.temp.orderer_location + ':7050'
          this.temp.orderer_name = 'orderer' + this.temp.orderer_name + '.example.com'
          for (const key in this.temp) {
            if (typeof this.temp[key] === 'string' && this.temp[key] == null || this.temp[key].length < 1) {
              this.$notify({
                title: '添加失败',
                message: '请检查必填字段!',
                type: 'warning',
                duration: 2000
              })
              return
            }
          }
          debugger
          console.log(this.temp)
          this.dialogFormVisible = false
          createFabricOrderer(this.temp).then(() => {
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
      this.temp.orderer_location = this.temp.orderer_location.substring(7).split(':')[0]
      this.temp.orderer_name = this.temp.orderer_name.substring(7).split('.')[0]
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.orderer_location = 'grpc://' + this.temp.orderer_location + ':7050'
          this.temp.orderer_name = 'orderer' + this.temp.orderer_name + '.example.com'
          const tempData = Object.assign({}, this.temp)
          // tempData.orderer_location = 'grpc://' + tempData.orderer_location + ':7050'
          // tempData.orderer_name = 'orderer' + tempData.orderer_name + '.example.com'
          updateFabricOrderer(tempData).then(() => {
            debugger
            for (const v of this.list) {
              if (v.row_id === this.temp.row_id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
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
      /* delFabricOrderer(row.row_id).then(() => {
        this.$notify({
          title: 'Success',
          message: 'Delete Successfully',
          type: 'success',
          duration: 2000
        })
        const index = this.list.indexOf(row)
        this.list.splice(index, 1)
      })*/
      row.is_delete = 1
      debugger
      updateFabricOrderer(row).then(() => {
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
