// Supabase 이메일 로그인·회원가입
(function () {
    if (typeof supabase === 'undefined') {
        console.error('Supabase 스크립트를 먼저 로드하세요.');
        return;
    }
    var url = window.SUPABASE_URL;
    var key = window.SUPABASE_ANON_KEY;
    if (!url || !key) {
        console.error('config.js에 SUPABASE_URL, SUPABASE_ANON_KEY를 설정하세요.');
        return;
    }
    var client = supabase.createClient(url, key);

    var authScreen = document.getElementById('authScreen');
    var gameScreen = document.getElementById('gameScreen');
    var authMessage = document.getElementById('authMessage');
    var loginForm = document.getElementById('loginForm');
    var signupForm = document.getElementById('signupForm');
    var tabLogin = document.getElementById('tabLogin');
    var tabSignup = document.getElementById('tabSignup');
    var btnLogout = document.getElementById('btnLogout');

    function showMessage(text, isError) {
        if (!authMessage) return;
        authMessage.textContent = text || '';
        authMessage.style.color = isError ? '#c62828' : '#2e7d32';
        authMessage.classList.toggle('error', !!isError);
    }

    function showAuth() {
        if (authScreen) authScreen.classList.remove('hidden');
        if (gameScreen) gameScreen.classList.add('hidden');
    }

    function showGame() {
        if (authScreen) authScreen.classList.add('hidden');
        if (gameScreen) gameScreen.classList.remove('hidden');
        showMessage('');
    }

    function switchTab(toLogin) {
        if (loginForm) loginForm.classList.toggle('hidden', !toLogin);
        if (signupForm) signupForm.classList.toggle('hidden', toLogin);
        if (tabLogin) tabLogin.classList.toggle('active', toLogin);
        if (tabSignup) tabSignup.classList.toggle('active', !toLogin);
        showMessage('');
    }

    client.auth.onAuthStateChange(function (event, session) {
        if (session) {
            showGame();
        } else {
            showAuth();
        }
    });

    function initAuth() {
        client.auth.getSession().then(function (res) {
            if (res.data.session) {
                showGame();
            } else {
                showAuth();
            }
        }).catch(function () {
            showAuth();
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            var email = document.getElementById('loginEmail').value.trim();
            var password = document.getElementById('loginPassword').value;
            if (!email || !password) {
                showMessage('이메일과 비밀번호를 입력하세요.', true);
                return;
            }
            showMessage('로그인 중...', false);
            client.auth.signInWithPassword({ email: email, password: password })
                .then(function () {
                    showMessage('');
                    showGame();
                })
                .catch(function (err) {
                    showMessage(err.message || '로그인에 실패했습니다.', true);
                });
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', function (e) {
            e.preventDefault();
            var email = document.getElementById('signupEmail').value.trim();
            var password = document.getElementById('signupPassword').value;
            if (!email || !password) {
                showMessage('이메일과 비밀번호를 입력하세요.', true);
                return;
            }
            if (password.length < 6) {
                showMessage('비밀번호는 6자 이상이어야 합니다.', true);
                return;
            }
            showMessage('가입 중...', false);
            client.auth.signUp({ email: email, password: password })
                .then(function (res) {
                    if (res.data.user && !res.data.session) {
                        showMessage('가입되었습니다. 이메일 확인 링크를 확인해 주세요.', false);
                    } else {
                        showMessage('가입되었습니다. 로그인되었습니다.', false);
                        showGame();
                    }
                })
                .catch(function (err) {
                    showMessage(err.message || '회원가입에 실패했습니다.', true);
                });
        });
    }

    if (tabLogin) tabLogin.addEventListener('click', function () { switchTab(true); });
    if (tabSignup) tabSignup.addEventListener('click', function () { switchTab(false); });

    var btnGoogle = document.getElementById('btnGoogleLogin');
    if (btnGoogle) {
        btnGoogle.addEventListener('click', function () {
            showMessage('Google 로그인 중...', false);
            client.auth.signInWithOAuth({ provider: 'google' })
                .then(function (res) {
                    if (res.error) {
                        showMessage(res.error.message || 'Google 로그인에 실패했습니다.', true);
                    } else {
                        window.location.href = res.data.url;
                    }
                })
                .catch(function (err) {
                    showMessage(err.message || 'Google 로그인에 실패했습니다.', true);
                });
        });
    }

    if (btnLogout) {
        btnLogout.addEventListener('click', function () {
            client.auth.signOut().then(function () {
                showAuth();
                switchTab(true);
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAuth);
    } else {
        initAuth();
    }
})();
