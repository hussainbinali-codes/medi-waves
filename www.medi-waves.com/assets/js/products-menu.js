/**
 * Medi Waves Inc. - Shared "Products" dropdown component.
 * Single source of truth for the desktop mega-menu and the mobile
 * drawer's Products list: clickable main category headings, each
 * linking straight to its category landing page (no individual
 * products listed here). Included on every page via:
 *   <script src="/assets/js/products-menu.js" defer></script>
 * Editing the CATEGORIES list below updates the dropdown everywhere.
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

  function fixProductHeaderAndBreadcrumbs() {
    // Inject header centering CSS if not already present
    if (!document.getElementById("mw-product-header-center-css")) {
      var css = `
        #page-title, .page-title-block {
          position: relative !important;
          overflow: hidden !important;
          background: linear-gradient(180deg, #eef4fb 0%, #f7fafd 55%, #ffffff 100%) !important;
          padding: 84px 20px 48px !important;
          text-align: center !important;
          width: 100% !important;
          box-sizing: border-box !important;
        }
        #page-title .container,
        #page-title .page-title-inner,
        #page-title .page-title-title,
        #page-title .breadcrumbs-container,
        .page-title-block .container,
        .page-title-block .page-title-inner,
        .page-title-block .page-title-title,
        .page-title-block .breadcrumbs-container {
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          justify-content: center !important;
          text-align: center !important;
          margin: 0 auto !important;
          width: 100% !important;
          max-width: 1200px !important;
        }
        #page-title h1,
        #page-title .title-rich-content,
        #page-title .page-title-title h1,
        .page-title-block h1 {
          color: #0B1F3A !important;
          font-family: 'Plus Jakarta Sans', 'Manrope', -apple-system, BlinkMacSystemFont, sans-serif !important;
          font-weight: 800 !important;
          font-size: clamp(28px, 4.2vw, 46px) !important;
          letter-spacing: -0.015em !important;
          text-transform: uppercase !important;
          margin: 0 0 16px 0 !important;
          padding: 0 !important;
          line-height: 1.22 !important;
          text-align: center !important;
          width: 100% !important;
        }
        #page-title .breadcrumbs-container,
        .page-title-block .breadcrumbs-container {
          margin-top: 4px !important;
          width: 100% !important;
        }
        #page-title .breadcrumbs,
        .page-title-block .breadcrumbs {
          display: inline-flex !important;
          flex-wrap: wrap !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 8px !important;
          text-align: center !important;
          margin: 0 auto !important;
          padding: 0 !important;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif !important;
          font-size: 14.5px !important;
          line-height: 1.5 !important;
        }
        #page-title .breadcrumbs span,
        #page-title .breadcrumbs a,
        .page-title-block .breadcrumbs span,
        .page-title-block .breadcrumbs a {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif !important;
          font-size: 14.5px !important;
          font-weight: 500 !important;
          color: #475467 !important;
          text-decoration: none !important;
          display: inline-flex !important;
          align-items: center !important;
          transition: color 0.2s ease !important;
        }
        #page-title .breadcrumbs a:hover,
        .page-title-block .breadcrumbs a:hover {
          color: #155EEF !important;
          text-decoration: underline !important;
        }
        #page-title .breadcrumbs .current,
        .page-title-block .breadcrumbs .current {
          color: #155EEF !important;
          font-weight: 700 !important;
          border-bottom: none !important;
        }
        #page-title .bc-devider,
        #page-title .divider,
        .page-title-block .bc-devider,
        .page-title-block .divider {
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          margin: 0 4px !important;
          color: #94A3B8 !important;
        }
        #page-title .bc-devider::before,
        .page-title-block .bc-devider::before {
          content: "›" !important;
          font-size: 17px !important;
          line-height: 1 !important;
          color: #94A3B8 !important;
          font-weight: 400 !important;
        }

        /* Footer Global Centering & Balance */
        footer {
          background: #0B1F3A !important;
          color: rgba(255, 255, 255, .72) !important;
          padding: 88px 0 32px !important;
          position: relative !important;
          overflow: hidden !important;
          width: 100% !important;
          box-sizing: border-box !important;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif !important;
        }
        footer .container {
          max-width: 1240px !important;
          width: 100% !important;
          margin: 0 auto !important;
          padding: 0 24px !important;
          box-sizing: border-box !important;
          float: none !important;
          position: relative !important;
          z-index: 1 !important;
        }
        .footer-grid {
          display: grid !important;
          grid-template-columns: 1.4fr 1fr 1fr 1fr 1.3fr !important;
          gap: 36px !important;
          position: relative !important;
          z-index: 1 !important;
          align-items: start !important;
          width: 100% !important;
          box-sizing: border-box !important;
        }
        .footer-logo {
          display: flex !important;
          align-items: center !important;
          gap: 14px !important;
          font-family: 'Plus Jakarta Sans', sans-serif !important;
          font-weight: 800 !important;
          font-size: 21px !important;
          color: #fff !important;
          margin-bottom: 16px !important;
          line-height: 1.2 !important;
        }
        .footer-logo .mark {
          width: 52px !important;
          height: 52px !important;
          border-radius: 14px !important;
          padding: 7px !important;
          background: rgba(255, 255, 255, 0.07) !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          border: 1px solid rgba(255, 255, 255, 0.12) !important;
          flex: none !important;
          box-sizing: border-box !important;
        }
        .footer-logo .mark img {
          width: 100% !important;
          height: 100% !important;
          object-fit: contain !important;
          display: block !important;
        }
        footer p {
          color: rgba(255, 255, 255, .65) !important;
          font-size: 13.5px !important;
          line-height: 1.6 !important;
          margin: 0 0 16px 0 !important;
          max-width: 290px !important;
        }
        footer h3 {
          color: #fff !important;
          font-family: 'Plus Jakarta Sans', sans-serif !important;
          font-size: 13.5px !important;
          text-transform: uppercase !important;
          letter-spacing: .08em !important;
          margin: 0 0 18px 0 !important;
          font-weight: 800 !important;
          line-height: 1.2 !important;
        }
        footer ul {
          list-style: none !important;
          margin: 0 !important;
          padding: 0 !important;
          display: flex !important;
          flex-direction: column !important;
          gap: 11px !important;
        }
        footer ul li {
          font-size: 13.5px !important;
          color: rgba(255, 255, 255, .68) !important;
          line-height: 1.55 !important;
          margin: 0 !important;
          padding: 0 !important;
          list-style: none !important;
        }
        footer ul a {
          font-size: 13.8px !important;
          color: rgba(255, 255, 255, .68) !important;
          text-decoration: none !important;
          transition: color .2s ease, transform .2s ease !important;
          display: inline-block !important;
        }
        footer ul a:hover {
          color: #22B8CF !important;
          transform: translateX(3px) !important;
        }
        .footer-social {
          display: flex !important;
          gap: 10px !important;
          margin-top: 18px !important;
        }
        .footer-social a {
          width: 38px !important;
          height: 38px !important;
          border-radius: 50% !important;
          background: rgba(255, 255, 255, .08) !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          color: #fff !important;
          transition: all .3s cubic-bezier(.22, 1, .36, 1) !important;
          border: 1px solid rgba(255, 255, 255, .12) !important;
          text-decoration: none !important;
          box-sizing: border-box !important;
        }
        .footer-social a svg {
          width: 16px !important;
          height: 16px !important;
          display: block !important;
          fill: currentColor !important;
        }
        .footer-social a:hover {
          background: linear-gradient(135deg, #155EEF 0%, #22B8CF 100%) !important;
          transform: translateY(-3px) !important;
          box-shadow: 0 8px 18px rgba(21, 94, 239, .35) !important;
          border-color: transparent !important;
        }
        .footer-newsletter {
          display: flex !important;
          margin-top: 18px !important;
          border-radius: 999px !important;
          overflow: hidden !important;
          background: rgba(255, 255, 255, .08) !important;
          border: 1px solid rgba(255, 255, 255, .16) !important;
          transition: border-color .3s ease !important;
          width: 100% !important;
          max-width: 320px !important;
          box-sizing: border-box !important;
        }
        .footer-newsletter:focus-within {
          border-color: #22B8CF !important;
          box-shadow: 0 0 0 3px rgba(34, 184, 207, 0.15) !important;
        }
        .footer-newsletter input {
          flex: 1 !important;
          background: transparent !important;
          border: none !important;
          padding: 12px 16px !important;
          color: #fff !important;
          font-size: 13.5px !important;
          outline: none !important;
          font-family: 'Inter', sans-serif !important;
          min-width: 0 !important;
        }
        .footer-newsletter input::placeholder {
          color: rgba(255, 255, 255, .45) !important;
        }
        .footer-newsletter button {
          background: linear-gradient(135deg, #155EEF 0%, #22B8CF 100%) !important;
          border: none !important;
          color: #fff !important;
          padding: 0 22px !important;
          cursor: pointer !important;
          font-family: 'Plus Jakarta Sans', sans-serif !important;
          font-weight: 700 !important;
          font-size: 13.5px !important;
          transition: opacity .25s ease, transform .15s ease !important;
          border-radius: 0 999px 999px 0 !important;
          white-space: nowrap !important;
          flex: none !important;
        }
        .footer-newsletter button:hover {
          opacity: .9 !important;
        }
        .footer-bottom {
          border-top: 1px solid rgba(255, 255, 255, .12) !important;
          margin-top: 48px !important;
          padding-top: 24px !important;
          display: flex !important;
          justify-content: space-between !important;
          align-items: center !important;
          flex-wrap: wrap !important;
          gap: 12px !important;
          font-size: 13px !important;
          color: rgba(255, 255, 255, .5) !important;
          position: relative !important;
          z-index: 1 !important;
          width: 100% !important;
        }
        @media (max-width: 1024px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 32px !important;
          }
        }
        @media (max-width: 640px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
            gap: 28px !important;
          }
          footer {
            padding: 56px 0 24px !important;
          }
          .footer-bottom {
            flex-direction: column !important;
            text-align: center !important;
            gap: 8px !important;
          }
        /* Remove Download Brochure Button in Page Header */
        .pw-page-brochure-btn,
        #page-title .pw-page-brochure-btn,
        .page-title-inner > div:has(.pw-page-brochure-btn),
        .page-title-block .pw-page-brochure-btn,
        #page-title a[download] {
          display: none !important;
        }
      `;
      var styleEl = document.createElement("style");
      styleEl.id = "mw-product-header-center-css";
      styleEl.textContent = css;
      document.head.appendChild(styleEl);
    }

    // Remove Download Brochure buttons from DOM
    document.querySelectorAll(".pw-page-brochure-btn, #page-title a[download]").forEach(function (btn) {
      var parent = btn.parentElement;
      if (parent && parent.parentElement && (parent.parentElement.classList.contains("page-title-inner") || parent.parentElement.closest("#page-title"))) {
        parent.remove();
      } else {
        btn.remove();
      }
    });

    // Fix H1 inline color style if present
    var titles = document.querySelectorAll("#page-title h1, .page-title-block h1");
    titles.forEach(function (h1) {
      if (h1.style && (h1.style.color === "rgb(255, 255, 255)" || h1.style.color === "#ffffff" || h1.style.color === "#fff")) {
        h1.style.removeProperty("color");
      }
    });

    // Fix breadcrumbs links to ensure workable navigation
    var breadcrumbs = document.querySelectorAll("#page-title .breadcrumbs a, .page-title-block .breadcrumbs a");
    breadcrumbs.forEach(function (a) {
      var text = (a.textContent || "").trim().toLowerCase();
      var href = a.getAttribute("href") || "";

      if (text === "home") {
        a.setAttribute("href", "/");
      } else if (text.indexOf("baby care") !== -1 || text.indexOf("infant care") !== -1 || text.indexOf("delivery room") !== -1) {
        a.setAttribute("href", "/baby-care-eqiupments/");
      } else if (text.indexOf("monitoring") !== -1) {
        a.setAttribute("href", "/monitoring-equipments/");
      } else if (text.indexOf("infusion") !== -1) {
        a.setAttribute("href", "/infusion-pumps/");
      } else if (text.indexOf("respirat") !== -1) {
        a.setAttribute("href", "/respiratory-care-equipments/");
      } else if (text.indexOf("electro") !== -1 || text.indexOf("surgical") !== -1) {
        a.setAttribute("href", "/electro-surgical-unit/");
      } else if (text.indexOf("blood pressure") !== -1 || text.indexOf("sphygmomanometer") !== -1) {
        a.setAttribute("href", "/blood-pressure-monitor/");
      } else if (text.indexOf("growth") !== -1) {
        a.setAttribute("href", "/child-growth-monitoring/");
      } else if (text.indexOf("furniture") !== -1 || text.indexOf("hospital tables") !== -1) {
        a.setAttribute("href", "/hospital-furniture/");
      } else if (text.indexOf("bed") !== -1) {
        a.setAttribute("href", "/hospital-beds/");
      } else if (text.indexOf("ward") !== -1) {
        a.setAttribute("href", "/ward-equipments/");
      } else if (href.indexOf("%3fp=") !== -1 || href.indexOf("?p=") !== -1) {
        // Fallback for any legacy query link
        a.setAttribute("href", "/products/");
      }
    });
  }

  function mount() {
    var desktop = document.getElementById("productsMega");
    if (desktop) {
      desktop.innerHTML = buildDesktopHtml();
    }
    var mobile = document.getElementById("mobileProductsBody");
    if (mobile) {
      mobile.innerHTML = buildMobileHtml();
    }
    fixProductHeaderAndBreadcrumbs();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
})();
