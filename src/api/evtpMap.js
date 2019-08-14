import request from '@/utils/request-ws'

export function initMap(query) {
  return request({
    url: '/evtpInitMap/initMap',
    method: 'get',
    params: query
  })
}
export function evtpAction(query) {
  return request({
    url: '/evtpAction/goToWork',
    method: 'get',
    params: query
  })
}
