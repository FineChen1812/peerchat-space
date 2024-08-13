import { defineStore } from 'pinia'
import { getToken, setToken, getUser, setUser } from '~/utils/cookie'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: getToken() ? getToken() : '',
		userInfo: getUser() ? getUser() : '',
  }),
  actions: {
    setUserInfo(userInfo: any){
      this.userInfo = userInfo
      setUser(userInfo)
    },
    setToken(token: string) {
      this.token = token
      setToken(token)
    }
  }
})