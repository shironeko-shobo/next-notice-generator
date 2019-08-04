<template lang="pug">
.app-container
  #notice-field
    .message-list
      .notice(
        v-for="item, index in messageList"
        v-notice
        :style="{ top: item.positionY + 'px', left: item.positionX + 'px' }"
      )
        span {{ item.message }}

  .edit-area(v-if="!isMaxMessages")
    input(
      type="text"
      v-model="nextMessage"
    )
    button(
      @click="addNotice"
    ) セリフを追加する

</template>

<script>
export default {
  name: "NoticeField",
  data() {
    return {
      nextMessage: "",
      messageList: [
        {
          message: "tset",
          positionX: 20,
          positionY: 323
        },
        {
          message: "fawefawefawe",
          positionX: 234,
          positionY: 12
        },
        {
          message: "test",
          positionX: 343,
          positionY: 345
        },
        {
          message: "awefaw",
          positionX: 545,
          positionY: 33
        },
        {
          message: "awefwaefawef",
          positionX: 34,
          positionY: 33
        }
      ]
    };
  },
  computed: {
    isMaxMessages() {
      return this.messageList.length === 5;
    }
  },
  methods: {
    addNotice() {
      if (this.nextMessage === "") return;
      const noticeFormat = {
        message: "",
        positionX: "",
        positionY: ""
      };
      noticeFormat.message = this.nextMessage;
      this.messageList.push(noticeFormat);
      this.nextMessage = "";
    }
  }
};
</script>

<style lang="scss" scoped>
#notice-field {
  width: 900px;
  height: 700px;
  border: 1px solid #666;
  border-radius: 5px;
  margin: 0 auto;
  position: relative;
  text-align: center;
}

.notice {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateY(-50%) translateX(-50%);
  max-width: 150%;
  min-height: 2em;
  max-height: 30%;
  cursor: pointer;
  user-select: none;

  span {
    font-size: 32px;
  }
}

.edit-area {
  text-align: center;
}
</style>
