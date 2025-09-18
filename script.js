const micBtn = document.querySelector(".recordimg");
const inputBox = document.getElementById("ASK");

// Speech Recognition (browser side)
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = "en-US";
recognition.interimResults = false;

// Mic button → start recording
micBtn.addEventListener("click", () => {
  recognition.start();
  micBtn.classList.add("listening");
});

// When voice recognized
recognition.addEventListener("result", (e) => {
  const transcript = e.results[0][0].transcript;
  inputBox.value = transcript;
  sendToAssistant(transcript);
});

// Stop mic glow
recognition.addEventListener("end", () => {
  micBtn.classList.remove("listening");
});

// Enter key → send query
inputBox.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const query = inputBox.value.trim();
    if (query) {
      sendToAssistant(query);
    }
  }
});

// Send query to Flask backend
async function sendToAssistant(query) {
  try {
    const res = await fetch("http://127.0.0.1:5000/assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query })
    });

    const data = await res.json();
    console.log("AI Response:", data.response);

    // Show response on page
    alert("🤖 " + data.response);

  } catch (err) {
    console.error("Error talking to backend:", err);
    alert("⚠️ Could not connect to AI assistant.");
  }
}
