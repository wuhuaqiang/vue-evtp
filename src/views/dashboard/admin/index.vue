<template>
  <div class="evtp-container">
    <el-row>
      <el-col :span="12">
        <div class="left-container grid-content bg-purple">
          <baidu-map class="map" :center="center" :zoom="zoom" :scroll-wheel-zoom="true" @ready="handler">
            <!--<bm-control>-->
            <!--<el-radio-group v-model="isCollapse" style="margin-bottom: 20px;">-->
            <!--<el-radio-button :label="false">展开</el-radio-button>-->
            <!--<el-radio-button :label="true">收起</el-radio-button>-->
            <!--</el-radio-group>-->
            <!--<el-menu default-active="1-4-1" class="el-menu-vertical-demo" :collapse="isCollapse" @open="handleOpen" @close="handleClose">-->
            <!--<el-submenu index="1">-->
            <!--<template slot="title">-->
            <!--<i class="el-icon-location" />-->
            <!--<span slot="title">导航一</span>-->
            <!--</template>-->
            <!--<el-menu-item-group>-->
            <!--<span slot="title">分组一</span>-->
            <!--<el-menu-item index="1-1">选项1</el-menu-item>-->
            <!--<el-menu-item index="1-2">选项2</el-menu-item>-->
            <!--</el-menu-item-group>-->
            <!--<el-menu-item-group title="分组2">-->
            <!--<el-menu-item index="1-3">选项3</el-menu-item>-->
            <!--</el-menu-item-group>-->
            <!--<el-submenu index="1-4">-->
            <!--<span slot="title">选项4</span>-->
            <!--<el-menu-item index="1-4-1">选项1</el-menu-item>-->
            <!--</el-submenu>-->
            <!--</el-submenu>-->
            <!--<el-menu-item index="2">-->
            <!--<i class="el-icon-menu" />-->
            <!--<span slot="title">导航二</span>-->
            <!--</el-menu-item>-->
            <!--<el-menu-item index="3">-->
            <!--&lt;!&ndash;disabled&ndash;&gt;-->
            <!--<i class="el-icon-document" />-->
            <!--<span slot="title">导航三</span>-->
            <!--</el-menu-item>-->
            <!--<el-menu-item index="4">-->
            <!--<i class="el-icon-setting" />-->
            <!--<span slot="title">导航四</span>-->
            <!--</el-menu-item>-->
            <!--</el-menu>-->
            <!--</bm-control>-->
            <bm-control anchor="BMAP_ANCHOR_TOP_LEFT" class="point-ctr">
              <el-button size="mini" type="primary" icon="el-icon-search" class="point-btn" @click="getPoints">初始化点位</el-button>
            </bm-control>
            <bm-control anchor="BMAP_ANCHOR_TOP_LEFT" class="marker-ctr">
              <el-button size="mini" type="primary" icon="el-icon-search" class="marker-btn" @click="initMapMarker">初始化覆盖物</el-button>
            </bm-control>
            <bm-control anchor="BMAP_ANCHOR_TOP_LEFT" class="action-ctr">
              <el-button size="mini" type="primary" icon="el-icon-search" class="action-btn" @click="initAction">模拟</el-button>
            </bm-control>
            <bm-copyright
              anchor="BMAP_ANCHOR_TOP_RIGHT"
              :copyright="[{id: 1, content: 'Copyright Message', bounds: {ne: {lng: 110, lat: 40}, sw:{lng: 0, lat: 0}}}, {id: 2, content: '<a>电量交易系统专用地图</a>'}]"
            />
            <!--<bm-panorama></bm-panorama>-->
            <bm-marker
              v-for="(item,key) in tElectricVehiclePoints"
              :key="key"
              :label="item.label"
              :position="item.point"
              :dragging="true"
              :icon="item.carIcon"
              :title="item.title"
            />
            <bm-marker
              v-for="(item,key) in tChargingStations"
              :key="('0'+key)"
              :label="item.label"
              :position="item.point"
              :dragging="true"
              :icon="stationIcon"
              :title="item.title"
            />
            <!--<bm-driving
              start="{lng: 104.130648, lat: 30.57432}"
              end="{lng: 104.130648, lat: 30.57432}"
              :auto-viewport="true"
              :waypoints="[{lng: 104.088899, lat: 30.790211}, {lng: 103.940602, lat: 30.715246}]"></bm-driving>-->
            <!--<bm-label content="我爱北京天安门" :labelStyle="{color: 'red', fontSize : '12px'}" :offset="{width: -35, height: 30}"/>
            animation="BMAP_ANIMATION_BOUNCE"-->
            <!--</bm-marker>-->
            <bm-tile
              :is-transparent-png="true"
              tile-url-template="//developer.baidu.com/map/jsdemo/demo/tiles/{Z}/tile{X}_{Y}.png"
            />
            <bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :show-address-bar="true" :auto-location="true" />
            <bm-scale anchor="BMAP_ANCHOR_TOP_RIGHT" />
            <bm-navigation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" />
            <bm-map-type :map-types="['BMAP_NORMAL_MAP', 'BMAP_HYBRID_MAP']" anchor="BMAP_ANCHOR_TOP_RIGHT" />
            <bm-city-list anchor="BMAP_ANCHOR_TOP_LEFT" />
            <bm-polyline
              :path="polygonPath"
              stroke-color="blue"
              :stroke-opacity="0.5"
              :stroke-weight="10"
              @lineupdate="updatePolygonPath"
            />
          </baidu-map>
        </div>
      </el-col>
      <el-col :span="12"><div class="right-container grid-content bg-purple-light">
        <el-row>
          <el-col :span="12"><div id="echartsNum1" class="result-table grid-content bg-purple" /></el-col>
          <el-col :span="12"><div id="echartsNum2" class="result-table grid-content bg-purple-light" /></el-col>
        </el-row>
        <el-row>
          <el-col :span="12"><div id="echartsNum3" class="result-table grid-content bg-purple" /></el-col>
          <el-col :span="12"><div id="echartsNum4" class="result-table grid-content bg-purple-light" /></el-col>
        </el-row>
      </div></el-col>
    </el-row>
  </div>
</template>
<script>
// import { connectionSocket, disconnectSocket } from '@/utils/websocket'
import stationImg from '@/assets/images/chargingStation.png'
import car_normalImg from '@/assets/images/car_normal.png'
import car_xycdImg from '@/assets/images/car_xycd.gif'
import car_xyjyImg from '@/assets/images/car_xyjy.gif'
import car_zzcdImg from '@/assets/images/car_zzcd.gif'
import axios from 'axios'
// import { getAllListWithLine } from '@/api/electricVehicle'
import { save, delAll, getOneById } from '@/api/evtpPoints'
import { list } from '@/api/chargingStation'
import { queryUserList } from '@/api/evtpUser'
import { list as pointTypeList } from '@/api/evtpPointsType'
import { initMap, evtpAction } from '@/api/evtpMap'
import { goToWork, goToTask } from '@/utils/evtpUserUtil'
import { Queue } from '@/utils/queue'
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
import echarts from 'echarts'

