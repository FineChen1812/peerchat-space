<script lang="ts" setup>
import { SettingOutlined } from '@ant-design/icons-vue'
import { getCurrentDateTime } from '~/utils/util'

const time = ref('')
const date = ref('')
const router = useRouter()
let timer:ReturnType<typeof setInterval> | null = null

onMounted(() => {
  timer = setInterval(() => {
    const dateTime = getCurrentDateTime()
    time.value = dateTime.split(' ')[1]
    date.value = dateTime.split(' ')[0]
  }, 1000)
})

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})

const login = () => {
  router.push('/login')
}

</script>
<template>
  <div class="w-full h-full flex justify-center items-center">
    <div class="w-[720px] h-[480px] shadow-md rounded-[10px] bg-[#f0f1f5] flex">
      <div class="h-full w-[75px] text-center flex p-[20px] pt-[40px] flex-col justify-between">
        <div>
          <span class="text-sm text-[#1677ff] cursor-pointer" @click="login">登录</span>
          <!-- <a-avatar class="text-white bg-[#1677ff]">阿峰</a-avatar> -->
        </div>
        <div><SettingOutlined /></div>
      </div>
      <div class="bg-white w-full rounded-[10px] border-t-[#f0f1f5] border-t flex items-center">
        <div class="w-[330px] flex justify-center items-center h-full">
          <div>
            <div class="w-[72px] cursor-pointer h-[72px] flex flex-wrap justify-center items-center bg-[#1677ff] rounded-2xl">
              <IconPhoneVideoCall theme="filled" size="48" fill="#fff"/>
            </div>
            <div class="text-sm text-[#53576a] text-center mt-4">发起会议</div>
          </div>
          <div class="ml-[15px]">
            <div class="w-[72px] cursor-pointer h-[72px] flex flex-wrap justify-center items-center bg-[#1677ff] rounded-2xl">
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