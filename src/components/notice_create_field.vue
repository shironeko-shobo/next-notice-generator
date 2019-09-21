<template lang="pug">
  v-content(style="height: 100%;")
    .create-field(style="height: 100%; display: flex")
      //- 編集メニュー
      .edit-menu(style="height: 100%; width: 300px;")
        v-sheet.edit-sheet(
          tile
          class="pa-4 pt-6"
          elevation="2"
          width="300px"
          style="height: 100%;"
        )
          //- タイトルヘッダー
          .menu-header(class="subtitle-1 mb-4" )
            v-layout(row align-center justify-center)
              v-icon(class="mr-2" color="indigo") message
              span タイトルの設定
          //- タイトル設定フォーム
          .message-lagel
            .text-field(class="px-1")
              v-text-field(
                prepend-inner-icon="edit"
                type="text"
                v-model="noticeInfo.noticeTitle.message"
              )

          v-divider(class="sepalator")

          //- 新規追加ヘッダー
          .menu-header(class="subtitle-1 mt-6 mb-4")
            v-layout(row align-center justify-center)
              v-icon(class="mr-2" color="indigo") library_add
              span メッセージの追加

          //- 新規追加フォーム
          .message-lagel
            v-layout.text-field(class="px-1" align-center justify-center)
              v-text-field(
                prepend-inner-icon="edit"
                type="text"
                v-model="nextMessage"
              )
              v-btn.white--text(
                class="ml-2 green accent-4"
                fab
                small
                :disabled="isNoMessages || isMaxMessages"
                @click="addMainMessage"
              )
                v-icon(dark) add

          .edit-select-item(v-if="editngItemIndex !== ''" )
            v-divider(class="sepalator")

            //- 編集ヘッダー
            .menu-header(class="subtitle-1 mt-6 mb-4")
              v-layout(row align-center justify-center)
                v-icon(class="mr-2" color="indigo") build
                span メッセージの編集
            //- メッセージ編集フォーム
            .message-lagel
              v-chip(class="my-2 indigo" dark label) テキスト
              .text-field(class="px-1" style="display: flex; align-items: center;")
                v-text-field(
                  prepend-inner-icon="edit"
                  type="text"
                  :value="noticeInfo.mainMessages[editngItemIndex].message"
                  @input="editMessage"
                )

            //- サイズ編集フォーム
            .size-label(class="my-3 pr-3" style="display: flex; align-items: center; justify-content: space-between")
              v-chip(class="px-1 indigo" dark label) サイズ
              span {{ editingItem.currentFontSize }}
            v-slider(
              min="12px"
              max="200px"
              :value="parseInt(editingItem.currentFontSize)"
              @input="editFontSize"
            )

            //- テキストカラー編集フォーム
            v-chip(class="mt-2 mb-6 indigo" dark label) カラー
            .color-picker-field(style="display: flex; justify-content: center;")
              v-color-picker(
                canvas-height="100px"
                width="250px"
                show-swatches
                swatches-max-height="100px"
                hide-mode-switch
                mode="hexa"
                :value="editingItem.textColor"
                @input="editMessageColor"
              )

            //- 削除ボタン
            .delete-button.text-center(class="mt-10")
              v-btn.white--text(
                color="red"
                @click="deleteMessage"
              )
                v-icon(class="mr-2") delete
                span 選択中のメッセージを削除する

      v-layout(ref="noticeContainer" class="pa-8 justify-center align-center" style="height: 100%; flex: 1")
        //- メッセージフィールド
        v-card(
          ref="noticeSheet"
          v-shortkey="{ mac: ['meta', 's'], win: ['ctrl', 's'] }"
          v-resize="resizeNoticeField"
          style="overflow: hidden;"
          max-width="1600px"
          :width="sheetWidth"
          height="100%"
          :max-height="sheetMaxHeight"
          @shortkey="saveConfig"
          @mousedown="noSelectItem"
        )
          message-line(
            v-for="(line, index) in noticeInfo.mainMessages"
            v-shortkey="['del']"
            ref="messageLine"
            :key="index"
            :messageId="index"
            :message="line.message"
            :positionY="line.currentPositionY"
            :positionX="line.currentPositionX"
            :fontSize="line.currentFontSize"
            :textColor="line.textColor"
            :playMode="line.playMode"
            :selected="editngItemIndex === index"
            font="Mincho"
            @mousedown.native.stop="selectItem(index)"
            @changePosition="changePosition"
            @shortkey="deleteMessage"
          )

    //- 保存確認ダイアログ
    v-dialog(v-model="dialogStatus" width="500")
      v-card
        v-card-title(class="headline")
          v-layout(align-end)
            v-icon(color="red" large class="mr-3") error_outline
            span 設定を保存してください
        v-divider
        v-card-text
          span.body-1 再生するには設定を保存する必要があります。
          br
          span.body-1 保存してもよろしいですか？
        v-card-actions
          div(class="flex-grow-1")
          v-btn(
            color="white"
            width="100px"
            @click="dialogStatus = false"
          ) 編集に戻る
          v-btn(
            color="green accent-4 white--text"
            width="100px"
            class="ml-5"
            @click="modalSave"
          ) 保存する

    //- 保存ボタン
    v-tooltip(left)
      template(v-slot:activator="{ on }")
        v-btn.white--text(
          v-on="on"
          class="mx-2 green accent-4"
          fab
          fixed
          style="bottom: 30px; right: 30px;"
          @click="saveConfig"
        )
          v-icon(dark) save_alt
      span 設定を保存する(ctrl + s)

    //- 再生モードへの変更ボタン
    v-tooltip(left)
      template(v-slot:activator="{ on }")
        v-btn.white--text(
              :disabled="messageInputed"
              v-on="on"
              class="mx-2 blue accent-4"
              fab
              fixed
              style="bottom: 100px; right: 30px;"
              @click="goViewPage"
            )
              v-icon(dark) play_arrow
      span 再生画面へ

    //- 保存通知バー
    v-snackbar(
      v-model="saveCompleted"
      :timeout="2000"
      bottom
    )
      v-layout(align-center)
        v-icon(color="green") check
        span(class="ml-3") 保存が完了しました。
