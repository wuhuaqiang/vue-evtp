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
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = true">
        上传智能合约
      </el-button>
      <el-button type="primary" @click="execute()">
        执行
      </el-button>
    </div>
    <el-dialog :title="'上传智能合约'" :visible.sync="dialogFormVisible" width="50%">
      <!--<el-upload-->
      <!--class="upload-demo"-->
      <!--ref="upload"-->
      <!--action="/api/smartContracts/multifileUpload"-->
      <!--:on-preview="handlePreview"-->
      <!--:on-remove="handleRemove"-->
      <!--:file-list="fileList"-->
      <!--:multiple="true"-->
      <!--:auto-upload="false">-->
      <!--<el-button slot="trigger" size="small" type="primary">选取文件</el-button>-->
      <!--<el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>-->
      <!--</el-upload>-->
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
import { } from '@/api/fabricOrderer'
import waves from '@/directive/waves' // waves directive
import request from '@/utils/request-api'
export default {
  name: 'FabricOrder',
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
      uploadLogo: '',
      fileData: '',
      dialogFormVisible: false,
      functionOption: '查询智能合约',
      fileList: [],
      fcnOptions: [{ key: 'queryAccount', value: '查询账号余额' }, { key: 'getAccountHistory', value: '查询转账记录' }, { key: 'transferAccounts', value: '转账' }, { key: 'initAccount', value: '充值' }],
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
    },
    uploadFile(file) {
      this.fileData.append('file', file.file)
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
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
