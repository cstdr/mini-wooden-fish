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
      wx.vibrateShort({ type: 'light' });
    }
    
    if (isCyber) {
      this.setData({ isShaking: true, shakeClass: shakeClass });
      setTimeout(() => {
        this.setData({ isShaking: false, shakeClass: '' });
      }, duration);
    }
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
    
    const themes = ['cyberpunk', 'achievement', 'comic', 'minimal', 'glitch'];
    const theme = themes[Math.floor(Math.random() * themes.length)];
    
    if (theme === 'cyberpunk') {
      this.drawCyberpunkReceipt(context, canvasWidth, canvasHeight, tapCount, currentWord, shareText, dateStr, timeStr);
    } else if (theme === 'achievement') {
      this.drawAchievementBadge(context, canvasWidth, canvasHeight, tapCount, currentWord, shareText);
    } else if (theme === 'comic') {
      this.drawComicStyle(context, canvasWidth, canvasHeight, tapCount, currentWord, shareText);
    } else if (theme === 'minimal') {
      this.drawMinimalStyle(context, canvasWidth, canvasHeight, tapCount, currentWord, shareText);
    } else {
      this.drawGlitchStyle(context, canvasWidth, canvasHeight, tapCount, currentWord, shareText, dateStr);
    }
    
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
  
  drawCyberpunkReceipt(context, w, h, merit, keyword, text, date, time) {
    context.setFillStyle('#0a0a0f');
    context.fillRect(0, 0, w, h);
    
    for (let i = 0; i < h; i += 4) {
      context.setFillStyle('rgba(0, 255, 136, 0.03)');
      context.fillRect(0, i, w, 2);
    }
    
    context.font = 'bold 16px Courier New';
    context.setFillStyle('#00ff88');
    context.setTextAlign('center');
    context.fillText('[ 系统凭证 ]', w/2, 40);
    
    context.font = '10px Courier New';
    context.setFillStyle('#666');
    context.fillText(date + ' ' + time, w/2, 60);
    
    context.setStrokeStyle('#00ff88');
    context.setLineWidth(1);
    context.setLineDash([5, 5]);
    context.beginPath();
    context.moveTo(20, 80);
    context.lineTo(w - 20, 80);
    context.stroke();
    
    context.font = 'bold 32px Courier New';
    context.setFillStyle('#ff00ff');
    context.setTextAlign('center');
    context.shadowColor = '#ff00ff';
    context.shadowBlur = 20;
    context.fillText(merit, w/2, 140);
    context.shadowBlur = 0;
    
    context.font = '14px Courier New';
    context.setFillStyle('#00ffff');
    context.fillText(keyword, w/2, 170);
    
    context.setLineDash([]);
    context.beginPath();
    context.moveTo(20, 190);
    context.lineTo(w - 20, 190);
    context.stroke();
    
    context.font = '11px Courier New';
    context.setFillStyle('#888');
    context.setTextAlign('left');
    const lines = text.split('\n');
    lines.forEach((line, i) => {
      context.fillText(line, 30, 215 + i * 20);
    });
    
    context.setFillStyle('#ff00ff');
    context.beginPath();
    context.arc(w - 60, h - 80, 40, 0, 2 * Math.PI);
    context.stroke();
    context.font = 'bold 14px Courier New';
    context.setTextAlign('center');
    context.fillText('APPROVED', w - 60, h - 75);
    
    context.font = '9px Courier New';
    context.setFillStyle('#444');
    context.fillText('CYBER_WOODEN_FISH v2.0', w/2, h - 20);
  },
  
  drawAchievementBadge(context, w, h, merit, keyword, text) {
    context.setFillStyle('#1a1a2e');
    context.fillRect(0, 0, w, h);
    
    const gradient = context.createLinearGradient(0, 0, w, h);
    gradient.addColorStop(0, '#ffd700');
    gradient.addColorStop(0.5, '#ffaa00');
    gradient.addColorStop(1, '#ff8800');
    
    context.beginPath();
    context.moveTo(w/2, 30);
    for (let i = 0; i < 12; i++) {
      const angle = (i * 30 - 90) * Math.PI / 180;
      const radius = i % 2 === 0 ? 70 : 55;
      context.lineTo(w/2 + Math.cos(angle) * radius, 80 + Math.sin(angle) * radius);
    }
    context.closePath();
    context.setFillStyle(gradient);
    context.fill();
    context.strokeStyle = '#fff';
    context.lineWidth = 2;
    context.stroke();
    
    context.setFillStyle('#1a1a2e');
    context.beginPath();
    context.arc(w/2, 80, 35, 0, 2 * Math.PI);
    context.fill();
    
    context.font = 'bold 24px Arial';
    context.setFillStyle('#ffd700');
    context.setTextAlign('center');
    context.setTextBaseline('middle');
    context.fillText(merit, w/2, 82);
    
    context.setTextBaseline('alphabetic');
    context.font = 'bold 14px Arial';
    context.setFillStyle('#fff');
    context.fillText('达成成就！', w/2, 175);
    
    context.font = 'bold 18px Arial';
    context.setFillStyle('#ff6b6b');
    context.fillText(keyword, w/2, 200);
    
    context.setFillStyle('#333');
    context.fillRect(30, 220, w - 60, 80);
    context.setFillStyle('#222');
    context.fillRect(32, 222, (w - 64) * Math.min(merit / 1000, 1), 76);
    
    context.font = '10px Arial';
    context.setFillStyle('#888');
    context.setTextAlign('left');
    context.fillText(text, 40, 250);
    
    context.font = 'bold 12px Arial';
    context.setFillStyle('#ffd700');
    context.setTextAlign('center');
    context.fillText('⭐ 分享我的战绩 ⭐', w/2, 330);
    
    context.font = '9px Arial';
    context.setFillStyle('#666');
    context.fillText('赛博木鱼 - 功德无量', w/2, h - 20);
  },
  
  drawComicStyle(context, w, h, merit, keyword, text) {
    context.setFillStyle('#fff9e6');
    context.fillRect(0, 0, w, h);
    
    context.setStrokeStyle('#000');
    context.setLineWidth(3);
    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(w, 0);
    context.lineTo(w, h);
    context.lineTo(0, h);
    context.closePath();
    context.stroke();
    
    context.setFillStyle('#ffcc00');
    context.beginPath();
    context.arc(w/2, 60, 45, 0, 2 * Math.PI);
    context.fill();
    context.stroke();
    
    context.font = 'bold 36px Arial';
    context.setFillStyle('#000');
    context.setTextAlign('center');
    context.setTextBaseline('middle');
    context.fillText('💰', w/2, 62);
    
    context.setTextBaseline('alphabetic');
    context.font = 'bold 18px Arial';
    context.setFillStyle('#ff3366');
    context.fillText('今日份暴富', 40, 130);
    
    context.beginPath();
    context.moveTo(40, 140);
    context.lineTo(100, 130);
    context.lineTo(40, 120);
    context.closePath();
    context.setFillStyle('#ffcc00');
    context.fill();
    context.stroke();
    
    context.font = 'bold 48px Arial';
    context.setFillStyle('#333');
    context.setTextAlign('center');
    context.fillText(merit, w/2, 200);
    
    context.font = 'bold 20px Arial';
    context.setFillStyle('#ff6600');
    context.fillText(keyword + ' 达成!', w/2, 235);
    
    context.setFillStyle('#333');
    context.font = '12px Arial';
    context.setTextAlign('left');
    const lines = text.split('\n');
    lines.forEach((line, i) => {
      context.fillText(line, 30, 270 + i * 18);
    });
    
    context.font = 'bold 16px Arial';
    context.setFillStyle('#000');
    context.setTextAlign('center');
    context.fillText('POW! 功德圆满!', w/2, h - 50);
    
    context.setFillStyle('#666');
    context.font = '10px Arial';
    context.fillText('— 赛博木鱼小程序 —', w/2, h - 25);
  },
  
  drawMinimalStyle(context, w, h, merit, keyword, text) {
    context.setFillStyle('#fafafa');
    context.fillRect(0, 0, w, h);
    
    context.setStrokeStyle('#ddd');
    context.setLineWidth(1);
    context.beginPath();
    context.moveTo(40, 100);
    context.lineTo(w - 40, 100);
    context.stroke();
    
    context.font = 'normal 12px Georgia';
    context.setFillStyle('#999');
    context.setTextAlign('center');
    context.fillText('wooden fish', w/2, 80);
    
    context.font = 'bold 72px Georgia';
    context.setFillStyle('#1a1a1a');
    context.fillText(merit, w/2, 180);
    
    context.font = '16px Georgia';
    context.setFillStyle('#666');
    context.fillText(keyword, w/2, 215);
    
    context.beginPath();
    context.moveTo(40, 240);
    context.lineTo(w - 40, 240);
    context.stroke();
    
    context.font = '11px Georgia';
    context.setFillStyle('#999');
    context.setTextAlign('left');
    const lines = text.split('\n');
    lines.forEach((line, i) => {
      context.fillText(line, 40, 270 + i * 18);
    });
    
    context.beginPath();
    context.moveTo(40, h - 60);
    context.lineTo(w - 40, h - 60);
    context.stroke();
    
    context.font = '10px Georgia';
    context.setFillStyle('#ccc');
    context.setTextAlign('center');
    context.fillText('share from wooden fish', w/2, h - 40);
  },
  
  drawGlitchStyle(context, w, h, merit, keyword, text, date) {
    context.setFillStyle('#0f0f0f');
    context.fillRect(0, 0, w, h);
    
    for (let i = 0; i < 50; i++) {
      const y = Math.random() * h;
      const offset = (Math.random() - 0.5) * 10;
      context.setFillStyle(`rgba(${Math.random() > 0.5 ? '255,0,0' : '0,255,255'}, 0.3)`);
      context.fillRect(offset, y, w, 2);
    }
    
    context.font = 'bold 20px Impact';
    context.setTextAlign('center');
    context.setFillStyle('#ff0040');
    context.fillText('// ERROR //', w/2 + 2, 42);
    context.setFillStyle('#00ffff');
    context.fillText('// ERROR //', w/2 - 2, 38);
    context.setFillStyle('#fff');
    context.fillText('// ERROR //', w/2, 40);
    
    context.font = 'bold 48px Impact';
    context.setFillStyle('#ff0040');
    context.fillText(merit, w/2 + 3, 120);
    context.setFillStyle('#00ffff');
    context.fillText(merit, w/2 - 3, 116);
    context.setFillStyle('#fff');
    context.fillText(merit, w/2, 118);
    
    context.font = 'bold 18px Impact';
    context.setFillStyle('#ffff00');
    context.fillText(keyword, w/2, 155);
    
    context.setStrokeStyle('#333');
    context.setLineWidth(1);
    context.setLineDash([3, 3]);
    context.beginPath();
    context.moveTo(20, 180);
    context.lineTo(w - 20, 180);
    context.stroke();
    
    context.font = '12px monospace';
    context.setFillStyle('#888');
    context.setTextAlign('left');
    const lines = text.split('\n');
    lines.forEach((line, i) => {
      context.fillStyle = i % 2 === 0 ? '#ff0040' : '#00ffff';
      context.fillText('> ' + line, 30, 210 + i * 20);
    });
    
    context.setFillStyle('#ffff00');
    context.font = 'bold 14px Impact';
    context.setTextAlign('center');
    context.fillText('[ TRANSMISSION COMPLETE ]', w/2, h - 40);
    
    context.font = '9px monospace';
    context.setFillStyle('#444');
    context.fillText(date + ' | GLITCH_MODE_ACTIVE', w/2, h - 20);
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
