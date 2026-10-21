/* ==========================================================================
   EDIT YOUR CONTENT HERE
   Change the values below, save, and refresh. Run `npm run build` afterwards
   to regenerate program.pdf.
   ========================================================================== */

const CONFIG = {
  date: "Saturday 21st November, 2026",              // shown on the cover, e.g. "Saturday, 12 December 2026"
  venue: "SALO'S PRESTIGIOUS EVENTS CENTER",            // shown on the cover, e.g. "Grace Chapel, Accra"
  WEDDING_DATE: "2026-11-21",  // used for the "Happening now" badge, e.g. "2026-12-12"
  contactPerson: "[CONTACT NAME, PHONE]",
  pdfPath: "program.pdf",
};

// Optional icon per item: "heart", "glasses", "bouquet", "sparkle", "ring"
const CEREMONY = [
  { time: "1:00 PM", event: "Guest Arrival & Seating" },
  { time: "1:15 PM", event: "Bridal Party Processional" },
  { time: "1:30 PM", event: "Grand Entrance of the Bride" },
  { time: "1:40 PM", event: "Opening Prayer" },
  { time: "1:45 PM", event: "Welcome & Introduction" },
  { time: "1:55 PM", event: "Scripture Reading" },
  { time: "2:05 PM", event: "Praise & Worship / Special Ministration" },
  { time: "2:20 PM", event: "Exchange of Vows" },
  { time: "2:35 PM", event: "Exchange of Rings" },
  { time: "2:45 PM", event: "Signing of Marriage Certificate" },
  { time: "3:00 PM", event: "Pronouncement of Husband & Wife" },
  { time: "3:05 PM", event: "Presentation of the Couple" },
  { time: "3:10 PM", event: "First Dance", icon: "heart" },
  {
    time: "3:20 PM",
    event: "Family & Bridal Party Photographs",
    hint: { text: "See the Order of Photography", href: "#photography" },
  },
];

const RECEPTION = [
  { time: "3:50 PM", event: "Reception Begins", icon: "glasses" },
  { time: "4:00 PM", event: "Grand Entrance of the Newlyweds" },
  { time: "4:10 PM", event: "Welcome Address" },
  { time: "4:20 PM", event: "Dinner / Refreshments" },
  { time: "4:45 PM", event: "Cutting of the Wedding Cake" },
  { time: "4:55 PM", event: "Toast to the Couple" },
  { time: "5:05 PM", event: "Couple's Appreciation Speech" },
  { time: "5:15 PM", event: "Special Dance / Entertainment" },
  { time: "5:30 PM", event: "Couple & Bridal Party Games" },
  { time: "5:50 PM", event: "Bouquet Toss", icon: "bouquet" },
  { time: "6:00 PM", event: "Open Dance Floor" },
  { time: "7:30 PM", event: "Vote of Thanks" },
  { time: "7:40 PM", event: "Grand Exit of the Newlyweds", icon: "sparkle" },
];

// Order of Photography: each group is shown as "Couple with <group>"
const PHOTO_PREFIX = "Couple with";
const PHOTOGRAPHY = [
  "Pneuma Gathering International Pastors",
  "Shepherds",
  "Lighthouse Pastors",
  "Bride's Parents",
  "Groom's Parents",
  "Both Families",
  "Bride's Family",
  "Groom's Family",
  "Bridesmaids",
  "Groomsmen",
  "MBA UCC",
  "School of Nursing UCC",
  "Apam Secondary School",
  "NMTC Cape Coast",
  "Kwayanko Old Students",
  "Swedru International School Old Students",
  "Royal Seed Home School Old Students",
  "D&N Ushering Agency",
];

// How long the last event counts as "happening now" (minutes)
const LAST_EVENT_DURATION = 60;

