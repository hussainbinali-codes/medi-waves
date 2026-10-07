/**
 * Medi Waves - Request a Quote Modal Controller (Matches Image 1)
 * Replaces redirection to /contact/ sitewide.
 */
(function () {
  var MODAL_ID = "mwQuoteModalBackdrop";

  function getApiEndpoint() {
    var host = window.location.hostname;
    var port = window.location.port;
    if ((host === "localhost" || host === "127.0.0.1") && port !== "8081") {
      return "http://localhost:8081/api/quote";
    }
    return "/api/quote";
  }

  function buildModalHtml() {
    return (
      '<div class="mw-quote-backdrop" id="' + MODAL_ID + '" role="dialog" aria-modal="true" aria-labelledby="mwQuoteModalTitle">' +
      '  <div class="mw-quote-card">' +
      '    <div class="mw-quote-header-top">' +
      '      <span class="mw-quote-badge">' +
      '        <span class="mw-quote-badge-dot"></span> MANUFACTURER DIRECT' +
      '      </span>' +
      '      <button type="button" class="mw-quote-close" id="mwQuoteCloseBtn" aria-label="Close quote modal">&times;</button>' +
      '    </div>' +
      '    <h2 class="mw-quote-title" id="mwQuoteModalTitle">Request a Quote</h2>' +
      '    <p class="mw-quote-desc">Get direct ex-factory pricing, technical specifications &amp; delivery estimates for medical equipment.</p>' +
      '    <div class="mw-quote-status" id="mwQuoteStatus"></div>' +
      '    <form class="mw-quote-form" id="mwQuoteForm" novalidate>' +
      '      <div class="mw-quote-row-2">' +
      '        <div class="mw-quote-field">' +
      '          <label class="mw-quote-label" for="mwQuoteName">Full Name / Hospital <span class="mw-quote-req">*</span></label>' +
      '          <input type="text" id="mwQuoteName" name="name" class="mw-quote-input" placeholder="Dr. John Doe / Hospital Name" required autocomplete="name">' +
      '        </div>' +
      '        <div class="mw-quote-field">' +
      '          <label class="mw-quote-label" for="mwQuoteEmail">Official Email <span class="mw-quote-req">*</span></label>' +
      '          <input type="email" id="mwQuoteEmail" name="email" class="mw-quote-input" placeholder="name@hospital.com" required autocomplete="email">' +
      '        </div>' +
      '      </div>' +
      '      <div class="mw-quote-field">' +
      '        <label class="mw-quote-label" for="mwQuoteCategory">Medical Equipment <span class="mw-quote-req">*</span></label>' +
      '        <select id="mwQuoteCategory" name="equipment" class="mw-quote-select" required>' +
      '          <option value="" disabled selected>Select Medical Equipment Category...</option>' +
      '          <option value="Infant Care & Delivery Room">Infant Care & Delivery Room</option>' +
      '          <option value="Monitoring Equipments">Monitoring Equipments</option>' +
      '          <option value="Infusion Pumps">Infusion Pumps</option>' +
      '          <option value="Respiratory Care Equipments">Respiratory Care Equipments</option>' +
      '          <option value="Electro Surgical Unit">Electro Surgical Unit</option>' +
      '          <option value="Blood Pressure Monitor">Blood Pressure Monitor</option>' +
      '          <option value="Child Growth Monitoring">Child Growth Monitoring</option>' +
      '          <option value="Hospital Furniture">Hospital Furniture</option>' +
      '          <option value="OT / Surgical Equipment">OT / Surgical Equipment</option>' +
      '          <option value="Other Medical Equipment">Other Medical Equipment</option>' +
      '        </select>' +
      '      </div>' +
      '      <div class="mw-quote-field">' +
      '        <label class="mw-quote-label" for="mwQuoteRequirements">Requirements &amp; Specifications</label>' +
      '        <textarea id="mwQuoteRequirements" name="message" class="mw-quote-textarea" rows="3" placeholder="Specify required quantity, delivery location / country, model preferences, or tender specs..."></textarea>' +
      '      </div>' +
      '      <button type="submit" class="mw-quote-submit-btn" id="mwQuoteSubmitBtn">' +
      '        <span>Submit Quote Request</span>' +
      '        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
      '          <line x1="4" y1="10" x2="16" y2="10"></line>' +
      '          <polyline points="10 4 16 10 10 16"></polyline>' +
      '        </svg>' +
      '      </button>' +
      '    </form>' +
      '    <div class="mw-quote-footer-note">' +
      '      Inquiries are delivered directly to Medi Waves Export Team at <a href="mailto:sales@medi-waves.com">sales@medi-waves.com</a>' +
      '    </div>' +
      '  </div>' +
      '</div>'
    );
  }

  function ensureModal() {
    var el = document.getElementById(MODAL_ID);
    if (!el) {
      document.body.insertAdjacentHTML("beforeend", buildModalHtml());
      el = document.getElementById(MODAL_ID);
      bindModalEvents();
    }
    return el;
  }

  function openModal(prefillEquipment) {
    var modal = ensureModal();
    var status = document.getElementById("mwQuoteStatus");
    if (status) {
      status.className = "mw-quote-status";
      status.textContent = "";
      status.style.display = "none";
    }

    if (prefillEquipment) {
      var select = document.getElementById("mwQuoteCategory");
      if (select) {
        for (var i = 0; i < select.options.length; i++) {
          if (select.options[i].value.toLowerCase() === String(prefillEquipment).toLowerCase()) {
            select.selectedIndex = i;
            break;
          }
        }
      }
    }

    modal.classList.add("open");
    document.body.style.overflow = "hidden";

    var firstInput = document.getElementById("mwQuoteName");
    if (firstInput) {
      setTimeout(function () {
        firstInput.focus();
      }, 100);
    }
  }

  function closeModal() {
    var modal = document.getElementById(MODAL_ID);
    if (modal) {
      modal.classList.remove("open");
      document.body.style.overflow = "";
    }
  }

  function setStatus(text, type) {
    var status = document.getElementById("mwQuoteStatus");
    if (!status) return;
    status.textContent = text;
    status.className = "mw-quote-status " + (type || "error");
    status.style.display = "block";
  }

  function bindModalEvents() {
    var modal = document.getElementById(MODAL_ID);
    var closeBtn = document.getElementById("mwQuoteCloseBtn");
    var form = document.getElementById("mwQuoteForm");
    var submitBtn = document.getElementById("mwQuoteSubmitBtn");

    if (closeBtn) {
      closeBtn.addEventListener("click", closeModal);
    }

    if (modal) {
      modal.addEventListener("click", function (e) {
        if (e.target === modal) {
          closeModal();
        }
      });
    }

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modal && modal.classList.contains("open")) {
        closeModal();
      }
    });

    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();

        var nameInput = document.getElementById("mwQuoteName");
        var emailInput = document.getElementById("mwQuoteEmail");
        var categorySelect = document.getElementById("mwQuoteCategory");
        var reqTextarea = document.getElementById("mwQuoteRequirements");

        var name = (nameInput && nameInput.value || "").trim();
        var email = (emailInput && emailInput.value || "").trim();
        var equipment = (categorySelect && categorySelect.value || "").trim();
        var message = (reqTextarea && reqTextarea.value || "").trim();

        if (!name) {
          setStatus("Please enter your Full Name or Hospital Name.", "error");
          if (nameInput) nameInput.focus();
          return;
        }

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          setStatus("Please provide a valid official email address.", "error");
          if (emailInput) emailInput.focus();
          return;
        }

        if (!equipment) {
          setStatus("Please select a Medical Equipment category.", "error");
          if (categorySelect) categorySelect.focus();
          return;
        }

        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = '<span>Submitting Quote Request...</span>';
        }

        fetch(getApiEndpoint(), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name,
            email: email,
            equipment: equipment,
            message: message
          })
        })
          .then(function (res) {
            return res.json().catch(function () {
              return { ok: false, error: "Server returned invalid response." };
            });
          })
          .then(function (data) {
            if (data && data.ok) {
              setStatus("✓ Thank you! Your quote request has been sent to our sales team.", "success");
              form.reset();
              setTimeout(function () {
                closeModal();
              }, 2500);
            } else {
              setStatus((data && data.error) || "Could not submit quote request. Please try again.", "error");
            }
          })
          .catch(function (err) {
            setStatus("Network error. Please try again or email sales@medi-waves.com directly.", "error");
          })
          .finally(function () {
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.innerHTML =
                '<span>Submit Quote Request</span>' +
                '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
                '  <line x1="4" y1="10" x2="16" y2="10"></line>' +
                '  <polyline points="10 4 16 10 10 16"></polyline>' +
                '</svg>';
            }
          });
      });
    }
  }

  // Intercept all "Request Quote" buttons sitewide so they trigger the modal instead of redirecting
  function interceptQuoteButtons() {
    var triggers = document.querySelectorAll(
      '.nav-cta, .mobile-drawer-cta a, [data-open-quote-modal], a[href*="contact"], a[href*="quote"], button'
    );

    triggers.forEach(function (btn) {
      if (btn.dataset.quoteIntercepted) return;
      var text = (btn.textContent || "").trim().toLowerCase();
      var isQuoteBtn =
        btn.classList.contains("nav-cta") ||
        btn.hasAttribute("data-open-quote-modal") ||
        text.indexOf("request quote") !== -1 ||
        text.indexOf("request a quote") !== -1 ||
        text.indexOf("get a quote") !== -1;

      if (isQuoteBtn) {
        btn.dataset.quoteIntercepted = "true";
        btn.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();
          // Close mobile drawer if open
          var drawer = document.getElementById("mobileDrawer");
          var scrim = document.getElementById("mobileScrim");
          if (drawer && drawer.classList.contains("open")) {
            drawer.classList.remove("open");
          }
          if (scrim && scrim.classList.contains("open")) {
            scrim.classList.remove("open");
          }
          var prefill = btn.getAttribute("data-equipment") || "";
          openModal(prefill);
        });
      }
    });
  }

  // Delegated document-level listener guarantees immediate opening for any quote button
  document.addEventListener("click", function (e) {
    var trigger = e.target.closest("[data-open-quote-modal], .nav-cta");
    if (!trigger) {
      var btn = e.target.closest("a, button");
      if (btn) {
        var txt = (btn.textContent || "").trim().toLowerCase();
        if (txt === "request quote" || txt === "request a quote" || txt === "get a quote") {
          trigger = btn;
        }
      }
    }
    if (trigger) {
      e.preventDefault();
      e.stopPropagation();
      var drawer = document.getElementById("mobileDrawer");
      var scrim = document.getElementById("mobileScrim");
      if (drawer && drawer.classList.contains("open")) drawer.classList.remove("open");
      if (scrim && scrim.classList.contains("open")) scrim.classList.remove("open");
      var prefill = trigger.getAttribute("data-equipment") || "";
      openModal(prefill);
    }
  });

  // Expose global helper
  window.openQuoteModal = openModal;
  window.closeQuoteModal = closeModal;

  function init() {
    ensureModal();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
