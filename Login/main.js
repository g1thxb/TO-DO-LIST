import { initCalendar, initCalendarHome, refreshCalendar } from './calendar.js'; // refreshCalendar import 확인
import { initTodo, renderHomeTodoListOnly } from './todo.js'; 
import { initHabitPage, renderHomeHabitList, renderHabitGraph } from './hobit.js';


const content = document.querySelector('.content');
const navItems = document.querySelectorAll('.nav-item'); 

navItems.forEach(item => {
  item.addEventListener('click', () => {
    navItems.forEach(i => i.classList.remove('active'));
    item.classList.add('active');

    const text = item.textContent.trim();

    // 🏠 홈
    if (text.includes('홈')) {
      content.classList.remove('single-active');
      content.classList.add('home-active');
      content.innerHTML = `
        <div class="box home-calendar-box">
          <div class="calendar-header-box">
            <h2 id="currentMonthYearHome"></h2>
            <div class="nav-group">
              <button id="prevMonthHome" class="nav-button">‹</button>
              <button id="nextMonthHome" class="nav-button">›</button>
            </div>
          </div>
          <div class="calendar-days-header home-header">
            <span>월</span><span>화</span><span>수</span><span>목</span><span>금</span><span>토</span><span>일</span>
          </div>
          <div class="calendar-dates home-dates" id="calendarDatesHome">
            </div>
        </div>
        
        <div class="box home-todo-list-box"> 
            <h3> 오늘의 할 일</h3>
            <ul id="todoListHome" class="todo-list-home">
              </ul>
        </div>

        <div class="box habit-graph-box" id="habitGraph"> 
            </div>
        
        <div class="box home-habit-list-box"> 
            <h3> 오늘의 습관</h3>
            <ul id="habitListHome" class="habit-list-home">
                </ul>
        </div>
        
        <div class="box"> 습관 달성률 그래프</div>
        <div class="box"> 습관 목록</div>
      `;
      // 함수 호출
      initCalendarHome();
      renderHomeTodoListOnly(); 
      renderHabitGraph();
      renderHomeHabitList();
    }

    // 📅 캘린더
    if (text.includes('캘린더')) {
      content.classList.remove('home-active');
      content.classList.add('single-active');
      content.innerHTML = `
        <div class="box calendar-page-box">
          <h2>📅 캘린더</h2>
          <div class="calendar-header-box">
            <h2 id="currentMonthYear"></h2>
            <div class="nav-group">
              <button id="prevMonth" class="nav-button">‹</button>
              <button id="nextMonth" class="nav-button">›</button>
            </div>
          </div>
          <div class="calendar-days-header">
            <span>월</span><span>화</span><span>수</span><span>목</span><span>금</span><span>토</span><span>일</span>
          </div>
          <div class="calendar-dates" id="calendarDates">
          </div>
        </div>
      `;
      initCalendar();
    }
    
    // 📝 투두
    if (text.includes('투두')) {
      content.classList.remove('home-active');
      content.classList.add('single-active');
      content.innerHTML = `
        <div class="box todo-page-box">
          <h2>📝 할 일 목록</h2>
          <div class="date-select-group">
              <label for="todoDateInput">날짜 선택:</label>
              <input type="date" id="todoDateInput">
          </div>
          <div class="input-group">
            <input type="text" id="todoInput" placeholder="새로운 할 일을 입력하세요" />
            <button id="addTodo">추가</button>
          </div>
          <ul id="todoList" class="todo-list">
            </ul>
        </div>
      `;
      initTodo(); 
    }

    // 📈 습관
    if (text.includes('습관')) {
      content.classList.remove('home-active');
      content.classList.add('single-active');
      content.innerHTML = `
        <div class="box single-habit-page">
          <h2>📈 습관 관리</h2>
          <div class="input-group">
            <input type="text" id="habitInput" placeholder="새로운 습관을 입력하세요" />
            <button id="addHabit">추가</button>
          </div>
          <ul id="habitList" class="habit-list">
            </ul>
        </div>
      `;
      
      initHabitPage(); 
    }

    // ⚙️ 설정
    if (text.includes('설정')) {
      content.classList.remove('home-active');
      content.classList.add('single-active');
      // 설정 메뉴의 HTML 구조를 콘텐츠 영역에 삽입
      content.innerHTML = `
        <div class="settings-page box">
          <div class="settings-content-wrapper">
            <div class="panel-header">
              <svg width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="#222" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
            </div>
            <div class="menu-items">
              <button class="menu-item" data-tab="account">계정</button>
              <button class="menu-item" data-tab="notice">공지사항</button>
              <button class="menu-item" data-tab="help">도움말</button>
              <button class="menu-item" data-tab="logout">로그아웃</button>
            </div>
          </div>
        </div>
      `;
    }
  });
});


// 페이지 로드 시 기본으로 홈 화면 표시
window.addEventListener('DOMContentLoaded', () => {
  document.querySelector('.nav-item:first-child').click();
});
