
/* ==========================================
   VORTEX VPN
   Chrome Extension Background Service
   Powered by PKDEV
   Manifest V3
========================================== */

"use strict";

const VORTEX = {
  name: "VORTEX VPN",
  version: "2.0.0",
  storageKey: "vortex_connection"
};

/* ==========================================
   DEFAULT STATE
========================================== */

const DEFAULT_STATE = {
  connected: false,
  status: "disconnected",
  server: null,
  host: null,
  port: null,
  error: null
};

/* ==========================================
   STORAGE
========================================== */

async function getState() {
  const result = await chrome.storage.local.get(
    VORTEX.storageKey
  );

  return result[VORTEX.storageKey] || DEFAULT_STATE;
}

async function saveState(state) {
  await chrome.storage.local.set({
    [VORTEX.storageKey]: state
  });
}

/* ==========================================
   VALIDATE PROXY
========================================== */

function validateProxy(config) {
  if (!config || typeof config !== "object") {
    throw new Error("Invalid proxy configuration.");
  }

  const host = String(config.host || "").trim();
  const port = Number(config.port);

  if (
    !host ||
    host.length > 253 ||
    /[\/\\@\s]/.test(host)
  ) {
    throw new Error("Invalid proxy hostname.");
  }

  if (
    !Number.isInteger(port) ||
    port < 1 ||
    port > 65535
  ) {
    throw new Error("Invalid proxy port.");
  }

  return { host, port };
}

/* ==========================================
   CONNECT
========================================== */

async function connectProxy(config) {
  try {
    const { host, port } = validateProxy(config);

    await chrome.proxy.settings.set({
      value: {
        mode: "fixed_servers",
        rules: {
          singleProxy: {
            scheme: "https",
            host,
            port
          },
          bypassList: [
            "localhost",
            "127.0.0.1",
            "[::1]"
          ]
        }
      },
      scope: "regular"
    });

    const state = {
      connected: false,
      status: "proxy_configured",
      server: config.server || "Custom Server",
      host,
      port,
      error: null
    };

    await saveState(state);

    return {
      success: true,
      state,
      message: "Proxy settings configured. Connection must be verified."
    };

  } catch (error) {
    const state = {
      ...DEFAULT_STATE,
      status: "error",
      error: error.message
    };

    await saveState(state);

    return {
      success: false,
      state,
      message: error.message
    };
  }
}

/* ==========================================
   DISCONNECT
========================================== */

async function disconnectProxy() {
  try {
    await chrome.proxy.settings.clear({
      scope: "regular"
    });

    await saveState({
      ...DEFAULT_STATE
    });

    return {
      success: true,
      state: DEFAULT_STATE,
      message: "VORTEX proxy settings cleared."
    };

  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
}

/* ==========================================
   GET STATUS
========================================== */

async function getStatus() {
  const state = await getState();

  const settings = await chrome.proxy.settings.get({
    incognito: false
  });

  return {
    success: true,
    state,
    proxyControl: settings.levelOfControl,
    proxyMode: settings.value?.mode || "unknown"
  };
}

/* ==========================================
   MESSAGE HANDLER
========================================== */

chrome.runtime.onMessage.addListener(
  (message, sender, sendResponse) => {

    if (!message || !message.action) {
      return false;
    }

    const actions = {
      GET_STATUS: getStatus,

      CONNECT_PROXY: () =>
        connectProxy(message.config),

      DISCONNECT_PROXY: disconnectProxy
    };

    const action = actions[message.action];

    if (!action) {
      sendResponse({
        success: false,
        message: "Unknown VORTEX action."
      });

      return false;
    }

    action()
      .then(sendResponse)
      .catch(error => {
        sendResponse({
          success: false,
          message: error.message
        });
      });

    return true;
  }
);

/* ==========================================
   STARTUP
========================================== */

chrome.runtime.onInstalled.addListener(async () => {
  const state = await getState();

  if (!state.status) {
    await saveState(DEFAULT_STATE);
  }

  console.log(
    `${VORTEX.name} ${VORTEX.version} initialized.`
  );
});

console.log("VORTEX VPN background service loaded.");
