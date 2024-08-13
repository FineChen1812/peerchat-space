import Peer from 'peerjs'
import { usePeerStore, useUserStore } from '~/store'

export const initPeer = () => {
  return new Promise(resolve => {
    let peerStore = usePeerStore()
    if(peerStore.localPeer) return resolve(null)
    let localPeer = new Peer({
      host: import.meta.env.VITE_PEER_HOST,
      port: import.meta.env.VITE_PEER_PORT,
      path: import.meta.env.VITE_PEER_PATH
    })

    localPeer.on('disconnected', () => {
      console.warn("localPeer disconnected")
      localPeer.reconnect()
    })

    localPeer.on('error', error => {
      console.error("localPeer error,the error information is : ", JSON.stringify(error))
    })

    localPeer.on('open', localPeerId => {
      peerStore.localPeer = localPeer
      resolve(null)
    })
  })
}

export const initWebscoket =() => {
  const { userInfo } = useUserStore()
  let peerStore = usePeerStore()
  peerStore.socket = new WebSocket(`${import.meta.env.VITE_WSS_URL}/api/chat/v1/auth/setRoom?id=${userInfo.id}`)
  peerStore.socket.onmessage = (event: MessageEvent) => {
    const { roomId, inviteId } = JSON.parse(event.data)
    if (inviteId == userInfo.id ) {
      peerStore.inviteId = inviteId
      peerStore.roomId = roomId
    }
    
  }
  peerStore.socket.onclose = event => {
    console.log("webSocketConnection.onclose:", event)
  }
  peerStore.socket.onerror = event => {
    console.log("webSocketConnection.onerror:", event)
  }
  peerStore.socket.onopen = event => {
    console.log("webSocketConnection.onopen:", event)
  }
}

export const getLocalUserMedia = (constraints: MediaStreamConstraints):Promise<MediaStream> => {
  if (window.navigator.mediaDevices.getUserMedia) {
    return window.navigator.mediaDevices.getUserMedia(constraints)
  } else if ((window.navigator as any).webkitGetUserMedia) {
    return (window.navigator as any).webkitGetUserMedia(constraints)
  } else if ((window.navigator as any).mozGetUserMedia) {
    return (window.navigator as any).mozGetUserMedia(constraints)
  } else if ((window.navigator as any).getUserMedia) {
    return (window.navigator as any).getUserMedia(constraints)
  }
  throw new Error("获取本地音视频失败")
}
