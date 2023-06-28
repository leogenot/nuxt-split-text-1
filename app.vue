<script setup>
const data = ref(
  '<h2 class="ts-label-m">New site after a decade</h2><p class="ts-body-xl">One of the defining aspects of our agency is our optimal team size. We have discovered that maintaining a compact team of between 15 and 20 members allows us to achieve the best results for our clients and ourselves. By deliberately keeping our team size within this range, we ensure efficient collaboration, open communication, and seamless coordination.</p>'
)
const elements = computed(() => {
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = data.value
  return Array.from(tempDiv.childNodes)
})
const progress = ref(0)
</script>
<template>
  <input type="range" min="0" max="1" step="0.001" v-model="progress" />
  <div v-for="(element, index) in elements" :key="index">
    <stagger-animation :data="element.outerHTML" :progress="progress" />
  </div>
</template>

<style></style>
