<script setup lang="ts">
import { UserRegister, UserLogin } from '~/api/auth'
import { useUserStore } from '~store'

import { message } from 'ant-design-vue'
const userStore = useUserStore()

const loginForm = ref({
  username: '',
  password: '',
})
const router = useRouter()

const submitForm = () => {
  UserLogin(loginForm.value).then((res: any) => {
    if (res.code == 200) {
      userStore.setToken(res.data.token)
      userStore.setUserInfo(res.data.info)
      message.success('登录成功')
      router.push('/home')
    } else {
      message.error(res.message)
    }
  })
}

const register = () => {
  UserRegister({ ...loginForm.value }).then((res: any) => {
    if (res.code == 200) {
      message.success('注册成功')
    } else {
      message.error(res.message)
    }
  })
}

const isLog = ref(false)

</script>
<template>
  <div class="w-full h-full flex justify-center items-center">
    <div
      class="w-[400px] h-[500px] shadow-md rounded-[10px] border-t-[10px] border-t-[#1677ff] border-b-[10px] border-b-[#0099CC] text-center">
      <div class="text-4xl mt-[60px]">
        <span class="text-[#1677ff]">peerchat-</span>
        <span class="text-[#0099CC]">space</span>
      </div>
      <div class="text-[#a1a4ad] mt-[10px]">一个基于peerjs的会议室练习项目.</div>
      <a-form :model="loginForm" class="px-6 mt-[50px]">
        <a-form-item>
          <a-input class="px-[6px] py-[10px]" v-model:value="loginForm.username" type="text" placeholder="请输入用户名">
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-input class="px-[6px] py-[10px]" v-model:value="loginForm.password" type="text" placeholder="请输入密码">
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" class="w-full h-[50px] mt-[10px] text-[24px] rounded-full" @click.native.prevent="isLog? register():submitForm()">
            <span>{{  isLog ? '注 册' : '登 录'}}</span>
          </a-button>
          <div class="mt-[10px] text-end text-[#1677ff] cursor-pointer" @click="isLog = !isLog">
            {{  isLog ? '已有账号?登录' : '没账号?注册'}}
          </div>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<style scoped></style>
