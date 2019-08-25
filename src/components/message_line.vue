<template lang="pug">
  v-layout.notice(
    v-notice
    class="justify-center align-center"
    :class="{ 'message-line': selected }"
    :style="{ 'font-family': fontStyle, top: positionY, left: positionX, 'font-size': fontSize, color: textColor }"
    ref="notice"
    @mouseup="setPosition"
  )
    span.message-index(v-if="isCreateMode" class="deep-orange darken-1 white--text" ) {{ messageId + 1 }}
    span.char(
      v-for="char, index in message"
      :key="index"
      :class="{ [playMode]: isViewMode }"
      :style="{ 'font-family': fontStyle, animationDelay: sequentialDisplay ? index * 100 + 'ms' : 0 }"
    ) {{ char }}
</template>

<script>
export default {
  name: "messageLine",
  props: {
    messageId: {
      type: Number,
      required: false
    },
    message: {
      type: String,
      required: true
    },
    positionY: {
      type: String,
      required: true
    },
    positionX: {
      type: String,
      required: true
    },
    fontSize: {
      type: String,
      required: false,
      default: "24px"
    },
    font: {
      type: String,
      required: true
    },
    textColor: {
      type: String,
      default: "#000000FF"
    },
    selected: {
      type: Boolean,
      default: false
    },
    playMode: {
      type: String,
      required: false,
      default: "left-fade-in"
    },
    sequentialDisplay: {
      type: Boolean,
      required: false,
      default: false
    },
    isCreateMode: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  computed: {
    isViewMode() {
      return this.isCreateMode === false;
    },
    fontStyle() {
      let fontStyle;
      switch (this.font) {
        case "Mincho":
          fontStyle = `"游明朝", "YuMincho", "ヒラギノ明朝 ProN W3",
                       "Hiragino Mincho ProN",
                       "HG明朝E", "ＭＳ Ｐ明朝", "ＭＳ 明朝", "serif"`;
          break;
      }
      return fontStyle;
    },
    IndexStyle() {
      const basicSize = Math.ceil(parseInt(this.fontSize) / 3);
      const applySize = basicSize < 12 ? 12 + "px" : basicSize + "px";
      return {
        width: applySize,
        height: applySize,
        "font-size": applySize,
        "line-height": applySize,
        position: "absolute",
        top: 0,
        left: 0,
        "text-align": "center",
        "background-color": "red",
        "border-radius": "50%",
        display: "inline-block"
      };
    }
  },
  methods: {
    setPosition() {
      const top = this.$refs.notice.offsetTop;
      const left = this.$refs.notice.offsetLeft;
      this.$emit("changePosition", { top, left });
    }
  }
};
</script>

<style lang="scss" scoped>
.notice {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateY(-50%) translateX(-50%);
  cursor: pointer;
  user-select: none;
  padding: 10px 10px;
  line-height: 100%;
}

span.char {
  vertical-align: middle;
}

span.message-index {
  width: 20px;
  height: 20px;
  font-size: 14px;
  line-height: 20px;
  position: absolute;
  top: 0;
  left: 0;
  text-align: center;
  border-radius: 50%;
  display: inline-block;
  font-family: "Arial", "Avenir", "Helvetica Neue", "Helvetica", "Hiragino Sans",
    "ヒラギノ角ゴシック", YuGothic, "Yu Gothic", "メイリオ", Meiryo;
}

.message-line {
  box-shadow: 0 0 2px #5f5f5f;
  border-radius: 5px;
}

.blur-in {
  animation: blur-in 1.25s ease 0s both;
}

.blur-in-out {
  animation: blur-in-out 2.5s ease 0s both;
}

.left-fade-in {
  animation: left-fade-in 2.5s cubic-bezier(0.22, 0.15, 0.25, 1.43) 0s both;
}

@keyframes blur-in {
  0% {
    filter: blur(12px);
    opacity: 0;
  }

  100% {
    filter: blur(0);
    opacity: 1;
  }
}

@keyframes blur-in-out {
  0% {
    filter: blur(12px);
    opacity: 0;
  }
  40% {
    filter: blur(0px);
    opacity: 1;
  }

  80% {
    filter: blur(0px);
    opacity: 1;
  }

  100% {
    filter: blur(12px);
    opacity: 0;
  }
}

@keyframes left-fade-in {
  0% {
    transform: translate(0, -20px);
    opacity: 0;
  }

  40% {
    transform: translate(0, 0px);
  }

  80% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}
</style>
