<template lang="pug">
  v-layout(class="subtitle-1" row align-center justify-center)
    v-icon(class="mr-2" color="indigo") {{ iconName }}
    span {{ title }}
</template>

<script>
export default {
  props: {
    iconName: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    }
  }
};
</script>

<style lang="scss" scoped></style>
