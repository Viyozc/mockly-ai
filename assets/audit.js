/* Mockly — Mockup & Listing-Image Audit engine (client-side, zero cost)
 * Scores e-commerce / POD product images on the five signals that drive tap-through
 * and add-to-cart: image count, lifestyle-vs-flat ratio, marketplace compliance,
 * template-clone risk (differentiation), and conversion readiness.
 * Weights sum to 100. All logic runs in-browser; no network calls for scoring.
 */
(function () {
  "use strict";


  // ---- centralized audit counter (fire-and-forget) ----
  var COUNTER_NS = "mockly-ai";
  function trackAudit() {
    try {
      fetch("https://api.counterapi.dev/v1/" + COUNTER_NS + "/audit_completed/up", {
        method: "GET",
        mode: "cors",
        cache: "no-store"
      });
    } catch (e) {}
  }
  var form = document.getElementById("auditForm");
  var result = document.getElementById("auditResult");
  var heroScore = document.getElementById("heroScore");
  var heroGrade = document.getElementById("heroGrade");

  function toInt(v, d) {
    var n = parseInt(v, 10);
    return isNaN(n) ? d : n;
  }
  function clampInt(n, lo, hi) { return Math.max(lo, Math.min(hi, n)); }
  function gradeFor(score) {
    if (score >= 85) return { g: "A", color: "var(--good)" };
    if (score >= 70) return { g: "B", color: "var(--brand)" };
    if (score >= 55) return { g: "C", color: "var(--warn)" };
    return { g: "D", color: "var(--bad)" };
  }

  // ---- scoring ----
  function scoreMockup(input) {
    var platform = input.platform;
    var c = clampInt(input.total, 0, 99);
    var life = clampInt(input.life, 0, 99);
    if (life > c) life = c; // can't have more lifestyle than total
    var hero = input.hero;
    var template = input.template;
    var shadow = input.shadow;
    var quality = input.quality;
    var tips = [];
    var dims = {};

    // 1) Image count (20)
    var sCount = 0;
    if (c >= 8) sCount = 20;
    else if (c >= 6) sCount = 17;
    else if (c >= 4) sCount = 12;
    else if (c >= 2) sCount = 7;
    else if (c >= 1) sCount = 4;
    if (c === 0) tips.push("Add at least 1 image — a listing with zero images can't sell.");
    else if (c < 6) tips.push("You have " + c + " image(s). Listings with 6–9 images convert best — add more angles, detail, and lifestyle shots.");
    dims["Image count"] = { score: sCount, max: 20 };

    // 2) Lifestyle ratio (20)
    var ratio = c > 0 ? life / c : 0;
    var sLife = 0;
    if (ratio >= 0.6) sLife = 20;
    else if (ratio >= 0.4) sLife = 16;
    else if (ratio >= 0.25) sLife = 12;
    else if (ratio > 0) sLife = 7;
    else sLife = 4;
    if (c > 0 && ratio < 0.4) tips.push("Only " + Math.round(ratio * 100) + "% of your images are lifestyle/context shots. Aim for ~50%+ — lifestyle beats flat packshots on scroll-through.");
    dims["Lifestyle ratio"] = { score: sLife, max: 20 };

    // 3) Marketplace compliance (20)
    var sComp = 14;
    if (platform === "amazon") {
      if (hero === "white") sComp = 20;
      else { sComp = 8; tips.push("Amazon's main image must be on a pure white background (RGB 255,255,255). Your hero isn't — this can suppress or reject the listing."); }
    } else if (platform === "etsy") {
      if (hero === "lifestyle" || hero === "model") sComp = 19;
      else if (hero === "white") { sComp = 13; tips.push("Etsy rewards lifestyle context in thumbnails. A plain white hero can look generic next to styled competitors."); }
      else sComp = 15;
    } else {
      if (hero === "lifestyle" || hero === "model") sComp = 19;
      else sComp = 15;
    }
    dims["Compliance"] = { score: sComp, max: 20 };

    // 4) Differentiation / template-clone risk (20)
    var sDiff = 12;
    if (template === "yes") {
      sDiff = 7;
      tips.push("Your mockups use a shared template library (e.g. Placeit) — buyers see the same scenes on competing shops and scroll past. Generate unique, per-product scenes to stand out.");
    } else if (template === "unsure") {
      sDiff = 12;
      tips.push("If any mockups come from a shared template library, swap them for unique AI-generated scenes — sameness is the #1 reason POD listings blend in.");
    } else {
      sDiff = 20;
      tips.push("Unique, per-product mockups — that's your differentiation edge. Keep it.");
    }
    dims["Differentiation"] = { score: sDiff, max: 20 };

    // 5) Conversion readiness (20): shadows + quality + hero style
    var sConv = 0;
    if (shadow === "yes") sConv += 8;
    else if (shadow === "partial") sConv += 5;
    else sConv += 1;
    if (quality === "high") sConv += 8;
    else sConv += 4;
    if (hero === "lifestyle" || hero === "model") sConv += 4;
    sConv = Math.min(sConv, 20);
    if (shadow === "no") tips.push("Flat cutouts look fake. Add realistic drop shadows so the product feels grounded on the page.");
    if (quality === "std") tips.push("Bump resolution to 300 DPI / high-res — crisp images lift perceived quality and reduce returns.");
    dims["Conversion ready"] = { score: sConv, max: 20 };

    var totalScore = sCount + sLife + sComp + sDiff + sConv;
    if (c === 0) totalScore = 0;
    if (tips.length === 0) tips.push("Strong set of images — keep refreshing as trends shift and A/B test hero styles.");
    return { total: totalScore, dims: dims, tips: tips };
  }

  // ---- render ----
  function ring(el, score) {
    var deg = (score / 100) * 360;
    el.style.background = "conic-gradient(var(--brand) " + deg + "deg, #ece3f7 " + deg + "deg)";
  }

  function render(res) {
    var gr = gradeFor(res.total);
    document.getElementById("resScore").textContent = res.total;
    var gEl = document.getElementById("resGrade");
    gEl.textContent = "Grade " + gr.g;
    gEl.style.background = gr.color;
    gEl.style.color = "#fff";
    document.getElementById("resSummary").textContent =
      res.total >= 85 ? "Strong images — minor tweaks only."
      : res.total >= 70 ? "Good foundation, a few quick wins left."
      : res.total >= 55 ? "Workable, but leaving sales on the table."
      : "Needs real work before it can compete.";

    ring(document.querySelector("#auditResult .score-ring"), res.total);

    var bars = document.getElementById("resBars");
    bars.innerHTML = "";
    Object.keys(res.dims).forEach(function (k) {
      var d = res.dims[k];
      var pct = Math.round((d.score / d.max) * 100);
      var row = document.createElement("div");
      row.className = "bar-row";
      row.innerHTML =
        '<span>' + k + '</span>' +
        '<span class="bar-track"><span class="bar-fill" style="width:' + pct + '%"></span></span>' +
        '<span class="bar-val">' + d.score + '/' + d.max + '</span>';
      bars.appendChild(row);
    });

    var tipsEl = document.getElementById("resTips");
    tipsEl.innerHTML = "";
    res.tips.forEach(function (t) {
      var li = document.createElement("li");
      li.textContent = t;
      tipsEl.appendChild(li);
    });

    result.hidden = false;
    result.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var res = scoreMockup({
      platform: document.getElementById("fPlatform").value,
      total: document.getElementById("fImgTotal").value,
      life: document.getElementById("fImgLife").value,
      hero: document.getElementById("fHero").value,
      template: document.getElementById("fTemplate").value,
      shadow: document.getElementById("fShadow").value,
      quality: document.getElementById("fQuality").value
    });
    render(res);
    trackAudit();
  });

  // hero demo score (static illustrative until user runs audit)
  heroScore.textContent = 71;
  heroGrade.textContent = "B";

  // ---- email capture (Formspree free tier, graceful demo fallback) ----
  // Get a FREE form ID at https://formspree.io (no payment). Paste it into FORMSPREE_ID below.
  var emailForm = document.getElementById("emailForm");
  var FORMSPREE_ID = "meeyzkdp"; // free form ID from formspree.io (no payment)
  emailForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var email = document.getElementById("fEmail").value;
    var note = document.getElementById("emailNote");
    if (FORMSPREE_ID.indexOf("YOUR_") === 0) {
      // demo mode: store locally so the flow is testable without an ID
      try {
        var store = JSON.parse(localStorage.getItem("mockly_leads") || "[]");
        store.push({ email: email, ts: new Date().toISOString() });
        localStorage.setItem("mockly_leads", JSON.stringify(store));
      } catch (err) {}
      note.textContent = "✓ Demo mode: lead saved locally (" + email + "). Add a free Formspree ID to receive real emails.";
      note.style.color = "var(--good)";
    } else {
      fetch("https://formspree.io/f/" + FORMSPREE_ID, {
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, subject: "Mockly audit lead", source: "Mockly landing" })
      })
        .then(function (r) {
          if (r.ok) { note.textContent = "✓ Subscribed! We'll email you launch + mockup tips."; note.style.color = "var(--good)"; }
          else { note.textContent = "Couldn't send — try again or email us."; note.style.color = "var(--bad)"; }
        })
        .catch(function () { note.textContent = "Couldn't send — try again or email us."; note.style.color = "var(--bad)"; });
    }
    emailForm.reset();
  });
})();
