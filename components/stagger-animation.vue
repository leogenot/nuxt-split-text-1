<script setup>
const props = defineProps({
  data: String,
  start: Boolean,
})
const data = toRef(props, 'data')
const progress = ref(0)
const textRef = ref(null)

const lineAmount = ref(0)
const lineHeight = ref(0)
const fontSize = ref(0)

watch(textRef, () => {
  if (!textRef.value) return
  textRef.value.querySelectorAll(':scope > *').forEach(el => {
    const { height } = el.getBoundingClientRect()
    const { fontSize: fs, lineHeight: lh } = getComputedStyle(el)

    fontSize.value = fs

    lineHeight.value = parseFloat(lh) / parseFloat(fs)

    lineAmount.value = Math.round(height / parseFloat(lh))
  })
})

const getStaggeredProgress = idx => {
  const section = 1 / lineAmount.value
  const stagger = section * idx

  const overlap = 0.2

  return between(progress, {
    easing: easeInOutQuart,
    time: [stagger - overlap, stagger + section + overlap],
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

const staggerSpeed = 0.02

watch(
  () => props.start,
  () => {
    if (props.start) {
      const { pause } = useRafFn(() => {
        progress.value = parseFloat(progress.value) + staggerSpeed
        if (progress.value >= 1) {
          pause()
          progress.value = 1
          return
        }
        console.log(progress.value)
      })
    }
  }
)
</script>

<template>
  <div>
    <div class="container">
      <!-- <div
        class="real"
        ref="textRef"
        :style="{ opacity: progress < 1 ? 0.2 : null }"
        v-html="data"
      ></div> -->
      <div class="real" ref="textRef" style="opacity: 0.2" v-html="data"></div>

      <!-- <div
        v-if="progress !== '0' && progress < '1'"
        class="mask"
        :style="{
          position: 'absolute',
          top: 0,
          margin: 0,
          ...getMask(idx),
          ...getTransform(idx),
          fontSize: fontSize,
          lineHeight: lineHeight,
        }"
        :key="line"
        v-for="(line, idx) in lineAmount"
        v-html="data"
      ></div> -->
      <div
        v-if="progress !== '0'"
        class="mask"
        :style="{
          position: 'absolute',
          top: 0,
          margin: 0,
          ...getMask(idx),
          ...getTransform(idx),
          fontSize: fontSize,
          lineHeight: lineHeight,
        }"
        :key="line"
        v-for="(line, idx) in lineAmount"
        v-html="data"
      ></div>
    </div>
  </div>
</template>

<style></style>
