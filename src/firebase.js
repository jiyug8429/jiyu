/**
 * Firebase 초기화 모듈
 *
 * 사용 전 준비사항:
 *  1. https://console.firebase.google.com 에서 프로젝트 생성
 *  2. 프로젝트 설정 > 웹 앱 추가 > 설정값 복사
 *  3. Authentication > Sign-in method > 이메일/비밀번호 활성화
 *  4. .env 파일에 아래 키 입력
 */

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

/** Firebase Auth 인스턴스 — 앱 전역에서 공유 */
export const auth = getAuth(app);
