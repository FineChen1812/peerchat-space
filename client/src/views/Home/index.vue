<script lang="ts" setup>
import { SettingOutlined } from '@ant-design/icons-vue'
import { getCurrentDateTime } from '~/utils/util'
import { initWebscoket, initPeer } from '~/utils/meeting'
import { message } from 'ant-design-vue'
import { useClipboard } from '@vueuse/core'
import useGetMedia from '~/hooks/useGetMedia'

import { useUserStore } from '~store'

const time = ref('')
const date = ref('')
const router = useRouter()
let timer:ReturnType<typeof setInterval> | null = null
const userStore = useUserStore()

onMounted(() => {
  timer = setInterval(() => {
    const dateTime = getCurrentDateTime()
    time.value = dateTime.split(' ')[1]
    date.value = dateTime.split(' ')[0]
  }, 1000)
  if (userStore.userInfo) {
    initPeer().then(() => {
      initWebscoket()
    })
  }
})

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})

const login = () => {
  router.push('/login')
}

const { isVideoEnabled, isAudioEnabled } = useGetMedia()
const open = ref<boolean>(false)
const isStart = ref<boolean>(true)
const title = ref<string>('发起会议')
const meetingNum = ref<number | null>(null)

const startMeeting = () => {
  if (!userStore.userInfo) return message.warning('请先登录!')
  isStart.value = true
  open.value = true
  title.value = '发起会议'
}

const joinMeeting = () => {
  if (!userStore.userInfo) return message.warning('请先登录!')
  isStart.value = false
  open.value = true
  title.value = '加入会议'
}

const onBlur = () => {

}

const inputNum = ref('12345678')
const { copy, copied } = useClipboard()
watch(copied, (val)=> {
  if (val) message.success({ content: '复制成功!', duration: 2 })
})
</script>
<template>
  <a-modal v-model:open="open" :title="title" width="400px" :footer="null" :maskClosable="false" :centered="true">
    <div v-if="isStart" class="flex items-center justify-between mt-5">
      <div class="w-[150px]">个人会议号</div>
      123456678
      <a-tooltip>
        <template #title>复制会议号</template>
        <IconCopy class="cursor-pointer" @click="copy(inputNum)"/>
      </a-tooltip>
    </div>
    <div v-if="!isStart" class="flex items-center mt-5">
      <div class="w-[50px]">会议号</div>
      <a-input class="w-full ml-[10px]" :allowClear="true" :bordered="false" v-model:value="meetingNum"
        placeholder="请输入会议号"
        :max-length="25"
        @blur="onBlur"
      />
    </div>
    <div class="flex items-center justify-between mt-5">
      <div>入会时打开摄像头</div>
      <a-switch v-model:checked="isVideoEnabled" checked-children="开" un-checked-children="关" />
    </div>
    <div class="flex items-center justify-between mt-5">
      <div>入会时打开麦克风</div>
      <a-switch v-model:checked="isAudioEnabled" checked-children="开" un-checked-children="关" />
    </div>
    <a-button size="large" class="w-full mt-5" type="primary">{{ title }}</a-button>
  </a-modal>
  <div class="w-full h-full flex justify-center items-center">
    <div class="w-[720px] h-[480px] shadow-md rounded-[10px] bg-[#f0f1f5] flex">
      <div class="h-full w-[75px] text-center flex p-[20px] pt-[40px] flex-col justify-between">
        <div>
          <a-avatar v-if="userStore.userInfo" class="text-white bg-[#1677ff]">{{ userStore.userInfo.username.substr(-2, 2) }}</a-avatar>
          <span v-else class="text-sm text-[#1677ff] cursor-pointer" @click="login">登录</span>
        </div>
        <div><SettingOutlined /></div>
      </div>
      <div class="bg-white w-full rounded-[10px] border-t-[#f0f1f5] border-t flex items-center">
        <div class="w-[330px] flex justify-center items-center h-full">
          <div>
            <div class="w-[72px] cursor-pointer h-[72px] flex flex-wrap justify-center items-center bg-[#1677ff] rounded-2xl" @click="startMeeting">
              <IconPhoneVideoCall theme="filled" size="48" fill="#fff"/>
            </div>
            <div class="text-sm text-[#53576a] text-center mt-4">发起会议</div>
          </div>
          <div class="ml-[15px]">
            <div class="w-[72px] cursor-pointer h-[72px] flex flex-wrap justify-center items-center bg-[#1677ff] rounded-2xl" @click="joinMeeting">
              <IconAdd theme="multi-color" size="48" :fill="['#ffffff' ,'#ffffff' ,'#1677ff' ,'#1677ff']"/>
            </div>
            <div class="text-sm text-[#53576a] text-center mt-4">加入会议</div>
          </div>
        </div>
        <div class="w-[290px] h-[400px] border rounded-[10px]">
          <div class="w-full h-[72px] py-2 px-4 text-white bg-cover rounded-t-[10px] bg-[url('~/assets/images/meetBg.png')]">
            <div class="text-2xl">{{ time }}</div>
            <div class="text-sm">今日 {{ date }}</div>
          </div>
          <div>
            <img class="mt-[57px]" src="../../assets/images/emptyWait.png">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>