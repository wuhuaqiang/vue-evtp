<template>
  <el-row>
    <el-col :span="6"><div class="grid-content" /></el-col>
    <el-col :span="12">
      <el-form ref="form" :inline="true" :model="form" label-width="120px">
        <fieldset>
          <legend>电动汽车参数设置</legend>
          <el-form-item label="电动汽车数量">
            <el-input v-model="form.electricVehicleNumber" />
          </el-form-item>
          <el-form-item label="电池容量">
            <el-input v-model="form.batteryCapacity" />
          </el-form-item>
          <el-form-item label="充电效率">
            <el-input v-model="form.chargingEfficiency" />
          </el-form-item>
          <el-form-item label="充电速度">
            <el-input v-model="form.chargingSpeed" />
          </el-form-item>
          <el-form-item label="电动汽车耗电量">
            <el-input v-model="form.powerConsumptionPerKilometer" />
          </el-form-item>
        </fieldset>
        <fieldset>
          <legend>充电站参数设置</legend>
          <el-form-item label="充电站数量">
            <el-input v-model="form.chargingStationNumber" />
          </el-form-item>
          <el-form-item label="充电桩个数">
            <el-input v-model="form.chargingPileNumber" />
          </el-form-item>
          <el-form-item label="停车位">
            <el-input v-model="form.parkingSpaceNumber" />
          </el-form-item>
        </fieldset>
        <fieldset>
          <legend>仿真策略设置</legend>
          <el-form-item label="交易策略">
            <el-radio-group v-model="form.transactionStrategy">
              <el-radio label="默认方式" />
              <el-radio label="迭代双拍卖" />
            </el-radio-group>
          </el-form-item>
          <el-form-item label="步长设置">
            <el-input v-model="form.step" />
          </el-form-item>
        </fieldset>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">提交</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <el-col :span="6"><div class="grid-content" /></el-col>
  </el-row>
</template>

<script>
export default {
  name: 'SimulationParameterSetting',
  data() {
    return {
      form: {
        id: null,
        batteryCapacity: null,
        electricVehicleNumber: null,
        chargingEfficiency: null,
        powerConsumptionPerKilometer: null,
        chargingSpeed: null,
        chargingStationNumber: null,
        chargingPileNumber: null,
        parkingSpaceNumber: null,
        transactionStrategy: null,
        step: null,
        remark: null
      }
    }
  },
  methods: {
    onSubmit() {
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
</style>
