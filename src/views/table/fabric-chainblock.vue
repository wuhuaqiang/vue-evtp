<template>
  <div class="app-container">
    <div class="filter-container">
      <el-radio-group v-model="functionOption">
        <el-radio-button label="安装智能合约" />
        <el-radio-button label="实例化智能合约" />
        <el-radio-button label="升级智能合约" />
        <el-radio-button label="执行智能合约" />
        <el-radio-button label="查询智能合约" />
      </el-radio-group>
    </div>
    <el-form ref="dataForm" :model="temp" label-position="right" label-width="50px" class="demo-form-inline" style="width:80%;">
      <el-form-item size="small" :label="'方法'">
        <el-select v-model="temp.fcn" class="filter-item" placeholder="Please select" style="width: 210px" @change="changeAll">
          <el-option v-for="item in fcnOptions" :key="item.key" :label="item.value" :value="item.key" />
        </el-select>
      </el-form-item>
      <el-form-item v-show="isShow()" size="small" :label="'参数'">
        <el-input
          v-model="temp.args"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4}"
          placeholder="请输入内容"
        />
      </el-form-item>
      <el-form-item size="small" :label="'结果'">
        <el-input
          v-model="result"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4}"
          placeholder=""
          readonly="true"
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = true">
        上传智能合约
      </el-button>
      <el-button type="primary" @click="execute()">
        执行
      </el-button>
    </div>
    <el-dialog :title="'上传智能合约'" :visible.sync="dialogFormVisible" width="30%">
      <el-upload
        ref="upload"
        action="/api/smartContracts/multifileUpload"
        :auto-upload="false"
        :http-request="uploadFile"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :on-success="handleSucess"
        :file-list="fileList"
      >
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
        <el-tag v-show="uploadLogo=='1'">上传中</el-tag>
        <el-tag v-show="uploadLogo=='2'" type="success">上传成功</el-tag>
        <el-tag v-show="uploadLogo=='3'" type="danger">上传失败</el-tag>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import request from '@/utils/request-api'
export default {
  name: 'FabricChainblock',
  components: { },
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
      result: '',
      uploadLogo: '',
      fileData: '',
      dialogFormVisible: false,
      functionOption: '查询智能合约',
      fileList: [],
      fcnOptions: [{ key: 'queryAccount', value: '查询账号余额' }, { key: 'getAccountHistory', value: '查询转账记录' }, { key: 'transferAccounts', value: '转账' }, { key: 'initAccount', value: '充值' },
        { key: 'getAccountBalance', value: '查询账号余额-java' }, { key: 'depositMoney', value: '存款-java' }, { key: 'drawalMoney', value: '取款-java' }, { key: 'transferAccount', value: '转账-java' },
        { key: 'createAccount', value: '开户-java' }, { key: 'getAccountTransactionRecords', value: '查询交易记录-java' }, { key: 'getAllAccounts', value: '查询所有账户-java' }],
      temp: {
        args: '',
        fcn: ''
      }
    }
  },
  created() {
    this.listLoading = false
  },
  methods: {
    isShow() {
      return this.functionOption.indexOf('执行') !== -1 || this.functionOption.indexOf('查询') !== -1
    },
    submitUpload() {
      this.fileData = new FormData()
      this.$refs.upload.submit()
      this.uploadLogo = '1'
      var that = this
      if (this.$refs.upload.uploadFiles.length) {
        request({
          method: 'post',
          url: '/smartContracts/multifileUpload',
          data: that.fileData,
          contentType: false, // 这里不要落下
          dataType: 'json'
        }).then(response => {
          if (response.code === 200) {
            that.uploadLogo = '2'
          } else {
            that.uploadLogo = '3'
          }
        })
      } else {
        this.uploadLogo = ''
        this.$message({
          message: '请选择上传的文件',
          type: 'error'
        })
      }
    },
    uploadFile(file) {
      this.fileData.append('file', file.file)
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    execute() {
      switch (this.functionOption) {
        case '安装智能合约':
          this.install()
          break
        case '实例化智能合约':
          this.instantiate()
          break
        case '升级智能合约':
          this.upgrade()
          break
        case '执行智能合约':
          this.invoke()
          break
        case '查询智能合约':
          this.query()
          break
      }
    },
    install() {
      request({
        url: '/chaincode/install',
        method: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: this.temp
      }).then(response => {
        if (response.code === 200) {
          this.result = JSON.stringify(response.data)
          console.log(response.data)
        } else {
          this.result = JSON.stringify(response.data)
          console.log(response.data)
        }
      })
    },
    instantiate() {
      request({
        url: '/chaincode/instantiate',
        method: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: this.temp
      }).then(response => {
        if (response.code === 200) {
          this.result = JSON.stringify(response.data)
          console.log(response.data)
        } else {
          this.result = JSON.stringify(response.data)
          console.log(response.data)
        }
      })
    },
    upgrade() {
      request({
        url: '/chaincode/upgrade',
        method: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: this.temp
      }).then(response => {
        if (response.code === 200) {
          this.result = JSON.stringify(response.data)
          console.log(response.data)
        } else {
          this.result = JSON.stringify(response.data)
          console.log(response.data)
        }
      })
    },
    invoke() {
      request({
        url: '/chaincode/invoke',
        method: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: this.temp
      }).then(response => {
        if (response.code === 200) {
          this.result = JSON.stringify(response.data)
          console.log(response.data)
        } else {
          this.result = JSON.stringify(response.data)
          console.log(response.data)
        }
      })
    },
    query() {
      request({
        url: '/chaincode/query',
        method: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: this.temp
      }).then(response => {
        if (response.code === 200) {
          this.result = JSON.stringify(response.data)
          console.log(response.data)
        } else {
          this.result = JSON.stringify(response.data)
          console.log(response.data)
        }
      })
    }
  }
}
</script>
<style>
  .el-table .cell{
    white-space:pre-line;
  }
  .app-container{
    width: 80%;
    margin-left: 80px;
  }
</style>
