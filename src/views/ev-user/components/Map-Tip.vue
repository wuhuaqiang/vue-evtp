<template>
  <div>
    <el-row>
      <el-col :span="24">
        <div class="left-container grid-content bg-purple">
          <baidu-map class="map" :center="center" :zoom="zoom" :scroll-wheel-zoom="true" @ready="handler">
            <bm-tile
              :is-transparent-png="true"
              tile-url-template="//developer.baidu.com/map/jsdemo/demo/tiles/{Z}/tile{X}_{Y}.png"
            />
            <bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :show-address-bar="true" :auto-location="true" />
            <bm-scale anchor="BMAP_ANCHOR_TOP_RIGHT" />
            <bm-navigation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" />
            <bm-map-type :map-types="['BMAP_NORMAL_MAP', 'BMAP_HYBRID_MAP']" anchor="BMAP_ANCHOR_TOP_RIGHT" />
            <bm-city-list anchor="BMAP_ANCHOR_TOP_LEFT" />
          </baidu-map>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'Map',
  data() {
    return {
      stompClient: '',
      isCollapse: true,
      upColor: '#00da3c',
      downColor: '#ec0000',
      BMap: '',
      map: '',
      tElectricVehiclePoints: [],
      ResultArray: [],
      tChargingStations: [],
      point: { lng: 103.980118, lat: 30.634065 },
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
  },
  methods: {
    handler({ BMap, map }) {
      // this.drawBoundary(BMap, map)
      this.BMap = BMap
      this.map = map
    }
  }
}
</script>

<style scoped>
  .map {
    width: 100%;
    height: 800px;
  }
</style>
