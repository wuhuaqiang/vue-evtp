import request from '@/utils/request-ws'

export function list(query) {
  return request({
    url: '/evtpPointsType/list',
    method: 'get',
    params: query
  })
}

export function save(data) {
  return request({
    url: '/evtpPointsType/save',
    method: 'post',
    data
  })
}
export function update(data) {
  return request({
    url: '/evtpPointsType/update',
    method: 'post',
    data
  })
}
export function del(id) {
  return request({
    url: '/evtpPointsType/del',
    method: 'get',
    params: { id }
  })
}

