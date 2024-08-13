import request from '~/utils/axios'
// 用户列表
export function UserList() {
  return request({
    url: 'user/list',
    method: 'get'
  })
}