# Google 로그인 설정 가이드

Supabase와 Google OAuth를 연동하려면 **먼저 Google Console**에서 앱을 만들고, **그 다음 Supabase**에 정보를 입력해야 합니다.

---

## 1단계: Google Cloud Console에서 OAuth 앱 만들기

### 1-1. 프로젝트 생성

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 상단 프로젝트 선택 → **새 프로젝트** 클릭
3. 프로젝트 이름 입력 (예: `장기게임`) → **만들기**

### 1-2. OAuth 동의 화면 설정

1. 왼쪽 메뉴 **API 및 서비스** → **OAuth 동의 화면**
2. **외부** 선택 → **만들기**
3. 다음 정보 입력:
   - **앱 이름**: `장기` (또는 원하는 이름)
   - **사용자 지원 이메일**: 본인 Gmail
   - **개발자 연락처 이메일**: 본인 Gmail
4. **저장 후 계속** → 범위는 건너뛰기 → **저장 후 계속** → **대시보드로 돌아가기**

### 1-3. OAuth 클라이언트 ID 만들기

1. 왼쪽 메뉴 **API 및 서비스** → **사용자 인증 정보**
2. **+ 사용자 인증 정보 만들기** → **OAuth 클라이언트 ID**
3. 애플리케이션 유형: **웹 애플리케이션**
4. **이름**: `장기 웹앱` (아무 이름이나 가능)
5. **승인된 JavaScript 원본**:
   - 로컬: `http://localhost`
   - 로컬(다른 포트): `http://127.0.0.1:5500` (Live Server 사용 시)
   - 배포 시: `https://당신도메인.com`
6. **승인된 리디렉션 URI**에 아래 주소를 **정확히** 입력:

   ```
   https://oaunztpedxwnfrhswzts.supabase.co/auth/v1/callback
   ```

   > ⚠️ 위 주소는 이 프로젝트의 Supabase URL에 해당합니다. 다른 Supabase 프로젝트를 쓰면 `oaunztpedxwnfrhswzts` 부분을 본인 프로젝트 ID로 바꾸세요.

7. **만들기** 클릭

### 1-4. 클라이언트 ID와 시크릿 확인

생성 후 팝업에서 **클라이언트 ID**와 **클라이언트 보안 비밀**이 표시됩니다.

- **클라이언트 ID**: `123456789-xxxx.apps.googleusercontent.com` 형태
- **클라이언트 보안 비밀**: 긴 문자열

이 두 값을 복사해 두세요. (나중에 보려면 **사용자 인증 정보** 화면에서 클릭)

---

## 2단계: Supabase에서 Google Provider 설정

### 2-1. Supabase 대시보드 접속

1. [Supabase Dashboard](https://supabase.com/dashboard) 로그인
2. 프로젝트 선택 (이 장기 게임용 프로젝트)

### 2-2. Google Provider 켜기

1. 왼쪽 메뉴 **Authentication** → **Providers**
2. **Google** 찾아서 **Enable** 토글 켜기
3. 다음 값 입력:
   - **Client ID**: 1단계에서 복사한 Google **클라이언트 ID**
   - **Client Secret**: 1단계에서 복사한 Google **클라이언트 보안 비밀**
4. **Save** 클릭

### 2-3. Redirect URL 설정 (필요한 경우)

1. **Authentication** → **URL Configuration**
2. **Site URL**: 실제 접속 주소
   - 로컬: `http://localhost:5500` 또는 `http://127.0.0.1:5500`
   - 배포: `https://당신도메인.com`
3. **Redirect URLs**에 같은 주소가 포함돼 있는지 확인  
   (기본값으로 `Site URL`이 포함되어 있는 경우가 많습니다.)

---

## 3단계: 필요한 정보 정리

| 구분 | 필요한 정보 | 어디서 얻는지 |
|------|-------------|---------------|
| Google | Client ID | Google Console → 사용자 인증 정보 |
| Google | Client Secret | Google Console → 사용자 인증 정보 |
| Supabase | Supabase Callback URL | `https://[프로젝트ID].supabase.co/auth/v1/callback` |

> **프로젝트 ID**는 Supabase 대시보드의 **Project Settings** → **General**에서 확인 가능합니다.

---

## 순서 요약

```
1. Google Console
   ├─ 프로젝트 생성
   ├─ OAuth 동의 화면 설정
   ├─ OAuth 클라이언트 ID 생성 (웹 애플리케이션)
   ├─ 승인된 리디렉션 URI에 Supabase callback URL 추가
   └─ Client ID, Client Secret 복사

2. Supabase
   ├─ Authentication → Providers → Google Enable
   ├─ Client ID, Client Secret 입력 후 저장
   └─ URL Configuration에서 Site URL 확인
```

---

## 테스트

1. `index.html` 열기 (로컬 서버 또는 파일 직접 열기)
2. **Google로 로그인** 버튼 클릭
3. Google 로그인 화면 → 계정 선택 후 권한 허용
4. 앱으로 돌아오면 게임 화면이 보이면 성공입니다.

---

## 자주 나오는 오리진/리디렉션 오류

| 오류 | 원인 | 해결 |
|------|------|------|
| `redirect_uri_mismatch` | Google에 등록한 Redirect URI가 Supabase callback과 다름 | Google Console **승인된 리디렉션 URI**가 `https://[프로젝트ID].supabase.co/auth/v1/callback`인지 확인 |
| `redirect_url not allowed` | Supabase Redirect URLs에 현재 사이트 주소가 없음 | Supabase **URL Configuration** → **Redirect URLs**에 `http://localhost:5500` 등 추가 |
| Google 로그인 버튼 누르면 아무 반응 없음 | Supabase에서 Google Provider가 꺼져 있음 | Supabase **Providers** → Google **Enable** 확인 |
