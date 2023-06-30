<script setup>
const props = defineProps({
  // progress: [String, Number],
  staggerSpeed: [String, Number],
})
const progress = ref(0)
const textRef = ref(null)
const text = ref('')

const lines = ref([])
const children = ref(0)

let accumulatedLineHeight = 0
let lastLinesMarginAndPadding = 0

watch(textRef, () => {
  if (!textRef.value) return

  text.value = textRef.value.firstElementChild.innerHTML

  console.log(textRef.value)

  children.value = [...textRef.value.firstElementChild.children]

  children.value.forEach(child => {
    const { height } = child.getBoundingClientRect()
    const { lineHeight, marginTop, marginBottom, paddingTop, paddingBottom } =
      getComputedStyle(child)

    const childLineAmount = Math.round(height / parseFloat(lineHeight))

    const newLines = Array(childLineAmount)
      .fill(0)
      .map((_, idx) => {
        const firstChild = idx === 0
        const lastChild = idx === childLineAmount - 1

        // add any margin/paddings, including last line's margin/padding
        const extra = firstChild
          ? parseFloat(marginTop) +
            parseFloat(paddingTop) +
            lastLinesMarginAndPadding
          : 0

        // keep track of where this line starts
        accumulatedLineHeight += parseFloat(lineHeight) + extra

        // last line should inform next child's first line about its margin/padding
        lastLinesMarginAndPadding = lastChild
          ? parseFloat(marginBottom) + parseFloat(paddingBottom)
          : 0

        return {
          accumulatedLineHeight,
          lineHeight: parseFloat(lineHeight),
        }
      })

    lines.value = [...lines.value, ...newLines]
  })
})

const getStaggeredProgress = idx => {
  const section = 1 / lines.value.length
  const stagger = section * idx

  const overlap = 0.2

  return between(progress, {
    easing: easeOutQuint,
    time: [stagger - overlap, stagger + section + overlap],
  })
}

const getMask = (line, idx) => {
  const start =
    line.accumulatedLineHeight - getStaggeredProgress(idx) * line.lineHeight
  const stop = line.accumulatedLineHeight

  const visible = 'black'
  const hidden = 'rgba(0,0,0,0)'

  return {
    maskImage: `linear-gradient(
      ${hidden} ${start}px,
      ${visible} ${start}px,
      ${visible} ${stop}px,
      ${hidden} ${stop}px)
    `,
  }
}

const getTransform = (line, idx) => {
  return {
    translate: `0 ${
      -line.lineHeight + getStaggeredProgress(idx) * line.lineHeight
    }px`,
  }
}

const target = ref(null)
const targetIsVisible = ref(false)
useIntersectionObserver(target, ([{ isIntersecting }]) => {
  targetIsVisible.value = isIntersecting
  console.log(isIntersecting)
})

watch(
  () => targetIsVisible.value,
  () => {
    if (targetIsVisible.value) {
      const { pause } = useRafFn(() => {
        progress.value = parseFloat(progress.value) + props.staggerSpeed
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
  <div class="container" ref="target">
    <div
      ref="textRef"
      class="real"
      :style="{ opacity: progress < '1' ? 0 : null }"
    >
      <slot />
    </div>

    <div
      v-if="progress !== '0' && progress < '1'"
      v-for="(line, idx) in lines"
      class="clone"
      :style="{
        ...getMask(line, idx),
        ...getTransform(line, idx),
      }"
      :key="line"
      v-html="text"
    />
  </div>
</template>

<style>
.container {
  position: relative;
}

.real > *,
.clone > * {
  display: flex;
  flex-direction: column;
}

.real > * > *,
.clone > * {
  display: inline-block;
}

:where(.real > * > *),
:where(.clone > *) {
  width: 100%;
}

.clone {
  position: absolute;
  top: 0;
  margin: 0;
}
</style>
