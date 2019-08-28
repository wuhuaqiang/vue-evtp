import request from '@/utils/request-api'

export function queryFabricConfigList(query) {
  return request({
    url: '/fabricConfig/list',
    method: 'get',
    params: query
  })
}

export function queryFabricConfigById(id) {
  return request({
    url: 'fabricConfig/getById',
    method: 'get',
    params: { id }
  })
}

export function delFabricConfig(id) {
  return request({
    url: 'fabricConfig/delById',
    method: 'get',
    params: { id }
  })
}

export function createFabricConfig(data) {
  return request({
    url: 'fabricConfig/saveFabricConfig',
    method: 'post',
    data
  })
}

export function updateFabricConfig(data) {
  return request({
    url: 'fabricConfig/updateFabricConfig',
    method: 'post',
    data
  })
}
