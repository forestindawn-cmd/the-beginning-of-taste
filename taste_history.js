/**
 * taste_history.js
 * 인간은 언제, 왜 '맛'에 눈떴는가 — 인터랙션 스크립트
 */

(function () {
  'use strict';

  /* ── 1. 네비게이션 활성 링크 하이라이트 ── */
  const navLinks = document.querySelectorAll('.timeline-nav li a');
  const sections = [];

  navLinks.forEach(link => {
    const id = link.getAttribute('href').replace('#', '');
    const el = document.getElementById(id);
    if (el) sections.push({ id, el, link });
  });

  function updateActiveNav() {
    const scrollY = window.scrollY + 120; // 네비 높이 오프셋
    let current = sections[0];

    sections.forEach(sec => {
      if (scrollY >= sec.el.offsetTop) current = sec;
    });

    navLinks.forEach(l => l.classList.remove('active'));
    if (current) current.link.classList.add('active');
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

  /* ── 2. 섹션 페이드인 (IntersectionObserver) ── */
  const fadeTargets = document.querySelectorAll(
    '.chapter, .modern-intro, .ch8-hero, .conclusion'
  );

  const fadeObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          fadeObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08 }
  );

  fadeTargets.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.65s ease, transform 0.65s ease';
    fadeObserver.observe(el);
  });

  /* visible 상태 CSS 처리 — JS에서 직접 적용 */
  document.addEventListener('scroll', () => {}, { passive: true }); // wake passive listener

  // IntersectionObserver 콜백에서 style 직접 조작
  const visObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          visObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08 }
  );

  fadeTargets.forEach(el => visObserver.observe(el));

  /* ── 3. 트렌드 카드 호버 효과 보조 (touch 대응) ── */
  const trendCards = document.querySelectorAll('.trend-card');

  trendCards.forEach(card => {
    card.addEventListener('touchstart', () => card.classList.add('touch-hover'), { passive: true });
    card.addEventListener('touchend', () => {
      setTimeout(() => card.classList.remove('touch-hover'), 300);
    }, { passive: true });
  });

  /* ── 4. 도시 테이블 행 클릭 → 상세 펼침 토글 ── */
  const tableRows = document.querySelectorAll('.city-table tbody tr[data-detail]');

  tableRows.forEach(row => {
    row.style.cursor = 'pointer';
    row.addEventListener('click', () => {
      const detailId = row.dataset.detail;
      const detailRow = document.getElementById(detailId);
      if (!detailRow) return;

      const isOpen = detailRow.style.display === 'table-row';
      detailRow.style.display = isOpen ? 'none' : 'table-row';
      row.classList.toggle('row-open', !isOpen);
    });
  });

  /* ── 5. 상단으로 스크롤 버튼 (동적 삽입) ── */
  const backTop = document.createElement('button');
  backTop.id = 'back-top';
  backTop.setAttribute('aria-label', '맨 위로');
  backTop.innerHTML = '↑';
  backTop.style.cssText = [
    'position:fixed', 'bottom:32px', 'right:28px',
    'width:44px', 'height:44px', 'border-radius:50%',
    'background:var(--amber)', 'color:#fff',
    'border:none', 'font-size:18px', 'line-height:44px',
    'text-align:center', 'cursor:pointer',
    'opacity:0', 'pointer-events:none',
    'transition:opacity 0.3s', 'z-index:200',
    'box-shadow:0 2px 12px rgba(184,115,42,0.35)'
  ].join(';');

  document.body.appendChild(backTop);

  backTop.addEventListener('click', () =>
    window.scrollTo({ top: 0, behavior: 'smooth' })
  );

  window.addEventListener('scroll', () => {
    const show = window.scrollY > 600;
    backTop.style.opacity = show ? '1' : '0';
    backTop.style.pointerEvents = show ? 'auto' : 'none';
  }, { passive: true });

})();
