<script lang="ts" setup>
import { SmileOutlined, PictureOutlined, FolderOpenOutlined, UserOutlined, VerticalAlignBottomOutlined  } from '@ant-design/icons-vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import { EmojiList } from '~/utils/emoji'
import { getCurTime, getImageUrl, mergeArrayBuffers } from '~/utils/util'
import { usePeerStore, useUserStore } from '~/store'
import useGetMedia from '~/hooks/useGetMedia'

const messages = ref('')
const showEmoji = ref(false)
const peerStore = usePeerStore()
const userStore = useUserStore()
const { messageList } = useGetMedia()


const sendMessage = () => {
  if (!messages.value || !peerStore.dataConnection) return
  const data = {
    messageType: 1,
    user: userStore.userInfo.name,
    time: getCurTime(),
    message: messages.value
  }
  peerStore.dataConnection.send({
    instruction: peerStore.instruction.message,
    data: {
      ...data,
      type: 2 // 2 代表对方, 1是己方
    }
  })
  messageList.value.push({...data, type: 1})
  messages.value = ''
  showEmoji.value = false
}
const addEmoji = (item:string) =>  {
  messages.value += item
}

const image:Ref<HTMLElement | null> = ref(null)
const choosePhoto = () => {
  if (image.value)image.value.click()
}

const sendImage = (e: Event) => {
  const target = e.target as HTMLInputElement
  const [file] = (target.files as FileList)
  if (!file || !peerStore.dataConnection) return  
  const blob = new Blob([file], { type: file.type })
  blob.arrayBuffer().then((arrayBuffer: ArrayBuffer) => {
    const data = {
      user: userStore.userInfo.name,
      time: getCurTime(),
      image: arrayBuffer,
      messageType: 2, // 1 文字， 2 图片 3 文件 
    }
    peerStore.dataConnection.send({
      instruction: peerStore.instruction.message,
      data: {
        ...data,
        type: 2
      }
    })
    messageList.value.push({...data, type: 1})
  })
}

const file: Ref<HTMLElement | null> = ref(null)
const chooseFile = () => {
  if (file.value)file.value.click()
}

