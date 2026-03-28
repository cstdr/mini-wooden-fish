const app = getApp();

Page({
  data: {
    settings: {
      soundEnabled: true,
      vibrationEnabled: true,
      incrementValue: 1,
      showAnimation: true,
      selectedSound: 'default'
    }
  },
  
  onLoad() {
    this.loadSettings();
  },
  
  loadSettings() {
    const settings = app.globalData.settings;
    this.setData({ settings });
  },
  
  onSoundChange(e) {
    const soundEnabled = e.detail.value;
    const settings = { ...this.data.settings, soundEnabled };
    this.setData({ settings });
    app.saveSettings(settings);
  },
  
  onVibrationChange(e) {
    const vibrationEnabled = e.detail.value;
    const settings = { ...this.data.settings, vibrationEnabled };
    this.setData({ settings });
    app.saveSettings(settings);
  },
  
  onAnimationChange(e) {
    const showAnimation = e.detail.value;
    const settings = { ...this.data.settings, showAnimation };
    this.setData({ settings });
    app.saveSettings(settings);
  },
  
  onIncrementChange(e) {
    const value = parseInt(e.currentTarget.dataset.value);
    const settings = { ...this.data.settings, incrementValue: value };
    this.setData({ settings });
    app.saveSettings(settings);
  },
  
  onResetMerit() {
    wx.showModal({
      title: '确认清零',
      content: '确定要清零所有功德吗？此操作不可恢复。',
      confirmText: '确定清零',
      confirmColor: '#e74c3c',
      success: (res) => {
        if (res.confirm) {
          this.resetMerit();
        }
      }
    });
  },
  
  resetMerit() {
    app.resetMerit();
    wx.showToast({
      title: '已清零',
      icon: 'success',
      duration: 1500
    });
  }
})
