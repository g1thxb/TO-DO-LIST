// habit.js

// ===============================================
// 로컬 스토리지 데이터 관리
// ===============================================
function getHabits() {
    return JSON.parse(localStorage.getItem('habits')) || [];
}

function saveHabits(habits) {
    localStorage.setItem('habits', JSON.stringify(habits));
}

// YYYY-MM-DD 형식으로 날짜 키를 반환
function getDateKey(date) {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}

// ===============================================
// 📈 습관 관리 페이지 (메인 기능)
// ===============================================

/**
 * 습관 목록 페이지를 초기화하고 렌더링합니다. (추가/삭제)
 */
export function initHabitPage() {
    const input = document.getElementById('habitInput');
    const addBtn = document.getElementById('addHabit');
    const list = document.getElementById('habitList');

    if (!list) return;

    let habits = getHabits();

    function renderHabitList() {
        list.innerHTML = '';
        
        habits.forEach((habit, index) => {
            const li = document.createElement('li');
            li.className = 'habit-item';
            
            const textSpan = document.createElement('span');
            textSpan.textContent = habit.name;
            li.appendChild(textSpan);

            // 주간 체크리스트 (월요일부터 일요일까지)
            const checkContainer = document.createElement('div');
            checkContainer.className = 'habit-check-container';

            // 0=일, 1=월, ..., 6=토
            // UI는 월요일부터 시작하므로 인덱스 순서를 조정
            const daysOrder = [1, 2, 3, 4, 5, 6, 0]; // 월, 화, 수, 목, 금, 토, 일

            daysOrder.forEach(dayIndex => {
                const dayKey = ['월', '화', '수', '목', '금', '토', '일'][dayIndex];
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = `habit-${index}-${dayKey}`;
                
                // 습관 객체에 요일별 활성화 여부 저장 (기본값 true)
                if (habit.activeDays && habit.activeDays[dayIndex] === false) {
                    checkbox.checked = false;
                } else {
                    checkbox.checked = true;
                }
                
                // 체크박스 클릭 시 해당 요일 활성화/비활성화
                checkbox.addEventListener('change', () => {
                    if (!habit.activeDays) habit.activeDays = [true, true, true, true, true, true, true];
                    habit.activeDays[dayIndex] = checkbox.checked;
                    saveHabits(habits);
                    // 홈 화면 및 그래프 업데이트
                    renderHomeHabitList();
                    renderHabitGraph(); 
                });

                const label = document.createElement('label');
                label.setAttribute('for', `habit-${index}-${dayKey}`);
                label.textContent = dayKey;

                checkContainer.appendChild(checkbox);
                checkContainer.appendChild(label);
            });
            li.appendChild(checkContainer);

            // 삭제 버튼
            const delBtn = document.createElement('button');
            delBtn.textContent = '❌';
            delBtn.className = 'delete-habit-btn';
            delBtn.addEventListener('click', e => {
                e.stopPropagation();
                // 해당 인덱스 습관 제거
                habits.splice(index, 1);
                saveHabits(habits);
                renderHabitList(); 
                // 홈 화면 및 그래프 업데이트
                renderHomeHabitList();
                renderHabitGraph(); 
            });

            li.appendChild(delBtn);
            list.appendChild(li);
        });
    }

    // 습관 추가 기능
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            if (!input.value.trim()) return;

            // 새로운 습관 추가 (check: 날짜별 완료 기록, activeDays: 요일별 활성화 여부)
            habits.push({ 
                name: input.value.trim(), 
                check: {}, 
                activeDays: [true, true, true, true, true, true, true] 
            }); 
            
            input.value = '';
            saveHabits(habits);
            renderHabitList();
            
            // 홈 화면 및 그래프 업데이트
            renderHomeHabitList();
            renderHabitGraph(); 
        });
    }

    if (input) {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addBtn.click();
            }
        });
    }

    renderHabitList();
}


// ===============================================
// 🏠 홈 화면 - 습관 목록 (체크 기능)
// ===============================================

/**
 * 홈 화면에 오늘 해야 할 습관 목록을 렌더링하고 체크 기능을 부여합니다.
 */