</template>

<script>
import messageLine from "./message_line.vue";
import resizeFunctions from "../plugins/resize_sheet.js";
import restoreFunction from "../plugins/restore_data.js";

export default {
  name: "CreateField",
  components: {
    messageLine
  },
  mixins: [resizeFunctions, restoreFunction],
  data() {
    return {
      nextMessage: "",
      noticeInfo: {
        firstMessage: {
          message: "予告",
          positionX: "",
          positionY: "",
          fontSize: "60px",
          currentPositionX: "",
          currentPositionY: "",
          currentFontSize: "60px",
          textColor: "#000000FF",
          playMode: "blur-in-out",
          sequentialDisplay: true
        },
        mainMessages: [],
        nextMessage: {
          message: "次回",
          positionX: "",
          positionY: "",
          fontSize: "60px",
          currentPositionX: "",
          currentPositionY: "",
          currentFontSize: "60px",
          textColor: "#000000FF",
          playMode: "blur-in ",
          sequentialDisplay: true
        },
        noticeTitle: {
          message: "入力してください",
          positionX: "",
          positionY: "",
          fontSize: "60px",
          currentPositionX: "",
          currentPositionY: "",
          currentFontSize: "60px",
          textColor: "#000000FF",
          playMode: "blur-in ",
          sequentialDisplay: true
        }
      },
      editngItemIndex: "",
      saveCompleted: false,
      beforeSave: false,
      sheetWidth: "1600px",
      sheetMaxHeight: "900px",
      inWhileEditing: false,
      dialogStatus: false
    };
  },
  computed: {
    mainMessages() {
      return this.noticeInfo.mainMessages;
    },
    editingItem() {
      return this.mainMessages[this.editngItemIndex];
    },
    isNoMessages() {
      return this.nextMessage === "";
    },
    isMaxMessages() {
      return this.mainMessages.length === 10;
    },
    messageInputed() {
      return this.mainMessages.length === 0;
    }
  },
  methods: {
    addMainMessage() {
      if (this.nextMessage === "") return;
      const noticeFormat = {
        message: "",
        positionX: "",
        positionY: "",
        fontSize: "60px",
        currentPositionX: "",
        currentPositionY: "",
        currentFontSize: "60px",
        textColor: "#000000FF",
        playMode: "left-fade-in",
        sequentialDisplay: true
      };
      noticeFormat.message = this.nextMessage;
      this.mainMessages.push(noticeFormat);
      this.nextMessage = "";
      this.editngItemIndex = this.mainMessages.length - 1;

      this.$nextTick(() => {
        this.$refs.messageLine[this.editngItemIndex].setPosition();
        this.prepareSave();
      });
    },
    deleteMessage() {
      if (this.editngItemIndex === "") return;
      this.mainMessages.splice(this.editngItemIndex, 1);
      this.editngItemIndex = "";
    },
    selectItem(index) {
      this.editngItemIndex = index;
    },
    noSelectItem() {
      this.editngItemIndex = "";
    },
    editFontSize(value) {
      this.editingItem.currentFontSize = value + "px";
      this.inWhileEditing = true;
      this.beforeSave = true;
    },
    editMessage(value) {
      this.editingItem.message = value;
      this.inWhileEditing = true;
      this.beforeSave = true;
    },
    editMessageColor(value) {
      this.editingItem.textColor = value;
      this.inWhileEditing = true;
      this.beforeSave = true;
    },
    changePosition({ top, left }) {
      this.editingItem.currentPositionY = top + "px";
      this.editingItem.currentPositionX = left + "px";
      this.inWhileEditing = true;
      this.beforeSave = true;
    },
    saveConfig() {
      this.prepareSave();
      const saveData = JSON.stringify(this.noticeInfo);
      localStorage.setItem("notice-config", saveData);
      this.saveCompleted = true;
      this.beforeSave = false;
    },
    modalSave() {
      this.saveConfig();
      this.dialogStatus = false;
      this.$router.push("/view");
    },
    goViewPage() {
      if (this.beforeSave) {
        this.dialogStatus = true;
        return;
      }

      this.$router.push("/view");
    },
    prepareSave() {
      this.takeInTmp();
      // 基準の大きさに合わせるように各値を調整する
      this.mainMessages.forEach(item => this.recoverItemInfo(item));
      this.recoverItemInfo(this.noticeInfo.firstMessage);
      this.recoverItemInfo(this.noticeInfo.nextMessage);
      this.recoverItemInfo(this.noticeInfo.noticeTitle);
      this.inWhileEditing = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.sepalator {
  margin-top: 20px;
  margin-bottom: 20px;
}

.message-delete {
  cursor: pointer;
  user-select: none;
}

.start-area {
  text-align: center;
}

.v-btn {
  transition: background-color 0.3s ease;
}

// スクロールバー
.edit-sheet {
  overflow-y: scroll;
}
::-webkit-scrollbar {
  width: 7px;
}
::-webkit-scrollbar-track {
  border-radius: 10px;
}
::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.4);
  border-radius: 10px;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.3);

  &:hover {
    background-color: rgba(0, 0, 0, 0.3);
  }
}
</style>
