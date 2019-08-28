<template>
  <el-row>
    <el-col :span="6"><div class="grid-content" /></el-col>
    <el-col :span="12">
      <el-form ref="form" :inline="true" :model="form" label-width="120px">
        <fieldset>
          <legend>电动汽车参数设置</legend>
          <el-form-item label="电动汽车数量">
            <el-input v-model="form.electricVehicleNumber" type="number" :min="0" clearable>
              <template slot="append">辆</template>
            </el-input>
          </el-form-item>
          <el-form-item label="电池容量">
            <el-input v-model="form.batteryCapacity" type="number" :min="0" clearable>
              <template slot="append">kWh</template>
            </el-input>
          </el-form-item>
          <el-form-item label="充电效率">
            <el-input v-model="form.chargingEfficiency" type="number" :min="0" clearable>
              <template slot="append" />
            </el-input>
          </el-form-item>
          <el-form-item label="充电速度">
            <el-input v-model="form.chargingSpeed" type="number" :min="0" clearable>
              <template slot="append">kWh/min</template>
            </el-input>
          </el-form-item>
          <el-form-item label="电动汽车耗电量">
            <el-input v-model="form.powerConsumptionPerKilometer" type="number" :min="0" clearable>
              <template slot="append">kWh/km</template>
            </el-input>
          </el-form-item>
        </fieldset>
        <fieldset>
          <legend>充电站参数设置</legend>
          <el-form-item label="充电站数量">
            <el-input v-model="form.chargingStationNumber" type="number" :min="0" clearable>
              <template slot="append">个</template>
            </el-input>
          </el-form-item>
          <el-form-item label="充电桩个数">
            <el-input v-model="form.chargingPileNumber" type="number" :min="0" clearable>
              <template slot="append">个</template>
            </el-input>
          </el-form-item>
          <el-form-item label="停车位">
            <el-input v-model="form.parkingSpaceNumber" type="number" :min="0" clearable>
              <template slot="append">个</template>
            </el-input>
          </el-form-item>
        </fieldset>
        <fieldset>
          <legend>仿真策略设置</legend>
          <el-form-item label="交易策略">
            <el-radio-group v-model="form.transactionStrategy">
              <el-radio :label="0">默认方式</el-radio>
              <el-radio :label="1">迭代双拍卖</el-radio>
              <el-radio :label="2">VCG</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="步长设置">
            <!--<el-input v-model="form.step" />-->
            <el-input-number v-model="form.step" :min="0" :step="5" />
          </el-form-item>
        </fieldset>
        <el-form-item class="container-btn">
          <el-button type="primary" class="parameter-save" @click="onSubmit">保存</el-button>
          <!--<el-button>取消</el-button>-->
        </el-form-item>
      </el-form>
    </el-col>
    <el-col :span="6"><div class="grid-content" /></el-col>
  </el-row>
</template>

<script>
import { list, save } from '@/api/simulationParameterSetting'
export default {
  name: 'SimulationParameterSetting',
  data() {
    return {
      form: {
        id: null,
        batteryCapacity: 24,
        electricVehicleNumber: 100,
        chargingEfficiency: 0.95,
        powerConsumptionPerKilometer: 0.179,
        chargingSpeed: 0.055,
        chargingStationNumber: 20,
        chargingPileNumber: 10,
        parkingSpaceNumber: 10,
        transactionStrategy: 0,
        step: 30,
        remark: null
      }
    }
  },
  created() {
    list().then(response => {
      if (response.code === 200) {
        if (response.data.length) {
          console.log(response.data)
          response.data[0].transactionStrategy = parseInt(response.data[0].transactionStrategy)
          this.form = response.data[0]
        }
      }
    })
  },
  methods: {
    onSubmit() {
      save(this.form).then(response => {
        if (response.code === 200) {
          this.$message({
            showClose: true,
            message: '保存成功',
            type: 'success'
          })
        }
      })
      console.log('submit!')
    }
  }
}
</script>

<style scoped>
  .el-row {
    margin-top: 40px;
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .parameter-save{
    float: right;
  }
  .container-btn{
    width: 100%;
  }
  /*.container-btn div{
    width: 100%;
  }*/
</style>
<style>
  .container-btn div{
    width: 100%;
  }
  .container-btn div button{
    margin-top: 20px;
    margin-right: 20px;
  }
</style>
