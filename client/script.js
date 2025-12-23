// Custom JavaScript: This is where you add interactivity to your website

// This event listener waits for the entire HTML page to load before running any code
document.addEventListener("DOMContentLoaded", function () {
  // Hide all other sections
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

  let currentAccessiblityLink = "";

  const ctaButton = document.getElementById("start-button");
  if (ctaButton) {
    ctaButton.addEventListener("click", function () {
      console.log("Journey began");
      document.getElementById("home-page").hidden = true;
      document.getElementById("accessibility-page").hidden = false;
    });
  }

  const keyboardAccessibleBtn = document.getElementById(
    "set-keyboard-accessible"
  );
  if (keyboardAccessibleBtn) {
    keyboardAccessibleBtn.addEventListener("click", function () {
      console.log("Set normal keyboard accessibility");
      document.getElementById("accessibility-page").hidden = true;
      document.getElementById("first-scene").hidden = false;
    });
  }
  const motionAccessibleBtn = document.getElementById("set-motion-accessible");
  if (motionAccessibleBtn) {
    motionAccessibleBtn.addEventListener("click", function () {
      console.log("Set motion accessibility");
      currentAccessibilityLink = ".../accessibility/motion";
      document.getElementById("accessibility-page").hidden = true;
      document.getElementById("first-scene").hidden = false;
    });
  }

  const audioAccessibleBtn = document.getElementById("set-audio-accessible");
  if (audioAccessibleBtn) {
    audioAccessibleBtn.addEventListener("click", function () {
      console.log("Set audio accessibility");
      currentAccessibilityLink = ".../accessibility/audio";
      document.getElementById("accessibility-page").hidden = true;
      document.getElementById("first-scene").hidden = false;
    });
  }

  const acceptSproutsBtn = document.getElementById("accept-new-sprouts");
  if (acceptSproutsBtn) {
    acceptSproutsBtn.addEventListener("click", function () {
      console.log("User selected option 1");
      document.getElementById("first-scene").hidden = true;
      document.getElementById("second-scene").hidden = false;
    });
  }

  const rejectSproutsBtn = document.getElementById("reject-new-sprouts");
  if (rejectSproutsBtn) {
    rejectSproutsBtn.addEventListener("click", function () {
      console.log("User selected option 2");
      document.getElementById("first-scene").hidden = true;
      document.getElementById("first-scene-ending").hidden = false;
      document.getElementById("restart-button").hidden = false;
    });
  }

  const acceptBugsBtn = document.getElementById("accept-new-bugs");
  if (acceptBugsBtn) {
    acceptBugsBtn.addEventListener("click", function () {
      console.log("User selected option 1");
      document.getElementById("second-scene").hidden = true;
      document.getElementById("third-scene").hidden = false;
    });
  }

  const rejectBugsBtn = document.getElementById("reject-new-bugs");
  if (rejectBugsBtn) {
    rejectBugsBtn.addEventListener("click", function () {
      console.log("User selected option 2");
      document.getElementById("second-scene").hidden = true;
      document.getElementById("second-scene-ending").hidden = false;
      document.getElementById("restart-button").hidden = false;
    });
  }

  const acceptFaunaBtn = document.getElementById("accept-fauna");
  if (acceptFaunaBtn) {
    acceptFaunaBtn.addEventListener("click", function () {
      console.log("User selected option 1");
      document.getElementById("third-scene").hidden = true;
      document.getElementById("fourth-scene").hidden = false;
      document.getElementById("restart-button").hidden = false;
    });
  }

  const rejectFaunaBtn = document.getElementById("reject-fauna");
  if (rejectFaunaBtn) {
    rejectFaunaBtn.addEventListener("click", function () {
      console.log("User selected option 2");
      document.getElementById("third-scene").hidden = true;
      document.getElementById("third-scene-ending").hidden = false;
      document.getElementById("restart-button").hidden = false;
    });
  }

  const restartButton = document.getElementById("restart-button");
  if (restartButton) {
    restartButton.addEventListener("click", function () {
      console.log("Restart game");
      document.getElementById("home-page").hidden = false;
      document.getElementById("accessibility-page").hidden = true;
      document.getElementById("first-scene").hidden = true;
      document.getElementById("second-scene").hidden = true;
      document.getElementById("first-scene-ending").hidden = true;
      document.getElementById("second-scene-ending").hidden = true;
      document.getElementById("third-scene").hidden = true;
      document.getElementById("third-scene-ending").hidden = true;
      document.getElementById("fourth-scene").hidden = true;
      document.getElementById("restart-button").hidden = true;
    });
  }
});
