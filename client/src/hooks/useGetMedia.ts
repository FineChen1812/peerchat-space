import { getLocalUserMedia } from "~/utils/meeting"

interface Messsage {
  id?: number,
  type: number,
  time: string,
  message?: string,
  user: string,
  image?: ArrayBuffer,
  messageType: number,
  receivedChunks?: ArrayBuffer[],
  progress?: number,
  chunkIndex?: number,
  totalChunks?: number,
  combinedBlob?: Blob,
  fileType?: string,
  fileName?: string
}

const localVideo:Ref<MediaStream | null> = ref(null)
const mainVideo:Ref<HTMLVideoElement | null> = ref(null)
const mainName:Ref<string> = ref('')
const secondaryName:Ref<string> = ref('')
const secondaryVideo:Ref<HTMLVideoElement | null> = ref(null)
const messageList:Ref<Messsage[]> = ref([])
const timer:Ref< ReturnType<typeof setInterval> | null> = ref(null)
const time:Ref<string> = ref('00:00')
const cameraId:Ref<string> = ref('') 
const microphoneId:Ref<string> = ref('') 

const getTime = () => {
  let seconds = 0
  let minutes = 0
  timer.value = setInterval(() => {
    seconds++
    if(seconds == 60) {
      minutes++
      seconds = 0
    }
    time.value = `${minutes > 9 ? minutes : ('0' + minutes)}:${seconds > 9 ? seconds : ('0' + seconds)}`
  }, 1000)
}

const getMeadia = (constraints:MediaStreamConstraints) => {
  getLocalUserMedia(constraints).then((userMedia:MediaStream) => {
    localVideo.value = userMedia
  })
}

export default () => {
  watchEffect(() => {
    const constraints = {
      video: {
        deviceId: cameraId.value
      },
      audio: {
        deviceId: microphoneId.value,
        echoCancellation: true
      }
    }
    getMeadia(constraints)
  })
  
  return {
    localVideo,
    mainVideo,
    secondaryVideo,
    secondaryName,
    mainName,
    messageList,
    timer,
    time,
    getTime,
    cameraId,
    microphoneId
  }
}