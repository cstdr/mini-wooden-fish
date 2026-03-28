const app = getApp();

Page({
  data: {
    merit: 0,
    woodenFishImage: '/images/wooden-fish-mini.png',
    woodenStickImage: '/images/wooden-stick-final.png',
    isShaking: false,
    isHitting: false,
    animations: [],
    animationLayerHeight: 300,
    currentSoundIndex: 0,
    audioPool: [],
    audioPoolSize: 5,
    audioInitialized: false
  },
  
  animationIdCounter: 0,
  maxAnimations: 10,
  
  onLoad() {
    this.loadMerit();
    this.calculateAnimationLayerHeight();
  },
  
  onShow() {
    this.loadMerit();
    this.loadSettings();
    if (!this.data.audioInitialized) {
      this.initAudioPool();
    }
  },
  
  onReady() {
    this.initAudioPool();
  },
  
  onResize() {
    this.calculateAnimationLayerHeight();
  },
  
  calculateAnimationLayerHeight() {
    const windowInfo = wx.getWindowInfo();
    const screenHeight = windowInfo.windowHeight;
    this.setData({
      animationLayerHeight: screenHeight * 0.6
    });
  },
  
  initAudioPool() {
    try {
      const audioPool = [];
      for (let i = 0; i < this.data.audioPoolSize; i++) {
        const audio = wx.createInnerAudioContext();
        audio.src = '/audio/knock.wav';
        audio.volume = 1.0;
        audio.autoplay = false;
        
        audio.onError((err) => {
          console.warn('音频初始化失败:', err);
        });
        
        audioPool.push({
          audio,
          inUse: false
        });
      }
      this.setData({ audioPool, audioInitialized: true });
    } catch (e) {
      console.error('音频池初始化失败:', e);
    }
  },
  
  loadMerit() {
    const merit = app.globalData.merit || 0;
    this.setData({ merit });
  },
  
  loadSettings() {
    const settings = app.globalData.settings;
    this.setData({
      selectedSoundIndex: settings.selectedSound === 'default' ? 0 : 1
    });
  },
  
  onWoodenFishTap(e) {
    const settings = app.globalData.settings;
    const incrementValue = settings.incrementValue;
    
    this.updateMerit(incrementValue);
    
    if (settings.showAnimation) {
      this.addMeritAnimation(incrementValue);
    }
    
    if (settings.soundEnabled) {
      this.playKnockSound();
    }
    
    if (settings.vibrationEnabled) {
      this.triggerVibration();
    }
    
    this.triggerShakeAnimation();
    this.triggerHitAnimation();
  },
  
  updateMerit(increment) {
    const newMerit = this.data.merit + increment;
    this.setData({ merit: newMerit });
    app.saveMerit(newMerit);
  },
  
  addMeritAnimation(value) {
    const animations = this.data.animations;
    
    if (animations.length >= this.maxAnimations) {
      animations.shift();
    }
    
    const id = ++this.animationIdCounter;
    const randomX = Math.random() * 200 - 100;
    const duration = 1.0 + Math.random() * 0.4;
    
    const animation = {
      id,
      value,
      x: randomX + 187,
      duration
    };
    
    animations.push(animation);
    this.setData({ animations });
    
    setTimeout(() => {
      this.removeAnimation(id);
    }, duration * 1000);
  },
  
  removeAnimation(id) {
    const animations = this.data.animations.filter(anim => anim.id !== id);
    this.setData({ animations });
  },
  
  playKnockSound() {
    try {
      const audioPool = this.data.audioPool;
      const availableAudio = audioPool.find(item => !item.inUse);
      
      if (availableAudio) {
        availableAudio.inUse = true;
        
        const audio = availableAudio.audio;
        
        try {
          audio.stop();
        } catch (e) {
          console.warn('停止音频失败:', e);
        }
        
        try {
          audio.play();
        } catch (e) {
          console.warn('播放音频失败:', e);
          availableAudio.inUse = false;
          return;
        }
        
        audio.onEnded(() => {
          availableAudio.inUse = false;
        });
        
        audio.onError((err) => {
          console.warn('音频播放错误:', err);
          availableAudio.inUse = false;
        });
        
        setTimeout(() => {
          if (availableAudio.inUse) {
            availableAudio.inUse = false;
          }
        }, 500);
      }
    } catch (e) {
      console.error('播放音效失败:', e);
    }
  },
  
  triggerVibration() {
    try {
      wx.vibrateShort({
        type: 'light',
        success: () => {},
        fail: () => {}
      });
    } catch (e) {
      console.error('震动失败:', e);
    }
  },
  
  triggerShakeAnimation() {
    this.setData({ isShaking: true });
    
    setTimeout(() => {
      this.setData({ isShaking: false });
    }, 150);
  },
  
  triggerHitAnimation() {
    this.setData({ isHitting: true });
    
    setTimeout(() => {
      this.setData({ isHitting: false });
    }, 100);
  },
  
  goToSettings() {
    wx.navigateTo({
      url: '/pages/settings/settings'
    });
  },
  
  onUnload() {
    const audioPool = this.data.audioPool;
    audioPool.forEach(item => {
      if (item.audio) {
        item.audio.destroy();
      }
    });
  }
})
