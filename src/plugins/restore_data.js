export default {
  created() {
    // localStorageに設定情報が保存されていたら復元する
    const saveData = localStorage.getItem("notice-config");
    if (saveData) {
      const objSaveData = JSON.parse(saveData);
      objSaveData.mainMessages.forEach(data => {
        data.currentPositionX = data.positionX;
        data.currentPositionY = data.positionY;
      });
      this.noticeInfo = objSaveData;
    }
  }
}
