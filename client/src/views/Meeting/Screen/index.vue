<script lang="ts" setup>
import { UserOutlined  } from '@ant-design/icons-vue'
import { usePeerStore } from '~store'
import { storeToRefs } from 'pinia'
import { message } from 'ant-design-vue'
import useAcceptVideo from '~/hooks/useAcceptVideo'
import useGetMedia from '~/hooks/useGetMedia'

const { inviteId, roomId, localPeer } = storeToRefs(usePeerStore())
const open = ref(false)
const { localVideo, mainVideo, secondaryVideo, mainName, secondaryName, time } = useGetMedia()

watch(inviteId, () => {
  if(inviteId.value)open.value = true
})

onMounted(() => {
  if(!localPeer.value) {
    const router = useRouter()
    router.push('/home')
    return
  }
  if(mainVideo.value){
    mainVideo.value.srcObject = localVideo.value
    mainVideo.value.muted = true
  }
})
  
</script>

<template>
  <div class="w-full h-full bg-black relative">
    <video class="w-full h-full" ref="mainVideo" autoplay muted></video>
    <div class="text-white absolute bottom-0" v-if="mainName"><UserOutlined />{{ mainName }}</div>
    <div class="absolute bg-red-400 right-0 top-0">
      <video class="w-[240px] h-[135px]" ref="secondaryVideo" autoplay muted></video>
      <div class="text-white absolute bottom-0" v-if="secondaryName"><UserOutlined />{{ secondaryName }}</div>
    </div>
    <div class="absolute text-white left-1 top-1 flex items-center">
      <IconTime/>{{ time }}
    </div>
  </div>
</template>

<style scoped>

</style>