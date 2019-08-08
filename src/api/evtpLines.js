import request from '@/utils/request-ws'

export function list(query) {
  return request({
    url: '/evtpLine/list',
    method: 'get',
    params: query
  })
}

export function save(data) {
  return request({
    url: '/evtpLine/save',
    method: 'post',
    data
  })
}
export function getOneById(query) {
  return request({
    url: '/evtpLine/getOneById',
    method: 'get',
    params: query
  })
}
