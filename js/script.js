/* ============================================================
   青鸾传世 Replica - Interactions
   ============================================================ */

(function () {
  'use strict';

  /* ---------- 1. 加载动画遮罩 ---------- */
  window.addEventListener('load', function () {
    var overlay = document.getElementById('loading-overlay');
    if (overlay) {
      setTimeout(function () {
        overlay.classList.add('hidden');
      }, 600);
    }
  });

  /* ---------- 2. 页头滚动效果 ---------- */
  var header = document.getElementById('header');
  function handleScroll() {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', handleScroll);

  /* ---------- 3. 主页轮播 ---------- */
  var slides = document.querySelectorAll('.slide');
  var dots = document.querySelectorAll('.carousel-dots .dot');
  var prevBtn = document.querySelector('.carousel-arrows .prev');
  var nextBtn = document.querySelector('.carousel-arrows .next');
  var current = 0;
  var total = slides.length;
  var autoTimer = null;

  function showSlide(index) {
    // 循环处理
    current = (index + total) % total;
    slides.forEach(function (s, i) {
      s.classList.toggle('active', i === current);
    });
    dots.forEach(function (d, i) {
      d.classList.toggle('active', i === current);
    });
    // 重置文字动画
    var content = slides[current].querySelector('.slide-content');
    if (content) {
      content.style.animation = 'none';
      content.offsetHeight; // 触发重排以重启动画
      content.style.animation = '';
    }
  }

  function nextSlide() { showSlide(current + 1); }
  function prevSlide() { showSlide(current - 1); }

  // 自动播放
  function startAuto() {
    stopAuto();
    autoTimer = setInterval(nextSlide, 6000);
  }
  function stopAuto() {
    if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
  }

  if (nextBtn) nextBtn.addEventListener('click', function () { nextSlide(); startAuto(); });
  if (prevBtn) prevBtn.addEventListener('click', function () { prevSlide(); startAuto(); });

  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      showSlide(parseInt(dot.getAttribute('data-index'), 10));
      startAuto();
    });
  });

  // 鼠标悬停暂停自动播放
  var carousel = document.querySelector('.homepage-carousel');
  if (carousel) {
    carousel.addEventListener('mouseenter', stopAuto);
    carousel.addEventListener('mouseleave', startAuto);
  }

  startAuto();

  /* ---------- 4. 数字滚动动画 ---------- */
  function animateCount(el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    var duration = 1600;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      // easing
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target + '+';
      }
    }
    requestAnimationFrame(step);
  }

  // Intersection Observer - 进入视口时触发数字动画
  var counted = false;
  var statsEl = document.querySelector('.stats');
  if (statsEl && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !counted) {
          counted = true;
          document.querySelectorAll('.stat .num').forEach(animateCount);
          observer.disconnect();
        }
      });
    }, { threshold: 0.3 });
    observer.observe(statsEl);
  } else {
    document.querySelectorAll('.stat .num').forEach(function (el) {
      el.textContent = el.getAttribute('data-count') + '+';
    });
  }

  /* ---------- 5. 滚动显示动画 ---------- */
  if ('IntersectionObserver' in window) {
    var revealEls = document.querySelectorAll('.project-card, .service-item, .news-card, .section-label, .about-section h2, .slide-content, .member-card');
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealEls.forEach(function (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      revealObserver.observe(el);
    });
  }

    /* ---------- 6. 团队成员详情展开 ---------- */
  var memberCards = document.querySelectorAll('.member-card');
  var memberOverlay = document.getElementById('member-overlay');

  function closeMember() {
    if (memberOverlay) memberOverlay.classList.remove('open');
    document.body.classList.remove('modal-open');
  }

  memberCards.forEach(function (card) {
    card.addEventListener('click', function () {
      if (!memberOverlay) return;
      var name = card.getAttribute('data-name') || '';
      var role = card.getAttribute('data-role') || '';
      var bio = card.getAttribute('data-bio') || '';
      var imgClass = card.getAttribute('data-img') || 'b1';
      var nameEl = memberOverlay.querySelector('.modal-name');
      var roleEl = memberOverlay.querySelector('.modal-role');
      var bioEl = memberOverlay.querySelector('.modal-bio');
      var imgEl = memberOverlay.querySelector('.modal-avatar');
      if (nameEl) nameEl.textContent = name;
      if (roleEl) roleEl.textContent = role;
      if (bioEl) bioEl.textContent = bio;
      imgEl.className = 'modal-avatar ' + imgClass;
      memberOverlay.classList.add('open');
      document.body.classList.add('modal-open');
    });
  });

  var memberClose = document.querySelector('.member-overlay-close');
  if (memberClose) memberClose.addEventListener('click', closeMember);
  if (memberOverlay) memberOverlay.addEventListener('click', function (e) {
    if (e.target === memberOverlay) closeMember();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMember();
  });

})();