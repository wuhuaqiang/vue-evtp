<template>
  <div class="main-container">
    <el-button type="primary" class="buy-car" icon="el-icon-star-off" @click="buyCar">购买</el-button>
    <div v-for="car in carList" :key="car.id" class="car-container">
      <ul>
        <li v-show="false"><span>编号:</span><a>{{ car.id }}</a></li>
        <li><span>名称:</span><a>{{ car.carName }}</a></li>
        <li><span>类型:</span><a>{{ car.carType }}</a></li>
        <li><span>价格:</span><a>{{ car.price }}</a></li>
        <li><span>车重:</span><a>{{ car.quality }}</a></li>
        <li><span>电池容量:</span><a>{{ car.batteryCapacity }}</a></li>
        <li><span>充电时间:</span><a>{{ car.chargingTime }}</a></li>
        <li><span>电量损耗:</span><a>{{ car.powerConsumption }}</a></li>
        <li><span>最大行程:</span><a>{{ car.maximumRange }}</a></li>
      </ul>
      <el-input-number v-model="car.num" :min="0" :max="5" label="购买数量" />
    </div>
    <div class="bottom" />
  </div>
</template>

<script>
import { list } from '@/api/electricVehicleInfo'
import waves from '@/directive/waves' // waves directive

export default {
  name: 'CarList',
  components: {},
  directives: { waves },
  filters: {
  },
  data() {
    return {
      carList: []
    }
  },
  created() {
    this.getList()
    this.listLoading = false
  },
  methods: {
    getList() {
      this.listLoading = true
      list(this.listQuery).then(response => {
        let i = 0
        for (const car of response.data) {
          i++
          if (i < 13) {
            car.num = 0
            this.carList.push(car)
          }
        }
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    buyCar() {
      console.log(this.carList)
    }
  }
}
</script>
<style scoped>
  .car-container {
    width: 250px;
    float: left;
    border: #bfbfbf 2px solid;
    border-radius: 15px;
    margin: 20px;
    padding: 10px;
    padding-left: 0px;
    background: #8c939d;
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
  .car-container .el-input-number{
    margin-left: 40px;
  }
  .bottom{
    clear: both;
  }
</style>
