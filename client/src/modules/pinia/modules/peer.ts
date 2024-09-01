import { defineStore } from 'pinia'

export interface PeerData {
  roomId: number | null,
  inviteId: number | null,
  localPeer: any,
  dataConnection: any,
  mediaConnection: any,
  instruction: any,
  socket: WebSocket | undefined
}

export const usePeerStore = defineStore('peer', {
  state: (): PeerData => ({
    // 被邀请人id
    inviteId: null,
    // 房间ID
    roomId: null,
    // 本地对等体对象
    localPeer: undefined,
    // 正在通话的数据连接对象(消息)
    dataConnection: undefined,
    // 正在通话的媒体连接对象
    mediaConnection: undefined,
    // 视频通话指令枚举值
    instruction: {
      // 请求视频通话
      request: 1,
      // 拒绝视频通话
      reject: 2,
      // 接受视频通话
      accept: 3,
      // 取消视频通话
      cancel: 4,
      // 正常挂断
      ringOff: 5,
      // 忙碌挂断
      busy: 6,
      // 消息推送
      message: 7,
      // 文件消息
      fileMessage: 8,
    },
    // webscoket实例
    socket: undefined
  })
})