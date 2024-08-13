import { usePeerStore } from '~/store'
import useGetMedia from '~/hooks/useGetMedia'

export default () => {
  const peerStore = usePeerStore()
  const { messageList, secondaryName, timer, time } = useGetMedia()
  peerStore.dataConnection.close()
  peerStore.dataConnection = undefined
  peerStore.mediaConnection.close()
  peerStore.mediaConnection = undefined
  peerStore.roomId = null
  peerStore.inviteId = null
  messageList.value = []
  secondaryName.value = ''
  if(timer.value)clearInterval(timer.value)
  timer.value = null
  time.value = '00:00'
}