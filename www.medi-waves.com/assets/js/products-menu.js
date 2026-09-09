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

  function mount() {
    var desktop = document.getElementById("productsMega");
    if (desktop) {
      desktop.innerHTML = buildDesktopHtml();
    }
    var mobile = document.getElementById("mobileProductsBody");
    if (mobile) {
      mobile.innerHTML = buildMobileHtml();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
})();
