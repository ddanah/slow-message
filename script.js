// 전역 변수
let currentPage = 1;
let messageArchive = JSON.parse(localStorage.getItem('messageArchive')) || [];

// 익명 닉네임 생성 함수
function generateAnonymousName() {
  const adjectives = [
    '코가 짧은', '귀가 큰', '꼬리가 긴', '발이 빠른', '눈이 반짝이는',
    '털이 복슬복슬한', '날개가 작은', '목이 긴', '다리가 짧은', '배가 볼록한',
    '입이 큰', '이빨이 하얀', '수염이 긴', '뿔이 멋진', '얼룩무늬의'
  ];
  
  const animals = [
    '코끼리', '토끼', '여우', '사자', '호랑이',
    '펭귄', '기린', '햄스터', '판다', '코알라',
    '다람쥐', '고양이', '강아지', '부엉이', '독수리'
  ];
  
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const animal = animals[Math.floor(Math.random() * animals.length)];
  
  return `${adj} ${animal}`;
}

// Google Apps Script 웹 앱 URL (여기에 본인의 URL을 입력하세요)
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz6WvpI3YReNTkVFwHJPyCbbnGffeB2U-T5BDOIUmNXxGgLyZ3XWZB4hjawMa8c5Ash/exec';

// Google Sheets로 데이터 전송
async function sendToGoogleSheets(data) {
  // URL이 설정되지 않았으면 전송하지 않음
  if (GOOGLE_SCRIPT_URL === 'YOUR_GOOGLE_SCRIPT_WEB_APP_URL_HERE') {
    console.log('Google Sheets URL이 설정되지 않았습니다.');
    return false;
  }
  
  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      redirect: 'follow',
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: JSON.stringify(data)
    });
    
    console.log('데이터가 Google Sheets에 저장되었습니다.');
    return true;
  } catch (error) {
    console.error('Google Sheets 저장 오류:', error);
    // 오류가 발생해도 사용자 경험을 방해하지 않음
    return false;
  }
}

// 페이지 전환 기능
function showPage(pageId) {
  // 모든 페이지 숨기기
  const pages = document.querySelectorAll('.page');
  pages.forEach(page => page.classList.remove('active'));
  
  // 선택된 페이지 보이기
  const targetPage = document.getElementById(pageId);
  if (targetPage) {
    targetPage.classList.add('active');
  }
  
  // 이전 버튼 표시/숨김
  const prevBtn = document.getElementById('prevBtn');
  if (pageId === 'page1') {
    prevBtn.style.display = 'none';
  } else {
    prevBtn.style.display = 'block';
  }
  
  // 현재 페이지 업데이트
  currentPage = parseInt(pageId.replace('page', ''));
}

// 이전 페이지로 이동
function goToPreviousPage() {
  if (currentPage > 1) {
    const prevPageId = `page${currentPage - 1}`;
    showPage(prevPageId);
  }
}

// 메시지 훼손 함수 (___ 형태로 변경)
function damageMessage(text) {
  const words = text.split(' ');
  const damagedWords = words.map((word, index) => {
    // 랜덤하게 일부 단어를 ___로 대체
    if (Math.random() < 0.3 && word.length > 1) {
      return '___';
    }
    return word;
  });
  return damagedWords.join(' ');
}

