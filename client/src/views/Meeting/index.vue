<script lang="ts" setup>
import Toolbar from './Toolbar/index.vue'
import SideBar from './SideBar/index.vue'
import Screen from './Screen/index.vue'
import { initWebscoket, initPeer } from '~/utils/meeting'
import { usePeerStore } from '~store'
const type = ref('user')
const selectFeature = (selectType:any) => {
  type.value = selectType
}

onMounted(() => {
  initPeer().then(() => {
    initWebscoket()
  })
})

const peerStore = usePeerStore()
onBeforeUnmount(() => {
  if (peerStore.localPeer) {
    peerStore.localPeer.destroy()
  }
})
</script>

<template>
  <div class="w-full h-full flex">
    <div class="flex-1 w-full">
      <Screen class="!h-[calc(100vh-60px)]"/>
      <Toolbar @selectFeature="selectFeature"/>
    </div>
    <SideBar :type="type" class="w-[320px]"/>
  </div>
</template>

<style></style>