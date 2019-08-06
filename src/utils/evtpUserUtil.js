export function creatUserLines(BMap, map, user) {
  var searchComplete = (results) => {
    if (transit.getStatus() !== BMap.BMAP_STATUS_SUCCESS) {
      return
    }
    const plan = results.getPlan(0)
    plan.getDuration(true)// 获取时间
    plan.getDistance(true)// 获取距离
  }
  var transit = new BMap.DrivingRoute(map, {
    renderOptions: { map: map },
    onSearchComplete: searchComplete,
    onPolylinesSet: () => {
      setTimeout(function() {
        alert('')
      }, '1000')
    }
  })
  const start = new BMap.Point(116.404844, 39.911836)
  const end = new BMap.Point(116.308102, 40.056057)
  transit.search(start, end)
  return ''
}

// id: "d65b6a8b6baa47a8bb95f09a25492cd2",
// evId: "879bac4690b14b6796fc7cec44a5806b",
// name: "user20",
// homePositionId: "05009d43a5d44ddabddae87468f8a19b",
// companyPositionId: "4ad6d2a8b9c3426baa3c37adc347dc93",
// otherPositionId: "3b58532bab4f406aa3209a21ba21dd83,641d1632c4c84ca386c60ae90bde3b05,46d67e811a3c4db7822803a4d5be2758",
// sex: null,
// email: null,
// address: "成都市金牛区圃园南一路4号",
// phone: null,
// qq: null,
// telnumber: null,
// createdate: "2019-08-06 17:06:09",
// state: null,
// remark: null,
// account: null
