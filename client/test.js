document.addEventListener("DOMContentLoaded", function () {
  console.log("Page loaded!");

  let currentScene = "home";
  let motionProcessing = false;
  let audioEnabled = false;
  let audioRestartTimes = null;
  let ws = null;
  let recognition = null;

  const srStatus = document.getElementById("sr-status");

  function announce(msg) {
    if (!srStatus) return;
    srStatus.textContent = "";
    requestAnimationFrame(() => (srStatus.textContent = msg));
  }

  function setSceneA11yState(el, isHidden) {
    if (!el) return;
    el.hidden = isHidden;
    el.setAttribute("aria-hidden", String(isHidden));

    // Prevent keyboard focus from escaping into hidden content
    if (isHidden) el.setAttribute("inert", "");
    else el.removeAttribute("inert");
  }

  function focusFirstControl(sceneEl) {
    if (!sceneEl) return;
    const target = sceneEl.querySelector(
      'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    (target || sceneEl).focus({ preventScroll: true });
  }

  function typeWriter(element, speed = 40) {
    const fullText = element.textContent;
    element.textContent = "";
    let i = 0;

    function type() {
      if (i < fullText.length) {
        element.textContent += fullText[i];
        i++;
        setTimeout(type, speed);
      }
    }
    type();
  }

  function goToScene(sceneId) {
    const scenes = [
      "home-page",
      "accessibility-page",
      "first-scene",
      "first-scene-ending",
      "second-scene",
      "second-scene-ending",
      "third-scene",
      "third-scene-ending",
      "fourth-scene",
    ];

    scenes.forEach((id) => {
      const el = document.getElementById(id);
      setSceneA11yState(el, id !== sceneId);
    });

    document.getElementById("restart-button").hidden =
      sceneId !== "first-scene-ending" &&
      sceneId !== "second-scene-ending" &&
      sceneId !== "third-scene-ending" &&
      sceneId !== "fourth-scene";

    currentScene = sceneId;

    const activeScene = document.getElementById(sceneId);
    if (!activeScene) return;

    const storyBits = activeScene.querySelectorAll(".gameStateText");
    storyBits.forEach((el) => typeWriter(el));

    // Focus management + announcement
    const sceneTitle = (() => {
      switch (sceneId) {
        case "home-page":
          return "Home.";
        case "accessibility-page":
          return "Accessibility options.";
        case "first-scene":
          return "Scene 1.";
        case "second-scene":
          return "Scene 2.";
        case "third-scene":
          return "Scene 3.";
        case "fourth-scene":
          return "Final scene.";
        default:
          return "Scene changed.";
      }
    })();

    announce(sceneTitle);
    focusFirstControl(activeScene);

    // If an ending is shown, prefer focusing restart explicitly
    if (
      sceneId === "first-scene-ending" ||
      sceneId === "second-scene-ending" ||
      sceneId === "third-scene-ending" ||
      sceneId === "fourth-scene"
    ) {
      const restart = document.getElementById("restart-button");
      if (restart && !restart.hidden) restart.focus({ preventScroll: true });
    }
  }

  function handleMotionSelection(selection) {
    if (motionProcessing) return;
    motionProcessing = true;

    setTimeout(() => {
      switch (currentScene) {
        case "first-scene":
          selection === "LEFT"
            ? goToScene("second-scene")
            : goToScene("first-scene-ending");
          break;
        case "second-scene":
          selection === "LEFT"
            ? goToScene("third-scene")
            : goToScene("second-scene-ending");
          break;
        case "third-scene":
          selection === "LEFT"
            ? goToScene("fourth-scene")
            : goToScene("third-scene-ending");
          break;
      }

      setTimeout(() => (motionProcessing = false), 3000);
    }, 2000);
  }

  function handleChoice(choice) {
    if (motionProcessing) return;
    motionProcessing = true;

    setTimeout(() => {
      switch (currentScene) {
        case "first-scene":
          choice === "ACCEPT"
            ? goToScene("second-scene")
            : goToScene("first-scene-ending");
          break;
        case "second-scene":
          choice === "ACCEPT"
            ? goToScene("third-scene")
            : goToScene("second-scene-ending");
          break;
        case "third-scene":
          choice === "ACCEPT"
            ? goToScene("fourth-scene")
            : goToScene("third-scene-ending");
          break;
      }

      setTimeout(() => (motionProcessing = false), 2000);
    }, 500);
  }

  // Moving focus in button sets (arrow keys + home/end)
  const groups = document.querySelectorAll('[role="group"]');
  groups.forEach((group) => {
    const buttons = Array.from(group.querySelectorAll("button"));
    if (!buttons.length) return;

    buttons.forEach((btn, i) => (btn.tabIndex = i === 0 ? 0 : -1));

    function setActive(idx) {
      const clamped = Math.max(0, Math.min(idx, buttons.length - 1));
      buttons.forEach((b, i) => (b.tabIndex = i === clamped ? 0 : -1));
      buttons[clamped].focus({ preventScroll: true });
    }

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

  // Escape returns to home and cleans up modes
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;

    const homeEl = document.getElementById("home-page");
    if (!homeEl || homeEl.hidden === false) return;

    e.preventDefault();

    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.close();
      ws = null;
    }

    if (recognition) {
      recognition.stop();
      recognition = null;
      console.log("Speech recognition stopped");
    }

    goToScene("home-page");
  });

  document.getElementById("start-button")?.addEventListener("click", () => {
    console.log("Journey began");
    goToScene("accessibility-page");
  });

  document
    .getElementById("set-keyboard-accessible")
    ?.addEventListener("click", () => {
      console.log("Set keyboard accessibility");
      goToScene("first-scene");
    });

  document
    .getElementById("set-motion-accessible")
    ?.addEventListener("click", () => {
      console.log("Set motion accessibility");
      goToScene("first-scene");

      ws = new WebSocket("ws://localhost:6789");
      ws.onopen = () => console.log("Connected to head motion server");
      ws.onclose = () => console.log("Head motion server disconnected");
      ws.onerror = (err) => console.error("WebSocket error:", err);

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        handleMotionSelection(data.selection);
      };
    });

  document
    .getElementById("set-audio-accessible")
    ?.addEventListener("click", () => {
      console.log("Set audio accessibility");

      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      if (!SpeechRecognition) {
        alert("Speech recognition not supported in this browser.");
        return;
      }
      
      if (recognition) {
        console.log("Speech recognition already initialised");
        audioEnabled = true;
        try {
          recognition.start()
        } catch(_) {}
        goToScene("first-scene")
        return;
      }

      recognition = new SpeechRecognition();
      recognition.lang = "en-UK";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      audioEnabled = true;

      recognition.onstart = () => {
        console.log("Speech recognition started")
      }

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase().trim();

        console.log("Heard:", transcript);

        if (transcript.includes("accept") || transcript.includes("except")) {
          handleChoice("ACCEPT");
        } else if (transcript.includes("reject")) {
          handleChoice("REJECT");
        } else if (transcript.includes("start")) {
          goToScene("first-scene");
        } else if (
          transcript.includes("restart") ||
          transcript.includes("go back")
        ) {
          goToScene("home-page");
        }
      };

      recognition.onerror = (event) => {
        console.error("Speech error:", event.error);

        if (event.error === "not-allowed" || event.error === "service-not-allowed") {
          audioEnabled = false;
          try {
            recognition.stop();
          } catch (_) {}
          recognition = null;
          alert("Microphone permission was blocked. Please allow it an try again.");
        }
      };

      recognition.onend = () => {
        if (recognition) recognition.start();

        clearTimeout(audioRestartTimer);
        audioRestartTimer = setTimeout(() => {
        if (audioEnabled || !recognition) return;
        try {
          recognition.start()
        } catch (_) {          
        }
        }, 400);
      };

      recognition.start();
      goToScene("first-scene");
    });

  document
    .getElementById("accept-new-sprouts")
    ?.addEventListener("click", () => handleChoice("ACCEPT"));
  document
    .getElementById("reject-new-sprouts")
    ?.addEventListener("click", () => handleChoice("REJECT"));
  document
    .getElementById("accept-new-bugs")
    ?.addEventListener("click", () => handleChoice("ACCEPT"));
  document
    .getElementById("reject-new-bugs")
    ?.addEventListener("click", () => handleChoice("REJECT"));
  document
    .getElementById("accept-fauna")
    ?.addEventListener("click", () => handleChoice("ACCEPT"));
  document
    .getElementById("reject-fauna")
    ?.addEventListener("click", () => handleChoice("REJECT"));

  document.getElementById("restart-button")?.addEventListener("click", () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.close();
      ws = null;
    }

    if (recognition) {
      recognition.stop();
      recognition = null;
      console.log("Speech recognition stopped");
    }

    goToScene("home-page");
  });

  goToScene("home-page");
});



