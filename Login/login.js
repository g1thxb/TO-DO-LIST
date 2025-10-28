// 로그인 페이지 → 회원가입 페이지 이동
const signupPageBtn = document.getElementById("signupPage");
if (signupPageBtn) {
  signupPageBtn.addEventListener("click", function() {
    window.location.href = "signup.html"; 
  });
}

// 회원가입 페이지 → 로그인 페이지 이동
const loginPageBtn = document.getElementById("loginPage");
if (loginPageBtn) {
  loginPageBtn.addEventListener("click", function() {
    window.location.href = "login.html"; 
  });
}

// 회원가입 완료 → 로그인 페이지로 이동
const signupBtn = document.getElementById("signupBtn");
if (signupBtn) {
  signupBtn.addEventListener("click", function() {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
      alert("이메일과 비밀번호를 모두 입력해주세요!");
      return;
    }

    alert("회원가입 완료! 로그인 화면으로 이동합니다.");
    window.location.href = "login.html";
  });
}
// 로그인 버튼 클릭 시 → 메인화면 이동
const loginBtn = document.getElementById("loginBtn");
if (loginBtn) {
  loginBtn.addEventListener("click", function() {
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    if (!email || !password) {
      alert("이메일과 비밀번호를 모두 입력해주세요!");
      return;
    }
    window.location.href = "main.html"; // 메인화면으로 이동
  });
}

// 게스트 로그인 버튼 클릭 시 → 메인화면 이동
const guestLoginBtn = document.getElementById("guestLoginBtn");
if (guestLoginBtn) {
  guestLoginBtn.addEventListener("click", function() {
    // 게스트 로그인은 인증 절차 없이 바로 메인 화면으로 이동
    window.location.href = "main.html"; 
  });
}