
/* =========================================
   VORTEX VPN - Application Core
   Version 2.1.0
   Powered by PKDEV
========================================= */

"use strict";

const VortexVPN = (() => {

  /* =======================================
     CONFIGURATION
  ======================================= */

  const CONFIG = {
    version: "2.1.0",
    defaultLanguage: "en",
    supportedLanguages: ["en", "fa"],
    ipService: "https://ipwho.is/"
  };

  const state = {
    language: CONFIG.defaultLanguage,
    connectionStatus: "disconnected",
    selectedServer: "us-new-york",
    ipInfo: null
  };

  /* =======================================
     SERVER LOCATIONS
  ======================================= */

  const countries = [
    {
      code: "US",
      name: "United States",
      nameFa: "ایالات متحده",
      flag: "🇺🇸",
      cities: ["New York", "Los Angeles", "Chicago"]
    },
    {
      code: "DE",
      name: "Germany",
      nameFa: "آلمان",
      flag: "🇩🇪",
      cities: ["Frankfurt", "Berlin"]
    },
    {
      code: "GB",
      name: "United Kingdom",
      nameFa: "بریتانیا",
      flag: "🇬🇧",
      cities: ["London", "Manchester"]
    },
    {
      code: "FR",
      name: "France",
      nameFa: "فرانسه",
      flag: "🇫🇷",
      cities: ["Paris", "Marseille"]
    },
    {
      code: "NL",
      name: "Netherlands",
      nameFa: "هلند",
      flag: "🇳🇱",
      cities: ["Amsterdam", "Rotterdam"]
    },
    {
      code: "JP",
      name: "Japan",
      nameFa: "ژاپن",
      flag: "🇯🇵",
      cities: ["Tokyo", "Osaka"]
    }
  ];

  /* =======================================
     TRANSLATIONS
  ======================================= */

  const translations = {

    en: {
      "nav.home": "Home",
      "nav.tools": "Tools",
      "nav.locations": "Locations",
      "nav.privacy": "Privacy",
      "nav.faq": "FAQ",

      "hero.badge": "YOUR PRIVACY MATTERS",
      "hero.title": "Your Digital World.",
      "hero.title2": "Without Borders.",
      "hero.description":
        "Explore privacy tools, check your connection and discover the VORTEX network.",
      "hero.locations": "Explore Locations",
      "hero.tools": "Explore Tools",
      "hero.notice":
        "VPN gateway integration is not configured yet.",

      "ip.tag": "NETWORK INFORMATION",
      "ip.title": "Your Public IP",
      "ip.address": "IP ADDRESS",
      "ip.refresh": "Refresh",
      "ip.loading": "Checking your IP...",
      "ip.failed": "Unable to retrieve IP information",
      "ip.unknown": "Location unavailable",

      "features.tag": "WHAT WE OFFER",
      "features.title": "Explore VORTEX",
      "features.privacy.title": "Privacy First",
      "features.privacy.description":
        "Explore tools designed to help you understand your online privacy.",
      "features.network.title": "Network Tools",
      "features.network.description":
        "Check your IP, DNS, WebRTC and connection information.",
      "features.locations.title": "Global Locations",
      "features.locations.description":
        "Explore planned VORTEX server locations around the world.",

      "tools.tag": "NETWORK DIAGNOSTICS",
      "tools.title": "Connection Tools",
      "tools.description":
        "Check your network information and browser privacy settings.",
      "tools.speed.title": "Speed Test",
      "tools.speed.description":
        "Measure response time to our diagnostic service.",
      "tools.speed.button": "Start Test",
      "tools.dns.title": "DNS Information",
      "tools.dns.description":
        "Run a DNS lookup using a public DNS service.",
      "tools.dns.button": "Check DNS",
      "tools.webrtc.title": "WebRTC Check",
      "tools.webrtc.description":
        "Check whether your browser supports WebRTC.",
      "tools.webrtc.button": "Check WebRTC",
      "tools.connection.title": "Connection Details",
      "tools.connection.description":
        "View available browser connection information.",
      "tools.connection.button": "View Details",
      "tools.note":
        "Browser-based diagnostic results are informational and may not reveal every network detail.",

      "locations.tag": "GLOBAL NETWORK",
      "locations.title": "Server Locations",
      "locations.description":
        "Explore the locations planned for the VORTEX network.",
      "locations.notice":
        "Locations are planned. No active VPN gateways are currently available.",
      "locations.planned": "PLANNED",
      "locations.cities": "Available cities",

      "privacy.tag": "YOUR DATA, YOUR CONTROL",
      "privacy.title": "Privacy & Security",
      "privacy.description":
        "Understand what VORTEX does and what it does not do.",
      "privacy.transparency.title": "Transparency",
      "privacy.transparency.description":
        "We clearly identify planned features and active services.",
      "privacy.control.title": "User Control",
      "privacy.control.description":
        "You should understand which network settings are being changed.",
      "privacy.honesty.title": "No Fake Connections",
      "privacy.honesty.description":
        "A location selection does not mean a VPN connection is active.",
      "privacy.important.title": "Important Notice",
      "privacy.important.description":
        "The current website does not create an encrypted VPN tunnel or route your internet traffic through another country. Real VPN functionality requires an operational VPN gateway and compatible client integration.",

      "faq.title": "Frequently Asked Questions",
      "faq.description":
        "Answers to common questions about VORTEX VPN.",

      "footer.description":
        "A privacy-focused network project by PKDEV.",

      "status.disconnected": "Disconnected",
      "status.connected": "Connected",
      "status.error": "Connection Error",

      "toast.copied": "Copied to clipboard",
      "toast.error": "Something went wrong"
    },

    fa: {
      "nav.home": "خانه",
      "nav.tools": "ابزارها",
      "nav.locations": "موقعیت‌ها",
      "nav.privacy": "حریم خصوصی",
      "nav.faq": "سؤالات متداول",

      "hero.badge": "حریم خصوصی شما اهمیت دارد",
      "hero.title": "دنیای دیجیتال شما.",
      "hero.title2": "بدون مرز.",
      "hero.description":
        "ابزارهای حریم خصوصی را بررسی کنید، وضعیت شبکه خود را بسنجید و با شبکه VORTEX آشنا شوید.",
      "hero.locations": "مشاهده موقعیت‌ها",
      "hero.tools": "مشاهده ابزارها",
      "hero.notice":
        "اتصال به درگاه VPN هنوز پیکربندی نشده است.",

      "ip.tag": "اطلاعات شبکه",
      "ip.title": "آدرس IP عمومی شما",
      "ip.address": "آدرس IP",
      "ip.refresh": "بروزرسانی",
      "ip.loading": "در حال بررسی IP...",
      "ip.failed": "دریافت اطلاعات IP امکان‌پذیر نیست",
      "ip.unknown": "موقعیت نامشخص",

      "features.tag": "امکانات ما",
      "features.title": "VORTEX را کشف کنید",
      "features.privacy.title": "اولویت با حریم خصوصی",
      "features.privacy.description":
        "ابزارهایی برای آشنایی بیشتر با حریم خصوصی آنلاین شما.",
      "features.network.title": "ابزارهای شبکه",
      "features.network.description":
        "بررسی IP، DNS، WebRTC و اطلاعات اتصال.",
      "features.locations.title": "موقعیت‌های جهانی",
      "features.locations.description":
        "موقعیت سرورهای برنامه‌ریزی‌شده VORTEX را مشاهده کنید.",

      "tools.tag": "عیب‌یابی شبکه",
      "tools.title": "ابزارهای اتصال",
      "tools.description":
        "اطلاعات شبکه و تنظیمات حریم خصوصی مرورگر خود را بررسی کنید.",
      "tools.speed.title": "تست سرعت",
      "tools.speed.description":
        "زمان پاسخ‌گویی سرویس بررسی شبکه را اندازه‌گیری کنید.",
      "tools.speed.button": "شروع تست",
      "tools.dns.title": "اطلاعات DNS",
      "tools.dns.description":
        "با استفاده از یک سرویس DNS عمومی، جست‌وجوی DNS انجام دهید.",
      "tools.dns.button": "بررسی DNS",
      "tools.webrtc.title": "بررسی WebRTC",
      "tools.webrtc.description":
        "پشتیبانی مرورگر خود از WebRTC را بررسی کنید.",
      "tools.webrtc.button": "بررسی WebRTC",
      "tools.connection.title": "جزئیات اتصال",
      "tools.connection.description":
        "اطلاعات اتصال در دسترس مرورگر را مشاهده کنید.",
      "tools.connection.button": "مشاهده جزئیات",
      "tools.note":
        "نتایج ابزارهای مرورگر صرفاً اطلاعاتی هستند و ممکن است تمام جزئیات شبکه را نشان ندهند.",

      "locations.tag": "شبکه جهانی",
      "locations.title": "موقعیت سرورها",
      "locations.description":
        "موقعیت‌های برنامه‌ریزی‌شده برای شبکه VORTEX را مشاهده کنید.",
      "locations.notice":
        "این موقعیت‌ها برنامه‌ریزی شده‌اند و در حال حاضر هیچ درگاه VPN فعالی وجود ندارد.",
      "locations.planned": "به‌زودی",
      "locations.cities": "شهرهای موجود",

      "privacy.tag": "اطلاعات شما، کنترل شما",
      "privacy.title": "حریم خصوصی و امنیت",
      "privacy.description":
        "با قابلیت‌های واقعی VORTEX و محدودیت‌های آن آشنا شوید.",
      "privacy.transparency.title": "شفافیت",
      "privacy.transparency.description":
        "قابلیت‌های برنامه‌ریزی‌شده و سرویس‌های فعال را به‌وضوح مشخص می‌کنیم.",
      "privacy.control.title": "کنترل کاربر",
      "privacy.control.description":
        "باید بدانید چه تنظیماتی در شبکه شما تغییر می‌کنند.",
      "privacy.honesty.title": "بدون اتصال جعلی",
      "privacy.honesty.description":
        "انتخاب یک موقعیت به معنی فعال بودن اتصال VPN نیست.",
      "privacy.important.title": "اطلاعیه مهم",
      "privacy.important.description":
        "وب‌سایت فعلی تونل رمزگذاری‌شده VPN ایجاد نمی‌کند و ترافیک اینترنت شما را از کشور دیگری عبور نمی‌دهد. برای VPN واقعی به سرور فعال و اتصال نرم‌افزاری سازگار نیاز است.",

      "faq.title": "سؤالات متداول",
      "faq.description":
        "پاسخ پرسش‌های متداول درباره VORTEX VPN.",

      "footer.description":
        "پروژه‌ای با تمرکز بر حریم خصوصی، توسعه‌یافته توسط PKDEV.",

      "status.disconnected": "قطع شده",
      "status.connected": "متصل",
      "status.error": "خطای اتصال",

      "toast.copied": "در کلیپ‌بورد کپی شد",
      "toast.error": "مشکلی رخ داد"
    }

  };

  /* =======================================
     FAQ CONTENT
  ======================================= */

  const faq = [
    {
      q: {
        en: "What is VORTEX VPN?",
        fa: "VORTEX VPN چیست؟"
      },
      a: {
        en: "VORTEX is a privacy-focused network project. Its website and browser extension are currently under development.",
        fa: "VORTEX یک پروژه شبکه با تمرکز بر حریم خصوصی است. وب‌سایت و افزونه مرورگر آن در حال توسعه هستند."
      }
    },
    {
      q: {
        en: "Can I connect to a New York server now?",
        fa: "آیا در حال حاضر می‌توانم به سرور نیویورک متصل شوم؟"
      },
      a: {
        en: "Not yet. The listed locations are planned and do not currently have active VPN gateways.",
        fa: "هنوز خیر. موقعیت‌های نمایش‌داده‌شده برنامه‌ریزی شده‌اند و در حال حاضر سرور VPN فعالی ندارند."
      }
    },
    {
      q: {
        en: "Does the website change my IP?",
        fa: "آیا وب‌سایت IP من را تغییر می‌دهد؟"
      },
      a: {
        en: "No. The website can display your public IP, but it does not route your traffic through a VPN.",
        fa: "خیر. وب‌سایت می‌تواند IP عمومی شما را نمایش دهد، اما ترافیک شما را از VPN عبور نمی‌دهد."
      }
    },
    {
      q: {
        en: "Is the Chrome extension ready?",
        fa: "آیا افزونه Chrome آماده است؟"
      },
      a: {
        en: "The initial extension interface is being developed. A real proxy server is required before it can provide a working connection.",
        fa: "رابط اولیه افزونه در حال توسعه است. برای ایجاد اتصال واقعی، به یک سرور پراکسی فعال نیاز داریم."
      }
    },
    {
      q: {
        en: "Who develops VORTEX?",
        fa: "توسعه‌دهنده VORTEX کیست؟"
      },
      a: {
        en: "VORTEX VPN is a project powered by PKDEV.",
        fa: "VORTEX VPN پروژه‌ای با پشتیبانی PKDEV است."
      }
    }
  ];

  /* =======================================
     HELPERS
  ======================================= */

  const $ = (selector) =>
    document.querySelector(selector);

  const $$ = (selector) =>
    document.querySelectorAll(selector);

  function t(key) {
    return translations[state.language]?.[key] || key;
  }

  function emit(name, detail = {}) {
    window.dispatchEvent(
      new CustomEvent(`vortex:${name}`, { detail })
    );
  }

  function showToast(message) {
    const toast = $("#toast");

    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("visible");

    clearTimeout(showToast.timer);

    showToast.timer = setTimeout(() => {
      toast.classList.remove("visible");
    }, 2800);
  }

  /* =======================================
     LANGUAGE SYSTEM
  ======================================= */

  function setLanguage(language) {

    if (!CONFIG.supportedLanguages.includes(language)) {
      return false;
    }

    state.language = language;

    document.documentElement.lang = language;
    document.documentElement.dir =
      language === "fa" ? "rtl" : "ltr";

    $$("[data-i18n]").forEach(element => {

      const key = element.dataset.i18n;

      // Preserve the styled span inside the hero title.
      if (key === "hero.title") {
        const span = element.querySelector("span");

        if (span) {
          const firstText = [...element.childNodes]
            .find(node => node.nodeType === Node.TEXT_NODE);

          if (firstText) {
            firstText.textContent = t("hero.title") + " ";
          }

          span.textContent = t("hero.title2");
        } else {
          element.textContent =
            t("hero.title") + " " + t("hero.title2");
        }

        return;
      }

      element.textContent = t(key);
    });

    const langButton = $("#langBtn");

    if (langButton) {
      langButton.textContent =
        language === "en" ? "فارسی / EN" : "EN / فارسی";
    }

    renderLocations();
    renderFAQ();

    emit("languageChanged", { language });

    try {
      localStorage.setItem("vortex_language", language);
    } catch (_) {}

    return true;
  }

  function toggleLanguage() {
    const next =
      state.language === "en" ? "fa" : "en";

    setLanguage(next);
  }

  /* =======================================
     NAVIGATION
  ======================================= */

  function showPage(pageId) {

    const target = $("#" + pageId);

    if (!target || !target.classList.contains("page")) {
      return;
    }

    $$(".page").forEach(page => {
      page.classList.remove("active");
    });

    target.classList.add("active");

    $$("[data-page]").forEach(link => {
      link.classList.toggle(
        "active",
        link.dataset.page === pageId
      );
    });

    const nav = $("#navLinks");

    if (nav) {
      nav.classList.remove("open");
    }

    const menuButton = $("#menuBtn");

    if (menuButton) {
      menuButton.setAttribute("aria-expanded", "false");
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  function initNavigation() {

    $$("[data-page]").forEach(link => {

      link.addEventListener("click", event => {

        const page = link.dataset.page;

        if (!page) return;

        event.preventDefault();

        history.pushState(null, "", "#" + page);

        showPage(page);
      });

    });

    window.addEventListener("popstate", () => {
      showPage(
        location.hash.replace("#", "") || "home"
      );
    });

    const initialPage =
      location.hash.replace("#", "") || "home";

    showPage(initialPage);

    const menuButton = $("#menuBtn");
    const nav = $("#navLinks");

    if (menuButton && nav) {
      menuButton.addEventListener("click", () => {

        const opened = nav.classList.toggle("open");

        menuButton.setAttribute(
          "aria-expanded",
          String(opened)
        );
      });
    }
  }

  /* =======================================
     IP INFORMATION
  ======================================= */

  async function getPublicIP() {

    const ipElement = $("#ipAddress");
    const metaElement = $("#ipMeta");

    if (ipElement) {
      ipElement.textContent = t("ip.loading");
    }

    try {

      const response = await fetch(
        CONFIG.ipService,
        {
          method: "GET",
          cache: "no-store"
        }
      );

      if (!response.ok) {
        throw new Error("IP service unavailable");
      }

      const data = await response.json();

      if (!data.success || !data.ip) {
        throw new Error("IP information unavailable");
      }

      state.ipInfo = {
        ip: data.ip,
        country: data.country || "",
        city: data.city || "",
        isp: data.connection?.isp || "Unknown"
      };

      if (ipElement) {
        ipElement.textContent = state.ipInfo.ip;
      }

      if (metaElement) {
        metaElement.textContent = [
          state.ipInfo.city,
          state.ipInfo.country
        ].filter(Boolean).join(", ");
      }

      emit("ipUpdated", state.ipInfo);

      return state.ipInfo;

    } catch (error) {

      if (ipElement) {
        ipElement.textContent = t("ip.failed");
      }

      if (metaElement) {
        metaElement.textContent = "";
      }

      emit("ipError", {
        message: error.message
      });

      return null;
    }
  }

  /* =======================================
     LOCATION CARDS
  ======================================= */

  function getCountries() {
    return countries.map(country => ({
      ...country,
      status: "planned"
    }));
  }

  function renderLocations() {

    const container = $("#locationGrid");

    if (!container) return;

    container.innerHTML = "";

    countries.forEach(country => {

      const card = document.createElement("article");

      card.className = "card server-item location-card";

      const name =
        state.language === "fa"
          ? country.nameFa
          : country.name;

      const cityList = country.cities.join(" · ");

      card.innerHTML = `
        <div class="server-info">
          <div class="server-flag">${country.flag}</div>
          <div>
            <h3 class="server-name"></h3>
            <p class="server-location"></p>
          </div>
        </div>

        <div class="server-badge"></div>

        <div class="location-cities"></div>
      `;

      card.querySelector(".server-name").textContent = name;

      card.querySelector(".server-location").textContent =
        country.code;

      card.querySelector(".server-badge").textContent =
        t("locations.planned");

      card.querySelector(".location-cities").textContent =
        t("locations.cities") + ": " + cityList;

      container.appendChild(card);
    });
  }

  function selectCountry(code) {

    const country = countries.find(
      item => item.code === code
    );

    if (!country) return false;

    state.selectedServer = country.code;

    emit("countryChanged", {
      country,
      status: "planned"
    });

    return true;
  }

  /* =======================================
     FAQ
  ======================================= */

  function renderFAQ() {

    const container = $("#faqList");

    if (!container) return;

    container.innerHTML = "";

    faq.forEach(item => {

      const details = document.createElement("details");

      details.className = "faq-item";

      const summary = document.createElement("summary");

      const answer = document.createElement("p");

      summary.textContent = item.q[state.language];
      answer.textContent = item.a[state.language];

      details.appendChild(summary);
      details.appendChild(answer);

      container.appendChild(details);
    });
  }

  /* =======================================
     NETWORK TOOLS
  ======================================= */

  async function latencyTest() {

    const output = $("#speedOutput");

    if (!output) return;

    output.textContent = "Testing...";

    try {

      const start = performance.now();

      await fetch(
        CONFIG.ipService + "?t=" + Date.now(),
        { cache: "no-store" }
      );

      const elapsed = Math.round(
        performance.now() - start
      );

      output.textContent =
        elapsed + " ms response time";

    } catch (_) {

      output.textContent = "Test unavailable";
    }
  }

  async function dnsCheck() {

    const output = $("#dnsOutput");

    if (!output) return;

    output.textContent = "Checking...";

    try {

      const response = await fetch(
        "https://cloudflare-dns.com/dns-query?name=example.com&type=A",
        {
          headers: {
            Accept: "application/dns-json"
          },
          cache: "no-store"
        }
      );

      if (!response.ok) {
        throw new Error("DNS lookup failed");
      }

      const data = await response.json();

      output.textContent =
        data.Answer?.length
          ? "DNS lookup successful"
          : "No DNS answers returned";

    } catch (_) {

      output.textContent = "DNS check unavailable";
    }
  }

  function webrtcCheck() {

    const output = $("#webrtcOutput");

    if (!output) return;

    const supported =
      "RTCPeerConnection" in window;

    output.textContent = supported
      ? "WebRTC supported by browser"
      : "WebRTC not supported";

  }

  function connectionDetails() {

    const output = $("#connectionOutput");

    if (!output) return;

    const connection =
      navigator.connection ||
      navigator.mozConnection ||
      navigator.webkitConnection;

    if (!connection) {
      output.textContent =
        "Connection details unavailable";
      return;
    }

    const details = [];

    if (connection.effectiveType) {
      details.push(connection.effectiveType);
    }

    if (connection.downlink) {
      details.push(connection.downlink + " Mbps");
    }

    if (connection.rtt) {
      details.push(connection.rtt + " ms RTT");
    }

    output.textContent =
      details.join(" · ") || "No details available";
  }

  function initTools() {

    $("#speedBtn")?.addEventListener(
      "click",
      latencyTest
    );

    $("#dnsBtn")?.addEventListener(
      "click",
      dnsCheck
    );

    $("#webrtcBtn")?.addEventListener(
      "click",
      webrtcCheck
    );

    $("#connectionBtn")?.addEventListener(
      "click",
      connectionDetails
    );
  }

  /* =======================================
     INITIALIZATION
  ======================================= */

  function init() {

    let savedLanguage = CONFIG.defaultLanguage;

    try {
      const saved = localStorage.getItem("vortex_language");

      if (CONFIG.supportedLanguages.includes(saved)) {
        savedLanguage = saved;
      }
    } catch (_) {}

    setLanguage(savedLanguage);

    initNavigation();
    initTools();

    renderLocations();
    renderFAQ();

    $("#langBtn")?.addEventListener(
      "click",
      toggleLanguage
    );

    $("#ipRefresh")?.addEventListener(
      "click",
      getPublicIP
    );

    const year = $("#year");

    if (year) {
      year.textContent = new Date().getFullYear();
    }

    getPublicIP();

    emit("initialized", {
      version: CONFIG.version
    });

    console.log(
      `VORTEX VPN ${CONFIG.version} initialized.`
    );
  }

  return {
    init,
    getState: () => ({
      ...state,
      countries: getCountries()
    }),
    getVersion: () => CONFIG.version,
    getTranslation: t,
    setLanguage,
    toggleLanguage,
    getCountries,
    selectCountry,
    getPublicIP,
    renderLocations,
    renderFAQ
  };

})();

/* =========================================
   START APPLICATION
========================================= */

document.addEventListener("DOMContentLoaded", () => {
  VortexVPN.init();
});

window.VortexVPN = VortexVPN;
