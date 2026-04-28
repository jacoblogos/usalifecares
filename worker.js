// ── Static HTML pages ─────────────────────────────────────────
const ABOUT_HTML = `<!DOCTYPE html>
<html lang="ko">
<head>
<!-- Playables SDK -->
<script>// Playables SDK v1.0.0
// Game lifecycle bridge: rAF-based game-ready detection + event communication
(function() {
  'use strict';

  // Idempotency: skip if already initialized (e.g., server-side injection
  // followed by client-side inject-javascript via the Bloks webview component).
  if (window.playablesSDK) return;

  var HANDLER_NAME = 'playablesGameEventHandler';
  var ANDROID_BRIDGE_NAME = '_MetaPlayablesBridge';
  var RAF_FRAME_THRESHOLD = 3;

  var gameReadySent = false;
  var firstInteractionSent = false;
  var errorSent = false;
  var frameCount = 0;
  var originalRAF = window.requestAnimationFrame;

  // --- Transport Layer ---

  function hasIOSBridge() {
    return !!(window.webkit &&
              window.webkit.messageHandlers &&
              window.webkit.messageHandlers[HANDLER_NAME]);
  }

  function hasAndroidBridge() {
    return !!(window[ANDROID_BRIDGE_NAME] &&
              typeof window[ANDROID_BRIDGE_NAME].postEvent === 'function');
  }

  function isInIframe() {
    return !!(window.parent && window.parent !== window);
  }

  function sendEvent(eventName, payload) {
    var message = {
      type: eventName,
      payload: payload || {},
      timestamp: Date.now()
    };

    if (hasIOSBridge()) {
      try {
        window.webkit.messageHandlers[HANDLER_NAME].postMessage(message);
      } catch (e) { /* ignore */ }
      return;
    }

    if (hasAndroidBridge()) {
    try {
      var p = payload || {};
      p.__secureToken = window.__fbAndroidBridgeAuthToken || '';
      window[ANDROID_BRIDGE_NAME].postEvent(
        eventName,
        JSON.stringify(p)
      );
    } catch (e) { /* ignore */ }
    return;
  }

    if (isInIframe()) {
      try {
        window.parent.postMessage(message, '*');
      } catch (e) { /* ignore */ }
      return;
    }
  }

  // --- rAF Game-Ready Detection ---

  function onFrame() {
    if (gameReadySent) return;

    frameCount++;
    if (frameCount >= RAF_FRAME_THRESHOLD) {
      gameReadySent = true;
      sendEvent('game_ready', {
        frame_count: frameCount,
        detected_at: Date.now()
      });
      return;
    }

    originalRAF.call(window, onFrame);
  }

  if (originalRAF) {
    window.requestAnimationFrame = function(callback) {
      if (!gameReadySent) {
        return originalRAF.call(window, function(timestamp) {
          frameCount++;
          if (frameCount >= RAF_FRAME_THRESHOLD && !gameReadySent) {
            gameReadySent = true;
            sendEvent('game_ready', {
              frame_count: frameCount,
              detected_at: Date.now()
            });
          }
          callback(timestamp);
        });
      }
      return originalRAF.call(window, callback);
    };
  }

  // --- First User Interaction Detection ---

  function setupFirstInteractionDetection() {
    var events = ['touchstart', 'mousedown', 'keydown'];

    function onFirstInteraction() {
      if (firstInteractionSent) return;
      firstInteractionSent = true;
      sendEvent('user_interaction_start', null);

      for (var i = 0; i < events.length; i++) {
        document.removeEventListener(events[i], onFirstInteraction, true);
      }
    }

    for (var i = 0; i < events.length; i++) {
      document.addEventListener(events[i], onFirstInteraction, true);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupFirstInteractionDetection);
  } else {
    setupFirstInteractionDetection();
  }

  // --- Auto Error Capture ---

  window.addEventListener('error', function(event) {
    if (errorSent) return;
    errorSent = true;
    sendEvent('error', {
      message: event.message || 'Unknown error',
      source: event.filename || '',
      lineno: event.lineno || 0,
      colno: event.colno || 0,
      auto_captured: true
    });
  });

  window.addEventListener('unhandledrejection', function(event) {
    if (errorSent) return;
    errorSent = true;
    var reason = event.reason;
    sendEvent('error', {
      message: (reason instanceof Error) ? reason.message : String(reason),
      type: 'unhandled_promise_rejection',
      auto_captured: true
    });
  });

  // --- Public API ---

  window.playablesSDK = {
    complete: function(score) {
      sendEvent('game_ended', {
        score: score,
        completed: true
      });
    },

    error: function(message) {
      if (errorSent) return;
      errorSent = true;
      sendEvent('error', {
        message: message || 'Unknown error',
        auto_captured: false
      });
    },

    sendEvent: function(eventName, payload) {
      if (!eventName || typeof eventName !== 'string') return;
      sendEvent(eventName, payload);
    }
  };

  // Kick off rAF detection in case no game code calls rAF immediately
  if (originalRAF) {
    originalRAF.call(window, onFrame);
  }
})();</script>
<script>window.Intl=window.Intl||{};Intl.t=function(s){return(Intl._locale&&Intl._locale[s])||s;};</script>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>About - USA Life Cares</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { background: #0a2342; color: white; padding: 40px 20px; text-align: center; margin: -20px -20px 30px -20px; }
        .header h1 { margin: 0; font-size: 2.5em; }
        .header .usa { color: #f59e0b; }
        .header p { margin: 10px 0 0 0; opacity: 0.9; }
        .card { background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 30px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        .card h2 { margin-top: 0; text-align: center; color: #1e3a8a; }
        .profile { border-left: 4px solid #f59e0b; }
        .profile h3 { margin: 0 0 5px 0; }
        .profile .meta { color: #6b7280; font-size: 0.9em; margin-bottom: 15px; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; margin: 20px 0; }
        .grid-item { border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; text-align: center; }
        .grid-item h4 { margin: 10px 0; color: #1e3a8a; }
        .disclaimer { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; font-size: 0.9em; color: #4b5563; }
        .disclaimer strong { color: #1f2937; }
        .update { text-align: center; color: #6b7280; font-size: 0.85em; margin-bottom: 30px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>About <span class="usa">USA</span> Life Cares</h1>
        <p>미국 거주 한인 관련 정보 포털</p>
    </div>

    <div class="update">최종 업데이트: 2026년 4월 20일<br>작성: US Life Cares 편집팀</div>

    <div class="card">
        <h2>Our Mission</h2>
        <p>USA Life Cares는 미국 거주 한인 대상 정부 혜택, 지역 생활, 건강 관련 일반 정보를 제공합니다.</p>
    </div>

    <div class="card profile">
        <h3>Editor's Profile</h3>
        <div class="meta">Based in Georgia · 12 Years in the U.S.</div>
        <p>사이트 운영자는 조지아 거주 한인입니다. 미국 생활 관련 정보 제공을 목적으로 합니다.</p>
    </div>

    <div class="grid">
        <div class="grid-item">
            <h4>정보 출처</h4>
            <p>공식 정부 사이트 및 공개 자료 기반 정보 제공</p>
        </div>
        <div class="grid-item">
            <h4>콘텐츠 업데이트</h4>
            <p>정책 변경 시 콘텐츠 업데이트 진행</p>
        </div>
        <div class="grid-item">
            <h4>대상</h4>
            <p>미국 거주 한인 커뮤니티 대상</p>
        </div>
    </div>

    <div class="disclaimer">
        <p><strong>중요 안내</strong>: 본 사이트는 일반 정보 제공 목적입니다. 정부 정책, 혜택, 규정 등은 변경될 수 있습니다. 중요한 결정 전 해당 기관 공식 웹사이트 및 전문가 확인이 필요합니다.</p>
        <p><strong>면책 조항</strong>: 본 사이트의 정보는 교육 목적이며 법률/재정/의료 조언이 아닙니다. 정보의 완전성, 정확성을 보장하지 않습니다.</p>
    </div>
</body>
</html>`;

