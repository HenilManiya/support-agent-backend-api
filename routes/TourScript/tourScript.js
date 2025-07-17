(function () {
  const currentScript =
    document.currentScript || document.querySelector('script[src*="embed.js"]');
  const USER_ID = currentScript?.getAttribute("data-api-key");

    const API_ENDPOINT = `https://support-agent-backend-api.onrender.com`;

  const styleContent = `#tourPreviewBtn {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: #667eea;
  color: white;
  padding: 12px 12px;
  border-radius: 50%;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  cursor: pointer;
  z-index: 1000000;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}
#tourPreviewBtn:hover { background: #5a6fd8; }
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
  background: rgba(255,255,255,0.2);
  color: white;
  border: 1px solid rgba(255,255,255,0.3);
  padding: 8px 16px;
  margin: 5px 5px 0 0;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
}
.tour-popup button:hover { background: rgba(255,255,255,0.3); }
.tour-popup button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.selector-highlight {
  border: 2px solid #ff6b6b !important;
  border-radius: 6px !important;
  padding: 6px !important;
  background: rgba(255,107,107,0.1) !important;
  box-shadow: 0 0 20px rgba(255,107,107,0.3) !important;
  z-index: 1000001 !important;
}

.tour-popup .popup-arrow {
  position: absolute; width: 0; height: 0;
}
.tour-popup.arrow-top .popup-arrow {
  bottom: -10px; left: calc(50% - 10px);
  border-left:10px solid transparent;
  border-right:10px solid transparent;
  border-top:10px solid #667eea;
}
.tour-popup.arrow-bottom .popup-arrow {
  top: -10px; left: calc(50% - 10px);
  border-left:10px solid transparent;
  border-right:10px solid transparent;
  border-bottom:10px solid #667eea;
}
.tour-popup.arrow-left .popup-arrow {
  right: -10px; top: calc(50% - 10px);
  border-top:10px solid transparent;
  border-bottom:10px solid transparent;
  border-left:10px solid #667eea;
}
.tour-popup.arrow-right .popup-arrow {
  left: -10px; top: calc(50% - 10px);
  border-top:10px solid transparent;
  border-bottom:10px solid transparent;
  border-right:10px solid #667eea;
}
.tour-popup-selector {
  position: fixed;
  bottom: 75px;
  right: 20px;
  z-index: 1000002;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 10px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  max-width: 300px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  display: flex;
  flex-direction: column;
  gap: 10px
}

.tour-popup-selector button {
  background: rgba(255,255,255,0.2);
  color: white;
  border: 1px solid rgba(255,255,255,0.3);
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
}
.tour-popup-selector button:hover { background: rgba(255,255,255,0.3); }
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
  let allTours = [];
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

  async function fetchAllTours() {
    try {
      const res = await fetch(
        `${API_ENDPOINT}/api/tour-details-script?url=${encodeURIComponent(
          window.location.hostname
        )}&createdBy=${USER_ID}`
      );
      const data = await res.json();
      return data.data || [];
    } catch (err) {
      alert("Failed to fetch tours: " + err.message);
      return [];
    }
  }

  async function fetchStepsForTour(tourId) {
    try {
      const res = await fetch(
        `${API_ENDPOINT}/api/tour-steps?tourId=${tourId}`
      );
      const data = await res.json();
      return data.steps || [];
    } catch (err) {
      alert("Error loading tour steps: " + err.message);
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
    popup.querySelector("#closeTourBtn").addEventListener("click", removePopup);
  }
  function showTourSelector(tours) {
    const popup = document.createElement("div");
    popup.className = "tour-popup-selector";
    // popup.innerHTML = `<div style="margin-bottom:10px">Select a tour:</div>`;

    tours.forEach((tour, i) => {
      const btn = document.createElement("button");
      btn.textContent =
        `${tour.name} ${tour?.steps?.length}` || `Tour ${i + 1}`;
      btn.addEventListener("click", async () => {
        const steps = await fetchStepsForTour(tour?._id);
        if (steps?.length > 0) {
          document.body.removeChild(popup);
          tourSteps = steps || [];
          showTourStep(0);
        } else {
          alert("No steps found for selected tour.");
          return;
        }
      });
      popup.appendChild(btn);
    });
    document.body.appendChild(popup);
    return popup; // ✅ Return the popup so it can be removed later
  }
  // Inject Start button
  document.addEventListener("DOMContentLoaded", async () => {
    const styleEl = document.createElement("style");
    styleEl.textContent = styleContent;
    document.head.appendChild(styleEl);
    const btn = document.createElement("button");
    btn.id = "tourPreviewBtn";
    btn.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 4H20V16H5.17L4 17.17V4Z" stroke="white" stroke-width="2"/>
    </svg>
  `;
    document.body.appendChild(btn);
    let popup = null;
    allTours = await fetchAllTours();

    btn.addEventListener("click", () => {
      if (popup) {
        popup.remove();
        popup = null;
      } else {
        if (!allTours.length) {
          alert("No tours found.");
          return;
        }
        popup = showTourSelector(allTours); // now this assigns the actual popup element
      }
    });
  });
})();
