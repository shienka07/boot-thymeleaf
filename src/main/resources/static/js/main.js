document.addEventListener('DOMContentLoaded', function() {
    // 알림 메시지 자동 숨김
    initializeAlerts();

    // 폼 제출 시 로딩 표시
    initializeFormSubmission();

    // 단어 입력 유효성 검사 및 힌트 표시
    initializeWordInput();

    // 단어 통계 계산
    calculateStats();

    // 애니메이션 효과
    initializeAnimations();

    // 다크 모드 토글
    initializeDarkMode();

    // 페이지 로드 시 인트로 애니메이션
    playIntroAnimation();

    // 이스터 에그 초기화
    initializeEasterEggs();

    // 키보드 단축키 초기화
    initializeKeyboardShortcuts();

    // 반응형 레이아웃 조정
    adjustResponsiveLayout();

    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
        loadingElement.style.display = 'none';
    }

    setTimeout(calculateStats, 100);
});

// document.addEventListener('DOMContentLoaded', function() {
//     const loadingElement = document.getElementById('loading');
//     if (loadingElement) {
//         loadingElement.style.display = 'none';
//     }
// });

/**
 * 알림 메시지 초기화 및 자동 숨김 설정
 */
function initializeAlerts() {
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => {
        setTimeout(() => {
            const bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        }, 5000);
    });
}

/**
 * 폼 제출 시 로딩 애니메이션 표시
 */
function initializeFormSubmission() {
    const forms = document.querySelectorAll('form');
    const loadingElement = document.getElementById('loading');

    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            // 삭제 폼이 아닐 경우에만 로딩 표시 (삭제는 확인 창이 있으므로)
            if (!form.action.includes('/delete')) {
                if (loadingElement) {
                    loadingElement.style.display = 'flex';
                }
            }
        });
    });
}

/**
 * 단어 입력 필드 유효성 검사 및 힌트 표시
 */
function initializeWordInput() {
    const wordInput = document.getElementById('word');
    const hintContainer = document.getElementById('hint-container');
    const wordList = document.querySelectorAll('.word-card');

    if (wordInput && hintContainer) {
        wordInput.addEventListener('input', function() {
            const value = this.value.trim();

            // 힌트 표시 로직
            if (wordList.length > 0) {
                // 가장 최근 단어 가져오기 (첫 번째 카드가 가장 최근)
                const lastWord = wordList[0].querySelector('.word-text').textContent;
                const lastChar = lastWord.charAt(lastWord.length - 1);

                if (value.length > 0) {
                    const firstChar = value.charAt(0);

                    if (firstChar === lastChar) {
                        hintContainer.innerHTML = `<span class="text-success">👍 좋아요! '${lastChar}'(으)로 시작하는 단어입니다.</span>`;
                        // 성공 효과 추가
                        wordInput.classList.add('is-valid');
                        wordInput.classList.remove('is-invalid');
                    } else {
                        hintContainer.innerHTML = `<span class="text-danger">❌ '${lastChar}'(으)로 시작하는 단어를 입력해주세요.</span>`;
                        // 오류 효과 추가
                        wordInput.classList.add('is-invalid');
                        wordInput.classList.remove('is-valid');
                    }
                } else {
                    hintContainer.innerHTML = `<span class="hint-text">'${lastChar}'(으)로 시작하는 단어를 입력하세요.</span>`;
                    wordInput.classList.remove('is-valid');
                    wordInput.classList.remove('is-invalid');
                }
            } else {
                hintContainer.innerHTML = '<span class="text-muted">첫 단어를 입력해보세요!</span>';
            }

            // 글자 수 체크
            if (value.length > 3) {
                wordInput.classList.add('is-invalid');
                wordInput.classList.remove('is-valid');
            }

            // 미리보기 업데이트
            updateWordPreview(value);
        });

        // 페이지 로드 시 초기 힌트 설정
        if (wordList.length > 0) {
            const lastWord = wordList[0].querySelector('.word-text').textContent;
            const lastChar = lastWord.charAt(lastWord.length - 1);
            hintContainer.innerHTML = `<span class="hint-text">'${lastChar}'(으)로 시작하는 단어를 입력하세요.</span>`;
        }
    }
}

