/**
 * Medi Waves - Shared Navigation & Products Menu Controller.
 * Single source of truth for:
 * 1. Desktop & mobile "Medical Equipment" dropdowns
 * 2. Sitewide top utility bar (Contact info + WhatsApp + tagline)
 * 3. Navbar branding ("Medi Waves", "Medical Equipment")
 * 4. Auto-loading shared CSS/JS components
 */
(function () {
  var CATEGORIES = [
    { name: "Infant Care & Delivery Room", href: "/baby-care-eqiupments/" },
    { name: "Monitoring Equipments", href: "/monitoring-equipments/" },
    { name: "Infusion Pumps", href: "/infusion-pumps/" },
    { name: "Respiratory Care Equipments", href: "/respiratory-care-equipments/" },
    { name: "Electro Surgical Unit", href: "/electro-surgical-unit/" },
    { name: "Blood Pressure Monitor", href: "/blood-pressure-monitor/" },
    { name: "Child Growth Monitoring", href: "/child-growth-monitoring/" },
    { name: "Hospital Furniture", href: "/hospital-furniture/" }
  ];

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function ensureStylesheet(href) {
    if (document.querySelector('link[href*="' + href + '"]')) return;
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
  }

  function ensureScript(src) {
    if (document.querySelector('script[src*="' + src + '"]')) return;
    var script = document.createElement("script");
    script.src = src;
    script.defer = true;
    document.body.appendChild(script);
  }

  function buildDesktopHtml() {
    var html = '<div class="mega-simple-list mega-simple-list-cats">';
    CATEGORIES.forEach(function (cat) {
      html += '<a class="mega-simple-cat-link" href="' + cat.href + '">' + escapeHtml(cat.name) + "</a>";
    });
    html += "</div>";
    return html;
  }

  function buildMobileHtml() {
    var html = "";
    CATEGORIES.forEach(function (cat) {
      html += '<a href="' + cat.href + '">' + escapeHtml(cat.name) + "</a>";
    });
    return html;
  }

  // 1) Mount Dropdown
  function mountDropdown() {
    var desktop = document.getElementById("productsMega");
    if (desktop) {
      desktop.innerHTML = buildDesktopHtml();
    }
    var mobile = document.getElementById("mobileProductsBody");
    if (mobile) {
      mobile.innerHTML = buildMobileHtml();
    }
  }

  // 2) Top Utility Bar (Sitewide)
  function buildUtilityBarHtml() {
    return (
      '<div class="mw-utility-bar" id="mwUtilityBar">' +
      '  <div class="mw-utility-container">' +
      '    <div class="mw-utility-left">' +
      '      <span class="mw-utility-label">Contact Us:</span>' +
      '      <a href="tel:+911142384365" class="mw-utility-phone">+91-11-4238-4365</a>' +
      '      <span class="mw-utility-divider">|</span>' +
      '      <a href="tel:+918383868178" class="mw-utility-phone mw-utility-phone-extra">+91-8383868178</a>' +
      '    </div>' +
      '    <div class="mw-utility-right">' +
      '      <span class="mw-utility-tagline">Medical Equipment Manufacturer in India |</span>' +
      '      <a href="https://wa.me/918383868178?text=Hello%20Medi%20Waves%2C%20I%20am%20inquiring%20about%20your%20medical%20equipment." target="_blank" rel="noopener" class="mw-utility-wa-btn" aria-label="Chat on WhatsApp">' +
      '        <svg viewBox="0 0 24 24" width="15" height="15" style="width:15px;height:15px;max-width:15px;flex:none;fill:#ffffff;">' +
      '          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm.01 1.67c4.55 0 8.24 3.7 8.24 8.24 0 2.2-.86 4.28-2.42 5.83a8.19 8.19 0 0 1-5.82 2.41c-1.47 0-2.91-.39-4.18-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.64c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.24-.75-.67-1.26-1.5-1.4-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.38-.44.13-.15.17-.25.25-.42.08-.17.04-.32-.02-.44-.06-.13-.56-1.35-.77-1.84-.2-.48-.41-.41-.56-.42h-.48c-.17 0-.44.06-.67.32-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.71 4.3 3.8.6.26 1.07.41 1.44.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.06-.1-.23-.17-.48-.29z"/>' +
      '        </svg>' +
      '        <span>WhatsApp</span>' +
      '      </a>' +
      '    </div>' +
      '  </div>' +
      '</div>'
    );
  }

  function mountUtilityBar() {
    ensureStylesheet("/assets/css/utility-bar.css");
    ensureStylesheet("/assets/css/quote-modal.css");
    ensureScript("/assets/js/quote-modal.js");

    var existing = document.getElementById("mwUtilityBar");
    if (!existing) {
      document.body.insertAdjacentHTML("afterbegin", buildUtilityBarHtml());
      existing = document.getElementById("mwUtilityBar");
    }

    // Scroll listener for utility bar and nav
    var navWrap = document.getElementById("navWrap");
    function onScroll() {
      var y = window.pageYOffset || document.documentElement.scrollTop || 0;
      var isScrolled = y > 40;
      if (existing) {
        existing.classList.toggle("scrolled", isScrolled);
      }
      if (navWrap) {
        navWrap.classList.toggle("scrolled", isScrolled);
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // 3) Update Navbar Branding ("Medi Waves Inc" -> "Medi Waves" & "Products" -> "Medical Equipment")
  function sanitizeNavbar() {
    // 3a: Remove "Inc" from nav logo
    var logos = document.querySelectorAll(".nav-logo");
    logos.forEach(function (logo) {
      var nodes = logo.childNodes;
      for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        if (node.nodeType === Node.TEXT_NODE) {
          var val = node.nodeValue || "";
          var replaced = val.replace(/\bInc\.?\b/gi, "").trim();
          if (replaced !== val) {
            node.nodeValue = " " + replaced;
          }
        }
      }
    });

    // 3b: Replace "Products" with "Medical Equipment" in desktop nav
    var navLinks = document.querySelectorAll(".nav-links > li > a");
    navLinks.forEach(function (a) {
      var href = a.getAttribute("href") || "";
      if (href.indexOf("/products/") !== -1 || a.textContent.trim().toLowerCase().startsWith("product")) {
        // Keep child SVG and span
        var svg = a.querySelector("svg");
        var underline = a.querySelector(".underline");
        a.textContent = "Medical Equipment ";
        if (svg) a.appendChild(svg);
        if (underline) a.appendChild(underline);
      }
    });

    // 3c: Replace "Products" in mobile accordion
    var mobileHeads = document.querySelectorAll(".mobile-accordion-head");
    mobileHeads.forEach(function (btn) {
      if (btn.textContent.trim().toLowerCase().startsWith("product")) {
        var svg = btn.querySelector("svg");
        btn.textContent = "Medical Equipment ";
        if (svg) btn.appendChild(svg);
      }
    });
  }

  function init() {
    mountDropdown();
    mountUtilityBar();
    sanitizeNavbar();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
