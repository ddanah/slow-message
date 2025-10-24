// 전역 변수
let currentPage = 1;
let messageArchive = JSON.parse(localStorage.getItem('messageArchive')) || [];
let originalMessage = ''; // 원본 메시지 저장
let damagedMessage = ''; // 훼손된 메시지 저장

// 현재 날짜와 시간 표시 함수 (한국식 편지 형식)
function updateDateTime() {
  const now = new Date();
  
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  
  // 한국식 편지 형식: "2025년 10월 24일 오후 3시 45분"
  const period = hours < 12 ? '오전' : '오후';
  const displayHours = hours % 12 || 12;
  
  const dateTimeString = `${year}년 ${month}월 ${day}일 ${period} ${displayHours}시 ${minutes}분`;
  
  const dateTimeElements = document.querySelectorAll('#currentDateTime');
  dateTimeElements.forEach(element => {
    element.textContent = dateTimeString;
  });
}

// 폼 데이터 저장 함수
function saveFormData() {
  const senderName = document.getElementById('senderName').value;
  const senderPhone = document.getElementById('senderPhone').value;
  const receiverName = document.getElementById('receiverName').value;
  const receiverPhone = document.getElementById('receiverPhone').value;
  
  const formData = {
    senderName: senderName,
    senderPhone: senderPhone,
    receiverName: receiverName,
    receiverPhone: receiverPhone
  };
  
  localStorage.setItem('messageFormData', JSON.stringify(formData));
  console.log('폼 데이터 저장됨:', formData);
}

// 저장된 폼 데이터 로드 함수
function loadFormData() {
  const savedData = localStorage.getItem('messageFormData');
  if (savedData) {
    const formData = JSON.parse(savedData);
    return formData;
  }
  return null;
}

// 메시지 훼손 함수 (랜덤하게 일부 글자를 밑줄로 대체)
function damageMessage(message) {
  if (!message || message.length === 0) return message;
  
  const messageArray = message.split('');
  
  // 공백과 줄바꿈이 아닌 글자들의 인덱스만 수집
  const validIndices = [];
  messageArray.forEach((char, index) => {
    if (char !== ' ' && char !== '\n' && char !== '\r') {
      validIndices.push(index);
    }
  });
  
  // 유효한 글자의 30%를 훼손 (최소 3글자)
  const damageCount = Math.max(3, Math.floor(validIndices.length * 0.3));
  const damagedIndices = new Set();
  
  // 랜덤하게 훼손할 위치 선택
  while (damagedIndices.size < damageCount && damagedIndices.size < validIndices.length) {
    const randomIdx = Math.floor(Math.random() * validIndices.length);
    damagedIndices.add(validIndices[randomIdx]);
  }
  
  // 선택된 위치의 글자를 밑줄로 대체
  damagedIndices.forEach(index => {
    messageArray[index] = '_';
  });
  
  console.log(`메시지 훼손: 전체 ${validIndices.length}글자 중 ${damagedIndices.size}글자 훼손`);
  
  return messageArray.join('');
}

