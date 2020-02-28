import request from '@/utils/request-ws'

export function queryUserList(query) {
  return request({
    url: '/evtpLine/list',
    method: 'get',
    params: query
  })
}
export function queryPage(query) {
  return request({
    url: '/evtpLine/page',
    method: 'get',
    params: query
  })
}
export function saveOrUpdateUser(data) {
  return request({
    url: '/evtpLine/list',
    method: 'post',
    data
  })
}
