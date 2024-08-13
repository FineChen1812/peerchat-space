<script lang="ts" setup>
import { h } from 'vue'
import { VideoCameraOutlined } from '@ant-design/icons-vue'
import { UserList } from '~/api/user'
import { usePeerStore } from '~/store'
import useSendVideo from '~/hooks/useSendVideo'

const active = ref(1)
const list = ref([])
const userList = ref([])
const handleClick = (tab: number) => {
  list.value = userList.value.filter((item:any) => item.type == tab)
}
const startVedio = (item:any) => {
  const { socket, localPeer } = usePeerStore()
  let data = {
    invite: item.id,
    roomId: localPeer.id
  }
  socket?.send(JSON.stringify(data))
  useSendVideo()
}

onMounted(() => {
  UserList().then((res:any) => {
    list.value = res.data.filter((item:any) => item.type == active.value)
    userList.value = res.data
  })
})
</script>

<template>
  <div>
    <a-tabs v-model:activeKey="active" @tabClick="handleClick" class="p-2">
      <a-tab-pane tab="专家" :key="1"></a-tab-pane>
      <a-tab-pane tab="设备" :key="2"></a-tab-pane>
    </a-tabs>
    <a-list  item-layout="horizontal" :data-source="list">
      <template #renderItem="{ item }">
        <a-list-item>
          <a-skeleton avatar :title="false" :loading="!!item.loading" active>
            <a-list-item-meta
              :description="item.remark">
              <template #title>
                {{ item.name }}
              </template>
              <template #avatar>
                <a-avatar src="https://joeschmoe.io/api/v1/random" />
              </template>
            </a-list-item-meta>
            <div>
              <span :class="item.online_status == 'online'? 'text-green-500': 'text-red-500'">{{ item.online_status == 'offline'? '离线': '在线' }}</span>
              <a-button :disabled="item.online_status == 'offline'" type="primary" shape="circle" :icon="h(VideoCameraOutlined)" @click="startVedio(item)"/>
            </div>
          </a-skeleton>
        </a-list-item>
      </template>
    </a-list>
  </div>
</template>

<style scoped></style>