/**
 * 단어 미리보기 업데이트
 */
function updateWordPreview(word) {
    const previewElement = document.getElementById('word-preview');

    if (previewElement) {
        if (word.length > 0) {
            const firstChar = word.charAt(0);
            const lastChar = word.charAt(word.length - 1);

            previewElement.innerHTML = `
                <div class="d-flex align-items-center mt-2 word-preview">
                    <span class="first-char">${firstChar}</span>
                    <span class="mx-2">→</span>
                    <span class="last-char">${lastChar}</span>
                </div>
            `;

            // 애니메이션 효과 추가
            const preview = previewElement.querySelector('.word-preview');
            preview.style.opacity = 0;
            setTimeout(() => {
                preview.style.opacity = 1;
                preview.style.transition = 'opacity 0.3s ease';
            }, 50);
        } else {
            previewElement.innerHTML = '';
        }
    }
}

/**
 * 단어 관련 통계 계산 및 표시
 */
function calculateStats() {
    const totalWordsElement = document.getElementById('total-words');
    const successfulConnectionsElement = document.getElementById('successful-connections');
    const currentStreakElement = document.getElementById('current-streak');
    const wordList = document.querySelectorAll('.word-card');

    if (totalWordsElement && successfulConnectionsElement && currentStreakElement && wordList.length > 0) {
        // 총 단어 수
        const totalWords = wordList.length;

        // 성공적으로 연결된 단어 수 - 직접 success-badge 엘리먼트 수 세기
        const successBadges = document.querySelectorAll('.success-badge');
        const successfulConnections = successBadges.length;

        // 연속 성공 (현재 진행 중인)
        let currentStreak = 0;
        for (let i = 0; i < wordList.length - 1; i++) {
            const hasSuccessBadge = wordList[i].querySelector('.success-badge');
            if (hasSuccessBadge) {
                currentStreak++;
            } else {
                break; // 첫 실패 시 중단
            }
        }

        // 간단한 값 설정으로 시작하여 확실히 값이 업데이트되도록 함
        totalWordsElement.textContent = totalWords;
        successfulConnectionsElement.textContent = successfulConnections;
        currentStreakElement.textContent = currentStreak;

        // 그 다음 애니메이션 적용
        animateStatChange('total-words', totalWords);
        animateStatChange('successful-connections', successfulConnections);
        animateStatChange('current-streak', currentStreak);
    }
}


/**
 * 통계 수치 변경 애니메이션
 */
function animateStatChange(elementId, newValue) {
    const element = document.getElementById(elementId);
    if (!element) return;

    // 현재 텍스트 내용을 숫자로 변환
    const currentText = element.textContent;
    const currentNum = parseInt(currentText.replace(/[^0-9]/g, '')) || 0;
    const newNum = parseInt(newValue.toString().replace(/[^0-9]/g, '')) || 0;

    // 값이 같으면 애니메이션 필요 없음
    if (currentNum === newNum) return;

    // 증가 또는 감소 방향 결정
    const step = currentNum < newNum ? 1 : -1;
    let currentCount = currentNum;

    const interval = setInterval(() => {
        currentCount += step;
        element.textContent = element.id === 'success-rate' ? `${currentCount}%` : currentCount;

        if ((step > 0 && currentCount >= newNum) || (step < 0 && currentCount <= newNum)) {
            clearInterval(interval);
            element.textContent = newValue;
        }
    }, 20);
}

/**
 * 사용자 티어 계산 및 표시
 */
