<template lang="pug">
  v-content(style="height: 100%;")
    v-container(fluid pa-4 style="height: 100%; display: flex")
      v-layout(ref="noticeContainer" class="pa-8 justify-center align-center" style="height: 100%; flex: 1")
        //- メッセージフィールド
        v-card(
          ref="noticeSheet"
          v-resize="resizeNoticeField"
          style="overflow: hidden;"
          max-width="1600px"
          :width="sheetWidth"
          height="100%"
          :max-height="sheetMaxHeight"
          min-width="640px"
          min-height="360px"
        )
          //- スタートメッセージ
          message-line(
            v-if="startMessageStatus"
            style="pointer-events: none;"
            :message="firstMessage.message"
            :positionY="firstMessage.currentPositionY"
            :positionX="firstMessage.currentPositionX"
            :fontSize="firstMessage.currentFontSize"
            :textColor="firstMessage.textColor"
            :playMode="firstMessage.playMode"
            :isCreateMode="false"
            font="Mincho"
          )

          //- メインメッセージ
          message-line(
            v-if="mainMessageStatuses[index]"
            v-for="line, index in mainMessages"
            style="pointer-events: none;"
            :key="index"
            :messageindex="index"
            :message="line.message"
            :positionY="line.currentPositionY"
            :positionX="line.currentPositionX"
            :fontSize="line.currentFontSize"
            :textColor="line.textColor"
            :playMode="line.playMode"
            :sequentialDisplay="line.sequentialDisplay"
            :isCreateMode="false"
            font="Mincho"
          )

          //- 「次回」表記
          //- styleのtopはのちに編集可能にすること
          message-line(
            v-if="titleStatus"
            style="pointer-events: none; top: 30%"
            :message="nextMessage.message"
            :positionY="nextMessage.currentPositionY"
            :positionX="nextMessage.currentPositionX"
            :fontSize="nextMessage.currentFontSize"
            :textColor="nextMessage.textColor"
            :playMode="nextMessage.playMode"
            :isCreateMode="false"
            font="Mincho"
          )

          //- タイトル
          message-line(
            v-if="titleStatus"
            style="pointer-events: none;"
            :message="noticeTitle.message"
            :positionY="noticeTitle.currentPositionY"
            :positionX="noticeTitle.currentPositionX"
            :fontSize="noticeTitle.currentFontSize"
            :textColor="noticeTitle.textColor"
            :playMode="noticeTitle.playMode"
            :isCreateMode="false"
            font="Mincho"
          )

          v-layout(ref="noticeContainer" class="row pa-8 justify-center align-center" style="height: 100%;")
            //- 再生ボタン
            transition(name="fade")
              .button-field.text-center(v-if="isBeforeOnAir")
                v-btn.white--text.body-2(
                  height="4em"
                  width="150px"
                  class="green accent-4"
                  style="top: 0; left: 0; right: 0; bottom: 0; margin: auto;"
                  @click="startNotice"
                ) スタート

              v-layout.text-center(v-else-if="isAfterOnAir" column)
                v-btn.white--text.body-2(
                  height="4em"
                  width="150px"
                  class="green accent-4"
                  style="top: 0; left: 0; right: 0; bottom: 0; margin: auto;"
                  @click="restartNotice"
                ) リスタート

                v-btn.body-2(
                  height="4em"
                  width="150px"
                  class="white accent-4 mt-6"
                  style="top: 0; left: 34; right: 0; bottom: 0; margin: auto;"
                  to="/"
                ) 編集へ
</template>

<script>
import messageLine from "./message_line.vue";
import resizeFunctions from "../plugins/resize_sheet.js";
import restoreFunction from "../plugins/restore_data.js";

export default {
  name: "viewField",
  components: {
    messageLine
  },
  mixins: [resizeFunctions, restoreFunction],
  data() {
    return {
      noticeInfo: {
        firstMessage: {},
        mainMessages: [],
        noticeTitle: {}
      },
      startMessageStatus: false,
      titleStatus: false,
      mainMessageStatuses: [],
      sheetWidth: "1600px",
      sheetMaxHeight: "900px",
      onAiring: false
    };
  },
  computed: {
    firstMessage() {
      return this.noticeInfo.firstMessage;
    },
    nextMessage() {
      return this.noticeInfo.nextMessage;
    },
    noticeTitle() {
      return this.noticeInfo.noticeTitle;
    },
    mainMessages() {
      return this.noticeInfo.mainMessages;
    },
    isBeforeOnAir() {
      return this.onAiring === false && this.mainMessageStatuses.length === 0;
    },
    isAfterOnAir() {
      return this.onAiring === false && this.mainMessageStatuses.length > 0;
    }
  },
  methods: {
    startNotice() {
      this.onAiring = true;
      const messageLength = this.mainMessages.length;
      let currentTime = 0;

      // 「予告」の表示待ち
      setTimeout(() => {
        this.startMessageStatus = true;
      }, (currentTime += 1000));

      // メインメッセージの表示待ち
      setTimeout(() => {
        this.displayMainMessages();
      }, (currentTime += 2000));

      // タイトルの表示待ち
      setTimeout(() => {
        this.titleStatus = true;
      }, (currentTime += 1000 * messageLength + 3000));

      //- リスタートボタン表示待ち
      setTimeout(() => {
        this.onAiring = false;
      }, (currentTime += 4000));
    },
    displayMainMessages() {
      const messageLength = this.mainMessages.length;
      let displayCount = 0;

      const timer = setInterval(() => {
        this.mainMessageStatuses.push(true);
        if (displayCount === messageLength - 1) clearInterval(timer);
        displayCount++;
      }, 1000);
    },
    prepareRestart() {
      this.startMessageStatus = false;
      this.mainMessageStatuses = [];
      this.titleStatus = false;
    },
    restartNotice() {
      this.onAiring = true;
      this.prepareRestart();
      this.startNotice();
    }
  }
};
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
