
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("accessibility-page").hidden = true;
  document.getElementById("first-scene").hidden = true;
  document.getElementById("second-scene").hidden = true;
  document.getElementById("first-scene-ending").hidden = true;
  document.getElementById("second-scene-ending").hidden = true;
  document.getElementById("third-scene").hidden = true;
  document.getElementById("third-scene-ending").hidden = true;
  document.getElementById("fourth-scene").hidden = true;
  document.getElementById("restart-button").hidden = true;

  console.log("Page loaded!");

  let currentAccessibilityLink = "";

  // state helpers
  const srStatus = document.getElementById("sr-status");
  const announce = (msg) => {
    if (!srStatus) return;
    srStatus.textContent = "";
    requestAnimationFrame(() => (srStatus.textContent = msg));
  };

  const setHiddenState = (id, hidden) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.hidden = hidden;
    el.setAttribute("aria-hidden", String(hidden));
    if (hidden) el.setAttribute("inert", "");
    else el.removeAttribute("inert");
  };

  const focusFirstControl = (containerId) => {
    const el = document.getElementById(containerId);
    if (!el) return;
    const target = el.querySelector(
      'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    (target || el).focus({ preventScroll: true });
  };

  // Initialise aria-hidden/inert to match current hidden flags
  [
    "home-page",
    "accessibility-page",
    "first-scene",
    "second-scene",
    "first-scene-ending",
    "second-scene-ending",
    "third-scene",
    "third-scene-ending",
    "fourth-scene",
  ].forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    setHiddenState(id, !!el.hidden);
  });

  // moving focus within button groups (arrow keys + home/end)
  const groups = document.querySelectorAll('[role="group"]');
  groups.forEach((group) => {
    const buttons = Array.from(group.querySelectorAll("button"));
    if (!buttons.length) return;

    buttons.forEach((btn, i) => (btn.tabIndex = i === 0 ? 0 : -1));

    const setActive = (idx) => {
      const clamped = Math.max(0, Math.min(idx, buttons.length - 1));
      buttons.forEach((b, i) => (b.tabIndex = i === clamped ? 0 : -1));
      buttons[clamped].focus();
    };

    group.addEventListener("keydown", (e) => {
      const currentIndex = buttons.findIndex((b) => b === document.activeElement);
      if (currentIndex < 0) return;

      switch (e.key) {
        case "ArrowDown":
        case "ArrowRight":
          e.preventDefault();
          setActive(currentIndex + 1);
          break;
        case "ArrowUp":
        case "ArrowLeft":
          e.preventDefault();
          setActive(currentIndex - 1);
          break;
        case "Home":
          e.preventDefault();
          setActive(0);
          break;
        case "End":
          e.preventDefault();
          setActive(buttons.length - 1);
          break;
      }
    });

    group.addEventListener("focusin", () => {
      const active = buttons.findIndex((b) => b.tabIndex === 0);
      if (active >= 0 && document.activeElement === group) setActive(active);
    });
  });

  // escape returns to home (when not on home)
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;

    const home = document.getElementById("home-page");
    if (!home || !home.hidden) return;

    e.preventDefault();
    setHiddenState("home-page", false);
    setHiddenState("accessibility-page", true);
    setHiddenState("first-scene", true);
    setHiddenState("second-scene", true);
    setHiddenState("first-scene-ending", true);
    setHiddenState("second-scene-ending", true);
    setHiddenState("third-scene", true);
    setHiddenState("third-scene-ending", true);
    setHiddenState("fourth-scene", true);
    document.getElementById("restart-button").hidden = true;

    announce("Returned to home.");
    focusFirstControl("home-page");
  });

  const ctaButton = document.getElementById("start-button");
  if (ctaButton) {
    ctaButton.addEventListener("click", function () {
      console.log("Journey began");
      setHiddenState("home-page", true);
      setHiddenState("accessibility-page", false);

      announce("Choose an accessibility option.");
      focusFirstControl("accessibility-page");
    });
  }

  const keyboardAccessibleBtn = document.getElementById("set-keyboard-accessible");
  if (keyboardAccessibleBtn) {
    keyboardAccessibleBtn.addEventListener("click", function () {
      console.log("Set normal keyboard accessibility");
      setHiddenState("accessibility-page", true);
      setHiddenState("first-scene", false);

      announce("Scene 1. Choose an option.");
      focusFirstControl("first-scene");
    });
  }

  const motionAccessibleBtn = document.getElementById("set-motion-accessible");
  if (motionAccessibleBtn) {
    motionAccessibleBtn.addEventListener("click", function () {
      console.log("Set motion accessibility");
      currentAccessibilityLink = ".../accessibility/motion";
      setHiddenState("accessibility-page", true);
      setHiddenState("first-scene", false);

      announce("Scene 1. Choose an option.");
      focusFirstControl("first-scene");
    });
  }

  const audioAccessibleBtn = document.getElementById("set-audio-accessible");
  if (audioAccessibleBtn) {
    audioAccessibleBtn.addEventListener("click", function () {
      console.log("Set audio accessibility");
      currentAccessibilityLink = ".../accessibility/audio";
      setHiddenState("accessibility-page", true);
      setHiddenState("first-scene", false);

      announce("Scene 1. Choose an option.");
      focusFirstControl("first-scene");
    });
  }

  const acceptSproutsBtn = document.getElementById("accept-new-sprouts");
  if (acceptSproutsBtn) {
    acceptSproutsBtn.addEventListener("click", function () {
      console.log("User selected option 1");
      setHiddenState("first-scene", true);
      setHiddenState("second-scene", false);

      announce("Scene 2. Choose an option.");
      focusFirstControl("second-scene");
    });
  }

  const rejectSproutsBtn = document.getElementById("reject-new-sprouts");
  if (rejectSproutsBtn) {
    rejectSproutsBtn.addEventListener("click", function () {
      console.log("User selected option 2");
      setHiddenState("first-scene", true);
      setHiddenState("first-scene-ending", false);
      document.getElementById("restart-button").hidden = false;

      announce("Ending reached. You can start again.");
      document.getElementById("restart-button").focus({ preventScroll: true });
    });
  }

  const acceptBugsBtn = document.getElementById("accept-new-bugs");
  if (acceptBugsBtn) {
    acceptBugsBtn.addEventListener("click", function () {
      console.log("User selected option 1");
      setHiddenState("second-scene", true);
      setHiddenState("third-scene", false);

      announce("Scene 3. Choose an option.");
      focusFirstControl("third-scene");
    });
  }

  const rejectBugsBtn = document.getElementById("reject-new-bugs");
  if (rejectBugsBtn) {
    rejectBugsBtn.addEventListener("click", function () {
      console.log("User selected option 2");
      setHiddenState("second-scene", true);
      setHiddenState("second-scene-ending", false);
      document.getElementById("restart-button").hidden = false;

      announce("Ending reached. You can start again.");
      document.getElementById("restart-button").focus({ preventScroll: true });
    });
  }

  const acceptFaunaBtn = document.getElementById("accept-fauna");
  if (acceptFaunaBtn) {
    acceptFaunaBtn.addEventListener("click", function () {
      console.log("User selected option 1");
      setHiddenState("third-scene", true);
      setHiddenState("fourth-scene", false);
      document.getElementById("restart-button").hidden = false;

      announce("Final scene. You can start again.");
      document.getElementById("restart-button").focus({ preventScroll: true });
    });
  }

  const rejectFaunaBtn = document.getElementById("reject-fauna");
  if (rejectFaunaBtn) {
    rejectFaunaBtn.addEventListener("click", function () {
      console.log("User selected option 2");
      setHiddenState("third-scene", true);
      setHiddenState("third-scene-ending", false);
      document.getElementById("restart-button").hidden = false;

      announce("Ending reached. You can start again.");
      document.getElementById("restart-button").focus({ preventScroll: true });
    });
  }

  const restartButton = document.getElementById("restart-button");
  if (restartButton) {
    restartButton.addEventListener("click", function () {
      console.log("Restart game");
      setHiddenState("home-page", false);
      setHiddenState("accessibility-page", true);
      setHiddenState("first-scene", true);
      setHiddenState("second-scene", true);
      setHiddenState("first-scene-ending", true);
      setHiddenState("second-scene-ending", true);
      setHiddenState("third-scene", true);
      setHiddenState("third-scene-ending", true);
      setHiddenState("fourth-scene", true);
      document.getElementById("restart-button").hidden = true;

      announce("Restarted.");
      focusFirstControl("home-page");
    });
  }
});