function calculateUserTier(successRate, streak) {
    let tier = '';
    let tierClass = '';

    // 티어 결정 로직
    if (successRate >= 95 && streak >= 10) {
        tier = '마스터';
        tierClass = 'tier-master';
    } else if (successRate >= 90 && streak >= 8) {
        tier = '다이아몬드';
        tierClass = 'tier-diamond';
    } else if (successRate >= 80 && streak >= 6) {
        tier = '플래티넘';
        tierClass = 'tier-platinum';
    } else if (successRate >= 70 && streak >= 4) {
        tier = '골드';
        tierClass = 'tier-gold';
    } else if (successRate >= 60 && streak >= 2) {
        tier = '실버';
        tierClass = 'tier-silver';
    } else {
        tier = '브론즈';
        tierClass = 'tier-bronze';
    }

    // 티어 배지 표시
    const tierElement = document.getElementById('user-tier');
    if (tierElement) {
        tierElement.textContent = tier;

        // 모든 티어 클래스 제거
        tierElement.classList.remove(
            'tier-bronze', 'tier-silver', 'tier-gold',
            'tier-platinum', 'tier-diamond', 'tier-master'
        );

        // 새 티어 클래스 추가
        tierElement.classList.add(tierClass);
    }
}

/**
 * 애니메이션 효과 초기화
 */
function initializeAnimations() {
    // 단어 카드에 등장 애니메이션 추가
    const wordCards = document.querySelectorAll('.word-card');

    wordCards.forEach((card, index) => {
        // 순차적으로 나타나는 효과
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100 * index);
    });

    // 단어 텍스트에 글자별 애니메이션 추가
    const wordTexts = document.querySelectorAll('.word-text');
    wordTexts.forEach((wordText) => {
        const text = wordText.textContent;

        // 각 글자를 개별 요소로 감싸기
        let html = '';
        for (let i = 0; i < text.length; i++) {
            html += `<span class="char-by-char" style="animation-delay: ${i * 0.05}s">${text.charAt(i)}</span>`;
        }

        wordText.innerHTML = html;
    });
}

/**
 * 다크 모드 토글 기능
 */
function initializeDarkMode() {
    // 페이지 하단에 동적으로 다크 모드 토글 버튼 추가
    /*
    if (!document.querySelector('.dark-mode-toggle-container')) {
        const container = document.createElement('div');
        container.className = 'dark-mode-toggle-container';
        container.innerHTML = `
            <div class="dark-mode-toggle" id="dark-mode-toggle">
                <i class="bi bi-moon-stars"></i>
            </div>
        `;
        document.body.appendChild(container);
    }
    */

    // 토글 버튼 이벤트 리스너
    const darkModeToggle = document.getElementById('dark-mode-toggle');

    if (darkModeToggle) {
        // 저장된 테마 설정 불러오기
        const savedTheme = localStorage.getItem('theme');

        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
            darkModeToggle.innerHTML = '<i class="bi bi-sun"></i>';
        }

        // 토글 이벤트 리스너
        darkModeToggle.addEventListener('click', function() {
            if (document.body.classList.contains('dark-mode')) {
                document.body.classList.remove('dark-mode');
                localStorage.setItem('theme', 'light');
                this.innerHTML = '<i class="bi bi-moon-stars"></i>';

                // 토스트 메시지 표시
                showToast('라이트 모드로 전환했습니다.');
            } else {
                document.body.classList.add('dark-mode');
                localStorage.setItem('theme', 'dark');
                this.innerHTML = '<i class="bi bi-sun"></i>';

                // 토스트 메시지 표시
                showToast('다크 모드로 전환했습니다.');
            }
        });
    }
}

/**
 * 토스트 메시지 표시
 */
