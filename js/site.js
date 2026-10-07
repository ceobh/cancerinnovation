const NAV = [
  { id: "home", href: "index.html", label: "Home" },
  {
    id: "who",
    href: "who-we-are.html",
    label: "Who we are",
    children: [
      { id: "who", href: "who-we-are.html", label: "Our story" },
      { id: "hub", href: "innovation-hub.html", label: "Innovation Hub" },
      { id: "research", href: "research-centre.html", label: "Research Centre" },
    ],
  },
  { id: "community", href: "our-community.html", label: "Our community" },
  { id: "contact", href: "contact.html", label: "Contact" },
];

const page = document.body.dataset.page || "home";

function brandMark() {
  return `<img class="logo" src="images/logo.png" alt="Cancer Innovate, pioneering beyond boundaries">`;
}

function link(item) {
  const current = item.id === page ? ' aria-current="page"' : "";
  return `<a href="${item.href}"${current}>${item.label}</a>`;
}

function renderHeader() {
  const items = NAV.map((item) => {
    if (!item.children) return link(item);
    const child = item.children.map(link).join("");
    const active = item.children.some((childItem) => childItem.id === page);
    return `<div class="nav-item">
      <button class="nav-toggle" aria-expanded="false" aria-haspopup="true"${active ? ' aria-current="page"' : ""}>${item.label}</button>
      <div class="submenu">${child}</div>
    </div>`;
  }).join("");

  document.getElementById("header").innerHTML = `
    <header class="site-header">
      <div class="wrap header-inner">
        <a class="brand" href="index.html">
          ${brandMark()}
        </a>
        <button class="menu-btn" aria-label="Open menu" aria-expanded="false"><span></span></button>
        <nav class="nav" aria-label="Primary">
          ${items}
          <a class="btn btn-primary header-cta" href="contact.html">Get involved</a>
        </nav>
      </div>
    </header>`;
}

function renderFooter() {
  document.getElementById("footer").innerHTML = `
    <footer class="site-footer">
      <div class="wrap">
        <div class="footer-grid">
          <div>
            <a class="brand" href="index.html" style="margin-bottom:14px">
              ${brandMark()}
            </a>
            <p>A Birmingham hub for cancer innovation, research collaboration, and non-invasive early screening.</p>
            <div class="socials">
              <a href="https://web.facebook.com/CancerInnovate/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">f</a>
              <a href="https://instagram.com/CancerInnovate/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">ig</a>
            </div>
          </div>
          <div>
            <h2>Quick links</h2>
            <ul>
              <li><a href="index.html">Home</a></li>
              <li><a href="who-we-are.html">Who we are</a></li>
              <li><a href="innovation-hub.html">Innovation Hub</a></li>
              <li><a href="research-centre.html">Research Centre</a></li>
              <li><a href="our-community.html">Our community</a></li>
              <li><a href="contact.html">Contact</a></li>
            </ul>
          </div>
          <div>
            <h2>Get involved</h2>
            <ul>
              <li><a href="our-community.html#entrepreneurs">Entrepreneurs</a></li>
              <li><a href="our-community.html#researchers">Researchers</a></li>
              <li><a href="our-community.html#clinicians">Clinicians</a></li>
              <li><a href="our-community.html#patients">Patients</a></li>
              <li><a href="our-community.html#sponsors">Sponsors and partners</a></li>
            </ul>
          </div>
          <div>
            <h2>Contact</h2>
            <p>Birmingham, West Midlands, UK<br><a href="mailto:hello@cancerinnovate.com">hello@cancerinnovate.com</a></p>
            <h2 style="margin-top:22px">Stay connected</h2>
            <p>Research collaborations, funding routes, and community events.</p>
            <form class="newsletter" data-form="newsletter">
              <label class="sr" for="news-email" style="position:absolute;left:-999px">Email</label>
              <input id="news-email" name="email" type="email" required placeholder="Email address">
              <button type="submit">Join</button>
            </form>
            <p class="form-error" data-for="newsletter"></p>
          </div>
        </div>
        <div class="legal">
          <span>© 2026 Cancer Innovate. Pioneering cancer innovation in the Midlands and beyond.</span>
          <a href="privacy.html">Privacy policy</a>
        </div>
      </div>
    </footer>`;
}

function setupNav() {
  const header = document.querySelector(".site-header");
  const menuBtn = document.querySelector(".menu-btn");
  const nav = document.querySelector(".nav");
  menuBtn.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });
  document.querySelectorAll(".nav-toggle").forEach((btn) => {
    btn.addEventListener("click", (event) => {
      const item = btn.parentElement;
      const open = item.classList.toggle("open");
      btn.setAttribute("aria-expanded", String(open));
      event.stopPropagation();
    });
  });
  document.addEventListener("click", () => {
    document.querySelectorAll(".nav-item.open").forEach((item) => {
      item.classList.remove("open");
      item.querySelector(".nav-toggle")?.setAttribute("aria-expanded", "false");
    });
  });
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

function validEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function setupForms() {
  document.querySelectorAll("form[data-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const kind = form.dataset.form;
      const error = form.parentElement.querySelector(`[data-for="${kind}"]`) || form.querySelector(".form-error");
      const data = Object.fromEntries(new FormData(form).entries());
      if (data.email && !validEmail(String(data.email))) {
        if (error) error.textContent = "Enter a valid email address.";
        return;
      }
      if (kind === "contact" && !String(data.name || "").trim()) {
        if (error) error.textContent = "Name is required.";
        return;
      }
      if (kind === "newsletter") {
        form.innerHTML = `<p class="success" style="color:#143026;background:transparent;padding:0">You are on the list. We will write to ${data.email}.</p>`;
        return;
      }
      const subject = encodeURIComponent("Cancer Innovate enquiry");
      const body = encodeURIComponent(
        `Name: ${data.name || ""}\nEmail: ${data.email || ""}\nPhone: ${data.phone || ""}\nOrganisation: ${data.organisation || ""}\nI am a: ${data.role || ""}\n\n${data.message || ""}`
      );
      form.hidden = true;
      const success = document.createElement("div");
      success.className = "success";
      success.innerHTML = `<strong>Request ready.</strong> Your email app will open with this message addressed to hello@cancerinnovate.com. If it does not, write to us directly.`;
      form.insertAdjacentElement("afterend", success);
      window.location.href = `mailto:hello@cancerinnovate.com?subject=${subject}&body=${body}`;
    });
  });
}

function prefillContact() {
  const params = new URLSearchParams(window.location.search);
  const role = params.get("as");
  const select = document.querySelector("select[name='role']");
  if (role && select) {
    const match = [...select.options].find((option) => option.value === role);
    if (match) select.value = role;
  }
}

