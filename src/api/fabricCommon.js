import request from '@/utils/request-api'

export function logonIn(data) {
  return request({
    url: '/common/logon',
    method: 'post',
    data
  })
}
export function register(data) {
  return request({
    url: '/common/register',
    method: 'post',
    data
  })
}
