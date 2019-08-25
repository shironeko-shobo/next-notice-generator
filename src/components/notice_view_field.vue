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
            :message="noticeInfo.firstMessage.message"
            :positionY="noticeInfo.firstMessage.currentPositionY"
            :positionX="noticeInfo.firstMessage.currentPositionX"
            :fontSize="noticeInfo.firstMessage.currentFontSize"
            :textColor="noticeInfo.firstMessage.textColor"
            :playMode="noticeInfo.firstMessage.playMode"
            :isCreateMode="false"
            font="Mincho"
          )

          //- メインメッセージ
          message-line(
            v-if="mainMessageStatuses[index]"
            v-for="line, index in noticeInfo.mainMessages"
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
            :message="noticeInfo.nextMessage.message"
            :positionY="noticeInfo.nextMessage.currentPositionY"
            :positionX="noticeInfo.nextMessage.currentPositionX"
            :fontSize="noticeInfo.nextMessage.currentFontSize"
            :textColor="noticeInfo.nextMessage.textColor"
            :playMode="noticeInfo.nextMessage.playMode"
            :isCreateMode="false"
            font="Mincho"
          )

          //- タイトル
          message-line(
            v-if="titleStatus"
            style="pointer-events: none;"
            :message="noticeInfo.noticeTitle.message"
            :positionY="noticeInfo.noticeTitle.currentPositionY"
            :positionX="noticeInfo.noticeTitle.currentPositionX"
            :fontSize="noticeInfo.noticeTitle.currentFontSize"
            :textColor="noticeInfo.noticeTitle.textColor"
            :playMode="noticeInfo.noticeTitle.playMode"
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

export default {
  name: "viewField",
  components: {
    messageLine
  },
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
      onAiring: false,
      resizeIntervalId: ""
    };
  },
  created() {
    // localStrageに設定情報が保存されていたら復元する
    const saveData = localStorage.getItem("notice-config");
    if (saveData) {
      const objSaveData = JSON.parse(saveData);
      objSaveData.mainMessages.forEach(data => {
        data.currentPositionX = data.positionX;
        data.currentPositionY = data.positionY;
        this.mainMessageStatuses.push(false);
      });
      this.noticeInfo = objSaveData;
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.resizeNoticeField();
      this.resizeIntervalId = setInterval(() => {
        if (this.noticeInfo.mainMessages.length === 0) return;
        this.resizeNoticeField();
      }, 500);
    });
  },
  beforeDestroy() {
    clearInterval(this.resizeIntervalId);
  },
  computed: {
    isBeforeOnAir() {
      return (
        this.onAiring === false &&
        this.mainMessageStatuses.every(item => {
          return item === false;
        })
      );
    },
    isAfterOnAir() {
      return (
        this.onAiring === false &&
        this.mainMessageStatuses.every(item => {
          return item === true;
        })
      );
    }
  },
  methods: {
    getFieldWidthRaito() {
      const fieldWidth = this.$refs.noticeSheet.$el.offsetWidth;
      return fieldWidth / 1600;
    },
    getFieldHeightRaito() {
      const fieldHeight = this.$refs.noticeSheet.$el.offsetHeight;
      return fieldHeight / 900;
    },
    getContainerWidthRaito() {
      const containerWidth = this.$refs.noticeContainer.offsetWidth - 64;
      return containerWidth / 1600;
    },
    getContainerHeightRaito() {
      const containerHeight = this.$refs.noticeContainer.offsetHeight - 64;
      return containerHeight / 900;
    },
    takeInTmp() {
      this.noticeInfo.mainMessages.forEach(item => {
        // 基準の大きさに合わせるように各値を調整する
        item.fontSize = this.currentFontSize;
        item.positionX = this.currentPositionX;
        item.positionY = this.currentPositionY;
      });
    },
    resizeNoticeField() {
      // 前回の保存準備状態からパラメータの変更があった場合、
      // メッセージの位置やフォントサイズの基準値を新規のものに更新しておく。
      if (this.inWhilEditing) {
        this.prepareSave();
        this.inWhilEditing = false;
      }

      // 画面サイズの変更
      const idealHeight =
        this.getContainerWidthRaito() >= 1
          ? 900
          : 900 * this.getContainerWidthRaito();
      this.sheetMaxHeight = idealHeight + "px";
      const idealWidth = 1600 * this.getContainerHeightRaito();
      this.sheetWidth = idealWidth + "px";

      // 文字のサイズと位置の変更
      if (this.noticeInfo.mainMessages.length === 0) return;

      this.noticeInfo.mainMessages.forEach(item => {
        this.adjustItemInfo(item);
      });
      this.adjustItemInfo(this.noticeInfo.firstMessage);
      this.adjustItemInfo(this.noticeInfo.nextMessage);
      this.adjustItemInfo(this.noticeInfo.noticeTitle);
    },
    adjustItemInfo(item) {
      const flexibleTextSize =
        parseInt(item.fontSize) * this.getFieldWidthRaito();
      item.currentFontSize = parseInt(flexibleTextSize) + "px";
      const flexiblePositionY =
        parseInt(item.positionY) * this.getFieldHeightRaito();
      item.currentPositionY = parseInt(flexiblePositionY) + "px";
      const flexiblePositionX =
        parseInt(item.positionX) * this.getFieldWidthRaito();
      item.currentPositionX = parseInt(flexiblePositionX) + "px";
    },
    recoverItemInfo(item) {
      const recoverRate = this.getFieldWidthRaito();
      item.fontSize =
        Math.ceil(parseInt(item.currentFontSize) / recoverRate) + "px";
      item.positionX =
        Math.ceil(parseInt(item.currentPositionX) / recoverRate) + "px";
      item.positionY =
        Math.ceil(parseInt(item.currentPositionY) / recoverRate) + "px";
    },
    startNotice() {
      this.onAiring = true;
      const messageLength = this.noticeInfo.mainMessages.length;
      let currentTime = 0;

      // 「予告」の表示待ち
      setTimeout(() => {
        this.startMessageStatus = true;
      }, (currentTime += 1000));

      setTimeout(() => {
        this.displayMainMessages();
      }, (currentTime += 2000));

      setTimeout(() => {
        this.titleStatus = true;
      }, (currentTime += 1000 * messageLength + 3000));

      //- リスタートボタン表示
      setTimeout(() => {
        this.onAiring = false;
      }, (currentTime += 4000));
    },
    displayMainMessages() {
      const messageLength = this.noticeInfo.mainMessages.length;
      let displayCount = 0;

      const timer = setInterval(() => {
        this.mainMessageStatuses.splice(displayCount, 1, true);
        if (displayCount === messageLength - 1) {
          clearInterval(timer);
        }
        displayCount++;
      }, 1000);
    },
    prepareRestart() {
      this.startMessageStatus = false;
      this.mainMessageStatuses.fill(false);
      this.titleStatus = false;
      // 配列の変更を強制検知
      this.mainMessageStatuses.splice();
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
