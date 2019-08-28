import request from '@/utils/request-ws'

export function queryUserList(query) {
  return request({
    url: '/evtpUser/list',
    method: 'get',
    params: query
  })
}
export function queryPage(query) {
  return request({
    url: '/evtpUser/page',
    method: 'get',
    params: query
  })
}
export function saveOrUpdateUser(data) {
  return request({
    url: '/evtpUser/list',
    method: 'post',
    data
  })
}
