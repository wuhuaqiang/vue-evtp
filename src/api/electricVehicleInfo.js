import request from '@/utils/request-ws'

export function list(query) {
  return request({
    url: '/tElectricVehicleInfo/list',
    method: 'get',
    params: query
  })
}

export function save(data) {
  return request({
    url: '/tElectricVehicleInfo/save',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/tElectricVehicleInfo/update',
    method: 'post',
    data
  })
}
export function delById(id) {
  return request({
    url: '/tElectricVehicleInfo/delById',
    method: 'get',
    params: { id }
  })
}
export function getAllListWithLine(data) {
  return request({
    url: '/tElectricVehicleInfo/getAllListWithLine',
    method: 'post',
    data
  })
}
export function getEVWithLineById(data) {
  return request({
    url: '/tElectricVehicleInfo/getEVWithLineById',
    method: 'post',
    data
  })
}
export function getEVById(data) {
  return request({
    url: '/tElectricVehicleInfo/getEVById',
    method: 'post',
    data
  })
}