const CONTACT_HTML = `<!DOCTYPE html>
<html lang="ko">
<head>
<!-- Playables SDK -->
<script>// Playables SDK v1.0.0
// Game lifecycle bridge: rAF-based game-ready detection + event communication
(function() {
  'use strict';

  // Idempotency: skip if already initialized (e.g., server-side injection
  // followed by client-side inject-javascript via the Bloks webview component).
  if (window.playablesSDK) return;

  var HANDLER_NAME = 'playablesGameEventHandler';
  var ANDROID_BRIDGE_NAME = '_MetaPlayablesBridge';
  var RAF_FRAME_THRESHOLD = 3;

  var gameReadySent = false;
  var firstInteractionSent = false;
  var errorSent = false;
  var frameCount = 0;
  var originalRAF = window.requestAnimationFrame;

  // --- Transport Layer ---

  function hasIOSBridge() {
    return !!(window.webkit &&
              window.webkit.messageHandlers &&
              window.webkit.messageHandlers[HANDLER_NAME]);
  }

  function hasAndroidBridge() {
    return !!(window[ANDROID_BRIDGE_NAME] &&
              typeof window[ANDROID_BRIDGE_NAME].postEvent === 'function');
  }

  function isInIframe() {
    return !!(window.parent && window.parent !== window);
  }

  function sendEvent(eventName, payload) {
    var message = {
      type: eventName,
      payload: payload || {},
      timestamp: Date.now()
    };

    if (hasIOSBridge()) {
      try {
        window.webkit.messageHandlers[HANDLER_NAME].postMessage(message);
      } catch (e) { /* ignore */ }
      return;
    }

    if (hasAndroidBridge()) {
    try {
      var p = payload || {};
      p.__secureToken = window.__fbAndroidBridgeAuthToken || '';
      window[ANDROID_BRIDGE_NAME].postEvent(
        eventName,
        JSON.stringify(p)
      );
    } catch (e) { /* ignore */ }
    return;
  }

    if (isInIframe()) {
      try {
        window.parent.postMessage(message, '*');
      } catch (e) { /* ignore */ }
      return;
    }
  }

  // --- rAF Game-Ready Detection ---

  function onFrame() {
    if (gameReadySent) return;

    frameCount++;
    if (frameCount >= RAF_FRAME_THRESHOLD) {
      gameReadySent = true;
      sendEvent('game_ready', {
        frame_count: frameCount,
        detected_at: Date.now()
      });
      return;
    }

    originalRAF.call(window, onFrame);
  }

  if (originalRAF) {
    window.requestAnimationFrame = function(callback) {
      if (!gameReadySent) {
        return originalRAF.call(window, function(timestamp) {
          frameCount++;
          if (frameCount >= RAF_FRAME_THRESHOLD && !gameReadySent) {
            gameReadySent = true;
            sendEvent('game_ready', {
              frame_count: frameCount,
              detected_at: Date.now()
            });
          }
          callback(timestamp);
        });
      }
      return originalRAF.call(window, callback);
    };
  }

  // --- First User Interaction Detection ---

  function setupFirstInteractionDetection() {
    var events = ['touchstart', 'mousedown', 'keydown'];

    function onFirstInteraction() {
      if (firstInteractionSent) return;
      firstInteractionSent = true;
      sendEvent('user_interaction_start', null);

      for (var i = 0; i < events.length; i++) {
        document.removeEventListener(events[i], onFirstInteraction, true);
      }
    }

    for (var i = 0; i < events.length; i++) {
      document.addEventListener(events[i], onFirstInteraction, true);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupFirstInteractionDetection);
  } else {
    setupFirstInteractionDetection();
  }

  // --- Auto Error Capture ---

  window.addEventListener('error', function(event) {
    if (errorSent) return;
    errorSent = true;
    sendEvent('error', {
      message: event.message || 'Unknown error',
      source: event.filename || '',
      lineno: event.lineno || 0,
      colno: event.colno || 0,
      auto_captured: true
    });
  });

  window.addEventListener('unhandledrejection', function(event) {
    if (errorSent) return;
    errorSent = true;
    var reason = event.reason;
    sendEvent('error', {
      message: (reason instanceof Error) ? reason.message : String(reason),
      type: 'unhandled_promise_rejection',
      auto_captured: true
    });
  });

  // --- Public API ---

  window.playablesSDK = {
    complete: function(score) {
      sendEvent('game_ended', {
        score: score,
        completed: true
      });
    },

    error: function(message) {
      if (errorSent) return;
      errorSent = true;
      sendEvent('error', {
        message: message || 'Unknown error',
        auto_captured: false
      });
    },

    sendEvent: function(eventName, payload) {
      if (!eventName || typeof eventName !== 'string') return;
      sendEvent(eventName, payload);
    }
  };

  // Kick off rAF detection in case no game code calls rAF immediately
  if (originalRAF) {
    originalRAF.call(window, onFrame);
  }
})();</script>
<script>window.Intl=window.Intl||{};Intl.t=function(s){return(Intl._locale&&Intl._locale[s])||s;};</script>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>문의하기 | USA Life Care</title>
<meta name="description" content="USA Life Care에 문의하세요. 광고 문의, 제보, 제안 모두 환영합니다.">
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet">
<style>
:root{--navy:#0d1b3e;--blue:#1a56db;--gold:#f59e0b;--light:#f8fafc;--white:#fff;--gray:#64748b;--border:#e2e8f0;--text:#1e293b;}
*{margin:0;padding:0;box-sizing:border-box;}
body{font-family:'Noto Sans KR',sans-serif;background:var(--light);color:var(--text);}
nav{background:var(--navy);border-bottom:3px solid var(--gold);}
.nav-inner{max-width:900px;margin:0 auto;padding:0 5%;display:flex;align-items:center;justify-content:space-between;height:65px;}
.nav-logo{text-decoration:none;display:flex;align-items:center;gap:0.6rem;}
.nav-logo-icon{width:36px;height:36px;background:linear-gradient(135deg,var(--blue),var(--gold));border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:900;color:white;}
.nav-logo-text{font-family:'Playfair Display',serif;font-size:1.2rem;color:white;}
.nav-logo-text span{color:var(--gold);}
.nav-back{color:#94a3b8;text-decoration:none;font-size:0.82rem;border:1px solid #334155;padding:0.3rem 0.8rem;border-radius:20px;}
.nav-back:hover{border-color:var(--gold);color:var(--gold);}
.page-header{background:var(--navy);padding:3rem 5%;text-align:center;color:white;}
.page-header h1{font-family:'Playfair Display',serif;font-size:2rem;margin-bottom:0.5rem;}
.page-header p{color:#94a3b8;font-size:0.88rem;}
.container{max-width:900px;margin:3rem auto;padding:0 5%;display:grid;grid-template-columns:1fr 1fr;gap:2rem;}
.contact-info{display:flex;flex-direction:column;gap:1.2rem;}
.info-card{background:white;border-radius:12px;padding:1.5rem;border:1px solid var(--border);display:flex;gap:1rem;align-items:flex-start;}
.info-icon{width:44px;height:44px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:1.3rem;flex-shrink:0;}
.info-card h3{font-size:0.9rem;font-weight:700;color:var(--navy);margin-bottom:0.3rem;}
.info-card p{font-size:0.82rem;color:var(--gray);line-height:1.6;}
.info-card a{color:var(--blue);text-decoration:none;font-weight:600;}
.form-card{background:white;border-radius:12px;padding:2rem;border:1px solid var(--border);}
.form-card h2{font-family:'Playfair Display',serif;font-size:1.3rem;margin-bottom:1.5rem;color:var(--navy);}
.form-group{display:flex;flex-direction:column;gap:0.4rem;margin-bottom:1rem;}
.form-group label{font-size:0.78rem;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:var(--navy);}
.form-group input,.form-group textarea,.form-group select{padding:0.8rem 1rem;border:2px solid var(--border);border-radius:8px;font-family:inherit;font-size:0.9rem;color:var(--text);background:var(--light);transition:border-color 0.2s;outline:none;}
.form-group input:focus,.form-group textarea:focus,.form-group select:focus{border-color:var(--blue);}
.form-group textarea{min-height:140px;resize:vertical;}
.submit-btn{width:100%;background:var(--navy);color:white;border:none;padding:1rem;border-radius:8px;font-family:inherit;font-size:0.95rem;font-weight:700;cursor:pointer;transition:opacity 0.2s;}
.submit-btn:hover{opacity:0.85;}
.submit-btn:disabled{opacity:0.5;cursor:not-allowed;}
.success-msg{display:none;background:#f0fdf4;border:2px solid #86efac;border-radius:8px;padding:1rem;text-align:center;color:#166534;font-size:0.88rem;margin-top:1rem;}
.error-msg{display:none;background:#fef2f2;border:2px solid #fca5a5;border-radius:8px;padding:1rem;text-align:center;color:#991b1b;font-size:0.88rem;margin-top:1rem;}
footer{background:var(--navy);margin-top:4rem;border-top:3px solid var(--gold);padding:2rem 5%;text-align:center;}
footer p{color:#334155;font-size:0.75rem;}
footer a{color:#64748b;text-decoration:none;}
@media(max-width:700px){.container{grid-template-columns:1fr;}}
</style>
</head>
<body>
<nav>
  <div class="nav-inner">
    <a href="/" class="nav-logo">
      <div class="nav-logo-icon">U</div>
      <div><div class="nav-logo-text">USA <span>Life</span> Care</div></div>
    </a>
    <a href="/" class="nav-back">← 홈으로</a>
  </div>
</nav>

<div class="page-header">
  <h1>문의하기</h1>
  <p>궁금한 점, 제보, 광고 문의 모두 환영합니다.</p>
</div>

<div class="container">
  <div class="contact-info">
    <div class="info-card">
      <div class="info-icon" style="background:#eff6ff">✉️</div>
      <div>
        <h3>이메일</h3>
        <p>빠른 답변을 원하시면 이메일로 문의해 주세요.<br>
        <a href="mailto:jacob@takostech.com">jacob@takostech.com</a></p>
      </div>
    </div>
    <div class="info-card">
      <div class="info-icon" style="background:#f0fdf4">📰</div>
      <div>
        <h3>정보 제보</h3>
        <p>유용한 한인 생활 정보를 알고 계신가요? 제보해 주시면 검토 후 게재하겠습니다.</p>
      </div>
    </div>
    <div class="info-card">
      <div class="info-icon" style="background:#faf5ff">📢</div>
      <div>
        <h3>광고 문의</h3>
        <p>USA Life Care에 광고를 게재하고 싶으신가요? 이메일로 문의해 주세요.</p>
      </div>
    </div>
    <div class="info-card">
      <div class="info-icon" style="background:#fff7ed">🔧</div>
      <div>
        <h3>가전제품 수리</h3>
        <p>Georgia 지역 가전제품 수리는 Takos Home Service로 연락하세요.<br>
        <a href="tel:6788973480">(678) 897-3480</a></p>
      </div>
    </div>
  </div>

  <div class="form-card">
    <h2>메시지 보내기</h2>
    <form id="contactForm" onsubmit="handleSubmit(event)">
      <div class="form-group">
        <label>이름</label>
        <input type="text" name="name" placeholder="홍길동" required>
      </div>
      <div class="form-group">
        <label>이메일</label>
        <input type="email" name="email" placeholder="your@email.com" required>
      </div>
      <div class="form-group">
        <label>문의 유형</label>
        <select name="type">
          <option>정보 제보</option>
          <option>광고 문의</option>
          <option>수정 요청</option>
          <option>기타 문의</option>
        </select>
      </div>
      <div class="form-group">
        <label>메시지</label>
        <textarea name="message" placeholder="문의 내용을 입력해 주세요..." required></textarea>
      </div>
      <button type="submit" class="submit-btn" id="submitBtn">메시지 보내기 →</button>
      <div class="success-msg" id="successMsg">✅ 메시지가 전송되었습니다! 빠른 시일 내에 답변드리겠습니다.</div>
      <div class="error-msg" id="errorMsg">❌ 전송 중 오류가 발생했습니다. <a href="mailto:jacob@takostech.com">jacob@takostech.com</a> 으로 직접 이메일 주세요.</div>
    </form>
  </div>
</div>

<footer>
  <p>© 2026 USA Life Care · <a href="/">홈</a> · <a href="privacy.html">개인정보처리방침</a> · <a href="about.html">소개</a></p>
</footer>

<script>
async function handleSubmit(e) {
  e.preventDefault();

  const btn     = document.getElementById('submitBtn');
  const success = document.getElementById('successMsg');
  const error   = document.getElementById('errorMsg');
  const form    = document.getElementById('contactForm');

  btn.disabled    = true;
  btn.textContent = '전송 중...';
  success.style.display = 'none';
  error.style.display   = 'none';

  try {
    const res = await fetch('https://formspree.io/f/xlgoykar', {
      method:  'POST',
      body:    new FormData(form),
      headers: { 'Accept': 'application/json' }
    });

    if (res.ok) {
      success.style.display = 'block';
      form.reset();
    } else {
      error.style.display = 'block';
    }
  } catch (err) {
    error.style.display = 'block';
  }

  btn.disabled    = false;
  btn.textContent = '메시지 보내기 →';
}
</script>
</body>
</html>`;

