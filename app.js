App({
  globalData: {
    merit: 0,
    settings: {
      soundEnabled: true,
      vibrationEnabled: true,
      incrementValue: 1,
      showAnimation: true,
      selectedSound: 'default'
    },
    selectedKeyword: '暴富',
    selectedKeywordIndex: 0,
    theme: 'cyber',
    hasSelectedTheme: false
  },
  
  onLaunch() {
    this.loadSettings();
    this.loadMerit();
    this.loadKeywordSelection();
    this.loadTheme();
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
  },
  
  loadKeywordSelection() {
    try {
      const selectedKeyword = wx.getStorageSync('woodenFishKeyword');
      if (selectedKeyword) {
        this.globalData.selectedKeyword = selectedKeyword.keyword;
        this.globalData.selectedKeywordIndex = selectedKeyword.index;
      }
    } catch (e) {
      console.error('加载词条选择失败:', e);
    }
  },
  
  saveKeywordSelection(keyword, index) {
    try {
      wx.setStorageSync('woodenFishKeyword', {
        keyword: keyword,
        index: index
      });
      this.globalData.selectedKeyword = keyword;
      this.globalData.selectedKeywordIndex = index;
    } catch (e) {
      console.error('保存词条选择失败:', e);
    }
  },
  
  loadTheme() {
    try {
      const themeData = wx.getStorageSync('woodenFishTheme');
      if (themeData && themeData.theme) {
        this.globalData.theme = themeData.theme;
        this.globalData.hasSelectedTheme = themeData.hasSelectedTheme || false;
      } else {
        this.globalData.theme = 'cyber';
        this.globalData.hasSelectedTheme = false;
      }
    } catch (e) {
      console.error('加载主题失败:', e);
    }
  },
  
  saveTheme(theme) {
    try {
      wx.setStorageSync('woodenFishTheme', {
        theme: theme,
        hasSelectedTheme: true
      });
      this.globalData.theme = theme;
      this.globalData.hasSelectedTheme = true;
    } catch (e) {
      console.error('保存主题失败:', e);
    }
  }
})
