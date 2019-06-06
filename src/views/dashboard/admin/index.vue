<template>
  <baidu-map class="map" :center="center" :zoom="zoom" @ready="handler" :scroll-wheel-zoom="true">
    <bm-copyright
      anchor="BMAP_ANCHOR_TOP_RIGHT"
      :copyright="[{id: 1, content: 'Copyright Message', bounds: {ne: {lng: 110, lat: 40}, sw:{lng: 0, lat: 0}}}, {id: 2, content: '<a>电量交易系统专用地图</a>'}]">
    </bm-copyright>
    <!--<bm-panorama></bm-panorama>-->
    <bm-tile
      :isTransparentPng="true"
      tileUrlTemplate="//developer.baidu.com/map/jsdemo/demo/tiles/{Z}/tile{X}_{Y}.png">
    </bm-tile>
    <bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :showAddressBar="true" :autoLocation="true"></bm-geolocation>
    <bm-scale anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-scale>
    <bm-navigation anchor="BMAP_ANCHOR_BOTTOM_RIGHT"></bm-navigation>
    <bm-map-type :map-types="['BMAP_NORMAL_MAP', 'BMAP_HYBRID_MAP']" anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-map-type>
    <bm-city-list anchor="BMAP_ANCHOR_TOP_LEFT"></bm-city-list>
    <bm-polyline :path="polygonPath" stroke-color="blue" :stroke-opacity="0.5" :stroke-weight="2" :editing="true" @lineupdate="updatePolygonPath"/>
  </baidu-map>
</template>
<script>
export default {
  data() {
    return {
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

  @media (max-width: 1024px) {
    .chart-wrapper {
      padding: 8px;
    }
  }
</style>
