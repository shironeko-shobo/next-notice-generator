<template lang="pug">
  v-app-bar(app color="indigo")
    v-icon(dark class="mr-4") local_movies
    v-toolbar-title(class="white--text")
      span.title Notice Generator
</template>

<script></script>

<style lang="scss">
html,
body {
  height: 100%;
  font-family: "ＭＳ 明朝", "MS Mincho", "ヒラギノ明朝 ProN",
    "Hiragino Mincho ProN", "Avenir", "Helvetica Neue", "Helvetica", "Arial",
    "Hiragino Sans", "ヒラギノ角ゴシック", YuGothic, "Yu Gothic", "メイリオ",
    Meiryo, "ＭＳ Ｐゴシック", "MS PGothic";
}

#app {
  color: #2c3e50;
  height: 100%;
}

* {
  box-sizing: border-box;
}
</style>
