// Newsletter Subscription Client Script for Medi Waves
(function () {
  'use strict';

  function getApiEndpoint() {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:8081/api/newsletter';
    }
    return '/api/newsletter';
  }

  function initNewsletter() {
    const containers = document.querySelectorAll('.footer-newsletter');
    containers.forEach((container) => {
      if (container.dataset.newsletterInited) return;
      container.dataset.newsletterInited = 'true';

      const input = container.querySelector('input[type="email"], input');
      const btn = container.querySelector('button');
      if (!input || !btn) return;

      let statusMsg = container.parentElement.querySelector('.footer-newsletter-status');
      if (!statusMsg) {
        statusMsg = document.createElement('div');
        statusMsg.className = 'footer-newsletter-status';
        statusMsg.style.cssText = 'font-size:12.5px;margin-top:8px;transition:opacity .3s;min-height:18px;line-height:1.4;';
        container.parentElement.appendChild(statusMsg);
      }

      function showStatus(text, isError) {
        statusMsg.textContent = text;
        statusMsg.style.color = isError ? '#FF6B6B' : '#4EBE88';
        statusMsg.style.opacity = '1';
      }

      async function handleSubmit(e) {
        if (e) e.preventDefault();
        const email = input.value.trim();

        if (!email) {
          showStatus('Please enter your email address.', true);
          input.focus();
          return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          showStatus('Please enter a valid email address.', true);
          input.focus();
          return;
        }

        const originalBtnText = btn.textContent;
        btn.disabled = true;
        btn.textContent = 'Joining...';
        showStatus('Subscribing...', false);

        try {
          const res = await fetch(getApiEndpoint(), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, source: 'footer_newsletter' }),
          });

          const data = await res.json().catch(() => ({}));

          if (res.ok && data.ok) {
            showStatus(data.message || 'Thank you for subscribing!', false);
            input.value = '';
          } else {
            showStatus(data.error || 'Failed to subscribe. Please try again.', true);
          }
        } catch (err) {
          showStatus('Could not connect to service. Please try again later.', true);
        } finally {
          btn.disabled = false;
          btn.textContent = originalBtnText;
        }
      }

      btn.addEventListener('click', handleSubmit);
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleSubmit();
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNewsletter);
  } else {
    initNewsletter();
  }
})();
