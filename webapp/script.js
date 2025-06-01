document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('helloButton');
    const blessingText = document.getElementById('blessingText');
    const cheerSound = document.getElementById('cheerSound');
    const celebrationSound = document.getElementById('celebrationSound');
    const achievementSound = document.getElementById('achievementSound');
    const clickCountElement = document.getElementById('clickCount');
    const buttonWrapper = document.querySelector('.button-wrapper');
    const body = document.body;
    const progressFill = document.querySelector('.progress-fill');
    const themeButtons = document.querySelectorAll('.theme-btn');
    
    const blessings = [
        "愿你前程似锦，未来可期！",
        "祝你心想事成，万事如意！",
        "愿你的生活充满阳光和欢笑！",
        "祝你事业蒸蒸日上，梦想成真！",
        "愿你遇见美好，收获幸福！",
        "祝你平安喜乐，幸福安康！",
        "愿你的每一天都充满希望和惊喜！"
    ];

    let currentBlessingIndex = 0;
    let isFirstClick = true;
    let clickCount = 0;
    let unlockedAchievements = new Set();
    
    // 初始化主题
    const savedTheme = localStorage.getItem('theme') || 'default';
    body.classList.add(`${savedTheme}-theme`);
    
    // 主题切换
    themeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const theme = btn.dataset.theme;
            body.className = ''; // 清除所有主题类
            body.classList.add(`${theme}-theme`);
            localStorage.setItem('theme', theme);
        });
    });

    // 商店逻辑
    const buyConfettiBtn = document.getElementById('buyConfetti');
    const buyDiscoBtn = document.getElementById('buyDisco');
    const buyDiscoOnBtn = document.getElementById('buyDiscoOn');
    let confettiDisabled = localStorage.getItem('confettiDisabled') === 'true';
    let discoDisabled = localStorage.getItem('discoDisabled') === 'true';

    function updateShopButtons() {
        buyConfettiBtn.disabled = confettiDisabled || clickCount < 200;
        buyConfettiBtn.textContent = confettiDisabled ? '已关闭' : '花费200点击购买';
        // 关闭蹦迪按钮：只有在蹦迪模式下且点击数足够时可用
        const discoModeOn = body.classList.contains('disco-mode');
        buyDiscoBtn.disabled = !discoModeOn || clickCount < 500;
        buyDiscoBtn.textContent = discoModeOn ? (clickCount < 500 ? '花费500点击购买' : '关闭蹦迪闪烁') : '未开启';
        buyBotBtn.disabled = clickCount < 100 || botCount >= 10;
        buyBotBtn.textContent = botCount >= 10 ? '已达上限' : '花费100点击购买';
        buyDiscoOnBtn.disabled = clickCount < 150;
    }

    buyConfettiBtn.addEventListener('click', () => {
        if (clickCount >= 200 && !confettiDisabled) {
            clickCount -= 200;
            confettiDisabled = true;
            localStorage.setItem('clickCount', clickCount);
            localStorage.setItem('confettiDisabled', 'true');
            clickCountElement.textContent = clickCount;
            updateProgress();
            updateShopButtons();
        }
    });

    buyDiscoBtn.addEventListener('click', () => {
        // 只有在蹦迪模式下且点击数足够时才可关闭
        const discoModeOn = body.classList.contains('disco-mode');
        if (discoModeOn && clickCount >= 500) {
            clickCount -= 500;
            clickCountElement.textContent = clickCount;
            updateProgress();
            updateShopButtons();
            // 关闭蹦迪效果
            body.classList.remove('disco-mode');
            gsap.set(button, { rotation: 0 });
            discoDisabled = true;
            localStorage.setItem('discoDisabled', 'true');
        }
    });

    buyDiscoOnBtn.addEventListener('click', () => {
        if (clickCount >= 150) {
            clickCount -= 150;
            localStorage.setItem('clickCount', clickCount);
            clickCountElement.textContent = clickCount;
            updateProgress();
            updateShopButtons();
            updateBotUI();
            // 立即开启蹦迪效果
            body.classList.add('disco-mode');
            gsap.to(button, {
                rotation: 360,
                duration: 0.5,
                ease: "power1.inOut",
                repeat: -1
            });
        }
    });

    // 自动点击机器人逻辑
    const buyBotBtn = document.getElementById('buyBot');
    const botCountSpan = document.getElementById('botCount');
    let botCount = parseInt(localStorage.getItem('botCount') || '0', 10);
    let botInterval = null;

    function updateBotUI() {
        botCountSpan.textContent = botCount;
    }

    buyBotBtn.addEventListener('click', () => {
        if (clickCount >= 100 && botCount < 10) {
            clickCount -= 100;
            botCount += 1;
            localStorage.setItem('clickCount', clickCount);
            localStorage.setItem('botCount', botCount);
            clickCountElement.textContent = clickCount;
            updateProgress();
            updateShopButtons();
            updateBotUI();
            startBotInterval();
        }
    });

    function startBotInterval() {
        if (botInterval) clearInterval(botInterval);
        if (botCount > 0) {
            botInterval = setInterval(() => {
                clickCount += botCount;
                clickCountElement.textContent = clickCount;
                localStorage.setItem('clickCount', clickCount);
                updateProgress();
                checkAchievements();
                updateShopButtons();
                updateBotUI();
                checkDiscoMode();
            }, 1000);
        }
    }

    // 更新进度条
    function updateProgress() {
        const progress = Math.min((clickCount / 1000) * 100, 100);
        progressFill.style.width = `${progress}%`;
    }

    // 检查成就
    function checkAchievements() {
        const achievements = {
            'first-click': clickCount >= 1,
            'hundred-clicks': clickCount >= 100,
            'disco-mode': clickCount >= 500
        };

        Object.entries(achievements).forEach(([id, condition]) => {
            if (condition && !unlockedAchievements.has(id)) {
                unlockAchievement(id);
            }
        });
    }

    // 解锁成就
    function unlockAchievement(id) {
        const achievement = document.querySelector(`[data-id="${id}"]`);
        if (achievement && !achievement.classList.contains('unlocked')) {
            achievement.classList.add('unlocked');
            achievementSound.currentTime = 0;
            achievementSound.play().catch(e => console.log('Audio play failed:', e));
            unlockedAchievements.add(id);
            
            // 显示成就解锁动画
            gsap.fromTo(achievement,
                { scale: 1 },
                { scale: 1.2, duration: 0.3, ease: "back.out" }
            );
        }
    }

    // 检查是否应该启动蹦迪模式
    function checkDiscoMode() {
        if (discoDisabled) return;
        if (clickCount >= 500 && !body.classList.contains('disco-mode')) {
            body.classList.add('disco-mode');
            gsap.to(button, {
                rotation: 360,
                duration: 0.5,
                ease: "power1.inOut",
                repeat: -1
            });
        }
    }

    // 彩带效果函数
    function shootConfetti() {
        if (confettiDisabled) return;
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.1, 0.9), y: Math.random() - 0.2 }
            });
        }, 250);
    }

    // 庆祝效果函数
    function celebrate() {
        celebrationSound.currentTime = 0;
        celebrationSound.play().catch(e => console.log('Audio play failed:', e));

        const duration = 5 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 50, spread: 360, ticks: 60, zIndex: 0 };

        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 100 * (timeLeft / duration);
            
            for (let i = 0; i < 5; i++) {
                confetti({
                    ...defaults,
                    particleCount,
                    origin: { x: randomInRange(0.1, 0.9), y: Math.random() - 0.2 }
                });
            }
        }, 100);

        // 添加按钮庆祝动画
        gsap.timeline()
            .to(button, {
                scale: 1.2,
                duration: 0.3,
                ease: "power2.out"
            })
            .to(button, {
                scale: 1,
                duration: 0.5,
                ease: "elastic.out(1, 0.3)"
            });

        // 添加文字庆祝动画
        gsap.timeline()
            .to(blessingText, {
                scale: 1.1,
                duration: 0.3,
                ease: "power2.out"
            })
            .to(blessingText, {
                scale: 1,
                duration: 0.5,
                ease: "elastic.out(1, 0.3)"
            });
    }

    // 奖励弹窗相关
    const rewardModal = document.getElementById('rewardModal');
    const rewardModalClose = document.getElementById('rewardModalClose');
    const svgBadgeContainer = document.getElementById('svgBadgeContainer');
    rewardModalClose.addEventListener('click', () => {
        rewardModal.style.display = 'none';
    });
    function generateUniqueBadgeSVG() {
        const color1 = `hsl(${Math.floor(Math.random()*360)},90%,60%)`;
        const color2 = `hsl(${Math.floor(Math.random()*360)},90%,70%)`;
        const stars = Array.from({length: 6}, (_,i) => {
            const angle = (i/6)*2*Math.PI + Math.random()*0.2;
            const r = 70 + Math.random()*18;
            const x = 100 + Math.cos(angle)*r;
            const y = 100 + Math.sin(angle)*r;
            return `<polygon points="${x-3},${y} ${x+3},${y} ${x},${y-6}" fill="#fffde7" opacity="0.8"/>`;
        }).join('');
        return `
        <svg width="200" height="200" viewBox="0 0 200 200">
          <defs>
            <radialGradient id="g1" cx="50%" cy="50%" r="80%">
              <stop offset="0%" stop-color="${color1}"/>
              <stop offset="100%" stop-color="${color2}"/>
            </radialGradient>
          </defs>
          <circle cx="100" cy="100" r="90" fill="url(#g1)" stroke="#FFD700" stroke-width="8"/>
          <circle cx="100" cy="100" r="70" fill="none" stroke="#fffde7" stroke-width="3" opacity="0.7"/>
          ${stars}
          <text x="100" y="110" text-anchor="middle" font-size="54" font-weight="bold" fill="#FFD700" stroke="#fff" stroke-width="2" font-family="Arial">1000</text>
          <text x="100" y="145" text-anchor="middle" font-size="18" fill="#d84315" font-family="Arial">千次点击王者</text>
        </svg>
        `;
    }

    // 游戏终止函数
    function endGame() {
        // 停止自动点击
        if (botInterval) {
            clearInterval(botInterval);
            botInterval = null;
        }
        
        // 禁用所有按钮
        button.disabled = true;
        buyConfettiBtn.disabled = true;
        buyDiscoBtn.disabled = true;
        buyDiscoOnBtn.disabled = true;
        buyBotBtn.disabled = true;
        
        // 显示奖励弹窗
        svgBadgeContainer.innerHTML = generateUniqueBadgeSVG();
        rewardModal.style.display = 'flex';
        
        // 播放庆祝音效和动画
        celebrate();
    }

    button.addEventListener('click', () => {
        clickCount++;
        clickCountElement.textContent = clickCount;
        localStorage.setItem('clickCount', clickCount);
        updateProgress();
        checkAchievements();
        checkDiscoMode();
        updateShopButtons();
        updateBotUI();

        // 检查是否达到1000次点击
        if (clickCount >= 1000) {
            endGame();
            return;
        }

        // 播放动画和音效
        gsap.to(button, {
            scale: 0.95,
            duration: 0.1,
            ease: "power2.out",
            yoyo: true,
            repeat: 1
        });

        cheerSound.currentTime = 0;
        cheerSound.play().catch(e => console.log('Audio play failed:', e));

        shootConfetti();

        if (clickCount % 100 === 0) {
            celebrate();
        }

        // 更新祝福文字
        currentBlessingIndex = (currentBlessingIndex + 1) % blessings.length;
        blessingText.textContent = blessings[currentBlessingIndex];

        // 第一次点击时移动按钮
        if (isFirstClick) {
            gsap.to(buttonWrapper, {
                x: -100,
                duration: 0.8,
                ease: "power2.inOut"
            });
            isFirstClick = false;
        }

        // 显示祝福文字动画
        gsap.timeline()
            .to(blessingText, {
                opacity: 0,
                x: 50,
                duration: 0.3,
                ease: "power2.in"
            })
            .set(blessingText, { textContent: blessings[currentBlessingIndex] })
            .to(blessingText, {
                opacity: 1,
                x: 0,
                duration: 0.5,
                ease: "power2.out"
            });
    });

    // 添加按钮悬浮效果
    button.addEventListener('mouseenter', () => {
        gsap.to(button, {
            scale: 1.05,
            duration: 0.3,
            ease: "power2.out"
        });
    });

    button.addEventListener('mouseleave', () => {
        gsap.to(button, {
            scale: 1,
            duration: 0.3,
            ease: "power2.out"
        });
    });

    // 商店弹窗显示/隐藏逻辑
    const shopToggleBtn = document.getElementById('shopToggleBtn');
    const shopPanel = document.getElementById('shopPanel');
    const shopCloseBtn = document.getElementById('shopCloseBtn');
    let shopVisible = false;

    function showShop() {
        shopPanel.style.display = 'block';
        shopVisible = true;
    }
    function hideShop() {
        shopPanel.style.display = 'none';
        shopVisible = false;
    }
    shopToggleBtn.addEventListener('click', () => {
        if (shopVisible) {
            hideShop();
        } else {
            showShop();
        }
    });
    shopCloseBtn.addEventListener('click', hideShop);

    // 初始化商店状态
    function restoreShopState() {
        confettiDisabled = localStorage.getItem('confettiDisabled') === 'true';
        discoDisabled = localStorage.getItem('discoDisabled') === 'true';
        botCount = parseInt(localStorage.getItem('botCount') || '0', 10);
        // 只根据页面状态判断是否为蹦迪模式
        // 如果彩带已关闭，无需处理（逻辑已在shootConfetti里）
        // 如果机器人数量大于0，重启自动点击
        startBotInterval();
        updateShopButtons();
        updateBotUI();
    }

    // 每次刷新页面时重置商店状态和机器人数量
    localStorage.removeItem('confettiDisabled');
    localStorage.removeItem('discoDisabled');
    localStorage.removeItem('botCount');
    confettiDisabled = false;
    discoDisabled = false;
    botCount = 0;

    // 初始化
    updateProgress();
    checkAchievements();
    restoreShopState();
    updateBotUI(); // 强制刷新一次机器人数量显示

    // 添加快速点击功能
    document.addEventListener('keydown', (e) => {
        if (e.key === 'f' || e.key === 'F') {
            clickCount += 100;
            clickCountElement.textContent = clickCount;
            localStorage.setItem('clickCount', clickCount);
            updateProgress();
            checkAchievements();
            checkDiscoMode();
            updateShopButtons();
            updateBotUI();
            
            // 检查是否达到1000次点击
            if (clickCount >= 1000) {
                endGame();
                return;
            }
        }
    });
}); 