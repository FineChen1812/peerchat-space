<script lang="ts" setup>
import { UserOutlined  } from '@ant-design/icons-vue'
import { usePeerStore } from '~/store'
import { storeToRefs } from 'pinia'
import { message } from 'ant-design-vue'
import useAcceptVideo from '~/hooks/useAcceptVideo'
import useGetMedia from '~/hooks/useGetMedia'


const { inviteId, roomId } = storeToRefs(usePeerStore())
const open = ref(false)
const { localVideo, mainVideo, secondaryVideo, mainName, secondaryName, time } = useGetMedia()

watch(inviteId, () => {
  if(inviteId.value)open.value = true
})

const accept = () => {
  open.value = false
  if(!localVideo.value) {
    message.error('获取本地媒体失败')
    return
  }
  useAcceptVideo()
}

const reject = () => {
  message.error('取消通话')
  inviteId.value = null
  roomId.value = null
  open.value = false
}
  
</script>

<template>
  <div class="w-full h-full bg-black relative">
    <a-modal v-model:open="open" :maskClosable="false" :closable="false" title="提示" ok-text="接受" cancel-text="拒绝" @ok="accept" @cancel="reject">
      您有新的通话请求，是否接听？
    </a-modal>
    <video class="w-full h-full" ref="mainVideo" autoplay muted></video>
    <div class="text-white absolute bottom-0" v-if="mainName"><UserOutlined />{{ mainName }}</div>
    <div class="absolute bg-red-400 right-0 top-0">
      <video class="w-[240px] h-[135px]" ref="secondaryVideo" autoplay muted></video>
      <div class="text-white absolute bottom-0" v-if="secondaryName"><UserOutlined />{{ secondaryName }}</div>
    </div>
    <div class="absolute text-white left-0 top-0">{{ time }}</div>
  </div>
</template>

<style scoped>

</style>