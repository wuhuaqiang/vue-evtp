import request from '@/utils/request-api'

export function queryFabricUserList(query) {
  return request({
    url: '/fabricUser/list',
    method: 'get',
    params: query
  })
}

export function queryFabricUserById(id) {
  return request({
    url: 'fabricUser/getById',
    method: 'get',
    params: { id }
  })
}

export function delFabricUser(id) {
  return request({
    url: 'fabricUser/deleteFabricUser',
    method: 'get',
    params: { id }
  })
}

export function createFabricUser(data) {
  return request({
    url: 'fabricUser/saveFabricUser',
    method: 'post',
    data
  })
}

export function updateFabricUser(data) {
  return request({
    url: 'fabricUser/updateFabricUser',
    method: 'post',
    data
  })
}