export default {
  data() {
    return {
      stompClient: '',
      isCollapse: true,
      upColor: '#00da3c',
      downColor: '#ec0000',
      BMap: '',
      map: '',
      minTime: 0,
      v_TMap: {},
      v_kMap: {},
      timeArr: [],
      chargingStationArr: [],
      chargingMatchQueue: new Queue(),
      timer: '',
      car_normalIcon: {
        url: car_normalImg,
        size: { width: 18, height: 18 },
        opts: {
          anchor: { width: 0, height: 0 },
          imageOffset: { width: 0, height: 0 },
          imageSize: { width: 18, height: 18 },
          infoWindowAnchor: { width: 0, height: 0 },
          printImageUrl: car_normalImg
        }
      },
      car_xycdIcon: {
        url: car_xycdImg, // http://10.168.1.245:8088/api/images/car_xycd.gif
        size: { width: 18, height: 18 },
        opts: {
          anchor: { width: 0, height: 0 },
          imageOffset: { width: 0, height: 0 },
          imageSize: { width: 18, height: 18 },
          infoWindowAnchor: { width: 0, height: 0 },
          printImageUrl: car_xycdImg
        }
      },
      car_xyjyIcon: {
        url: car_xyjyImg, // http://10.168.1.245:8088/api/images/car_xyjy.gif
        size: { width: 18, height: 18 },
        opts: {
          anchor: { width: 0, height: 0 },
          imageOffset: { width: 0, height: 0 },
          imageSize: { width: 18, height: 18 },
          infoWindowAnchor: { width: 0, height: 0 },
          printImageUrl: car_xyjyImg
        }
      },
      car_zzcdIcon: {
        url: car_zzcdImg, // http://10.168.1.245:8088/api/images/car_xyjy.gif
        size: { width: 18, height: 18 },
        opts: {
          anchor: { width: 0, height: 0 },
          imageOffset: { width: 0, height: 0 },
          imageSize: { width: 18, height: 18 },
          infoWindowAnchor: { width: 0, height: 0 },
          printImageUrl: car_zzcdImg
        }
      },
      stationIcon: {
        url: stationImg, // http://10.168.1.245:8088/api/images/chargingStation.png
        size: { width: 40, height: 40 },
        opts: {
          anchor: { width: 0, height: 0 },
          imageOffset: { width: 0, height: 0 },
          imageSize: { width: 40, height: 40 },
          infoWindowAnchor: { width: 0, height: 0 },
          printImageUrl: stationImg
        }
      },
      tElectricVehiclePoints: [],
      ResultArray: [],
      tChargingStations: [],
      point: { lng: 103.980118, lat: 30.634065 },
      msg: 'SocketJS',
      websocket: null,
      center: '成都',
      zoom: 13,
      polygonPath: [
        { lng: 103.940118, lat: 30.734065 },
        { lng: 104.208116, lat: 30.734065 },
        { lng: 104.208116, lat: 30.579724 },
        { lng: 103.940118, lat: 30.579724 },
        { lng: 103.940118, lat: 30.734065 }
      ]
    }
  },
  created() {
    console.log(this)
    // console.log(this.chargingMatchQueue)
    // console.log(this)
    // setInterval(this.moveStep, 1000)
    this.getAllElectricVehicleDatas()
    this.getAllTChargingStation()
    // 建立连接对象
    const socket = new SockJS('/ws/queueServer')
    // 获取STOMP子协议的客户端对象
    this.stompClient = Stomp.over(socket)
    // 定义客户端的认证信息,按需求配置
    const headers = {
      Authorization: ''
    }
    // 向服务器发起websocket连接
    this.stompClient.connect(headers, () => {
      this.stompClient.subscribe('/ws/user/queue/message', (msg) => { // 订阅服务端提供的某个topic
        console.log('广播成功')
        console.log(msg) // msg.body存放的是服务端发送给我们的信息
      }, headers)
    }, (err) => {
      // 连接发生错误时的处理函数
      console.log('失败')
      console.log(err)
    })
    if ('WebSocket' in window) {
      this.websocket = new WebSocket('ws://10.168.1.102:2004/websocket')
      // 连接发生错误的回调方法
      this.websocket.onerror = () => {
        console.log('与服务器连接失败...')
      }
      // 连接成功建立的回调方法
      this.websocket.onopen = (event) => {
        console.log('与服务器连接成功...')
      }
      // 接收到消息的回调方法
      this.websocket.onmessage = (event) => {
        const obj = JSON.parse(event.data)
        for (const item of this.tElectricVehiclePoints) {
          for (const o of obj) {
            if (item.id === o.id) {
              console.log(o)
              if (o.remark) {
                // debugger
                console.log(o.remark)
                switch (o.remark) {
                  case '需要充电':
                    item.carIcon = this.car_xycdIcon
                    goToTask(this.BMap, this.map, o.evPoint, o.csPoint, o.id, '充电', 0)
                    break
                  case '继续上班':
                    item.carIcon = this.car_normalIcon
                    goToTask(this.BMap, this.map, o.evPoint, o.edPoint, o.id, o.remark, 0)
                    break
                  case '继续下班':
                    item.carIcon = this.car_normalIcon
                    goToTask(this.BMap, this.map, o.evPoint, o.edPoint, o.id, o.remark, 0)
                    break
                  case '继续其他':
                    item.carIcon = this.car_normalIcon
                    goToTask(this.BMap, this.map, o.evPoint, o.edPoint, o.id, o.remark, 0)
                    break
                  case '正在充电':
                    item.carIcon = this.car_zzcdIcon
                    break
                  case '需要救援':
                    item.carIcon = this.car_xyjyIcon
                    break
                  default:
                    goToTask(this.BMap, this.map, o.evPoint, o.edPoint, o.id, o.remark, 0)
                }
              } else {
                if (o.mark === '去充电') {
                  item.carIcon = this.car_xycdIcon
                } else {
                  item.carIcon = this.car_normalIcon
                }
                item.point = o.evPoint
              }
            }
          }
        }
        // console.log(this.tElectricVehiclePoints)
        // console.log(JSON.parse(event.data))
      }
      // 连接关闭的回调方法
      this.websocket.onclose = () => {
        console.log('已关闭当前链接')
      }
      // 监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
      window.onbeforeunload = () => {
        this.websocket.close()
      }
    } else {
      alert('Not support websocket')
    }
  },
  mounted() {
    const xStr = '0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,14,14,15,15,16,16,17,17,18,18,19,19,20,20,21,21,22,22,23,23,24'
    const yStr = '0.3,0.3,0.3,0.3,0.3,0.3,0.3,0.3,0.3,0.3,0.3,0.3,0.3,0.31,0.32,0.33,0.3,0.3,0.3,0.3,0.3,0.31,0.3,0.3,0.33,0.33,0.31,0.31,0.3,0.3,0.36,0.35,0.33,0.33,0.3,0.3,0.3,0.3,0.3,0.3,0.3,0.3,0.3,0.3,0.3,0.3,0.3,0.3'
    const zStr = '0.27,0.27,0.23,0.23,0.18,0.18,0.06,0.06,0.06,0.06,0.21,0.21,0.41,0.41,0.51,0.51,0.6,0.6,0.61,0.61,0.58,0.58,0.57,0.57,0.56,0.56,0.57,0.57,0.56,0.56,0.52,0.52,0.55,0.55,0.64,0.64,0.75,0.75,0.67,0.67,0.63,0.63,0.53,0.53,0.54,0.54,0.56,0.56'
    this.addEchart3('echartsNum1', xStr, yStr, zStr)

    const xStr1 = '2.5633,2.7608,3.0077,3.3143,3.6741,4.1136,4.5458,4.751,5.0359,5.2342,5.3913,5.5708,6.0489,6.4636,6.8046,7.1503,7.7156,8.3996,8.9838,9.7095,10.3953,11.8872,13.2528,13.7508,14.3453,15.1526,15.87,16.7588,17.6524,18.5723,19.5867,20.776,21.6106,22.5594,23.6566,24.7568,25.5315,27.2857,28.6602,29.623,31.0918,31.6654,32.3498,33.3315,33.9584,34.7572,35.314,35.8567,36.4692,36.7825,37.0034,37.2661,37.899,38.3672,39.0135,39.546,40.1818,41.3332,42.5312,43.9274,44.8536,46.124,47.1116,48.0528,48.5388,48.9316,49.1816,49.5528,50.1359,50.4287,51.0541,51.4353,52.1165,52.8162,53.5823,54.2786,54.8708,55.3445,56.0857,56.7295,56.9872,57.3494,57.8191,58.5743,59.3823,60.1373,60.7328,61.3067,62.2174,62.9114'
    const yStr1 = '2.5713,3.688,5.1186,6.5103,8.0201,9.1373,9.9337,10.0749,10.2463,10.3366,10.3366,10.2822,9.9993,9.6123,9.1845,8.7509,8.0947,7.5312,7.1643,6.9809,6.8512,6.8792,6.8546,6.7839,6.6995,6.6249,6.6182,6.6182,6.7947,6.9526,7.0514,7.0553,7.1744,7.3927,7.7876,8.345,8.8807,10.6237,12.5275,14.2995,16.9543,17.8158,18.7082,20.1475,21.2762,23.0702,24.4194,25.7798,26.7937,27.1531,27.2971,27.4033,27.442,27.3286,27.3484,27.6687,28.444,30.577,32.888,35.0376,36.1258,37.3849,38.2938,39.3352,39.6803,39.7013,39.6518,39.2564,38.0844,37.0568,34.786,33.1402,30.4639,28.2133,26.4835,25.7278,25.392,25.35,25.5599,25.7638,25.8454,25.8061,25.5753,24.7607,23.2009,21.4622,19.9488,18.4032,15.7834,14.0449'
    this.addEchart2('echartsNum2', xStr1, yStr1, 't/h', 'kWh', '充电负荷', '充电负荷')

    const xStr2 = '0.5,1.4448,3.0866,4.6526,6.228,6.964,7.4407,7.9798,9.3576,10.5115,12.1413,14.1043,15.7099,17.0706,18.32,19.1468,19.6946,20.4565,21.2215,21.485,22.1646,22.6902,23.2982,24.0385,24.803,25.4322,26.1455,26.8603,28.2104,29.2886,30.4192,32.6772,34.787,35.8857,36.6884,38.0352,39.0551,39.7682,40.6754,41.4276,41.9496,42.7214,43.7646,45.3248,46.0527,46.8338,47.6971,49.0019,49.7278,50.837,52.5004,54.4163,61.6374,63.4778,65.5384'
    const yStr2 = '0.5,0.223,0.6973,1.2964,2.2191,2.7922,3.1954,3.6618,5.0971,6.6032,9.1056,12.7651,16.1355,19.031,21.7301,23.4034,24.401,25.7397,26.9584,27.4248,28.3192,28.9143,29.4969,29.9671,30.2338,30.2338,30.109,29.787,28.5642,27.1138,25.2526,20.8047,16.2605,13.9289,12.2891,9.7644,8.0927,7.0704,5.8283,4.8796,4.3596,3.579,2.6663,1.6279,1.2663,0.9444,0.6398,0.2848,0.3,0.2,0.2,0.2,0.2,0.2,0.2'
    this.addEchart2('echartsNum3', xStr2, yStr2, '', '', '出发时间概率密度分布', '出发时间概率密度分布')

    const xStr3 = '0,2.0811,2.8479,4.0787,6.1125,7.2427,8.2067,9.013,9.831,10.4947,11.8501,13.2807,14.5613,16.5199,18.6398,20.4353,22.3099,24.2507,25.1799,26.1974,27.8425,29.4648,30.4268,31.3905,32.6744,34.2375,35.2424,36.2791,36.9509,37.6084,38.26,38.8304,39.6668,40.8399,42.1789,43.1562,43.6915,44.451,45.3376,46.0422,46.557,46.9253,47.2731,47.754,48.0345,48.1263,49.3387,49.8372,50.5736,51.704,52.3978,52.8334,53.895,54.5911,55.5671,56.9552,57.5762,58.2606,58.8514,59.9756,63.6435,64.2146,65.8059,66.4376'
    const yStr3 = '4.9405,3.1769,2.6885,2.0139,1.1843,0.8752,0.676,0.5056,0.4148,0.3371,0.2454,0.1789,0.0993,0.0993,0.1622,0.2992,0.5962,1.0019,1.2379,1.6171,2.4468,3.562,4.36,5.3061,6.7535,8.8129,10.3563,12.1095,13.2529,14.4503,15.5877,16.6667,18.166,20.3321,22.7454,24.3363,25.1232,26.0978,27.1257,27.7645,28.1709,28.419,28.5963,28.7994,28.9048,28.9329,28.9379,28.7938,28.3873,27.5514,26.8662,26.3483,24.8831,23.857,22.2232,19.7732,18.6427,17.3587,16.276,14.181,8.2412,7.4417,5.5574,4.9768'
    this.addEchart2('echartsNum4', xStr3, yStr3, '', '', '返回时间概率密度分布', '返回时间概率密度分布')
    this.addZlineTu()
    this.addEchartRandom()
    this.addKLineTu()
    this.addPointTu()
  },
  beforeDestroy() {
    if (this.stompClient) {
      this.stompClient.disconnect()
    }
  },
  methods: {
    handler({ BMap, map }) {
      this.drawBoundary(BMap, map)
      this.BMap = BMap
      this.map = map
    },
    nearestChargingStation(car, chargingStations) {
      console.log(car)
      this.chargingMatchQueue.enqueue(car)
      // console.log(chargingStations[0])
      const carPoint = new this.BMap.Point(car.point.lng, car.point.lat)
      for (let i = 0; i < chargingStations.length; i++) {
        const stationPoint = new this.BMap.Point(chargingStations[i].point.lng, chargingStations[i].point.lat)
        // this.chargingStationArr.push(chargingStations[i])
        const searchComplete = (results) => {
          if (transit.getStatus() !== 0) {
            return
          }
          const plan = results.getPlan(0)
          const duration = plan.getDuration(true)
          let newMin = 0
          let newHour = 0
          if (duration.indexOf('小时') === -1) {
            newMin = parseInt(duration)
          } else if (duration.indexOf('分钟') === -1) {
            newHour = parseInt(duration.substring(0, duration.indexOf('小时')))
          } else {
            newHour = parseInt(duration.substring(0, duration.indexOf('小时')))
            newMin = parseInt(duration.substring(duration.indexOf('小时') + 2, duration.indexOf('分钟')))
          }
          const currTimeLong = (newHour * 60 + newMin) * 60 * 1000
          this.timeArr.push(currTimeLong)
          // console.log('*****************************')
          // console.log(currTimeLong)
          // console.log(this.timeArr)
          if (this.timeArr.length === chargingStations.length) {
            // console.log(this.timeArr)
            // console.log(chargingStations)
            // debugger
            let minTime = this.timeArr[0]
            // let index = 0
            let obj = null
            for (let j = 0; j < this.timeArr.length; j++) {
              if (this.timeArr[j] < minTime) {
                minTime = this.timeArr[j]
                obj = chargingStations[j]
                // index = j
              }
            }
            const carTemp = this.chargingMatchQueue.dequeue()
            console.log('*****************************')
            console.log(carTemp)
            console.log(this.timeArr)
            console.log(chargingStations)
            console.log(obj)
            console.log('*****************************')
            // debugger
            // console.log(this.chargingStationArr)
            // console.log('*****************************')
            // console.log(car)
            // console.log('*****************************')
            // console.log(obj)
            // console.log('*****************************')
            // console.log(index)
            // console.log('*****************************')
            // console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx')
            // // console.log(index)
            // console.log(chargingStations)
            // console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx')
            // const obj = {
            //   car: car,
            //   minTime: minTime,
            //   chargingStation: chargingStations[index]
            // }
            // console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^')
            // console.log(this.chargingStationArr[index])
            // console.log(obj)
            // console.log('--------------------------------------------')
            goToTask(this.BMap, this.map, carTemp.point, obj.point, car.id, '充电', 0)
            // this.chargingMatchQueue.enqueue(obj)
            this.timeArr = []
            this.chargingStationArr = []
            // console.log(this.chargingMatchQueue)
            // console.log(this.timeArr)
          }
        }
        const transit = new this.BMap.DrivingRoute(this.map, { onSearchComplete: searchComplete })
        transit.search(carPoint, stationPoint)
      }
    },
    splitData(rawData) {
      const categoryData = []
      const values = []
      const volumes = []
      for (var i = 0; i < rawData.length; i++) {
        categoryData.push(rawData[i].splice(0, 1)[0])
        values.push(rawData[i])
        volumes.push([i, rawData[i][4], rawData[i][0] > rawData[i][1] ? 1 : -1])
      }

      return {
        categoryData: categoryData,
        values: values,
        volumes: volumes
      }
    },
    initMapMarker() {
      initMap().then((response) => {
        if (response.code === 200) {
          this.tElectricVehiclePoints = []
          this.tChargingStations = []
          this.getAllElectricVehicles()
          this.getAllTChargingStation()
          this.$message({
            message: '初始化成功',
            type: 'success'
          })
        }
      })
    },
    initAction() {
      evtpAction().then((response) => {
        if (response.code === 200) {
          this.$message({
            message: '初始化成功',
            type: 'success'
          })
        }
      })
    },
    getPoints() {
      this.ResultArray = []
      delAll().then(() => {
        pointTypeList().then(response => {
          // console.log(response)
          const kVs = response.data
          const centerPoint = new this.BMap.Point(104.07, 30.67)
          const r = 5000
          kVs.map(obj => {
            // console.log(this.v_TMap)
            // console.log(this.v_kMap)
            // debugger
            this.v_TMap[obj.value] = obj.remark
            this.v_kMap[obj.value] = obj.num
            // console.log(obj)
            // debugger
            // console.log('**********************************')
            this.savePoints(obj.num, obj.value, obj.remark, centerPoint, r)
            // console.log('**********************************')
            // this.sleep(6000)
          })
        })
      })
    },
    /**
     * @param key 编号
     * @param value 关键字
     * @param type 关键字分类
     * @param centerPoint 搜索中心点
     * @param r 搜索半径
     */
    savePoints(key, value, type, centerPoint, r) {
      const this_ = this
      // console.log('执行****')
      // debugger
      const options = {
        pageCapacity: 50,
        onSearchComplete: function(results) {
          // console.log(results)
          const keyword = results.keyword
          // 需要获取当前搜索总共有多少条结果
          const totalResults = results.getNumPois()
          if (!totalResults) {
            return
          }
          // 需要获取当前搜索总共有多少条结果
          var totalPages = results.getNumPages()
          var currPage = results.getPageIndex()// 获取当前是第几页数据
          // const ResultArray = []
          this_.savePointsUtil(results.Ar, keyword)
          if (currPage < totalPages - 1) {
            // this_.ResultArray.push(...results.Ar)
            local.gotoPage(currPage + 1)
            // console.log(ResultArray)
          // } else {
            // this_.savePointsUtil(results.Ar,keyword)
            // this_.ResultArray.push(...results.Ar)
            // map.clearOverlays()
            // for (const store of this_.ResultArray) {
            //   const obj = {}
            //   obj.id = store.uid
            //   obj.lat = store.point.lat
            //   obj.lng = store.point.lng
            //   obj.title = store.title
            //   obj.address = store.address
            //   // obj.remark = '家'
            //   // obj.type = 0
            //   obj.remark = type
            //   obj.type = key
            //   save(JSON.stringify(obj)).then(response => {
            //     console.log(response)
            //   })
            //   // const marker = new this_.BMap.Marker(store.point)
            //   // this_.map.addOverlay(marker)
            //   this_.ResultArray = []
            // }
          }
        }
      }
      const local = new this.BMap.LocalSearch(this.map, options)
      local.searchNearby(value, centerPoint, r)
      // local.search('公园')
      // const mPoint = new this.BMap.Point(104.07, 30.67)
      // local.searchNearby('地产小区', mPoint, 5000)
      // local.searchNearby('小区/楼盘', mPoint, 5000)
      // local.searchNearby('公司', mPoint, 5000)
      // local.searchNearby('写字楼', mPoint, 5000)
    },
    savePointsUtil(arr, keyword) {
      console.log('*********************************')
      console.log(keyword)
      console.log(arr)
      console.log('*********************************')
      for (const store of arr) {
        const obj = {}
        obj.id = store.uid
        obj.lat = store.point.lat
        obj.lng = store.point.lng
        obj.title = store.title
        obj.address = store.address
        // obj.remark = '家'
        // obj.type = 0
        obj.remark = this.v_TMap[keyword]
        obj.type = this.v_kMap[keyword]
        console.log(JSON.stringify(obj))
        save(JSON.stringify(obj)).then(response => {
          // console.log(response)
        })
        // const marker = new this_.BMap.Marker(store.point)
        // this_.map.addOverlay(marker)
      }
    },
    calculateMA(dayCount, data) {
      var result = []
      for (var i = 0, len = data.values.length; i < len; i++) {
        if (i < dayCount) {
          result.push('-')
          continue
        }
        var sum = 0
        for (var j = 0; j < dayCount; j++) {
          sum += data.values[i - j][1]
        }
        result.push(+(sum / dayCount).toFixed(3))
      }
      return result
    },
    addPointTu() {
      const option = {
        title: {
          text: '充放电分布情况',
          subtext: '抽样调查来自100辆电动车'
        },
        grid: {
          left: '3%',
          right: '7%',
          bottom: '3%',
          containLabel: true
        },
        tooltip: {
          // trigger: 'axis',
          showDelay: 0,
          formatter: (params) => {
            if (params.value.length > 1) {
              return params.seriesName + ' :<br/>' + params.value[0] + 'cm ' + params.value[1] + 'kWh '
            } else {
              return params.seriesName + ' :<br/>' + params.name + ' : ' + params.value + 'kWh '
            }
          },
          axisPointer: {
            show: true,
            type: 'cross',
            lineStyle: {
              type: 'dashed',
              width: 1
            }
          }
        },
        toolbox: {
          feature: {
            dataZoom: {},
            brush: {
              type: ['rect', 'polygon', 'clear']
            }
          }
        },
        brush: {
        },
        legend: {
          data: ['充电', '放电'],
          left: 'center'
        },
        xAxis: [
          {
            type: 'value',
            scale: true,
            axisLabel: {
              formatter: '{value} t'
            },
            splitLine: {
              show: false
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            scale: true,
            axisLabel: {
              formatter: '{value} kWh'
            },
            splitLine: {
              show: false
            }
          }
        ],
        series: [
          {
            name: '充电',
            type: 'scatter',
            data: [[161.2, 51.6], [167.5, 59.0], [159.5, 49.2], [157.0, 63.0], [155.8, 53.6],
              [170.0, 59.0], [159.1, 47.6], [166.0, 69.8], [176.2, 66.8], [160.2, 75.2],
              [172.5, 55.2], [170.9, 54.2], [172.9, 62.5], [153.4, 42.0], [160.0, 50.0],
              [147.2, 49.8], [168.2, 49.2], [175.0, 73.2], [157.0, 47.8], [167.6, 68.8],
              [159.5, 50.6], [175.0, 82.5], [166.8, 57.2], [176.5, 87.8], [170.2, 72.8],
              [174.0, 54.5], [173.0, 59.8], [179.9, 67.3], [170.5, 67.8], [160.0, 47.0],
              [154.4, 46.2], [162.0, 55.0], [176.5, 83.0], [160.0, 54.4], [152.0, 45.8],
              [162.1, 53.6], [170.0, 73.2], [160.2, 52.1], [161.3, 67.9], [166.4, 56.6],
              [168.9, 62.3], [163.8, 58.5], [167.6, 54.5], [160.0, 50.2], [161.3, 60.3],
              [167.6, 58.3], [165.1, 56.2], [160.0, 50.2], [170.0, 72.9], [157.5, 59.8],
              [167.6, 61.0], [160.7, 69.1], [163.2, 55.9], [152.4, 46.5], [157.5, 54.3],
              [168.3, 54.8], [180.3, 60.7], [165.5, 60.0], [165.0, 62.0], [164.5, 60.3],
              [156.0, 52.7], [160.0, 74.3], [163.0, 62.0], [165.7, 73.1], [161.0, 80.0],
              [162.0, 54.7], [166.0, 53.2], [174.0, 75.7], [172.7, 61.1], [167.6, 55.7],
              [151.1, 48.7], [164.5, 52.3], [163.5, 50.0], [152.0, 59.3], [169.0, 62.5],
              [164.0, 55.7], [161.2, 54.8], [155.0, 45.9], [170.0, 70.6], [176.2, 67.2],
              [170.0, 69.4], [162.5, 58.2], [170.3, 64.8], [164.1, 71.6], [169.5, 52.8],
              [163.2, 59.8], [154.5, 49.0], [159.8, 50.0], [173.2, 69.2], [170.0, 55.9],
              [161.4, 63.4], [169.0, 58.2], [166.2, 58.6], [159.4, 45.7], [162.5, 52.2],
              [159.0, 48.6], [162.8, 57.8], [159.0, 55.6], [179.8, 66.8], [162.9, 59.4],
              [161.0, 53.6], [151.1, 73.2], [168.2, 53.4], [168.9, 69.0], [173.2, 58.4],
              [171.8, 56.2], [178.0, 70.6], [164.3, 59.8], [163.0, 72.0], [168.5, 65.2],
              [166.8, 56.6], [172.7, 105.2], [163.5, 51.8], [169.4, 63.4], [167.8, 59.0],
              [159.5, 47.6], [167.6, 63.0], [161.2, 55.2], [160.0, 45.0], [163.2, 54.0],
              [162.2, 50.2], [161.3, 60.2], [149.5, 44.8], [157.5, 58.8], [163.2, 56.4],
              [172.7, 62.0], [155.0, 49.2], [156.5, 67.2], [164.0, 53.8], [160.9, 54.4],
              [162.8, 58.0], [167.0, 59.8], [160.0, 54.8], [160.0, 43.2], [168.9, 60.5],
              [158.2, 46.4], [156.0, 64.4], [160.0, 48.8], [167.1, 62.2], [158.0, 55.5],
              [167.6, 57.8], [156.0, 54.6], [162.1, 59.2], [173.4, 52.7], [159.8, 53.2],
              [170.5, 64.5], [159.2, 51.8], [157.5, 56.0], [161.3, 63.6], [162.6, 63.2],
              [160.0, 59.5], [168.9, 56.8], [165.1, 64.1], [162.6, 50.0], [165.1, 72.3],
              [166.4, 55.0], [160.0, 55.9], [152.4, 60.4], [170.2, 69.1], [162.6, 84.5],
              [170.2, 55.9], [158.8, 55.5], [172.7, 69.5], [167.6, 76.4], [162.6, 61.4],
              [167.6, 65.9], [156.2, 58.6], [175.2, 66.8], [172.1, 56.6], [162.6, 58.6],
              [160.0, 55.9], [165.1, 59.1], [182.9, 81.8], [166.4, 70.7], [165.1, 56.8],
              [177.8, 60.0], [165.1, 58.2], [175.3, 72.7], [154.9, 54.1], [158.8, 49.1],
              [172.7, 75.9], [168.9, 55.0], [161.3, 57.3], [167.6, 55.0], [165.1, 65.5],
              [175.3, 65.5], [157.5, 48.6], [163.8, 58.6], [167.6, 63.6], [165.1, 55.2],
              [165.1, 62.7], [168.9, 56.6], [162.6, 53.9], [164.5, 63.2], [176.5, 73.6],
              [168.9, 62.0], [175.3, 63.6], [159.4, 53.2], [160.0, 53.4], [170.2, 55.0],
              [162.6, 70.5], [167.6, 54.5], [162.6, 54.5], [160.7, 55.9], [160.0, 59.0],
              [157.5, 63.6], [162.6, 54.5], [152.4, 47.3], [170.2, 67.7], [165.1, 80.9],
              [172.7, 70.5], [165.1, 60.9], [170.2, 63.6], [170.2, 54.5], [170.2, 59.1],
              [161.3, 70.5], [167.6, 52.7], [167.6, 62.7], [165.1, 86.3], [162.6, 66.4],
              [152.4, 67.3], [168.9, 63.0], [170.2, 73.6], [175.2, 62.3], [175.2, 57.7],
              [160.0, 55.4], [165.1, 104.1], [174.0, 55.5], [170.2, 77.3], [160.0, 80.5],
              [167.6, 64.5], [167.6, 72.3], [167.6, 61.4], [154.9, 58.2], [162.6, 81.8],
              [175.3, 63.6], [171.4, 53.4], [157.5, 54.5], [165.1, 53.6], [160.0, 60.0],
              [174.0, 73.6], [162.6, 61.4], [174.0, 55.5], [162.6, 63.6], [161.3, 60.9],
              [156.2, 60.0], [149.9, 46.8], [169.5, 57.3], [160.0, 64.1], [175.3, 63.6],
              [169.5, 67.3], [160.0, 75.5], [172.7, 68.2], [162.6, 61.4], [157.5, 76.8],
              [176.5, 71.8], [164.4, 55.5], [160.7, 48.6], [174.0, 66.4], [163.8, 67.3]
            ],
            markArea: {
              silent: true,
              itemStyle: {
                normal: {
                  color: 'transparent',
                  borderWidth: 1,
                  borderType: 'dashed'
                }
              },
              data: [[{
                name: '充电分布区间',
                xAxis: 'min',
                yAxis: 'min'
              }, {
                xAxis: 'max',
                yAxis: 'max'
              }]]
            },
            markPoint: {
              data: [
                { type: 'max', name: '最大值' },
                { type: 'min', name: '最小值' }
              ]
            },
            markLine: {
              lineStyle: {
                normal: {
                  type: 'solid'
                }
              },
              data: [
                { type: 'average', name: '平均值' },
                { xAxis: 160 }
              ]
            }
          },
          {
            name: '放电',
            type: 'scatter',
            data: [[174.0, 65.6], [175.3, 71.8], [193.5, 80.7], [186.5, 72.6], [187.2, 78.8],
              [181.5, 74.8], [184.0, 86.4], [184.5, 78.4], [175.0, 62.0], [184.0, 81.6],
              [180.0, 76.6], [177.8, 83.6], [192.0, 90.0], [176.0, 74.6], [174.0, 71.0],
              [184.0, 79.6], [192.7, 93.8], [171.5, 70.0], [173.0, 72.4], [176.0, 85.9],
              [176.0, 78.8], [180.5, 77.8], [172.7, 66.2], [176.0, 86.4], [173.5, 81.8],
              [178.0, 89.6], [180.3, 82.8], [180.3, 76.4], [164.5, 63.2], [173.0, 60.9],
              [183.5, 74.8], [175.5, 70.0], [188.0, 72.4], [189.2, 84.1], [172.8, 69.1],
              [170.0, 59.5], [182.0, 67.2], [170.0, 61.3], [177.8, 68.6], [184.2, 80.1],
              [186.7, 87.8], [171.4, 84.7], [172.7, 73.4], [175.3, 72.1], [180.3, 82.6],
              [182.9, 88.7], [188.0, 84.1], [177.2, 94.1], [172.1, 74.9], [167.0, 59.1],
              [169.5, 75.6], [174.0, 86.2], [172.7, 75.3], [182.2, 87.1], [164.1, 55.2],
              [163.0, 57.0], [171.5, 61.4], [184.2, 76.8], [174.0, 86.8], [174.0, 72.2],
              [177.0, 71.6], [186.0, 84.8], [167.0, 68.2], [171.8, 66.1], [182.0, 72.0],
              [167.0, 64.6], [177.8, 74.8], [164.5, 70.0], [192.0, 101.6], [175.5, 63.2],
              [171.2, 79.1], [181.6, 78.9], [167.4, 67.7], [181.1, 66.0], [177.0, 68.2],
              [174.5, 63.9], [177.5, 72.0], [170.5, 56.8], [182.4, 74.5], [197.1, 90.9],
              [180.1, 93.0], [175.5, 80.9], [180.6, 72.7], [184.4, 68.0], [175.5, 70.9],
              [180.6, 72.5], [177.0, 72.5], [177.1, 83.4], [181.6, 75.5], [176.5, 73.0],
              [175.0, 70.2], [174.0, 73.4], [165.1, 70.5], [177.0, 68.9], [192.0, 102.3],
              [176.5, 68.4], [169.4, 65.9], [182.1, 75.7], [179.8, 84.5], [175.3, 87.7],
              [184.9, 86.4], [177.3, 73.2], [167.4, 53.9], [178.1, 72.0], [168.9, 55.5],
              [157.2, 58.4], [180.3, 83.2], [170.2, 72.7], [177.8, 64.1], [172.7, 72.3],
              [165.1, 65.0], [186.7, 86.4], [165.1, 65.0], [174.0, 88.6], [175.3, 84.1],
              [185.4, 66.8], [177.8, 75.5], [180.3, 93.2], [180.3, 82.7], [177.8, 58.0],
              [177.8, 79.5], [177.8, 78.6], [177.8, 71.8], [177.8, 116.4], [163.8, 72.2],
              [188.0, 83.6], [198.1, 85.5], [175.3, 90.9], [166.4, 85.9], [190.5, 89.1],
              [166.4, 75.0], [177.8, 77.7], [179.7, 86.4], [172.7, 90.9], [190.5, 73.6],
              [185.4, 76.4], [168.9, 69.1], [167.6, 84.5], [175.3, 64.5], [170.2, 69.1],
              [190.5, 108.6], [177.8, 86.4], [190.5, 80.9], [177.8, 87.7], [184.2, 94.5],
              [176.5, 80.2], [177.8, 72.0], [180.3, 71.4], [171.4, 72.7], [172.7, 84.1],
              [172.7, 76.8], [177.8, 63.6], [177.8, 80.9], [182.9, 80.9], [170.2, 85.5],
              [167.6, 68.6], [175.3, 67.7], [165.1, 66.4], [185.4, 102.3], [181.6, 70.5],
              [172.7, 95.9], [190.5, 84.1], [179.1, 87.3], [175.3, 71.8], [170.2, 65.9],
              [193.0, 95.9], [171.4, 91.4], [177.8, 81.8], [177.8, 96.8], [167.6, 69.1],
              [167.6, 82.7], [180.3, 75.5], [182.9, 79.5], [176.5, 73.6], [186.7, 91.8],
              [188.0, 84.1], [188.0, 85.9], [177.8, 81.8], [174.0, 82.5], [177.8, 80.5],
              [171.4, 70.0], [185.4, 81.8], [185.4, 84.1], [188.0, 90.5], [188.0, 91.4],
              [182.9, 89.1], [176.5, 85.0], [175.3, 69.1], [175.3, 73.6], [188.0, 80.5],
              [188.0, 82.7], [175.3, 86.4], [170.5, 67.7], [179.1, 92.7], [177.8, 93.6],
              [175.3, 70.9], [182.9, 75.0], [170.8, 93.2], [188.0, 93.2], [180.3, 77.7],
              [177.8, 61.4], [185.4, 94.1], [168.9, 75.0], [185.4, 83.6], [180.3, 85.5],
              [174.0, 73.9], [167.6, 66.8], [182.9, 87.3], [160.0, 72.3], [180.3, 88.6],
              [167.6, 75.5], [186.7, 101.4], [175.3, 91.1], [175.3, 67.3], [175.9, 77.7],
              [175.3, 81.8], [179.1, 75.5], [181.6, 84.5], [177.8, 76.6], [182.9, 85.0],
              [177.8, 102.5], [184.2, 77.3], [179.1, 71.8], [176.5, 87.9], [188.0, 94.3],
              [174.0, 70.9], [167.6, 64.5], [170.2, 77.3], [167.6, 72.3], [188.0, 87.3],
              [174.0, 80.0], [176.5, 82.3], [180.3, 73.6], [167.6, 74.1], [188.0, 85.9],
              [180.3, 73.2], [167.6, 76.3], [183.0, 65.9], [183.0, 90.9], [179.1, 89.1],
              [170.2, 62.3], [177.8, 82.7], [179.1, 79.1], [190.5, 98.2], [177.8, 84.1],
              [180.3, 83.2], [180.3, 83.2]
            ],
            markArea: {
              silent: true,
              itemStyle: {
                normal: {
                  color: 'transparent',
                  borderWidth: 1,
                  borderType: 'dashed'
                }
              },
              data: [[{
                name: '放电分布区间',
                xAxis: 'min',
                yAxis: 'min'
              }, {
                xAxis: 'max',
                yAxis: 'max'
              }]]
            },
            markPoint: {
              data: [
                { type: 'max', name: '最大值' },
                { type: 'min', name: '最小值' }
              ]
            },
            markLine: {
              lineStyle: {
                normal: {
                  type: 'solid'
                }
              },
              data: [
                { type: 'average', name: '平均值' },
                { xAxis: 170 }
              ]
            }
          }
        ]
      }
      const myChart = echarts.init(document.getElementById('echartsNum4'))
      myChart.setOption(option)
    },
    addKLineTu() {
      const this_ = this
      axios.get('http://10.168.1.245:8088/api/images/stock-DJI.json').then((rawData) => {
        const data = this_.splitData(rawData.data)
        // debugger
        // console.log(data)
        const myChart = echarts.init(document.getElementById('echartsNum3'))
        myChart.setOption({
          backgroundColor: '#fff',
          animation: false,
          title: {
            text: '交易费用',
            x: 'center',
            y: 'bottom'
          },
          legend: {
            bottom: 10,
            left: 'center',
            data: ['Dow-Jones index', 'MA5', 'MA10', 'MA20', 'MA30']
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross'
            },
            backgroundColor: 'rgba(245, 245, 245, 0.8)',
            borderWidth: 1,
            borderColor: '#ccc',
            padding: 10,
            textStyle: {
              color: '#000'
            },
            position: (pos, params, el, elRect, size) => {
              var obj = { top: 10 }
              obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30
              return obj
            }
            // extraCssText: 'width: 170px'
          },
          axisPointer: {
            link: { xAxisIndex: 'all' },
            label: {
              backgroundColor: '#777'
            }
          },
          toolbox: {
            feature: {
              dataZoom: {
                yAxisIndex: false
              },
              brush: {
                type: ['lineX', 'clear']
              }
            }
          },
          brush: {
            xAxisIndex: 'all',
            brushLink: 'all',
            outOfBrush: {
              colorAlpha: 0.1
            }
          },
          visualMap: {
            show: false,
            seriesIndex: 5,
            dimension: 2,
            pieces: [{
              value: 1,
              color: this_.downColor
            }, {
              value: -1,
              color: this_.upColor
            }]
          },
          grid: [
            {
              left: '10%',
              right: '8%',
              height: '50%'
            },
            {
              left: '10%',
              right: '8%',
              top: '63%',
              height: '16%'
            }
          ],
          xAxis: [
            {
              type: 'category',
              data: data.categoryData,
              scale: true,
              boundaryGap: false,
              axisLine: { onZero: false },
              splitLine: { show: false },
              splitNumber: 20,
              min: 'dataMin',
              max: 'dataMax',
              axisPointer: {
                z: 100
              }
            },
            {
              type: 'category',
              gridIndex: 1,
              data: data.categoryData,
              scale: true,
              boundaryGap: false,
              axisLine: { onZero: false },
              axisTick: { show: false },
              splitLine: { show: false },
              axisLabel: { show: false },
              splitNumber: 20,
              min: 'dataMin',
              max: 'dataMax'
              // axisPointer: {
              //     label: {
              //         formatter: function (params) {
              //             var seriesValue = (params.seriesData[0] || {}).value;
              //             return params.value
              //             + (seriesValue != null
              //                 ? '\n' + echarts.format.addCommas(seriesValue)
              //                 : ''
              //             );
              //         }
              //     }
              // }
            }
          ],
          yAxis: [
            {
              scale: true,
              splitArea: {
                show: true
              }
            },
            {
              scale: true,
              gridIndex: 1,
              splitNumber: 2,
              axisLabel: { show: false },
              axisLine: { show: false },
              axisTick: { show: false },
              splitLine: { show: false }
            }
          ],
          dataZoom: [
            {
              type: 'inside',
              xAxisIndex: [0, 1],
              start: 98,
              end: 100
            },
            {
              show: true,
              xAxisIndex: [0, 1],
              type: 'slider',
              top: '85%',
              start: 98,
              end: 100
            }
          ],
          series: [
            {
              name: 'Dow-Jones index',
              type: 'candlestick',
              data: data.values,
              itemStyle: {
                normal: {
                  color: this_.upColor,
                  color0: this_.downColor,
                  borderColor: null,
                  borderColor0: null
                }
              },
              tooltip: {
                formatter: (param) => {
                  param = param[0]
                  return [
                    'Date: ' + param.name + '<hr size=1 style="margin: 3px 0">',
                    'Open: ' + param.data[0] + '<br/>',
                    'Close: ' + param.data[1] + '<br/>',
                    'Lowest: ' + param.data[2] + '<br/>',
                    'Highest: ' + param.data[3] + '<br/>'
                  ].join('')
                }
              }
            },
            {
              name: 'MA5',
              type: 'line',
              data: this_.calculateMA(5, data),
              smooth: true,
              lineStyle: {
                normal: { opacity: 0.5 }
              }
            },
            {
              name: 'MA10',
              type: 'line',
              data: this_.calculateMA(10, data),
              smooth: true,
              lineStyle: {
                normal: { opacity: 0.5 }
              }
            },
            {
              name: 'MA20',
              type: 'line',
              data: this_.calculateMA(20, data),
              smooth: true,
              lineStyle: {
                normal: { opacity: 0.5 }
              }
            },
            {
              name: 'MA30',
              type: 'line',
              data: this_.calculateMA(30, data),
              smooth: true,
              lineStyle: {
                normal: { opacity: 0.5 }
              }
            },
            {
              name: 'Volume',
              type: 'bar',
              xAxisIndex: 1,
              yAxisIndex: 1,
              data: data.volumes
            }
          ]
        }, true)

        // myChart.on('brushSelected', renderBrushed);

        // function renderBrushed(params) {
        //     var sum = 0;
        //     var min = Infinity;
        //     var max = -Infinity;
        //     var countBySeries = [];
        //     var brushComponent = params.brushComponents[0];

        //     var rawIndices = brushComponent.series[0].rawIndices;
        //     for (var i = 0; i < rawIndices.length; i++) {
        //         var val = data.values[rawIndices[i]][1];
        //         sum += val;
        //         min = Math.min(val, min);
        //         max = Math.max(val, max);
        //     }

        //     panel.innerHTML = [
        //         '<h3>STATISTICS:</h3>',
        //         'SUM of open: ' + (sum / rawIndices.length).toFixed(4) + '<br>',
        //         'MIN of open: ' + min.toFixed(4) + '<br>',
        //         'MAX of open: ' + max.toFixed(4) + '<br>'
        //     ].join(' ');
        // }

        myChart.dispatchAction({
          type: 'brush',
          areas: [
            {
              brushType: 'lineX',
              coordRange: ['2016-06-02', '2016-06-20'],
              xAxisIndex: 0
            }
          ]
        })
      })
    },
    addZlineTu() {
      axios.get('http://10.168.1.245:8088/api/images/aqi-beijing.json').then(result => {
        const data = result.data
        data.map(obj => {
          obj[1] = Math.random()
          // console.log(obj)
        })
        const myChart = echarts.init(document.getElementById('echartsNum1'))
        myChart.setOption({
          title: {
            text: '放电负荷'
          },
          tooltip: {
            trigger: 'axis'
          },
          xAxis: {
            data: data.map((item) => {
              return item[0]
            })
          },
          yAxis: {
            splitLine: {
              show: false
            }
          },
          toolbox: {
            left: 'center',
            feature: {
              dataZoom: {
                yAxisIndex: 'none'
              },
              restore: {},
              saveAsImage: {}
            }
          },
          legend: { show: false },
          dataZoom: [{
            startValue: '2014-06-01'
          }, {
            type: 'inside'
          }],
          visualMap: {
            top: 10,
            right: 10,
            show: false,
            pieces: [{
              gt: 0,
              lte: 0.2,
              color: '#096'
            }, {
              gt: 0.2,
              lte: 0.4,
              color: '#ffde33'
            }, {
              gt: 0.4,
              lte: 0.6,
              color: '#ff9933'
            }, {
              gt: 0.6,
              lte: 0.8,
              color: '#cc0033'
            }, {
              gt: 0.8,
              lte: 1.0,
              color: '#660099'
            }],
            outOfRange: {
              color: '#999'
            }
          },
          series: {
            name: '放电负荷',
            type: 'line',
            data: data.map((item) => {
              return item[1]
            }),
            markLine: {
              silent: true,
              data: [{
                yAxis: 0.2
              }, {
                yAxis: 0.4
              }, {
                yAxis: 0.6
              }, {
                yAxis: 0.8
              }, {
                yAxis: 1.0
              }]
            }
          }
        })
      })
    },
    addEchartRandom() {
      // const colors = ['#5793f3', '#d14a61', '#675bba']
      const colors = ['#5793f3', '#d14a61', '#675bba']
      const option = {
        color: colors,
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        grid: {
          right: '20%'
        },
        toolbox: {
          feature: {
            dataView: { show: true, readOnly: false },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        legend: {
          show: false,
          data: ['蒸发量', '降水量', '平均温度']
        },
        xAxis: [
          {
            type: 'category',
            splitNumber: 1,
            interval: 1,
            axisTick: {
              alignWithLabel: true
            },
            data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '蒸发量',
            min: 0,
            max: 250,
            position: 'right',
            show: false,
            axisLine: {
              lineStyle: {
                color: colors[0]
              }
            },
            axisLabel: {
              formatter: '{value} ml'
            }
          },
          {
            type: 'value',
            name: '降水量',
            min: 0,
            max: 250,
            position: 'right',
            offset: 80,
            show: false,
            axisLine: {
              lineStyle: {
                color: colors[1]
              }
            },
            axisLabel: {
              formatter: '{value} ml'
            }
          },
          {
            type: 'value',
            name: '出行率',
            min: 0,
            max: 25,
            position: 'left',
            axisLine: {
              lineStyle: {
                color: colors[2]
              }
            },
            axisLabel: {
              formatter: '{value} 次'
            }
          }
        ],
        series: [
          {
            name: '出行概率',
            show: false,
            type: 'bar',
            data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
          },
          {
            name: '出行概率',
            type: 'bar',
            show: false,
            yAxisIndex: 1,
            data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
          },
          {
            name: '出行概率',
            type: 'line',
            show: false,
            yAxisIndex: 2,
            data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
          }
        ]
      }
      const myChart = echarts.init(document.getElementById('echartsNum2'))
      myChart.setOption(option)
    },
    addEchart3(e, xStr, yStr, zStr) {
      const xStrArr = xStr.split(',')
      const yStrArr = yStr.split(',')
      const zStrArr = zStr.split(',')
      const data = []
      const data2 = []
      const xdata = []
      const ydata = []
      const zdata = []
      for (let i = 0; i < xStrArr.length; i++) {
        const uData = []
        const mData = []
        xdata.push(xStrArr[i])
        ydata.push(yStrArr[i])
        zdata.push(zStrArr[i])
        uData.push(xStrArr[i])
        uData.push(yStrArr[i])
        mData.push(xStrArr[i])
        mData.push(zStrArr[i])
        data.push(uData)
        data2.push(mData)
      }
      const myChart = echarts.init(document.getElementById(e))
      const option = {
        title: {
          x: 'center',
          y: 'bottom',
          text: '电价'
        },
        xAxis: {
          type: 'category',
          data: xdata,
          // min: 0,
          // max: 24,
          splitNumber: 24,
          axisLabel: {
            formatter: '{value}',
            interval: 2
          },
          name: 't/h'
        },
        legend: {
          data: ['实时电价', 'p2p电价']
        },
        yAxis: {
          type: 'value',
          name: '¥/kWh',
          splitLine: { show: false }
        },
        series: [{
          symbol: 'circle', // 设定为实心点
          symbolSize: 2, // 设定实心点的大小
          // hoverAnimation: false,
          // animation: false,
          name: '实时电价',
          data: data2,
          type: 'line'
          // smooth: true
        },
        {
          symbol: 'circle', // 设定为实心点
          symbolSize: 2, // 设定实心点的大小
          // hoverAnimation: false,
          // animation: false,
          name: 'p2p电价',
          data: data,
          type: 'line'
          // smooth: true
        }]
      }
      myChart.setOption(option)
    },
    addEchart2(e, xStr, yStr, xU, yU, yName, titleText) {
      const xStrArr = xStr.split(',')
      const yStrArr = yStr.split(',')
      const data = []
      const xdata = []
      const ydata = []
      for (let i = 0; i < xStrArr.length; i++) {
        const uData = []
        const mData = []
        xdata.push(xStrArr[i])
        ydata.push(yStrArr[i])
        uData.push(xStrArr[i])
        uData.push(yStrArr[i])
        mData.push(xStrArr[i])
        data.push(uData)
      }
      const myChart = echarts.init(document.getElementById(e))
      const option = {
        title: {
          x: 'center',
          y: 'bottom',
          text: titleText
        },
        xAxis: {
          type: 'category',
          data: xdata,
          // min: 0,
          // max: 24,
          // splitNumber: 24,
          axisLabel: {
            formatter: '{value}',
            interval: 10
          },
          name: xU
        },
        legend: {
          data: [yName]
        },
        yAxis: {
          type: 'value',
          name: yU,
          splitLine: { show: false }
        },
        series: [{
          symbol: 'circle', // 设定为实心点
          symbolSize: 2, // 设定实心点的大小
          // hoverAnimation: false,
          // animation: false,
          name: yName,
          data: data,
          type: 'line'
          // smooth: true
        }]
      }
      myChart.setOption(option)
    },
    updatePolygonPath(e) {
      this.polygonPath = e.target.getPath()
    },
    addPolygonPoint() {
      this.polygonPath.push({ lng: 116.404, lat: 39.915 })
    },
    getAllElectricVehicleDatas() {
      queryUserList().then(response => {
        if (response.code === 200) {
          const tElectricVehicles = response.data
          for (const item of tElectricVehicles) {
            console.log(item)
            const positionArr = item.currPositionVal.split(',')
            const point = {
              lng: parseFloat(positionArr[1]),
              lat: parseFloat(positionArr[0])
            }
            const marker = {
              id: item.id,
              evId: item.evId,
              point: point,
              title: item.name,
              carIcon: this.car_normalIcon
              // label: {
              //   content: item.name,
              //   opts: { offset: { width: 20, height: 0 }, position: point, enableMassClear: true }
              // }
            }
            if (item.current_power < 4) {
              marker.carIcon = this.car_xycdIcon
            }
            this.tElectricVehiclePoints.push(marker)
          }
        }
      })
    },
    getAllElectricVehicles() {
      queryUserList().then(response => {
        if (response.code === 200) {
          const tElectricVehicles = response.data
          for (const item of tElectricVehicles) {
            goToWork(this.BMap, this.map, item.homePositionVal, item.companyPositionVal, item.id, '上班', 0)
            // console.log(item)
            const positionArr = item.currPositionVal.split(',')
            const point = {
              lng: parseFloat(positionArr[1]),
              lat: parseFloat(positionArr[0])
            }
            const marker = {
              id: item.id,
              evId: item.evId,
              point: point,
              title: item.name,
              carIcon: this.car_normalIcon
              // label: {
              //   content: item.name,
              //   opts: { offset: { width: 20, height: 0 }, position: point, enableMassClear: true }
              // }
            }
            this.tElectricVehiclePoints.push(marker)
          }
        }
        // console.log(response)
        // console.log(this.tElectricVehiclePoints)
      })
    },
    getAllTChargingStation() {
      list().then(response => {
        if (response.code === 200) {
          // console.log(response)
          const tElectricVehicles = response.data
          for (const item of tElectricVehicles) {
            // console.log(item)
            const positionArr = item.positionVal.split(',')
            const point = {
              lng: parseFloat(positionArr[1]),
              lat: parseFloat(positionArr[0])
            }
            const marker = {
              id: item.id,
              // userId: item.userId,
              point: point,
              title: item.name
              // label: {
              //   content: item.name,
              //   opts: { offset: { width: 30, height: 0 }, position: point, enableMassClear: true }
              // }
            }
            this.tChargingStations.push(marker)
          }
        }
      })
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath)
    },
    moveStep() {
      // if (this.tElectricVehiclePoints) {
      //   for (const item of this.tElectricVehiclePoints) {
      //     item.point.lng += 0.0001
      //     item.point.lat += 0.0001
      //     item.label.opts.position.lng += 0.0001
      //     item.label.opts.position.lat += 0.0001
      //   }
      // }
      // console.log(this.tElectricVehiclePoints)
    },
    sleep(numberMillis) {
      let now = new Date()
      const exitTime = now.getTime() + numberMillis
      let flag = true
      while (flag) {
        flag = true
        now = new Date()
        if (now.getTime() > exitTime) {
          return
        }
      }
    },
    async getPointLatLng(query) {
      const res = await getOneById(query)
      return res
    },
    drawBoundary(BMap, map) {
      const this_ = this
      /* var p1 = new BMap.Point(104.130648, 30.57432)
      var p2 = new BMap.Point(104.130648, 30.57432)
      var p3 = new BMap.Point(104.088899, 30.790211)
      var p4 = new BMap.Point(103.940602, 30.715246) */
      var p1 = new BMap.Point(104.126948, 30.600384)
      var p2 = new BMap.Point(104.126948, 30.600384)
      var p3 = new BMap.Point(104.168666, 30.690083)
      var p4 = new BMap.Point(104.044412, 30.724362)

      var options = {
        // renderOptions: { map: map, autoViewport: false },
        onSearchComplete(results) {
          this_.polygonPath = []
          const points = results.xr[0].dk
          // console.log(points)
          points.map(obj => {
            // console.log(obj)
            obj.zr.map(k => {
              this_.polygonPath.push(k)
            })
          })
          // console.log('******************************')
          // console.log(results)
          // console.log('******************************')
          // // this_.polygonPath = results.xr[0].dk[2].zr
          // console.log('******************************')
          // console.log(this_.polygonPath)
          // console.log('******************************')
        /* debugger
          if (driving.getStatus() === BMAP_STATUS_SUCCESS) {
            // 获取第一条方案
            const plan = results.getPlan(0)
            // 获取方案的驾车线路
            const route = plan.getRoute(0)
            // 获取每个关键步骤,并输出到页面
            const s = []
            for (var j = 0; j < plan.getNumRoutes(); j++) {
              const route = plan.getRoute(j)
              for (let i = 0; i < route.getNumSteps(); i++) {
                const step = route.getStep(i)
                s.push((i + 1) + '. ' + step.getDescription())
              }
              /!* for (let i = 0; i < route.zr.length; i++) {
                console.log(route.zr[i].lat+","+route.zr[i].lng);
                const param = {lat:route.zr[i].lat,lag:route.zr[i].lng};
                $.ajax({
                    type: "post",
                    url: BaseUrl+"/api/tPoint/save",
                    data: JSON.stringify(param),
                    dataType: "json",
                    contentType: 'application/json;charset=UTF-8', //contentType很重要
                    success: function (data) {
                    }
                });
              }*!/
            }
          }*/
          // debugger;
        }
      }
      const driving = new BMap.DrivingRoute(map, options)
      driving.search(p1, p2, { waypoints: [p3, p4] })
    }
  }
}
</script>

<style lang="scss" scoped>
  .map {
    width: 100%;
    height: 800px;
  }

  .dashboard-editor-container {
    padding: 32px;
    background-color: rgb(240, 242, 245);
    position: relative;

    .github-corner {
      position: absolute;
      top: 0px;
      border: 0;
      right: 0;
    }

    .chart-wrapper {
      background: #fff;
      padding: 16px 16px 0;
      margin-bottom: 32px;
    }
  }
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
  .el-icon-arrow-down:before {
    content: "\E6DF";
  }

  @media (max-width: 1024px) {
    .chart-wrapper {
      padding: 8px;
    }
  }
  /*.left-container{
    display: inline-flex;
    width: 50%;
  }
  .right-container{
    float: right;
    display: inline-flex;
    width: 50%;
  }
  .result-table{
    float: right;
    width: 50%;
    height: 500px;
    border: 1px solid red;
  }*/
  .result-table{
    /*float: right;*/
    /*width: 50%;*/
    /*height: 500px;*/
    height:400px;
    margin: 0px;
    border: 1px solid grey;
    /*border-radius: 15px;*/
    /*box-shadow: 10px 10px 5px #bfbfbf;*/
  }
  .right-container{
    height: 800px;
    /*background: #bfbfbf;*/
  }
</style>
<style>
  span.BMap_Marker div img{
    background-image: url('..') !important;
    margin-left: 0px !important;
  }
  .handle-button[data-v-1e488bfb] {
    width: 48px;
    height: 48px;
    position: absolute;
    top: 45px !important;
    left: -48px;
    text-align: center;
    font-size: 24px;
    border-radius: 6px 0 0 6px !important;
    z-index: 0;
    pointer-events: auto;
    cursor: pointer;
    color: #fff;
    line-height: 48px;
  }
  .right-container{

  }
  .point-ctr {
    position: absolute;
    z-index: 10;
    text-size-adjust: none;
    bottom: auto;
    right: auto;
    top: 10px !important;
    left: 150px !important;
  }
  .marker-ctr {
    position: absolute;
    z-index: 10;
    text-size-adjust: none;
    bottom: auto;
    right: auto;
    top: 10px !important;
    left: 300px !important;
  }
  .action-ctr {
    position: absolute;
    z-index: 10;
    text-size-adjust: none;
    bottom: auto;
    right: auto;
    top: 10px !important;
    left: 450px !important;
  }
</style>
