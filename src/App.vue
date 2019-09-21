<template lang="pug">
  #app
    v-app
      global-header
      transition(mode="out-in")
        router-view
</template>

<script>
import GlobalHeader from "../src/components/global_header.vue";

export default {
  components: {
    GlobalHeader
  }
};
</script>

<style lang="scss">
html,
body {
  height: 100%;
  overflow-x: hidden;
}

#app {
  font-family: "Arial", "Avenir", "Helvetica Neue", "Helvetica", "Hiragino Sans",
    "ヒラギノ角ゴシック", YuGothic, "Yu Gothic", "メイリオ", Meiryo,
    "ＭＳ Ｐゴシック", "MS PGothic", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;
}

* {
  box-sizing: border-box;
}

.v-enter {
  transform: translateX(100px);
  opacity: 0;
}
.v-enter-to {
  opacity: 1;
}
.v-enter-active {
  transition: all 1s 0s ease;
}
.v-leave {
  transform: translateX(0);
  opacity: 1;
}
.v-leave-to {
  transform: translateX(-100px);
  opacity: 0;
}
.v-leave-active {
  transition: all 0.5s 0s ease;
}
</style>
