/**
 * Medi Waves - Request a Quote Modal Controller
 * Sitewide handler ensuring EVERY "Request Quote" / "Request a Quote" button
 * opens the interactive quote modal instead of navigating away.
 */
(function () {
  var MODAL_ID = "mwQuoteModalBackdrop";

  // Auto-inject quote-modal.css if not present
  if (!document.querySelector('link[href*="quote-modal.css"]')) {
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/assets/css/quote-modal.css";
    document.head.appendChild(link);
  }

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

  function matchCategory(hint) {
    if (!hint) return "";
    var q = String(hint).toLowerCase();
    var select = document.getElementById("mwQuoteCategory");
    if (!select) return "";

    // 1. Direct match on option value
    for (var i = 0; i < select.options.length; i++) {
      var val = select.options[i].value;
      if (val && (val.toLowerCase() === q || q.indexOf(val.toLowerCase()) !== -1 || val.toLowerCase().indexOf(q) !== -1)) {
        return val;
      }
    }

    // 2. Intelligent keyword mapping
    if (q.match(/infant|baby|warmer|incubator|phototherapy|resuscitator|infantometer|fetal|bilirubin/)) {
      return "Infant Care & Delivery Room";
    }
    if (q.match(/monitor|doppler|ecg|pulse|oximeter|defibrillator/)) {
      return "Monitoring Equipments";
    }
    if (q.match(/pump|syringe/)) {
      return "Infusion Pumps";
    }
    if (q.match(/respirat|cpap|bipap|oxygen|hfnc|suction|concentrator/)) {
      return "Respiratory Care Equipments";
    }
    if (q.match(/electro|zeus|cautery|diathermy/)) {
      return "Electro Surgical Unit";
    }
    if (q.match(/pressure|sphygmo|bp\b/)) {
      return "Blood Pressure Monitor";
    }
    if (q.match(/growth|scale|weighing/)) {
      return "Child Growth Monitoring";
    }
    if (q.match(/bed|trolley|table|chair|stretcher|couch|furniture|cart|stand|locker|stool/)) {
      return "Hospital Furniture";
    }
    return "";
  }

  function detectPageProduct() {
    // Look for product heading
    var h1 = document.querySelector(".page-title-title h1, h1");
    if (h1) {
      var txt = (h1.textContent || "").trim();
      if (txt && txt.toLowerCase() !== "medi waves" && txt.toLowerCase() !== "home") {
        return txt;
      }
    }
    // Look for breadcrumb current
    var bcCurrent = document.querySelector(".breadcrumbs .current, .breadcrumb .active");
    if (bcCurrent) {
      var bcTxt = (bcCurrent.textContent || "").trim();
      if (bcTxt) return bcTxt;
    }
    return "";
  }

  function openModal(prefillEquipment) {
    var modal = ensureModal();
    var status = document.getElementById("mwQuoteStatus");
    if (status) {
      status.className = "mw-quote-status";
      status.textContent = "";
      status.style.display = "none";
    }

    var detectedProduct = detectPageProduct();
    var hint = prefillEquipment || detectedProduct;
    var matchedCat = matchCategory(hint);

    var select = document.getElementById("mwQuoteCategory");
    if (select && matchedCat) {
      for (var i = 0; i < select.options.length; i++) {
        if (select.options[i].value === matchedCat) {
          select.selectedIndex = i;
          break;
        }
      }
    }

    var reqTextarea = document.getElementById("mwQuoteRequirements");
    if (reqTextarea && !reqTextarea.value.trim() && detectedProduct) {
      reqTextarea.value = "Request for quote and product specifications for: " + detectedProduct;
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
          .catch(function () {
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

  // Helper to determine if an element is a quote button
  function isQuoteTrigger(el) {
    if (!el || el.nodeType !== 1) return false;
    if (el.hasAttribute("data-open-quote-modal")) return true;
    if (el.classList.contains("nav-cta") || el.classList.contains("pd-quote-btn") || el.classList.contains("pw-hero-quote-btn")) return true;

    var text = (el.textContent || "").trim().toLowerCase();
    var href = (el.getAttribute("href") || "").toLowerCase();

    // Check common quote button phrasings
    if (
      text.indexOf("request quote") !== -1 ||
      text.indexOf("request a quote") !== -1 ||
      text.indexOf("get a quote") !== -1 ||
      text.indexOf("get quote") !== -1
    ) {
      return true;
    }

    // Check link pointing to contact that mentions quote
    if (href.indexOf("contact") !== -1 && text.indexOf("quote") !== -1) {
      return true;
    }

    return false;
  }

  // Capture phase document-level listener guarantees 100% intercept BEFORE any link navigation
  document.addEventListener(
    "click",
    function (e) {
      var target = e.target;
      var trigger = target.closest("a, button, [data-open-quote-modal], .nav-cta, .pd-quote-btn, .pw-hero-quote-btn");
      if (!trigger) return;

      if (isQuoteTrigger(trigger)) {
        e.preventDefault();
        e.stopPropagation();

        // Close mobile drawer if open
        var drawer = document.getElementById("mobileDrawer");
        var scrim = document.getElementById("mobileScrim");
        if (drawer && drawer.classList.contains("open")) drawer.classList.remove("open");
        if (scrim && scrim.classList.contains("open")) scrim.classList.remove("open");

        var prefill = trigger.getAttribute("data-equipment") || trigger.getAttribute("data-product") || "";
        openModal(prefill);
      }
    },
    true // useCapture = true ensures intercept before other click handlers or native link following
  );

  // Expose global helpers
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
