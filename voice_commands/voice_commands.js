 
// <body>
//   <button onclick="startListening()">Start Listening</button>
//   <!-- div shows the results of what the user says and stores into in a variable called results -->
//   <div id="result">Speak your choice...</div> 
//   <script>
 
 //     JavaScript
        const resultDiv = document.getElementById('result');
        // Checks if browser supports SpeechRecognition API
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
        resultDiv.textContent = "Speech recognition not supported on your browser.";
        } else {
        // Creates the speech recognition instance
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-UK';
        // interimResults = false means we only want final results not live updates
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        // Event contains all the spoken results for when speech is recognized
        recognition.onresult = (event) => {
            // Get the transcript of what was said
            const transcript = event.results[0][0].transcript.toLowerCase().trim();
            resultDiv.textContent = `You said: "${transcript}"`;
            // Voice commands
            if (transcript.includes("accept") || transcript.includes("except")) {
            // Change dom element here as per accept command
            // command placeholder
            } else if (transcript.includes("reject")) {
            // Change dom element here as per reject command
            // command placeholder
            } else if (transcript.includes("go back")) {
            // Change dom element here as per reject command
            // command placeholder
            } else if (transcript.includes("start")) {
            // Change dom element here as per reject command
            // command placeholder
            }
        };
        recognition.onerror = (event) => {
            resultDiv.textContent = 'Error: ' + event.error;
        };
        function startListening() {
            resultDiv.textContent = "Listening...";
            recognition.start();
        }
        window.startListening = startListening;
        }