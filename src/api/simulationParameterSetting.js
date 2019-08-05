import request from '@/utils/request-ws'

export function list(query) {
  return request({
    url: '/evtpSimulationParameters/list',
    method: 'get',
    params: query
  })
}

export function save(data) {
  return request({
    url: '/evtpSimulationParameters/save',
    method: 'post',
    data
  })
}
export function update(data) {
  return request({
    url: '/evtpSimulationParameters/update',
    method: 'post',
    data
  })
}
// export function del(id) {
//   return request({
//     url: '/evtpPointsType/del',
//     method: 'get',
//     params: { id }
//   })
// }