function showToast(message) {
    // 토스트 컨테이너가 없으면 생성
    if (!document.querySelector('.toast-container')) {
        const container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toastContainer = document.querySelector('.toast-container');

    // 토스트 생성
    const toastId = 'toast-' + Date.now();
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    toast.id = toastId;

    toast.innerHTML = `
        <div class="toast-header">
            <strong class="me-auto">알림</strong>
            <small>방금 전</small>
            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
            ${message}
        </div>
    `;

    toastContainer.appendChild(toast);

    // Bootstrap Toast 초기화 및 표시
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();

    // 일정 시간 후 자동 삭제
    setTimeout(() => {
        if (document.getElementById(toastId)) {
            bsToast.hide();

            // hide 이벤트가 완료된 후 요소 제거
            toast.addEventListener('hidden.bs.toast', function () {
                toast.remove();
            });
        }
    }, 3000);
}

/**
 * 페이지 로드 시 인트로 애니메이션
 */
function playIntroAnimation() {
    /*
    // 페이지 전환 효과 요소 생성
    const transition = document.createElement('div');
    transition.className = 'page-transition';
    document.body.appendChild(transition);

    // 페이지 로드 시 애니메이션
    setTimeout(() => {
        transition.style.transform = 'translateX(0)';
    }, 100);

    setTimeout(() => {
        transition.style.transform = 'translateX(100%)';
    }, 600);

    setTimeout(() => {
        transition.remove();
    }, 1200);
    */

    // 헤더 타이틀에 타이핑 효과 추가
    const headerTitle = document.querySelector('.game-header h1');
    if (headerTitle) {
        const originalText = headerTitle.textContent;
        headerTitle.textContent = '';
        headerTitle.classList.add('typing-effect');

        // 점진적으로 글자 추가
        let i = 0;
        const typeInterval = setInterval(() => {
            if (i < originalText.length) {
                headerTitle.textContent += originalText.charAt(i);
                i++;
            } else {
                clearInterval(typeInterval);
                setTimeout(() => {
                    headerTitle.classList.remove('typing-effect');
                }, 1000);
            }
        }, 100);
    }
}

/**
 * 미니 게임 캐릭터 초기화
 */
function initializeCharacter() {
    // 캐릭터 요소가 없으면 추가
    if (!document.querySelector('.character')) {
        const character = document.createElement('div');
        character.className = 'character';
        character.innerHTML = `
            <i class="bi bi-controller"></i>
            <div class="character-speech">안녕하세요! 끝말잇기 게임을 도와드릴게요.</div>
        `;
        document.body.appendChild(character);

        // 캐릭터 클릭 이벤트
        character.addEventListener('click', function() {
            const tips = [
                "단어는 최대 3글자까지 입력할 수 있어요.",
                "이전 단어의 마지막 글자로 시작하는 단어를 입력해보세요.",
                "연속으로 성공하면 더 높은 티어를 얻을 수 있어요!",
                "단어를 클릭하면 편집할 수 있어요.",
                "Shift+N을 누르면 새 단어 입력창에 포커스가 갑니다.",
                "Shift+R을 누르면 게임을 리셋할 수 있어요."
            ];

            const randomTip = tips[Math.floor(Math.random() * tips.length)];
            this.querySelector('.character-speech').textContent = randomTip;

            // 말풍선 자동 숨김
            setTimeout(() => {
                this.querySelector('.character-speech').textContent = '안녕하세요! 끝말잇기 게임을 도와드릴게요.';
            }, 5000);

            // 캐릭터 애니메이션
            this.style.transform = 'translateY(-10px) rotate(10deg)';
            setTimeout(() => {
                this.style.transform = '';
            }, 300);
        });
    }
}

/**
 * 이스터 에그 초기화
 */
function initializeEasterEggs() {
    let konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;

    // 키보드 이벤트 리스너
    document.addEventListener('keydown', function(e) {
        // 코나미 코드 감지
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;

            if (konamiIndex === konamiCode.length) {
                // 코나미 코드 완성 시 이스터 에그 실행
                triggerConfetti();
                showToast('🎉 이스터 에그를 발견했습니다! 🎮');
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }

        // 특별한 단어 감지
        const wordInput = document.getElementById('word');
        if (wordInput && wordInput === document.activeElement && wordInput.value === '끝') {
            if (e.key === 'Enter') {
                // 특별한 단어 입력 시 이스터 에그 실행
                wordInput.value = '';
                showToast('🎮 게임 마스터가 되셨군요!');
                document.body.classList.toggle('game-master-mode');
            }
        }
    });
}

/**
 * 색종이 효과 표시
 */
function triggerConfetti() {
    // 100개의 색종이 생성
    for (let i = 0; i < 100; i++) {
        createConfetti();
    }
}

/**
 * 색종이 조각 생성
 */
function createConfetti() {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';

    // 랜덤 색상
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

    // 랜덤 위치
    confetti.style.left = Math.random() * 100 + 'vw';

    // 랜덤 크기
    const size = Math.random() * 10 + 5;
    confetti.style.width = size + 'px';
    confetti.style.height = size + 'px';

    // 랜덤 회전
    confetti.style.transform = 'rotate(' + Math.random() * 360 + 'deg)';

    // 애니메이션 지연
    confetti.style.animationDelay = Math.random() * 2 + 's';

    document.body.appendChild(confetti);

    // 애니메이션 종료 후 제거
    confetti.addEventListener('animationend', function() {
        confetti.remove();
    });
}

/**
 * 키보드 단축키 초기화
 */
function initializeKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Shift + N: 새 단어 입력창 포커스
        if (e.shiftKey && e.key === 'N') {
            e.preventDefault();
            document.getElementById('word')?.focus();
        }

        // Shift + R: 게임 리셋 (확인 후)
        if (e.shiftKey && e.key === 'R') {
            e.preventDefault();
            if (confirm('정말 게임을 리셋하시겠습니까?')) {
                document.querySelector('form[action="/reset"]')?.submit();
            }
        }

        // Shift + D: 다크 모드 토글
        if (e.shiftKey && e.key === 'D') {
            e.preventDefault();
            document.getElementById('dark-mode-toggle')?.click();
        }

        // Escape: 활성화된 모달 닫기
        if (e.key === 'Escape') {
            const openModals = document.querySelectorAll('.modal.show');
            openModals.forEach(modal => {
                const bsModal = bootstrap.Modal.getInstance(modal);
                if (bsModal) bsModal.hide();
            });
        }
    });
}

