// ===== Mobile nav =====
const toggle = document.querySelector(".nav-toggle");
const links = document.querySelector(".nav-links");
toggle.addEventListener("click", () => {
  const open = links.classList.toggle("open");
  toggle.setAttribute("aria-expanded", open);
});
links.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => links.classList.remove("open")));

// ===== Active nav link on scroll =====
const sections = [...document.querySelectorAll("main section[id]")];
const navObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        links.querySelectorAll("a").forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id));
      }
    });
  },
  { rootMargin: "-45% 0px -50% 0px" }
);
sections.forEach((s) => navObs.observe(s));

// ===== Reveal on scroll =====
const revealEls = document.querySelectorAll(".card, figure, .pipeline li, .insight, .table-wrap, .stat");
revealEls.forEach((el) => el.classList.add("reveal"));
const revObs = new IntersectionObserver(
  (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); revObs.unobserve(e.target); } }),
  { threshold: 0.08 }
);
revealEls.forEach((el) => revObs.observe(el));

// ===== Category bars =====
document.querySelectorAll(".bars").forEach((box) => {
  const data = JSON.parse(box.dataset.bars);
  box.innerHTML = data
    .map(([label, n, rate]) => `
      <div class="bar-row">
        <span class="lbl">${label}</span>
        <div class="bar-track"><div class="bar-fill" data-w="${rate * 100}"></div></div>
        <span class="val">${(rate * 100).toFixed(1)}%</span>
        <span class="n">${n.toLocaleString()} shipments</span>
      </div>`)
    .join("");
});
const barObs = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.querySelectorAll(".bar-fill").forEach((f) => (f.style.width = f.dataset.w + "%"));
      barObs.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll(".bars").forEach((b) => barObs.observe(b));

// ===== Model tabs =====
document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
    document.querySelectorAll(".tab-panel").forEach((p) => p.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById("tab-" + tab.dataset.tab).classList.add("active");
  });
});

// ===== Metric comparison chart =====
const metrics = {
  acc:  { name: "Accuracy",  vals: [0.6621, 0.6588, 0.6742, 0.6548] },
  auc:  { name: "ROC-AUC",   vals: [0.7411, 0.7306, 0.7324, 0.7370] },
  prec: { name: "Precision", vals: [0.7354, 0.7277, 0.8392, 0.7388] },
  rec:  { name: "Recall",    vals: [0.6775, 0.6841, 0.5617, 0.6521] },
};
const modelNames = ["Logistic Regression", "KNN", "Decision Tree", "Neural Network"];
const barsBox = document.getElementById("metric-bars");
function renderMetric(key) {
  const { vals } = metrics[key];
  const max = Math.max(...vals);
  barsBox.innerHTML = vals
    .map((v, i) => `
      <div class="hbar ${v === max ? "top" : ""}">
        <span class="lbl">${modelNames[i]}</span>
        <div class="track"><div class="fill" data-w="${v * 100}"></div></div>
        <span class="val">${v.toFixed(3)}</span>
      </div>`)
    .join("");
  requestAnimationFrame(() => requestAnimationFrame(() =>
    barsBox.querySelectorAll(".fill").forEach((f) => (f.style.width = f.dataset.w + "%"))
  ));
}
document.querySelectorAll(".chip").forEach((c) =>
  c.addEventListener("click", () => {
    document.querySelectorAll(".chip").forEach((x) => x.classList.remove("active"));
    c.classList.add("active");
    renderMetric(c.dataset.metric);
  })
);
const chartObs = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) { renderMetric("acc"); chartObs.disconnect(); }
}, { threshold: 0.3 });
chartObs.observe(barsBox);

// ===== Lightbox =====
const lb = document.getElementById("lightbox");
const lbImg = lb.querySelector("img");
const lbCap = lb.querySelector(".lb-caption");
document.querySelectorAll("figure").forEach((fig) => {
  fig.addEventListener("click", () => {
    const img = fig.querySelector("img");
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lbCap.textContent = fig.querySelector("figcaption")?.textContent || "";
    lb.classList.add("open");
    lb.setAttribute("aria-hidden", "false");
  });
});
function closeLb() { lb.classList.remove("open"); lb.setAttribute("aria-hidden", "true"); }
lb.addEventListener("click", (e) => { if (e.target !== lbImg) closeLb(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeLb(); });

// ===== Dataset explorer =====
const PAGE = 25;
let rows = [], header = [], filtered = [], page = 0;
const tbl = document.getElementById("data-table");
const countEl = document.getElementById("row-count");
const pageInfo = document.getElementById("page-info");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const searchEl = document.getElementById("search");
const filterEl = document.getElementById("filter-target");

fetch("data/ecommerce-shipping-dataset.csv")
  .then((r) => r.text())
  .then((txt) => {
    const lines = txt.replace(/^﻿/, "").trim().split(/\r?\n/);
    header = lines[0].split(",");
    rows = lines.slice(1).map((l) => l.split(","));
    tbl.querySelector("thead").innerHTML = "<tr>" + header.map((h) => `<th>${h}</th>`).join("") + "</tr>";
    applyFilter();
  })
  .catch(() => { countEl.textContent = "Could not load dataset."; });

function applyFilter() {
  const q = searchEl.value.trim().toLowerCase();
  const t = filterEl.value;
  const last = header.length - 1;
  filtered = rows.filter((r) =>
    (t === "" || r[last] === t) &&
    (q === "" || r.some((c) => c.toLowerCase() === q || c.toLowerCase().includes(q)))
  );
  page = 0;
  render();
}
function render() {
  const last = header.length - 1;
  const start = page * PAGE;
  const slice = filtered.slice(start, start + PAGE);
  tbl.querySelector("tbody").innerHTML = slice
    .map((r) => "<tr>" + r.map((c, i) => `<td${i === last ? ` class="t${c}"` : ""}>${c}</td>`).join("") + "</tr>")
    .join("");
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE));
  countEl.textContent = `${filtered.length.toLocaleString()} of ${rows.length.toLocaleString()} rows`;
  pageInfo.textContent = `Page ${page + 1} / ${pages}`;
  prevBtn.disabled = page === 0;
  nextBtn.disabled = page >= pages - 1;
}
let debounce;
searchEl.addEventListener("input", () => { clearTimeout(debounce); debounce = setTimeout(applyFilter, 200); });
filterEl.addEventListener("change", applyFilter);
prevBtn.addEventListener("click", () => { if (page > 0) { page--; render(); } });
nextBtn.addEventListener("click", () => { page++; render(); });
