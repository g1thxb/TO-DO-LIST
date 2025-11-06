// todo.js 파일 내용 전체 (투두 페이지에 날짜 선택 기능 추가)

// calendar.js의 refreshCalendar 함수를 가정하고 import
import { refreshCalendar } from './calendar.js';

// ===============================================
// 로컬 스토리지 데이터 관리 (공통)
// ===============================================
function getTodos() {
    return JSON.parse(localStorage.getItem('todos')) || [];
}

function saveTodos(todos) {
    localStorage.setItem('todos', JSON.stringify(todos));
}

function getCompletionData() {
    return JSON.parse(localStorage.getItem('completionData')) || {};
}

function saveCompletionData(data) {
    localStorage.setItem('completionData', JSON.stringify(data));
}

function recordCompletion(isDone, dateKey) {
    if (typeof refreshCalendar === 'undefined') return;

    const completionData = getCompletionData();
    
    if (isDone) {
        completionData[dateKey] = (completionData[dateKey] || 0) + 1; 
    } else {
        completionData[dateKey] = Math.max(0, (completionData[dateKey] || 0) - 1);
    }

    saveCompletionData(completionData);
    refreshCalendar(); 
}

// YYYY-M-D 형식으로 날짜 키를 반환
function getDateKey(date) {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0'); // 월 (2자리)
    const dd = String(date.getDate()).padStart(2, '0'); // 일 (2자리)
    return `${yyyy}-${mm}-${dd}`;
}

// ===============================================
// 📝 투두 페이지 (전체 기능: 날짜 선택 및 해당 날짜 투두 관리)
// ===============================================

export function initTodo() {
    const input = document.getElementById('todoInput');
    const addBtn = document.getElementById('addTodo');
    const list = document.getElementById('todoList');
    const dateInput = document.getElementById('todoDateInput'); // 새로운 날짜 입력 필드 ID

    if (!list || !dateInput) return;

    let todos = getTodos();
    
    // 1. 초기 날짜 설정: 오늘 날짜로 기본 설정
    const today = new Date();
    dateInput.value = getDateKey(today);

    let selectedDateKey = dateInput.value; 

    // 2. 투두 목록 렌더링 함수 (선택된 날짜 기준으로 필터링)
    function renderTodos() {
        // 현재 선택된 날짜의 투두만 필터링
        const filteredTodos = todos.filter(todo => todo.date === selectedDateKey);
        
        list.innerHTML = '';
        
        if (filteredTodos.length === 0) {
            list.innerHTML = `<li class="empty-message">${selectedDateKey}에 등록된 할 일이 없습니다.</li>`;
        }

        filteredTodos.forEach((todo, i) => {
            const li = document.createElement('li');
            li.className = 'todo-item';
            if (todo.done) li.classList.add('done');

            li.innerHTML = `
                <div style="display: flex; align-items: center; flex-grow: 1;">
                    <div class="todo-checkbox"></div>
                    <span class="todo-text">${todo.text}</span> 
                </div>
            `;
            
            // 실제 데이터에서 해당 항목의 원본 인덱스를 찾기
            const originalIndex = todos.findIndex(t => t.text === todo.text && t.date === todo.date);

            // 완료/토글 기능
            li.addEventListener('click', () => {
                if (originalIndex === -1) return;
                
                const wasDone = todos[originalIndex].done;
                todos[originalIndex].done = !wasDone; 

                recordCompletion(!wasDone, todos[originalIndex].date);
                
                saveTodos(todos);
                renderTodos();
                
                if (typeof renderHomeTodoListOnly === 'function') {
                    renderHomeTodoListOnly(); // 홈 화면 업데이트
                }
            });

            // 삭제 버튼 생성
            const delBtn = document.createElement('button');
            delBtn.textContent = '❌';
            delBtn.addEventListener('click', e => {
                e.stopPropagation();
                if (originalIndex === -1) return;

                if(todos[originalIndex].done) {
                    recordCompletion(false, todos[originalIndex].date);
                }
                
                todos.splice(originalIndex, 1);
                saveTodos(todos);
                renderTodos();
                
                if (typeof renderHomeTodoListOnly === 'function') {
                    renderHomeTodoListOnly();
                }
            });

            li.appendChild(delBtn);
            list.appendChild(li);
        });
    }

    // 3. 날짜 변경 이벤트 리스너
    dateInput.addEventListener('change', (e) => {
        selectedDateKey = e.target.value;
        renderTodos();
    });

    // 4. 할 일 추가 버튼 클릭 이벤트
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            if (!input.value.trim()) return;

            // 선택된 날짜로 투두 저장
            todos.push({ text: input.value.trim(), done: false, date: selectedDateKey }); 
            
            input.value = '';
            saveTodos(todos);
            renderTodos();
             
            if (typeof renderHomeTodoListOnly === 'function') {
                renderHomeTodoListOnly();
            }
        });
    }

    if (input) {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addBtn.click();
            }
        });
    }
    
    renderTodos(); // 초기 로딩 시 목록 렌더링

    // 이전에 홈 화면에 날짜별 리스트를 구현하기 위해 만들었던 함수는 이제 삭제합니다.
    // 대신 홈 화면에는 간결한 오늘의 목록을 보여주는 함수를 다시 정의합니다.
}

// ===============================================
// 홈 화면 투두리스트 (오늘의 목록만 간단히 표시)
// ===============================================
export function renderHomeTodoListOnly() {
    const list = document.getElementById('todoListHome'); // 홈 화면 목록 컨테이너 ID
    if (!list) return;

    let todos = getTodos();
    list.innerHTML = '';
    
    const todayKey = getDateKey(new Date());
    const todayTodos = todos.filter(todo => todo.date === todayKey);

    if (todayTodos.length === 0) {
        list.innerHTML = '<li class="empty-message">오늘 할 일이 없습니다!</li>';
        return;
    }

    // 목록만 렌더링 (클릭 이벤트 포함)
    todayTodos.forEach((todo, i) => {
        const li = document.createElement('li');
        li.innerHTML = `<span class="todo-text">${todo.text}</span>`;
        if (todo.done) li.classList.add('done');

        // 홈 화면에서는 토글만 가능하도록 간소화
        li.addEventListener('click', () => {
            const originalIndex = todos.findIndex(t => t.text === todo.text && t.date === todayKey);
            if (originalIndex === -1) return;

            const wasDone = todos[originalIndex].done;
            todos[originalIndex].done = !wasDone; 
            
            recordCompletion(!wasDone, todayKey);
            saveTodos(todos);
            renderHomeTodoListOnly(); // 홈 목록 새로고침
            if (typeof initTodo === 'function') initTodo(); // 투두 페이지도 새로고침
        });
        
        list.appendChild(li);
    });
}

// initTodo 함수가 export 되도록 합니다.