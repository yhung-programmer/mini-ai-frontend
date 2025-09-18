const inputText = document.getElementById("inputText");
const translateBtn = document.getElementById("translateBtn");
const resultP = document.getElementById("results");
const recordBtn = document.getElementById("recordBtn");
const languageSelect = document.getElementById("language");

// 🎤 Browser speech recognition
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = "en-US";
recognition.interimResults = false;

// Mic button → speech to text
recordBtn.addEventListener("click", () => {
  recognition.start();
});

recognition.addEventListener("result", (e) => {
  const transcript = e.results[0][0].transcript;
  inputText.value = transcript;
});

recognition.addEventListener("end", () => {
  console.log("Stopped listening");
});

// 🌍 Translate on click
translateBtn.addEventListener("click", async () => {
  const text = inputText.value.trim();
  const lang = languageSelect.value;

  if (!text) {
    resultP.innerText = "⚠️ Enter some text or record first.";
    return;
  }

  try {
    const res = await fetch("https://mini-ai-backend-1.onrender.com/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, target_lang: lang }),
    });

    const data = await res.json();

    if (data.translated) {
      resultP.innerText = data.translated;
    } else {
      resultP.innerText = "⚠️ " + data.error;
    }
  } catch (err) {
    resultP.innerText = "⚠️ Could not connect to translation server.";
  }
});
