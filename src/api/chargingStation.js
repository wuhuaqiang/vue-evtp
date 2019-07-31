import request from '@/utils/request-ws'

export function list(query) {
  return request({
    url: '/tChargingStation/list',
    method: 'get',
    params: query
  })
}