const sendFile = (e: Event) => {
  const target = e.target as HTMLInputElement
  const [file] = (target.files as FileList)
  if (!file || !peerStore.dataConnection) return
  let date = new Date()
  const id = date.getTime()
  const chunkSize = 1024 * 1024
  let cur = 0
  let end = chunkSize

  const totalChunks = Math.ceil(file.size / chunkSize)
  for (let i = 0; i < totalChunks; i++) {
    if (i === totalChunks - 1) {
      end = file.size
    }
    const blobChunk = file.slice(cur, cur + chunkSize)
    cur += chunkSize
    blobChunk.arrayBuffer().then((chunkArrayBuffer: ArrayBuffer) => {
      const data = {
        user: userStore.userInfo.name,
        time: getCurTime(),
        chunk: chunkArrayBuffer,
        chunkIndex: i,
        messageType: 3,
        fileType: file.type,
        fileName: file.name,
        type: 2,
        totalChunks,
        id
      }
      peerStore.dataConnection.send({
        instruction: peerStore.instruction.fileMessage,
        data
      })
      let flag = true
      messageList.value.forEach((item) => {
        if (item.id && item.id === data.id) {
          flag = false
          if(item.receivedChunks && item.chunkIndex){
            item.receivedChunks[item.chunkIndex] = new Uint8Array(data.chunk)
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
        receivedChunks[data.chunkIndex] = data.chunk
        messageList.value.push({
          ...data,
          receivedChunks,
          progress: Math.ceil(100 / data.totalChunks),
          combinedBlob: undefined,
        })
      } 
    })
  }
}

const downloadFile = (blob: Blob | undefined, fileName: string | undefined) => {
  if (!blob) return
  const blobURL = URL.createObjectURL(blob)
  const downloadLink = document.createElement('a')
  downloadLink.href = blobURL
  downloadLink.download = fileName || '会议文件'
  downloadLink.style.display = 'none'
  document.body.appendChild(downloadLink)
  downloadLink.click()
  document.body.removeChild(downloadLink)
  URL.revokeObjectURL(blobURL)
}
</script>

<template>
  <div class="min-h-screen">
    <div class="h-[30px] border-b border-gray-300 leading-[30px] text-center">聊天</div>
    <div class="h-[calc(100vh-180px)] p-[5px] overflow-y-scroll">
      <div v-for="(item, index) in messageList" :key="index">
        <div class="mt-[10px]" v-if="item.type == 2">
          <div class="flex">
            <a-avatar style="background-color: #87d068;">
              <template #icon> <UserOutlined /></template>
            </a-avatar>
            <div>{{ item.user }} <span >{{ item.time }}</span></div>
          </div>
          <div class="text-[12px] ml-[35px]">
            <span v-if="item.messageType == 1" >{{ item.message }}</span>
            <a-config-provider :locale="zhCN" v-if="item.messageType == 2">
              <a-image  :width="100" :src="getImageUrl(item.image)"/>
            </a-config-provider>
            <div v-if="item.messageType == 3" class="border">
              <div>
                <FolderOpenOutlined /> <span class="mx-[10px]">{{ item.fileType }}</span> <VerticalAlignBottomOutlined @click="downloadFile(item.combinedBlob, item.fileName)" />
              </div>
              <a-progress :percent="(item.progress && item.progress >= 100) ? 100 : item.progress" :status="(item.progress && item.progress >= 100) ? '' : 'active'" />
            </div>
          </div>
        </div>
        <div class="mt-[10px] overflow-hidden" v-else>
          <div class="float-right">
            <div class="flex justify-end">
              <div>{{ item.user }} <span >{{ item.time }}</span></div>
              <a-avatar style="background-color: #87d068;">
                <template #icon> <UserOutlined /></template>
              </a-avatar>
            </div>
            <div class="text-[12px] mr-[35px]">
              <span v-if="item.messageType == 1" >{{ item.message }}</span>
              <a-config-provider :locale="zhCN" v-if="item.messageType == 2">
                <a-image  :width="100" :src="getImageUrl(item.image)"/>
              </a-config-provider>
              <div v-if="item.messageType == 3" class="border">
                <div>
                  <FolderOpenOutlined /> <span class="mx-[10px]">{{ item.fileType }}</span> <VerticalAlignBottomOutlined @click="downloadFile(item.combinedBlob, item.fileName)" />
                </div>
                <a-progress :percent="(item.progress && item.progress >= 100) ? 100 : item.progress" :status="(item.progress && item.progress >= 100) ? '' : 'active'" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
    <div class="h-[150px] border-t border-gray-300 leading-[30px] text-center relative">
      <div class="flex">
        <div class="w-[30px] cursor-pointer" @click.stop="showEmoji = !showEmoji"><SmileOutlined /></div>
        <div class="w-[30px] cursor-pointer " @click="choosePhoto"><PictureOutlined /> <input ref="image" class="hidden" type="file" accept="image/*" @change="sendImage"/></div>
        <div class="w-[30px] cursor-pointer" @click="chooseFile"><FolderOpenOutlined /><input ref="file" class="hidden" type="file" accept="*" @change="sendFile"/></div>
      </div>
      <a-textarea  v-model:value="messages" :auto-size="{  maxRows: 4 }" :bordered="false" placeholder="请输入信息,并按enter键发送" @click.stop="showEmoji = false"  @pressEnter.prevent="sendMessage"/>
      <div class="absolute w-[320px] h-[190px] z-50 -top-[190px] border-t" v-if="showEmoji">
        <div class="flex flex-wrap overflow-auto h-full w-full">
          <div class="cursor-pointer text-[18px] py-[5px] px-[5px] hover:bg-[#eee]"v-for="item, index in EmojiList" :key="index" @click.stop="addEmoji(item)">{{ item }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
::-webkit-scrollbar {
  display: none;
}
</style>