// Values in [square brackets] or "To be announced" are shown as soft placeholders.
const BRIDAL_PARTY = {
  couple: [
    { role: "Bride", name: "Nancy Quaye-Laribe" },
    { role: "Groom", name: "Daniel Aduakye Appiah" },
  ],
  honour: [
    { role: "Chief Bridesmaid", name: "Judith Achampong" },
    { role: "Best Man", name: "[TO CONFIRM]" },
  ],
  groups: [
    { role: "Bridesmaids", names: ["Jessica", "Charity", "Ruth", "Doris", "Rina", "Diana"] },
    {
      role: "Groomsmen",
      names: [
        "Cecilia Abena Pokua",
        "Eldridge Cobbinah",
        "Manasseh Amankrah Duodu",
        "Clement Sarfo Acquah",
        "Gabriel Amo",
        "Nathaniel Kum",
        "Kingsford Assiamah",
      ],
    },
  ],
  little: [
    { role: "Flower Girls", name: "To be announced" },
    { role: "Ring Bearer", name: "To be announced" },
  ],
};

/* ==========================================================================
   You should not need to edit below this line.
   ========================================================================== */

const ICONS = {
  heart:
    '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
  glasses:
    '<path d="M6 3h5l-.6 6a2 2 0 0 1-3.8 0zM13 3h5l-.6 6a2 2 0 0 1-3.8 0zM8.5 11v7M15.5 11v7M6 20h5M13 20h5"/>',
  bouquet:
    '<circle cx="9" cy="7" r="2.6"/><circle cx="15" cy="7" r="2.6"/><circle cx="12" cy="4.5" r="2.4"/><path d="M8 11l4 10 4-10M12 9.5V21"/>',
  sparkle:
    '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM18.5 16l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z"/>',
  ring:
    '<circle cx="12" cy="14.5" r="6"/><path d="M9.5 5.5L12 3l2.5 2.5L12 8z"/>',
};

