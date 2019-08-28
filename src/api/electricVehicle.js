import request from '@/utils/request-ws'

export function list(query) {
  return request({
    url: '/tElectricVehicle/list',
    method: 'get',
    params: query
  })
}

export function save(data) {
  return request({
    url: '/tElectricVehicle/save',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/tElectricVehicle/update',
    method: 'post',
    data
  })
}
export function delById(id) {
  return request({
    url: '/tElectricVehicle/delById',
    method: 'get',
    params: { id }
  })
}
export function getAllListWithLine(data) {
  return request({
    url: '/tElectricVehicle/getAllListWithLine',
    method: 'post',
    data
  })
}
export function getEVWithLineById(data) {
  return request({
    url: '/tElectricVehicle/getEVWithLineById',
    method: 'post',
    data
  })
}
export function getEVById(data) {
  return request({
    url: '/tElectricVehicle/getEVById',
    method: 'post',
    data
  })
}
