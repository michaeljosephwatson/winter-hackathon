// Custom JavaScript: This is where you add interactivity to your website

document.addEventListener("DOMContentLoaded", function () {
  console.log("Page loaded!");

  let currentScene = "home";
  let motionProcessing = false;
  let ws = null;
  let recognition = null;

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

    const activeScene = document.getElementById(sceneId);
    if (!activeScene) return;

    const storyBits = activeScene.querySelectorAll(".gameStateText");
    storyBits.forEach((el) => typeWriter(el));
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

      recognition = new SpeechRecognition();
      recognition.lang = "en-UK";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

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

      recognition.onerror = (event) =>
        console.error("Speech error:", event.error);

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