export function renderHomeHabitList() {
    const list = document.getElementById('habitListHome'); 
    if (!list) return;

    let habits = getHabits();
    list.innerHTML = '';
    
    const today = new Date();
    const todayKey = getDateKey(today);
    const todayDayIndex = today.getDay(); // 0=일, 1=월, ...

    // 오늘 해야 할 활성화된 습관만 필터링
    const todayHabits = habits.filter(h => h.activeDays === undefined || h.activeDays[todayDayIndex] !== false);

    if (todayHabits.length === 0) {
        list.innerHTML = '<li class="empty-message">오늘 해야 할 습관이 없습니다!</li>';
        return;
    }

    todayHabits.forEach(habit => {
        const li = document.createElement('li');
        li.className = 'habit-home-item';
        
        // 오늘 완료 여부 확인
        const isDone = habit.check[todayKey] === true;
        if (isDone) li.classList.add('done');

        li.innerHTML = `
            <div class="habit-check-box"></div>
            <span class="habit-text">${habit.name}</span>
        `;
        
        li.addEventListener('click', () => {
            // 완료 상태 토글
            const newIsDone = !isDone;
            habit.check[todayKey] = newIsDone;
            
            saveHabits(habits); // 데이터 저장
            renderHomeHabitList(); // 홈 목록 새로고침
            renderHabitGraph(); // 그래프도 업데이트
        });
        
        list.appendChild(li);
    });
}

// ===============================================
// 🏠 홈 화면 - 습관 달성률 그래프
// ===============================================

/**
 * 홈 화면에 주간 습관 달성률 그래프를 렌더링합니다.
 */
export function renderHabitGraph() {
    const graphContainer = document.getElementById('habitGraph');
    if (!graphContainer) return;

    graphContainer.innerHTML = ''; 
    
    let habits = getHabits();
    
    // 그래프 표시를 위한 지난 7일 데이터 계산
    const weeklyData = calculateWeeklyHabitData(habits); // { 'YYYY-MM-DD': { total: N, completed: M } }
    
    // 주간 요일 레이블 (월-일)
    const daysLabel = ['월', '화', '수', '목', '금', '토', '일'];
    
    // 현재 날짜 기준의 주간 날짜 키 (월요일부터)
    const today = new Date();
    const currentDay = today.getDay(); // 0=일, 1=월, ...
    const startOffset = currentDay === 0 ? 6 : currentDay - 1; // 월요일(1)이 0 offset, 일요일(0)이 6 offset
    
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - startOffset); // 이번 주 월요일 날짜

    // 그래프 제목
    const title = document.createElement('h3');
    title.textContent = '주간 달성률';
    graphContainer.appendChild(title);

    // 바 그래프 컨테이너
    const barChart = document.createElement('div');
    barChart.className = 'habit-bar-chart';

    for (let i = 0; i < 7; i++) {
        const date = new Date(weekStart);
        date.setDate(weekStart.getDate() + i);
        const dateKey = getDateKey(date);
        
        const data = weeklyData[dateKey] || { total: 0, completed: 0 };
        const percentage = data.total > 0 ? (data.completed / data.total) * 100 : 0;
        
        const barGroup = document.createElement('div');
        barGroup.className = 'bar-group';
        
        // 바
        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.style.height = `${percentage}%`;
        //bar.setAttribute('data-label', `${Math.round(percentage)}%`);
        
        // 레이블 (요일)
        const label = document.createElement('div');
        label.className = 'bar-label';
        label.textContent = daysLabel[i];

        // 오늘 날짜 하이라이트
        if (dateKey === getDateKey(new Date())) {
            barGroup.classList.add('today-bar');
        }

        barGroup.appendChild(bar);
        barGroup.appendChild(label);
        barChart.appendChild(barGroup);
    }

    graphContainer.appendChild(barChart);
}

/**
 * 습관 데이터에서 지난 7일간의 총 습관 수와 완료된 습관 수를 계산합니다.
 */
function calculateWeeklyHabitData(habits) {
    const data = {};
    const today = new Date();
    
    // 주간 데이터 초기화 (지난 7일)
    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateKey = getDateKey(date);
        data[dateKey] = { total: 0, completed: 0, dayIndex: date.getDay() };
    }

    habits.forEach(habit => {
        for (const dateKey in data) {
            const dayIndex = data[dateKey].dayIndex; // 0=일, 1=월, ...
            
            // 1. 해당 습관이 그 날짜(요일)에 활성화되어 있는지 확인
            const isActiveToday = habit.activeDays === undefined || habit.activeDays[dayIndex] !== false;
            
            if (isActiveToday) {
                data[dateKey].total += 1; // 총 습관 수 증가
                
                // 2. 해당 날짜에 완료 기록이 있는지 확인
                if (habit.check[dateKey] === true) {
                    data[dateKey].completed += 1; // 완료 습관 수 증가
                }
            }
        }
    });
    
    // 결과를 날짜 키 순서대로 반환 (월요일부터 일요일까지 정렬은 renderHabitGraph에서 처리)
    return data; 
}