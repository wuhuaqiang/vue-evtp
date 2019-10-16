<template>
  <div class="register-container">
    <el-form ref="registerForm" :model="registerForm" status-icon :rules="rules" label-width="80px" class="registerForm">
      <el-form-item label="联盟" prop="league_id">
        <el-select v-model="registerForm.league_id" placeholder="请选择">
          <el-option
            v-for="item in leagueIdOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="用户名" prop="name">
        <el-input v-model.number="registerForm.name" />
      </el-form-item>
      <el-form-item label="账户" prop="account">
        <el-input v-model="registerForm.account" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="registerForm.password" type="password" />
      </el-form-item>
      <el-form-item label="确认密码" prop="passwordRe">
        <el-input v-model="registerForm.passwordRe" type="password" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="registerAction('registerForm')">注册</el-button>
        <el-button @click="resetForm('registerForm')">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { register } from '@/api/fabricCommon'
import { queryFabricConfigList } from '@/api/fabricConfig'
export default {
  name: 'Register',
  components: { },
  data() {
    var validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.registerForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      leagueIdOptions: [],
      registerForm: {
        name: '', // 用户名
        account: '', // 帐户
        password: '', // 密码
        passwordRe: '',
        league_id: '', // 配置id
        is_delete: 0 // 是否删除
      },
      rules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        account: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        league_id: [
          { required: true, message: '请选择联盟', trigger: 'change' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        passwordRe: [
          { required: true, validator: validatePassword, trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
  },
  created() {
    this.getLeagueIdOptions()
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    if (this.registerForm.username === '') {
      this.$refs.username.focus()
    } else if (this.registerForm.password === '') {
      this.$refs.password.focus()
    }
  },
  destroyed() {
  },
  methods: {
    getLeagueIdOptions() {
      queryFabricConfigList().then((response) => {
        response.data.map((obj) => {
          console.log(obj)
          this.leagueIdOptions.push({ label: obj.org_name + obj.channel_name, value: obj.league_id })
        })
      })
    },
    resetForm() {
      this.registerForm = {
        name: '', // 用户名
        account: '', // 帐户
        password: '', // 密码
        passwordRe: '',
        league_id: '', // 配置id
        is_delete: 0 // 是否删除
      }
      this.$router.push('/login')
    },
    registerAction() {
      this.$refs['registerForm'].validate((valid) => {
        if (valid) {
          register(this.registerForm).then(response => {
            console.log(response)
            if (response.code === 200) {
              this.$message({
                message: response.data,
                type: 'success'
              })
              this.$router.push('/login')
            } else {
              this.$message({
                message: response.data,
                type: 'error'
              })
            }
          })
        }
      })
    }
  }
}
</script>

<style scoped>
  body{
    background-color: #bfbfbf;
  }
  .register-container {
    width: 600px;
    margin: auto;
    margin-top: 150px;
    padding: 100px;
    padding-left: 50px;
    padding-top: 50px;
    padding-bottom: 20px;
    border-radius: 5px;
    border: 2px solid #e6ebf5;
    background: #f2f6fc;
    box-shadow: 1px 1px 20px #909399;
  }
</style>
