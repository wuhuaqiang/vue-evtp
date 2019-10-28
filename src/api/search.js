import request from '@/utils/request-api-test'
export function getJson() {
  return request({
    url: '/blockchain/jsonTest/',
    method: 'get'
  })
}