// 발신자/수신자 정보 표시 함수
function displayContactInfo() {
  const formData = loadFormData();
  if (formData) {
    console.log('저장된 폼 데이터:', formData);
    
    // 발신자 정보 표시 (3페이지)
    const displaySenderName = document.getElementById('displaySenderName');
    const displaySenderPhone = document.getElementById('displaySenderPhone');
    if (displaySenderName) {
      displaySenderName.textContent = formData.senderName;
      console.log('발신자 이름 표시:', formData.senderName);
    }
    if (displaySenderPhone) {
      displaySenderPhone.textContent = formData.senderPhone;
      console.log('발신자 전화번호 표시:', formData.senderPhone);
    }
    
    // 수신자 정보 표시 (3페이지)
    const displayReceiverName = document.getElementById('displayReceiverName');
    const displayReceiverPhone = document.getElementById('displayReceiverPhone');
    if (displayReceiverName) {
      displayReceiverName.textContent = formData.receiverName;
      console.log('수신자 이름 표시:', formData.receiverName);
    }
    if (displayReceiverPhone) {
      displayReceiverPhone.textContent = formData.receiverPhone;
      console.log('수신자 전화번호 표시:', formData.receiverPhone);
    }
    
    // 4페이지 발신자/수신자 정보 표시
    const displaySenderName4 = document.getElementById('displaySenderName4');
    const displaySenderPhone4 = document.getElementById('displaySenderPhone4');
    const displayReceiverName4 = document.getElementById('displayReceiverName4');
    const displayReceiverPhone4 = document.getElementById('displayReceiverPhone4');
    
    if (displaySenderName4) displaySenderName4.textContent = formData.senderName;
    if (displaySenderPhone4) displaySenderPhone4.textContent = formData.senderPhone;
    if (displayReceiverName4) displayReceiverName4.textContent = formData.receiverName;
    if (displayReceiverPhone4) displayReceiverPhone4.textContent = formData.receiverPhone;
    
    // 메시지 표시 (훼손된 메시지가 있으면 그대로 유지)
    const displayMessageText = document.getElementById('displayMessageText');
    const messageText = document.getElementById('messageText');
    if (displayMessageText && messageText) {
      // 이미 훼손된 메시지가 설정되어 있지 않은 경우에만 원본 표시
      if (!damagedMessage || displayMessageText.textContent === '') {
        displayMessageText.textContent = messageText.value;
      }
    }
    
    // 발신자 정보 표시 (다른 페이지)
    const senderInfo = document.querySelector('.sender-info');
    if (senderInfo) {
      senderInfo.innerHTML = `
        <div class="sender-label">발신자</div>
        <div class="contact-display">${formData.senderName}</div>
        <div class="contact-display">${formData.senderPhone}</div>
      `;
    }
    
    // 수신자 정보 표시 (다른 페이지)
    const receiverInfo = document.querySelector('.receiver-info');
    if (receiverInfo) {
      receiverInfo.innerHTML = `
        <div class="receiver-label">수신자</div>
        <div class="contact-display">${formData.receiverName}</div>
        <div class="contact-display">${formData.receiverPhone}</div>
      `;
    }
  } else {
    console.log('저장된 폼 데이터가 없습니다.');
  }
}

// 진행 절차 업데이트 함수
function updateProgress() {
  const progressSteps = document.querySelectorAll('.progress-step');
  progressSteps.forEach(step => {
    const stepNumber = parseInt(step.getAttribute('data-step'));
    step.classList.remove('active', 'completed');
    
    if (stepNumber === currentPage) {
      step.classList.add('active');
    } else if (stepNumber < currentPage) {
      step.classList.add('completed');
    }
  });
}

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
  
  
  // 현재 페이지 업데이트
  currentPage = parseInt(pageId.replace('page', ''));
  
  // 날짜/시간 업데이트
  updateDateTime();
  
  // 3페이지 이상에서는 연락처 정보 표시
  if (currentPage >= 3) {
    displayContactInfo();
  }
  
  // page2로 이동할 때 개인정보 포스트잇 다시 표시
  if (currentPage === 2) {
    const privacyPostitContainer = document.getElementById('privacyPostitContainer');
    const formContent = document.getElementById('formContent');
    if (privacyPostitContainer && formContent) {
      privacyPostitContainer.style.display = 'block';
      formContent.style.display = 'none';
    }
  }
  
  // 진행 절차 업데이트
  updateProgress();
}