const PRIVACY_HTML = `<!DOCTYPE html>
<html lang="ko">
<head>
<!-- Playables SDK -->
<script>// Playables SDK v1.0.0
// Game lifecycle bridge: rAF-based game-ready detection + event communication
(function() {
  'use strict';

  // Idempotency: skip if already initialized (e.g., server-side injection
  // followed by client-side inject-javascript via the Bloks webview component).
  if (window.playablesSDK) return;

  var HANDLER_NAME = 'playablesGameEventHandler';
  var ANDROID_BRIDGE_NAME = '_MetaPlayablesBridge';
  var RAF_FRAME_THRESHOLD = 3;

  var gameReadySent = false;
  var firstInteractionSent = false;
  var errorSent = false;
  var frameCount = 0;
  var originalRAF = window.requestAnimationFrame;

  // --- Transport Layer ---

  function hasIOSBridge() {
    return !!(window.webkit &&
              window.webkit.messageHandlers &&
              window.webkit.messageHandlers[HANDLER_NAME]);
  }

  function hasAndroidBridge() {
    return !!(window[ANDROID_BRIDGE_NAME] &&
              typeof window[ANDROID_BRIDGE_NAME].postEvent === 'function');
  }

  function isInIframe() {
    return !!(window.parent && window.parent !== window);
  }

  function sendEvent(eventName, payload) {
    var message = {
      type: eventName,
      payload: payload || {},
      timestamp: Date.now()
    };

    if (hasIOSBridge()) {
      try {
        window.webkit.messageHandlers[HANDLER_NAME].postMessage(message);
      } catch (e) { /* ignore */ }
      return;
    }

    if (hasAndroidBridge()) {
    try {
      var p = payload || {};
      p.__secureToken = window.__fbAndroidBridgeAuthToken || '';
      window[ANDROID_BRIDGE_NAME].postEvent(
        eventName,
        JSON.stringify(p)
      );
    } catch (e) { /* ignore */ }
    return;
  }

    if (isInIframe()) {
      try {
        window.parent.postMessage(message, '*');
      } catch (e) { /* ignore */ }
      return;
    }
  }

  // --- rAF Game-Ready Detection ---

  function onFrame() {
    if (gameReadySent) return;

    frameCount++;
    if (frameCount >= RAF_FRAME_THRESHOLD) {
      gameReadySent = true;
      sendEvent('game_ready', {
        frame_count: frameCount,
        detected_at: Date.now()
      });
      return;
    }

    originalRAF.call(window, onFrame);
  }

  if (originalRAF) {
    window.requestAnimationFrame = function(callback) {
      if (!gameReadySent) {
        return originalRAF.call(window, function(timestamp) {
          frameCount++;
          if (frameCount >= RAF_FRAME_THRESHOLD && !gameReadySent) {
            gameReadySent = true;
            sendEvent('game_ready', {
              frame_count: frameCount,
              detected_at: Date.now()
            });
          }
          callback(timestamp);
        });
      }
      return originalRAF.call(window, callback);
    };
  }

  // --- First User Interaction Detection ---

  function setupFirstInteractionDetection() {
    var events = ['touchstart', 'mousedown', 'keydown'];

    function onFirstInteraction() {
      if (firstInteractionSent) return;
      firstInteractionSent = true;
      sendEvent('user_interaction_start', null);

      for (var i = 0; i < events.length; i++) {
        document.removeEventListener(events[i], onFirstInteraction, true);
      }
    }

    for (var i = 0; i < events.length; i++) {
      document.addEventListener(events[i], onFirstInteraction, true);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupFirstInteractionDetection);
  } else {
    setupFirstInteractionDetection();
  }

  // --- Auto Error Capture ---

  window.addEventListener('error', function(event) {
    if (errorSent) return;
    errorSent = true;
    sendEvent('error', {
      message: event.message || 'Unknown error',
      source: event.filename || '',
      lineno: event.lineno || 0,
      colno: event.colno || 0,
      auto_captured: true
    });
  });

  window.addEventListener('unhandledrejection', function(event) {
    if (errorSent) return;
    errorSent = true;
    var reason = event.reason;
    sendEvent('error', {
      message: (reason instanceof Error) ? reason.message : String(reason),
      type: 'unhandled_promise_rejection',
      auto_captured: true
    });
  });

  // --- Public API ---

  window.playablesSDK = {
    complete: function(score) {
      sendEvent('game_ended', {
        score: score,
        completed: true
      });
    },

    error: function(message) {
      if (errorSent) return;
      errorSent = true;
      sendEvent('error', {
        message: message || 'Unknown error',
        auto_captured: false
      });
    },

    sendEvent: function(eventName, payload) {
      if (!eventName || typeof eventName !== 'string') return;
      sendEvent(eventName, payload);
    }
  };

  // Kick off rAF detection in case no game code calls rAF immediately
  if (originalRAF) {
    originalRAF.call(window, onFrame);
  }
})();</script>
<script>window.Intl=window.Intl||{};Intl.t=function(s){return(Intl._locale&&Intl._locale[s])||s;};</script>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>개인정보처리방침 | USA Life Care</title>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet">
<style>
:root{--navy:#0d1b3e;--blue:#1a56db;--gold:#f59e0b;--light:#f8fafc;--white:#fff;--gray:#64748b;--border:#e2e8f0;--text:#1e293b;}
*{margin:0;padding:0;box-sizing:border-box;}
body{font-family:'Noto Sans KR',sans-serif;background:var(--light);color:var(--text);}
nav{background:var(--navy);border-bottom:3px solid var(--gold);}
.nav-inner{max-width:900px;margin:0 auto;padding:0 5%;display:flex;align-items:center;justify-content:space-between;height:65px;}
.nav-logo{text-decoration:none;display:flex;align-items:center;gap:0.6rem;}
.nav-logo-icon{width:36px;height:36px;background:linear-gradient(135deg,var(--blue),var(--gold));border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:900;color:white;}
.nav-logo-text{font-family:'Playfair Display',serif;font-size:1.2rem;color:white;}
.nav-logo-text span{color:var(--gold);}
.nav-back{color:#94a3b8;text-decoration:none;font-size:0.82rem;border:1px solid #334155;padding:0.3rem 0.8rem;border-radius:20px;}
.nav-back:hover{border-color:var(--gold);color:var(--gold);}
.container{max-width:900px;margin:3rem auto;padding:0 5%;}
.page-header{background:var(--navy);padding:3rem 5%;text-align:center;color:white;margin-bottom:2rem;}
.page-header h1{font-family:'Playfair Display',serif;font-size:2rem;margin-bottom:0.5rem;}
.page-header p{color:#94a3b8;font-size:0.88rem;}
.content{background:white;border-radius:12px;padding:2.5rem;border:1px solid var(--border);}
.content h2{font-family:'Playfair Display',serif;font-size:1.2rem;color:var(--navy);margin:2rem 0 0.8rem;padding-bottom:0.5rem;border-bottom:2px solid var(--border);}
.content h2:first-child{margin-top:0;}
.content p{font-size:0.9rem;line-height:1.9;color:#334155;margin-bottom:0.8rem;}
.content ul{margin:0.5rem 0 1rem 1.5rem;}
.content li{font-size:0.9rem;line-height:1.8;color:#334155;}
.info-box{background:#eff6ff;border-left:4px solid var(--blue);padding:1rem 1.2rem;border-radius:0 8px 8px 0;margin:1rem 0;}
.info-box p{margin:0;font-size:0.85rem;color:#1e40af;}
footer{background:var(--navy);margin-top:4rem;border-top:3px solid var(--gold);padding:2rem 5%;text-align:center;}
footer p{color:#334155;font-size:0.75rem;}
footer a{color:#64748b;text-decoration:none;}
</style>
</head>
<body>
<nav>
  <div class="nav-inner">
    <a href="/" class="nav-logo">
      <div class="nav-logo-icon">U</div>
      <div><div class="nav-logo-text">USA <span>Life</span> Care</div></div>
    </a>
    <a href="/" class="nav-back">← 홈으로</a>
  </div>
</nav>

<div class="page-header">
  <h1>개인정보처리방침</h1>
  <p>Privacy Policy · 최종 업데이트: 2025년 3월 30일</p>
</div>

<div class="container">
  <div class="content">
    <div class="info-box">
      <p>USA Life Care (usalifecares.com)는 방문자의 개인정보를 소중히 여기며 관련 법령에 따라 보호합니다.</p>
    </div>

    <h2>1. 수집하는 정보</h2>
    <p>본 사이트는 다음과 같은 정보를 수집할 수 있습니다:</p>
    <ul>
      <li>방문자가 직접 제공하는 정보 (문의 이메일, 이름 등)</li>
      <li>자동으로 수집되는 정보 (IP 주소, 브라우저 종류, 방문 페이지, 방문 시간)</li>
      <li>쿠키 및 유사 기술을 통해 수집되는 정보</li>
    </ul>

    <h2>2. 정보 수집 목적</h2>
    <p>수집된 정보는 다음 목적으로 사용됩니다:</p>
    <ul>
      <li>사이트 서비스 제공 및 개선</li>
      <li>방문자 문의에 대한 응답</li>
      <li>사이트 이용 통계 분석</li>
      <li>광고 서비스 제공 (Google AdSense)</li>
    </ul>

    <h2>3. Google AdSense 및 쿠키</h2>
    <p>본 사이트는 Google AdSense를 통해 광고를 제공합니다. Google은 쿠키를 사용하여 방문자에게 관련성 높은 광고를 표시합니다.</p>
    <ul>
      <li>Google의 광고 쿠키 사용은 <a href="https://policies.google.com/privacy" target="_blank" style="color:var(--blue)">Google 개인정보처리방침</a>을 따릅니다</li>
      <li>방문자는 <a href="https://www.google.com/settings/ads" target="_blank" style="color:var(--blue)">Google 광고 설정</a>에서 개인 맞춤 광고를 해제할 수 있습니다</li>
      <li>브라우저 설정에서 쿠키를 비활성화할 수 있으나 일부 서비스 이용에 제한이 생길 수 있습니다</li>
    </ul>

    <h2>4. 제3자 서비스</h2>
    <p>본 사이트는 다음 제3자 서비스를 이용합니다:</p>
    <ul>
      <li><strong>Google Analytics:</strong> 사이트 방문 통계 분석</li>
      <li><strong>Google AdSense:</strong> 광고 서비스</li>
      <li><strong>Cloudflare:</strong> 사이트 호스팅 및 보안</li>
    </ul>

    <h2>5. 정보 보호</h2>
    <p>본 사이트는 수집된 정보를 보호하기 위해 적절한 기술적, 관리적 조치를 취합니다. 그러나 인터넷을 통한 전송은 완전히 안전하지 않을 수 있으며, 이에 대한 절대적인 보장은 드릴 수 없습니다.</p>

    <h2>6. 아동 개인정보</h2>
    <p>본 사이트는 13세 미만 아동으로부터 의도적으로 개인정보를 수집하지 않습니다. 13세 미만 아동의 개인정보가 수집되었음을 발견한 경우 즉시 삭제 조치를 취합니다.</p>

    <h2>7. 외부 링크</h2>
    <p>본 사이트에는 외부 사이트 링크가 포함될 수 있습니다. 해당 외부 사이트의 개인정보처리방침은 본 방침과 다를 수 있으며, 외부 사이트에 대한 책임은 지지 않습니다.</p>

    <h2>8. 방침 변경</h2>
    <p>본 개인정보처리방침은 필요에 따라 업데이트될 수 있습니다. 변경 시 본 페이지에 업데이트 날짜와 함께 공지됩니다.</p>

    <h2>9. 문의</h2>
    <p>개인정보처리방침에 관한 문의사항은 아래로 연락해 주세요:</p>
    <ul>
      <li>이메일: <a href="mailto:jacob@takostech.com" style="color:var(--blue)">jacob@takostech.com</a></li>
      <li>웹사이트: <a href="https://usalifecares.com" style="color:var(--blue)">usalifecares.com</a></li>
    </ul>
  </div>
</div>

<footer>
  <p>© 2026 USA Life Care · <a href="/">홈</a> · <a href="about.html">소개</a> · <a href="contact.html">문의</a></p>
</footer>
</body>
</html>`;

