
/* =========================================
   VORTEX VPN - Application Core
   Powered by PKDEV
   ========================================= */

"use strict";

const VortexVPN = (() => {

  const CONFIG = {
    version: "2.0.0",
    defaultLanguage: "en",
    supportedLanguages: ["en", "fa"],
    defaultCountry: "US"
  };

  const state = {
    language: CONFIG.defaultLanguage,
    selectedCountry: CONFIG.defaultCountry,
    selectedCity: null,
    connectionStatus: "disconnected",
    serverData: [],
    ipInfo: null
  };

  const countries = [
    {
      code: "US",
      name: "United States",
      flag: "🇺🇸",
      cities: ["New York", "Los Angeles", "Chicago"]
    },
    {
      code: "DE",
      name: "Germany",
      flag: "🇩🇪",
      cities: ["Frankfurt", "Berlin"]
    },
    {
      code: "GB",
      name: "United Kingdom",
      flag: "🇬🇧",
      cities: ["London", "Manchester"]
    },
    {
      code: "FR",
      name: "France",
      flag: "🇫🇷",
      cities: ["Paris", "Marseille"]
    },
    {
      code: "NL",
      name: "Netherlands",
      flag: "🇳🇱",
      cities: ["Amsterdam", "Rotterdam"]
    },
    {
      code: "JP",
      name: "Japan",
      flag: "🇯🇵",
      cities: ["Tokyo", "Osaka"]
    }
  ];

  const translations = {
    en: {
      disconnected: "Disconnected",
      connected: "Connected",
      connecting: "Connecting...",
      unavailable: "Server unavailable",
      comingSoon: "Coming Soon",
      selectCountry: "Select Country",
      selectCity: "Select City",
      noServers: "No active servers available",
      connect: "Connect",
      disconnect: "Disconnect",
      privacy: "Privacy Center",
      network: "Network Tools",
      locations: "Locations",
      home: "Home"
    },

    fa: {
      disconnected: "قطع شده",
      connected: "متصل",
      connecting: "در حال اتصال...",
      unavailable: "سرور در دسترس نیست",
      comingSoon: "به‌زودی",
      selectCountry: "انتخاب کشور",
      selectCity: "انتخاب شهر",
      noServers: "هیچ سرور فعالی وجود ندارد",
      connect: "اتصال",
      disconnect: "قطع اتصال",
      privacy: "مرکز حریم خصوصی",
      network: "ابزارهای شبکه",
      locations: "موقعیت‌ها",
      home: "خانه"
    }
  };

  /* ---------- Utilities ---------- */

  function getElement(selector) {
    return document.querySelector(selector);
  }

  function getAll(selector) {
    return document.querySelectorAll(selector);
  }

  function emit(name, detail = {}) {
    window.dispatchEvent(
      new CustomEvent(`vortex:${name}`, { detail })
    );
  }

  function getTranslation(key) {
    return translations[state.language]?.[key] || key;
  }

  /* ---------- Language ---------- */

  function setLanguage(language) {
    if (!CONFIG.supportedLanguages.includes(language)) {
      return false;
    }

    state.language = language;

    document.documentElement.lang = language;
    document.documentElement.dir =
      language === "fa" ? "rtl" : "ltr";

    getAll("[data-i18n]").forEach(element => {
      const key = element.dataset.i18n;
      element.textContent = getTranslation(key);
    });

    emit("languageChanged", { language });

    return true;
  }

  /* ---------- Country Selection ---------- */

  function getCountries() {
    return countries.map(country => ({
      ...country,
      status: "planned"
    }));
  }

  function selectCountry(code) {
    const country = countries.find(item => item.code === code);

    if (!country) {
      return false;
    }

    state.selectedCountry = code;
    state.selectedCity = null;

    emit("countryChanged", {
      country,
      status: "planned"
    });

    return true;
  }

  function selectCity(city) {
    const country = countries.find(
      item => item.code === state.selectedCountry
    );

    if (!country || !country.cities.includes(city)) {
      return false;
    }

    state.selectedCity = city;

    emit("cityChanged", {
      country: country.code,
      city,
      status: "planned"
    });

    return true;
  }

  /* ---------- Connection State ---------- */

  function setConnectionStatus(status) {
    const allowed = [
      "disconnected",
      "connecting",
      "connected",
      "error"
    ];

    if (!allowed.includes(status)) {
      return false;
    }

    state.connectionStatus = status;

    emit("connectionStatusChanged", { status });

    return true;
  }

  async function connect() {
    if (state.connectionStatus !== "disconnected") {
      return false;
    }

    const country = countries.find(
      item => item.code === state.selectedCountry
    );

    setConnectionStatus("error");

    emit("connectionError", {
      message: "No configured VPN provider or active gateway.",
      country: country?.code || null,
      city: state.selectedCity
    });

    return false;
  }

  async function disconnect() {
    if (state.connectionStatus !== "connected") {
      return false;
    }

    emit("connectionError", {
      message: "No active VPN connection is configured."
    });

    return false;
  }

  /* ---------- Public IP Lookup ---------- */

  async function getPublicIP() {
    try {
      const response = await fetch(
        "https://ipwho.is/",
        { cache: "no-store" }
      );

      if (!response.ok) {
        throw new Error("IP service unavailable");
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error("Unable to retrieve IP information");
      }

      state.ipInfo = {
        ip: data.ip,
        country: data.country,
        city: data.city,
        isp: data.connection?.isp || "Unknown"
      };

      emit("ipUpdated", state.ipInfo);

      return state.ipInfo;

    } catch (error) {
      emit("ipError", { message: error.message });
      return null;
    }
  }

  /* ---------- Status & Information ---------- */

  function getState() {
    return {
      ...state,
      countries: getCountries()
    };
  }

  function getVersion() {
    return CONFIG.version;
  }

  function init() {
    setLanguage(CONFIG.defaultLanguage);

    emit("initialized", {
      version: CONFIG.version
    });

    getPublicIP();
  }

  return {
    init,
    getState,
    getVersion,
    getTranslation,
    setLanguage,
    getCountries,
    selectCountry,
    selectCity,
    connect,
    disconnect,
    getPublicIP,
    setConnectionStatus
  };

})();

/* ---------- Start Application ---------- */

document.addEventListener("DOMContentLoaded", () => {
  VortexVPN.init();
});

window.VortexVPN = VortexVPN;