// 이전 페이지로 이동
function goToPreviousPage() {
  if (currentPage > 1) {
    const prevPageId = `page${currentPage - 1}`;
    showPage(prevPageId);
  }
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
      showPage('page5');
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

// 메시지를 아카이브에 저장하는 함수
async function saveToArchive() {
  const formData = loadFormData();
  
  if (formData && damagedMessage && originalMessage) {
    const newMessage = {
      senderName: formData.senderName,
      senderPhone: formData.senderPhone,
      receiverName: formData.receiverName,
      receiverPhone: formData.receiverPhone,
      message: damagedMessage, // 훼손된 메시지 저장
      timestamp: new Date().toISOString()
    };
    
    // 아카이브에 추가
    messageArchive.push(newMessage);
    
    // localStorage에 저장
    localStorage.setItem('messageArchive', JSON.stringify(messageArchive));
    
    console.log('훼손된 메시지가 아카이브에 저장되었습니다:', newMessage);
    
    // Google Sheets로 데이터 전송 (발신인/수신인 정보, 원본 메시지, 훼손된 메시지)
    const sheetsData = {
      senderName: formData.senderName,
      senderPhone: formData.senderPhone,
      receiverName: formData.receiverName,
      receiverPhone: formData.receiverPhone,
      originalMessage: originalMessage, // 원본 메시지
      damagedMessage: damagedMessage, // 훼손된 메시지
      timestamp: new Date().toISOString()
    };
    
    try {
      await sendToGoogleSheets(sheetsData);
      console.log('Google Sheets에 데이터 전송 완료');
    } catch (error) {
      console.error('Google Sheets 전송 실패:', error);
    }
    
    // 아카이브 화면 업데이트
    updateArchive();
    
    // 저장 후 훼손된 메시지 초기화 (중복 저장 방지)
    damagedMessage = '';
    originalMessage = '';
  }
}

// 아카이브 업데이트 (포스트잇 형태)
function updateArchive() {
  const messageCount = document.getElementById('messageCount');
  const messageArchiveDiv = document.getElementById('messageArchive');
  
  if (messageCount) {
    messageCount.textContent = messageArchive.length;
  }
  
  if (messageArchiveDiv) {
    messageArchiveDiv.innerHTML = '';
    
    // 포스트잇 색상 배열 (그레이 스케일 기반)
    const colors = [
      '#007BFF', // 기본
      '#1a8cff', // 밝은 1
      '#0066cc', // 어두운 1
      '#3399ff', // 밝은 2
      '#0052a3', // 어두운 2
      '#4da6ff', // 밝은 3
      '#004080', // 어두운 3
      '#66b3ff', // 밝은 4
    ];
    
    // 최근 메시지가 위에 오도록 역순으로 처리 (낮은 인덱스 = 낮은 z-index)
    messageArchive.forEach((message, index) => {
      const note = document.createElement('div');
      note.className = 'archive-note';
      
      // 무작위 위치 설정 (오른쪽 섹션 내부)
      const randomTop = Math.random() * 60 + 5; // 5% ~ 65%
      const randomLeft = Math.random() * 70 + 5; // 5% ~ 75%
      
      // 랜덤 회전 효과
      const rotation = (Math.random() - 0.5) * 10; // -5도 ~ 5도
      
      // z-index: 최근 것일수록 높게 (배열의 뒤쪽이 최근)
      const zIndex = index + 1;
      
      note.style.top = `${randomTop}%`;
      note.style.left = `${randomLeft}%`;
      note.style.transform = `rotate(${rotation}deg)`;
      note.style.backgroundColor = colors[index % colors.length];
      note.style.zIndex = zIndex;
      
      // 익명화된 발신자/수신자 정보 (이름의 첫 글자만 표시)
      const anonymousSender = message.senderName && message.senderName.length > 0 
        ? message.senderName.charAt(0) + '*'.repeat(message.senderName.length - 1) 
        : '익명';
      const anonymousReceiver = message.receiverName && message.receiverName.length > 0
        ? message.receiverName.charAt(0) + '*'.repeat(message.receiverName.length - 1) 
        : '익명';
      
      // 타임스탬프 포맷팅
      const timestamp = new Date(message.timestamp).toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
      
      // 메시지 미리보기 (30자까지만)
      const messageText = message.message || '';
      const messagePreview = messageText.length > 30 ? messageText.substring(0, 30) + '...' : messageText;
      
      note.innerHTML = `
        <div class="archive-note-close">×</div>
        <div class="archive-note-header">
          ${anonymousSender} → ${anonymousReceiver}
        </div>
        <div class="archive-note-content">
          ${messagePreview}
        </div>
        <div class="archive-note-time">${timestamp}</div>
      `;
      
      // X 버튼 클릭 이벤트
      const closeBtn = note.querySelector('.archive-note-close');
      closeBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        note.style.display = 'none';
      });
      
      messageArchiveDiv.appendChild(note);
    });
  }
}

