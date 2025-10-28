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
        <div class="box"> 캘린더</div>
        <div class="box"> 우선순위 높은 할 일 목록</div>
        <div class="box"> 습관 달성률 그래프</div>
        <div class="box"> 습관 목록</div>
      `;
    }

    // 📅 캘린더
    if (text.includes('캘린더')) {
      content.classList.remove('home-active');
      content.classList.add('single-active');
      content.innerHTML = `
        <div class="box">
          <h2>📅 캘린더</h2>
          <p>달력 UI</p>
        </div>
      `;
    }

    // 📝 투두
    if (text.includes('투두')) {
      content.classList.remove('home-active');
      content.classList.add('single-active');
      content.innerHTML = `
        <div class="todo-container box">
          <h2>📝 나의 투두리스트</h2>
          <div class="todo-input">
            <input type="text" id="todoInput" placeholder="할 일을 입력하세요" />
            <button id="addTodo">추가</button>
          </div>
          <ul id="todoList"></ul>
        </div>
      `;
      initTodo();
    }

    // 📈 습관
    if (text.includes('습관')) {
      content.classList.remove('home-active');
      content.classList.add('single-active');
      content.innerHTML = `
        <div class="box">
          <h2>📈 습관 관리</h2>
          <p>차트 및 그래프</p>
        </div>
      `;
    }
    // ⚙️ 설정 (추가된 로직)
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
              <button class="menu-item" data-tab="inquiry">문의사항</button>
              <button class="menu-item" data-tab="version">버전</button>
              <button class="menu-item withdrawal">탈퇴하기</button>
            </div>
            </div>
          </div>
        </div>
      `;
    }
  });
});

// 투두리스트 기능
function initTodo() {
  const input = document.getElementById('todoInput');
  const addBtn = document.getElementById('addTodo');
  const list = document.getElementById('todoList');

  let todos = JSON.parse(localStorage.getItem('todos')) || [];

  function renderTodos() {
    list.innerHTML = '';
    todos.forEach((todo, i) => {
      const li = document.createElement('li');
      li.textContent = todo.text;
      if (todo.done) li.classList.add('done');

      li.addEventListener('click', () => {
        todos[i].done = !todos[i].done;
        saveTodos();
      });

      const delBtn = document.createElement('button');
      delBtn.textContent = '❌';
      delBtn.addEventListener('click', e => {
        e.stopPropagation();
        todos.splice(i, 1);
        saveTodos();
      });

      li.appendChild(delBtn);
      list.appendChild(li);
    });
  }

  function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
    renderTodos();
  }

  addBtn.addEventListener('click', () => {
    if (!input.value.trim()) return;
    todos.push({ text: input.value.trim(), done: false });
    input.value = '';
    saveTodos();
  });

  renderTodos();
}

// 페이지 로드 시 기본으로 홈 화면 표시
window.addEventListener('DOMContentLoaded', () => {
  document.querySelector('.nav-item:first-child').click();
});
