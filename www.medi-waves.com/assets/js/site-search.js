/**
 * Medi Waves Inc. - Shared site search.
 * Wires up the nav search icon (#navSearchBtn) to a live search overlay
 * that filters window.MW_SEARCH_INDEX (see assets/js/search-index.js).
 * Included on every page via:
 *   <script src="/assets/js/search-index.js" defer></script>
 *   <script src="/assets/js/site-search.js" defer></script>
 */
(function () {
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function highlight(text, query) {
    if (!query) return escapeHtml(text);
    var tokens = query.toLowerCase().split(/[\s-]+/).filter(Boolean);
    if (!tokens.length) return escapeHtml(text);
    var lower = text.toLowerCase();
    // Collect non-overlapping match ranges for every token, then render once.
    var ranges = [];
    tokens.forEach(function (t) {
      var from = 0, idx;
      while ((idx = lower.indexOf(t, from)) !== -1) {
        ranges.push([idx, idx + t.length]);
        from = idx + t.length;
      }
    });
    if (!ranges.length) return escapeHtml(text);
    ranges.sort(function (a, b) { return a[0] - b[0]; });
    var merged = [ranges[0]];
    ranges.slice(1).forEach(function (r) {
      var last = merged[merged.length - 1];
      if (r[0] <= last[1]) last[1] = Math.max(last[1], r[1]);
      else merged.push(r);
    });
    var out = "", cursor = 0;
    merged.forEach(function (r) {
      out += escapeHtml(text.slice(cursor, r[0]));
      out += "<mark>" + escapeHtml(text.slice(r[0], r[1])) + "</mark>";
      cursor = r[1];
    });
    out += escapeHtml(text.slice(cursor));
    return out;
  }

  var ROTATING_TERMS = [
    "Radiant Warmer", "Phototherapy Unit", "Infant Incubator", "Infusion Pump",
    "Electro Surgical Unit", "Oxygen Concentrator", "Blood Pressure Monitor",
    "Fetal Doppler", "Syringe Pump", "Child Growth Monitoring"
  ];

  function buildNavSearchBox(onOpen) {
    var box = document.createElement("button");
    box.type = "button";
    box.className = "mw-nav-search-box";
    box.setAttribute("aria-label", "Search products");
    box.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" width="16" height="16"><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2"/><path d="M21 21l-4.3-4.3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>' +
      '<span class="mw-nav-search-placeholder"><span class="mw-nav-search-word">Search ' + escapeHtml(ROTATING_TERMS[0]) + "…</span></span>";
    box.addEventListener("click", onOpen);

    var wordEl = box.querySelector(".mw-nav-search-word");
    var i = 0;
    setInterval(function () {
      i = (i + 1) % ROTATING_TERMS.length;
      wordEl.classList.add("fade-out");
      setTimeout(function () {
        wordEl.textContent = "Search " + ROTATING_TERMS[i] + "…";
        wordEl.classList.remove("fade-out");
      }, 200);
    }, 2000);

    return box;
  }

  function buildOverlay() {
    var overlay = document.createElement("div");
    overlay.className = "mw-search-overlay";
    overlay.innerHTML =
      '<div class="mw-search-panel" role="dialog" aria-modal="true" aria-label="Site search">' +
      '<div class="mw-search-input-row">' +
      '<svg viewBox="0 0 24 24" fill="none" width="18" height="18"><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2"/><path d="M21 21l-4.3-4.3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>' +
      '<input type="text" class="mw-search-input" placeholder="Search products, categories…" autocomplete="off" aria-label="Search">' +
      '<button type="button" class="mw-search-close" aria-label="Close search">&times;</button>' +
      "</div>" +
      '<div class="mw-search-results" id="mwSearchResults"></div>' +
      "</div>";
    return overlay;
  }

  function renderResults(container, query) {
    var index = window.MW_SEARCH_INDEX || [];
    if (!query) {
      container.innerHTML = '<div class="mw-search-hint">Start typing to search the full product catalogue…</div>';
      return;
    }
    var q = query.toLowerCase().trim();
    // Tokenize on whitespace/hyphens so word order and punctuation (e.g. "ecg 601"
    // vs "ecg-601") don't prevent a match — every token must appear somewhere in
    // the title for it to count as a hit.
    var tokens = q.split(/[\s-]+/).filter(Boolean);
    if (!tokens.length) tokens = [q];

    var matches = index
      .map(function (item) {
        var title = item.title.toLowerCase();
        var firstIdx = -1;
        for (var i = 0; i < tokens.length; i++) {
          var idx = title.indexOf(tokens[i]);
          if (idx === -1) return null;
          if (firstIdx === -1 || idx < firstIdx) firstIdx = idx;
        }
        // Whole-phrase match (tokens appear in order, contiguous-ish) ranks highest.
        var phraseIdx = title.indexOf(q);
        return { item: item, rank: phraseIdx !== -1 ? phraseIdx : 1000 + firstIdx };
      })
      .filter(Boolean);

    // Prioritize whole-phrase matches, then earliest token match.
    matches.sort(function (a, b) { return a.rank - b.rank; });
    matches = matches.slice(0, 12).map(function (m) { return m.item; });

    if (!matches.length) {
      container.innerHTML = '<div class="mw-search-hint">No products found for &ldquo;' + escapeHtml(query) + '&rdquo;.</div>';
      return;
    }
    container.innerHTML = matches
      .map(function (item) {
        return (
          '<a class="mw-search-result" href="' + item.url + '">' +
          '<span class="mw-search-result-title">' + highlight(item.title, query) + "</span>" +
          '<span class="mw-search-result-arrow">→</span>' +
          "</a>"
        );
      })
      .join("");
  }

  function init() {
    var btn = document.getElementById("navSearchBtn");
    if (!btn) return;

    var overlay = buildOverlay();
    document.body.appendChild(overlay);
    var input = overlay.querySelector(".mw-search-input");
    var results = overlay.querySelector("#mwSearchResults");
    var closeBtn = overlay.querySelector(".mw-search-close");

    function open() {
      overlay.classList.add("open");
      document.body.style.overflow = "hidden";
      renderResults(results, input.value.trim());
      setTimeout(function () { input.focus(); }, 10);
    }
    function close() {
      overlay.classList.remove("open");
      document.body.style.overflow = "";
    }

    btn.addEventListener("click", function (e) {
      e.preventDefault();
      if (overlay.classList.contains("open")) close(); else open();
    });

    var navBox = buildNavSearchBox(function (e) {
      e.preventDefault();
      open();
    });
    btn.parentNode.insertBefore(navBox, btn);

    // The nav search icon/box are hidden on mobile/tablet (below the hamburger
    // breakpoint), so give the mobile drawer its own search entry point —
    // otherwise phone users have no way to open search at all.
    var drawerBody = document.querySelector(".mobile-drawer-body");
    if (drawerBody) {
      var drawerBtn = document.createElement("button");
      drawerBtn.type = "button";
      drawerBtn.className = "mw-mobile-search-trigger";
      drawerBtn.innerHTML =
        '<svg viewBox="0 0 24 24" fill="none" width="18" height="18"><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2"/><path d="M21 21l-4.3-4.3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>' +
        "<span>Search products…</span>";
      drawerBtn.addEventListener("click", function () {
        var scrim = document.getElementById("mobileScrim");
        var drawer = document.getElementById("mobileDrawer");
        var hamburgerBtn = document.getElementById("hamburgerBtn");
        if (drawer) { drawer.classList.remove("open"); drawer.setAttribute("aria-hidden", "true"); }
        if (scrim) scrim.classList.remove("open");
        if (hamburgerBtn) hamburgerBtn.setAttribute("aria-expanded", "false");
        open();
      });
      drawerBody.insertBefore(drawerBtn, drawerBody.firstChild);
    }

    closeBtn.addEventListener("click", close);
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) close();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && overlay.classList.contains("open")) close();
    });
    input.addEventListener("input", function () {
      renderResults(results, input.value.trim());
    });

    // Wire up footer newsletter on any page that has it
    initFooterNewsletter();
  }

  function initFooterNewsletter() {
    var containers = document.querySelectorAll(".footer-newsletter");
    containers.forEach(function (container) {
      if (container.dataset.newsletterInited) return;
      container.dataset.newsletterInited = "true";

      var input = container.querySelector('input[type="email"], input');
      var btn = container.querySelector("button");
      if (!input || !btn) return;

      var parent = container.parentElement;
      var statusMsg = parent.querySelector(".footer-newsletter-status");
      if (!statusMsg) {
        statusMsg = document.createElement("div");
        statusMsg.className = "footer-newsletter-status";
        statusMsg.style.cssText = "font-size:12.5px;margin-top:8px;min-height:18px;line-height:1.4;";
        parent.appendChild(statusMsg);
      }

      function showStatus(text, isError) {
        statusMsg.textContent = text;
        statusMsg.style.color = isError ? "#FF6B6B" : "#4EBE88";
      }

      var endpoint = (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
        ? "http://localhost:8081/api/newsletter"
        : "/api/newsletter";

      function submit() {
        var email = input.value.trim();
        if (!email) {
          showStatus("Please enter your email address.", true);
          input.focus();
          return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          showStatus("Please enter a valid email address.", true);
          input.focus();
          return;
        }

        var origText = btn.textContent;
        btn.disabled = true;
        btn.textContent = "...";
        showStatus("Subscribing...", false);

        fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email, source: "footer_newsletter" })
        })
          .then(function (res) { return res.json(); })
          .then(function (data) {
            if (data && data.ok) {
              showStatus(data.message || "Thank you for subscribing!", false);
              input.value = "";
            } else {
              showStatus((data && data.error) || "Subscription failed.", true);
            }
          })
          .catch(function () {
            showStatus("Could not connect to subscription service.", true);
          })
          .finally(function () {
            btn.disabled = false;
            btn.textContent = origText;
          });
      }

      btn.addEventListener("click", function (e) {
        e.preventDefault();
        submit();
      });
      input.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
          e.preventDefault();
          submit();
        }
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