function setupReveal() {
  document.querySelectorAll(".card, .path, .panel, .work-item, .note, .feature-list li, .prose, .cta-band, .community-banner, .form").forEach((el) => {
    if (!el.hasAttribute("data-reveal")) el.setAttribute("data-reveal", "");
  });
  const elements = document.querySelectorAll("[data-reveal]");
  if (!elements.length || !('IntersectionObserver' in window)) {
    elements.forEach((element) => element.classList.add("revealed"));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("revealed");
      entry.target.querySelectorAll("[data-count]").forEach(countUp);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  elements.forEach((element) => observer.observe(element));
}

function countUp(el) {
  const target = parseFloat(el.dataset.count);
  const decimals = parseInt(el.dataset.decimals || "0", 10);
  const suffix = el.dataset.suffix || "";
  const duration = 1800;
  const start = performance.now();
  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = (target * eased).toFixed(decimals) + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const CHAT_RESPONSES = [
  { keys: ["innovation hub", "hub", "innovation"], reply: "The Innovation Hub is our dedicated space for pioneering cancer ideas — offering founders mentorship, clinical access and funding pathways.", link: ["Explore the Innovation Hub", "innovation-hub.html"] },
  { keys: ["research", "centre", "study", "clinical"], reply: "The Research Centre connects clinicians and researchers to accelerate non-invasive early screening, with patients involved in the design of the work.", link: ["Discover the Research Centre", "research-centre.html"] },
  { keys: ["quantum", "ai", "artificial", "data", "technology"], reply: "We explore how AI and quantum computing could transform cancer diagnostics — from earlier detection to smarter screening tools.", link: ["See Quantum & AI", "research-centre.html"] },
  { keys: ["patient", "experience", "lived"], reply: "Patients shape everything we do. Share your perspective and help design solutions that work in real life.", link: ["Share your experience", "our-community.html#patients"] },
  { keys: ["sponsor", "partner", "invest", "fund"], reply: "We welcome sponsors and partners who want to align with life-saving innovation and gain a visible Midlands platform.", link: ["Become a partner", "contact.html?as=sponsor"] },
  { keys: ["entrepreneur", "founder", "startup", "venture", "idea"], reply: "Entrepreneurs get mentorship, clinical access and funding pathways. Bring an ambitious idea and we will help it move.", link: ["Introduce a venture", "contact.html?as=entrepreneur"] },
  { keys: ["clinician", "doctor", "nurse", "nhs"], reply: "Clinicians help us judge what would truly change practice — and where new tools would fail. Your insight is valuable.", link: ["Join as a clinician", "contact.html?as=clinician"] },
  { keys: ["where", "location", "birmingham", "address", "based"], reply: "We are based in Birmingham, West Midlands, UK — building local strength with global ambition." },
  { keys: ["90 seconds", "charity", "ninety"], reply: "We proudly support 90 Seconds, a charity providing fast financial assistance to cancer patients in treatment.", link: ["Visit 90 Seconds", "https://ninetyseconds.org/"] },
  { keys: ["enquire", "enquiry", "contact", "email", "talk", "call", "message"], reply: "You can reach the team at hello@cancerinnovate.com, or use our contact form.", link: ["Go to contact form", "contact.html"] },
  { keys: ["volunteer", "join", "community", "involved", "participate"], reply: "There are five ways in — entrepreneurs, researchers, clinicians, patients and partners. Which describes you best?", link: ["Explore the community", "our-community.html"] },
  { keys: ["screen", "detect", "diagnos"], reply: "Our core focus is non-invasive early cancer screening — finding cancer sooner and more gently, when treatment works best." },
  { keys: ["hello", "hi", "hey"], reply: "Hello, and welcome to Cancer Innovate. Ask me about the Innovation Hub, research, partnerships or how to get involved." },
];

const CHAT_FALLBACK = "I can help with the Innovation Hub, Research Centre (including Quantum & AI), community pathways or contacting the team. For anything else, write to hello@cancerinnovate.com.";

function renderChatbot() {
  const widget = document.createElement("div");
  widget.className = "chatbot";
  widget.innerHTML = `
    <button class="chatbot-toggle" aria-label="Open assistant" aria-expanded="false">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5c-1.4 0-2.7-.3-3.9-.9L4 20.5l1.2-3.9A8.5 8.5 0 1 1 21 11.5z"/><path d="M9 10.5h6M9 13.5h3.5"/></svg>
    </button>
    <div class="chatbot-panel" hidden>
      <div class="chatbot-head">
        <div class="chatbot-avatar"><img src="images/mark.png" alt="" onerror="this.textContent='CI'"></div>
        <div><strong>Cancer Innovate</strong><span><i class="chat-status"></i>Online assistant</span></div>
        <button class="chatbot-close" aria-label="Close assistant">×</button>
      </div>
      <div class="chatbot-body" aria-live="polite"></div>
      <div class="chatbot-chips">
        <button>Innovation Hub</button><button>Research Centre</button><button>Get involved</button><button>Contact</button>
      </div>
      <form class="chatbot-form">
        <input type="text" name="message" placeholder="Write a message…" autocomplete="off" aria-label="Chat message">
        <button type="submit" aria-label="Send">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
        </button>
      </form>
    </div>`;
  document.body.appendChild(widget);

  const toggle = widget.querySelector(".chatbot-toggle");
  const panel = widget.querySelector(".chatbot-panel");
  const body = widget.querySelector(".chatbot-body");
  const form = widget.querySelector(".chatbot-form");

  function say(text, mine, link) {
    const bubble = document.createElement("p");
    bubble.className = mine ? "chat-msg mine" : "chat-msg";
    bubble.textContent = text;
    if (link) {
      const anchor = document.createElement("a");
      anchor.className = "chat-link";
      anchor.href = link[1];
      anchor.textContent = link[0] + " →";
      if (link[1].startsWith("http")) { anchor.target = "_blank"; anchor.rel = "noopener noreferrer"; }
      bubble.appendChild(anchor);
    }
    body.appendChild(bubble);
    body.scrollTop = body.scrollHeight;
  }

  function respond(raw) {
    const text = raw.toLowerCase();
    const match = CHAT_RESPONSES.find((item) => item.keys.some((key) => text.includes(key)));
    const typing = document.createElement("p");
    typing.className = "chat-msg chat-typing";
    typing.innerHTML = "<i></i><i></i><i></i>";
    window.setTimeout(() => { body.appendChild(typing); body.scrollTop = body.scrollHeight; }, 300);
    window.setTimeout(() => {
      typing.remove();
      say(match ? match.reply : CHAT_FALLBACK, false, match && match.link);
    }, 800 + Math.min(text.length * 15, 700));
  }

  function send(raw) {
    const text = raw.trim();
    if (!text) return;
    say(text, true);
    respond(text);
  }

  toggle.addEventListener("click", () => {
    const open = panel.hidden;
    panel.hidden = !open;
    toggle.setAttribute("aria-expanded", String(open));
    widget.classList.toggle("open", open);
    if (open && !body.children.length) {
      say("Hello — I’m the Cancer Innovate assistant. Ask me about the hub, research, partnerships or how to get involved.");
    }
  });
  widget.querySelector(".chatbot-close").addEventListener("click", () => {
    panel.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
    widget.classList.remove("open");
  });
  widget.querySelectorAll(".chatbot-chips button").forEach((chip) => {
    chip.addEventListener("click", () => send(chip.textContent));
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    send(form.message.value);
    form.reset();
  });
}

renderHeader();
renderFooter();
setupNav();
setupForms();
prefillContact();
setupReveal();
renderChatbot();
