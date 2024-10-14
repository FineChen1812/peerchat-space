<script lang="ts" setup>
import { AudioOutlined, MessageOutlined, VideoCameraOutlined, UserOutlined, CaretDownOutlined  } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { usePeerStore } from '~store'
import useRingOff from '~/hooks/useRingOff'
import useGetMedia from '~/hooks/useGetMedia'

const emit = defineEmits<{
  (event: 'selectFeature', payload: 'chat' | 'user'): void
}>()

const peerStore = usePeerStore()

const selectFeature = (type:'chat' | 'user') => {
  emit('selectFeature', type)
}

const closeMeeting = () => {
  peerStore.dataConnection.send({
    instruction: peerStore.instruction.ringOff
  })
  useRingOff()
}

const cameras: Ref<MediaDeviceInfo[]> = ref([])
const microphones: Ref<MediaDeviceInfo[]> = ref([])
const { cameraId, microphoneId, isVideoEnabled, isAudioEnabled, localVideo } = useGetMedia()
const getDevices = async () => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices()
    cameras.value = devices.filter(device => device.kind === 'videoinput')
    microphones.value = devices.filter(device => device.kind === 'audioinput')
    // 设置默认摄像头和麦克风
    if (cameras.value.length > 0) {
      cameraId.value = cameras.value[0].deviceId
    }
    if (microphones.value.length > 0) {
      microphoneId.value = microphones.value[0].deviceId
    }
  } catch (error) {
    message.error('获取本地媒体失败')
  }
}

const disableVideo = () => {
  if (localVideo.value) {
    localVideo.value.getVideoTracks().forEach(track => track.enabled = isVideoEnabled.value)
    isVideoEnabled.value = !isVideoEnabled.value
  }
}

const disableAudio = () => {
  if (localVideo.value) {
    localVideo.value.getAudioTracks().forEach(track => track.enabled = isAudioEnabled.value)
    isAudioEnabled.value = !isAudioEnabled.value
  }
}

onMounted(() => {
  getDevices()
  if (localVideo.value)localVideo.value.getVideoTracks().forEach(track => track.enabled = isVideoEnabled.value)
  if (localVideo.value)localVideo.value.getAudioTracks().forEach(track => track.enabled = isAudioEnabled.value)
})
</script>

<template>
  <div class="h-[60px] w-full flex justify-center pt-[5px] relative" style="background-image: linear-gradient(180deg, #33333f, #292933);">
    <div class="text-white text-center px-[10px] cursor-pointer" @click="disableAudio">
      <div class="text-[18px]"><AudioOutlined /> </div>
      解除静音
    </div>
    <div class="cursor-pointer text-white leading-[40px]">
      <a-dropdown placement="top">
        <CaretDownOutlined />
        <template #overlay>
          <a-menu>
            <a-radio-group v-model:value="microphoneId">
              <a-radio v-for="microphone in microphones" :key="microphone.deviceId" style="display:flex;height:30px;line-height: 30px;" :value="microphone.deviceId">
                {{ microphone.label || 'Microphone ' + microphone.deviceId }}
              </a-radio>
            </a-radio-group>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
    <div class="text-white text-center px-[10px] cursor-pointer" @click="disableVideo">
      <div class="text-[18px]"><VideoCameraOutlined /></div>
      开启视频
    </div>
    <div class="cursor-pointer text-white leading-[40px]">
      <a-dropdown placement="top">
        <CaretDownOutlined />
        <template #overlay>
          <a-menu>
            <a-radio-group v-model:value="cameraId">
              <a-radio v-for="camera in cameras" :key="camera.deviceId" style="display:flex;height:30px;line-height: 30px;" :value="camera.deviceId">
                {{ camera.label || 'Camera ' + camera.deviceId }}
              </a-radio>
            </a-radio-group>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
    <div class="text-white text-center px-[10px] cursor-pointer" @click="selectFeature('chat')">
      <div class="text-[18px]"><MessageOutlined /></div>
      聊天
    </div>
    <div class="text-white text-center px-[10px] cursor-pointer" @click="selectFeature('user')">
      <div class="text-[18px]"><UserOutlined /></div>
      用户
    </div>
    <div>
      <div 
        class="absolute right-[20px] top-[14px] px-[14px] py-[6px] cursor-pointer text-red-600 rounded-[4px] bg-black" 
        @click="closeMeeting"
        v-if="peerStore.dataConnection">
        退出会议
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>