function iconSvg(name, label) {
  const paths = ICONS[name];
  if (!paths) return null;
  const wrap = document.createElement("span");
  wrap.className = `icon icon--${name}`;
  wrap.innerHTML =
    `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" ` +
    `stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;
  if (label) wrap.setAttribute("title", label);
  return wrap;
}

function isPlaceholder(value) {
  return /^\[.*\]$/.test(value.trim()) || /^to be (announced|confirmed)$/i.test(value.trim());
}

function displayValue(value) {
  return /^\[to confirm\]$/i.test(value.trim()) ? "To be confirmed" : value;
}

function nameEl(tag, value, className) {
  const el = document.createElement(tag);
  el.className = className;
  el.textContent = displayValue(value);
  if (isPlaceholder(value)) el.classList.add("is-placeholder");
  return el;
}

/* ---------- Rendering ---------- */

function renderTimeline(listEl, items) {
  items.forEach((item) => {
    const li = document.createElement("li");
    li.className = "timeline__item reveal";

    const time = document.createElement("time");
    time.className = "timeline__time";
    time.textContent = item.time;

    const body = document.createElement("div");
    body.className = "timeline__body";

    const title = document.createElement("span");
    title.className = "timeline__event";
    title.textContent = item.event;
    body.appendChild(title);

    const icon = item.icon && iconSvg(item.icon);
    if (icon) title.appendChild(icon);

    if (item.hint) {
      const hint = document.createElement("a");
      hint.className = "timeline__hint";
      hint.href = item.hint.href;
      hint.textContent = item.hint.text;
      body.appendChild(hint);
    }

    li.append(time, body);
    item.el = li;
    listEl.appendChild(li);
  });
}

function renderPhotography(listEl, groups) {
  groups.forEach((group, i) => {
    const li = document.createElement("li");
    li.className = "photo-item reveal";

    const num = document.createElement("span");
    num.className = "photo-item__num";
    num.textContent = i + 1;

    const text = document.createElement("span");
    text.className = "photo-item__text";
    const prefix = document.createElement("span");
    prefix.className = "photo-item__prefix";
    prefix.textContent = PHOTO_PREFIX;
    const name = document.createElement("span");
    name.className = "photo-item__name";
    name.textContent = group;
    text.append(prefix, " ", name);

    li.append(num, text);
    listEl.appendChild(li);
  });
}

function personCard(person, variant) {
  const card = document.createElement("article");
  card.className = `card card--${variant} reveal`;
  const role = document.createElement("p");
  role.className = "card__role";
  role.textContent = person.role;
  card.append(role, nameEl("p", person.name, "card__name"));
  return card;
}

function renderBridalParty(el, data) {
  const couple = document.createElement("div");
  couple.className = "party__row party__row--couple";
  data.couple.forEach((p, i) => {
    couple.appendChild(personCard(p, "featured"));
    if (i === 0) {
      const ring = iconSvg("ring");
      ring.classList.add("party__ring");
      couple.appendChild(ring);
    }
  });

  const honour = document.createElement("div");
  honour.className = "party__row";
  data.honour.forEach((p) => honour.appendChild(personCard(p, "honour")));

  const groups = document.createElement("div");
  groups.className = "party__row";
  data.groups.forEach((g) => {
    const card = document.createElement("article");
    card.className = "card card--list reveal";
    const role = document.createElement("h3");
    role.className = "card__role";
    role.textContent = g.role;
    const ul = document.createElement("ul");
    ul.className = "card__list";
    g.names.forEach((n) => ul.appendChild(nameEl("li", n, "card__list-item")));
    card.append(role, ul);
    groups.appendChild(card);
  });

  const little = document.createElement("div");
  little.className = "party__row";
  data.little.forEach((p) => little.appendChild(personCard(p, "small")));

  el.append(couple, honour, groups, little);
}

/* ---------- Happening now ---------- */

function toMinutes(timeStr) {
  const m = timeStr.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!m) return null;
  let h = parseInt(m[1], 10) % 12;
  if (m[3].toUpperCase() === "PM") h += 12;
  return h * 60 + parseInt(m[2], 10);
}

function todayIso(now) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

function updateHappeningNow(now = new Date()) {
  const schedule = [...CEREMONY, ...RECEPTION];
  schedule.forEach((item) => {
    if (!item.el) return;
    item.el.classList.remove("is-now");
    item.el.removeAttribute("aria-current");
    const badge = item.el.querySelector(".now-badge");
    if (badge) badge.remove();
  });

  if (todayIso(now) !== CONFIG.WEDDING_DATE) return;

  const minutes = now.getHours() * 60 + now.getMinutes();
  let current = null;
  schedule.forEach((item, i) => {
    const start = toMinutes(item.time);
    const next = schedule[i + 1];
    const end = next ? toMinutes(next.time) : start + LAST_EVENT_DURATION;
    if (start !== null && minutes >= start && minutes < end) current = item;
  });
  if (!current || !current.el) return;

  current.el.classList.add("is-now");
  current.el.setAttribute("aria-current", "step");
  const badge = document.createElement("span");
  badge.className = "now-badge";
  badge.textContent = "Happening now";
  current.el.querySelector(".timeline__body").appendChild(badge);
}

/* ---------- Nav highlight and reveal ---------- */

function initActiveNav() {
  const links = [...document.querySelectorAll(".site-nav a")];
  if (!("IntersectionObserver" in window)) return;
  const byId = new Map(links.map((a) => [a.getAttribute("href").slice(1), a]));
  const visible = new Map();

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => visible.set(e.target.id, e.isIntersecting));
      const activeId = [...byId.keys()].find((id) => visible.get(id));
      links.forEach((a) => {
        const on = a === byId.get(activeId);
        a.classList.toggle("is-active", on);
        if (on) a.setAttribute("aria-current", "true");
        else a.removeAttribute("aria-current");
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  byId.forEach((_, id) => {
    const section = document.getElementById(id);
    if (section) observer.observe(section);
  });
}

function initReveal() {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) return;
  document.documentElement.classList.add("js-reveal");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          observer.unobserve(e.target);
        }
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
  );
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
}

/* ---------- Boot ---------- */

document.addEventListener("DOMContentLoaded", () => {
  const setText = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  };
  setText("wedding-date", CONFIG.date);
  setText("wedding-venue", CONFIG.venue);
  setText("contact-person", CONFIG.contactPerson);
  document.querySelectorAll(".js-pdf-link").forEach((a) => a.setAttribute("href", CONFIG.pdfPath));

  renderTimeline(document.getElementById("ceremony-list"), CEREMONY);
  renderTimeline(document.getElementById("reception-list"), RECEPTION);
  renderPhotography(document.getElementById("photo-list"), PHOTOGRAPHY);
  renderBridalParty(document.getElementById("party"), BRIDAL_PARTY);

  updateHappeningNow();
  setInterval(updateHappeningNow, 60 * 1000);

  initActiveNav();
  initReveal();
});
