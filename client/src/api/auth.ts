import request from '~/utils/axios'
//登录
export function UserLogin(data:any) {
  return request({
    url: 'auth/login',
    method: 'post',
    data
  })
}
//注册
export function UserRegister(data: any) {
  return request({
    url: 'auth/register',
    method: 'post',
    data
  })
}