// 리셋 기능
function resetToBeginning() {
  // 모든 폼 초기화
  const userInfoForm = document.getElementById('userInfoForm');
  if (userInfoForm) {
    userInfoForm.reset();
  }
  
  const messageText = document.getElementById('messageText');
  if (messageText) {
    messageText.value = '';
  }
  
  const charCount = document.getElementById('charCount');
  if (charCount) {
    charCount.textContent = '0';
  }
  
  // localStorage에서 저장된 폼 데이터 삭제
  localStorage.removeItem('messageFormData');
  
  // 페이지 3, 4에 표시된 정보 초기화
  const displayFields = [
    'displaySenderName',
    'displaySenderPhone',
    'displayReceiverName',
    'displayReceiverPhone'
  ];
  
  displayFields.forEach(fieldId => {
    const field = document.getElementById(fieldId);
    if (field) {
      field.textContent = '';
    }
  });
  
  // 메시지 표시 영역 초기화
  const messageDisplay = document.getElementById('messageDisplay');
  if (messageDisplay) {
    messageDisplay.textContent = '';
  }
  
  // 프린트 상태 초기화
  isPrinted = false;
  const sendMessageBtn = document.getElementById('sendMessageBtn');
  if (sendMessageBtn) {
    sendMessageBtn.textContent = '메세지 전송하기';
  }
  
  // 개인정보 동의 포스트잇 다시 표시 (page2)
  const privacyPostitContainer = document.getElementById('privacyPostitContainer');
  if (privacyPostitContainer) {
    privacyPostitContainer.style.display = 'flex';
  }
  
  const formContent = document.getElementById('formContent');
  if (formContent) {
    formContent.style.display = 'none';
  }
  
  // 메인 포스트잇 다시 표시 (page1)
  const postitContainer = document.getElementById('postitContainer');
  const postitPlaceholder = document.getElementById('postitPlaceholder');
  if (postitContainer) {
    postitContainer.style.display = 'flex';
  }
  if (postitPlaceholder) {
    postitPlaceholder.style.display = 'none';
  }
  
  // 첫 번째 페이지(메인 페이지)로 이동
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



  // 리셋 버튼 클릭 이벤트
  const resetBtn = document.getElementById('resetBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', resetToBeginning);
  }

  // 페이지 로드 시 아카이브 업데이트
  updateArchive();
  
  // 페이지 로드 시 날짜시간 업데이트 및 1초마다 갱신
  updateDateTime();
  setInterval(updateDateTime, 1000);
  
  // 첫 번째 포스트잇 X 버튼 클릭 이벤트
  const postitClose = document.getElementById('postitClose');
  const postitContainer = document.getElementById('postitContainer');
  const postitPlaceholder = document.getElementById('postitPlaceholder');
  
  if (postitClose && postitContainer && postitPlaceholder) {
    postitClose.addEventListener('click', function() {
      postitContainer.style.display = 'none';
      postitPlaceholder.style.display = 'block';
    });
  }
  
  // 두 번째 포스트잇 X 버튼 클릭 이벤트
  const postitClose2 = document.getElementById('postitClose2');
  const postitContainer2 = document.getElementById('postitContainer2');
  
  if (postitClose2 && postitContainer2) {
    postitClose2.addEventListener('click', function() {
      postitContainer2.style.display = 'none';
    });
  }
  
  // 포스트잇 붙이기 클릭 이벤트
  const postitPlaceholderText = postitPlaceholder?.querySelector('.clickable-text');
  if (postitPlaceholderText) {
    postitPlaceholderText.addEventListener('click', function() {
      postitContainer.style.display = 'block';
      postitPlaceholder.style.display = 'none';
    });
  }
  
  // Back 버튼 클릭 이벤트 (상단) - 이전 페이지로
  const topBackButtons = document.querySelectorAll('.top-right-container .back-button');
  topBackButtons.forEach(button => {
    button.addEventListener('click', function() {
      if (currentPage > 1) {
        const prevPageId = `page${currentPage - 1}`;
        showPage(prevPageId);
      }
    });
  });
  
  // Next 버튼 클릭 이벤트 (하단) - 다음 페이지로
  const bottomNextButtons = document.querySelectorAll('.bottom-right-container .back-button');
  bottomNextButtons.forEach(button => {
    // resetBtn은 제외
    if (button.id === 'resetBtn') return;
    
    button.addEventListener('click', function() {
      if (currentPage === 2) {
        // 두 번째 페이지에서 폼 정보 저장
        saveFormData();
      }
      if (currentPage < 8) {
        const nextPageId = `page${currentPage + 1}`;
        showPage(nextPageId);
      }
    });
  });
  
  // 개인정보 동의 X 버튼 클릭 이벤트
  const privacyCloseBtn = document.querySelector('.privacy-postit-close');
  if (privacyCloseBtn) {
    privacyCloseBtn.addEventListener('click', function() {
      const privacyPostitContainer = document.getElementById('privacyPostitContainer');
      const formContent = document.getElementById('formContent');
      
      if (privacyPostitContainer && formContent) {
        privacyPostitContainer.style.display = 'none';
        formContent.style.display = 'block';
      }
    });
  }
  
  // 안내 포스트잇 닫기 이벤트
  const noticeCloseButtons = document.querySelectorAll('.notice-postit-close');
  noticeCloseButtons.forEach(button => {
    button.addEventListener('click', function() {
      const postit = this.closest('.notice-postit-container');
      if (postit) {
        postit.style.display = 'none';
      }
    });
  });
  
  // 메세지 전송하기 버튼 클릭 이벤트
  const sendMessageBtn = document.getElementById('sendMessageBtn');
  if (sendMessageBtn) {
    let isPrinted = false;
    let isArchived = false; // 아카이브 저장 여부 플래그
    
    sendMessageBtn.addEventListener('click', function() {
      if (!isPrinted) {
        // 원본 메시지 저장
        const messageTextarea = document.getElementById('messageText');
        originalMessage = messageTextarea.value;
        
        // 메시지 훼손
        damagedMessage = damageMessage(originalMessage);
        
        console.log('원본 메시지:', originalMessage);
        console.log('훼손된 메시지:', damagedMessage);
        
        // 프린트용 메시지 표시 영역에 훼손된 메시지 설정
        const displayMessageText = document.getElementById('displayMessageText');
        if (displayMessageText) {
          displayMessageText.textContent = damagedMessage;
        }
        
        // 약간의 지연 후 프린트 (DOM 업데이트 대기)
        setTimeout(function() {
          // 첫 클릭: 출력
          window.print();
        }, 100);
        
        // 출력 후 원본 메시지로 복구 및 아카이브에 저장
        window.addEventListener('afterprint', function() {
          if (!isArchived) {
            if (displayMessageText) {
              displayMessageText.textContent = originalMessage;
            }
            sendMessageBtn.textContent = 'Next';
            isPrinted = true;
            
            // 메시지를 아카이브에 저장 (한 번만)
            saveToArchive();
            isArchived = true;
          }
        }, { once: true });
        
        // Safari 지원
        const mediaQueryList = window.matchMedia('print');
        mediaQueryList.addListener(function(mql) {
          if (!mql.matches && !isArchived) {
            if (displayMessageText) {
              displayMessageText.textContent = originalMessage;
            }
            sendMessageBtn.textContent = 'Next';
            isPrinted = true;
            
            // 메시지를 아카이브에 저장 (한 번만)
            saveToArchive();
            isArchived = true;
          }
        });
        
        // fallback: 일정 시간 후 자동으로 변경
        setTimeout(function() {
          if (!isPrinted && !isArchived) {
            if (displayMessageText) {
              displayMessageText.textContent = originalMessage;
            }
            sendMessageBtn.textContent = 'Next';
            isPrinted = true;
            
            // 메시지를 아카이브에 저장 (한 번만)
            saveToArchive();
            isArchived = true;
          }
        }, 2000);
      } else {
        // 두 번째 클릭: 다음 페이지로 이동
        showPage('page5');
      }
    });
  }
});