/**
 * 화면 크기에 따른 반응형 조정
 */
function adjustResponsiveLayout() {
    const windowWidth = window.innerWidth;
    const wordCards = document.querySelectorAll('.word-card');

    if (windowWidth < 768) { // 모바일 뷰
        wordCards.forEach(card => {
            const actionsRow = card.querySelector('.actions-row');
            if (actionsRow) {
                actionsRow.classList.remove('text-end');
                actionsRow.classList.add('mt-3');
            }
        });
    } else { // 데스크톱 뷰
        wordCards.forEach(card => {
            const actionsRow = card.querySelector('.actions-row');
            if (actionsRow) {
                actionsRow.classList.add('text-end');
                actionsRow.classList.remove('mt-3');
            }
        });
    }

    // 창 크기 변경 시 반응형 조정
    window.addEventListener('resize', adjustResponsiveLayout);
}

/**
 * 모달 창에서 단어 수정 시 유효성 검사
 */
function validateEditForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return true;

    const input = form.querySelector('input[name="newWord"]');
    if (!input) return true;

    if (input.value.trim().length > 3) {
        showToast('단어는 최대 3글자까지 입력 가능합니다.');
        return false;
    }

    if (input.value.trim().length === 0) {
        showToast('단어를 입력해주세요.');
        return false;
    }

    return true;
}

window.onload = function() {
    setTimeout(calculateStats, 300);
};

// 초기 로드 시 한 번 실행
adjustResponsiveLayout();