import type { InternalAxiosRequestConfig } from 'axios'
import { useUserStore } from '~/store'

const userStore = useUserStore()

const defaultRequestInterception = (config: InternalAxiosRequestConfig) => {
  config.headers['authorization'] = userStore.token
  return config
}

export {
  defaultRequestInterception,
}