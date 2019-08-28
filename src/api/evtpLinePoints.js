import request from '@/utils/request-ws'

export function list(query) {
  return request({
    url: '/evtpLinePoints/list',
    method: 'get',
    params: query
  })
}

export function save(data) {
  return request({
    url: '/evtpLinePoints/save',
    method: 'post',
    data
  })
}
export function saveAll(data) {
  return request({
    url: '/evtpLinePoints/saveAll',
    method: 'post',
    data
  })
}
export function getOneById(query) {
  return request({
    url: '/evtpLinePoints/getOneById',
    method: 'get',
    params: query
  })
}
