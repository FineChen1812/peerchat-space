import { usePeerStore, useUserStore } from "~store"
import useGetMedia from '~/hooks/useGetMedia'
import useRingOff from '~/hooks/useRingOff'
import { mergeArrayBuffers } from "~/utils/util"


const { userInfo } = useUserStore()
const { localVideo, mainVideo, secondaryVideo, mainName, secondaryName, getTime, messageList } = useGetMedia()

export default () => {
  const peerStore = usePeerStore()
  peerStore.dataConnection = peerStore.localPeer.connect(peerStore.roomId)
  peerStore.dataConnection.off("data")
  peerStore.dataConnection.on("data", (data:any) => {
    if (data.instruction === peerStore.instruction.accept) {
      peerStore.mediaConnection = peerStore.localPeer.call(peerStore.roomId, localVideo.value)
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
          if(item.receivedChunks && fileData.chunkIndex !== undefined){
            item.receivedChunks[fileData.chunkIndex] = fileData.chunk
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
        receivedChunks[fileData.chunkIndex] = fileData.chunk
        messageList.value.push({
          ...fileData,
          receivedChunks,
          progress: Math.ceil(100 / fileData.totalChunks),
          combinedBlob: undefined,
        })
      } 
    }

    if (data.instruction === peerStore.instruction.ringOff) {
      peerStore.dataConnection.close()
      useRingOff()
    }
    
  })

  peerStore.dataConnection.on('open', () => {
    console.log( 'open')
    peerStore.dataConnection.send({
      instruction: peerStore.instruction.request,
      userName: userInfo.name
    })
  })
}