import request from '@/utils/request-api'

export function queryFabricPeerList(query) {
  return request({
    url: '/fabricPeer/list',
    method: 'get',
    params: query
  })
}

export function queryFabricPeerById(id) {
  return request({
    url: 'fabricPeer/getById',
    method: 'get',
    params: { id }
  })
}

export function delFabricPeer(id) {
  return request({
    url: 'fabricPeer/delById',
    method: 'get',
    params: { id }
  })
}

export function createFabricPeer(data) {
  return request({
    url: 'fabricPeer/saveFabricPeer',
    method: 'post',
    data
  })
}

export function updateFabricPeer(data) {
  return request({
    url: 'fabricPeer/updateFabricPeer',
    method: 'post',
    data
  })
}
