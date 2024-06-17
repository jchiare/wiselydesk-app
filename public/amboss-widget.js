const url = window.location.href;
let wiselyDeskWidgetOpen = false;

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

function createIFrame(isEnglish, wiselyDeskWidgetOpen) {
  let container = document.getElementById("wiselyDeskContainer");
  // Check if the container exists; if not, create it
  if (!container) {
    container = document.createElement("div");
    container.id = "wiselyDeskContainer";
    container.style = `position: fixed; bottom: 0; right: 0; overflow: hidden; max-height: 800px; transition-duration: 250ms; transition-timing-function: cubic-bezier(0.645, 0.045, 0.355, 1);`;
    document.body.appendChild(container);
  }

  // Adjust container size based on the widget state
  if (window.outerWidth < 600) {
    container.style.width = wiselyDeskWidgetOpen ? "100vw" : "60px";
  } else {
    container.style.width = wiselyDeskWidgetOpen ? "620px" : "60px";
    container.style.right = "1.25rem";
  }

  container.style.height = "calc(100% - 85px)";

  // Always remove the existing iframe and create a new one
  const existingIframe = document.getElementById("wiselyDeskIframe");
  if (!existingIframe && wiselyDeskWidgetOpen) {
    // Create a new iframe
    const host = url.includes("localhost:3000")
      ? "http://localhost:3000"
      : "https://apps.wiselydesk.com";
    const iframeUrl = isEnglish
      ? `${host}/widget/2JcUUnHpgW5PAObuSmSGCsCRgW3Hhqg5yiznEZnAzzY?widgetOpen=${wiselyDeskWidgetOpen}`
      : `${host}/widget/hYn1picbsJfRm6vNUMOKv1ANYFSD4mZNTgsiw7LdHnE?widgetOpen=${wiselyDeskWidgetOpen}&locale=de`;
    const iframe = document.createElement("iframe");
    iframe.id = "wiselyDeskIframe";
    iframe.src = iframeUrl;
    iframe.style = `width: 100%; height: 100%; border: 0; opacity: 1; transition: all 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);`;

    // Append the new iframe to the container
    container.appendChild(iframe);
  } else if (existingIframe && !wiselyDeskWidgetOpen) {
    // Update the existing iframe
    existingIframe.style.display = "none";
  } else if (existingIframe && wiselyDeskWidgetOpen) {
    // Update the existing iframe
    existingIframe.style.display = "block";
  }
}

function createSupportWidgetButton(wiselyDeskWidgetOpen) {
  const widgetContainer = document.createElement("div");
  widgetContainer.innerHTML = `
    <div style="position: fixed; bottom: 12px; right: 12px; height: 60px; width: 60px; transform-origin: center; user-select: none; transition: transform 0.1s ease-in; cursor: pointer;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
      <div style="position: absolute; top: 0; left: 0; height: 58px; width: 58px; overflow: hidden; border-radius: 50%;">
        <button onclick="handleWidgetClick()" aria-label="Open support widget" style="height: 100%; width: 100%; background: none; border: none; padding: 0;">
          <div style="position: absolute; top: 0; bottom: 0; cursor: pointer; width: 100%; display: flex; align-items: center; justify-content: center; background-color: #0AA6B8;">
            ${
              wiselyDeskWidgetOpen
                ? `
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23 23" style="transform: scale(1); transition: transform 0.2s;">
                <path d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Z" fill="#0AA6B8"/>
                <path d="M10.28 9.22a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z" fill="white"/>
              </svg>`
                : `
              <svg width="38" height="32" viewBox="2 0 32 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.89605 14.6795L6.33126 16.303C6.71766 16.5615 6.94979 16.9965 6.94979 17.4594V24.4092C6.94979 25.1764 7.57388 25.7991 8.33974 25.7991H27.7991C28.5664 25.7991 29.1891 25.1764 29.1891 24.4092V4.94978C29.1891 4.18391 28.5664 3.55982 27.7991 3.55982H8.33974C7.57388 3.55982 6.94979 4.18391 6.94979 4.94978V11.8996C6.94979 12.3638 6.71766 12.7975 6.33126 13.056L3.89605 14.6795ZM27.7991 28.5791H8.33974C6.04075 28.5791 4.16987 26.7096 4.16987 24.4092V18.2044L0.619921 15.8359C0.232123 15.5774 0 15.1437 0 14.6795C0 14.2152 0.232123 13.7816 0.619921 13.523L4.16987 11.1559V4.94978C4.16987 2.65079 6.04075 0.779907 8.33974 0.779907H27.7991C30.0995 0.779907 31.969 2.65079 31.969 4.94978V24.4092C31.969 26.7096 30.0995 28.5791 27.7991 28.5791Z" fill="white"/>
                <circle cx="12" cy="15" r="2" fill="white"/>
                <circle cx="18" cy="15" r="2" fill="white"/>
                <circle cx="24" cy="15" r="2" fill="white"/>
              </svg>`
            }
          </div>
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(widgetContainer);
}

function handleWidgetClick() {
  // Toggle the widget open state
  wiselyDeskWidgetOpen = !wiselyDeskWidgetOpen;
  // Update both widgets with the new state
  createIFrame(url.includes("en-us"), wiselyDeskWidgetOpen);
  createSupportWidgetButton(wiselyDeskWidgetOpen);
}

if (
  window.location.href.includes("wiselydeskTesting") ||
  isOutsideBusinessHours()
) {
  const isEnglish = url.includes("en-us");
  createIFrame(isEnglish, wiselyDeskWidgetOpen);
  hideZendeskWidget("#zw-customLauncher");
  createSupportWidgetButton(wiselyDeskWidgetOpen);
}