export default {
  async fetch(request, env) {

    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    const CATEGORIES = [
      { id: '금융 Manager', name: '금융 Manager', emoji: '💰', color: '#1a56db' },
      { id: '지역정보',     name: '지역정보',     emoji: '📍', color: '#059669' },
      { id: '미용건강',     name: '미용건강',     emoji: '✨', color: '#7c3aed' }
    ];

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // URL 정규화 리다이렉트
    const reqUrl = new URL(request.url);
    const isWww = reqUrl.hostname.startsWith("www.");
    const isHttp = reqUrl.protocol === "http:";
    const isIndexHtml = reqUrl.pathname === "/index.html";

    if (isWww || isHttp || isIndexHtml) {
      const cleanPath = isIndexHtml ? "/" : reqUrl.pathname;
      const newUrl = "https://usalifecares.com" + cleanPath + reqUrl.search;
      return Response.redirect(newUrl, 301);
    }

    const url = reqUrl;

    // ── GET / → SSR 메인 페이지 ──────────────────────────────────────
    if (request.method === 'GET' && url.pathname === '/') {
      const catParam = url.searchParams.get('cat');

      if (catParam === '금융 Manager' || catParam === '금융Manager' || catParam === '정부지원금') {
        return new Response('Gone', { status: 410 });
      }

      const normC = c => {
        if (!c) return '';
        if (c==='finance'||c==='금융 Manager'||c==='금융Manager') return 'finance';
        if (c==='region'||c==='지역정보'||c==='각 주별 지역정보') return 'region';
        if (c==='beauty'||c==='미용건강'||c==='미용 & 건강'||c==='미용&건강') return 'beauty';
        return c;
      };
      const cColor = s => s==='finance'?'#1a56db':s==='region'?'#059669':s==='beauty'?'#7c3aed':'#64748b';
      const cBg    = s => s==='finance'?'#eff6ff':s==='region'?'#f0fdf4':s==='beauty'?'#faf5ff':'#f0f4ff';
      const cLabel = s => s==='finance'?'금융 Manager':s==='region'?'지역정보':s==='beauty'?'미용 & 건강':'최신 글';

      const kvData   = await env.POSTS_KV.get('posts_data');
      const kvParsed = kvData ? JSON.parse(kvData) : { posts: [], categories: CATEGORIES };
      const allPosts = (kvParsed.posts || []).map(p => ({ ...p, category: normC(p.category) }));
      const validCat = (catParam && ['finance','region','beauty'].includes(catParam)) ? catParam : null;
      const filtered = validCat ? allPosts.filter(p => p.category === validCat) : allPosts;

      const catCounts = { finance:0, region:0, beauty:0 };
      allPosts.forEach(p => { if (catCounts[p.category] !== undefined) catCounts[p.category]++; });

      const canonicalPath = validCat ? `/?cat=${validCat}` : '/';
      const pageTitle     = validCat ? `${cLabel(validCat)} | USA Life Care` : 'USA Life Care | 미국 한인 생활정보 포털';
      const pageDesc      = '미국 한인을 위한 생활정보 포털. 금융 Manager, 각 주별 지역정보, 미용 & 건강 정보를 매일 업데이트합니다.';

      const postsHtml = filtered.slice(0, 6).map((p, i) => {
        const imgHtml = (p.image_url || p.image)
          ? `<img src="${p.image_url || p.image}" style="width:100%;height:100%;object-fit:cover;" loading="lazy" alt="">`
          : (p.thumbnail || '📝');
        return `<div class="post-card${i === 0 && !validCat ? ' featured' : ''}" onclick="location.href='/p?id=${p.id}'">
<div class="post-card-thumb" style="background:${cBg(p.category)}">${imgHtml}</div>
<div class="post-card-body">
<span class="post-card-cat" style="color:${cColor(p.category)}">${cLabel(p.category)}</span>
<h3>${p.title}</h3>
<p>${(p.summary||'').replace(/</g,'&lt;').slice(0,120)}</p>
<div class="post-card-footer">
<span class="post-card-date">${p.date}</span>
<span class="post-card-read" style="color:${cColor(p.category)}">읽기 →</span>
</div></div></div>`;
      }).join('\n');

      const catWidgetHtml = CATEGORIES.map(c => {
        const slug = normC(c.id);
        return `<li class="cat-widget-item" onclick="location.href='/?cat=${slug}'">
<div class="cat-widget-left"><span>${c.emoji}</span><span class="cat-widget-name">${c.name}</span></div>
<span class="cat-widget-count" style="background:${c.color}">${catCounts[slug]||0}</span></li>`;
      }).join('\n');

      const popularHtml = allPosts.slice(0, 5).map((p, i) =>
        `<li class="popular-item" onclick="location.href='/p?id=${p.id}'">
<span class="popular-num" style="color:${i<3?cColor(p.category):'#e2e8f0'}">${String(i+1).padStart(2,'0')}</span>
<span class="popular-title">${p.title}</span></li>`
      ).join('\n');

      const allTags  = [...new Set(allPosts.flatMap(p => p.tags||[]))].slice(0,20);
      const tagsHtml = allTags.map(t =>
        `<span class="tag" onclick="document.getElementById('searchInput').value='${t}';doSearch()">${t}</span>`
      ).join('');

      const postsJson = JSON.stringify(allPosts)
        .replace(/</g,'\\u003c').replace(/>/g,'\\u003e').replace(/&/g,'\\u0026');

      const html = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${pageTitle}</title>
<meta name="description" content="${pageDesc}">
<link rel="canonical" href="https://usalifecares.com${canonicalPath}">
<meta property="og:title" content="${pageTitle}">
<meta property="og:description" content="${pageDesc}">
<meta property="og:url" content="https://usalifecares.com${canonicalPath}">
<meta property="og:type" content="website">
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4407305858442324" crossorigin="anonymous"><\/script>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;900&family=Playfair+Display:wght@700;900&display=swap" rel="stylesheet">
<style>
:root{--navy:#0d1b3e;--blue:#1a56db;--gold:#f59e0b;--green:#059669;--purple:#7c3aed;--light:#f8fafc;--white:#fff;--gray:#64748b;--border:#e2e8f0;--text:#1e293b;}
*{margin:0;padding:0;box-sizing:border-box;}html{scroll-behavior:smooth;}
body{font-family:'Noto Sans KR',sans-serif;background:var(--light);color:var(--text);}
nav{background:var(--navy);position:sticky;top:0;z-index:100;border-bottom:3px solid var(--gold);}
.nav-inner{max-width:1200px;margin:0 auto;padding:0 5%;display:flex;align-items:center;justify-content:space-between;height:65px;}
.nav-logo{text-decoration:none;display:flex;align-items:center;gap:0.6rem;}
.nav-logo-icon{width:36px;height:36px;background:linear-gradient(135deg,var(--blue),var(--gold));border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:900;color:white;font-size:1rem;}
.nav-logo-text{font-family:'Playfair Display',serif;font-size:1.2rem;color:white;font-weight:700;}
.nav-logo-text span{color:var(--gold);}
.nav-menu{display:flex;gap:0.3rem;list-style:none;}
.nav-menu a{color:#94a3b8;text-decoration:none;font-size:0.82rem;padding:0.4rem 0.8rem;border-radius:6px;transition:all 0.2s;}
.nav-menu a:hover,.nav-menu a.active{background:rgba(255,255,255,0.1);color:white;}
.hero{background:var(--navy);background-image:url('/MainPicture.jpg');background-size:cover;background-position:center;position:relative;padding:5rem 5% 4rem;text-align:center;}
.hero::before{content:'';position:absolute;inset:0;background:linear-gradient(to bottom,rgba(5,10,30,0.78) 0%,rgba(5,10,30,0.65) 50%,rgba(5,10,30,0.85) 100%);}
.hero-inner{position:relative;z-index:2;max-width:800px;margin:0 auto;}
.hero-badge{display:inline-block;background:rgba(245,158,11,0.2);border:1px solid var(--gold);color:var(--gold);padding:0.3rem 1rem;border-radius:20px;font-size:0.75rem;margin-bottom:1.2rem;}
.hero h1{font-family:'Playfair Display',serif;font-size:clamp(2rem,5vw,3.5rem);color:white;font-weight:900;line-height:1.2;margin-bottom:0.8rem;text-shadow:0 2px 20px rgba(0,0,0,0.8);}
.hero h1 span{color:var(--gold);}
.hero p{color:#e2e8f0;font-size:1rem;line-height:1.8;margin:0 auto 2rem;max-width:600px;text-shadow:0 1px 8px rgba(0,0,0,0.8);background:rgba(0,0,0,0.3);padding:0.8rem 1.5rem;border-radius:8px;}
.search-wrap{max-width:540px;margin:0 auto;position:relative;}
.search-input{width:100%;padding:0.9rem 1.2rem;border-radius:50px;border:2px solid rgba(255,255,255,0.15);background:rgba(255,255,255,0.1);color:white;font-size:0.9rem;font-family:inherit;outline:none;}
.search-input::placeholder{color:#94a3b8;}
.search-input:focus{border-color:var(--gold);}
.search-btn{position:absolute;right:6px;top:50%;transform:translateY(-50%);background:var(--gold);border:none;padding:0.5rem 1.2rem;border-radius:40px;color:var(--navy);font-weight:700;font-size:0.82rem;cursor:pointer;font-family:inherit;}
.cat-bar{background:white;border-bottom:1px solid var(--border);}
.cat-bar-inner{max-width:1200px;margin:0 auto;padding:0 5%;display:flex;gap:0.5rem;overflow-x:auto;}
.cat-btn{display:flex;align-items:center;gap:0.5rem;padding:1rem 1.2rem;border:none;background:none;font-family:inherit;font-size:0.85rem;font-weight:600;color:var(--gray);cursor:pointer;white-space:nowrap;border-bottom:3px solid transparent;transition:all 0.2s;}
.cat-btn.active{color:var(--active-color,var(--navy));border-bottom-color:var(--active-color,var(--navy));}
.main{max-width:1200px;margin:0 auto;padding:2.5rem 5%;display:grid;grid-template-columns:1fr 320px;gap:2.5rem;}
.ad-banner{background:#f1f5f9;border:2px dashed #cbd5e1;border-radius:8px;padding:1rem;text-align:center;margin-bottom:1.5rem;}
.ad-label{font-size:0.65rem;color:#94a3b8;text-transform:uppercase;letter-spacing:2px;display:block;margin-bottom:0.3rem;}
.posts-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem;}
.posts-header h2{font-family:'Playfair Display',serif;font-size:1.4rem;font-weight:700;}
.posts-count{font-size:0.82rem;color:var(--gray);}
.posts-grid{display:grid;grid-template-columns:1fr 1fr;gap:1.2rem;}
.post-card{background:white;border-radius:12px;overflow:hidden;border:1px solid var(--border);transition:all 0.25s;cursor:pointer;display:flex;flex-direction:column;}
.post-card:hover{transform:translateY(-4px);box-shadow:0 12px 32px rgba(0,0,0,0.1);border-color:transparent;}
.post-card-thumb{height:110px;display:flex;align-items:center;justify-content:center;font-size:2.8rem;}
.post-card-body{padding:1.1rem;flex:1;display:flex;flex-direction:column;}
.post-card-cat{font-size:0.65rem;font-weight:700;letter-spacing:1px;text-transform:uppercase;margin-bottom:0.4rem;display:block;}
.post-card h3{font-size:0.92rem;font-weight:700;line-height:1.5;margin-bottom:0.4rem;color:var(--text);}
.post-card p{font-size:0.76rem;color:var(--gray);line-height:1.6;flex:1;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;}
.post-card-footer{display:flex;justify-content:space-between;align-items:center;margin-top:0.8rem;padding-top:0.7rem;border-top:1px solid var(--border);}
.post-card-date{font-size:0.68rem;color:var(--gray);}
.post-card-read{font-size:0.7rem;font-weight:700;}
.post-card.featured{grid-column:1/-1;flex-direction:row;}
.post-card.featured .post-card-thumb{width:180px;height:auto;flex-shrink:0;font-size:3.5rem;}
.post-card.featured h3{font-size:1.05rem;}
.pagination{display:flex;justify-content:center;align-items:center;gap:0.3rem;margin-top:2rem;flex-wrap:wrap;}
.page-btn{min-width:36px;height:36px;padding:0 0.5rem;border:1px solid var(--border);background:white;color:var(--gray);font-family:inherit;font-size:0.85rem;font-weight:600;border-radius:6px;cursor:pointer;transition:all 0.2s;display:flex;align-items:center;justify-content:center;}
.page-btn:hover{border-color:var(--navy);color:var(--navy);}
.page-btn.active{background:var(--navy);color:white;border-color:var(--navy);}
.sidebar{display:flex;flex-direction:column;gap:1.5rem;}
.sidebar-widget{background:white;border-radius:12px;padding:1.5rem;border:1px solid var(--border);}
.widget-title{font-family:'Playfair Display',serif;font-size:1rem;font-weight:700;margin-bottom:1rem;padding-bottom:0.8rem;border-bottom:2px solid var(--border);}
.cat-widget-list{list-style:none;}
.cat-widget-item{display:flex;justify-content:space-between;align-items:center;padding:0.7rem 0;border-bottom:1px solid var(--border);cursor:pointer;transition:all 0.2s;}
.cat-widget-item:last-child{border-bottom:none;}
.cat-widget-item:hover{transform:translateX(4px);}
.cat-widget-left{display:flex;align-items:center;gap:0.7rem;}
.cat-widget-name{font-size:0.88rem;font-weight:600;}
.cat-widget-count{font-size:0.72rem;color:white;padding:0.15rem 0.5rem;border-radius:10px;}
.popular-list{list-style:none;}
.popular-item{display:flex;gap:0.8rem;align-items:flex-start;padding:0.7rem 0;border-bottom:1px solid var(--border);cursor:pointer;}
.popular-item:last-child{border-bottom:none;}
.popular-num{font-family:'Playfair Display',serif;font-size:1.2rem;font-weight:900;flex-shrink:0;line-height:1.2;}
.popular-title{font-size:0.8rem;font-weight:600;line-height:1.5;color:var(--text);}
.tag-cloud{display:flex;flex-wrap:wrap;gap:0.4rem;}
.tag{background:var(--light);color:var(--gray);padding:0.3rem 0.8rem;border-radius:20px;font-size:0.72rem;font-weight:500;cursor:pointer;border:1px solid var(--border);transition:all 0.2s;}
.tag:hover{background:var(--navy);color:white;border-color:var(--navy);}
.ad-widget{background:#f8fafc;border:2px dashed #cbd5e1;text-align:center;padding:1.5rem 1rem;}
footer{background:var(--navy);margin-top:4rem;border-top:3px solid var(--gold);}
.footer-inner{max-width:1200px;margin:0 auto;padding:3rem 5% 1.5rem;}
.footer-top{display:grid;grid-template-columns:2fr 1fr 1fr;gap:2rem;margin-bottom:2rem;}
.footer-brand h3{font-family:'Playfair Display',serif;font-size:1.3rem;color:white;margin-bottom:0.5rem;}
.footer-brand h3 span{color:var(--gold);}
.footer-brand p{color:#64748b;font-size:0.82rem;line-height:1.7;}
.footer-col h4{color:white;font-size:0.78rem;letter-spacing:2px;text-transform:uppercase;margin-bottom:1rem;}
.footer-col ul{list-style:none;}
.footer-col li{margin-bottom:0.5rem;}
.footer-col a{color:#64748b;text-decoration:none;font-size:0.82rem;transition:color 0.2s;}
.footer-col a:hover{color:var(--gold);}
.footer-bottom{border-top:1px solid rgba(255,255,255,0.07);padding-top:1.5rem;display:flex;justify-content:space-between;flex-wrap:wrap;gap:0.5rem;}
.footer-bottom p{color:#334155;font-size:0.75rem;}
.footer-bottom a{color:#64748b;text-decoration:none;}
@media(max-width:900px){.main{grid-template-columns:1fr;}.sidebar{order:-1;}}
@media(max-width:600px){.posts-grid{grid-template-columns:1fr;}.post-card.featured{flex-direction:column;}.post-card.featured .post-card-thumb{width:100%;height:110px;}.footer-top{grid-template-columns:1fr;}.nav-menu{display:none;}}
</style>
</head>
<body>
<nav>
  <div class="nav-inner">
    <a href="/" class="nav-logo">
      <div class="nav-logo-icon">U</div>
      <div><div class="nav-logo-text">USA <span>Life</span> Care</div></div>
    </a>
    <ul class="nav-menu">
      <li><a href="/" class="${!validCat?'active':''}">홈</a></li>
      <li><a href="/?cat=finance" class="${validCat==='finance'?'active':''}">💰 금융 Manager</a></li>
      <li><a href="/?cat=region" class="${validCat==='region'?'active':''}">📍 각 주별 지역정보</a></li>
      <li><a href="/?cat=beauty" class="${validCat==='beauty'?'active':''}">✨ 미용 &amp; 건강</a></li>
      <li><a href="/about.html">소개</a></li>
    </ul>
  </div>
</nav>
<section class="hero">
  <div class="hero-inner">
    <div class="hero-badge">✨ 매일 새로운 정보 업데이트</div>
    <h1>미국 한인을 위한<br><span>Life Care</span> 정보</h1>
    <p>금융 Manager, 각 주별 지역정보, 미용 &amp; 건강까지 — 미국 생활에 꼭 필요한 정보를 매일 업데이트합니다.</p>
    <div class="search-wrap">
      <input class="search-input" type="text" id="searchInput" placeholder="🔍 검색하세요... (예: SNAP 신청방법)" onkeydown="if(event.key==='Enter')doSearch()">
      <button class="search-btn" onclick="doSearch()">검색</button>
    </div>
  </div>
</section>
<div class="cat-bar">
  <div class="cat-bar-inner">
    <button class="cat-btn${!validCat?' active':''}" style="--active-color:var(--navy)" onclick="location.href='/'">📋 전체</button>
    <button class="cat-btn${validCat==='finance'?' active':''}" style="--active-color:var(--blue)" onclick="location.href='/?cat=finance'">💰 금융 Manager</button>
    <button class="cat-btn${validCat==='region'?' active':''}" style="--active-color:var(--green)" onclick="location.href='/?cat=region'">📍 각 주별 지역정보</button>
    <button class="cat-btn${validCat==='beauty'?' active':''}" style="--active-color:var(--purple)" onclick="location.href='/?cat=beauty'">✨ 미용 &amp; 건강</button>
  </div>
</div>
<div class="main">
  <div>
    <div class="ad-banner">
      <span class="ad-label">Advertisement</span>
      <ins class="adsbygoogle" style="display:inline-block;width:728px;max-width:100%;height:90px" data-ad-client="ca-pub-4407305858442324" data-ad-slot="auto"></ins>
      <script>(adsbygoogle=window.adsbygoogle||[]).push({});<\/script>
    </div>
    <div class="posts-header">
      <h2 id="postsTitle">${validCat ? cLabel(validCat) : '최신 글'}</h2>
      <span class="posts-count" id="postsCount">총 ${filtered.length}개</span>
    </div>
    <div class="posts-grid" id="postsGrid">${postsHtml}</div>
    <div class="pagination" id="pagination"></div>
  </div>
  <aside class="sidebar">
    <div class="sidebar-widget ad-widget">
      <div class="ad-label">Advertisement</div>
      <ins class="adsbygoogle" style="display:inline-block;width:300px;height:250px" data-ad-client="ca-pub-4407305858442324" data-ad-slot="auto"></ins>
      <script>(adsbygoogle=window.adsbygoogle||[]).push({});<\/script>
    </div>
    <div class="sidebar-widget">
      <div class="widget-title">📂 카테고리</div>
      <ul class="cat-widget-list">${catWidgetHtml}</ul>
    </div>
    <div class="sidebar-widget">
      <div class="widget-title">🔥 인기 글</div>
      <ul class="popular-list">${popularHtml}</ul>
    </div>
    <div class="sidebar-widget">
      <div class="widget-title">🏷️ 태그</div>
      <div class="tag-cloud">${tagsHtml}</div>
    </div>
  </aside>
</div>
<footer>
  <div class="footer-inner">
    <div class="footer-top">
      <div class="footer-brand">
        <h3>USA <span>Life</span> Care</h3>
        <p>미국 한인을 위한 전문 생활정보 포털입니다.</p>
      </div>
      <div class="footer-col">
        <h4>카테고리</h4>
        <ul>
          <li><a href="/?cat=finance">💰 금융 Manager</a></li>
          <li><a href="/?cat=region">📍 각 주별 지역정보</a></li>
          <li><a href="/?cat=beauty">✨ 미용 &amp; 건강</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>사이트</h4>
        <ul>
          <li><a href="/about.html">소개</a></li>
          <li><a href="/contact.html">문의하기</a></li>
          <li><a href="/privacy.html">개인정보처리방침</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <p>© 2026 USA Life Care. All rights reserved.</p>
      <p><a href="/privacy.html">개인정보처리방침</a> · <a href="/about.html">소개</a> · <a href="/contact.html">문의</a></p>
    </div>
  </div>
</footer>
<script>
const __POSTS__ = ${postsJson};
const __CAT__   = '${validCat||''}';
const PER_PAGE  = 6;
let filteredPosts = __CAT__ ? __POSTS__.filter(p=>p.category===__CAT__) : [...__POSTS__];
let currentPage   = 1;

const normC2  = c => { if(!c)return''; if(c==='finance'||c==='금융 Manager'||c==='금융Manager')return'finance'; if(c==='region'||c==='지역정보')return'region'; if(c==='beauty'||c==='미용건강'||c==='미용 & 건강')return'beauty'; return c; };
const cColor2 = s => s==='finance'?'#1a56db':s==='region'?'#059669':s==='beauty'?'#7c3aed':'#64748b';
const cBg2    = s => s==='finance'?'#eff6ff':s==='region'?'#f0fdf4':s==='beauty'?'#faf5ff':'#f0f4ff';
const cLabel2 = s => s==='finance'?'금융 Manager':s==='region'?'지역정보':s==='beauty'?'미용 & 건강':'최신 글';

function renderGrid() {
  const total = Math.ceil(filteredPosts.length / PER_PAGE);
  if (currentPage > total) currentPage = 1;
  const slice = filteredPosts.slice((currentPage-1)*PER_PAGE, currentPage*PER_PAGE);
  document.getElementById('postsGrid').innerHTML = slice.map((p,i) => {
    const thumb = (p.image_url||p.image)
      ? '<img src="'+(p.image_url||p.image)+'" style="width:100%;height:100%;object-fit:cover;" loading="lazy" alt="">'
      : (p.thumbnail||'📝');
    return '<div class="post-card'+(i===0&&currentPage===1&&!__CAT__?' featured':'')+'" onclick="location.href=\'/p?id='+p.id+'\'">'
      +'<div class="post-card-thumb" style="background:'+cBg2(p.category)+'">'+thumb+'</div>'
      +'<div class="post-card-body">'
      +'<span class="post-card-cat" style="color:'+cColor2(p.category)+'">'+cLabel2(p.category)+'</span>'
      +'<h3>'+p.title+'</h3><p>'+(p.summary||'')+'</p>'
      +'<div class="post-card-footer">'
      +'<span class="post-card-date">'+p.date+'</span>'
      +'<span class="post-card-read" style="color:'+cColor2(p.category)+'">읽기 →</span>'
      +'</div></div></div>';
  }).join('');
  document.getElementById('postsCount').textContent = '총 '+filteredPosts.length+'개';
  renderPagination(total);
}

function renderPagination(total) {
  const pg = document.getElementById('pagination');
  if (total <= 1) { pg.innerHTML=''; return; }
  let h = '<button class="page-btn" onclick="goPage('+(currentPage-1)+')" '+(currentPage===1?'disabled':'')+'>&#8249;</button>';
  for (let i=1; i<=total; i++) {
    if (i===1||i===total||Math.abs(i-currentPage)<=2)
      h += '<button class="page-btn'+(i===currentPage?' active':'')+'" onclick="goPage('+i+')">'+i+'</button>';
    else if (Math.abs(i-currentPage)===3)
      h += '<span class="page-ellipsis">&hellip;</span>';
  }
  h += '<button class="page-btn" onclick="goPage('+(currentPage+1)+')" '+(currentPage===total?'disabled':'')+'>&#8250;</button>';
  pg.innerHTML = h;
}

function goPage(p) {
  const total = Math.ceil(filteredPosts.length/PER_PAGE);
  if (p<1||p>total) return;
  currentPage = p;
  renderGrid();
  window.scrollTo({top:document.getElementById('postsGrid').offsetTop-80,behavior:'smooth'});
}

function doSearch() {
  const q = document.getElementById('searchInput').value.toLowerCase().trim();
  const base = __CAT__ ? __POSTS__.filter(p=>p.category===__CAT__) : [...__POSTS__];
  filteredPosts = q ? base.filter(p =>
    p.title.toLowerCase().includes(q)||(p.summary||'').toLowerCase().includes(q)||
    (p.tags||[]).some(t=>t.toLowerCase().includes(q))
  ) : base;
  document.getElementById('postsTitle').textContent = q ? '"'+q+'" 검색 결과' : (cLabel2(__CAT__)||'최신 글');
  currentPage = 1;
  renderGrid();
}

if (filteredPosts.length > PER_PAGE) renderPagination(Math.ceil(filteredPosts.length/PER_PAGE));
<\/script>
</body>
</html>`;

      return new Response(html, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
        },
      });
    }

    // 옛날 /post?id= URL → 410 Gone
    if (url.pathname === "/post") {
      return new Response('Gone', { status: 410 });
    }
    
    // ── GET /p?id=XX  →  서버사이드 렌더링 (Google 인덱싱용) ──────────
    if (request.method === 'GET' && url.pathname === '/p') {
      const id = url.searchParams.get('id');
      if (!id) {
        return new Response('Not found', { status: 404 });
      }

      const data = await env.POSTS_KV.get('posts_data');
      const parsed = data ? JSON.parse(data) : { posts: [] };
      const posts = parsed.posts || [];
      const post = posts.find(p => String(p.id) === String(id));

      if (!post) {
        //return new Response('Post not found', { status: 404 });
        return new Response('Gone', { status: 410 });
      }

      const catColor = c => c === '지역정보' ? '#059669' : c === '미용건강' ? '#7c3aed' : '#1a56db';
      const catBg    = c => c === '지역정보' ? '#f0fdf4' : c === '미용건강' ? '#faf5ff' : '#eff6ff';

      function parseContent(text) {
        if (!text) return '';
        // 이미 HTML인 경우 그대로 반환
        if (text.trim().startsWith('<')) return text;
        return text.split('\n').map(line => {
          if (line.startsWith('## '))  return `<h2>${line.slice(3)}</h2>`;
          if (line.startsWith('### ')) return `<h3>${line.slice(4)}</h3>`;
          if (line.startsWith('- '))   return `<li>${line.slice(2)}</li>`;
          if (line.trim() === '')      return '';
          return `<p>${line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</p>`;
        }).join('\n').replace(/(<li>.*<\/li>\n?)+/g, m => `<ul>${m}</ul>`);
      }

      const idx  = posts.indexOf(post);
      const prev = posts[idx - 1];
      const next = posts[idx + 1];

      const related = posts
        .filter(p => p.category === post.category && p.id !== post.id)
        .slice(0, 5);

      const relatedHtml = related.map(p => `
        <li class="related-item">
          <a href="/p?id=${p.id}"><h4>${p.title}</h4></a>
          <div class="date">${p.date}</div>
        </li>`).join('');

      const prevHtml = prev
        ? `<a class="post-nav-item" href="/p?id=${prev.id}">
             <div class="post-nav-label">← 이전 글</div>
             <div class="post-nav-title">${prev.title}</div>
           </a>`
        : '<div></div>';

      const nextHtml = next
        ? `<a class="post-nav-item next" href="/p?id=${next.id}">
             <div class="post-nav-label">다음 글 →</div>
             <div class="post-nav-title">${next.title}</div>
           </a>`
        : '<div></div>';

      const tagsHtml = (post.tags || [])
        .map(t => `<span class="article-tag">#${t}</span>`).join('');

      const imgSrc = post.image_url || post.image || '';
      const thumbHtml = imgSrc
        ? `<img src="${imgSrc}" style="width:100%;height:auto;max-height:500px;object-fit:contain;border-radius:8px;display:block;" alt="${post.title}">`
        : `<div style="font-size:5rem;text-align:center;padding:2rem;">${post.thumbnail || '📝'}</div>`;

      const html = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${post.title} | USA Life Care</title>
<meta name="description" content="${(post.summary || post.title).replace(/"/g, '&quot;').replace(/\n/g, ' ').slice(0, 160)}">
<meta property="og:title" content="${post.title} | USA Life Care">
<meta property="og:description" content="${(post.summary || post.title).replace(/"/g, '&quot;').slice(0, 160)}">
<meta property="og:image" content="${imgSrc}">
<meta property="og:url" content="https://usalifecares.com/p?id=${post.id}">
<meta property="og:type" content="article">
<link rel="canonical" href="https://usalifecares.com/p?id=${post.id}">
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;900&family=Playfair+Display:wght@700;900&display=swap" rel="stylesheet">
<style>
:root{--navy:#0d1b3e;--blue:#1a56db;--gold:#f59e0b;--green:#059669;--purple:#7c3aed;--light:#f8fafc;--white:#fff;--gray:#64748b;--border:#e2e8f0;--text:#1e293b;}
*{margin:0;padding:0;box-sizing:border-box;}
body{font-family:'Noto Sans KR',sans-serif;background:var(--light);color:var(--text);}
nav{background:var(--navy);position:sticky;top:0;z-index:100;border-bottom:3px solid var(--gold);}
.nav-inner{max-width:1200px;margin:0 auto;padding:0 5%;display:flex;align-items:center;justify-content:space-between;height:65px;}
.nav-logo{text-decoration:none;display:flex;align-items:center;gap:0.6rem;}
.nav-logo-icon{width:36px;height:36px;background:linear-gradient(135deg,var(--blue),var(--gold));border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:900;color:white;}
.nav-logo-text{font-family:'Playfair Display',serif;font-size:1.2rem;color:white;font-weight:700;}
.nav-logo-text span{color:var(--gold);}
.nav-back{color:#94a3b8;text-decoration:none;font-size:0.82rem;border:1px solid #334155;padding:0.3rem 0.8rem;border-radius:20px;}
.main{max-width:1200px;margin:0 auto;padding:2.5rem 5%;display:grid;grid-template-columns:1fr 300px;gap:2.5rem;}
.article{background:white;border-radius:12px;padding:2.5rem;border:1px solid var(--border);}
.article-header{margin-bottom:2rem;padding-bottom:1.5rem;border-bottom:1px solid var(--border);}
.article-cat{display:inline-block;font-size:0.72rem;font-weight:700;letter-spacing:2px;text-transform:uppercase;padding:0.3rem 0.8rem;border-radius:20px;margin-bottom:1rem;}
.article h1{font-family:'Playfair Display',serif;font-size:clamp(1.5rem,3vw,2.2rem);font-weight:700;line-height:1.4;margin-bottom:1rem;color:var(--text);}
.article-meta{display:flex;gap:1.5rem;font-size:0.8rem;color:var(--gray);}
.article-thumb{border-radius:8px;margin-bottom:2rem;overflow:hidden;}
.article-thumb img{width:100%;height:auto;max-height:500px;object-fit:contain;display:block;}
.article-content{font-size:0.96rem;line-height:1.9;color:#334155;}
.article-content h2{font-family:'Playfair Display',serif;font-size:1.3rem;font-weight:700;margin:2rem 0 0.8rem;color:var(--text);}
.article-content h3{font-size:1.05rem;font-weight:700;margin:1.5rem 0 0.6rem;color:var(--text);}
.article-content p{margin-bottom:1rem;}
.article-content ul,ol{margin:0.8rem 0 1rem 1.5rem;}
.article-content li{margin-bottom:0.4rem;line-height:1.7;}
.article-content strong{font-weight:700;color:var(--text);}
.article-tags{display:flex;flex-wrap:wrap;gap:0.4rem;margin-top:2rem;padding-top:1.5rem;border-top:1px solid var(--border);}
.article-tag{background:var(--light);color:var(--gray);padding:0.3rem 0.8rem;border-radius:20px;font-size:0.72rem;border:1px solid var(--border);}
.post-nav{display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-top:2rem;padding-top:1.5rem;border-top:1px solid var(--border);}
.post-nav-item{background:var(--light);border-radius:8px;padding:1rem;border:1px solid var(--border);text-decoration:none;display:block;color:var(--text);}
.post-nav-item:hover{border-color:var(--blue);background:white;}
.post-nav-label{font-size:0.68rem;color:var(--gray);text-transform:uppercase;letter-spacing:1px;margin-bottom:0.3rem;}
.post-nav-title{font-size:0.82rem;font-weight:600;color:var(--text);line-height:1.4;}
.post-nav-item.next{text-align:right;}
.ad-box{background:#f8fafc;border:2px dashed #cbd5e1;border-radius:8px;padding:1.5rem;text-align:center;margin:2rem 0;}
.ad-label{font-size:0.65rem;color:#94a3b8;text-transform:uppercase;letter-spacing:2px;display:block;margin-bottom:0.5rem;}
.sidebar{display:flex;flex-direction:column;gap:1.5rem;}
.sidebar-widget{background:white;border-radius:12px;padding:1.5rem;border:1px solid var(--border);}
.widget-title{font-family:'Playfair Display',serif;font-size:1rem;font-weight:700;margin-bottom:1rem;padding-bottom:0.8rem;border-bottom:2px solid var(--border);}
.related-list{list-style:none;}
.related-item{padding:0.7rem 0;border-bottom:1px solid var(--border);}
.related-item:last-child{border-bottom:none;}
.related-item a{text-decoration:none;}
.related-item h4{font-size:0.82rem;font-weight:600;line-height:1.5;color:var(--text);}
.related-item h4:hover{color:var(--blue);}
.related-item .date{font-size:0.68rem;color:var(--gray);margin-top:0.2rem;}
.ad-widget{background:#f8fafc;border:2px dashed #cbd5e1;text-align:center;padding:1.5rem 1rem;}
footer{background:var(--navy);margin-top:4rem;border-top:3px solid var(--gold);}
.footer-inner{max-width:1200px;margin:0 auto;padding:2rem 5%;}
.footer-bottom{display:flex;justify-content:space-between;flex-wrap:wrap;gap:0.5rem;}
.footer-bottom p{color:#334155;font-size:0.75rem;}
.footer-bottom a{color:#64748b;text-decoration:none;}
@media(max-width:900px){.main{grid-template-columns:1fr;}.sidebar{order:-1;}}
@media(max-width:600px){.article{padding:1.5rem;}.post-nav{grid-template-columns:1fr;}}
</style>
</head>
<body>
<nav>
  <div class="nav-inner">
    <a href="/" class="nav-logo">
      <div class="nav-logo-icon">U</div>
      <div><div class="nav-logo-text">USA <span>Life</span> Care</div></div>
    </a>
    <a href="/" class="nav-back">← 목록으로</a>
  </div>
</nav>

<div class="main">
  <div>
    <article class="article">
      <div class="article-header">
        <span class="article-cat" style="background:${catBg(post.category)};color:${catColor(post.category)}">${post.category}</span>
        <h1>${post.title}</h1>
        <div class="article-meta">
          <span>📅 ${post.date}</span>
        </div>
      </div>
      <div class="article-thumb" style="background:${imgSrc ? 'transparent' : catBg(post.category)};padding:${imgSrc ? '0' : '2rem'}">
        ${thumbHtml}
      </div>
      <div class="ad-box">
        <span class="ad-label">Advertisement</span>
        <div style="height:90px;display:flex;align-items:center;justify-content:center;color:#94a3b8;font-size:0.8rem;">Google AdSense 광고 영역 (728×90)</div>
      </div>
      <div class="article-content">
        ${parseContent(post.content)}
      </div>
      <div class="article-tags">${tagsHtml}</div>
      <div class="post-nav">
        ${prevHtml}
        ${nextHtml}
      </div>
    </article>
  </div>

  <aside class="sidebar">
    <div class="sidebar-widget ad-widget">
      <div class="ad-label">Advertisement</div>
      <div style="height:250px;display:flex;align-items:center;justify-content:center;color:#94a3b8;font-size:0.8rem;flex-direction:column;gap:0.3rem;"><span>Google AdSense</span><span>300×250</span></div>
    </div>
    <div class="sidebar-widget">
      <div class="widget-title">📌 관련 글</div>
      <ul class="related-list">${relatedHtml}</ul>
    </div>
  </aside>
</div>

<footer>
  <div class="footer-inner">
    <div class="footer-bottom">
      <p>© 2026 USA Life Care. All rights reserved.</p>
      <p><a href="/privacy.html">개인정보처리방침</a> · <a href="/about.html">소개</a> · <a href="/">홈</a></p>
    </div>
  </div>
</footer>
</body>
</html>`;

      return new Response(html, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, max-age=3600',
        },
      });
    }

    // ── GET /sitemap.xml ─────────────────────────────────────────
    if (request.method === 'GET' && url.pathname === '/sitemap.xml') {
      const data = await env.POSTS_KV.get('posts_data');
      const parsed = data ? JSON.parse(data) : { posts: [] };
      const posts = parsed.posts || [];

      const staticUrls = [
        { loc: 'https://usalifecares.com/', changefreq: 'daily', priority: '1.0' },
        { loc: 'https://usalifecares.com/about.html', changefreq: 'monthly', priority: '0.8' },
        { loc: 'https://usalifecares.com/contact.html', changefreq: 'monthly', priority: '0.8' },
        { loc: 'https://usalifecares.com/privacy.html', changefreq: 'monthly', priority: '0.5' },
      ];

      const postUrls = posts.map(p => ({
        loc: `https://usalifecares.com/p?id=${p.id}`,
        lastmod: p.date || new Date().toISOString().split('T')[0],
        changefreq: 'monthly',
        priority: '0.7',
      }));

      const allUrls = [...staticUrls, ...postUrls];

      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(u => `  <url>
    <loc>${u.loc}</loc>
    ${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

      return new Response(xml, {
        headers: {
          'Content-Type': 'application/xml; charset=utf-8',
          'Cache-Control': 'public, max-age=3600',
          ...corsHeaders,
        },
      });
    }

    // ── GET /posts ──────────────────────────────────────────────
    if (request.method === 'GET' && url.pathname === '/posts') {
      const data = await env.POSTS_KV.get('posts_data');
      if (!data) {
        return new Response(JSON.stringify({ posts: [], categories: CATEGORIES }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' },
        });
      }
      const parsed = JSON.parse(data);
      if (!parsed.categories) parsed.categories = CATEGORIES;
      return new Response(JSON.stringify(parsed), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' },
      });
    }

    // ── POST /add-post ───────────────────────────────────────────
    if (request.method === 'POST' && url.pathname === '/add-post') {
      const authHeader = request.headers.get('Authorization');
      if (authHeader !== `Bearer ${env.WORKER_SECRET}`) {
        return new Response('Unauthorized', { status: 401 });
      }

      try {
        const newPost = await request.json();

        if (!newPost.content || newPost.content.trim() === '') {
          return new Response(JSON.stringify({ success: false, reason: 'content is empty' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' },
          });
        }

        const existing = await env.POSTS_KV.get('posts_data');
        let postsData = existing ? JSON.parse(existing) : { posts: [], categories: CATEGORIES };
        if (!postsData.categories) postsData.categories = CATEGORIES;

        newPost.tags = newPost.tags || (newPost.keywords ? newPost.keywords.split(',') : []);
        newPost.summary = newPost.summary || newPost.title;
        newPost.thumbnail = newPost.thumbnail || '📝';

        const slug = newPost.title
          .replace(/[^가-힣a-zA-Z0-9\s]/g, '')
          .replace(/\s+/g, '-')
          .slice(0, 50)
          .toLowerCase();

        newPost.slug = slug;
        newPost.date = newPost.date || new Date().toISOString().split('T')[0];

        const existingIndex = postsData.posts.findIndex(p => p.id === newPost.id);
        if (existingIndex !== -1) {
          postsData.posts[existingIndex] = newPost;
        } else {
          postsData.posts.unshift(newPost);
        }

        await env.POSTS_KV.put('posts_data', JSON.stringify(postsData));

        return new Response(JSON.stringify({ success: true, slug }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' },
        });

      } catch (err) {
        return new Response(`Error: ${err.message}`, { status: 500 });
      }
    }

    // ── POST /delete-post ────────────────────────────────────────
    if (request.method === 'POST' && url.pathname === '/delete-post') {
      const authHeader = request.headers.get('Authorization');
      if (authHeader !== `Bearer ${env.WORKER_SECRET}`) {
        return new Response('Unauthorized', { status: 401 });
      }

      try {
        const { id } = await request.json();
        if (!id) {
          return new Response(JSON.stringify({ success: false, reason: 'id is required' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' },
          });
        }

        const existing = await env.POSTS_KV.get('posts_data');
        if (!existing) {
          return new Response(JSON.stringify({ success: false, reason: 'no posts found' }), {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' },
          });
        }

        let postsData = JSON.parse(existing);
        const before = postsData.posts.length;
        postsData.posts = postsData.posts.filter(p => p.id !== id);

        if (postsData.posts.length === before) {
          return new Response(JSON.stringify({ success: false, reason: 'post not found' }), {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' },
          });
        }

        await env.POSTS_KV.put('posts_data', JSON.stringify(postsData));

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' },
        });

      } catch (err) {
        return new Response(`Error: ${err.message}`, { status: 500 });
      }
    }

    // ── POST /clear-posts ────────────────────────────────────────
    if (request.method === 'POST' && url.pathname === '/clear-posts') {
      const authHeader = request.headers.get('Authorization');
      if (authHeader !== `Bearer ${env.WORKER_SECRET}`) {
        return new Response('Unauthorized', { status: 401 });
      }
      await env.POSTS_KV.put('posts_data', JSON.stringify({ posts: [], categories: CATEGORIES }));
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' },
      });
    }

    // ── GET /ads.txt ─────────────────────────────────────────────
    if (request.method === 'GET' && url.pathname === '/ads.txt') {
      return new Response('google.com, pub-4407305858442324, DIRECT, f08c47fec0942fa0', {
        headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=86400' },
      });
    }

    // ── GET /robots.txt ───────────────────────────────────────────
    if (request.method === 'GET' && url.pathname === '/robots.txt') {
      const robots = 'User-agent: *
Allow: /

Sitemap: https://usalifecares.com/sitemap.xml';
      return new Response(robots, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=86400' },
      });
    }

    // ── GET /about.html ──────────────────────────────────────────
    if (request.method === 'GET' && url.pathname === '/about.html') {
      return new Response(ABOUT_HTML, {
        headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=86400' },
      });
    }

    // ── GET /contact.html ─────────────────────────────────────────
    if (request.method === 'GET' && url.pathname === '/contact.html') {
      return new Response(CONTACT_HTML, {
        headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=86400' },
      });
    }

    // ── GET /privacy.html ─────────────────────────────────────────
    if (request.method === 'GET' && url.pathname === '/privacy.html') {
      return new Response(PRIVACY_HTML, {
        headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=86400' },
      });
    }

    return new Response('Not found', { status: 404 });
  },
};
