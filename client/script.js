// Custom JavaScript: This is where you add interactivity to your website

// This event listener waits for the entire HTML page to load before running any code
document.addEventListener("DOMContentLoaded", function () {
  console.log("Page loaded!");

  // We find the button using its unique ID from the HTML
  const ctaButton = document.getElementById("cta-button");
  const homePage = document.getElementById("homePage");
  const mainPage = document.getElementById("mainPage");

  // Check if the button exists on the page before adding an event listener
  if (ctaButton) {
    // This function runs whenever the button is clicked
    ctaButton.addEventListener("click", function () {
//      console.log("CTA button clicked");
//      alert("Welcome! This is your starting point.");
      var userName = getUserName();
      changePageView();
    });
  }
  function changePageView() {
    homePage.classList.add("hide")
    mainPage.classList.remove("hide")
  }
  function getUserName() {
    var userName = document.getElementById("userName").value;
    console.log("User name: userName");
    return userName;
  }
  const gameStateTitle = document.getElementById("gameStateTitle");
  const gameStateText = document.getElementById("gameStateText");
  const buttons = document.getElementById("buttons")

  function optionOne() {
    buttons.classList.add("hide")
    gameStateTitle.textContent = "You chose kindness";
    gameStateText.textContent =
    "Your kindness changes the situation for the better.";
  }
  function optionTwo() {
    buttons.classList.add("hide")
    gameStateTitle.textContent = "You chose to be Neutral";
    gameStateText.textContent =
    "Your Neutralness doesn't change the situation.";
  }
  function optionThree() {
    buttons.classList.add("hide")
    gameStateTitle.textContent = "You chose to be mean";
    gameStateText.textContent =
    "Your changed the situation for the worse.";
  }
});