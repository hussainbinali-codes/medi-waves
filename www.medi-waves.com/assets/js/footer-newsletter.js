(function () {
  var SUBSCRIBE_API_URL = (location.hostname === 'localhost' || location.hostname === '127.0.0.1')
    ? 'http://localhost:8081/api/subscribe'
    : '/api/subscribe.php';

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  document.querySelectorAll('.footer-newsletter').forEach(function (box) {
    var input = box.querySelector('input[type="email"]');
    var button = box.querySelector('button');
    if (!input || !button) return;

    var status = document.createElement('div');
    status.className = 'footer-newsletter-status';
    status.style.cssText = 'font-size:12.5px;margin-top:8px;min-height:16px;';
    box.parentNode.insertBefore(status, box.nextSibling);

    var defaultText = button.textContent;
    var busy = false;

    function setStatus(message, isError) {
      status.textContent = message;
      status.style.color = isError ? '#ff8a8a' : '#7be3c4';
    }

    function submit() {
      if (busy) return;
      var email = (input.value || '').trim();
      if (!isValidEmail(email)) {
        setStatus('Please enter a valid email address.', true);
        return;
      }

      busy = true;
      button.disabled = true;
      button.textContent = 'Joining...';
      setStatus('', false);

      fetch(SUBSCRIBE_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email }),
      })
        .then(function (res) {
          return res.json().then(function (data) {
            return { ok: res.ok, data: data };
          });
        })
        .then(function (result) {
          if (result.ok && result.data && result.data.ok) {
            setStatus(
              result.data.alreadySubscribed
                ? 'You are already subscribed.'
                : 'Thanks for subscribing!',
              false
            );
            input.value = '';
          } else {
            setStatus((result.data && result.data.error) || 'Something went wrong. Please try again.', true);
          }
        })
        .catch(function () {
          setStatus('Network error. Please try again later.', true);
        })
        .finally(function () {
          busy = false;
          button.disabled = false;
          button.textContent = defaultText;
        });
    }

    button.addEventListener('click', function (e) {
      e.preventDefault();
      submit();
    });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        submit();
      }
    });
  });
})();
