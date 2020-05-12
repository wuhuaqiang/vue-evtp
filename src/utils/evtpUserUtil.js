import { getDistanceKm, getMillisecond, formatDate, randomNum, uuid } from '@/utils/utils'
import { getLinePoints } from '@/utils/baiduMapUtil'
import { save as saveLine } from '@/api/evtpLines'
import { saveAll as saveLineAllPoint } from '@/api/evtpLinePoints'
export function goToWork(BMap, map, startPointStr, endPointStr, owerId, remark, type) {
  const geoc = new BMap.Geocoder()
  // console.log(BMap)
  // console.log(map)
  const homePositionArr = startPointStr.split(',')
  const companyPositionArr = endPointStr.split(',')
  const homePoint = new BMap.Point(homePositionArr[1], homePositionArr[0])
  const companyPoint = new BMap.Point(companyPositionArr[1], companyPositionArr[0])
  let homePosition
  let companyPosition
  geoc.getLocation(homePoint, (rs) => {
    const addComp = rs.addressComponents
    homePosition = addComp.district + addComp.street + addComp.streetNumber
  })
  geoc.getLocation(companyPoint, (rs) => {
    const addComp = rs.addressComponents
    companyPosition = addComp.district + addComp.street + addComp.streetNumber
  })
  // console.log(homePositionArr)
  // console.log(companyPositionArr)
  const searchComplete = (results) => {
    // console.log(owerId)
    // console.log(homePosition)
    // console.log(companyPosition)
    // console.log(results)
    const points = getLinePoints(results)
    // const zr = results.Fr[0].ik[0].Hr
    // const zr = results.yr[0].dk[0].Ar
    // console.log(transit.getStatus())
    if (transit.getStatus() !== 0) {
      return
    }
    const plan = results.getPlan(0)
    const time = plan.getDuration(true)// 获取时间
    const distance = plan.getDistance(true)// 获取距离
    // console.log(getMillisecond(time))
    // console.log(distance)
    const data_T = getMillisecond(time)
    const data_D = getDistanceKm(distance)
    // console.log(data_D)
    const date = new Date()
    const fullYear = date.getFullYear() // 获取完整的年份(4位,1970)
    const month = date.getMonth() + 1 // 获取当前月份(0-11,0代表1月)
    const date1 = date.getDate() // 获取当前日(1-31)
    const hours = date.getHours() // 获取当前日(时间)
    const minutes = date.getMinutes() // 获取当前日(0-60)
    let mt = minutes + 2
    let h = hours
    // eslint-disable-next-line no-unused-vars
    let timeStr = ' ' + hours + ':' + mt
    if (mt < 60) {
      timeStr = ' ' + h + ':' + mt
    } else {
      mt = mt - 60
      h = h + 1
      if (h < 24) {
        h = h - 24
        timeStr = ' ' + h + ':' + mt
      }
      timeStr = ' ' + h + ':' + mt
    }
    // debugger
    const oldTime = (new Date(fullYear + '/' + month + '/' + date1 + timeStr)).getTime()
    // const newDate = new Date(oldTime - data_T - randomNum(0, 30 * 60 * 100)) // 毫秒转成时间
    // console.log(oldTime)
    // console.log(newDate)
    const m = randomNum(0, 60 * 60 * 1000)
    // console.log(m)
    // const startTime = formatDate(oldTime - date_T - m)
    const startTime = formatDate(oldTime)
    const endTime = formatDate(oldTime - m)
    // console.log()
    // console.log()
    // console.log(uuid(32))
    const param = {}
    param.id = uuid(32)
    param.name = remark
    param.startPoint = homePosition
    param.endPoint = companyPosition
    param.startPointVal = startPointStr
    param.endPointVal = endPointStr
    param.startTime = startTime
    param.endTime = endTime
    param.owerId = owerId
    param.sort = 1
    param.runTime = data_T
    param.remark = remark
    param.state = 0
    param.distance = data_D
    saveLine(param).then(response => {
      // console.log(response)
    })
    const params = []
    points.map((obj, index) => {
      // console.log(index)
      // console.log(obj)
      const parms = {}
      parms.id = uuid(32)
      parms.lat = obj.lat
      parms.lng = obj.lng
      parms.sort = index
      parms.remark = remark
      parms.lineId = param.id
      parms.name = param.name
      parms.type = type
      params.push(parms)
      // console.log(parms)
      // saveLinePoint(JSON.stringify(parms)).then(response => {
      //   console.log(response)
      // })
    })
    saveLineAllPoint(JSON.stringify(params)).then(response => {
      // console.log(response)
    })
    // console.log(duration)
    // console.log(Bmap.startTime)
    // console.log(param)
    // console.log(time + distance)
  }
  const transit = new BMap.DrivingRoute(map, {
    // renderOptions: { map: map },
    onSearchComplete: searchComplete,
    onPolylinesSet: () => {
      // setTimeout(function() {
      //   alert('')
      // }, '1000')
    }
  })
  transit.search(homePoint, companyPoint)
  return ''
}
export function goToTask(BMap, map, startPoint, endPoint, owerId, remark, type) {
  const geoc = new BMap.Geocoder()
  // console.log(BMap)
  // console.log(map)

  const startMapPoint = new BMap.Point(startPoint.lng, startPoint.lat)
  const endMapPoint = new BMap.Point(endPoint.lng, endPoint.lat)
  let startPosition
  let endPosition
  geoc.getLocation(startMapPoint, (rs) => {
    const addComp = rs.addressComponents
    startPosition = addComp.district + addComp.street + addComp.streetNumber
  })
  geoc.getLocation(endMapPoint, (rs) => {
    const addComp = rs.addressComponents
    endPosition = addComp.district + addComp.street + addComp.streetNumber
  })
  const searchComplete = (results) => {
    // console.log(results)
    const points = getLinePoints(results)
    // console.log(transit.getStatus())
    if (transit.getStatus() !== 0) {
      return
    }
    const plan = results.getPlan(0)
    const time = plan.getDuration(true)// 获取时间
    const distance = plan.getDistance(true)// 获取距离
    const data_T = getMillisecond(time)
    const data_D = getDistanceKm(distance)
    const date = new Date()
    const m = randomNum(0, 60 * 60 * 1000)
    // console.log(m)
    // const startTime = formatDate(oldTime - date_T - m)
    const startTime = formatDate(date.getTime() + m)
    const endTime = formatDate(date.getTime() + data_T + m)
    // console.log()
    // console.log()
    // console.log(uuid(32))
    const param = {}
    param.id = uuid(32)
    param.name = remark
    param.startPoint = startPosition
    param.endPoint = endPosition
    param.startPointVal = startPoint.lat + ',' + startPoint.lng
    param.endPointVal = endPoint.lat + ',' + endPoint.lng
    param.startTime = startTime
    param.endTime = endTime
    param.owerId = owerId
    param.sort = 1
    param.runTime = data_T
    param.remark = remark
    param.state = 0
    param.distance = data_D
    saveLine(param).then(response => {
      // console.log(response)
    })
    const params = []
    points.map((obj, index) => {
      // console.log(index)
      // console.log(obj)
      const parms = {}
      parms.id = uuid(32)
      parms.lat = obj.lat
      parms.lng = obj.lng
      parms.sort = index
      parms.remark = remark
      parms.lineId = param.id
      parms.name = param.name
      parms.type = type
      params.push(parms)
      // console.log(parms)
      // saveLinePoint(JSON.stringify(parms)).then(response => {
      //   console.log(response)
      // })
    })
    saveLineAllPoint(JSON.stringify(params)).then(response => {
      // console.log(response)
    })
    // console.log(duration)
    // console.log(Bmap.startTime)
    // console.log(param)
    // console.log(time + distance)
  }
  const transit = new BMap.DrivingRoute(map, {
    // renderOptions: { map: map },
    onSearchComplete: searchComplete,
    onPolylinesSet: () => {
      // setTimeout(function() {
      //   alert('')
      // }, '1000')
    }
  })
  transit.search(startMapPoint, endMapPoint)
  return ''
}

