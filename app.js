App({
  globalData: {
    merit: 0,
    settings: {
      soundEnabled: true,
      vibrationEnabled: true,
      incrementValue: 1,
      showAnimation: true,
      selectedSound: 'default'
    }
  },
  
  onLaunch() {
    this.loadSettings();
    this.loadMerit();
  },
  
  loadSettings() {
    try {
      const settings = wx.getStorageSync('woodenFishSettings');
      if (settings) {
        this.globalData.settings = settings;
      }
    } catch (e) {
      console.error('加载设置失败:', e);
    }
  },
  
  saveSettings(settings) {
    try {
      wx.setStorageSync('woodenFishSettings', settings);
      this.globalData.settings = settings;
    } catch (e) {
      console.error('保存设置失败:', e);
    }
  },
  
  loadMerit() {
    try {
      const merit = wx.getStorageSync('woodenFishMerit');
      if (merit !== '') {
        this.globalData.merit = merit;
      }
    } catch (e) {
      console.error('加载功德失败:', e);
    }
  },
  
  saveMerit(merit) {
    try {
      wx.setStorageSync('woodenFishMerit', merit);
      this.globalData.merit = merit;
    } catch (e) {
      console.error('保存功德失败:', e);
    }
  },
  
  resetMerit() {
    try {
      wx.removeStorageSync('woodenFishMerit');
      this.globalData.merit = 0;
    } catch (e) {
      console.error('重置功德失败:', e);
    }
  }
})
