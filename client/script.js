document.addEventListener("DOMContentLoaded", function () {
  let currentScene = "home";
  let motionProcessing = false;
  let recognition = null;

  let typewriterGeneration = 0;

  function typeWriter(element, speed = 40) {
    const text = element.dataset.fullText || element.textContent;
    element.dataset.fullText = text;
    element.textContent = "";
    const gen = ++typewriterGeneration;
    let i = 0;

    function tick() {
      if (gen !== typewriterGeneration) return;
      if (i < text.length) {
        element.textContent += text[i++];
        setTimeout(tick, speed);
      }
    }
    tick();
  }

  function goToScene(sceneId) {
    typewriterGeneration++;

    const scenes = [
      "home-page",
      "accessibility-page",
      "first-scene",
      "first-scene-ending",
      "second-scene",
      "second-scene-ending",
      "third-scene",
      "third-scene-ending",
      "fourth-scene"
    ];

    scenes.forEach((id) => {
      document.getElementById(id).hidden = id !== sceneId;
    });

    document.getElementById("restart-button").hidden =
      sceneId !== "first-scene-ending" &&
      sceneId !== "second-scene-ending" &&
      sceneId !== "third-scene-ending" &&
      sceneId !== "fourth-scene";

    currentScene = sceneId;

    const active = document.getElementById(sceneId);
    if (!active) return;

    active
      .querySelectorAll(".gameStateText")
      .forEach((el) => typeWriter(el, 40));
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

  let cameraStream = null;
  let lastDirection = "CENTER";
  let dwellStart = null;
  let inputLocked = false;

  const DWELL_TIME = 2000;
  const COOLDOWN_TIME = 5000;

  function getHeadDirection(landmarks) {
    const nose = landmarks[1];
    const left = landmarks[234];
    const right = landmarks[454];
    const center = (left.x + right.x) / 2;
    const offset = nose.x - center;
    if (offset > 0.03) return "RIGHT";
    if (offset < -0.03) return "LEFT";
    return "CENTER";
  }

  function startMotion() {
    const video = document.getElementById("camera");

    const faceMesh = new FaceMesh({
      locateFile: (f) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${f}`
    });

    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.6,
      minTrackingConfidence: 0.6
    });

    faceMesh.onResults((results) => {
      if (inputLocked || !results.multiFaceLandmarks?.length) return;

      const dir = getHeadDirection(results.multiFaceLandmarks[0]);
      const now = performance.now();

      if (dir === "CENTER") {
        lastDirection = "CENTER";
        dwellStart = null;
        return;
      }

      if (dir !== lastDirection) {
        lastDirection = dir;
        dwellStart = now;
        return;
      }

      if (dwellStart && now - dwellStart >= DWELL_TIME) {
        inputLocked = true;
        handleChoice(dir === "LEFT" ? "ACCEPT" : "REJECT");
        lastDirection = "CENTER";
        dwellStart = null;
        setTimeout(() => (inputLocked = false), COOLDOWN_TIME);
      }
    });

    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      cameraStream = stream;
      video.srcObject = stream;

      const camera = new Camera(video, {
        onFrame: async () => {
          await faceMesh.send({ image: video });
        },
        width: 640,
        height: 480
      });

      camera.start();
    });
  }

  function stopMotion() {
    if (cameraStream) {
      cameraStream.getTracks().forEach((t) => t.stop());
      cameraStream = null;
    }
    inputLocked = false;
    lastDirection = "CENTER";
    dwellStart = null;
  }

  document.getElementById("start-button")?.addEventListener("click", () => {
    goToScene("accessibility-page");
  });

  document
    .getElementById("set-keyboard-accessible")
    ?.addEventListener("click", () => {
      goToScene("first-scene");
    });

  document
    .getElementById("set-motion-accessible")
    ?.addEventListener("click", () => {
      goToScene("first-scene");
      startMotion();
    });

  document
    .getElementById("set-audio-accessible")
    ?.addEventListener("click", () => {
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SR) return;

      recognition = new SR();
      recognition.lang = "en-UK";
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event) => {
        const t = event.results[0][0].transcript.toLowerCase();
        if (t.includes("accept")) handleChoice("ACCEPT");
        if (t.includes("reject")) handleChoice("REJECT");
      };

      recognition.onend = () => {
        if (recognition) recognition.start();
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
    stopMotion();
    if (recognition) recognition.stop();
    recognition = null;
    goToScene("home-page");
  });

  goToScene("home-page");
});
