import request from '@/utils/request-api'

export function queryFabricOrdererList(query) {
  return request({
    url: '/fabricOrderer/list',
    method: 'get',
    params: query
  })
}

export function queryFabricOrdererById(id) {
  return request({
    url: 'fabricOrderer/getById',
    method: 'get',
    params: { id }
  })
}

export function delFabricOrderer(id) {
  return request({
    url: 'fabricOrderer/delById',
    method: 'get',
    params: { id }
  })
}

export function createFabricOrderer(data) {
  return request({
    url: 'fabricOrderer/saveFabricOrderer',
    method: 'post',
    data
  })
}

export function updateFabricOrderer(data) {
  return request({
    url: 'fabricOrderer/updateFabricOrderer',
    method: 'post',
    data
  })
}
