<script setup>
const props = defineProps({
  text: String,
})
</script>

<template>
  <div class="rich-text" v-html="text" />
</template>

<style></style>
