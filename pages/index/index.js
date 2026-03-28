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
    audioInitialized: false,
    keywords: ['暴富', '准点下班', '情绪稳定', '发量', '涨停', '颜值', '脱单', '上岸', '好梦'],
    selectedKeywordIndex: 0,
    selectedKeyword: '暴富',
    
    theme: 'classic',
    isCyber: false,
    cps: 0,
    isOverdrive: false,
    tapTimestamps: [],
    cpsWindowSize: 10,
    overdriveThreshold: 5,
    shareImagePath: '',
    shakeClass: ''
  },
  
  animationIdCounter: 0,
  maxAnimations: 10,
  
  onLoad() {
    this.initAudioPool();
    this.loadMerit();
    this.loadKeyword();
    this.loadTheme();
    this.calculateAnimationLayerHeight();
    this.checkFirstLaunch();
    
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
  },
  
  onShow() {
    this.loadMerit();
    this.loadSettings();
    this.loadKeyword();
    this.loadTheme();
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
      const oldPool = this.data.audioPool;
      if (oldPool && oldPool.length > 0) {
        oldPool.forEach(item => {
          if (item.audio) {
            item.audio.stop();
            item.audio.destroy();
          }
        });
      }
      
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
    try {
      const merit = wx.getStorageSync('woodenFishMerit');
      const value = merit !== '' ? merit : 0;
      this.setData({ merit: value });
      app.globalData.merit = value;
    } catch (e) {
      console.error('加载功德失败:', e);
      this.setData({ merit: 0 });
    }
  },
  
  loadSettings() {
    const settings = app.globalData.settings;
    this.setData({
      selectedSoundIndex: settings.selectedSound === 'default' ? 0 : 1
    });
  },
  
  loadKeyword() {
    const keyword = app.globalData.selectedKeyword;
    const index = app.globalData.selectedKeywordIndex;
    if (keyword && index !== undefined) {
      this.setData({
        selectedKeyword: keyword,
        selectedKeywordIndex: index
      });
    }
  },
  
  loadTheme() {
    const theme = app.globalData.theme || 'cyber';
    this.setData({
      theme: theme,
      isCyber: theme === 'cyber'
    });
  },
  
  checkFirstLaunch() {
    const hasSelectedTheme = app.globalData.hasSelectedTheme;
    if (!hasSelectedTheme) {
      setTimeout(() => {
        this.showThemeSelectionModal();
      }, 500);
    }
  },
  
  showThemeSelectionModal() {
    wx.showModal({
      title: '⚡ 选择你的解压模式 ⚡',
      content: '经典模式：禅意木鱼，温暖治愈\n赛博模式：故障艺术，发疯解压',
      confirmText: '⚡ 赛博模式',
      cancelText: '🎋 经典模式',
      confirmColor: '#ff6b6b',
      cancelColor: '#d4a574',
      success: (res) => {
        if (res.confirm) {
          app.saveTheme('cyber');
          this.setData({
            theme: 'cyber',
            isCyber: true
          });
          wx.showToast({
            title: '已切换到赛博模式',
            icon: 'success',
            duration: 1500
          });
        } else if (res.cancel) {
          app.saveTheme('classic');
          this.setData({
            theme: 'classic',
            isCyber: false
          });
          wx.showToast({
            title: '已切换到经典模式',
            icon: 'success',
            duration: 1500
          });
        }
      }
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
    
    if (this.data.isCyber) {
      this.calculateCPS();
    }
  },
  
  calculateCPS() {
    const now = Date.now();
    let timestamps = this.data.tapTimestamps;
    timestamps.push(now);
    
    if (timestamps.length > this.data.cpsWindowSize) {
      timestamps = timestamps.slice(-this.data.cpsWindowSize);
    }
    
    let cps = 0;
    let isOverdrive = false;
    
    if (timestamps.length >= 2) {
      const timeSpan = timestamps[timestamps.length - 1] - timestamps[0];
      if (timeSpan > 0) {
        cps = ((timestamps.length - 1) / timeSpan) * 1000;
        isOverdrive = cps > this.data.overdriveThreshold;
      }
    }
    
    this.setData({
      tapTimestamps: timestamps,
      cps: Math.round(cps * 10) / 10,
      isOverdrive: isOverdrive
    });
    
    if (this.overdriveTimer) {
      clearTimeout(this.overdriveTimer);
    }
    
    if (isOverdrive) {
      this.overdriveTimer = setTimeout(() => {
        this.setData({
          isOverdrive: false
        });
      }, 1000);
    }
  },
  
  onKeywordSelect(e) {
    const index = e.currentTarget.dataset.index;
    const keyword = this.data.keywords[index];
    this.setData({
      selectedKeywordIndex: index,
      selectedKeyword: keyword
    });
    app.saveKeywordSelection(keyword, index);
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
    const randomX = Math.random() * 60 - 30;
    const duration = 1.0 + Math.random() * 0.4;
    const keyword = this.data.selectedKeyword;
    
    let animation;
    
    if (this.data.isCyber && this.data.isOverdrive) {
      const angle = Math.random() * 360;
      const distance = 150 + Math.random() * 150;
      const fontSize = 40 + Math.random() * 30;
      const rotation = Math.random() * 720 - 360;
      const explodeX = Math.cos(angle * Math.PI / 180) * distance;
      const explodeY = Math.sin(angle * Math.PI / 180) * distance;
      
      animation = {
        id,
        value,
        keyword,
        x: 50 + randomX,
        duration,
        isOverdrive: true,
        fontSize: fontSize,
        rotation: rotation,
        explodeX: explodeX,
        explodeY: explodeY
      };
    } else {
      animation = {
        id,
        value,
        keyword,
        x: 50 + randomX,
        duration
      };
    }
    
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
      const vibrationType = this.data.isCyber && this.data.isOverdrive ? 'heavy' : 'light';
      wx.vibrateShort({
        type: vibrationType,
        success: () => {},
        fail: () => {}
      });
    } catch (e) {
      console.error('震动失败:', e);
    }
  },
  
  triggerShakeAnimation() {
    const cps = this.data.cps;
    const isOverdrive = this.data.isOverdrive;
    const isCyber = this.data.isCyber;
    
    let shakeClass = 'shake-light';
    let duration = 100;
    
    if (isOverdrive) {
      shakeClass = 'shake-overdrive';
      duration = 80;
      wx.vibrateShort({ type: 'heavy' });
    } else if (cps >= 8) {
      shakeClass = 'shake-heavy';
      duration = 200;
      wx.vibrateShort({ type: 'medium' });
    } else if (cps >= 4) {
      shakeClass = 'shake-medium';
      duration = 150;
      wx.vibrateShort({ type: 'light' });
    } else if (cps >= 2) {
      shakeClass = 'shake-light';
      duration = 100;
      wx.vibrateShort({ type: 'light' });
    } else {
      shakeClass = 'shake-light';
      duration = 100;
      if (isCyber) {
        wx.vibrateShort({ type: 'light' });
      }
    }
    
    this.setData({ isShaking: true, shakeClass: shakeClass });
    
    setTimeout(() => {
      this.setData({ isShaking: false, shakeClass: '' });
    }, duration);
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
  
  onShareTap() {
    wx.showLoading({ title: '正在生成收据...' });
    
    this.generateShareImage((imagePath) => {
      wx.hideLoading();
      
      if (imagePath) {
        this.setData({ shareImagePath: imagePath }, () => {
          wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
          });
          
          wx.showToast({
            title: '请点击右上角分享',
            icon: 'none',
            duration: 2000
          });
        });
      } else {
        wx.showToast({ title: '生成失败', icon: 'none' });
      }
    });
  },
  
  getShareText(keyword, tapCount) {
    const textLibrary = {
      '暴富': [
        '今日已向财神爷的脑机接口注入 ' + tapCount + ' 次病毒，不给我【暴富】就把天庭服务器格式化。',
        '物理超度了 ' + tapCount + ' 个穷鬼念头，宇宙现在的唯一任务，就是立刻把【暴富】的代码写进我的DNA。'
      ],
      '准点下班': [
        '已对老板的潜意识发动 ' + tapCount + ' 次降维打击，今晚谁敢拦我【准点下班】，我就把公司大楼的电闸生吃了。',
        '再加一分钟班我就会碎掉，今日已提前预支 ' + tapCount + ' 点功德，强制剥夺全宇宙阻止我【准点下班】的权利。'
      ],
      '情绪稳定': [
        '已将 ' + tapCount + ' 个想揍人的念头物理粉碎。目前精神状态极其【情绪稳定】，谁惹我我就顺着网线咬人。',
        '我的精神力已抵达崩溃边缘，通过高频点击 ' + tapCount + ' 次紧急重启系统，勉强维持【情绪稳定】的假象。'
      ],
      '发量': [
        '监测到毛囊防线崩溃：已超度 ' + tapCount + ' 根离家出走的头发，强制命令它们带着【发量+1】的Buff投胎回我头上。',
        '只要我敲得足够快，脱发的速度就赶不上我攒【发量】的速度。今日发疯护发战绩：' + tapCount + ' 次。'
      ],
      '涨停': [
        '已向A股发送 ' + tapCount + ' 次神秘电波，明天我的自选股不【涨停】，我就把证交所的网线拔了跳绳。',
        '敲碎了 ' + tapCount + ' 根绿油油的韭菜，强行扭转K线走势。宇宙定律现在由我重写：满仓，【涨停】！'
      ],
      '颜值': [
        '对着女娲的捏脸系统发动了 ' + tapCount + ' 次DDoS攻击，强制要求把我下辈子的【颜值】提前提现。',
        '敲击 ' + tapCount + ' 次，成功用量子纠缠技术把女明星的脸部参数复制到了我脸上，今日【颜值】已暴力拉升。'
      ],
      '脱单': [
        '把月老的红线剪断搓成钢丝绳敲了 ' + tapCount + ' 下，今年再不让我【脱单】，我就和赛博菩萨过日子。',
        '已向茫茫人海发射 ' + tapCount + ' 个定向诱捕雷达，强制匹配完美对象。如果再不【脱单】，我就和赛博菩萨过日子。'
      ],
      '上岸': [
        '已向阅卷老师的梦境植入 ' + tapCount + ' 次潜意识暗示，这次如果不能【上岸】，我就把考场吃了。',
        '在题海里快要淹死前，抓住赛博木鱼狂敲了 ' + tapCount + ' 下作为救生圈。天命由我，强势【上岸】！'
      ],
      '好梦': [
        '已将褪黑素磨成粉混入电子木鱼，猛敲 ' + tapCount + ' 下强行灌入大脑。今晚不给我一个【好梦】，我就把梦神打醒。',
        '向我的松果体下达了 ' + tapCount + ' 次最后通牒，立刻停止胡思乱想，立刻执行【好梦】程序，违者杀无赦。'
      ]
    };
    
    const options = textLibrary[keyword] || ['今日已向宇宙发起 ' + tapCount + ' 次意念攻击'];
    const randomIndex = Math.floor(Math.random() * options.length);
    return options[randomIndex];
  },
  
  wrapText(ctx, text, maxWidth) {
    const words = text.split('');
    let line = '';
    let lines = [];
    
    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i];
      const metrics = ctx.measureText(testLine);
      
      if (metrics.width > maxWidth && i > 0) {
        lines.push(line);
        line = words[i];
      } else {
        line = testLine;
      }
    }
    
    if (line) {
      lines.push(line);
    }
    
    return lines;
  },
  
  generateShareImage(callback) {
    const tapCount = this.data.merit;
    const currentWord = this.data.selectedKeyword;
    const shareText = this.getShareText(currentWord, tapCount);
    
    const now = new Date();
    const dateStr = now.getFullYear() + '-' + 
      String(now.getMonth() + 1).padStart(2, '0') + '-' + 
      String(now.getDate()).padStart(2, '0');
    const timeStr = String(now.getHours()).padStart(2, '0') + ':' + 
      String(now.getMinutes()).padStart(2, '0') + ':' + 
      String(now.getSeconds()).padStart(2, '0');
    
    const context = wx.createCanvasContext('shareCanvas');
    
    const canvasWidth = 300;
    const canvasHeight = 450;
    
    context.setFillStyle('#FFFFFF');
    context.fillRect(0, 0, canvasWidth, canvasHeight);
    
    context.setStrokeStyle('#CCCCCC');
    context.setLineWidth(1);
    context.setLineDash([5, 3]);
    context.beginPath();
    context.moveTo(25, 40);
    context.lineTo(canvasWidth - 25, 40);
    context.stroke();
    
    context.font = 'bold 18px Courier New';
    context.setFillStyle('#333333');
    context.setTextAlign('center');
    context.fillText('--- 赛博意念超度凭证 ---', canvasWidth / 2, 70);
    
    context.beginPath();
    context.moveTo(25, 90);
    context.lineTo(canvasWidth - 25, 90);
    context.stroke();
    
    context.font = '12px Courier New';
    context.setFillStyle('#666666');
    context.setTextAlign('left');
    context.fillText('案发时间：' + dateStr, 40, 120);
    context.fillText('案发时刻：' + timeStr, 40, 145);
    
    context.font = '12px Courier New';
    context.setFillStyle('#666666');
    context.setTextAlign('left');
    
    const lines = this.wrapText(context, shareText, 220);
    let y = 190;
    lines.forEach((line, index) => {
      context.fillText(line, 40, y + index * 18);
    });
    
    context.font = '12px Courier New';
    context.setFillStyle('#888888');
    context.fillText('意念强度：████████ 100%', 40, y + lines.length * 18 + 20);
    context.fillText('灵魂净化度：████████ 100%', 40, y + lines.length * 18 + 40);
    
    context.setStrokeStyle('#FF4444');
    context.setLineWidth(2);
    context.setLineDash([]);
    
    context.save();
    context.translate(canvasWidth - 75, canvasHeight - 90);
    context.rotate(-15 * Math.PI / 180);
    
    context.beginPath();
    context.arc(0, 0, 35, 0, 2 * Math.PI);
    context.stroke();
    
    context.beginPath();
    context.arc(0, 0, 30, 0, 2 * Math.PI);
    context.stroke();
    
    context.font = 'bold 10px Courier New';
    context.setFillStyle('#FF4444');
    context.setTextAlign('center');
    context.setTextBaseline('middle');
    context.fillText('查收', 0, -5);
    context.fillText('成功', 0, 7);
    context.restore();
    
    context.setStrokeStyle('#CCCCCC');
    context.setLineWidth(1);
    context.setLineDash([5, 3]);
    context.beginPath();
    context.moveTo(25, canvasHeight - 50);
    context.lineTo(canvasWidth - 25, canvasHeight - 50);
    context.stroke();
    
    context.font = '12px Courier New';
    context.setFillStyle('#888888');
    context.setTextAlign('center');
    context.fillText('--- 脑电波传输完毕 ---', canvasWidth / 2, canvasHeight - 25);
    
    context.font = '9px Courier New';
    context.setFillStyle('#AAAAAA');
    context.fillText('赛博木鱼 v1.0 | 唯物主义祈福工具', canvasWidth / 2, canvasHeight - 12);
    
    context.draw();
    
    setTimeout(() => {
      wx.canvasToTempFilePath({
        canvasId: 'shareCanvas',
        success: (res) => {
          callback(res.tempFilePath);
        },
        fail: (err) => {
          console.error('生成图片失败:', err);
          callback(null);
        }
      });
    }, 300);
  },
  
  onShareAppMessage(res) {
    const imageUrl = this.data.shareImagePath || '/images/wooden-fish-mini.png';
    return {
      title: '请查收我的赛博收据',
      path: '/pages/index/index',
      imageUrl: imageUrl
    };
  },
  
  onShareTimeline() {
    const imageUrl = this.data.shareImagePath || '/images/wooden-fish-mini.png';
    return {
      title: '请查收我的赛博收据',
      query: '',
      imageUrl: imageUrl
    };
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
