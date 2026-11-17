
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <meta name="theme-color" content="#0b0b10">

  <title>VORTEX VPN</title>

  <link rel="stylesheet" href="popup.css">
</head>

<body>

  <main class="app">

    <!-- HEADER -->
    <header class="header">

      <div class="brand">
        <div class="brand-logo">V</div>

        <div>
          <div class="brand-name">VORTEX VPN</div>
          <div class="brand-subtitle">SECURE CONNECTION</div>
        </div>
      </div>

      <div class="header-version">v2.0.0</div>

    </header>

    <!-- CONNECTION STATUS -->
    <section class="status-section">

      <div class="status-indicator">
        <span class="status-dot" id="statusDot"></span>
        <span id="statusLabel">DISCONNECTED</span>
      </div>

      <h1 class="status-title" id="statusTitle">
        You're Protected?
      </h1>

      <p class="status-description" id="statusDescription">
        Select a server to configure your connection.
      </p>

    </section>

    <!-- POWER BUTTON -->
    <section class="power-area">

      <button
        class="power-button"
        id="powerButton"
        type="button"
        aria-label="Connect or disconnect"
      >
        <svg
          width="45"
          height="45"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M12 2v10"></path>
          <path d="M5.6 5.6a9 9 0 1 0 12.8 0"></path>
        </svg>
      </button>

    </section>

    <!-- SERVER SELECTION -->
    <section class="server-section">

      <div class="section-label">
        SELECT LOCATION
      </div>

      <div class="server-card">

        <div class="server-info">

          <div class="server-flag" id="serverFlag">
            🇺🇸
          </div>

          <div>
            <div class="server-name" id="serverName">
              United States
            </div>

            <div class="server-location" id="serverLocation">
              New York
            </div>
          </div>

        </div>

        <div class="server-badge">
          PLANNED
        </div>

      </div>

      <select
        class="server-select"
        id="serverSelect"
        aria-label="Choose VPN server"
      >
        <option value="us-new-york">
          United States — New York
        </option>

        <option value="us-los-angeles">
          United States — Los Angeles
        </option>

        <option value="us-chicago">
          United States — Chicago
        </option>

        <option value="de-frankfurt">
          Germany — Frankfurt
        </option>

        <option value="de-berlin">
          Germany — Berlin
        </option>

        <option value="gb-london">
          United Kingdom — London
        </option>

        <option value="fr-paris">
          France — Paris
        </option>

        <option value="nl-amsterdam">
          Netherlands — Amsterdam
        </option>

        <option value="jp-tokyo">
          Japan — Tokyo
        </option>
      </select>

    </section>

    <!-- CONNECTION INFORMATION -->
    <section class="info-grid">

      <div class="info-card">
        <div class="info-label">YOUR IP</div>
        <div class="info-value muted" id="ipAddress">
          Checking...
        </div>
      </div>

      <div class="info-card">
        <div class="info-label">CONNECTION</div>
        <div class="info-value muted" id="connectionType">
          Not connected
        </div>
      </div>

    </section>

    <!-- ERROR MESSAGE -->
    <div
      class="error-message"
      id="errorMessage"
      role="alert"
    ></div>

    <!-- FOOTER -->
    <footer class="footer">

      <div class="footer-brand">
        POWERED BY <strong>PKDEV</strong>
      </div>

      <button
        class="footer-link"
        id="settingsButton"
        type="button"
      >
        Settings
      </button>

    </footer>

  </main>

  <script src="popup.js"></script>

</body>
</html>
