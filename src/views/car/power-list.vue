<template>
  <div class="main-container">
    <el-button type="primary" class="buy-car" icon="el-icon-star-off" @click="buyCar">购买</el-button>
    <div v-for="car in carList" :key="car.id" class="car-container">
      <ul>
        <li v-show="false"><span>编号:</span><a>{{ car.id }}</a></li>
        <li><span>名称:</span><a>{{ car.carName }}</a></li>
        <li><span>类型:</span><a>{{ car.carType }}</a></li>
        <li><span>价格:</span><a>{{ car.price }}</a></li>
        <!--<li><span>数量:</span><a>{{car.quality}}</a></li>-->
        <!--<li><span>总价:</span><a>{{car.batteryCapacity}}</a></li>-->
      </ul>
      <!--<el-input-number v-model="car.num" :min="0" :max="5" label="购买数量"></el-input-number>-->
      <el-checkbox v-model="car.num">是否购买</el-checkbox>
    </div>
    <div class="bottom" />
    <el-dialog :title="'订单详情'" :visible.sync="dialogOrderVisible" width="50%">
      <el-form :inline="true" :model="orderOwer" class="demo-form-inline">
        <el-form-item v-show="false" label="账号">
          <el-input v-model="orderOwer.account" placeholder="账号" />
        </el-form-item>
        <el-form-item label="联系人">
          <el-input v-model="orderOwer.name" placeholder="联系人" />
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="orderOwer.tel" placeholder="联系电话" />
        </el-form-item>
        <el-form-item label="收货地址">
          <el-input v-model="orderOwer.address" type="textarea" placeholder="收货地址" :autosize="{ minRows: 2, maxRows: 4}" />
        </el-form-item>
      </el-form>
      <el-table
        :data="orderItems"
        border
        height="200"
        :summary-method="getSummaries"
        show-summary
        style="width: 100%; margin-top: 20px"
      >
        <el-table-column
          prop="id"
          label="ID"
          width="180"
        />
        <el-table-column
          prop="carName"
          label="名称"
        />
        <el-table-column
          prop="carType"
          label="类型"
        />
        <el-table-column
          prop="number"
          label="数量(台)"
        />
        <el-table-column
          prop="price"
          label="价格(万)"
        />
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogOrderVisible = false">
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
import { list } from '@/api/electricVehicleInfo'
import request from '@/utils/request-api'
import waves from '@/directive/waves' // waves directive

export default {
  name: 'OilList',
  components: {},
  directives: { waves },
  filters: {
  },
  data() {
    return {
      dialogOrderVisible: false,
      order: {},
      orderOwer: { name: this.$store.state.user.userName, account: this.$store.state.user.account, tel: '18780021345', address: '四川省成都市武侯区磨子村99号' },
      orderItems: [],
      carList: []
    }
  },
  created() {
    console.log(this.$store.state.user.account)
    this.getList()
    this.listLoading = false
  },
  methods: {
    getList() {
      this.listLoading = true
      list(this.listQuery).then(response => {
        for (const car of response.data) {
          car.num = 0
          if (this.carList.length < 24) {
            if (car.price !== '无') {
              this.carList.push(car)
            }
          } else {
            return
          }
        }
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    submitOrder() {
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
    buyCar() {
      console.log(this.carList)
      this.orderItems = []
      for (const car of this.carList) {
        if (car.num) {
          const obj = Object.assign({}, car)
          obj.number = 1
          if (obj.price !== '无') {
            obj.price = obj.price.substring(0, obj.price.length - 1)
          }
          this.orderItems.push(obj)
        }
      }
      if (this.orderItems.length) {
        this.dialogOrderVisible = true
      } else {
        this.$message({
          showClose: true,
          message: '选择需要购买的商品.',
          type: 'error'
        })
      }
    },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      const result = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总价'
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            // debugger
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          sums[index]
        } else {
          sums[index] = 'N/A'
        }
      })
      for (let item of sums) {
        // debugger
        console.log()
        if (typeof item === 'number') {
          const x = String(item).indexOf('.') + 1
          const y = String(item).length - x
          // if (item.indexOf('.') !== -1) {
          //   item.toFixed(2)
          // }
          if (y > 2) {
            item = item.toFixed(2)
            console.log(item)
            console.error('执行')
          }
        }
        result.push(item)
      }
      return result
    }
  }
}
</script>
<style scoped>
  .car-container {
    color: #a13e0d;
    height: 160px;
    width: 250px;
    float: left;
    border: Grey 2px solid;
    border-radius: 15px;
    margin: 10px;
    padding: 10px;
    padding-left: 0px;
    /*background-color:rgba(224,238,238,0.2);*/
    background-color: #8c939d;
    /*box-shadow: #8c939d;*/
    box-shadow:5px 2px 8px #8c939d;
    /*transform: rotate(-1.5deg);*/
  }
  .buy-car {
    position:absolute;
    right: 2px;
    top:20px;
  }
  .car-container li{
    list-style: none;
    width: 180px;
  }
  .car-container li span{
    color:black;
    display: inline-block;
    padding-right: 10px;
  }
  .car-container .el-checkbox{
    margin-left: 40px;
    color: red;
  }
  .bottom{
    clear: both;
  }
  .main-container{
    margin: 0px;
    padding: 0px;
  }
</style>
