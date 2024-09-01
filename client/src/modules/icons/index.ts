import type { App } from 'vue'
import {
  Close,
  DoubleLeft,
  DoubleRight,
  Github,
  Left,
  More,
  Music,
  MusicCd,
  MusicMenu,
  MusicRhythm,
  Play,
  PlayOne,
  Right,
  Search,
  Theme,
  User,
  Video,
  VideoTwo,
} from '@icon-park/vue-next'

export interface Icons {
  [key: string]: typeof Search
}

export const icons: Icons = {
  IconSearch: Search,
  IconTheme: Theme,
  IconGithub: Github,
  IconLeft: Left,
  IconRight: Right,
  IconUser: User,
  IconMusicCd: MusicCd,
  IconMusicMenu: MusicMenu,
  IconMusic: Music,
  IconVideo: Video,
  IconClose: Close,
  IconPlayOne: PlayOne,
  IconDoubleLeft: DoubleLeft,
  IconDoubleRight: DoubleRight,
  IconMore: More,
  IconVideoTwo: VideoTwo,
  IconMusicRhythm: MusicRhythm,
  IconPlay: Play,
}
export const install = (app: App) => {
  for (const key of Object.keys(icons))
    app.component(key, icons[key])
}
