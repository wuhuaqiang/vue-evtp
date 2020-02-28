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
      <el-table-column
        type="index"
        width="30"
      />
      <el-table-column :label="'线路ID'" align="center">
        <template slot-scope="{row}">
          <el-tag>
            {{ row.id }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="'用户ID'" align="center">
        <template slot-scope="{row}">
          <el-tag>
            {{ row.owerId }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="'线路名称'" align="center">
        <template slot-scope="{row}">
          <el-tag>
            {{ row.name }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="'起点'" align="center">
        <template slot-scope="{row}">
          <el-tag>
            {{ row.startPoint }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="'终点'" align="center">
        <template slot-scope="{row}">
          <el-tag>
            {{ row.endPoint }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="'开始时间'" align="center">
        <template slot-scope="{row}">
          <el-tag>
            {{ row.startTime }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="'到达时间'" align="center">
        <template slot-scope="{row}">
          <el-tag>
            {{ row.endTime }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="'行驶时间'" align="center">
        <template slot-scope="{row}">
          <el-tag>
            {{ row.runTime }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="'行驶路程'" align="center">
        <template slot-scope="{row}">
          <el-tag>
            {{ row.distance }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="'状态'" align="center">
        <template slot-scope="{row}">
          <el-tag>
            {{ row.state }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="'备注'" align="center">
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
      <el-form ref="dataForm" :model="temp" label-position="right" label-width="250px" class="demo-form-inline" style="width:80%; margin-left:20px;">
        <el-form-item size="small" :label="'配置信息(configInfo)'">
          <el-select v-model="temp.league_id" class="filter-item" placeholder="Please select" style="width: 210px" @change="changeAll">
            <el-option v-for="item in configOptions" :key="item.key" :label="item.value" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item :label="'请输入用户'">
          <el-input v-model="temp.name" placeholder="请输入用户" />
        </el-form-item>
        <el-form-item :label="'账号'">
          <el-input v-model="temp.account" placeholder="请输入账号" />
        </el-form-item>
        <el-form-item v-show="textMap[dialogStatus]==='新增'" :label="'密码'">
          <el-input v-model="temp.password" type="password" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item v-show="textMap[dialogStatus]==='新增'" :label="'确认密码'">
          <el-input v-model="temp.passwordSur" type="password" placeholder="再次输入密码" />
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
import { saveOrUpdateUser, queryPage } from '@/api/evtpLine'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'EvtpUserMsg',
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
        limit: 10,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      temp: {
        id: null,
        name: null,
        startPoint: null,
        endPoint: null,
        startPointVal: null,
        endPointVal: null,
        startTime: null,
        endTime: null,
        owerId: null,
        sort: null,
        runTime: null,
        remark: null,
        state: null,
        distance: null
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
      queryPage(this.listQuery).then(response => {
        console.log(response.data)
        this.list = response.data.records
        this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleDellRow(index, rows) {
      // debugger
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
        id: null,
        evId: null,
        name: null,
        homePositionId: null,
        companyPositionId: null,
        otherPositionId: null,
        sex: null,
        email: null,
        address: null,
        phone: null,
        qq: null,
        telnumber: null,
        createdate: null,
        state: null,
        remark: null,
        account: null
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
          this.temp.row_id = parseInt(Math.random() * 100) + 1024 // mock a id
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
          // debugger
          console.log(this.temp)
          this.dialogFormVisible = false
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
          saveOrUpdateUser(tempData).then(() => {
            // debugger
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
      row.is_delete = 1
      // debugger
      saveOrUpdateUser(row).then(() => {
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
