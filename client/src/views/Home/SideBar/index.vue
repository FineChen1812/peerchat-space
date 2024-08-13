<script lang="ts" setup>
import User from "./user.vue"
import Message from "./message.vue"

const props = defineProps<{
  type: string
}>()
const type = computed(() => props.type)

</script>

<template>
  <div>
    <component :is="type == 'chat'? Message:User "></component>
  </div>
</template>

<style scoped>
</style>
