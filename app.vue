<script setup>
const text =
  '<h2 class="ts-label-m">New site after a decade</h2><p class="ts-body-xl">One of the defining aspects of our agency is our optimal team size. We have discovered that maintaining a compact team of between 15 and 20 members allows us to achieve the best results for our clients and ourselves. By deliberately keeping our team size within this range, we ensure efficient collaboration, open communication, and seamless coordination.</p>'

const progress = ref(0)
</script>

<template>
  <div class="wrapper">
    <input type="range" min="0" max="1" step="0.0001" v-model="progress" />

    <p>{{ progress }}</p>

    <!-- has to be one single element passed to stagger-text -->
    <!-- <stagger-text :progress="progress"> -->
    <stagger-text :stagger-speed="0.02" class="stagger">
      <rich-text :text="text" />
    </stagger-text>
  </div>
</template>

<style>
input {
  margin-bottom: 30px;
  position: relative;
  z-index: 1;
}

.wrapper {
  height: 300vh;
}

.stagger {
  position: absolute;
  bottom: -50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
