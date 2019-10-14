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
      <el-table-column :label="'组织名称\n(OrgName)'" width="180" align="center">
        <template slot-scope="{row}">
          <el-tag>
            {{ row.org_name }}
          </el-tag>
        </template>
      </el-table-column>
      <!--<el-table-column :label="'用户名称\n(Username)'" width="180" align="center">
        <template slot-scope="{row}">
          <el-tag>
            {{ row.user_name }}
          </el-tag>
        </template>
      </el-table-column>-->
      <el-table-column :label="'证书路径\n(CryptoConfigPath)'" width="180" align="center">
        <template slot-scope="{row}">
          <el-tag>
            {{ row.cryptoconfig_path }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="'通道配置路径\n(ChannelArtifactsPath)'" width="180" align="center">
        <template slot-scope="{row}">
          <el-tag>
            {{ row.channelartifacts_path }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="'组织\nmsp_id(OrgMSPID)'" width="180" align="center">
        <template slot-scope="{row}">
          <el-tag>
            {{ row.org_mspid }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="'组织域名\n(OrgDomain)'" align="center" width="180">
        <template slot-scope="{row}">
          <el-tag>
            {{ row.org_domain }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="'排序域名\n(OrdererDomain)'" class-name="status-col" width="180" align="center">
        <template slot-scope="{row}">
          <el-tag>
            {{ row.orderer_domain }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="'通道名称\n(ChannelName)'" class-name="status-col" width="180" align="center">
        <template slot-scope="{row}">
          <el-tag>
            {{ row.channel_name }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="'智能合约名称\n(ChaincodeName)'" class-name="status-col" width="180" align="center">
        <template slot-scope="{row}">
          <el-tag>
            {{ row.chaincode_name }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="'智能合约源路径\n(ChaincodeSource)'" class-name="status-col" width="180" align="center">
        <template slot-scope="{row}">
          <el-tag>
            {{ row.chaincode_source }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="'智能合约路径\n(ChaincodePath)'" class-name="status-col" width="180" align="center">
        <template slot-scope="{row}">
          <el-tag>
            {{ row.chaincode_path }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="'智能合约策略\n(ChaincodePolicy)'" class-name="status-col" width="180" align="center">
        <template slot-scope="{row}">
          <el-tag>
            {{ row.chaincode_policy }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="'智能合约版本\n(ChaincodeVersion)'" class-name="status-col" width="180" align="center">
        <template slot-scope="{row}">
          <el-tag>
            {{ row.chaincode_version }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="'提案等待时间\n(ProposalWaittime)'" class-name="status-col" width="180" align="center">
        <template slot-scope="{row}">
          <el-tag>
            {{ row.proposal_waittime }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="'交易等待时间\n(InvokeWaittime)'" class-name="status-col" width="180" align="center">
        <template slot-scope="{row}">
          <el-tag>
            {{ row.invoke_waittime }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="'ca服务器地址\n(CaLocation)'" class-name="status-col" width="180" align="center">
        <template slot-scope="{row}">
          <el-tag>
            {{ row.ca_location }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="'ca服务器名称\n(CaName)'" class-name="status-col" width="180" align="center">
        <template slot-scope="{row}">
          <el-tag>
            {{ row.ca_name }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="'开启\nTLS(IsTls)'" class-name="status-col" width="180" align="center">
        <template slot-scope="{row}">
          <el-tag>
            {{ row.is_tls }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="'开启\nCA TLS(IsCatls)'" class-name="status-col" width="180" align="center">
        <template slot-scope="{row}">
          <el-tag>
            {{ row.is_catls }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Actions" align="center" width="180" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">
            Edit
          </el-button>
          <!-- <el-button v-if="row.status!='published'" size="mini" type="success" @click="handleModifyStatus(row,'published')">
            Publish
          </el-button>
          <el-button v-if="row.status!='draft'" size="mini" @click="handleModifyStatus(row,'draft')">
            Draft
          </el-button>-->
          <el-button size="mini" type="danger" @click="handleDelete(scope.row, list)">
            Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="65%">
      <el-form ref="dataForm" :inline="true" :model="temp" label-position="right" label-width="150px" class="demo-form-inline" style="width:100%; margin-left:0px;">
        <el-form-item size="small" :label="'组织名称(OrgName)'">
          <el-select v-model="temp.org_name" class="filter-item" placeholder="Please select" style="width: 210px" @change="changeAll">
            <el-option v-for="item in orgOptions" :key="item.key" :label="item.value" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item v-show="false" :label="'用户名称(Username)'">
          <el-input v-model="temp.user_name" />
          <!--<el-date-picker v-model="temp.timestamp" type="datetime" placeholder="Please pick a date" />-->
        </el-form-item>
        <el-form-item :label="'证书路径\n(CryptoConfigPath)'">
          <el-input v-model="temp.cryptoconfig_path" />
        </el-form-item>
        <el-form-item v-show="false" :label="'通道配置路径\n(ChannelArtifactsPath)'">
          <el-input v-model="temp.channelartifacts_path" />
        </el-form-item>
        <el-form-item :label="'组织msp_id(OrgMSPID)'">
          <!--<el-input v-model="temp.org_mspid" />-->
          <el-select v-model="temp.org_mspid" class="filter-item" placeholder="Please select" style="width: 210px" disabled>
            <el-option v-for="item in msp_idOptions" :key="item.key" :label="item.value" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item :label="'组织域名(OrgDomain)'">
          <!--<el-input v-model="temp.org_domain" />-->
          <el-select v-model="temp.org_domain" class="filter-item" placeholder="Please select" style="width: 210px" disabled>
            <el-option v-for="item in orgDomainOptions" :key="item.key" :label="item.value" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item v-show="false" :label="'排序域名(OrdererDomain)'">
          <el-input v-model="temp.orderer_domain" />
        </el-form-item>
        <el-form-item :label="'通道名称(ChannelName)'">
          <!--<el-input v-model="temp.channel_name" />-->
          <el-select v-model="temp.channel_name" class="filter-item" placeholder="Please select" style="width: 210px">
            <el-option v-for="item in channel_nameOptions" :key="item.key" :label="item.value" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item :label="'智能合约名称(ChaincodeName)'">
          <el-input v-model="temp.chaincode_name" />
        </el-form-item>
        <el-form-item :label="'智能合约源路径(ChaincodeSource)'">
          <el-input v-model="temp.chaincode_source" />
        </el-form-item>
        <el-form-item :label="'智能合约路径(ChaincodePath)'">
          <el-input v-model="temp.chaincode_path" />
        </el-form-item>
        <el-form-item v-show="false" :label="'智能合约策略(ChaincodePolicy)'">
          <el-input v-model="temp.chaincode_policy" />
        </el-form-item>
        <el-form-item :label="'智能合约版本(ChaincodeVersion)'">
          <!--<el-input v-model="temp.chaincode_version" />-->
          <el-input-number v-model="temp.chaincode_version" :precision="2" :step="0.1" :min="0.1" :max="10" />
        </el-form-item>
        <el-form-item :label="'提案等待时间(ProposalWaittime)'">
          <!--<el-input v-model="temp.proposal_waittime" />-->
          <el-input-number v-model="temp.proposal_waittime" :precision="0" :step="10000" :min="10000" :max="100000" />
        </el-form-item>
        <el-form-item :label="'交易等待时间(InvokeWaittime)'">
          <!--<el-input v-model="temp.invoke_waittime" />-->
          <el-input-number v-model="temp.invoke_waittime" :precision="0" :step="100" :min="200" :max="1000" />
        </el-form-item>
        <el-form-item :label="'ca服务器地址'">
          <el-input v-model="temp.ca_location" />
        </el-form-item>
        <el-form-item :label="'ca服务器名称'">
          <el-input v-model="temp.ca_name" />
        </el-form-item>
        <el-form-item :label="'开启TLS(IsTls)'">
          <el-switch
            v-model="temp.is_tls"
            active-text="开"
            inactive-text="关"
          />
        </el-form-item>
        <el-form-item :label="'开启CA TLS(IsCatls)'">
          <el-switch
            v-model="temp.is_catls"
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
import { queryFabricConfigList, createFabricConfig, updateFabricConfig } from '@/api/fabricConfig'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

const orgOptions = [
  { key: 'Org1', value: 'Org1' },
  { key: 'Org2', valueOrg4: 'Org2' },
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
  name: 'FabricConfig',
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
        row_id: '', // 序号
        league_id: '', // 联盟ID
        org_name: '', // 组织名称
        user_name: 'Admin', // 用户名称
        cryptoconfig_path: '/usr/local/clientrest/crypto-config', // 证书配置路径
        channelartifacts_path: 'channel-artifacts', // 通道配置路径
        org_mspid: '', // 组织msp_id
        org_domain: '', // 组织域名
        orderer_domain: 'example.com', // 域名
        channel_name: '', // 通道
        chaincode_name: '', // 智能合约名称
        chaincode_source: '/opt/gopath', // 智能合约源码
        chaincode_path: 'github.com/hyperledger/fabric/kafkapeer/chaincode/go/example02', // 智能合约路径
        chaincode_policy: 'chaincodeendorsementpolicy.yaml', // 智能合约策略
        chaincode_version: '', // 智能合约版本
        proposal_waittime: '', // 提案等待时间
        invoke_waittime: '', // 交易等待时间
        is_tls: false, // 是否开启TLS
        is_catls: false, // 是否开启CA TLS
        is_delete: false, // 是否删除
        ca_location: '', // ca服务器请求地址
        ca_name: '' // ca服务器名称
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
    this.listLoading = false
  },
  methods: {
    getList() {
      this.listLoading = true
      queryFabricConfigList(this.listQuery).then(response => {
        this.list = response.data
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
        league_id: '', // 联盟ID
        org_name: '', // 组织名称
        user_name: 'Admin', // 用户名称
        cryptoconfig_path: '/usr/local/clientrest/crypto-config', // 证书配置路径
        channelartifacts_path: 'channel-artifacts', // 通道配置路径
        org_mspid: '', // 组织msp_id
        org_domain: '', // 组织域名
        orderer_domain: 'example.com', // 域名
        channel_name: '', // 通道
        chaincode_name: '', // 智能合约名称
        chaincode_source: '/opt/gopath', // 智能合约源码
        chaincode_path: 'github.com/hyperledger/fabric/kafkapeer/chaincode/go/example02', // 智能合约路径
        chaincode_policy: 'chaincodeendorsementpolicy.yaml', // 智能合约策略
        chaincode_version: '', // 智能合约版本
        proposal_waittime: '', // 提案等待时间
        invoke_waittime: '', // 交易等待时间
        is_tls: false, // 是否开启TLS
        is_catls: false, // 是否开启CA TLS
        is_delete: false, // 是否删除
        ca_location: '', // ca服务器请求地址
        ca_name: '' // ca服务器名称
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
          createFabricConfig(this.temp).then(() => {
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
          updateFabricConfig(tempData).then(() => {
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
      /* delFabricConfig(row.row_id).then(() => {
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
      updateFabricConfig(row).then(() => {
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
