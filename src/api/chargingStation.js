import request from '@/utils/request-ws'

export function list(query) {
  return request({
    url: '/evtpChargingStation/list',
    method: 'get',
    params: query
  })
}
