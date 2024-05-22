const url = window.location.href;

const nycBusinessHours = {
  start: 9,
  end: 17,
  timeZone: "America/New_York",
  locale: "en"
};

const berlinBusinessHours = {
  start: 9,
  end: 17,
  timeZone: "Europe/Berlin",
  locale: "de"
};

function isOutsideBusinessHours() {
  const { start, end, timeZone } = url.includes("en-us")
    ? nycBusinessHours
    : berlinBusinessHours;

  const now = new Date();
  const localTime = new Date(now.toLocaleString("en-US", { timeZone }));

  const localHours = localTime.getHours();
  const dayOfWeek = localTime.getDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6

  return (
    localHours < start ||
    localHours >= end ||
    dayOfWeek === 0 ||
    dayOfWeek === 6
  );
}

if (isOutsideBusinessHours()) {
  createWiselyDeskWidget(url.includes("en-us"));
  hideZendeskWidget("#zw-customLauncher");
}

function hideZendeskWidget(selector) {
  let attempts = 0;
  const maxAttempts = 50; // 10 seconds / 0.2 seconds per attempt

  const hideDivInterval = setInterval(function () {
    const div = document.querySelector(selector);
    if (div) {
      div.style.display = "none";
      clearInterval(hideDivInterval);
    } else if (attempts >= maxAttempts) {
      console.log("Missing div and max attempts reached.");
      clearInterval(hideDivInterval);
    }
    attempts++;
  }, 200);
}

function createWiselyDeskWidget(isEnglish) {
  // Determine the iframe URL based on the locale
  const iframeUrl = isEnglish
    ? "https://apps.wiselydesk.com/widget/2JcUUnHpgW5PAObuSmSGCsCRgW3Hhqg5yiznEZnAzzY"
    : "https://apps.wiselydesk.com/widget/hYn1picbsJfRm6vNUMOKv1ANYFSD4mZNTgsiw7LdHnE";
  const iframe = document.createElement("iframe");
  iframe.src = iframeUrl;
  iframe.style =
    "color-scheme: light; padding: 0px; width: 100%; height: 100%; position: fixed; bottom: 0px; overflow: visible; opacity: 1; border: 0px; transition-duration: 250ms; transition-timing-function: cubic-bezier(0.645, 0.045, 0.355, 1); transition-property: opacity, top, bottom; right: 0px;";
  document.body.appendChild(iframe);
}
