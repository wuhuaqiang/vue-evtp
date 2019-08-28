import request from '@/utils/request-ws'

export function list(query) {
  return request({
    url: '/evtpPoints/list',
    method: 'get',
    params: query
  })
}

export function save(data) {
  return request({
    url: '/evtpPoints/save',
    method: 'post',
    data
  })
}
export function saveAll(data) {
  return request({
    url: '/evtpPoints/saveAll',
    method: 'post',
    data
  })
}
export function delAll() {
  return request({
    url: '/evtpPoints/delAll',
    method: 'get'
  })
}
export function getOneById(query) {
  return request({
    url: '/evtpPoints/getOneById',
    method: 'get',
    params: query
  })
}
