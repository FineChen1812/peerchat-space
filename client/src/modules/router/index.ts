import type { App } from 'vue'
import './permission'
import router from './base'

export const install = (app: App) => {
  app.use(router)
}
