<template>
  <div class="evtp-container">
    <div class="left-container">
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
          :icon="icon"
        />
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
          :stroke-weight="2"
          :editing="true"
          @lineupdate="updatePolygonPath"
        />
      </baidu-map>
    </div>
    <div class="right-container" />
  </div>
</template>
<script>
// import { connectionSocket, disconnectSocket } from '@/utils/websocket'
import { getAllListWithLine } from '@/api/electricVehicle'
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'

export default {
  data() {
    return {
      stompClient: '',
      isCollapse: true,
      timer: '',
      icon: {
        url: 'http://10.168.1.130:8088/api/images/car_normal.png',
        size: { width: 30, height: 30 },
        opts: {
          anchor: { width: 0, height: 0 },
          imageOffset: { width: 0, height: 0 },
          imageSize: { width: 30, height: 30 },
          infoWindowAnchor: { width: 0, height: 0 },
          printImageUrl: 'http://10.168.1.130:8088/api/images/car_normal.png'
        }
      },
      tElectricVehiclePoints: [],
      point: { lng: 103.980118, lat: 30.634065 },
      msg: 'SocketJS',
      websocket: null,
      center: '成都',
      zoom: 15,
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
    setInterval(this.moveStep, 1000)
    this.getAllElectricVehicles()
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
      this.websocket = new WebSocket('ws://10.168.1.185:2004/websocket')
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
        // debugger
        const obj = JSON.parse(event.data)
        // this.tElectricVehiclePoints = obj
        for (const item of this.tElectricVehiclePoints) {
          for (const o of obj) {
            if (item.id === o.carId) {
              console.log(item.point)
              console.log(o.mapPoint)
              item.point = o.mapPoint
            }
          }
          // if (item.id === obj.carId) {
          //   item.point = obj.mapPoint
          // }
        }
        console.log(JSON.parse(event.data))
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
  beforeDestroy() {
    if (this.stompClient) {
      this.stompClient.disconnect()
    }
  },
  methods: {
    handler({ BMap, map }) {
      // console.log(BMap, map)
      // this.center.lng = 116.404
      // this.center.lat = 39.915
      // this.zoom = 15
    },
    updatePolygonPath(e) {
      this.polygonPath = e.target.getPath()
    },
    addPolygonPoint() {
      this.polygonPath.push({ lng: 116.404, lat: 39.915 })
    },
    getAllElectricVehicles() {
      getAllListWithLine().then(response => {
        if (response.code === 200) {
          const tElectricVehicles = response.data
          for (const item of tElectricVehicles) {
            console.log(item)
            const positionArr = item.positionVal.split(',')
            const point = {
              lng: parseFloat(positionArr[0]),
              lat: parseFloat(positionArr[1])
            }
            const marker = {
              id: item.id,
              userId: item.userId,
              point: point,
              label: {
                content: item.userName,
                opts: { offset: { width: 20, height: 0 }, position: point, enableMassClear: true }
              }
            }
            this.tElectricVehiclePoints.push(marker)
          }
        }
        console.log(response)
        console.log(this.tElectricVehiclePoints)
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
  .right-container{
    display: inline-flex;
    width: 50%;
  }
  .left-container{
    display: inline-flex;
    width: 50%;
  }
</style>