// 출력 함수 (바로 출력)
async function autoPrint() {
  const messageText = document.getElementById('messageText').value;
  const senderName = document.getElementById('displaySenderName').textContent;
  const receiverName = document.getElementById('displayReceiverName').textContent;
  const senderPhone = document.getElementById('senderPhone').value;
  const receiverPhone = document.getElementById('receiverPhone').value;
  
  if (!messageText.trim()) {
    alert('메시지를 입력해주세요.');
    return;
  }
  
  // 훼손된 메시지 생성
  const damagedMessage = damageMessage(messageText);
  
  // 익명 닉네임 생성
  const anonymousSender = generateAnonymousName();
  const anonymousReceiver = generateAnonymousName();
  
  // 아카이브용 데이터 (익명화, 훼손된 메시지만)
  const archiveData = {
    id: Date.now(),
    anonymousSender: anonymousSender,
    anonymousReceiver: anonymousReceiver,
    damagedMessage: damagedMessage,
    timestamp: new Date().toLocaleString('ko-KR')
  };
  
  // Google Sheets용 데이터 (실제 정보, 원본+훼손본)
  const sheetsData = {
    senderName: senderName,
    senderPhone: senderPhone,
    receiverName: receiverName,
    receiverPhone: receiverPhone,
    originalMessage: messageText,
    damagedMessage: damagedMessage
  };
  
  // 아카이브에 익명 데이터 저장
  messageArchive.push(archiveData);
  localStorage.setItem('messageArchive', JSON.stringify(messageArchive));
  
  // Google Sheets로 실제 데이터 전송 (한 번만)
  await sendToGoogleSheets(sheetsData);
  
  // 출력용 영역에 정보 표시
  document.getElementById('printSenderName').textContent = senderName;
  document.getElementById('printReceiverName').textContent = receiverName;
  document.getElementById('printMessageContent').textContent = damagedMessage;
  
  // 출력 후 처리 (alert는 한 번만 표시)
  let alertShown = false;
  
  const showAlertAndNavigate = function() {
    if (!alertShown) {
      alertShown = true;
      alert('메시지가 훼손되었습니다! 펜을 이용하여 훼손된 메시지를 복구해주세요');
      showPage('page4');
    }
  };
  
  // afterprint 이벤트 리스너 (Chrome, Firefox)
  const afterPrintHandler = function() {
    showAlertAndNavigate();
    window.removeEventListener('afterprint', afterPrintHandler);
  };
  window.addEventListener('afterprint', afterPrintHandler);
  
  // matchMedia를 사용한 대체 방법 (Safari)
  if (window.matchMedia) {
    const mediaQueryList = window.matchMedia('print');
    const mediaHandler = function(mql) {
      if (!mql.matches) {
        setTimeout(() => {
          showAlertAndNavigate();
          mediaQueryList.removeListener(mediaHandler);
        }, 100);
      }
    };
    mediaQueryList.addListener(mediaHandler);
  }
  
  // 바로 프린터 출력
  window.print();
  
  // 타임아웃 폴백 (3초 후)
  setTimeout(() => {
    if (document.querySelector('#page3.active')) {
      showAlertAndNavigate();
    }
  }, 3000);
}

// 아카이브 업데이트 (쪽지 쌓기 효과)
function updateArchive() {
  const messageCount = document.getElementById('messageCount');
  const messageArchiveDiv = document.getElementById('messageArchive');
  const overlay = document.getElementById('archiveOverlay');
  
  if (messageCount) {
    messageCount.textContent = messageArchive.length;
  }
  
  if (messageArchiveDiv) {
    messageArchiveDiv.innerHTML = '';
    
    // wrapper 생성
    const wrapper = document.createElement('div');
    wrapper.className = 'message-archive-wrapper';
    
    // 무채색 배경 배열
    const backgrounds = [
      '#f5f5f5',
      '#e8e8e8',
      '#ffffff',
      '#ebebeb',
      '#f0f0f0',
      '#e5e5e5',
      '#fafafa',
      '#ededed',
    ];
    
    messageArchive.forEach((message, index) => {
      const messageItem = document.createElement('div');
      messageItem.className = 'message-item';
      
      // 랜덤 회전 효과
      const rotation = (Math.random() - 0.5) * 4; // -2도 ~ 2도 랜덤 회전
      
      messageItem.style.transform = `rotate(${rotation}deg)`;
      messageItem.style.background = backgrounds[index % backgrounds.length];
      messageItem.style.borderColor = '#ccc';
      
      messageItem.innerHTML = `
        <div class="message-item-header">
          <div>
            <span class="message-sender">${message.anonymousSender}</span>
          </div>
          <span style="color: #999;">→</span>
          <div>
            <span class="message-receiver">${message.anonymousReceiver}</span>
          </div>
        </div>
        <div class="message-content">
          <div class="message-damaged">${message.damagedMessage}</div>
        </div>
        <div class="message-timestamp">${message.timestamp}</div>
      `;
      
      // 클릭 이벤트: 쪽지 펼치기 (오버레이 없이)
      messageItem.addEventListener('click', function(e) {
        e.stopPropagation();
        
        // 이미 펼쳐진 쪽지가 있으면 닫기
        const expanded = document.querySelector('.message-item.expanded');
        if (expanded && expanded !== messageItem) {
          expanded.classList.remove('expanded');
        }
        
        // 현재 쪽지 펼치기/닫기
        messageItem.classList.toggle('expanded');
      });
      
      wrapper.appendChild(messageItem);
    });
    
    messageArchiveDiv.appendChild(wrapper);
    
    // 첫 번째 쪽지를 중앙에 배치
    setTimeout(() => {
      const firstItem = wrapper.querySelector('.message-item');
      if (firstItem) {
        const scrollLeft = firstItem.offsetLeft - (messageArchiveDiv.offsetWidth / 2) + (firstItem.offsetWidth / 2);
        messageArchiveDiv.scrollLeft = scrollLeft;
      }
    }, 100);
    
    // 마우스 호버로 자동 스크롤
    if (messageArchiveDiv) {
      let isScrolling = false;
      let scrollSpeed = 0;
      
      messageArchiveDiv.addEventListener('mousemove', function(e) {
        const rect = messageArchiveDiv.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const width = rect.width;
        const edgeThreshold = 150; // 가장자리 감지 범위
        
        // 왼쪽 가장자리
        if (x < edgeThreshold) {
          scrollSpeed = -((edgeThreshold - x) / edgeThreshold) * 5;
          if (!isScrolling) startScrolling();
        }
        // 오른쪽 가장자리
        else if (x > width - edgeThreshold) {
          scrollSpeed = ((x - (width - edgeThreshold)) / edgeThreshold) * 5;
          if (!isScrolling) startScrolling();
        }
        // 중앙
        else {
          scrollSpeed = 0;
          isScrolling = false;
        }
      });
      
      messageArchiveDiv.addEventListener('mouseleave', function() {
        scrollSpeed = 0;
        isScrolling = false;
      });
      
      function startScrolling() {
        if (isScrolling) return;
        isScrolling = true;
        
        function scroll() {
          if (!isScrolling || scrollSpeed === 0) {
            isScrolling = false;
            return;
          }
          messageArchiveDiv.scrollLeft += scrollSpeed;
          requestAnimationFrame(scroll);
        }
        scroll();
      }
    }
  }
}

