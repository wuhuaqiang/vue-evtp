import request from '@/utils/request-api'
export function getJson() {
  return request({
    url: '/blockchain/jsonTest/',
    method: 'get'
  })
}
