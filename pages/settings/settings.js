const app = getApp();

Page({
  data: {
    settings: {
      soundEnabled: true,
      vibrationEnabled: true,
      incrementValue: 1,
      showAnimation: true,
      selectedSound: 'default'
    },
    theme: 'classic'
  },
  
  onLoad() {
    this.loadSettings();
    this.loadTheme();
  },
  
  onShow() {
    this.loadTheme();
  },
  
  loadSettings() {
    const settings = app.globalData.settings;
    this.setData({ settings });
  },
  
  loadTheme() {
    const theme = app.globalData.theme || 'classic';
    this.setData({ theme });
  },
  
  onThemeChange(e) {
    const theme = e.currentTarget.dataset.theme;
    this.setData({ theme });
    app.saveTheme(theme);
    
    wx.showToast({
      title: theme === 'cyber' ? '已切换到赛博模式' : '已切换到经典模式',
      icon: 'success',
      duration: 1500
    });
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
