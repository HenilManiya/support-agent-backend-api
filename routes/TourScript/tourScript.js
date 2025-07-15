(function () {
  const currentScript =
    document.currentScript || document.querySelector('script[src*="embed.js"]');
  const USER_ID = currentScript?.getAttribute("data-api-key");

  const API_ENDPOINT = `${process.env.SERVER_API}/api/tour-steps`;

  const styleContent = `#tourPreviewBtn {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: #667eea;
  color: white;
  padding: 12px 20px;
  border-radius: 8px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  z-index: 1000000;
}
#tourPreviewBtn:hover {
  background: #5a6fd8;
}

.tour-popup {
  position: absolute;
  z-index: 1000002;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 15px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  max-width: 300px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  pointer-events: auto;
}
.tour-popup button {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 8px 16px;
  margin: 5px 5px 0 0;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
}
.tour-popup button:hover {
  background: rgba(255, 255, 255, 0.3);
}
.tour-popup button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.selector-highlight {
  border: 2px solid #ff6b6b !important;
  border-radius: 6px !important;
  padding: 6px !important;
  background: rgba(255, 107, 107, 0.1) !important;
  box-shadow: 0 0 20px rgba(255, 107, 107, 0.3) !important;
  z-index: 1000001 !important;
}

.tour-popup .popup-arrow {
  position: absolute;
  width: 0;
  height: 0;
}

.tour-popup.arrow-top .popup-arrow {
  bottom: -10px;
  left: calc(50% - 10px);
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-top: 10px solid #667eea;
}
.tour-popup.arrow-bottom .popup-arrow {
  top: -10px;
  left: calc(50% - 10px);
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 10px solid #667eea;
}
.tour-popup.arrow-left .popup-arrow {
  right: -10px;
  top: calc(50% - 10px);
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;
  border-left: 10px solid #667eea;
}
.tour-popup.arrow-right .popup-arrow {
  left: -10px;
  top: calc(50% - 10px);
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;
  border-right: 10px solid #667eea;
}
`;

  const normalizeHTML = (html) =>
    html
      .replace(/\\s+/g, " ")
      .replace(/"\\s+/g, '"')
      .replace(/\\s+"/g, '"')
      .replace(/>\\s+</g, "><")
      .trim()
      .toLowerCase();

  const normalizeURL = (url) => {
    try {
      const u = new URL(url);
      return u.origin + u.pathname;
    } catch {
      return url;
    }
  };

  let tourSteps = [];
  let currentStepIndex = 0;
  let highlightedElement = null;

  function removePopup() {
    document.querySelectorAll(".tour-popup").forEach((el) => el.remove());
    if (highlightedElement) {
      highlightedElement.classList.remove("selector-highlight");
      highlightedElement = null;
    }
  }

  async function fetchTour() {
    try {
      const res = await fetch(
        `${API_ENDPOINT}?url=${encodeURIComponent(
          window.location.origin
        )}&tourId=${USER_ID}`
      );
      if (!res.ok) throw new Error("Failed to fetch tour data");
      const data = await res.json();
      return data.steps || [];
    } catch (err) {
      alert("Error loading tour data: " + err.message);
      return [];
    }
  }

  function showTourStep(index) {
    removePopup();

    if (index < 0 || index >= tourSteps.length) return;
    currentStepIndex = index;
    const step = tourSteps[index];

    if (normalizeURL(step.url) !== normalizeURL(window.location.href)) {
      sessionStorage.setItem("tourSteps", JSON.stringify(tourSteps));
      sessionStorage.setItem("tourStepIndex", index);
      window.location.href = step.url;
      return;
    }

    const targetHTML = normalizeHTML(step.outerHTML);
    let targetEl = null;

    document.querySelectorAll("*").forEach((el) => {
      if (!targetEl && normalizeHTML(el.outerHTML) === targetHTML) {
        targetEl = el;
      }
    });

    if (!targetEl) {
      alert("Element for step not found.");
      return;
    }

    highlightedElement = targetEl;
    highlightedElement.classList.add("selector-highlight");
    highlightedElement.scrollIntoView({ behavior: "smooth", block: "center" });

    setTimeout(() => {
      renderPopupAtElement(highlightedElement, step, index);
    }, 400);
  }

  function renderPopupAtElement(el, step, index) {
    const rect = el.getBoundingClientRect();
    const popup = document.createElement("div");
    popup.className = "tour-popup";
    popup.style.visibility = "hidden";
    popup.innerHTML = `
      <div style="margin-bottom: 15px; font-size: 14px;">${step.message}</div>
      <div style="font-size: 12px; opacity: 0.8; margin-bottom: 10px;">Step ${
        index + 1
      } of ${tourSteps.length}</div>
      <div>
        <button id="prevStepBtn" ${
          index === 0 ? "disabled" : ""
        }>← Previous</button>
        <button id="nextStepBtn" ${
          index === tourSteps.length - 1 ? "disabled" : ""
        }>Next →</button>
        <button id="closeTourBtn">Close</button>
      </div>
      <div class="popup-arrow"></div>
    `;

    document.body.appendChild(popup);
    const popupRect = popup.getBoundingClientRect();
    const vw = window.innerWidth,
      vh = window.innerHeight;

    const space = {
      top: rect.top,
      bottom: vh - rect.bottom,
      left: rect.left,
      right: vw - rect.right,
    };

    let top = 0,
      left = 0,
      position = "top";

    if (space.top > popupRect.height + 20) {
      top = rect.top + window.scrollY - popupRect.height - 10;
      left = rect.left + window.scrollX + rect.width / 2 - popupRect.width / 2;
      position = "top";
    } else if (space.bottom > popupRect.height + 20) {
      top = rect.bottom + window.scrollY + 10;
      left = rect.left + window.scrollX + rect.width / 2 - popupRect.width / 2;
      position = "bottom";
    } else if (space.right > popupRect.width + 20) {
      top = rect.top + window.scrollY + rect.height / 2 - popupRect.height / 2;
      left = rect.right + window.scrollX + 10;
      position = "right";
    } else if (space.left > popupRect.width + 20) {
      top = rect.top + window.scrollY + rect.height / 2 - popupRect.height / 2;
      left = rect.left + window.scrollX - popupRect.width - 10;
      position = "left";
    }

    popup.style.top = `${top}px`;
    popup.style.left = `${left}px`;
    popup.classList.add(`arrow-${position}`);
    popup.style.visibility = "visible";

    popup.querySelector("#prevStepBtn").addEventListener("click", () => {
      if (currentStepIndex > 0) showTourStep(currentStepIndex - 1);
    });
    popup.querySelector("#nextStepBtn").addEventListener("click", () => {
      if (currentStepIndex < tourSteps.length - 1)
        showTourStep(currentStepIndex + 1);
    });
    popup.querySelector("#closeTourBtn").addEventListener("click", () => {
      removePopup();
    });
  }

  // Resume tour after redirect only AFTER DOM loaded & small delay
  window.addEventListener("DOMContentLoaded", () => {
    const savedSteps = sessionStorage.getItem("tourSteps");
    const savedIndex = sessionStorage.getItem("tourStepIndex");
    if (savedSteps && savedIndex !== null) {
      try {
        const parsed = JSON.parse(savedSteps);
        const index = parseInt(savedIndex);
        const step = parsed[index];

        if (normalizeURL(step.url) === normalizeURL(window.location.href)) {
          tourSteps = parsed;
          currentStepIndex = index;

          setTimeout(() => {
            showTourStep(currentStepIndex);
            sessionStorage.removeItem("tourSteps");
            sessionStorage.removeItem("tourStepIndex");
          }, 300);
        }
      } catch (e) {
        console.warn("Error resuming tour:", e);
      }
    }
  });

  // Create preview button and attach click event
  document.addEventListener("DOMContentLoaded", () => {
    const styleEl = document.createElement("style");
    styleEl.textContent = styleContent;
    document.head.appendChild(styleEl);
    const previewBtn = document.createElement("button");
    previewBtn.id = "tourPreviewBtn";
    previewBtn.textContent = "Start";
    document.body.appendChild(previewBtn);

    previewBtn.addEventListener("click", async () => {
      if (tourSteps.length === 0) {
        previewBtn.textContent = "Loading...";
        tourSteps = await fetchTour();
        console.log(tourSteps, "tourStepstourSteps");
        if (tourSteps.length === 0) {
          alert("No saved tours found for this user.");
          previewBtn.textContent = "Start";
          return;
        }
        previewBtn.textContent = "Start";
      }
      showTourStep(0);
    });
  });
})();
