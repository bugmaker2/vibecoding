# 点击游戏技术文档

## 1. 技术栈概述

### 1.1 核心技术
- 前端框架：原生 JavaScript
- 样式处理：CSS3 + CSS 变量
- 动画效果：GSAP + CSS 动画
- 特效库：Confetti.js
- 数据存储：LocalStorage API
- 构建工具：Vite

### 1.2 项目依赖
```json
{
  "dependencies": {
    "gsap": "^3.12.5",
    "canvas-confetti": "^1.9.2"
  },
  "devDependencies": {
    "vite": "^5.1.0"
  }
}
```

## 2. 核心功能实现

### 2.1 点击系统
```javascript
// 点击计数器
class ClickCounter {
  constructor() {
    this.count = 0;
    this.maxCount = 1000;
    this.loadFromStorage();
  }

  increment() {
    this.count++;
    this.saveToStorage();
    this.checkAchievements();
  }

  loadFromStorage() {
    const saved = localStorage.getItem('clickCount');
    this.count = saved ? parseInt(saved) : 0;
  }

  saveToStorage() {
    localStorage.setItem('clickCount', this.count.toString());
  }
}
```

### 2.2 成就系统
```javascript
// 成就管理器
class AchievementManager {
  constructor() {
    this.achievements = {
      firstClick: { unlocked: false, threshold: 1 },
      hundredClicks: { unlocked: false, threshold: 100 },
      fiveHundredClicks: { unlocked: false, threshold: 500 }
    };
    this.loadFromStorage();
  }

  checkAchievements(count) {
    Object.entries(this.achievements).forEach(([key, achievement]) => {
      if (!achievement.unlocked && count >= achievement.threshold) {
        this.unlockAchievement(key);
      }
    });
  }

  unlockAchievement(key) {
    this.achievements[key].unlocked = true;
    this.saveToStorage();
    this.showUnlockAnimation(key);
  }
}
```

### 2.3 商店系统
```javascript
// 商店管理器
class StoreManager {
  constructor() {
    this.robots = 0;
    this.maxRobots = 10;
    this.effects = {
      confetti: false,
      disco: false
    };
    this.loadFromStorage();
  }

  addRobot() {
    if (this.robots < this.maxRobots) {
      this.robots++;
      this.saveToStorage();
      this.startRobotClicking();
    }
  }

  toggleEffect(effect) {
    this.effects[effect] = !this.effects[effect];
    this.saveToStorage();
  }
}
```

## 3. 动画系统

### 3.1 点击动画
```javascript
// 点击效果管理器
class ClickEffectManager {
  constructor() {
    this.gsap = gsap;
  }

  playClickAnimation(element) {
    this.gsap.timeline()
      .to(element, {
        scale: 0.95,
        duration: 0.1
      })
      .to(element, {
        scale: 1,
        duration: 0.1
      });
  }

  playRippleEffect(x, y) {
    const ripple = document.createElement('div');
    ripple.className = 'ripple';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    document.body.appendChild(ripple);
    
    this.gsap.to(ripple, {
      scale: 2,
      opacity: 0,
      duration: 0.5,
      onComplete: () => ripple.remove()
    });
  }
}
```

### 3.2 成就动画
```javascript
// 成就动画管理器
class AchievementAnimationManager {
  constructor() {
    this.gsap = gsap;
  }

  playUnlockAnimation(achievement) {
    const badge = document.createElement('div');
    badge.className = 'achievement-badge';
    document.body.appendChild(badge);

    this.gsap.timeline()
      .from(badge, {
        scale: 0,
        rotation: -180,
        duration: 1,
        ease: 'back.out'
      })
      .to(badge, {
        scale: 1.2,
        duration: 0.2
      })
      .to(badge, {
        scale: 1,
        duration: 0.2
      });
  }
}
```

## 4. 状态管理

### 4.1 游戏状态
```javascript
// 游戏状态管理器
class GameStateManager {
  constructor() {
    this.state = {
      clicks: 0,
      achievements: {},
      store: {
        robots: 0,
        effects: {}
      },
      settings: {
        sound: true,
        animations: true
      }
    };
  }

  saveState() {
    localStorage.setItem('gameState', JSON.stringify(this.state));
  }

  loadState() {
    const saved = localStorage.getItem('gameState');
    if (saved) {
      this.state = JSON.parse(saved);
    }
  }

  resetState() {
    this.state = {
      clicks: 0,
      achievements: {},
      store: {
        robots: 0,
        effects: {}
      },
      settings: {
        sound: true,
        animations: true
      }
    };
    this.saveState();
  }
}
```

## 5. 性能优化

### 5.1 动画优化
```javascript
// 动画性能优化
class AnimationOptimizer {
  constructor() {
    this.isLowPerformance = this.checkPerformance();
  }

  checkPerformance() {
    return window.navigator.hardwareConcurrency <= 4;
  }

  optimizeAnimation(element) {
    if (this.isLowPerformance) {
      element.style.willChange = 'transform';
      element.style.transform = 'translateZ(0)';
    }
  }
}
```

### 5.2 资源加载
```javascript
// 资源加载管理器
class ResourceLoader {
  constructor() {
    this.loadedResources = new Set();
  }

  async preloadSound(url) {
    if (!this.loadedResources.has(url)) {
      const audio = new Audio();
      audio.src = url;
      await audio.load();
      this.loadedResources.add(url);
    }
  }

  async preloadImage(url) {
    if (!this.loadedResources.has(url)) {
      const img = new Image();
      img.src = url;
      await img.decode();
      this.loadedResources.add(url);
    }
  }
}
```

## 6. 错误处理

### 6.1 错误捕获
```javascript
// 错误处理器
class ErrorHandler {
  constructor() {
    this.setupErrorHandling();
  }

  setupErrorHandling() {
    window.addEventListener('error', (event) => {
      this.handleError(event.error);
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.handleError(event.reason);
    });
  }

  handleError(error) {
    console.error('Error:', error);
    // 可以添加错误上报逻辑
  }
}
```

## 7. 测试用例

### 7.1 单元测试
```javascript
// 点击计数器测试
describe('ClickCounter', () => {
  let counter;

  beforeEach(() => {
    counter = new ClickCounter();
  });

  test('should increment count', () => {
    counter.increment();
    expect(counter.count).toBe(1);
  });

  test('should save to storage', () => {
    counter.increment();
    const saved = localStorage.getItem('clickCount');
    expect(saved).toBe('1');
  });
});
```

### 7.2 集成测试
```javascript
// 游戏流程测试
describe('Game Flow', () => {
  let game;

  beforeEach(() => {
    game = new Game();
  });

  test('should unlock achievement at 100 clicks', () => {
    for (let i = 0; i < 100; i++) {
      game.click();
    }
    expect(game.achievements.hundredClicks.unlocked).toBe(true);
  });
});
```

## 8. 部署说明

### 8.1 构建流程
```bash
# 安装依赖
npm install

# 开发环境
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

### 8.2 部署检查清单
- [ ] 运行所有测试
- [ ] 检查性能指标
- [ ] 验证所有功能
- [ ] 检查浏览器兼容性
- [ ] 验证资源加载
- [ ] 检查错误处理

## 9. 维护指南

### 9.1 代码维护
- 遵循代码规范
- 保持文档更新
- 定期代码审查
- 及时更新依赖

### 9.2 性能监控
- 监控页面加载时间
- 跟踪错误率
- 分析用户行为
- 优化资源使用

## 更新日志

| 日期 | 版本 | 更新内容 | 作者 |
|------|------|----------|------|
| 2024-03-21 | 1.0.0 | 初始版本 | James | 