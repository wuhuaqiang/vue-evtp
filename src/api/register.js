import request from '@/utils/request-api-test'

export function add(data) {
  return request({
    url: '/user/BulkRegister/',
    method: 'post',
    data: data,
    transformRequest: [(data) => {
      // Do whatever you want to transform the data
      let ret = ''
      for (const it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}
export function query(data) {
  return request({
    url: '/blockchain/match/',
    method: 'post',
    data: data,
    transformRequest: [(data) => {
      // Do whatever you want to transform the data
      let ret = ''
      for (const it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

export function getAddResult(data) {
  return request({
    url: '/blockchain/sumTest/',
    method: 'post',
    data: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    },
    body: data
  })
}

