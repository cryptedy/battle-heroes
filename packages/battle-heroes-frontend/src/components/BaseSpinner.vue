<template>
  <svg class="spinner" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <circle
      class="spinner-circle"
      fill="none"
      stroke-width="10"
      stroke-linecap="butt"
      cx="50"
      cy="50"
      r="40"
    />
  </svg>
</template>

<script>
export default {
  name: 'BaseSpinner'
}
</script>

<style lang="scss">
.spinner {
  animation: rotator 5s linear infinite;
  transform-origin: center;
  display: inline-block;
  font-size: inherit;
  height: 1em;
  width: 1em;
  overflow: visible;
  vertical-align: -0.125em;

  &-circle {
    stroke-dasharray: 265;
    stroke-dashoffset: 0;
    transform-origin: center;
    stroke: palette(gray, 0);
    animation: dash 1s ease-in-out infinite;
  }
}

@keyframes rotator {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dashoffset: 265;
  }
  50% {
    stroke-dashoffset: 65;
    transform: rotate(90deg);
  }
  100% {
    stroke-dashoffset: 265;
    transform: rotate(360deg);
  }
}
</style>
