const textContents = `You sprout.

Sprouted from the ground you are a sapling.

A sapling you are not meant to be.

You know, you are meant to grow.
`;

const option = `What will you do?`;

// Parameters are the target of where you want the scrolling text to go
// the text you want to scroll and the scroll speed.
function typeWriter(targetId, text, speed=60) {
// This loads in the main text block that you want to scroll through and clears it 
  const output = document.getElementById(targetId);
  output.textContent = '';
  
// This loads in the div that contains the buttons so they can be revealed
  const buttons = document.getElementById('buttonDiv');
  
// This loads the title which tells the user to pick an option
  const optionPrompt = document.getElementById('gameStateTitle');
  
  let i = 0;

  function type() {
    if (i < text.length) {
      output.textContent += text[i];
      i++;
      output.scrollTop = output.scrollHeight;
      setTimeout(type, 60);
    }
    // When all the text has been output reveals the users choices.
    else {
      setTimeout(options, 800)
    }
  }
  // function to reveal the choices, a .hide class is needed in CSS for this
  function options() {
    optionPrompt.classList.remove('hide');
    buttons.classList.remove('hide');

  }
  type();
}

typeWriter('gameStateText', textContents);

