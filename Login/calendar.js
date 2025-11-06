// calendar.js 파일 내용 전체 (수정된 최종 버전)

// ===============================================
// 캘린더 공통 데이터 및 함수
// ===============================================

// ★ 투두 데이터 접근을 위한 함수 (todo.js에 정의된 save/get 로직과 일치해야 함)
function getCompletionData() {
    // 로컬 스토리지에서 'completionData' 키를 사용하여 데이터를 가져옵니다.
    return JSON.parse(localStorage.getItem('completionData')) || {};
}

// 임시 완료 데이터 대신, 실제 로컬 스토리지 데이터를 사용합니다.
// 이미지의 4가지 색상을 시뮬레이션
const iconColors = ['#9b59b6', '#3498db', '#f1c40f', '#2ecc71']; 

/**
 * 날짜 셀에 완료 아이콘을 렌더링하는 공통 함수
 */
function renderCompletionIcons(dateKey, cell) {
    // ★ 실제 로컬 스토리지의 데이터를 가져옵니다. ★
    const completionData = getCompletionData(); 
    const totalCompleted = completionData[dateKey] || 0;
    
    // 최대 4개의 아이콘만 표시
    for (let i = 0; i < Math.min(totalCompleted, 4); i++) {
        const icon = document.createElement('div');
        icon.className = 'completion-icon';
        
        icon.style.backgroundColor = iconColors[i % iconColors.length];
        
        icon.style.position = 'absolute';
        // 아이콘 위치 조정
        icon.style.left = `${8 + (i * 8)}px`; 
        icon.style.bottom = '8px';
        icon.style.zIndex = (4 - i); 

        cell.appendChild(icon);
    }
}

/**
 * 캘린더 렌더링을 위한 핵심 로직 (재사용 가능한 함수)
 */
let currentFullDate = new Date(); // 현재 캘린더가 보고 있는 날짜를 전역 변수로 관리

function createCalendar(displayId, datesId, prevBtnId, nextBtnId, isHome) {
    const monthYearDisplay = document.getElementById(displayId);
    const datesContainer = document.getElementById(datesId);
    const prevButton = document.getElementById(prevBtnId);
    const nextButton = document.getElementById(nextBtnId);

    if (!datesContainer || !monthYearDisplay) return;

    // 현재 캘린더가 보고 있는 날짜를 이 인스턴스에서 사용합니다.
    let currentDate = new Date(currentFullDate); 

    function renderCalendar() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth(); 
        
        monthYearDisplay.textContent = `${year}년 ${month + 1}월`;

        datesContainer.innerHTML = '';
        
        const firstDay = new Date(year, month, 1).getDay(); // 0 (일) - 6 (토)
        const lastDate = new Date(year, month + 1, 0).getDate(); 
        
        // 월요일(1)이 첫 번째 칸이 되도록 빈 칸 수 계산 
        let startDayIndex = (firstDay === 0) ? 6 : firstDay - 1; 

        // 이전 달의 날짜 채우기 (빈 칸)
        for (let i = 0; i < startDayIndex; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.classList.add('calendar-date-cell', 'empty');
            if (isHome) emptyCell.classList.add('home-cell');
            datesContainer.appendChild(emptyCell);
        }

        // 현재 달의 날짜 채우기
        for (let date = 1; date <= lastDate; date++) {
            const dateCell = document.createElement('div');
            dateCell.style.position = 'relative'; 
            dateCell.classList.add('calendar-date-cell');
            if (isHome) dateCell.classList.add('home-cell');

            const dateNum = document.createElement('span');
            dateNum.classList.add('date-number');
            dateNum.textContent = date;
            dateCell.appendChild(dateNum);

            // 오늘 날짜 하이라이트
            const today = new Date();
            if (year === today.getFullYear() && month === today.getMonth() && date === today.getDate()) {
                dateCell.classList.add('today');
            }

            // 완료 아이콘 렌더링
            const dateKey = `${year}-${month + 1}-${date}`;
            renderCompletionIcons(dateKey, dateCell);

            datesContainer.appendChild(dateCell);
        }
    }

    // 버튼 이벤트 리스너
    if (prevButton) {
        prevButton.addEventListener('click', () => {
            currentFullDate.setMonth(currentFullDate.getMonth() - 1); // 전역 변수 업데이트
            currentDate = new Date(currentFullDate); 
            renderCalendar();
        });
    }

    if (nextButton) {
        nextButton.addEventListener('click', () => {
            currentFullDate.setMonth(currentFullDate.getMonth() + 1); // 전역 변수 업데이트
            currentDate = new Date(currentFullDate);
            renderCalendar();
        });
    }

    // 초기 렌더링
    renderCalendar();
}

// ===============================================
// 캘린더 화면 호출 함수 (main.js에서 호출됨)
// ===============================================

// 캘린더 메뉴 클릭 시 호출
export function initCalendar() {
    createCalendar('currentMonthYear', 'calendarDates', 'prevMonth', 'nextMonth', false);
}

// 홈 메뉴 클릭 시 호출
export function initCalendarHome() {
    createCalendar('currentMonthYearHome', 'calendarDatesHome', 'prevMonthHome', 'nextMonthHome', true);
}

// ★ 투두 완료 시 캘린더를 새로고침하기 위해 외부(main.js/todo.js)로 노출 (export) ★
export function refreshCalendar() {
    // 캘린더가 렌더링되어 있는지 확인하고 다시 그립니다.
    // 캘린더 페이지가 열려있다면 새로고침
    if (document.getElementById('calendarDates')) {
        initCalendar();
    }
    // 홈 페이지가 열려있다면 새로고침
    if (document.getElementById('calendarDatesHome')) {
        initCalendarHome();
    }
}