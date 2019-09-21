export default {
  data() {
    return {
      resizeIntervalId: ""
    };
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
  methods: {
    getFieldWidthRatio() {
      const fieldWidth = this.$refs.noticeSheet.$el.offsetWidth;
      return fieldWidth / 1600;
    },
    getFieldHeightRatio() {
      const fieldHeight = this.$refs.noticeSheet.$el.offsetHeight;
      return fieldHeight / 900;
    },
    getContainerWidthRatio() {
      const containerWidth = this.$refs.noticeContainer.offsetWidth - 64;
      return containerWidth / 1600;
    },
    getContainerHeightRatio() {
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
      if (this.inWhileEditing) {
        this.prepareSave();
        this.inWhileEditing = false;
      }
      // 画面サイズの変更
      const idealHeight =
        this.getContainerWidthRatio() >= 1
          ? 900
          : 900 * this.getContainerWidthRatio();
      this.sheetMaxHeight = idealHeight + "px";
      const idealWidth = 1600 * this.getContainerHeightRatio();
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
        parseInt(item.fontSize) * this.getFieldWidthRatio();
      item.currentFontSize = parseInt(flexibleTextSize) + "px";
      const flexiblePositionY =
        parseInt(item.positionY) * this.getFieldHeightRatio();
      item.currentPositionY = parseInt(flexiblePositionY) + "px";
      const flexiblePositionX =
        parseInt(item.positionX) * this.getFieldWidthRatio();
      item.currentPositionX = parseInt(flexiblePositionX) + "px";
    },
    recoverItemInfo(item) {
      const recoverRate = this.getFieldWidthRatio();
      item.fontSize =
        Math.ceil(parseInt(item.currentFontSize) / recoverRate) + "px";
      item.positionX =
        Math.ceil(parseInt(item.currentPositionX) / recoverRate) + "px";
      item.positionY =
        Math.ceil(parseInt(item.currentPositionY) / recoverRate) + "px";
    }
  }
};
