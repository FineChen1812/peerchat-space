<script setup lang="ts">
import { UserRegister, UserLogin } from "~/api/auth"
import { useUserStore } from '~/store'

import { message } from 'ant-design-vue'
const userStore = useUserStore()

const loginForm = ref({
  username: "",
  password: "",
})
const router = useRouter()

const submitForm = () => {
  UserLogin(loginForm.value).then((res:any) => {
   if (res.code == 200) {
      userStore.setToken(res.data.token)
      userStore.setUserInfo(res.data.info)
      message.success("登录成功")
      router.push("/home")
   } else {
    message.error(res.message)
   }
  })
}

const register = () => {
  UserRegister({...loginForm.value}).then((res:any) => {
    if (res.code == 200) {
      message.success("注册成功")
    } else {
      message.error(res.message)
    }
  })
}

</script>

<template>
  <div class="w-full h-[100vh] flex">
    <div class="mt-[46px] w-[365px]">
          <a-form  :model="loginForm" >
            <a-form-item >
              <a-input v-model:value="loginForm.username" type="text"  placeholder="请输入用户名">
              </a-input>
            </a-form-item>
            <a-form-item >
              <a-input v-model:value="loginForm.password" type="password"  placeholder="请输入密码">
              </a-input>
            </a-form-item>
            <a-form-item>
              <a-button  type="primary" danger class="w-full h-[60px] text-[24px]" @click.native.prevent="register">
                <span >注 册</span>
              </a-button>
            </a-form-item>
            <a-form-item>
              <a-button  type="primary" class="w-full h-[60px] text-[24px]" @click.native.prevent="submitForm">
                <span >登 录</span>
              </a-button>
            </a-form-item>
          </a-form>
        </div>
  </div>
</template>

<style scoped>

</style>