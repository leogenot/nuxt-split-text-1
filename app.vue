<script setup>
const text = `We work in many different ways depending on the client, project and budget. We work in teams and try to involve everybody all the way. We like projects to be short and intense even if it’s not always a possibility.We have a sprint based process framework called “The Involver” which we apply on all projects.`

const textRef = ref(null)

const lineAmount = ref(0)
const lineHeight = ref(0)

const linear = t => t
const easeInQuad = t => t * t
const easeOutQuad = t => t * (2 - t)
const easeInOutQuad = t => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t)
const easeInCubic = t => t * t * t
const easeOutCubic = t => --t * t * t + 1
const easeInOutCubic = t =>
  t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
const easeInQuart = t => t * t * t * t
const easeOutQuart = t => 1 - --t * t * t * t
const easeInOutQuart = t =>
  t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t
const easeInQuint = t => t * t * t * t * t
const easeOutQuint = t => 1 + --t * t * t * t * t
const easeInOutQuint = t =>
  t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t

// same as https://processing.org/reference/map_.html
// ex: reMap(1, 0, 5) -> 0.2
const remap = (value, low1, high1, low2 = 0, high2 = 1) => {
  return low2 + ((high2 - low2) * (value - low1)) / (high1 - low1)
}

const between = (progress, { easing, time: [min, max] }) => {
  // remaps min-max to 0-1
  const progressValue = unref(progress)
  if (min >= progressValue) return 0
  if (max <= progressValue) return 1

  return easing(remap(progressValue, min, max))
}

watch(textRef, () => {
  if (!textRef.value) return

  const { height } = textRef.value.getBoundingClientRect()
  const { fontSize, lineHeight: lh } = getComputedStyle(textRef.value)

  lineHeight.value = parseFloat(lh) / parseFloat(fontSize)

  lineAmount.value = Math.round(height / parseFloat(lh))
})

const progress = ref(0)

const staggerValue = 10

const getStaggeredProgress = idx => {
  const section = 1 / lineAmount.value
  const stagger = section * idx

  return between(progress, {
    easing: easeOutQuint,
    time: [stagger, stagger + section],
  })
}

const getMask = idx => {
  const start =
    (idx + 1) * lineHeight.value - getStaggeredProgress(idx) * lineHeight.value
  const stop = (idx + 1) * lineHeight.value

  const visible = 'black'
  const hidden = 'rgba(0,0,0,0)'

  return {
    maskImage: `linear-gradient(
      ${hidden} ${start}em,
      ${visible} ${start}em,
      ${visible} ${stop}em,
      ${hidden} ${stop}em)
    `,
  }
}

const getTransform = idx => {
  return {
    translate: `0 ${
      -lineHeight.value + getStaggeredProgress(idx) * lineHeight.value
    }em`,
  }
}

watch(progress, () => {
  console.log(progress.value)
})
</script>

<template>
  <div>
    <input type="range" min="0" max="1" step="0.0001" v-model="progress" />

    <p>{{ progress }}</p>

    <div class="container">
      <p
        class="real"
        ref="textRef"
        :style="{ opacity: progress !== '1' ? 0 : null }"
      >
        {{ text }}
      </p>

      <p
        v-if="progress !== '0' && progress !== '1'"
        :style="{
          position: 'absolute',
          top: 0,
          margin: 0,
          ...getMask(idx),
          ...getTransform(idx),
        }"
        :key="line"
        v-for="(line, idx) in lineAmount"
      >
        {{ text }}
      </p>
    </div>
  </div>
</template>

<style>
input {
  margin-bottom: 30px;
}

.container {
  position: relative;
}

p {
  max-width: 20em;
  font-size: 26px;
  line-height: 1.4;
}
</style>
