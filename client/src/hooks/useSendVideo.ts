import type { DataConnection, MediaConnection } from "peerjs" 
import { usePeerStore, useUserStore } from "~store"
import useGetMedia from "./useGetMedia"
import useRingOff from '~/hooks/useRingOff'
import { mergeArrayBuffers } from "~/utils/util"

const { userInfo } = useUserStore()
const { localVideo, mainVideo, secondaryVideo, mainName, secondaryName, messageList, getTime } = useGetMedia()

export default () => {
  const peerStore = usePeerStore()
  peerStore.localPeer.on('connection', (dataConnection:DataConnection) => {
    dataConnection.off("data")
    dataConnection.on('data', (data: any) => {
      if (data.instruction === peerStore.instruction.request) {
        dataConnection.send({
          instruction: peerStore.instruction.accept,
          userName: userInfo.name
        })
        peerStore.dataConnection = dataConnection
        mainName.value = userInfo.type == 1 ? data.userName : userInfo.name
        secondaryName.value = userInfo.type == 1 ? userInfo.name : data.userName
        getTime()
      }
      if (data.instruction === peerStore.instruction.message) {
        messageList.value.push(data.data)
      }
      if (data.instruction === peerStore.instruction.fileMessage) {
        const fileData = data.data
        let flag = true
        messageList.value.forEach((item) => {
          if (item.id && item.id === fileData.id) {
            flag = false
            if(item.receivedChunks && item.chunkIndex){
              item.receivedChunks[item.chunkIndex] = new Uint8Array(fileData.chunk)
            }
            item.progress && (item.progress += item.progress)
            const checkChunk = item.receivedChunks?.filter(item => item) || []
            if (item.receivedChunks && checkChunk.length === item.totalChunks) {
              item.combinedBlob = new Blob([mergeArrayBuffers(item.receivedChunks)], { type: item.fileType })
            }
          }
        })
        if (flag) {
          const receivedChunks = []
          receivedChunks[fileData.chunkIndex] = new Uint8Array(fileData.chunk)
          messageList.value.push({
            ...fileData,
            receivedChunks,
            progress: Math.ceil(100 / fileData.totalChunks),
            combinedBlob: undefined,
          })
        }
      }

      if (data.instruction === peerStore.instruction.ringOff) {
        useRingOff()
      }
    })
  })

  peerStore.localPeer.on('call', (mediaConnection: MediaConnection) => {
    peerStore.mediaConnection = mediaConnection
    peerStore.mediaConnection.answer(localVideo.value)
    peerStore.mediaConnection.once("stream", (userMedia:MediaStream) => {
      if(userInfo.type == 1 && secondaryVideo.value && mainVideo.value) {
        secondaryVideo.value.srcObject = localVideo.value
        secondaryVideo.value.muted = true
        mainVideo.value.srcObject = userMedia
      }
      if(userInfo.type == 2 && mainVideo.value && secondaryVideo.value) {
        mainVideo.value.srcObject = localVideo.value
        mainVideo.value.muted = true
        secondaryVideo.value.srcObject = userMedia
      }
    })
  })
}