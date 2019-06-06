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
      <el-table-column :label="'节点名称\n(peerName)'" align="center">
        <template slot-scope="{row}">
          <el-tag>
            {{ row.peer_name }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="'节点事件名称\n(peerEventHubName)'" align="center">
        <template slot-scope="{row}">
          <el-tag>
            {{ row.peer_eventhubname }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="'节点地址\n(peerLocation)'" align="center" >
        <template slot-scope="{row}">
          <el-tag>
            {{ row.peer_location }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="'节点事件地址\n(peerEventHubLocation)'" class-name="status-col" align="center">
        <template slot-scope="{row}">
          <el-tag>
            {{ row.peer_eventhublocation }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="'是否监听\n(isEventListener)'" class-name="status-col" width="180" align="center">
        <template slot-scope="{row}">
          <el-tag>
            {{ row.is_eventlistener }}
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
      <el-form ref="dataForm"  :model="temp" label-position="right" label-width="280px" class="demo-form-inline" style="width:80%; margin-left:30px;">
        <el-form-item size="small" :label="'配置信息(configInfo)'">
          <el-select v-model="temp.config_id" class="filter-item" placeholder="Please select" style="width: 210px" @change="changeAll">
            <el-option v-for="item in configOptions" :key="item.key" :label="item.value" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item :label="'节点名称(peerName)'">
          <el-input v-model="temp.peer_name" placeholder="请输入组织名称" class="input-with-select"  @change="setEvent()">
            <el-select v-model="temp.peer_name_pre" slot="prepend" placeholder="请选择" style="width: 130px" @change="setEvent()">
              <el-option label="peer0" value="peer0"></el-option>
              <el-option label="peer1" value="peer1"></el-option>
            </el-select>
            <template slot="append">.example.com</template>
          </el-input>
          <!--<el-select v-model="temp.peer_name" class="filter-item" placeholder="Please select" style="width: 210px" @change="changeAll">
            <el-option v-for="item in orgOptions" :key="item.key" :label="item.value" :value="item.key" />
          </el-select>-->
        </el-form-item>
        <el-form-item :label="'节点事件名称(peerEventHubName)'">
          <el-input v-model="temp.peer_eventhubname" readonly="true"/>
          <!--<el-date-picker v-model="temp.timestamp" type="datetime" placeholder="Please pick a date" />-->
        </el-form-item>
        <el-form-item :label="'节点地址(peerLocation)'">
          <el-input v-model="temp.peer_location" placeholder="请输入IP地址" @change="setIP(0)">
            <template slot="prepend">grpc://</template>
            <template slot="append">:7051</template>
          </el-input>
          <!--<el-select v-model="temp.org_domain" class="filter-item" placeholder="Please select" style="width: 210px" disabled>
            <el-option v-for="item in orgDomainOptions" :key="item.key" :label="item.value" :value="item.key" />
          </el-select>-->
        </el-form-item>
        <el-form-item :label="'节点事件地址(peerEventHubLocation)'">
          <el-input v-model="temp.peer_eventhublocation" placeholder="请输入IP地址" @change="setIP(1)">
            <template slot="prepend">grpc://</template>
            <template slot="append">:7053</template>
          </el-input>
        </el-form-item>
        <el-form-item :label="'是否监听(isEventListener)'">
          <el-switch
            v-model="temp.is_eventlistener"
            active-text="开"
            inactive-text="关"
          />
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
import { queryFabricPeerList, createFabricPeer, updateFabricPeer } from '@/api/fabricPeer'
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
const channel_nameOptions = [
  { key: 'checkchannel', value: 'checkchannel' },
  { key: 'evtpchannel', value: 'evtpchannel' },
  { key: 'msgchannel', value: 'msgchannel' },
  { key: 'mychannel', value: 'mychannel' }
]

export default {
  name: 'FabricPeer',
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
      configOptions: [],
      total: 0,
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
      temp: {
        peer_name_pre: '',
        row_id: '',
        peer_name: '',
        peer_eventhubname: '',
        peer_location: '',
        peer_eventhublocation: '',
        is_eventlistener: false,
        config_id: '',
        is_delete: false
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
      queryFabricPeerList(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    setIP(flag) {
      // console.log(flag)
      if (flag) {
        this.temp.peer_location = this.temp.peer_eventhublocation
      } else {
        this.temp.peer_eventhublocation = this.temp.peer_location
      }
    },
    setEvent() {
      this.temp.peer_eventhubname = this.temp.peer_name_pre + '.' + this.temp.peer_name + '.example.com'
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
        peer_name: '', // 节点名称
        peer_eventhubname: '', // 节点事件名称
        peer_location: '', // 节点地址
        peer_eventhublocation: '', // 节点事件地址
        is_eventlistener: false, // 是否监听
        config_id: '', // 配置ID
        is_delete: false // 是否删除
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
          this.temp.peer_name = this.temp.peer_eventhubname
          this.temp.peer_location = 'grpc://' + this.temp.peer_location + ':7051'
          this.temp.peer_eventhublocation = 'grpc://' + this.temp.peer_eventhublocation + ':7053'
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
          this.dialogFormVisible = false
          createFabricPeer(this.temp).then(() => {
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
      this.temp.peer_location = this.temp.peer_location.substring(7).split(':')[0]
      this.temp.peer_eventhublocation = this.temp.peer_eventhublocation.substring(7).split(':')[0]
      this.temp.peer_name_pre = this.temp.peer_name.split('.')[0]
      this.temp.peer_name = this.temp.peer_name.split('.')[1]
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.peer_name = this.temp.peer_eventhubname
          this.temp.peer_location = 'grpc://' + this.temp.peer_location + ':7051'
          this.temp.peer_eventhublocation = 'grpc://' + this.temp.peer_eventhublocation + ':7053'
          const tempData = Object.assign({}, this.temp)
          updateFabricPeer(tempData).then(() => {
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
      /* delFabricPeer(row.row_id).then(() => {
        this.$notify({
          title: 'Success',
          message: 'Delete Successfully',
          type: 'success',
          duration: 2000
        })
        const index = this.list.indexOf(row)
        this.list.splice(index, 1)
      })*/
      row.is_delete = true
      debugger
      updateFabricPeer(row).then(() => {
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
  /*.el-select .el-input {
    width: 130px;
  }*/
  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
</style>
