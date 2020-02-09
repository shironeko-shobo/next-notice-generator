<template lang="pug">
  v-dialog(:value="displayStatus" @input="cancel" width="500")
    v-card
      v-card-title(class="headline")
        v-layout(align-end)
          v-icon(color="red" large class="mr-3") error_outline
          span {{ title }}
      v-divider
      v-card-text
        span.body-1 {{ message1 }}
        br
        span.body-1 {{ message2 }}
      v-card-actions
        div(class="flex-grow-1")
        v-btn(
          color="white"
          width="100px"
          @click="cancel"
        ) {{ cancelButtonText }}
        v-btn(
          color="green accent-4 white--text"
          width="100px"
          class="ml-5"
          @click="confirm"
        ) {{ okButtonText }}
</template>

<script>
export default {
  props: {
    displayStatus: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    message1: {
      type: String,
      required: false
    },
    message2: {
      type: String,
      required: false
    },
    okButtonText: {
      type: String,
      required: true
    },
    cancelButtonText: {
      type: String,
      required: true
    }
  },
  methods: {
    confirm() {
      this.$emit("confirm");
    },
    cancel() {
      this.$emit("cancel");
    }
  }
};
</script>
