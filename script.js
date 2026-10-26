/* ==========================================================================
   EDIT YOUR CONTENT HERE
   Change the values below, save, and refresh. Run `npm run build` afterwards
   to regenerate program.pdf.
   ========================================================================== */

const CONFIG = {
  date: "Saturday 21st November, 2026",              // shown on the cover, e.g. "Saturday, 12 December 2026"
  venue: "SALO'S PRESTIGIOUS EVENTS CENTER",            // shown on the cover, e.g. "Grace Chapel, Accra"
  pdfPath: "program.pdf",
};

// Footer contacts, shown in this order. "phone" is optional; "tel" is the number dialled when tapped.
const CONTACTS = [
  { label: "Gift Table", name: "Miss Abigail Mensah" },
  { label: "Enquiries for the Day", name: "Miss Josephine Sarpong", phone: "024 602 6221", tel: "+233246026221" },
];

// Shown in a card at the top of the Ceremony section. "role" is optional.
const CLERGY = [
  { name: "Rev. Frank Apaah" },
  { name: "Rev. Robert Turkson Williams" },
  { name: "Pastor Timothy Sapati" },
  { name: "Pastor Flash Osardu Williams" },
  { name: "Pastor Timothy Sarpong" },
];

// Each item: "title", optional "who" (person or group) or "note" (shown in italics),
// optional icon: "heart", "glasses", "bouquet", "sparkle", "ring"
const CEREMONY = [
  { title: "Guest Arrival & Seating" },
  { title: "Bridal March", note: "with her son" },
  { title: "Worship" },
  { title: "Nuptial Ceremony", who: "Officiating Clergy" },
  { title: "Song Ministration", who: "Lady Pastor Trudy" },
  { title: "Removal of Veil" },
  { title: "Communion" },
  { title: "Signing of Certificate & Offering", who: "Pneuma Music" },
  { title: "First Bible Reading: Genesis 2:18-25", who: "Bernice Banini" },
  { title: "Second Bible Reading: Ephesians 5:20-25", who: "Pastor Victor Renault" },
  { title: "Sermon", who: "Rev. Frank Apaah" },
  { title: "Charge & Blessing" },
  { title: "Presentation to Congregation" },
  { title: "Couple File Out" },
];

const RECEPTION = [
  { title: "Reception Begins", icon: "glasses" },
  { title: "Grand Entrance of the Newlyweds" },
  { title: "Welcome Address" },
  { title: "Dinner / Refreshments" },
  { title: "Cutting of the Wedding Cake", who: "Lady Pastor Mrs William Turkson" },
  { title: "Toast to the Couple" },
  { title: "Couple's Appreciation Speech" },
  { title: "Special Dance / Entertainment" },
  { title: "Couple & Bridal Party Games" },
  { title: "Bouquet Toss", icon: "bouquet" },
  { title: "Open Dance Floor" },
  { title: "Vote of Thanks" },
  { title: "Grand Exit of the Newlyweds", icon: "sparkle" },
];

// Order of Photography: each group is shown as "Couple with <group>"
const PHOTO_PREFIX = "Couple with";
const PHOTOGRAPHY = [
  "Officiating Clergy",
  "Bride's Parents",
  "Groom's Parents",
  "Both Families",
  "Pneuma Gathering International Pastors",
  "Shepherds",
  "Lighthouse Pastors",
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

// Values in [square brackets] are shown as soft placeholders.
const BRIDAL_PARTY = {
  couple: [
    { role: "Bride", name: "Nancy Quaye-Larbie" },
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

    const body = document.createElement("div");
    body.className = "timeline__body";

    const title = document.createElement("span");
    title.className = "timeline__event";
    title.textContent = item.title;
    body.appendChild(title);

    const icon = item.icon && iconSvg(item.icon);
    if (icon) title.appendChild(icon);

    if (item.who || item.note) {
      const who = document.createElement("span");
      who.className = item.note ? "timeline__who timeline__who--note" : "timeline__who";
      who.textContent = item.who || item.note;
      body.appendChild(who);
    }

    li.appendChild(body);
    listEl.appendChild(li);
  });
}

function renderClergy(listEl, clergy) {
  clergy.forEach((person) => {
    const li = document.createElement("li");
    li.className = "clergy__item";
    const name = document.createElement("span");
    name.className = "clergy__name";
    name.textContent = person.name;
    li.appendChild(name);
    if (person.role) {
      const role = document.createElement("span");
      role.className = "clergy__role";
      role.textContent = person.role;
      li.appendChild(role);
    }
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

  el.append(couple, honour, groups);
}

function renderContacts(el, contacts) {
  contacts.forEach((c) => {
    const item = document.createElement("div");
    item.className = "contact";
    const label = document.createElement("p");
    label.className = "contact__label";
    label.textContent = c.label;
    const name = document.createElement("p");
    name.className = "contact__name";
    name.textContent = c.name;
    item.append(label, name);
    if (c.phone) {
      const phone = document.createElement("a");
      phone.className = "contact__phone";
      phone.href = `tel:${c.tel || c.phone.replace(/\s+/g, "")}`;
      phone.textContent = c.phone;
      phone.setAttribute("aria-label", `Call ${c.name} on ${c.phone}`);
      item.appendChild(phone);
    }
    el.appendChild(item);
  });
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
  document.querySelectorAll(".js-pdf-link").forEach((a) => a.setAttribute("href", CONFIG.pdfPath));

  renderClergy(document.getElementById("clergy-list"), CLERGY);
  renderTimeline(document.getElementById("ceremony-list"), CEREMONY);
  renderTimeline(document.getElementById("reception-list"), RECEPTION);
  renderPhotography(document.getElementById("photo-list"), PHOTOGRAPHY);
  renderBridalParty(document.getElementById("party"), BRIDAL_PARTY);
  renderContacts(document.getElementById("contacts"), CONTACTS);

  initActiveNav();
  initReveal();
});