// 리셋 기능
function resetToBeginning() {
  // 모든 폼 초기화
  document.getElementById('userInfoForm').reset();
  document.getElementById('messageText').value = '';
  document.getElementById('charCount').textContent = '0';
  
  // 첫 번째 페이지로 이동
  showPage('page1');
}

// 아카이브 전체 삭제 함수
function clearAllArchive() {
  if (confirm('정말로 모든 아카이브 데이터를 삭제하시겠습니까?')) {
    messageArchive = [];
    localStorage.setItem('messageArchive', JSON.stringify(messageArchive));
    updateArchive();
    alert('모든 아카이브가 삭제되었습니다.');
  }
}

// DOM 로드 완료 시 이벤트 리스너 등록
document.addEventListener('DOMContentLoaded', function() {
  // 이전 버튼 클릭 이벤트
  const prevBtn = document.getElementById('prevBtn');
  if (prevBtn) {
    prevBtn.addEventListener('click', goToPreviousPage);
  }

  // 첫 번째 페이지에서 클릭 가능한 텍스트 클릭 이벤트
  const clickableText = document.querySelector('.clickable-text');
  if (clickableText) {
    clickableText.addEventListener('click', function() {
      showPage('page2');
    });
  }

  // 두 번째 페이지 폼 제출 이벤트
  const userInfoForm = document.getElementById('userInfoForm');
  if (userInfoForm) {
    userInfoForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // 폼 데이터 수집
      const formData = new FormData(userInfoForm);
      const senderName = formData.get('senderName');
      const receiverName = formData.get('receiverName');
      
      // 세 번째 페이지에 정보 표시
      document.getElementById('displaySenderName').textContent = senderName;
      document.getElementById('displayReceiverName').textContent = receiverName;
      
      // 세 번째 페이지로 이동
      showPage('page3');
    });
  }

  // 세 번째 페이지 메시지 글자 수 카운터
  const messageText = document.getElementById('messageText');
  const charCount = document.getElementById('charCount');
  
  if (messageText && charCount) {
    messageText.addEventListener('input', function() {
      const currentLength = this.value.length;
      charCount.textContent = currentLength;
      
      // 50자에 가까워지면 색상 변경
      if (currentLength >= 45) {
        charCount.style.color = '#ff6b6b';
      } else if (currentLength >= 40) {
        charCount.style.color = '#ffa726';
      } else {
        charCount.style.color = '#666';
      }
    });
  }

  // 3페이지 메시지 전송하기 버튼 클릭 이벤트 (바로 출력)
  const printBtn = document.getElementById('printBtn');
  if (printBtn) {
    printBtn.addEventListener('click', autoPrint);
  }

  // 수거완료 버튼 클릭 이벤트
  const collectBtn = document.getElementById('collectBtn');
  if (collectBtn) {
    collectBtn.addEventListener('click', function() {
      showPage('page5');
      updateArchive();
    });
  }

  // 아카이브에서 다음 버튼 클릭 이벤트
  const nextFromArchiveBtn = document.getElementById('nextFromArchiveBtn');
  if (nextFromArchiveBtn) {
    nextFromArchiveBtn.addEventListener('click', function() {
      showPage('page6');
    });
  }

  // 여섯 번째 페이지에서 다음 버튼 클릭 이벤트
  const finalNextBtn = document.getElementById('finalNextBtn');
  if (finalNextBtn) {
    finalNextBtn.addEventListener('click', function() {
      showPage('page7');
    });
  }

  // 리셋 버튼 클릭 이벤트
  const resetBtn = document.getElementById('resetBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', resetToBeginning);
  }

  // 페이지 로드 시 아카이브 업데이트
  updateArchive();
});