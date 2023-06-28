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

const target = ref(null)
const targetIsVisible = ref(false)

const { stop } = useIntersectionObserver(
  target,
  ([{ isIntersecting }], observerElement) => {
    targetIsVisible.value = isIntersecting
    console.log(isIntersecting)
  }
)
</script>
<template>
  <!-- <input type="range" min="0" max="1" step="0.001" v-model="progress" /> -->
  <div class="rte" ref="target">
    <div v-for="(element, index) in elements" :key="index">
      <stagger-animation :data="element.outerHTML" :start="targetIsVisible" />
    </div>
  </div>
</template>

<style>
body {
  height: 300vh;
}

.rte {
  top: 150vh;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}
</style>
