import type { App } from 'vue'
import {
  PhoneVideoCall,
  Add,
  Copy
} from '@icon-park/vue-next'

export interface Icons {
  [key: string]: typeof PhoneVideoCall
}

export const icons: Icons = {
  IconPhoneVideoCall: PhoneVideoCall,
  IconAdd: Add,
  IconCopy: Copy
}
export const install = (app: App) => {
  for (const key of Object.keys(icons))
    app.component(key, icons[key])
}
