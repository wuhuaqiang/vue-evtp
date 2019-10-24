<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="userNum" placeholder="用户数量" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        生成报价单
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleEncryptedOffer">
        密封报价
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleAuthenticOffer">
        真实报价
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleVerificationOffer">
        验证报价
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="getQualifiedOfferList">
        获取有效报价
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      ref="multipleTable"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      tooltip-effect="dark"
      @selection-change="handleSelectionChange"
    >
      >
      <!--<el-table-column sortable="custom" align="center" width="80" fixed>-->
      <!--<template slot-scope="scope">-->
      <!--<span>{{ scope.row.num }}</span>-->
      <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column
        type="selection"
        width="55"
      />
      <el-table-column :label="'用户ID'" align="center">
        <template slot-scope="{row}">
          <el-tag>
            {{ row.id }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="'电量'" align="center">
        <template slot-scope="{row}">
          <el-tag>
            {{ row.number }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="'电价'" align="center">
        <template slot-scope="{row}">
          <el-tag>
            {{ row.price }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="'Salt'" align="center">
        <template slot-scope="{row}">
          <el-tag>
            {{ row.salt }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="'角色'" align="center">
        <template slot-scope="{row}">
          <el-tag v-if="row.status===1" type="danger">
            {{ "充电" }}
          </el-tag>
          <el-tag v-else type="success">
            {{ "放电" }}
          </el-tag>
        </template>
      </el-table-column>
      <!--      <el-table-column label="Actions" align="center" width="180" class-name="small-padding fixed-width">-->
      <!--        <template slot-scope="scope">-->
      <!--          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">-->
      <!--            Edit-->
      <!--          </el-button>-->
      <!--          <el-button size="mini" type="danger" @click="handleDelete(scope.row, list)">-->
      <!--            Delete-->
      <!--          </el-button>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
    </el-table>
    <el-dialog :title="'报价列表'" :visible.sync="dialogFormVisible" width="50%">
      <el-table
        :data="tableData"
        height="250"
        border
        style="width: 100%"
      >
        <el-table-column :label="'用户ID'" align="center" prop="id" />
        <el-table-column :label="'电量'" align="center" prop="number" />
        <el-table-column :label="'电价'" align="center" prop="price" />
        <el-table-column :label="'角色'" align="center">
          <template slot-scope="{row}">
            <el-tag v-if="row.status==='1'" type="danger">
              {{ "充电" }}
            </el-tag>
            <el-tag v-else type="success">
              {{ "放电" }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import { queryFabricConfigList } from '@/api/fabricConfig'
import request from '@/utils/request-api'
import { save, update, del } from '@/api/evtpPointsType'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import md5 from 'js-md5'
// import crypto from 'crypto'
import Pagination from '@/components/Pagination'
import { uuid, randomNum, randomNumDuble } from '../../utils/utils' // secondary package based on el-pagination
export default {
  name: 'QuotationManagement',
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
      tableData: [],
      timer: null, // 定时器名称
      tableKey: 0,
      list: [],
      offerId: '',
      total: 0,
      userNum: 20,
      configOptions: [],
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        value: undefined,
        remark: undefined
      },
      temp: {
        id: '', // id
        num: '', // 键
        value: '', // 值
        remark: '' // 分类备注
      },
      dialogFormVisible: false,
      dialogStatus: '',
      check: true,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false,
      multipleSelection: []
    }
  },
  created() {
    this.getList()
    this.getConfigOptions()
    this.listLoading = false
  },
  methods: {
    getList() {
      this.offerId = uuid(32)
      this.listLoading = true
      this.list = []
      for (let i = 0; i < this.userNum; i++) {
        const quotation = {}
        quotation.id = uuid(32)
        // eslint-disable-next-line no-undef
        quotation.price = randomNumDuble(0.5, 1.2).toFixed(2)
        quotation.number = randomNum(1, 50)
        quotation.status = randomNum(0, 1)
        quotation.salt = uuid(4)
        this.list.push(quotation)
      }
      this.total = 0
      this.listLoading = false
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
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
    handleEncryptedOffer() {
      const param = []
      const funcName = 'addEncryptedOffer'
      const data = {}
      data.fcn = funcName
      this.multipleSelection.forEach(obj => {
        const args = []
        const copy = Object.assign({}, obj)
        copy.price = md5(obj.price + obj.salt)
        copy.number = md5(obj.number + obj.salt)
        delete copy['salt']
        args.push(this.offerId)
        /* args.push(copy.id)
        args.push(copy.number)
        args.push(copy.price)
        args.push(copy.status)*/
        args.push(copy)
        // data.args = JSON.stringify(args)
        // const paramObj = Object.assign({}, args)
        // console.log(JSON.stringify(data))
        param.push(JSON.stringify(args))
        // this.invoke(paramObj)
        // this.sleep(20000)
      })
      // debugger
      data.args = JSON.stringify(param)
      console.log(data)
      this.invokeBatch(data)
      // console.log(this.multipleSelection)
      // console.log(param)
      // console.log(md5('213123'))
      // const Md5 = crypto.createHash('md5')
      // // update("中文", "utf8")
      // Md5.update('213123')
      // const a = Md5.digest('hex')
      // console.log(a)
    },
    invoke(data) {
      // setTimeout(
      console.log(data)
      request({
        url: '/chaincode/invoke',
        method: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: data
      }).then(response => {
        if (response.code === 200) {
          console.log(JSON.stringify(response.data))
        } else {
          console.log(JSON.stringify(response.data))
        }
      })
      // , 10000)
    },
    invokeBatch(data) {
      console.log(data)
      request({
        url: '/chaincode/invokeBatch',
        method: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: data
      }).then(response => {
        if (response.code === 200) {
          console.log(JSON.stringify(response.data))
        } else {
          console.log(JSON.stringify(response.data))
        }
      })
    },
    sleep(n) {
      const start = new Date().getTime() // 定义起始时间的毫秒数
      let loop = 1
      while (loop === 1) {
        const time = new Date().getTime() // 每次执行循环取得一次当前时间的毫秒数
        if (time - start > n) { // 如果当前时间的毫秒数减去起始时间的毫秒数大于给定的毫秒数，即结束循环
          break
        }
        loop = 1
      }
    },
    handleAuthenticOffer() {
      console.log(this.multipleSelection)
      const param = []
      const funcName = 'addAuthenticOffer'
      const data = {}
      data.fcn = funcName
      this.multipleSelection.forEach(obj => {
        const args = []
        args.push(this.offerId)
        /* args.push(obj.id)
        args.push(obj.number)
        args.push(obj.price)
        args.push(obj.salt)
        args.push(obj.status)*/
        args.push(obj)
        // data.args = JSON.stringify(args)
        // console.log(JSON.stringify(data))
        // const paramObj = Object.assign({}, data)
        // console.log(JSON.stringify(data))
        // this.invoke(paramObj)
        // this.sleep(20000)
        param.push(JSON.stringify(args))
      })
      data.args = JSON.stringify(param)
      console.log(data)
      this.invokeBatch(data)
      // this.handleVerificationOffer()
    },
    handleVerificationOffer() {
      const funcName = 'verificationOffer'
      const data = {}
      const args = []
      data.fcn = funcName
      args.push(this.offerId)
      data.args = JSON.stringify(args)
      console.log(JSON.stringify(data))
      this.invoke(data)
    },
    getQualifiedOfferList() {
      const funcName = 'getQualifiedOfferList'
      const data = {}
      const args = []
      data.fcn = funcName
      args.push(this.offerId)
      data.args = JSON.stringify(args)
      console.log(JSON.stringify(data))
      request({
        url: '/chaincode/invoke',
        method: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: data
      }).then(response => {
        if (response.code === 200) {
          this.dialogFormVisible = true
          this.tableData = response.data.qualified_offer_arr
          console.log(response.data.qualified_offer_arr)
        } else {
          console.log(JSON.stringify(response.data))
        }
      })
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
